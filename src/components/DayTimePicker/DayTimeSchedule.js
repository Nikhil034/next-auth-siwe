"use client";

import React, { useState, useEffect } from "react";
import { StyledTimePickerContainer } from "@/components/style components/StylesDayTimeSchedule";
import DayTimeScheduler from "@captainwalterdev/daytimescheduler";
import { fakeRequest } from "./fakeRequest";
import { useAccount } from "wagmi";

function DayTimeSchedule() {
  const address = "0x3013bb4E03a7B81106D69C10710EaE148C8410E1";
  const [isScheduling, setIsScheduling] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleErr, setScheduleErr] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [APIData, setAPIData] = useState();

  useEffect(() => {
    getAvailability();
  }, []);

  const getAvailability = async () => {
    try {
      const response = await fetch(`/api/get-availability/${address}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      console.log("result", result);
      if (result.success) {
        setAPIData(result.data);
        setIsLoading(false); // Set loading to false once data is fetched
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const handleScheduled = (date) => {
    setIsScheduling(true);
    setScheduleErr("");
    console.log("date in handleScheduled", date);

    fakeRequest(date)
      .then((json) => {
        setScheduleErr("");
        setIsScheduled(true);
        console.log("fake response: ", json);
        setTimeout(() => {
          setIsScheduled(false);
        }, 2000);
      })
      .catch((err) => {
        setScheduleErr(err);
      })
      .finally(() => {
        setIsScheduling(false);
      });
  };

  const timeSlotSizeMinutes = 15;
  let dateAndRanges = [];
  let allowedDates = [];

  // Check if API data exists
  if (APIData) {
    // Extract dateAndRanges and allowedDates from API data
    APIData.forEach((item) => {
      dateAndRanges.push(...item.dateAndRanges); // Concatenate dateAndRanges arrays
      allowedDates.push(...item.allowedDates); // Concatenate allowedDates arrays
    });

    // Convert date strings to Date objects
    dateAndRanges.forEach((range) => {
      range.date = new Date(range.date);
    });
  }

  function timeSlotValidator(slotTime, dateAndRanges) {
    for (const { date, timeRanges } of dateAndRanges) {
      for (const [startHour, startMinute, endHour, endMinute] of timeRanges) {
        const startTime = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          startHour,
          startMinute,
          0
        );

        const endTime = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          endHour,
          endMinute,
          0
        );

        if (
          slotTime.getTime() >= startTime.getTime() &&
          slotTime.getTime() <= endTime.getTime()
        ) {
          return true; // Return true if the slot is valid for any allowed date and time range
        }
      }
    }

    return false; // Return false if the slot is not valid for any allowed date and time range
  }

  // Log UTC and local times
  // Log UTC and local times
  dateAndRanges.forEach((range) => {
    const startDateUTCString = `${range.date.toISOString().split("T")[0]}T${
      range.utcTime_startTime
    }:00Z`;
    const endDateUTCString = `${range.date.toISOString().split("T")[0]}T${
      range.utcTime_endTime
    }:00Z`;

    const startTimeUTC = new Date(startDateUTCString);
    const endTimeUTC = new Date(endDateUTCString);
    const startTimeLocal = startTimeUTC.toLocaleString();
    const endTimeLocal = endTimeUTC.toLocaleString();

    console.log("UTC Time Start:", range.utcTime_startTime);
    console.log("UTC Time End:", range.utcTime_endTime);
    console.log("Local Time Start:", startTimeLocal);
    console.log("Local Time End:", endTimeLocal);
  });

  return (
    <div className="" style={{ display: "flex" }}>
      <StyledTimePickerContainer>
        {isLoading ? (
          <div style={{ padding: "1rem" }}>Loading...</div>
        ) : (
          <>
            <DayTimeScheduler
              allowedDates={allowedDates}
              timeSlotSizeMinutes={timeSlotSizeMinutes}
              isLoading={isScheduling}
              isDone={isScheduled}
              err={scheduleErr}
              onConfirm={handleScheduled}
              timeSlotValidator={(slotTime) =>
                timeSlotValidator(slotTime, dateAndRanges)
              }
              dateAndRanges={dateAndRanges.map((range) => ({
                ...range,
                formattedUTCTime_startTime: new Date(
                  range.utcTime_startTime
                ).toLocaleString(),
                formattedUTCTime_endTime: new Date(
                  range.utcTime_endTime
                ).toLocaleString(),
              }))}
            />
          </>
        )}
      </StyledTimePickerContainer>
    </div>
  );
}

export default DayTimeSchedule;
