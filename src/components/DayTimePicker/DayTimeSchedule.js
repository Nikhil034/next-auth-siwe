"use client";

import React, { useState, useEffect } from 'react';
import { StyledTimePickerContainer, AddButton, RemoveButton } from "@/components/style components/StylesDayTimeSchedule";
import DayTimeScheduler from '@captainwalterdev/daytimescheduler';
import { fakeRequest } from './fakeRequest';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function DayTimeSchedule({ timeSlotSizeMinutes }) {
    const [isScheduling, setIsScheduling] = useState(false);
    const [isScheduled, setIsScheduled] = useState(false);
    const [scheduleErr, setScheduleErr] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDays, setSelectedDays] = useState([]);
    const [selectedDatePickerDate, setSelectedDatePickerDate] = useState(null);
    const [allowedDates, setAllowedDates] = useState([]);

    // const allowedDates = ['2024-02-01', '2024-02-02', '2024-02-03', '2024-02-05', '2024-02-06', '2024-02-08', '2024-02-14'];
    const allowedTimeRanges = [
        [10, 0, 12, 0],  // Morning: 10:00 to 12:00
        [14, 0, 20, 0]   // Afternoon: 14:00 to 20:00
    ];

    useEffect(() => {
        const loadingTimeout = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        // Dynamically generate the selectedDays array based on allowedDates
        const uniqueDays = getUniqueDaysFromDates(allowedDates);
        console.log(uniqueDays)
        setSelectedDays((prevSelectedDays) => {
            // Only update if there's a change to avoid infinite loop
            if (JSON.stringify(prevSelectedDays) !== JSON.stringify(uniqueDays)) {
                return uniqueDays;
            }
            return prevSelectedDays;
        });

        return () => {
            clearTimeout(loadingTimeout);
        };
    }, [allowedDates]); // Add allowedDates as a dependency to recalculate selectedDays when allowedDates change

    const handleScheduled = (date) => {
        setIsScheduling(true);
        setScheduleErr('');
        console.log("date in handleScheduled", date);
        fakeRequest(date)
            .then(json => {
                setScheduleErr('');
                setIsScheduled(true);
                console.log('fake response: ', json);
                setTimeout(() => {
                    setIsScheduled(false);
                }, 2000);
            })
            .catch(err => {
                setScheduleErr(err);
            })
            .finally(() => {
                setIsScheduling(false);
            });
    };

    function getDayName(dateString) {
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const date = new Date(dateString);
        const dayIndex = date.getDay();
        return dayNames[dayIndex];
    }

    function getUniqueDaysFromDates(dates) {
        console.log(dates)
        const uniqueDaysSet = new Set();

        dates.forEach(dateString => {
            const dayName = getDayName(dateString);
            uniqueDaysSet.add(dayName);
        });

        console.log(Array.from(uniqueDaysSet))
        return Array.from(uniqueDaysSet);
    }

    function timeSlotValidator(slotTime, allowedDates, allowedTimeRanges) {
        const formattedDate = slotTime.toISOString().split('T')[0];
        const isDateValid = allowedDates.includes(formattedDate);

        if (!isDateValid) {
            return false;  // Return false for slots on non-allowed dates
        }

        const dayName = getDayName(formattedDate);
        const isDayValid = selectedDays.includes(dayName);

        const isTimeValid = allowedTimeRanges.some(([startHour, startMinute, endHour, endMinute]) => {
            const startTime = new Date(
                slotTime.getFullYear(),
                slotTime.getMonth(),
                slotTime.getDate(),
                startHour,
                startMinute,
                0
            );
            const endTime = new Date(
                slotTime.getFullYear(),
                slotTime.getMonth(),
                slotTime.getDate(),
                endHour,
                endMinute,
                0
            );
            return slotTime.getTime() >= startTime.getTime() && slotTime.getTime() <= endTime.getTime();
        });

        return isDayValid && isTimeValid;
    }

    const handleDatePickerChange = (date) => {
        setSelectedDatePickerDate(date);
    };

    const handleAddSelectedDate = () => {
        if (selectedDatePickerDate) {
            const year = selectedDatePickerDate.getFullYear();
            const month = (selectedDatePickerDate.getMonth() + 1).toString().padStart(2, '0');
            const day = selectedDatePickerDate.getDate().toString().padStart(2, '0');

            const formattedDate = `${year}-${month}-${day}`;

            setAllowedDates(prevAllowedDates => [...prevAllowedDates, formattedDate]);
            setSelectedDatePickerDate(null);
        }
    };

    const handleRemoveSelectedDate = (dateToRemove) => {
        setAllowedDates(prevAllowedDates =>
            prevAllowedDates.filter(date => date !== dateToRemove)
        );
    };

    return (
        <div className="" style={{ display: "flex" }}>
            <div className="dropdown" style={{ minWidth: "300px", marginRight: "10px" }}>
                {console.log(selectedDatePickerDate)}
                <DatePicker
                    selected={selectedDatePickerDate}
                    onChange={handleDatePickerChange}
                    dateFormat="yyyy-MM-dd"
                    inline
                />
                <AddButton>
                    <button onClick={handleAddSelectedDate}>Add Date</button>
                </AddButton>

                <h3>Selected Dates:</h3>
                <ul>
                    {allowedDates.map((date, index) => (
                        <li key={index}>{date}
                            <RemoveButton>
                                <button onClick={() => handleRemoveSelectedDate(date)}>Remove</button>
                            </RemoveButton>
                        </li>
                    ))}
                </ul>
            </div>
            <StyledTimePickerContainer>
                {isLoading ? (
                    <div style={{ padding: "1rem" }}>Loading...</div>
                ) : (
                    <>
                        {console.log(selectedDays)}
                        <DayTimeScheduler
                            selectedDays={selectedDays}
                            timeSlotSizeMinutes={timeSlotSizeMinutes}
                            isLoading={isScheduling}
                            isDone={isScheduled}
                            err={scheduleErr}
                            onConfirm={handleScheduled}
                            timeSlotValidator={(slotTime) => timeSlotValidator(slotTime, allowedDates, allowedTimeRanges)}
                        />
                    </>
                )}
            </StyledTimePickerContainer>
        </div>
    );
}

export default DayTimeSchedule;
