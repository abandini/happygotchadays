/**
 * Gotcha day reminder emails.
 *
 * Runs from the Worker's `scheduled` handler (crons at 13:00, 13:30 and 14:00
 * UTC: 13:00 UTC is 9am EDT in summer and 8am EST in winter; the later runs
 * retry stale sends inside Resend's 24h idempotency window).
 *
 * Each run looks at a catch-up window of send dates, today-2 .. today (US
 * Eastern date). A pet is due 'week_before' on the date 7 days before its
 * anniversary and 'day_of' on the anniversary; a send date missed by the cron
 * is picked up by a later run inside the window.
 *
 * Delivery state lives in `reminder_sends`, one row per (pet, year, kind),
 * status 'pending' | 'sent' | 'gave_up'. History is never lost after an
 * ambiguous attempt:
 *   - claim = INSERT 'pending' with the exact Resend request body (payload)
 *     BEFORE calling Resend; only a missing row is ever claimed
 *   - 2xx                      -> 'sent'
 *   - 409 (idempotency clash)  -> 'gave_up'
 *   - other 4xx (incl. 429)    -> row deleted ONLY if attempts = 1 and never
 *                                 ambiguous (a later run may retry); else 'gave_up'
 *   - network error or 5xx     -> ambiguous = 1, stays 'pending'; retried after
 *                                 15 minutes with the stored payload and the SAME
 *                                 Idempotency-Key, at most 3 attempts in total and
 *                                 only within 23h of claimed_at; else 'gave_up'
 *   - before every attempt: opted out -> skip ('gave_up' unless a clean first
 *     attempt); stored `to` no longer the user's email -> 'gave_up'
 * attempts and claimed_at are never reset.
 * Logs carry only allowlisted category counts, never addresses or error text.
 */
import { formatISODate, getNextAnniversaryDate } from './reminders.js';

export const SITE_ORIGIN = 'https://happygotchadays.com';
export const FROM_ADDRESS = 'HappyGotchaDays <reminders@mail.happygotchadays.com>';
export const RESEND_ENDPOINT = 'https://api.resend.com/emails';
export const WHAT_IS_URL = `${SITE_ORIGIN}/what-is-gotcha-day`;
export const ASPCA_URL = 'https://www.aspca.org/news/fun-ways-safely-celebrate-your-pets-birthday';
// There is no public per-pet page on the site, so emails link to the home page.
export const SITE_URL = `${SITE_ORIGIN}/`;

/** Max Resend calls per run; items over the cap stay unclaimed for the next run. */
export const MAX_EMAILS_PER_RUN = 500;
/** Send dates from today-CATCH_UP_DAYS through today are eligible. */
export const CATCH_UP_DAYS = 2;
/** A 'pending' row untouched this long is presumed failed and retried. */
export const STALE_PENDING_SECONDS = 15 * 60;
/** Total Resend attempts per (pet, year, kind) before giving up. */
export const MAX_ATTEMPTS = 3;
/** Resend keeps idempotency keys 24h; don't retry a claim older than this (margin kept). */
export const IDEMPOTENCY_WINDOW_SECONDS = 23 * 3600;
/** The only categories ever written to logs. */
export const LOG_CATEGORIES = ['sent', 'skipped_opt_out', 'released_4xx', 'kept_5xx', 'gave_up', 'errors', 'capped'];

const MS_PER_DAY = 86400000;
const WEEK_BEFORE_DAYS = 7;
// Resend's default rate limit is a few requests per second; pace sends.
const DEFAULT_SEND_GAP_MS = 600;

// ---------------------------------------------------------------- dates

/** Today's date in US Eastern time as YYYY-MM-DD. */
export function easternDateISO(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

function isoToUTCDate(iso) {
  return new Date(`${iso}T00:00:00.000Z`);
}

export function addDaysISO(iso, days) {
  return formatISODate(new Date(isoToUTCDate(iso).getTime() + days * MS_PER_DAY));
}

function daysBetween(fromISO, toISO) {
  return Math.round((isoToUTCDate(toISO) - isoToUTCDate(fromISO)) / MS_PER_DAY);
}

function longDate(iso) {
  return isoToUTCDate(iso).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC',
  });
}

