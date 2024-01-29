"use client";

import React, { useState } from "react";
import TimeDayPicker from "@/components/DayTimePicker/TimeDayPicker";
import "./Home.css";

export default function Home() {
  const [showTimeDayPicker, setShowTimeDayPicker] = useState(true);

  return (
    <div className="container">{showTimeDayPicker && <TimeDayPicker />}</div>
  );
}
