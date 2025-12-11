import { SettingsType, defaultSettings } from "@/types/user";

/**
 * Migrates old flat settings structure to new nested structure
 * @param oldSettings - Settings in old flat format or new nested format
 * @returns Settings in new nested format
 */
export function migrateSettings(oldSettings: any): SettingsType {
  // If already in new format (has 'timers' property), return as-is
  if (oldSettings?.timers) {
    return oldSettings as SettingsType;
  }

  // Migrate from flat to nested structure
  return {
    timers: {
      focusDurationTime:
        oldSettings?.focusDurationTime ??
        defaultSettings.timers.focusDurationTime,
      shortBreakDuration:
        oldSettings?.shortBreakDuration ??
        defaultSettings.timers.shortBreakDuration,
      longBreakDuration:
        oldSettings?.longBreakDuration ??
        defaultSettings.timers.longBreakDuration,
    },
    waterReminder: {
      enabled:
        oldSettings?.isWaterReminderOn ?? defaultSettings.waterReminder.enabled,
      interval:
        oldSettings?.waterReminderInterval ??
        defaultSettings.waterReminder.interval,
    },
    prayerReminder: {
      enabled:
        oldSettings?.prayerReminderSettings?.isEnabled ??
        defaultSettings.prayerReminder.enabled,
      preReminderMinutes:
        oldSettings?.prayerReminderSettings?.preReminderMinutes ??
        defaultSettings.prayerReminder.preReminderMinutes,
      preReminderEnabled:
        oldSettings?.prayerReminderSettings?.preReminderEnabled ??
        defaultSettings.prayerReminder.preReminderEnabled,
      atTimeReminderEnabled:
        oldSettings?.prayerReminderSettings?.atTimeReminderEnabled ??
        defaultSettings.prayerReminder.atTimeReminderEnabled,
      perPrayer: {
        Fajr: {
          pre:
            oldSettings?.prayerReminderSettings?.individualPrayers?.Fajr
              ?.preReminderEnabled ?? true,
          atTime:
            oldSettings?.prayerReminderSettings?.individualPrayers?.Fajr
              ?.atTimeReminderEnabled ?? true,
        },
        Dhuhr: {
          pre:
            oldSettings?.prayerReminderSettings?.individualPrayers?.Dhuhr
              ?.preReminderEnabled ?? true,
          atTime:
            oldSettings?.prayerReminderSettings?.individualPrayers?.Dhuhr
              ?.atTimeReminderEnabled ?? true,
        },
        Asr: {
          pre:
            oldSettings?.prayerReminderSettings?.individualPrayers?.Asr
              ?.preReminderEnabled ?? true,
          atTime:
            oldSettings?.prayerReminderSettings?.individualPrayers?.Asr
              ?.atTimeReminderEnabled ?? true,
        },
        Maghrib: {
          pre:
            oldSettings?.prayerReminderSettings?.individualPrayers?.Maghrib
              ?.preReminderEnabled ?? true,
          atTime:
            oldSettings?.prayerReminderSettings?.individualPrayers?.Maghrib
              ?.atTimeReminderEnabled ?? true,
        },
        Isha: {
          pre:
            oldSettings?.prayerReminderSettings?.individualPrayers?.Isha
              ?.preReminderEnabled ?? true,
          atTime:
            oldSettings?.prayerReminderSettings?.individualPrayers?.Isha
              ?.atTimeReminderEnabled ?? true,
        },
      },
    },
    location: {
      country: oldSettings?.country ?? defaultSettings.location.country,
      city: oldSettings?.city ?? defaultSettings.location.city,
    },
    ui: {
      prayerTimesPosition:
        oldSettings?.prayerTimesPosition ??
        defaultSettings.ui.prayerTimesPosition,
    },
  };
}
