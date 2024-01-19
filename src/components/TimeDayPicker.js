"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DayTimeSchedule from './DayTimeSchedule';

const StyledTimeDayPicker = styled.div`
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    width: 100%;
    box-sizing: border-box;
    font-family: 'Arial', sans-serif;
    display: flex
`;

const StyledSection = styled.div`
    margin-bottom: 20px;
    label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
    }

    select,
    input[type="time"] {
        width: 100%;
        padding: 8px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
    }

    input[type="checkbox"] {
        margin-right: 5px;
    }

    div {
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        &:last-child {
            margin-bottom: 0;
        }
    }
`;

const StyledButton = styled.button`
    background-color: #3498db;
    color: #fff;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;

    &:hover {
        background-color: #2980b9;
    }
`;

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

    const handleAPICall = async () => {
        const response = await fetch('api/hello/12', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ hello: 'hello', })
        });
        const result = await response.json();
        console.log("result", result);
    }

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
                            {/* <StyledButton onClick={handleAPICall}>Call</StyledButton> */}
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
