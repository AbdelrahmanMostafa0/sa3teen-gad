"use client";

import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { PrayerNameMap } from "@/hooks/usePrayerTimes";
import { PrayerName } from "@/types/user";

const PrayerReminder = () => {

  const rawPrayerTimes = useSelector((state: RootState) => state.Prayers.prayerTimes);
  const prayerSettings = useSelector((state: RootState) => state.Settings.prayerReminder);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPrayer, setCurrentPrayer] = useState<PrayerName | "">("");
  const [isPreReminder, setIsPreReminder] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/sound/prayer-reminder.mp3");
  }, []);

  // Request notification permission once
  useEffect(() => {
    if (prayerSettings.enabled) {
      Notification.requestPermission();
    }
  }, [prayerSettings.enabled]);

  // Check every minute for upcoming prayers
  useEffect(() => {
    if (!prayerSettings.enabled || !rawPrayerTimes?.length) return;

    const interval = setInterval(() => {
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      rawPrayerTimes.forEach((prayer) => {
        // Skip Sunrise as it's not a prayer time
        if (prayer.name === "Sunrise") return;

        const prayerName = prayer.name as PrayerName;
        const individualSettings = prayerSettings.perPrayer[prayerName];

        if (!individualSettings) return;

        const [h, m] = prayer.time24.split(":");
        const prayerMinutes = Number(h) * 60 + Number(m);
        const diff = prayerMinutes - nowMinutes;

        // Check for pre-reminder
        if (
          diff === prayerSettings.preReminderMinutes &&
          prayerSettings.preReminderEnabled &&
          individualSettings.pre
        ) {
          setCurrentPrayer(prayer.name);
          setIsPreReminder(true);
          setShowPopup(true);
          audioRef.current?.play();

          if (Notification.permission === "granted") {
            new Notification("🕌 تذكير بالصلاة", {
              body: `صلاة ${prayer.name} بعد ${prayerSettings.preReminderMinutes} دقيقة`,
              icon: "/prayer-icon.png",
            });
          }
        }

        // Check for at-time reminder
        if (
          diff === 0 &&
          prayerSettings.atTimeReminderEnabled &&
          individualSettings.atTime
        ) {
          setCurrentPrayer(prayer.name);
          setIsPreReminder(false);
          setShowPopup(true);
          audioRef.current?.play();

          if (Notification.permission === "granted") {
            new Notification("🕌 وقت الصلاة", {
              body: `حان الآن وقت صلاة ${prayer.name}`,
              icon: "/prayer-icon.png",
            });
          }
        }
      });
    }, 60 * 1000); // every minute

    return () => clearInterval(interval);
  }, [prayerSettings, rawPrayerTimes]);

  // Auto-hide popup after 10 seconds
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
      exit={{ opacity: 0, y: 100 }}
      className="fixed bottom-5 left-1/2 z-50 transform -translate-x-1/2 w-full max-w-[95vw] md:max-w-md bg-card/95 dark:bg-card/90 backdrop-blur-md rounded-xl shadow-2xl border border-border/50 flex items-center gap-4 p-5"
    >
      <div className="flex-shrink-0">
        <Image
          src="/prayer-icon.png"
          width={50}
          height={50}
          alt="prayer"
          className="drop-shadow-lg"
        />
      </div>
      <div className="flex-1">
        <p className="font-bold text-lg text-primary mb-1">
          {isPreReminder ? "🔔 تذكير بالصلاة" : "🕌 وقت الصلاة"}
        </p>
        <p className="text-sm text-primary/90">
          {isPreReminder
            ? `صلاة ${currentPrayer ? PrayerNameMap[currentPrayer] : ""} بعد ${prayerSettings.preReminderMinutes} دقيقة`
            : `حان الآن وقت صلاة ${currentPrayer ? PrayerNameMap[currentPrayer] : ""}`}
        </p>
      </div>
      <button
        onClick={() => setShowPopup(false)}
        className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="إغلاق"
      >
        ✕
      </button>
    </motion.div>
  );

  return createPortal(popup, document.body);
};

export default PrayerReminder;

