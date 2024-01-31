"use client";

import React, { useState, useEffect } from 'react';
import { StyledTimePickerContainer } from "@/components/style components/StylesDayTimeSchedule";
import DayTimeScheduler from '@captainwalterdev/daytimescheduler';
import { fakeRequest } from './fakeRequest';

function DayTimeSchedule({ timeSlotSizeMinutes, availabilityStartTime, availabilityEndTime }) {
    const [isScheduling, setIsScheduling] = useState(false);
    const [isScheduled, setIsScheduled] = useState(false);
    const [scheduleErr, setScheduleErr] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDays, setSelectedDays] = useState([])

    useEffect(() => {
        const loadingTimeout = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        // Dynamically generate the selectedDays array based on allowedDates
        const selectedDays = allowedDates.map(dateString => getDayName(dateString));

        setSelectedDays(selectedDays);

        return () => {
            clearTimeout(loadingTimeout);
        };
    }, []);

    const handleScheduled = (date) => {
        setIsScheduling(true);
        setScheduleErr('');
        console.log("date in handleScheduled", date)
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

    const allowedDates = ['2024-02-01', '2024-02-02', '2024-02-03', '2024-02-04', '2024-02-05'];
    const allowedTimeRanges = [
        [10, 0, 12, 0],  // Morning: 10:00 to 12:00
        [14, 0, 20, 0]   // Afternoon: 14:00 to 20:00
    ];

    function getDayName(dateString) {
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const date = new Date(dateString);
        const dayIndex = date.getDay();
        return dayNames[dayIndex];
    }

    function timeSlotValidator(slotTime, allowedDates, allowedTimeRanges) {
        const dayName = getDayName(slotTime.toISOString().split('T')[0]);
        const isDayValid = allowedDates.includes(dayName);
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

    return (
        <div className="" style={{ display: "flex" }}>
            <div className="dropdown" style={{ minWidth: "300px", marginRight: "10px" }}>

            </div>
            <StyledTimePickerContainer>
                {isLoading ? (
                    <div style={{ padding: "1rem" }}>Loading...</div>
                ) : (
                    <>
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
