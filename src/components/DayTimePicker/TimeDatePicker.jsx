"use client";

import React, { useState, useEffect } from "react";
import DayTimeSchedule from "./DayTimeSchedule.js";
import {
  StyledTimeDayPicker,
  StyledSection,
  StyledButton,
} from "@/components/style components/StylesTimeDayPicker";
import {
  AddButton,
  RemoveButton,
} from "@/components/style components/StylesTimeDayPicker.js";
import { DateTime, Duration } from "luxon";
import { useAccount } from "wagmi";

function TimeDatePicker() {
  const address = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  const [timeSlotSizeMinutes, setTimeSlotSizeMinutes] = useState(15);
  const [selectedDate, setSelectedDate] = useState("");
  const [dateAndRanges, setDateAndRanges] = useState([]);
  const [startHour, setStartHour] = useState("");
  const [startMinute, setStartMinute] = useState("");
  const [endHour, setEndHour] = useState("");
  const [endMinute, setEndMinute] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [allowedDates, setAllowedDates] = useState([]);

  const [utcStartTime, setUtcStartTime] = useState("");
  const [utcEndTime, setUtcEndTime] = useState("");

  const [combinedStart, setCombinedStart] = useState("");

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const getLocalTimeFromUTC = (utcTimeString) => {
    console.log("utcTimeString", utcTimeString);
    const utcDateTime = new Date(utcTimeString);
    console.log("utcDateTime", utcDateTime);
    const localDateTime = new Date(
      utcDateTime.toLocaleString(undefined, {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
    );
    return localDateTime;
  };

  const handleApplyButtonClick = async () => {
    console.log("handleApplyButton call");

    const result = await getUTCTime(
      selectedDate,
      startHour,
      startMinute,
      endHour,
      endMinute
    );

    console.log("result from getUTCTime", result);

    const newDateAndRange = {
      date: selectedDate,
      timeRanges: [
        [
          result.startHourTime,
          result.startMinuteTime,
          result.endHourTime,
          result.endMinuteTime,
        ],
      ],
    };

    const dataToStore = {
      userAddress: address,
      timeSlotSizeMinutes: timeSlotSizeMinutes,
      allowedDates: selectedDate,
      dateAndRanges: newDateAndRange,
      UTCDateAndStartTime: result.formattedUTCTime_startTime,
      UTCStartTime: result.utcTime_startTime,
      UTCDateAndEndTime: result.formattedUTCTime_endTime,
      UTCEndTime: result.utcTime_endTime,
    };

    console.log("dataToStore", dataToStore);
  };

  const getUTCTime = async (
    selectedDate,
    startHour,
    startMinute,
    endHour,
    endMinute
  ) => {
    // const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // console.log("userTimezone", userTimezone);

    const combinedDateTimeString_startTime = `${selectedDate} ${startHour}:${startMinute}:00`;
    setCombinedStart(combinedDateTimeString_startTime);
    const localDateTime_startTime = new Date(combinedDateTimeString_startTime);
    // console.log("localDateTime_startTime", localDateTime_startTime);

    const utcDateTime_startTime = localDateTime_startTime.toUTCString();
    // console.log("utcDateTime_startTime", utcDateTime_startTime);

    const formattedUTCTime_startTime = utcDateTime_startTime.toLocaleString(
      "en-US",
      { timeZone: "UTC" }
    );
    // console.log("formattedUTCTime_startTime", formattedUTCTime_startTime);

    const utcFromFormatTime_startTime = DateTime.fromFormat(
      formattedUTCTime_startTime,
      "EEE, dd MMM yyyy HH:mm:ss 'GMT'"
    );
    const utcTime_startTime = utcFromFormatTime_startTime.toFormat("HH:mm");
    setUtcStartTime(utcTime_startTime);
    // console.log("utcTime_startTime", utcTime_startTime);
    const [startHourTime, startMinuteTime] = utcTime_startTime.split(":");
    //----------------------------------------------------------------//
    const combinedDateTimeString_endTime = `${selectedDate} ${endHour}:${endMinute}:00`;
    const localDateTime_endTime = new Date(combinedDateTimeString_endTime);
    // console.log("localDateTime_endTime", localDateTime_endTime);

    const utcDateTime_endTime = localDateTime_endTime.toUTCString();
    // console.log("utcDateTime_endTime", utcDateTime_endTime);

    const formattedUTCTime_endTime = utcDateTime_endTime.toLocaleString(
      "en-US",
      { timeZone: "UTC" }
    );
    // console.log("formattedUTCTime_endTime", formattedUTCTime_endTime);

    const utcFromFormatTime_endTime = DateTime.fromFormat(
      formattedUTCTime_endTime,
      "EEE, dd MMM yyyy HH:mm:ss 'GMT'"
    );
    const utcTime_endTime = utcFromFormatTime_endTime.toFormat("HH:mm");
    setUtcEndTime(utcTime_endTime);
    // console.log("utcTime_endTime", utcTime_endTime);
    const [endHourTime, endMinuteTime] = utcTime_endTime.split(":");

    const result = {
      formattedUTCTime_startTime,
      utcTime_startTime,
      startHourTime,
      startMinuteTime,
      formattedUTCTime_endTime,
      utcTime_endTime,
      endHourTime,
      endMinuteTime,
    };
    return result;
  };

  // const handleAddSelectedDate = async () => {
  //   if (selectedDate && startHour && startMinute && endHour && endMinute) {
  //     console.log("selectedDate", selectedDate);
  //     const newDateAndRange = {
  //       date: new Date(selectedDate),
  //       timeRanges: [
  //         [
  //           parseInt(startHour) || "00",
  //           parseInt(startMinute) || "00",
  //           parseInt(endHour) || "00",
  //           parseInt(endMinute) || "00",
  //         ],
  //       ],
  //     };

  //     console.log("newDateAndRange", newDateAndRange);

  //     setDateAndRanges([...dateAndRanges, newDateAndRange]);
  //     setSelectedDate("");
  //     setStartHour("");
  //     setStartMinute("");
  //     setEndHour("");
  //     setEndMinute("");
  //   }
  // };

  // const allowedDates = dateAndRanges.map(({ date }) => date);

  return (
    <>
      <div className="">
        {isLoading ? (
          <StyledTimeDayPicker>
            <div>Loading...</div>
          </StyledTimeDayPicker>
        ) : (
          <>
            <div style={{ display: "flex" }}>
              <div>
                <div>
                  Selected Date: {selectedDate}
                  <br />
                  User Time: {startTime} - {endTime}
                  <br />
                  UTC Time: {utcStartTime} - {utcEndTime}
                </div>
                <StyledTimeDayPicker>
                  <div className="dropdown" style={{ minWidth: "25%" }}>
                    <div>
                      <StyledSection>
                        <label>
                          Select Time Slot Size:
                          <select
                            value={timeSlotSizeMinutes}
                            onChange={(e) =>
                              setTimeSlotSizeMinutes(Number(e.target.value))
                            }
                          >
                            <option value={15}>15 minutes</option>
                            <option value={30}>30 minutes</option>
                            <option value={45}>45 minutes</option>
                            <option value={60}>60 minutes</option>
                          </select>
                        </label>
                      </StyledSection>
                    </div>
                  </div>
                </StyledTimeDayPicker>
                <div
                  style={{
                    minWidth: "300px",
                    marginRight: "10px",
                    marginLeft: "22px",
                  }}
                >
                  <label>
                    Select Date:
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </label>
                  <div>
                    <div style={{ marginBottom: "5px" }}>
                      <label>
                        <input
                          type="time"
                          value={`${startHour}:${startMinute}`}
                          onChange={(e) => {
                            const [hour, minute] = e.target.value.split(":");
                            setStartHour(hour);
                            setStartMinute(minute);
                            setStartTime(e.target.value);
                          }}
                          style={{ border: "1px solid black", margin: "2px" }}
                        />
                      </label>
                      <label>
                        <input
                          type="time"
                          value={`${endHour}:${endMinute}`}
                          onChange={(e) => {
                            const [hour, minute] = e.target.value.split(":");
                            setEndHour(hour);
                            setEndMinute(minute);
                            setEndTime(e.target.value);
                          }}
                          style={{ border: "1px solid black", margin: "2px" }}
                        />
                      </label>
                    </div>
                  </div>
                  <div>
                    {/* <AddButton>
                      <button onClick={() => handleAddSelectedDate()}>
                        Add Date
                      </button>
                    </AddButton> */}
                  </div>
                  <div>
                    <h3>Selected Dates:</h3>
                    <ul>
                      {/* {dateAndRanges.map(({ date, timeRanges }) => (
                        <li key={date.toISOString()}>
                          {date.toDateString()} - Time Range: [
                          {timeRanges[0][0]}, {timeRanges[0][1]},{" "}
                          {timeRanges[0][2]}, {timeRanges[0][3]}]
                        </li>
                      ))} */}
                    </ul>
                  </div>
                  <StyledButton onClick={handleApplyButtonClick}>
                    Apply
                  </StyledButton>
                </div>
              </div>
              <div className="flex justify-between mt-4 ml-[10rem]">
                <DayTimeSchedule
                  timeSlotSizeMinutes={timeSlotSizeMinutes}
                  allowedDates={allowedDates}
                  // timeRanges={timeRanges}
                  dateAndRanges={dateAndRanges}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default TimeDatePicker;
