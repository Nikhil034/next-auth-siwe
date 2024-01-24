"use client";

import React, { useState, useEffect } from 'react';
import DayTimeSchedule from './DayTimeSchedule';
import { StyledTimeDayPicker, StyledSection, StyledButton } from "@/components/style components/StylesTimeDayPicker"

function TimeDayPicker() {
    const [tempTimeSlotSizeMinutes, setTempTimeSlotSizeMinutes] = useState(45);
    const [tempAvailabilityStartTime, setTempAvailabilityStartTime] = useState('10:00');
    const [tempAvailabilityEndTime, setTempAvailabilityEndTime] = useState('18:00');
    const [tempSelectedDays, setTempSelectedDays] = useState({
        sunday: false,
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
    });

    const [timeSlotSizeMinutes, setTimeSlotSizeMinutes] = useState(45);
    const [availabilityStartTime, setAvailabilityStartTime] = useState('10:00');
    const [availabilityEndTime, setAvailabilityEndTime] = useState('18:00');
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

    useEffect(() => {
        const loadingTimeout = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => {
            clearTimeout(loadingTimeout);
        };
    }, []);

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

    const handleApplyButtonClick = () => {
        setTimeSlotSizeMinutes(tempTimeSlotSizeMinutes);
        setAvailabilityStartTime(tempAvailabilityStartTime);
        setAvailabilityEndTime(tempAvailabilityEndTime);
        setSelectedDays(tempSelectedDays);
    };

    return (
        <>
            <div className="">
                {isLoading ? (
                    <StyledTimeDayPicker>
                        <div>Loading...</div>
                    </StyledTimeDayPicker>
                ) : (
                    <StyledTimeDayPicker>
                        <div className=''>
                            <div>
                                <StyledSection>
                                    <label>
                                        Select Time Slot Size:
                                        <select value={tempTimeSlotSizeMinutes} onChange={handleTimeSlotChange}>
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
                                        <input type="time" value={tempAvailabilityStartTime} onChange={handleAvailabilityStartTimeChange} />
                                        &nbsp;to&nbsp;
                                        <input type="time" value={tempAvailabilityEndTime} onChange={handleAvailabilityEndTimeChange} />
                                    </label>
                                </StyledSection>
                            </div>
                            <div>
                                <StyledSection>
                                    <label>Select Availability Days:</label>
                                    {Object.keys(tempSelectedDays).map((day) => (
                                        <div key={day}>
                                            <input
                                                type="checkbox"
                                                checked={tempSelectedDays[day]}
                                                onChange={() => handleDayCheckboxChange(day)}
                                            />
                                            {day}
                                        </div>
                                    ))}
                                </StyledSection>
                            </div>
                            <StyledButton onClick={handleApplyButtonClick}>Apply</StyledButton>
                        </div>
                        <div className='flex justify-between mt-4 ml-[13rem]'>
                            <DayTimeSchedule
                                timeSlotSizeMinutes={timeSlotSizeMinutes}
                                availabilityStartTime={availabilityStartTime}
                                availabilityEndTime={availabilityEndTime}
                                selectedValidDays={selectedDays}
                            />
                        </div>
                    </StyledTimeDayPicker>
                )}
            </div>
        </>
    );
}

export default TimeDayPicker;