/**
 * Which reminder (if any) has `sendDateISO` as its send date.
 * Uses getNextAnniversaryDate, so a Feb 29 gotcha date is celebrated on Mar 1
 * in non-leap years (Date.UTC rolls Feb 29 over to Mar 1).
 * yearsTogether = target anniversary's year minus the adoption year, so the
 * week-before email for the first anniversary says "1 year together".
 * @returns {{kind:'day_of'|'week_before', anniversaryISO:string, year:number, yearsTogether:number}|null}
 */
export function dueReminderFor(gotchaDate, sendDateISO) {
  let next;
  try {
    next = getNextAnniversaryDate(gotchaDate, isoToUTCDate(sendDateISO));
  } catch {
    return null; // malformed gotcha_date
  }
  const anniversaryISO = formatISODate(next);
  let kind = null;
  if (anniversaryISO === sendDateISO) kind = 'day_of';
  else if (anniversaryISO === addDaysISO(sendDateISO, WEEK_BEFORE_DAYS)) kind = 'week_before';
  if (!kind) return null;

  const year = next.getUTCFullYear();
  const yearsTogether = year - Number(gotchaDate.slice(0, 4));
  if (yearsTogether < 1) return null; // adoption date is this year or in the future
  return { kind, anniversaryISO, year, yearsTogether };
}

/** Every reminder whose send date falls in today-CATCH_UP_DAYS .. today. */
export function dueRemindersInWindow(gotchaDate, todayISO) {
  const out = [];
  for (let d = 0; d <= CATCH_UP_DAYS; d++) {
    const sendDateISO = addDaysISO(todayISO, -d);
    const due = dueReminderFor(gotchaDate, sendDateISO);
    if (due) out.push({ ...due, sendDateISO });
  }
  return out;
}

/** Month-day strings to pre-filter pets in SQL; Feb 29 pets match Mar 1 targets. */
export function candidateMonthDays(todayISO) {
  const set = new Set();
  for (let d = 0; d <= CATCH_UP_DAYS; d++) {
    const sendDate = addDaysISO(todayISO, -d);
    set.add(sendDate.slice(5));
    set.add(addDaysISO(sendDate, WEEK_BEFORE_DAYS).slice(5));
  }
  if (set.has('03-01')) set.add('02-29');
  return [...set];
}

// ---------------------------------------------------------------- content

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function yearsPhrase(years) {
  return `${years} ${years === 1 ? 'year' : 'years'} together`;
}

function headerSafe(value) {
  return String(value).replace(/[\r\n]+/g, ' ').trim();
}

/**
 * Build subject/html/text for one reminder.
 * daysUntil is anniversary minus today: 7 normally for week_before (less if
 * caught up late), 0 for day_of on time, negative for a late day_of.
 */
