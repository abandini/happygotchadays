import { describe, expect, it, vi } from 'vitest';
import {
  MAX_EMAILS_PER_RUN,
  buildReminderEmail,
  dueReminderFor,
  easternDateISO,
  escapeHtml,
  runReminderEmails,
  unsubscribeToken,
  verifyUnsubscribeToken,
  yearsPhrase,
} from '../../src/utils/reminder-emails.js';
import { redactLogLine, unsubscribeRoutes } from '../../src/routes/unsubscribe.js';

const SECRET = 'test-jwt-secret';
// 2026-10-31 13:00 UTC = 9am EDT; Eastern date 2026-10-31. Catch-up window: Oct 29-31.
const NOW = new Date('2026-10-31T13:00:00Z');
const minutesAfter = (d, m) => new Date(d.getTime() + m * 60000);
const LOG_LINE = /^reminders: sent=\d+ skipped_opt_out=\d+ released_4xx=\d+ kept_5xx=\d+ gave_up=\d+ errors=\d+ capped=\d+$/;

// ------------------------------------------------------------------ fakes

/**
 * In-memory D1 stand-in that understands the queries this feature issues.
 * `hooks.onQuery(q, args, state)` runs before each query (may throw or mutate state).
 */
function makeDb({ users = [], pets = [] } = {}, events = [], hooks = {}) {
  const state = {
    users: users.map((u) => ({ reminder_emails_off: 0, ...u })),
    pets: pets.map((p) => ({ ...p })),
    sends: new Map(), // "pet|year|kind" -> { status, attempts, claimed_at, updated_at }
  };
  const userById = (id) => state.users.find((u) => u.id === id);
  const k = (petId, year, kind) => `${petId}|${year}|${kind}`;

  function runQuery(sql, args) {
    const q = sql.replace(/\s+/g, ' ').trim();
    hooks.onQuery?.(q, args, state);
    if (q.startsWith('SELECT p.id, p.name, p.gotcha_date')) {
      const days = new Set(args);
      return {
        results: state.pets
          .filter((p) => p.gotcha_date && days.has(p.gotcha_date.slice(5)))
          .map((p) => {
            const u = userById(p.user_id);
            return { ...p, email: u.email, reminder_emails_off: u.reminder_emails_off };
          }),
      };
    }
    if (q.startsWith('INSERT OR IGNORE INTO reminder_sends')) {
      const [petId, year, kind, payload, claimedAt, updatedAt] = args;
      const key = k(petId, year, kind);
      if (state.sends.has(key)) return { meta: { changes: 0 } };
      events.push(`claim:${key}`);
      state.sends.set(key, { status: 'pending', attempts: 1, ambiguous: 0, payload, claimed_at: claimedAt, updated_at: updatedAt });
      return { meta: { changes: 1 } };
    }
    if (q.startsWith('SELECT status, attempts, ambiguous, payload, claimed_at, updated_at FROM reminder_sends')) {
      const row = state.sends.get(k(...args));
      return row ? { ...row } : null;
    }
    if (q.startsWith('UPDATE reminder_sends SET attempts = attempts + 1, ambiguous = 1')) {
      const [updatedAt, petId, year, kind, expectedAttempts] = args;
      const key = k(petId, year, kind);
      const row = state.sends.get(key);
      if (!row || row.status !== 'pending' || row.attempts !== expectedAttempts) return { meta: { changes: 0 } };
      row.attempts++;
      row.ambiguous = 1;
      row.updated_at = updatedAt;
      events.push(`reclaim:${key}:${row.attempts}`);
      return { meta: { changes: 1 } };
    }
    if (q.startsWith('UPDATE reminder_sends SET status = ?, updated_at = ?')) {
      const [status, updatedAt, petId, year, kind] = args;
      const key = k(petId, year, kind);
      const row = state.sends.get(key);
      if (!row || row.status !== 'pending') return { meta: { changes: 0 } };
      row.status = status;
      row.updated_at = updatedAt;
      events.push(`mark_${status}:${key}`);
      return { meta: { changes: 1 } };
    }
    if (q.startsWith('UPDATE reminder_sends SET ambiguous = 1, updated_at = ?')) {
      const [updatedAt, petId, year, kind] = args;
      const row = state.sends.get(k(petId, year, kind));
      if (row) { row.ambiguous = 1; row.updated_at = updatedAt; }
      return { meta: { changes: row ? 1 : 0 } };
    }
    if (q.startsWith('DELETE FROM reminder_sends')) {
      const key = k(...args);
      const row = state.sends.get(key);
      if (!row || row.attempts !== 1 || row.ambiguous !== 0) return { meta: { changes: 0 } };
      state.sends.delete(key);
      events.push(`release:${key}`);
      return { meta: { changes: 1 } };
    }
    if (q.startsWith('SELECT email, reminder_emails_off FROM users WHERE id = ?')) {
      const u = userById(args[0]);
      events.push(`optout_check:${args[0]}`);
      return u ? { email: u.email, reminder_emails_off: u.reminder_emails_off } : null;
    }
    if (q.startsWith('UPDATE users SET reminder_emails_off = 1 WHERE id = ?')) {
      const u = userById(args[0]);
      if (u) u.reminder_emails_off = 1;
      return { meta: { changes: u ? 1 : 0 } };
    }
    throw new Error(`fake DB: unexpected SQL: ${q}`);
  }

  return {
    state,
    prepare(sql) {
      let args = [];
      const stmt = {
        bind(...a) { args = a; return stmt; },
        async all() { return runQuery(sql, args); },
        async first() { return runQuery(sql, args); },
        async run() { return runQuery(sql, args); },
      };
      return stmt;
    },
  };
}

