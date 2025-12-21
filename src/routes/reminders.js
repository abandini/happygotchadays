import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.js';
import { generateId, timestamp } from '../utils/id.js';
import {
  calculateReminderDate,
  createReminderPreview,
  describeReminder,
  formatISODate,
  getDefaultReminderLeadTimes,
  getNextAnniversaryDate,
} from '../utils/reminders.js';

const reminders = new Hono();

async function loadPetForUser(db, petId, userId) {
  const pet = await db.prepare(
    'SELECT id, user_id, name, gotcha_date, profile_photo_url FROM pets WHERE id = ?'
  ).bind(petId).first();

  if (!pet) {
    return { error: 'Pet not found', status: 404 };
  }

  if (pet.user_id !== userId) {
    return { error: 'Not authorized to schedule reminders for this pet', status: 403 };
  }

  return { pet };
}

reminders.post('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const { petId, daysBefore } = await c.req.json();

    if (!petId) {
      return c.json({ error: 'petId is required' }, 400);
    }

    const leadTime = daysBefore ?? 7;

    if (!Number.isInteger(leadTime) || leadTime < 0 || leadTime > 180) {
      return c.json({ error: 'daysBefore must be an integer between 0 and 180' }, 400);
    }

    const { pet, error, status } = await loadPetForUser(c.env.DB, petId, user.id);

    if (!pet) {
      return c.json({ error }, status);
    }

    const referenceDate = new Date();
    const reminderDate = calculateReminderDate(pet.gotcha_date, leadTime, referenceDate);
    const nextAnniversary = formatISODate(getNextAnniversaryDate(pet.gotcha_date, referenceDate));

    const existingReminder = await c.env.DB.prepare(
      `SELECT id FROM reminders
       WHERE user_id = ? AND pet_id = ? AND reminder_date = ? AND sent = 0`
    ).bind(user.id, petId, reminderDate).first();

    if (existingReminder) {
      const preview = createReminderPreview(pet, reminderDate, referenceDate);
      return c.json({
        reminder: {
          id: existingReminder.id,
          petId,
          userId: user.id,
          reminderDate,
          nextAnniversary,
          ...preview,
        },
        duplicate: true,
        message: 'Reminder already scheduled for this window',
      }, 200);
    }

    const reminderId = generateId();
    const now = timestamp();

    await c.env.DB.prepare(
      `INSERT INTO reminders (id, user_id, pet_id, reminder_date, sent, created_at)
       VALUES (?, ?, ?, ?, 0, ?)`
    ).bind(reminderId, user.id, petId, reminderDate, now).run();

    const preview = createReminderPreview(pet, reminderDate, referenceDate);

    return c.json({
      reminder: {
        id: reminderId,
        petId,
        userId: user.id,
        reminderDate,
        nextAnniversary,
        leadTimeDays: preview.leadTimeDays,
        headline: preview.headline,
        callToAction: preview.callToAction,
      }
    }, 201);
  } catch (error) {
    console.error('Create reminder error:', error);
    return c.json({ error: 'Failed to schedule reminder' }, 500);
  }
});

reminders.get('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const windowDays = Number.parseInt(c.req.query('windowDays') ?? '60', 10);
    const referenceDate = new Date();

    if (Number.isNaN(windowDays) || windowDays < 0 || windowDays > 365) {
      return c.json({ error: 'windowDays must be between 0 and 365' }, 400);
    }

    const startIso = formatISODate(referenceDate);
    const endDate = new Date(referenceDate.getTime() + windowDays * 86400000);
    const endIso = formatISODate(endDate);

    const { results } = await c.env.DB.prepare(
      `SELECT r.id, r.pet_id, r.reminder_date, r.sent, r.created_at,
              p.name as pet_name, p.gotcha_date, p.profile_photo_url
       FROM reminders r
       JOIN pets p ON p.id = r.pet_id
       WHERE r.user_id = ?
         AND r.reminder_date BETWEEN ? AND ?
       ORDER BY r.reminder_date ASC`
    ).bind(user.id, startIso, endIso).all();

    const remindersList = results.map((row) => {
      const summary = describeReminder(row.reminder_date, row.gotcha_date, referenceDate);
      return {
        id: row.id,
        petId: row.pet_id,
        reminderDate: summary.reminderDate,
        nextAnniversary: summary.nextAnniversary,
        daysUntilReminder: summary.daysUntilReminder,
        daysUntilAnniversary: summary.daysUntilAnniversary,
        leadTimeDays: summary.leadTimeDays,
        yearsWithFamily: summary.yearsWithFamily,
        sent: row.sent === 1,
        pet: {
          name: row.pet_name,
          profilePhotoUrl: row.profile_photo_url || null,
          gotchaDate: row.gotcha_date,
        },
      };
    });

    return c.json({ reminders: remindersList });
  } catch (error) {
    console.error('List reminders error:', error);
    return c.json({ error: 'Failed to load reminders' }, 500);
  }
});

reminders.post('/defaults', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const { petId } = await c.req.json();

    if (!petId) {
      return c.json({ error: 'petId is required' }, 400);
    }

    const { pet, error, status } = await loadPetForUser(c.env.DB, petId, user.id);

    if (!pet) {
      return c.json({ error }, status);
    }

    const referenceDate = new Date();
    const leadTimes = getDefaultReminderLeadTimes();

    const scheduled = [];
    for (const leadTime of leadTimes) {
      const reminderDate = calculateReminderDate(pet.gotcha_date, leadTime, referenceDate);

      const existing = await c.env.DB.prepare(
        `SELECT id FROM reminders
         WHERE user_id = ? AND pet_id = ? AND reminder_date = ? AND sent = 0`
      ).bind(user.id, petId, reminderDate).first();

      if (existing) {
        continue;
      }

      const reminderId = generateId();
      const now = timestamp();

      await c.env.DB.prepare(
        `INSERT INTO reminders (id, user_id, pet_id, reminder_date, sent, created_at)
         VALUES (?, ?, ?, ?, 0, ?)`
      ).bind(reminderId, user.id, petId, reminderDate, now).run();

      scheduled.push({ reminderId, reminderDate, leadTimeDays: leadTime });
    }

    const previews = scheduled.map(({ reminderId, reminderDate, leadTimeDays }) => {
      const preview = createReminderPreview(pet, reminderDate, referenceDate);
      return {
        id: reminderId,
        reminderDate,
        leadTimeDays,
        headline: preview.headline,
        callToAction: preview.callToAction,
      };
    });

    return c.json({
      created: previews,
      skipped: leadTimes.length - previews.length,
    });
  } catch (error) {
    console.error('Schedule default reminders error:', error);
    return c.json({ error: 'Failed to create default reminders' }, 500);
  }
});

export { reminders as remindersRoutes };