export function buildReminderEmail({ petName, daysUntil, anniversaryISO, yearsTogether, unsubscribeUrl }) {
  const name = headerSafe(petName);
  const together = yearsPhrase(yearsTogether);
  const when = longDate(anniversaryISO);

  let subject;
  let lead;
  if (daysUntil === 0) {
    subject = `Happy gotcha day, ${name}! ${together}`;
    lead = `Today is ${name}'s gotcha day: ${together}.`;
  } else if (daysUntil < 0) {
    subject = `Happy gotcha day, ${name}! ${together}`;
    lead = `${name}'s gotcha day was on ${when}: ${together}.`;
  } else {
    const inDays = daysUntil === 1 ? 'tomorrow' : `in ${daysUntil} days`;
    subject = `${name}'s gotcha day is ${inDays} (${together})`;
    lead = `${name}'s gotcha day is ${inDays}, on ${when}. That makes ${together}.`;
  }

  const ideas = [
    { text: 'Read what a gotcha day is and how other families mark it', url: WHAT_IS_URL },
    { text: "A favorite walk, a new toy, or a pet-safe treat: the ASPCA's tips for celebrating safely", url: ASPCA_URL },
    { text: `Share a photo of ${name} on HappyGotchaDays`, url: SITE_URL },
  ];
  const footer = `You're getting this because you added ${name}'s gotcha day on HappyGotchaDays.`;

  const text = [
    lead,
    '',
    `Open HappyGotchaDays: ${SITE_URL}`,
    '',
    'A few simple ideas:',
    ...ideas.map((i) => `- ${i.text}: ${i.url}`),
    '',
    '--',
    footer,
    `Unsubscribe from reminder emails: ${unsubscribeUrl}`,
    'HappyGotchaDays, Solon, Ohio',
    '',
  ].join('\n');

  const e = escapeHtml;
  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${e(subject)}</title></head>
<body style="margin:0; padding:24px; background:#FFF8E7; font-family:Arial, Helvetica, sans-serif; color:#2D3436;">
  <div style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:12px; padding:24px;">
    <p style="font-size:18px; line-height:1.5; margin:0 0 16px;">${e(lead)}</p>
    <p style="margin:0 0 20px;"><a href="${e(SITE_URL)}" style="color:#E05555; font-weight:bold;">Open HappyGotchaDays</a></p>
    <p style="margin:0 0 8px; font-weight:bold;">A few simple ideas:</p>
    <ul style="margin:0 0 20px; padding-left:20px; line-height:1.6;">
      ${ideas.map((i) => `<li><a href="${e(i.url)}" style="color:#E05555;">${e(i.text)}</a></li>`).join('\n      ')}
    </ul>
    <hr style="border:none; border-top:1px solid #eee; margin:20px 0;">
    <p style="font-size:12px; color:#636E72; line-height:1.5; margin:0;">
      ${e(footer)}<br>
      <a href="${e(unsubscribeUrl)}" style="color:#636E72;">Unsubscribe from reminder emails</a><br>
      HappyGotchaDays, Solon, Ohio
    </p>
  </div>
</body>
</html>`;

  return { subject, html, text };
}

// ---------------------------------------------------------------- unsubscribe tokens

function base64Url(bytes) {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** HMAC-SHA256(userId) keyed with JWT_SECRET, base64url. */
export async function unsubscribeToken(userId, secret) {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(String(userId)));
  return base64Url(new Uint8Array(sig));
}

/** Constant-time string comparison (length is not secret: tokens are fixed-length). */
export function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function verifyUnsubscribeToken(userId, token, secret) {
  if (!userId || !token || !secret) return false;
  const expected = await unsubscribeToken(userId, secret);
  return timingSafeEqual(expected, token);
}

export async function unsubscribeUrlFor(userId, secret) {
  const t = await unsubscribeToken(userId, secret);
  return `${SITE_ORIGIN}/unsubscribe?u=${encodeURIComponent(userId)}&t=${t}`;
}

// ---------------------------------------------------------------- sending

/**
 * The exact JSON body POSTed to Resend. Stored in reminder_sends.payload on the
 * first claim; every retry sends this stored string unchanged.
 */
export function buildRequestBody({ to, subject, html, text, unsubscribeUrl }) {
  return JSON.stringify({
    from: FROM_ADDRESS,
    to: [to],
    subject,
    html,
    text,
    headers: {
      'List-Unsubscribe': `<${unsubscribeUrl}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  });
}

/**
 * POST a stored body to Resend.
 * @returns {Promise<'sent'|'conflict'|'rejected'|'unknown'>}
 *   conflict = 409 (idempotency conflict); rejected = any other 4xx (incl. 429);
 *   unknown = network error or 5xx (Resend may or may not have accepted it)
 */
export async function sendViaResend({ apiKey, fetchImpl, idempotencyKey, body }) {
  let res;
  try {
    res = await fetchImpl(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body,
    });
  } catch {
    return 'unknown';
  }
  if (res.ok) return 'sent';
  if (res.status === 409) return 'conflict';
  if (res.status >= 400 && res.status < 500) return 'rejected';
  return 'unknown';
}

export function idempotencyKeyFor(petId, year, kind) {
  return `hgd-${petId}-${year}-${kind}`;
}