/** Fake fetch returning queued responses (default 200); records each call. */
function makeFetch(events = [], responses = []) {
  const calls = [];
  const fn = vi.fn(async (url, init) => {
    const body = JSON.parse(init.body);
    calls.push({ url, init, body });
    events.push(`send:${init.headers['Idempotency-Key']}`);
    const next = responses.shift() ?? { status: 200 };
    if (next.throw) throw new Error('network down');
    return new Response(JSON.stringify({ id: 'x' }), { status: next.status });
  });
  fn.calls = calls;
  fn.keys = () => calls.map((c) => c.init.headers['Idempotency-Key']);
  return fn;
}

function env(db, extra = {}) {
  return { DB: db, RESEND_API_KEY: 're_test', JWT_SECRET: SECRET, ...extra };
}

const run = (e, opts = {}) => runReminderEmails(e, { now: NOW, sendGapMs: 0, log: () => {}, ...opts });

const baseUsers = [
  { id: 'u1', email: 'one@example.com' },
  { id: 'u2', email: 'two@example.com' },
];
const rex = [{ id: 'p1', user_id: 'u1', name: 'Rex', gotcha_date: '2021-10-31' }];

// ------------------------------------------------------------------ selection

describe('date selection and catch-up window', () => {
  it('uses the US Eastern date (an early-UTC instant is still the previous day in Ohio)', () => {
    expect(easternDateISO(new Date('2026-11-01T02:00:00Z'))).toBe('2026-10-31');
    expect(easternDateISO(NOW)).toBe('2026-10-31');
  });

  it('picks pets whose week_before or day_of send date is today, and only those inside the window', async () => {
    const db = makeDb({
      users: baseUsers,
      pets: [
        { id: 'today', user_id: 'u1', name: 'Biscuit', gotcha_date: '2023-10-31' }, // day_of today
        { id: 'week', user_id: 'u2', name: 'Mochi', gotcha_date: '2020-11-07' }, // week_before today
        { id: 'future-send', user_id: 'u1', name: 'Later', gotcha_date: '2020-11-08' }, // week_before tomorrow
        { id: 'old-dayof', user_id: 'u1', name: 'Old', gotcha_date: '2020-10-28' }, // day_of 3 days ago: outside window
        { id: 'old-week', user_id: 'u1', name: 'OldWeek', gotcha_date: '2020-11-04' }, // week_before 3 days ago
        { id: 'newbie', user_id: 'u1', name: 'Newbie', gotcha_date: '2026-10-31' }, // adopted today: no anniversary yet
      ],
    });
    const fetchImpl = makeFetch();
    const res = await run(env(db), { fetchImpl });

    expect(res.counts.sent).toBe(2);
    expect(fetchImpl.keys().sort()).toEqual(['hgd-today-2026-day_of', 'hgd-week-2026-week_before']);

    const today = fetchImpl.calls.find((c) => c.body.subject.includes('Biscuit')).body;
    expect(today.to).toEqual(['one@example.com']);
    expect(today.subject).toBe('Happy gotcha day, Biscuit! 3 years together');
    const week = fetchImpl.calls.find((c) => c.body.subject.includes('Mochi')).body;
    expect(week.subject).toBe("Mochi's gotcha day is in 7 days (6 years together)");

    const call = fetchImpl.calls[0];
    expect(call.url).toBe('https://api.resend.com/emails');
    expect(call.init.method).toBe('POST');
    expect(call.init.headers.Authorization).toBe('Bearer re_test');
    expect(call.body.from).toBe('HappyGotchaDays <reminders@mail.happygotchadays.com>');
    expect(call.body.headers['List-Unsubscribe-Post']).toBe('List-Unsubscribe=One-Click');
    expect(call.body.headers['List-Unsubscribe']).toMatch(/^<https:\/\/happygotchadays\.com\/unsubscribe\?u=u[12]&t=[A-Za-z0-9_-]+>$/);
  });

  it('catches up send dates the cron missed (up to 2 days back)', async () => {
    const db = makeDb({
      users: baseUsers,
      pets: [
        { id: 'missed-week', user_id: 'u1', name: 'Pip', gotcha_date: '2022-11-06' }, // week_before was Oct 30
        { id: 'missed-dayof', user_id: 'u2', name: 'Juno', gotcha_date: '2022-10-29' }, // day_of was Oct 29
      ],
    });
    const fetchImpl = makeFetch();
    const res = await run(env(db), { fetchImpl });
    expect(res.counts.sent).toBe(2);
    expect(fetchImpl.keys().sort()).toEqual(['hgd-missed-dayof-2026-day_of', 'hgd-missed-week-2026-week_before']);
    const pip = fetchImpl.calls.find((c) => c.body.subject.includes('Pip')).body;
    expect(pip.subject).toBe("Pip's gotcha day is in 6 days (4 years together)");
    const juno = fetchImpl.calls.find((c) => c.body.subject.includes('Juno')).body;
    expect(juno.subject).toBe('Happy gotcha day, Juno! 4 years together');
    expect(juno.text).toContain("Juno's gotcha day was on Thursday, October 29: 4 years together.");

    // Already delivered: the next day's run (still inside Juno's window) sends nothing.
    await run(env(db), { fetchImpl, now: new Date('2026-11-01T13:00:00Z') });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });
});

