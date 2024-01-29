"use client";

import React, { useState } from "react";
import TimeDayPicker from "@/components/DayTimePicker/TimeDayPicker";
import "./Home.css";

export default function Home() {
  const [showTimeDayPicker, setShowTimeDayPicker] = useState(true);
  const [showDatetimePicker, setShowDatetimePicker] = useState(false);

  return (
    <div className="container">
      <button
        className={`toggle-btn ${showTimeDayPicker ? "active" : ""}`}
        onClick={() => {
          setShowTimeDayPicker(true);
          setShowDatetimePicker(false);
        }}
      >
        TimeDayPicker (OLD Library)
      </button>
      <button
        className={`toggle-btn ${showDatetimePicker ? "active" : ""}`}
        onClick={() => {
          setShowDatetimePicker(true);
          setShowTimeDayPicker(false);
        }}
      >
        DatetimePicker (NEW Library)
      </button>

      {showTimeDayPicker && <TimeDayPicker />}
    </div>
  );
}
