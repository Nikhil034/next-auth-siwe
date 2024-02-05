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
  const [dateAndRanges, setDateAndRanges] = useState([]);
  const [startHour, setStartHour] = useState("");
  const [startMinute, setStartMinute] = useState("");
  const [endHour, setEndHour] = useState("");
  const [endMinute, setEndMinute] = useState("");

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleApplyButtonClick = async () => {
    console.log("Selected Dates:", selectedDate);
  };

  const handleAddSelectedDate = () => {
    if (selectedDate && startHour && startMinute && endHour && endMinute) {
      const newDateAndRange = {
        date: new Date(selectedDate),
        timeRanges: [
          [
            parseInt(startHour) || 0,
            parseInt(startMinute) || 0,
            parseInt(endHour) || 0,
            parseInt(endMinute) || 0,
          ],
        ],
      };

      setDateAndRanges([...dateAndRanges, newDateAndRange]);
      setSelectedDate("");
      setStartHour("");
      setStartMinute("");
      setEndHour("");
      setEndMinute("");
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
                        {/* Start Hour: */}
                        <input
                          type="number"
                          placeholder="Start Hour"
                          value={startHour}
                          onChange={(e) => setStartHour(e.target.value)}
                          style={{ border: "1px solid black", margin: "2px" }}
                          min="0"
                          max="24"
                        />
                      </label>
                      <label>
                        {/* Start Minute: */}
                        <input
                          type="number"
                          placeholder="Start Minute"
                          value={startMinute}
                          onChange={(e) => setStartMinute(e.target.value)}
                          style={{ border: "1px solid black", margin: "2px" }}
                          min="0"
                          max="60"
                        />
                      </label>
                      <label>
                        {/* End Hour: */}
                        <input
                          type="number"
                          placeholder="End Hour"
                          value={endHour}
                          onChange={(e) => setEndHour(e.target.value)}
                          style={{ border: "1px solid black", margin: "2px" }}
                          min="0"
                          max="24"
                        />
                      </label>
                      <label>
                        {/* End Minute: */}
                        <input
                          type="number"
                          placeholder="End Minute"
                          value={endMinute}
                          onChange={(e) => setEndMinute(e.target.value)}
                          style={{ border: "1px solid black", margin: "2px" }}
                          min="0"
                          max="60"
                        />
                      </label>
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
                      {dateAndRanges.map(({ date, timeRanges }) => (
                        <li key={date.toISOString()}>
                          {date.toDateString()} - Time Range: [
                          {timeRanges[0][0]}, {timeRanges[0][1]},{" "}
                          {timeRanges[0][2]}, {timeRanges[0][3]}]
                        </li>
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