// ------------------------------------------------------------------ delivery state

describe('claim, dedupe, release, retry', () => {
  it('a second run does not send again', async () => {
    const db = makeDb({ users: baseUsers, pets: rex });
    const fetchImpl = makeFetch();
    await run(env(db), { fetchImpl });
    const second = await run(env(db), { fetchImpl, now: minutesAfter(NOW, 30) });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(second.counts.already_done).toBe(1);
    expect(second.counts.sent).toBe(0);
  });

  it('claims (pending) before sending, rechecks opt-out, then marks sent', async () => {
    const events = [];
    const db = makeDb({ users: baseUsers, pets: rex }, events);
    const statusAtSend = [];
    const fetchImpl = makeFetch(events);
    const wrapped = async (...a) => { statusAtSend.push(db.state.sends.get('p1|2026|day_of')?.status); return fetchImpl(...a); };
    await run(env(db), { fetchImpl: wrapped });
    expect(events).toEqual([
      'claim:p1|2026|day_of',
      'optout_check:u1',
      'send:hgd-p1-2026-day_of',
      'mark_sent:p1|2026|day_of',
    ]);
    expect(statusAtSend).toEqual(['pending']);
    expect(db.state.sends.get('p1|2026|day_of').status).toBe('sent');
  });

  it('a definite 4xx (incl. 429) deletes the claim and the next run retries', async () => {
    for (const status of [422, 429]) {
      const events = [];
      const db = makeDb({ users: baseUsers, pets: rex }, events);
      const fetchImpl = makeFetch(events, [{ status }]);
      const res = await run(env(db), { fetchImpl });
      expect(res.counts.released_4xx).toBe(1);
      expect(events.slice(-1)).toEqual(['release:p1|2026|day_of']);
      expect(db.state.sends.size).toBe(0);

      const next = await run(env(db), { fetchImpl, now: minutesAfter(NOW, 30) });
      expect(next.counts.sent).toBe(1);
      expect(fetchImpl.keys()).toEqual(['hgd-p1-2026-day_of', 'hgd-p1-2026-day_of']);
    }
  });

  it('a 5xx or network error leaves the row pending', async () => {
    for (const response of [{ status: 503 }, { throw: true }]) {
      const db = makeDb({ users: baseUsers, pets: rex });
      const res = await run(env(db), { fetchImpl: makeFetch([], [response]) });
      expect(res.counts.kept_5xx).toBe(1);
      expect(db.state.sends.get('p1|2026|day_of')).toMatchObject({ status: 'pending', attempts: 1, ambiguous: 1 });
    }
  });

  it('retries a stale pending row with the same Idempotency-Key, and gives up after 3 attempts', async () => {
    const events = [];
    const db = makeDb({ users: baseUsers, pets: rex }, events);
    const fetchImpl = makeFetch(events, [{ status: 500 }, { status: 502 }, { throw: true }]);

    await run(env(db), { fetchImpl }); // attempt 1 fails
    const fresh = await run(env(db), { fetchImpl, now: minutesAfter(NOW, 5) }); // not stale yet
    expect(fresh.counts.in_flight).toBe(1);
    expect(fetchImpl).toHaveBeenCalledTimes(1);

    await run(env(db), { fetchImpl, now: minutesAfter(NOW, 30) }); // attempt 2 fails
    await run(env(db), { fetchImpl, now: minutesAfter(NOW, 60) }); // attempt 3 fails
    expect(fetchImpl.keys()).toEqual(['hgd-p1-2026-day_of', 'hgd-p1-2026-day_of', 'hgd-p1-2026-day_of']);
    expect(events).toContain('reclaim:p1|2026|day_of:2');
    expect(events).toContain('reclaim:p1|2026|day_of:3');

    const logs = [];
    const last = await run(env(db), { fetchImpl, now: minutesAfter(NOW, 90), log: (m) => logs.push(m) });
    expect(fetchImpl).toHaveBeenCalledTimes(3);
    expect(last.counts.gave_up).toBe(1);
    expect(logs).toEqual(['reminders: sent=0 skipped_opt_out=0 released_4xx=0 kept_5xx=0 gave_up=1 errors=0 capped=0']);
    expect(db.state.sends.get('p1|2026|day_of')).toMatchObject({ status: 'gave_up', attempts: 3, ambiguous: 1 });

    // Terminal: later runs inside the window never touch it again.
    const later = await run(env(db), { fetchImpl, now: new Date('2026-11-01T13:00:00Z') });
    expect(later.counts.already_done).toBe(1);
    expect(fetchImpl).toHaveBeenCalledTimes(3);
  });

  it('a stale pending retry that then succeeds is marked sent', async () => {
    const db = makeDb({ users: baseUsers, pets: rex });
    const fetchImpl = makeFetch([], [{ status: 503 }]);
    await run(env(db), { fetchImpl });
    const res = await run(env(db), { fetchImpl, now: minutesAfter(NOW, 30) });
    expect(res.counts.sent).toBe(1);
    expect(db.state.sends.get('p1|2026|day_of')).toMatchObject({ status: 'sent', attempts: 2 });
  });

  it('does not retry a pending claim older than the 24h idempotency window', async () => {
    const db = makeDb({ users: baseUsers, pets: [{ id: 'p1', user_id: 'u1', name: 'Rex', gotcha_date: '2021-10-30' }] });
    const fetchImpl = makeFetch([], [{ status: 503 }]);
    await run(env(db), { fetchImpl, now: new Date('2026-10-30T13:00:00Z') });
    const next = await run(env(db), { fetchImpl, now: new Date('2026-10-31T13:00:00Z') });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(next.counts.gave_up).toBe(1);
    expect(db.state.sends.get('p1|2026|day_of').status).toBe('gave_up');
  });
});

