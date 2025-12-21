import { describe, expect, it } from 'vitest';
import {
  calculateReminderDate,
  createReminderPreview,
  describeReminder,
  formatISODate,
  getDefaultReminderLeadTimes,
  getNextAnniversaryDate,
  getYearsWithFamily,
} from '../../src/utils/reminders.js';

const referenceDate = new Date('2024-05-01T12:00:00.000Z');

describe('reminder utilities', () => {
  describe('getNextAnniversaryDate', () => {
    it('returns upcoming anniversary in the same year when still ahead', () => {
      const next = getNextAnniversaryDate('2020-05-20', referenceDate);
      expect(formatISODate(next)).toBe('2024-05-20');
    });

    it('rolls anniversary to next year when date has passed', () => {
      const next = getNextAnniversaryDate('2018-02-10', referenceDate);
      expect(formatISODate(next)).toBe('2025-02-10');
    });
  });

  describe('calculateReminderDate', () => {
    it('computes reminder date lead time correctly', () => {
      const reminderDate = calculateReminderDate('2020-05-20', 7, referenceDate);
      expect(reminderDate).toBe('2024-05-13');
    });

    it('throws for negative lead time', () => {
      expect(() => calculateReminderDate('2020-05-20', -1, referenceDate)).toThrow();
    });
  });

  describe('describeReminder', () => {
    it('returns countdown metadata for reminder', () => {
      const details = describeReminder('2024-05-13', '2020-05-20', referenceDate);
      expect(details).toMatchObject({
        reminderDate: '2024-05-13',
        nextAnniversary: '2024-05-20',
        daysUntilReminder: 12,
        daysUntilAnniversary: 19,
        leadTimeDays: 7,
        yearsWithFamily: 4,
      });
    });
  });

  describe('createReminderPreview', () => {
    it('builds summary copy for the reminder card', () => {
      const preview = createReminderPreview(
        { id: 'pet-1', name: 'Luna', gotcha_date: '2020-05-20' },
        '2024-05-13',
        referenceDate
      );

      expect(preview.pet).toEqual({
        id: 'pet-1',
        name: 'Luna',
        gotchaDate: '2020-05-20',
        profilePhotoUrl: null,
      });
      expect(preview.headline).toContain("Luna's gotcha day is in 19 days");
      expect(preview.callToAction).toContain('7 days');
    });
  });

  describe('getDefaultReminderLeadTimes', () => {
    it('returns the expected reminder offsets', () => {
      expect(getDefaultReminderLeadTimes()).toEqual([14, 7, 1]);
    });
  });

  describe('getYearsWithFamily', () => {
    it('calculates anniversary milestone correctly', () => {
      const years = getYearsWithFamily('2020-05-20', referenceDate);
      expect(years).toBe(4);
    });
  });
});
