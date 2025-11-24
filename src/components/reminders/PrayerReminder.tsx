// src/components/reminders/PrayerReminder.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import usePrayerTimes from "@/hooks/usePrayerTimes";

// Simple pre‑reminder minutes (can be later moved to settings)
const PRE_REMINDER_MINUTES = 5;

const PrayerReminder = () => {
  const { rawPrayerTimes } = usePrayerTimes();
  const { isPrayerReminderOn } = useSelector((state: RootState) => state.Settings);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPrayer, setCurrentPrayer] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load sound effect (you can replace with your own sound file)
  useEffect(() => {
    audioRef.current = new Audio("/sound/prayer-azan.mp3");
  }, []);

  // Request notification permission once
  useEffect(() => {
    if (isPrayerReminderOn) {
      Notification.requestPermission();
    }
  }, [isPrayerReminderOn]);

  // Check every minute for upcoming prayers
  useEffect(() => {
    if (!isPrayerReminderOn || !rawPrayerTimes?.length) return;

    const interval = setInterval(() => {
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      rawPrayerTimes.forEach((prayer) => {
        const [h, m] = prayer.time24.split(":");
        const prayerMinutes = Number(h) * 60 + Number(m);
        const diff = prayerMinutes - nowMinutes;
        // Trigger at exact time or pre‑reminder minutes before
        if (diff === 0 || diff === PRE_REMINDER_MINUTES) {
          // Show popup
          setCurrentPrayer(prayer.name);
          setShowPopup(true);
          // Play sound
          audioRef.current?.play();
          // Browser notification
          if (Notification.permission === "granted") {
            new Notification("🕌 Prayer Reminder", {
              body: `${prayer.name} prayer ${diff === 0 ? "now" : `${PRE_REMINDER_MINUTES} minutes` }`,
            });
          }
        }
      });
    }, 60 * 1000); // every minute

    return () => clearInterval(interval);
  }, [isPrayerReminderOn, rawPrayerTimes]);

  // Auto‑hide popup after 10 seconds
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 10_000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  if (!showPopup) return null;

  const popup = (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-5 left-1/2 transform -translate-x-1/2 w-full max-w-[95vw] bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex items-center p-4"
    >
      <Image src="/prayer-icon.png" width={40} height={40} alt="prayer" className="mr-3" />
      <p className="font-bold">
        {currentPrayer} prayer {PRE_REMINDER_MINUTES} minutes reminder
      </p>
    </motion.div>
  );

  return createPortal(popup, document.body);
};

export default PrayerReminder;
