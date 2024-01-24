"use client"

import DayTimeScheduler from '@captainwalterdev/daytimescheduler'
import React, { useState, useEffect } from 'react';
import { fakeRequest } from './fakeRequest';
import { API_BASE_URL } from '@/config/constants'
import { StyledTimePickerContainer } from "@/components/style components/StylesDayTimeSchedule"

function customTimeSlotValidator(slotTime, availabilityStartTime, availabilityEndTime) {
    // console.log("slotTime", slotTime)
    // console.log("availabilityStartTime", availabilityStartTime)
    // console.log("availabilityEndTime", availabilityEndTime)

    const startTime = new Date(slotTime);
    const availabilityStart = new Date(slotTime);
    const availabilityEnd = new Date(slotTime);

    const [startHour, startMinute] = availabilityStartTime.split(':');
    const [endHour, endMinute] = availabilityEndTime.split(':');

    availabilityStart.setHours(parseInt(startHour, 10), parseInt(startMinute, 10), 0, 0);
    availabilityEnd.setHours(parseInt(endHour, 10), parseInt(endMinute, 10), 0, 0);

    const dayOfWeek = startTime.getDay();

    // console.log("availabilityStart", availabilityStart)
    // console.log("availabilityEnd", availabilityEnd)
    return slotTime >= availabilityStart && slotTime <= availabilityEnd;
}


function DayTimeSchedule({ timeSlotSizeMinutes, availabilityStartTime, selectedValidDays, availabilityEndTime }) {
    const [isScheduling, setIsScheduling] = useState(false);
    const [isScheduled, setIsScheduled] = useState(false);
    const [scheduleErr, setScheduleErr] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const trueDaysArray = Object.keys(selectedValidDays).filter(day => selectedValidDays[day]);
    const selectedDays = trueDaysArray;

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
        // console.log(date);

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

    return (
        <>
            <div className="">
                <StyledTimePickerContainer>
                    {isLoading ? (
                        <div style={{ padding: "1rem" }}>Loading...</div>
                    ) : (
                        <DayTimeScheduler
                            selectedDays={selectedDays}
                            timeSlotSizeMinutes={timeSlotSizeMinutes}
                            isLoading={isScheduling}
                            isDone={isScheduled}
                            err={scheduleErr}
                            onConfirm={handleScheduled}
                            timeSlotValidator={(slotTime) =>
                                customTimeSlotValidator(slotTime, availabilityStartTime, availabilityEndTime)
                            }
                        />
                    )}
                </StyledTimePickerContainer>
            </div>
        </>
    )
}

export default DayTimeSchedule