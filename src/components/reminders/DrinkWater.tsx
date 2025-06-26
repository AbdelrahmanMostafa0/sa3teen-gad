"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { updateWaterReminder } from "@/store/features/settingsSlice";
import Image from "next/image";
import { createPortal } from "react-dom";

const DrinkWater = () => {
  const isReminderEnabled = useSelector(
    (state: RootState) => state.Settings.isWaterReminderOn
  );
  const dispatch = useDispatch<AppDispatch>();

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const waterReminder = localStorage.getItem("isWaterReminderEnabled");
    if (waterReminder !== undefined && waterReminder !== null) {
      dispatch(updateWaterReminder(JSON.parse(waterReminder)));
    }
  }, [dispatch]);

  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted" && !isReminderEnabled) {
        const interval = setInterval(() => {
          new Notification("💧 Reminder", {
            body: "Drink some water!",
          });
        }, 20 * 60 * 1000);

        return () => clearInterval(interval);
      }
    });
  }, [isReminderEnabled]);

  useEffect(() => {
    if (!isReminderEnabled) {
      const interval = setInterval(() => {
        setShowPopup(true);

        setTimeout(() => setShowPopup(false), 5000);
      }, 20 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [isReminderEnabled]);

  if (!showPopup) return null;

  const waterPopup = (
    <div className="fixed bottom-5 left-1/2 sm:left-auto sm:right-5 transform -translate-x-1/2 sm:translate-x-0 p-4 px-7 sm:w-fit w-full max-w-[95vw] pl-9 rounded-xl mx-auto bg-white z-10 flex items-center sm:justify-start justify-center shadow-lg">
      <Image
        src={"/water-cooler.png"}
        width={50}
        height={50}
        alt="water-cooler"
        className="mr-3"
      />
      <p className="font-bold">بفكرك تشرب ماية عشان صحتك ياجميل</p>
    </div>
  );

  return createPortal(waterPopup, document.body);
};

export default DrinkWater;
