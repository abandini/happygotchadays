const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const MS_PER_DAY = 86400000;

function ensureValidISODate(dateStr) {
  if (!ISO_DATE_REGEX.test(dateStr)) {
    throw new Error(`Invalid ISO date format: ${dateStr}`);
  }
}

function toUTCDate(year, monthIndex, day) {
  return new Date(Date.UTC(year, monthIndex, day));
}

function cloneAsUTCStartOfDay(date) {
  const clone = new Date(date.getTime());
  clone.setUTCHours(0, 0, 0, 0);
  return clone;
}

export function formatISODate(date) {
  return cloneAsUTCStartOfDay(date).toISOString().slice(0, 10);
}

export function getNextAnniversaryDate(gotchaDate, referenceDate = new Date()) {
  ensureValidISODate(gotchaDate);
  const [year, month, day] = gotchaDate.split('-').map(Number);

  const refStart = cloneAsUTCStartOfDay(referenceDate);
  let next = toUTCDate(refStart.getUTCFullYear(), month - 1, day);

  if (next < refStart) {
    next = toUTCDate(refStart.getUTCFullYear() + 1, month - 1, day);
  }

  return next;
}

export function calculateReminderDate(gotchaDate, daysBefore, referenceDate = new Date()) {
  if (!Number.isInteger(daysBefore) || daysBefore < 0) {
    throw new Error('daysBefore must be a non-negative integer');
  }

  const nextAnniversary = getNextAnniversaryDate(gotchaDate, referenceDate);
  const reminderDate = new Date(nextAnniversary.getTime() - daysBefore * MS_PER_DAY);

  return formatISODate(reminderDate);
}

export function getYearsWithFamily(gotchaDate, referenceDate = new Date()) {
  ensureValidISODate(gotchaDate);
  const [year, month, day] = gotchaDate.split('-').map(Number);
  const refStart = cloneAsUTCStartOfDay(referenceDate);
  const anniversaryThisYear = toUTCDate(refStart.getUTCFullYear(), month - 1, day);
  const anniversaryYear = anniversaryThisYear < refStart
    ? refStart.getUTCFullYear() + 1
    : refStart.getUTCFullYear();

  return Math.max(anniversaryYear - year, 0);
}

export function describeReminder(reminderDateIso, gotchaDate, referenceDate = new Date()) {
  ensureValidISODate(reminderDateIso);
  ensureValidISODate(gotchaDate);

  const refStart = cloneAsUTCStartOfDay(referenceDate);
  const reminderDate = toUTCDate(
    Number(reminderDateIso.slice(0, 4)),
    Number(reminderDateIso.slice(5, 7)) - 1,
    Number(reminderDateIso.slice(8, 10))
  );

  const nextAnniversary = getNextAnniversaryDate(gotchaDate, referenceDate);
  const daysUntilReminder = Math.max(0, Math.ceil((reminderDate - refStart) / MS_PER_DAY));
  const daysUntilAnniversary = Math.max(0, Math.ceil((nextAnniversary - refStart) / MS_PER_DAY));
  const leadTimeDays = Math.max(0, Math.ceil((nextAnniversary - reminderDate) / MS_PER_DAY));
  const yearsWithFamily = getYearsWithFamily(gotchaDate, referenceDate);

  return {
    reminderDate: formatISODate(reminderDate),
    nextAnniversary: formatISODate(nextAnniversary),
    daysUntilReminder,
    daysUntilAnniversary,
    leadTimeDays,
    yearsWithFamily,
  };
}

export function createReminderPreview(pet, reminderDateIso, referenceDate = new Date()) {
  if (!pet || !pet.name || !pet.gotcha_date) {
    throw new Error('Pet with name and gotcha_date is required to build reminder preview');
  }

  const summary = describeReminder(reminderDateIso, pet.gotcha_date, referenceDate);
  const headline = `${pet.name}'s gotcha day is in ${summary.daysUntilAnniversary} day${summary.daysUntilAnniversary === 1 ? '' : 's'}!`;
  const callToAction = summary.daysUntilReminder === 0
    ? `Celebrate today with a new post about ${pet.name}!`
    : `Schedule a celebration post in ${summary.leadTimeDays} day${summary.leadTimeDays === 1 ? '' : 's'}.`;

  return {
    ...summary,
    pet: {
      id: pet.id,
      name: pet.name,
      gotchaDate: pet.gotcha_date,
      profilePhotoUrl: pet.profile_photo_url || null,
    },
    headline,
    callToAction,
  };
}

export function getDefaultReminderLeadTimes() {
  return [14, 7, 1];
}
