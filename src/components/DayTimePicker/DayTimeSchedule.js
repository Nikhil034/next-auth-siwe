"use client";

import React, { useState, useEffect } from 'react';
import { StyledTimePickerContainer, } from "@/components/style components/StylesDayTimeSchedule";
import DayTimeScheduler from '@captainwalterdev/daytimescheduler';
import { fakeRequest } from './fakeRequest';

// function DayTimeSchedule({ timeSlotSizeMinutes, allowedDates, dateAndRanges }) {
function DayTimeSchedule() {
    const [isScheduling, setIsScheduling] = useState(false);
    const [isScheduled, setIsScheduled] = useState(false);
    const [scheduleErr, setScheduleErr] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadingTimeout = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => {
            clearTimeout(loadingTimeout);
        };
    }, []);

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

    const timeSlotSizeMinutes = 15;

    const dateAndRanges = [
        {
            date: new Date('2024-02-11'),
            timeRanges: [[9, 0, 12, 0]],
            formattedUTCTime_startTime: "Sun, 11 Feb 2024 09:00:00 GMT",
            utcTime_startTime: "09:00",
            formattedUTCTime_endTime: "Sun, 11 Feb 2024 12:00:00 GMT",
            utcTime_endTime: "12:00"
        },
        {
            date: new Date("2024-02-22"),
            timeRanges: [[10, 0, 13, 0]],
            formattedUTCTime_startTime: "Thu, 22 Feb 2024 10:00:00 GMT",
            utcTime_startTime: "10:00",
            formattedUTCTime_endTime: "Thu, 22 Feb 2024 13:00:00 GMT",
            utcTime_endTime: "13:00"
        },
    ];

    const allowedDates = dateAndRanges.map(({ date }) => date);


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
                            // timeSlotValidator={(slotTime) => timeSlotValidator(slotTime, allowedDates, timeRanges)}
                            timeSlotValidator={(slotTime) => timeSlotValidator(slotTime, dateAndRanges)}
                        />
                    </>
                )}
            </StyledTimePickerContainer>
        </div >
    );
}

export default DayTimeSchedule;