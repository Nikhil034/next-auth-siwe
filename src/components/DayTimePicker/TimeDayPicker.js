"use client";

import React, { useState, useEffect } from "react";
import moment from "moment-timezone";

import Select from "react-select";
import DayTimeSchedule from "./DayTimeSchedule";
import {
  StyledTimeDayPicker,
  StyledSection,
  StyledButton,
  StyledDropdown,
  StyledToggle
} from "@/components/style components/StylesTimeDayPicker";
import timezonesData from "../../config/timezones.json";

function TimeDayPicker() {
  const [tempTimeSlotSizeMinutes, setTempTimeSlotSizeMinutes] = useState(30);
  const [tempAvailabilityStartTime, setTempAvailabilityStartTime] =
    useState("10:00");
  const [tempAvailabilityEndTime, setTempAvailabilityEndTime] =
    useState("18:00");
  const [tempSelectedDays, setTempSelectedDays] = useState({
    sunday: false,
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
  });

  const [timeSlotSizeMinutes, setTimeSlotSizeMinutes] = useState(30);
  const [jsonData, setJsonData] = useState(null);
  const [availabilityStartTime, setAvailabilityStartTime] = useState("10:00");
  const [availabilityEndTime, setAvailabilityEndTime] = useState("18:00");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDays, setSelectedDays] = useState({
    sunday: false,
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
  });
  const [selectedOption, setSelectedOption] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  const options = timezonesData.map((timezone) => ({
    value: timezone.name,
    label: `${timezone.name} (${timezone.offset})`,
  }));

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      clearTimeout(loadingTimeout);
    };
  }, []);
  // const getZones = async () => {
  //   const zones = moment.tz.names();
  //   console.log(zones);
  // };

  const handleTimeSlotChange = (event) => {
    setTempTimeSlotSizeMinutes(parseInt(event.target.value, 10));
  };

  const handleAvailabilityStartTimeChange = (event) => {
    setTempAvailabilityStartTime(event.target.value);
  };

  const handleAvailabilityEndTimeChange = (event) => {
    setTempAvailabilityEndTime(event.target.value);
  };

  const handleDayCheckboxChange = (day) => {
    setTempSelectedDays((prevSelectedDays) => ({
      ...prevSelectedDays,
      [day]: !prevSelectedDays[day],
    }));
  };

  const handleDayToggle = (day) => {
    setTempSelectedDays((prevSelectedDays) => ({
      ...prevSelectedDays,
      [day]: !prevSelectedDays[day],
    }));
  };

  //   const handleApplyButtonClick = () => {
  //     setTimeSlotSizeMinutes(tempTimeSlotSizeMinutes);
  //     setAvailabilityStartTime(tempAvailabilityStartTime);
  //     setAvailabilityEndTime(tempAvailabilityEndTime);
  //     setSelectedDays(tempSelectedDays);
  //   };

  const handleApplyButtonClick = () => {
    // Convert availability start and end times to UTC based on the selected timezone
    const userTimezone = selectedOption ? selectedOption.value : "UTC";

    // Format the time string to HH:mm:ss
    const formattedStartTime = moment(
      tempAvailabilityStartTime,
      "HH:mm"
    ).format("HH:mm:ss");
    const formattedEndTime = moment(tempAvailabilityEndTime, "HH:mm").format(
      "HH:mm:ss"
    );

    // Combine the formatted time with the date (using a dummy date)
    const combinedStartTime = moment(`2000-01-01 ${formattedStartTime}`).tz(
      userTimezone
    );
    const combinedEndTime = moment(`2000-01-01 ${formattedEndTime}`).tz(
      userTimezone
    );

    // Extract the time part in UTC format
    const availabilityStartTimeUTC = combinedStartTime.utc().format("HH:mm");
    const availabilityEndTimeUTC = combinedEndTime.utc().format("HH:mm");

    const data = {
      timeSlotSizeMinutes: tempTimeSlotSizeMinutes,
      availabilityStartTime: availabilityStartTimeUTC,
      availabilityEndTime: availabilityEndTimeUTC,
      selectedDays: tempSelectedDays,
      selectedTimeZone: userTimezone,
    };

    // Store data in the database, perform other actions...

    setTimeSlotSizeMinutes(tempTimeSlotSizeMinutes);
    setAvailabilityStartTime(availabilityStartTimeUTC);
    setAvailabilityEndTime(availabilityEndTimeUTC);
    setSelectedDays(tempSelectedDays);

    console.log(data);
  };
  return (
    <>
      <div className="">
        {isLoading ? (
          <StyledTimeDayPicker>
            <div>Loading...</div>
          </StyledTimeDayPicker>
        ) : (
          <>
            <StyledTimeDayPicker>
              <div className="dropdown">
                <StyledDropdown>
                  <label>
                    <span>
                      Select Time Zone:
                    </span>
                    <Select
                      value={selectedOption}
                      onChange={handleSearchChange}
                      options={options}
                      isSearchable
                    />
                  </label>
                </StyledDropdown>
                <div>
                  <StyledSection>
                    <label>
                      Select Time Slot Size:
                      <select
                        value={tempTimeSlotSizeMinutes}
                        onChange={handleTimeSlotChange}
                      >
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={45}>45 minutes</option>
                        <option value={60}>60 minutes</option>
                      </select>
                    </label>
                  </StyledSection>
                </div>
                <div>
                  <StyledSection>
                    <label>
                      Select Availability Time:
                      <input
                        type="time"
                        value={tempAvailabilityStartTime}
                        onChange={handleAvailabilityStartTimeChange}
                      />
                      &nbsp;to&nbsp;
                      <input
                        type="time"
                        value={tempAvailabilityEndTime}
                        onChange={handleAvailabilityEndTimeChange}
                      />
                    </label>
                  </StyledSection>
                </div>
                <div>
                  <StyledToggle>
                    <label>Select Availability Days:</label>
                    <div className="toggle-switches">
                      {Object.keys(tempSelectedDays).map((day) => (
                        <div key={day} className="toggle-switch">
                          <span>{day}</span>
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={tempSelectedDays[day]}
                              onChange={() => handleDayToggle(day)}
                            />
                            <span className="slider"></span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </StyledToggle>
                </div>
                <StyledButton onClick={handleApplyButtonClick}>
                  Apply
                </StyledButton>
              </div>
              <div className="flex justify-between mt-4 ml-[10rem]">
                <DayTimeSchedule
                  timeSlotSizeMinutes={timeSlotSizeMinutes}
                  availabilityStartTime={availabilityStartTime}
                  availabilityEndTime={availabilityEndTime}
                  selectedValidDays={selectedDays}
                />
              </div>
            </StyledTimeDayPicker>
          </>
        )}
      </div>
      {/* <button onClick={getZones()}> papita</button> */}
    </>
  );
}

export default TimeDayPicker;
