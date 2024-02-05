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

function TimeDatePicker() {
  const [isLoading, setIsLoading] = useState(true);
  const [timeSlotSizeMinutes, setTimeSlotSizeMinutes] = useState(15);
  const [selectedDate, setSelectedDate] = useState("");
  const [timeRanges, setTimeRanges] = useState([]);
  const [dateAndRanges, setDateAndRanges] = useState([]);
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const dateAndRanges2 = [
    {
      date: new Date("2024-02-08"),
      timeRanges: [
        [0, 0, 12, 0],
        [14, 0, 18, 0],
      ],
    },
    {
      date: new Date("2024-02-10"),
      timeRanges: [
        [10, 0, 13, 0],
        [15, 0, 19, 0],
      ],
    },
  ];

  const handleApplyButtonClick = async () => {
    // Perform actions on applying selected dates and time ranges
    console.log("Selected Dates:", selectedDates);
    console.log("Selected Time Ranges:", selectedTimeRanges);
  };

  const handleAddTimeRange = () => {
    if (rangeStart && rangeEnd) {
      setTimeRanges([
        ...timeRanges,
        [parseInt(rangeStart), parseInt(rangeEnd)],
      ]);
      setRangeStart("");
      setRangeEnd("");
    }
  };

  const handleAddSelectedDate = () => {
    if (selectedDate && timeRanges.length > 0) {
      const newDateAndRange = {
        date: new Date(selectedDate),
        timeRanges,
      };
      setDateAndRanges([...dateAndRanges, newDateAndRange]);
      setSelectedDate("");
      setTimeRanges([]);
    }
  };

  const allowedDates = dateAndRanges.map(({ date }) => date);

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
                        Select Time Range (Start):
                        <input
                          type="number"
                          placeholder="Start"
                          value={rangeStart}
                          onChange={(e) => setRangeStart(e.target.value)}
                        />
                      </label>
                      <label>
                        Select Time Range (End):
                        <input
                          type="number"
                          placeholder="End"
                          value={rangeEnd}
                          onChange={(e) => setRangeEnd(e.target.value)}
                        />
                      </label>
                      <button onClick={handleAddTimeRange}>
                        Add Time Range
                      </button>
                    </div>
                  </div>
                  <div>
                    <AddButton>
                      <button onClick={handleAddSelectedDate}>Add Date</button>
                    </AddButton>
                  </div>
                  <div>
                    <h3>Selected Dates:</h3>
                    <ul>
                      {dateAndRanges.map(({ date }) => (
                        <li key={date.toISOString()}>{date.toDateString()}</li>
                      ))}
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
                  dateAndRanges={dateAndRanges2}
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