export function formatCountsLog(counts) {
  return `reminders: ${LOG_CATEGORIES.map((k) => `${k}=${Number(counts[k]) || 0}`).join(' ')}`;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PK = 'pet_id = ? AND year = ? AND kind = ?';
const pk = (item) => [item.petId, item.year, item.kind];

function setTerminal(db, item, status, nowSec) {
  return db.prepare(`UPDATE reminder_sends SET status = ?, updated_at = ? WHERE ${PK} AND status = 'pending'`)
    .bind(status, nowSec, ...pk(item)).run();
}

/** Only a clean first attempt (attempts = 1, never ambiguous) may be deleted. */
function releaseClean(db, item) {
  return db.prepare(`DELETE FROM reminder_sends WHERE ${PK} AND attempts = 1 AND ambiguous = 0`)
    .bind(...pk(item)).run();
}

/**
 * Claim (pet, year, kind) for one attempt.
 *   - no row        -> INSERT pending with the payload: a fresh first attempt
 *   - 'sent' / 'gave_up' -> skip (never re-claimed)
 *   - 'pending'     -> retried only when stale, under MAX_ATTEMPTS and inside the
 *                      23h window measured from claimed_at; otherwise -> 'gave_up'.
 *                      A stale pending row means the earlier attempt's outcome is
 *                      unknown, so the re-claim also sets ambiguous = 1.
 * @returns {Promise<{state:string, attempt?:{attempts:number, fresh:boolean, body:string}}>}
 */
async function claim(db, item, freshBody, nowSec) {
  const ins = await db.prepare(
    `INSERT OR IGNORE INTO reminder_sends
       (pet_id, year, kind, status, attempts, ambiguous, payload, claimed_at, updated_at)
     VALUES (?, ?, ?, 'pending', 1, 0, ?, ?, ?)`
  ).bind(...pk(item), freshBody, nowSec, nowSec).run();
  if ((ins?.meta?.changes ?? 0) === 1) {
    return { state: 'claimed', attempt: { attempts: 1, fresh: true, body: freshBody } };
  }

  const row = await db.prepare(
    `SELECT status, attempts, ambiguous, payload, claimed_at, updated_at FROM reminder_sends WHERE ${PK}`
  ).bind(...pk(item)).first();
  if (!row) return { state: 'in_flight' };
  if (row.status !== 'pending') return { state: 'done' };
  if (nowSec - row.updated_at < STALE_PENDING_SECONDS) return { state: 'in_flight' };
  if (row.attempts >= MAX_ATTEMPTS || nowSec - row.claimed_at >= IDEMPOTENCY_WINDOW_SECONDS || !row.payload) {
    await setTerminal(db, item, 'gave_up', nowSec);
    return { state: 'gave_up' };
  }

  const upd = await db.prepare(
    `UPDATE reminder_sends SET attempts = attempts + 1, ambiguous = 1, updated_at = ?
      WHERE ${PK} AND status = 'pending' AND attempts = ?`
  ).bind(nowSec, ...pk(item), row.attempts).run();
  if ((upd?.meta?.changes ?? 0) !== 1) return { state: 'in_flight' };
  return { state: 'claimed', attempt: { attempts: row.attempts + 1, fresh: false, body: row.payload } };
}

/**
 * One cron run.
 * @param {object} env Worker env (DB, RESEND_API_KEY, JWT_SECRET)
 * @param {{now?:Date, fetchImpl?:Function, sendGapMs?:number, maxEmails?:number, log?:Function}} [opts]
 */
export async function runReminderEmails(env, opts = {}) {
  const {
    now = new Date(),
    fetchImpl = (...args) => fetch(...args),
    sendGapMs = DEFAULT_SEND_GAP_MS,
    maxEmails = MAX_EMAILS_PER_RUN,
    log = (...args) => console.log(...args),
  } = opts;

  const counts = Object.fromEntries(LOG_CATEGORIES.map((k) => [k, 0]));
  // Not logged; returned for tests and callers.
  counts.already_done = 0;
  counts.in_flight = 0;

  if (!env.RESEND_API_KEY) {
    log('reminders: RESEND_API_KEY not set');
    return { skipped: 'no_api_key', counts };
  }
  if (!env.JWT_SECRET) {
    log('reminders: JWT_SECRET not set');
    return { skipped: 'no_jwt_secret', counts };
  }

  const db = env.DB;
  const todayISO = easternDateISO(now);
  const nowSec = Math.floor(now.getTime() / 1000);
  let sendsThisRun = 0;

  let pets = [];
  try {
    const days = candidateMonthDays(todayISO);
    ({ results: pets = [] } = await db.prepare(
      `SELECT p.id, p.name, p.gotcha_date, p.user_id, u.email, u.reminder_emails_off
         FROM pets p JOIN users u ON u.id = p.user_id
        WHERE p.gotcha_date IS NOT NULL AND substr(p.gotcha_date, 6) IN (${days.map(() => '?').join(', ')})`
    ).bind(...days).all());
  } catch {
    counts.errors++;
    log(formatCountsLog(counts));
    return { date: todayISO, counts };
  }

  const items = [];
  for (const pet of pets) {
    for (const due of dueRemindersInWindow(pet.gotcha_date, todayISO)) {
      items.push({ pet, petId: pet.id, ...due });
    }
  }

  for (const item of items) {
    try {
      const { pet } = item;
      if (pet.reminder_emails_off) { counts.skipped_opt_out++; continue; }
      if (sendsThisRun >= maxEmails) { counts.capped++; continue; } // left unclaimed

      const unsubscribeUrl = await unsubscribeUrlFor(pet.user_id, env.JWT_SECRET);
      const email = buildReminderEmail({
        petName: pet.name,
        daysUntil: daysBetween(todayISO, item.anniversaryISO),
        anniversaryISO: item.anniversaryISO,
        yearsTogether: item.yearsTogether,
        unsubscribeUrl,
      });
      const freshBody = buildRequestBody({ to: pet.email, unsubscribeUrl, ...email });

      const { state, attempt } = await claim(db, item, freshBody, nowSec);
      if (state === 'done') { counts.already_done++; continue; }
      if (state === 'in_flight') { counts.in_flight++; continue; }
      if (state === 'gave_up') { counts.gave_up++; continue; }

      // Before every attempt: re-read opt-out and the current address.
      const user = await db.prepare('SELECT email, reminder_emails_off FROM users WHERE id = ?').bind(pet.user_id).first();
      if (!user || user.reminder_emails_off) {
        if (attempt.fresh) await releaseClean(db, item);
        else await setTerminal(db, item, 'gave_up', nowSec);
        counts.skipped_opt_out++;
        continue;
      }
      const storedTo = JSON.parse(attempt.body).to?.[0];
      if (storedTo !== user.email) {
        await setTerminal(db, item, 'gave_up', nowSec);
        counts.gave_up++;
        continue;
      }

      if (sendsThisRun > 0 && sendGapMs > 0) await sleep(sendGapMs);
      sendsThisRun++;
      const outcome = await sendViaResend({
        apiKey: env.RESEND_API_KEY,
        fetchImpl,
        idempotencyKey: idempotencyKeyFor(item.petId, item.year, item.kind),
        body: attempt.body,
      });

      if (outcome === 'sent') {
        await setTerminal(db, item, 'sent', nowSec);
        counts.sent++;
      } else if (outcome === 'conflict') {
        await setTerminal(db, item, 'gave_up', nowSec);
        counts.gave_up++;
      } else if (outcome === 'rejected') {
        if (attempt.fresh) {
          await releaseClean(db, item); // clean first attempt: a later run may retry
          counts.released_4xx++;
        } else {
          await setTerminal(db, item, 'gave_up', nowSec); // an earlier attempt was ambiguous
          counts.gave_up++;
        }
      } else {
        await db.prepare(`UPDATE reminder_sends SET ambiguous = 1, updated_at = ? WHERE ${PK}`)
          .bind(nowSec, ...pk(item)).run();
        counts.kept_5xx++; // stays 'pending'; retried once stale with the stored payload
      }
    } catch {
      counts.errors++;
    }
  }

  log(formatCountsLog(counts));
  return { date: todayISO, counts };
}