describe('round 2 regressions: ledger is never lost after an ambiguous attempt', () => {
  const KEY = 'p1|2026|day_of';

  it('accepted-but-response-lost, then a 429 retry, then catch-up after 23h: no duplicate, status gave_up', async () => {
    const delivered = [];
    // Attempt 1: Resend accepts the email but the response is lost (network error after accept).
    const fetchImpl = makeFetch([], [{ throw: true }, { status: 429 }]);
    const recording = async (url, init) => {
      const r = fetchImpl(url, init);
      if (fetchImpl.mock.calls.length === 1) delivered.push(init.headers['Idempotency-Key']);
      return r;
    };
    const db = makeDb({ users: baseUsers, pets: rex });

    await run(env(db), { fetchImpl: recording });
    expect(db.state.sends.get(KEY)).toMatchObject({ status: 'pending', attempts: 1, ambiguous: 1 });
    const claimedAt = db.state.sends.get(KEY).claimed_at;

    const retry = await run(env(db), { fetchImpl: recording, now: minutesAfter(NOW, 30) }); // 429
    expect(retry.counts.gave_up).toBe(1);
    expect(retry.counts.released_4xx).toBe(0);
    expect(db.state.sends.get(KEY)).toMatchObject({ status: 'gave_up', attempts: 2, ambiguous: 1, claimed_at: claimedAt });

    // Next day, still inside the catch-up window and past the 23h guard: nothing is re-claimed.
    const nextDay = await run(env(db), { fetchImpl: recording, now: new Date('2026-11-01T13:00:00Z') });
    expect(nextDay.counts.already_done).toBe(1);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(delivered).toEqual(['hgd-p1-2026-day_of']); // exactly one accepted email
    expect(fetchImpl.calls[1].init.body).toBe(fetchImpl.calls[0].init.body);
    expect(db.state.sends.get(KEY).status).toBe('gave_up');
  });

  it('a pending ambiguous row past the 23h guard becomes gave_up without sending', async () => {
    const db = makeDb({ users: baseUsers, pets: [{ id: 'p1', user_id: 'u1', name: 'Rex', gotcha_date: '2021-10-30' }] });
    const fetchImpl = makeFetch([], [{ status: 503 }]);
    await run(env(db), { fetchImpl, now: new Date('2026-10-30T13:00:00Z') });
    await run(env(db), { fetchImpl, now: new Date('2026-10-31T13:00:00Z') });
    await run(env(db), { fetchImpl, now: new Date('2026-11-01T13:00:00Z') });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(db.state.sends.get('p1|2026|day_of')).toMatchObject({ status: 'gave_up', attempts: 1 });
  });

  it('ambiguous send, then the pet is renamed and the email changed: nothing changed is sent, ledger kept', async () => {
    const db = makeDb({ users: baseUsers, pets: rex });
    const fetchImpl = makeFetch([], [{ status: 502 }]);
    await run(env(db), { fetchImpl });
    const original = db.state.sends.get(KEY).payload;

    db.state.pets[0].name = 'Rexy';
    db.state.users[0].email = 'new-address@example.com';
    const res = await run(env(db), { fetchImpl, now: minutesAfter(NOW, 30) });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(res.counts.gave_up).toBe(1);
    const row = db.state.sends.get(KEY);
    expect(row).toMatchObject({ status: 'gave_up', ambiguous: 1 });
    expect(row.payload).toBe(original);
    expect(JSON.parse(row.payload).to).toEqual(['one@example.com']);
  });

  it('ambiguous send, then only the pet is renamed: the retry sends the stored payload byte-for-byte', async () => {
    const db = makeDb({ users: baseUsers, pets: rex });
    const fetchImpl = makeFetch([], [{ status: 500 }, { status: 200 }]);
    await run(env(db), { fetchImpl });
    db.state.pets[0].name = 'Rexy';
    await run(env(db), { fetchImpl, now: minutesAfter(NOW, 30) });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(fetchImpl.calls[1].init.body).toBe(fetchImpl.calls[0].init.body);
    expect(fetchImpl.calls[1].body.subject).toBe('Happy gotcha day, Rex! 5 years together');
    expect(fetchImpl.keys()).toEqual(['hgd-p1-2026-day_of', 'hgd-p1-2026-day_of']);
    expect(db.state.sends.get(KEY)).toMatchObject({ status: 'sent', attempts: 2 });
  });

  it('ambiguous send, user opts out before the next run: no retry, ledger kept', async () => {
    const db = makeDb({ users: baseUsers, pets: rex });
    const fetchImpl = makeFetch([], [{ status: 500 }]);
    await run(env(db), { fetchImpl });
    db.state.users[0].reminder_emails_off = 1;
    const res = await run(env(db), { fetchImpl, now: minutesAfter(NOW, 30) });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(res.counts.skipped_opt_out).toBe(1);
    expect(db.state.sends.get(KEY)).toMatchObject({ attempts: 1, ambiguous: 1 });
  });

  it('ambiguous send then opt-out right before the retry: gave_up, skipped_opt_out, ledger kept', async () => {
    const db = makeDb({ users: baseUsers, pets: rex }, [], {
      onQuery(q, args, state) {
        if (q.startsWith('UPDATE reminder_sends SET attempts = attempts + 1')) state.users[0].reminder_emails_off = 1;
      },
    });
    const fetchImpl = makeFetch([], [{ status: 500 }]);
    await run(env(db), { fetchImpl });
    const res = await run(env(db), { fetchImpl, now: minutesAfter(NOW, 30) });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(res.counts.skipped_opt_out).toBe(1);
    expect(db.state.sends.get(KEY)).toMatchObject({ status: 'gave_up', attempts: 2, ambiguous: 1 });
  });

  it('repeated 4xx after an ambiguous attempt: attempts stay bounded and claimed_at is unchanged', async () => {
    const db = makeDb({ users: baseUsers, pets: rex });
    const fetchImpl = makeFetch([], [{ status: 500 }, ...Array(20).fill({ status: 429 })]);
    await run(env(db), { fetchImpl });
    const claimedAt = db.state.sends.get(KEY).claimed_at;
    for (let m = 30; m <= 3 * 24 * 60; m += 30) {
      await run(env(db), { fetchImpl, now: minutesAfter(NOW, m) });
    }
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(db.state.sends.get(KEY)).toMatchObject({ status: 'gave_up', attempts: 2, claimed_at: claimedAt });
  });

  it('repeated clean 4xx never grows attempts past 1 and is bounded by the catch-up window', async () => {
    const db = makeDb({ users: baseUsers, pets: rex });
    const fetchImpl = makeFetch([], Array(200).fill({ status: 422 }));
    const runs = [];
    for (let m = 0; m <= 4 * 24 * 60; m += 30) runs.push(minutesAfter(NOW, m));
    for (const now of runs) await run(env(db), { fetchImpl, now });
    // The day_of send date (Oct 31) stays in the window through Nov 2 (Eastern); each run makes one clean attempt.
    const inWindow = runs.filter((d) => easternDateISO(d) <= '2026-11-02').length;
    expect(fetchImpl).toHaveBeenCalledTimes(inWindow);
    expect(db.state.sends.size).toBe(0); // only clean first attempts were ever deleted
  });

  it('409 (idempotency conflict) leads to gave_up even on a clean first attempt', async () => {
    const db = makeDb({ users: baseUsers, pets: rex });
    const fetchImpl = makeFetch([], [{ status: 409 }]);
    const res = await run(env(db), { fetchImpl });
    expect(res.counts.gave_up).toBe(1);
    expect(res.counts.released_4xx).toBe(0);
    expect(db.state.sends.get(KEY)).toMatchObject({ status: 'gave_up', attempts: 1 });
    await run(env(db), { fetchImpl, now: minutesAfter(NOW, 30) });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('the stored payload is the exact request body', async () => {
    const db = makeDb({ users: baseUsers, pets: rex });
    const fetchImpl = makeFetch();
    await run(env(db), { fetchImpl });
    const body = JSON.parse(db.state.sends.get(KEY).payload);
    expect(db.state.sends.get(KEY).payload).toBe(fetchImpl.calls[0].init.body);
    expect(Object.keys(body)).toEqual(['from', 'to', 'subject', 'html', 'text', 'headers']);
  });
});

// ------------------------------------------------------------------ opt-out, cap, errors, logs

describe('opt-out, cap, isolation, logging', () => {
  it('skips users with reminder_emails_off = 1 without claiming', async () => {
    const db = makeDb({ users: [{ id: 'u1', email: 'one@example.com', reminder_emails_off: 1 }], pets: rex });
    const fetchImpl = makeFetch();
    const res = await run(env(db), { fetchImpl });
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(res.counts.skipped_opt_out).toBe(1);
    expect(db.state.sends.size).toBe(0);
  });

  it('re-reads the opt-out right before sending (unsubscribed mid-run)', async () => {
    const db = makeDb({ users: baseUsers, pets: rex }, [], {
      onQuery(q, args, state) {
        if (q.startsWith('INSERT OR IGNORE INTO reminder_sends')) state.users[0].reminder_emails_off = 1;
      },
    });
    const fetchImpl = makeFetch();
    const res = await run(env(db), { fetchImpl });
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(res.counts.skipped_opt_out).toBe(1);
    expect(db.state.sends.size).toBe(0); // claim released
  });

  it('caps a run; items over the cap stay unclaimed and go out on the next run', async () => {
    expect(MAX_EMAILS_PER_RUN).toBe(500);
    const pets = Array.from({ length: 5 }, (_, i) => ({ id: `p${i}`, user_id: 'u1', name: `Pet${i}`, gotcha_date: '2020-10-31' }));
    const db = makeDb({ users: baseUsers, pets });
    const fetchImpl = makeFetch();
    const res = await run(env(db), { fetchImpl, maxEmails: 3 });
    expect(fetchImpl).toHaveBeenCalledTimes(3);
    expect(res.counts.capped).toBe(2);
    expect(db.state.sends.size).toBe(3);

    const next = await run(env(db), { fetchImpl, maxEmails: 3, now: minutesAfter(NOW, 30) });
    expect(next.counts.sent).toBe(2);
    expect(fetchImpl).toHaveBeenCalledTimes(5);
  });

  it('one failing item does not abort the run', async () => {
    const db = makeDb({
      users: baseUsers,
      pets: [
        { id: 'bad', user_id: 'u1', name: 'Bad', gotcha_date: '2021-10-31' },
        { id: 'good', user_id: 'u2', name: 'Good', gotcha_date: '2021-10-31' },
      ],
    }, [], {
      onQuery(q, args) {
        if (q.startsWith('INSERT OR IGNORE INTO reminder_sends') && args[0] === 'bad') throw new Error('D1 hiccup for one@example.com');
      },
    });
    const fetchImpl = makeFetch();
    const logs = [];
    const res = await run(env(db), { fetchImpl, log: (m) => logs.push(m) });
    expect(res.counts.errors).toBe(1);
    expect(res.counts.sent).toBe(1);
    expect(fetchImpl.keys()).toEqual(['hgd-good-2026-day_of']);
    expect(logs).toHaveLength(1);
    expect(logs[0]).toMatch(LOG_LINE);
    expect(logs[0]).not.toContain('@');
    expect(logs[0]).not.toContain('hiccup');
  });

  it('no-key mode logs one line and sends nothing', async () => {
    const db = makeDb({ users: baseUsers, pets: rex });
    const fetchImpl = makeFetch();
    const logs = [];
    const res = await run(env(db, { RESEND_API_KEY: undefined }), { fetchImpl, log: (m) => logs.push(m) });
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(logs).toEqual(['reminders: RESEND_API_KEY not set']);
    expect(res.skipped).toBe('no_api_key');
    expect(db.state.sends.size).toBe(0);
  });
});

// ------------------------------------------------------------------ content and year counts

describe('email content', () => {
  it('escapes the pet name in HTML and uses the plain site link text', async () => {
    const db = makeDb({ users: baseUsers, pets: [{ id: 'p1', user_id: 'u1', name: '<b>Rex</b>', gotcha_date: '2021-10-31' }] });
    const fetchImpl = makeFetch();
    await run(env(db), { fetchImpl });
    const { html, text } = fetchImpl.calls[0].body;
    expect(html).not.toContain('<b>Rex</b>');
    expect(html).toContain('&lt;b&gt;Rex&lt;/b&gt;');
    expect(html).toContain('>Open HappyGotchaDays</a>');
    expect(text).toContain('Open HappyGotchaDays: https://happygotchadays.com/');
    expect(html).toContain('https://www.aspca.org/news/fun-ways-safely-celebrate-your-pets-birthday');
    expect(html).toContain('https://happygotchadays.com/what-is-gotcha-day');
    expect(text).toContain("You're getting this because you added <b>Rex</b>'s gotcha day on HappyGotchaDays.");
    expect(text).toContain('HappyGotchaDays, Solon, Ohio');
    expect(escapeHtml(`"'&`)).toBe('&quot;&#39;&amp;');
  });

  it('escapes the unsubscribe URL in the HTML footer', () => {
    const email = buildReminderEmail({
      petName: 'Rex', daysUntil: 0, anniversaryISO: '2026-10-31', yearsTogether: 1, unsubscribeUrl: 'https://happygotchadays.com/unsubscribe?u=a&t=b',
    });
    expect(email.subject).toBe('Happy gotcha day, Rex! 1 year together');
    expect(email.html).toContain('href="https://happygotchadays.com/unsubscribe?u=a&amp;t=b"');
  });
});

describe('year count (target anniversary year minus adoption year)', () => {
  it('first anniversary: week_before and day_of both say "1 year together"', async () => {
    expect(yearsPhrase(1)).toBe('1 year together');
    expect(yearsPhrase(3)).toBe('3 years together');
    expect(dueReminderFor('2025-11-07', '2026-10-31')).toMatchObject({ kind: 'week_before', year: 2026, yearsTogether: 1 });
    expect(dueReminderFor('2025-10-31', '2026-10-31')).toMatchObject({ kind: 'day_of', year: 2026, yearsTogether: 1 });

    const db = makeDb({ users: baseUsers, pets: [{ id: 'p1', user_id: 'u1', name: 'Rex', gotcha_date: '2025-11-07' }] });
    const fetchImpl = makeFetch();
    await run(env(db), { fetchImpl });
    expect(fetchImpl.calls[0].body.subject).toBe("Rex's gotcha day is in 7 days (1 year together)");
  });

  it('Dec 28 gotcha date: week_before on Dec 21, day_of on Dec 28', () => {
    expect(dueReminderFor('2020-12-28', '2026-12-21')).toMatchObject({ kind: 'week_before', anniversaryISO: '2026-12-28', year: 2026, yearsTogether: 6 });
    expect(dueReminderFor('2020-12-28', '2026-12-28')).toMatchObject({ kind: 'day_of', year: 2026, yearsTogether: 6 });
    expect(dueReminderFor('2025-12-28', '2026-12-21')).toMatchObject({ kind: 'week_before', yearsTogether: 1 });
  });

  it('week_before falling in the prior calendar year counts toward the next year (Jan 3 gotcha, sent Dec 27)', () => {
    expect(dueReminderFor('2020-01-03', '2025-12-27')).toMatchObject({ kind: 'week_before', anniversaryISO: '2026-01-03', year: 2026, yearsTogether: 6 });
    expect(dueReminderFor('2025-01-03', '2025-12-27')).toMatchObject({ kind: 'week_before', year: 2026, yearsTogether: 1 });
  });

  it('a future adoption date sends nothing', async () => {
    expect(dueReminderFor('2026-11-07', '2026-10-31')).toBeNull(); // later this year
    expect(dueReminderFor('2027-01-03', '2026-12-27')).toBeNull(); // next year
    expect(dueReminderFor('2026-10-31', '2026-10-31')).toBeNull(); // adopted today
    const db = makeDb({ users: baseUsers, pets: [{ id: 'f', user_id: 'u1', name: 'Soon', gotcha_date: '2026-11-07' }] });
    const fetchImpl = makeFetch();
    await run(env(db), { fetchImpl });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('Feb 29 follows getNextAnniversaryDate: Mar 1 in non-leap years, Feb 29 in leap years', () => {
    expect(dueReminderFor('2024-02-29', '2027-03-01')).toMatchObject({ kind: 'day_of', year: 2027, yearsTogether: 3 });
    expect(dueReminderFor('2024-02-29', '2027-02-22')).toMatchObject({ kind: 'week_before', anniversaryISO: '2027-03-01', yearsTogether: 3 });
    expect(dueReminderFor('2024-02-28', '2027-03-01')).toBeNull();
    expect(dueReminderFor('2024-02-29', '2028-02-29')).toMatchObject({ kind: 'day_of', year: 2028, yearsTogether: 4 });
    expect(dueReminderFor('2024-02-29', '2028-02-22')).toMatchObject({ kind: 'week_before', anniversaryISO: '2028-02-29' });
    expect(dueReminderFor('2024-02-29', '2028-03-01')).toBeNull();
  });

  it('Feb 29 pets get through the SQL month-day pre-filter on Mar 1', async () => {
    const db = makeDb({ users: baseUsers, pets: [{ id: 'leap', user_id: 'u1', name: 'Leap', gotcha_date: '2024-02-29' }] });
    const fetchImpl = makeFetch();
    await run(env(db), { fetchImpl, now: new Date('2027-03-01T14:00:00Z') });
    expect(fetchImpl.keys()).toEqual(['hgd-leap-2027-day_of']);
  });
});

// ------------------------------------------------------------------ unsubscribe

describe('unsubscribe', () => {
  it('verifies a good token and rejects a bad one', async () => {
    const t = await unsubscribeToken('u1', SECRET);
    const tampered = `${t.slice(0, -1)}${t.endsWith('A') ? 'B' : 'A'}`;
    expect(await verifyUnsubscribeToken('u1', t, SECRET)).toBe(true);
    expect(await verifyUnsubscribeToken('u2', t, SECRET)).toBe(false);
    expect(await verifyUnsubscribeToken('u1', t, 'other-secret')).toBe(false);
    expect(await verifyUnsubscribeToken('u1', tampered, SECRET)).toBe(false);
    expect(await verifyUnsubscribeToken('u1', '', SECRET)).toBe(false);
  });

  it('GET shows a confirm button; POST without a CSRF token sets reminder_emails_off = 1; bad token is a 400', async () => {
    const db = makeDb({ users: [{ id: 'u1', email: 'one@example.com' }] });
    const e = { DB: db, JWT_SECRET: SECRET };
    const t = await unsubscribeToken('u1', SECRET);

    const get = await unsubscribeRoutes.request(`/?u=u1&t=${t}`, {}, e);
    expect(get.status).toBe(200);
    expect(await get.text()).toContain('<form method="POST"');
    expect(db.state.users[0].reminder_emails_off).toBe(0);

    const bad = await unsubscribeRoutes.request('/?u=u1&t=nope', { method: 'POST' }, e);
    expect(bad.status).toBe(400);
    expect(db.state.users[0].reminder_emails_off).toBe(0);

    const post = await unsubscribeRoutes.request(`/?u=u1&t=${t}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'List-Unsubscribe=One-Click',
    }, e);
    expect(post.status).toBe(200);
    expect(await post.text()).toContain("You're unsubscribed");
    expect(db.state.users[0].reminder_emails_off).toBe(1);
  });

  it('the request log never contains the unsubscribe query string', async () => {
    expect(redactLogLine('<-- POST /unsubscribe?u=u1&t=abc')).toBe('<-- POST /unsubscribe');
    expect(redactLogLine('--> GET /unsubscribe?u=u1&t=abc 200 1ms')).toBe('--> GET /unsubscribe 200 1ms');

    const worker = (await import('../../src/index.js')).default;
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const res = await worker.fetch(
      new Request('https://happygotchadays.com/unsubscribe?u=user-123&t=secret-token-value'),
      { DB: makeDb(), JWT_SECRET: SECRET },
      {}
    );
    expect(res.status).toBe(400);
    const logged = spy.mock.calls.flat().join('\n');
    spy.mockRestore();
    expect(logged).toContain('/unsubscribe');
    expect(logged).not.toContain('secret-token-value');
    expect(logged).not.toContain('user-123');
  });
});

// ------------------------------------------------------------------ worker entry

describe('worker entry', () => {
  it('exports fetch and scheduled; scheduled hands the run to waitUntil', async () => {
    const worker = (await import('../../src/index.js')).default;
    expect(typeof worker.fetch).toBe('function');
    expect(typeof worker.scheduled).toBe('function');

    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const res = await worker.fetch(new Request('https://happygotchadays.com/health'), {}, {});
    expect(res.status).toBe(200);

    const waited = [];
    await worker.scheduled({ cron: '0 13 * * *' }, { DB: makeDb() }, { waitUntil: (p) => waited.push(p) });
    expect(waited).toHaveLength(1);
    await waited[0];
    expect(spy).toHaveBeenCalledWith('reminders: RESEND_API_KEY not set');
    spy.mockRestore();
  });
});
