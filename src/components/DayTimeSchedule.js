"use client"

import DayTimeScheduler from '@captainwalterdev/daytimescheduler'
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fakeRequest } from './fakeRequest';
import { API_BASE_URL } from '@/config/constants'

const StyledTimePickerContainer = styled.div`
    width: fit-content;
    margin: 0 auto;
    padding: 14px;
    background-color: #f0fff;
    border-radius: 8px;
    box-shadow: 0 2px 24px rgba(0, 0, 0, 0.1);
`;

function customTimeSlotValidator(slotTime, availabilityStartTime, availabilityEndTime) {
    const startTime = new Date(slotTime);
    const availabilityStart = new Date(slotTime);
    const availabilityEnd = new Date(slotTime);

    const [startHour, startMinute] = availabilityStartTime.split(':');
    const [endHour, endMinute] = availabilityEndTime.split(':');

    availabilityStart.setHours(parseInt(startHour, 10), parseInt(startMinute, 10), 0, 0);
    availabilityEnd.setHours(parseInt(endHour, 10), parseInt(endMinute, 10), 0, 0);

    const dayOfWeek = startTime.getDay();
    // const isDaySelected = selectedValidDays[getDayName(dayOfWeek)];

    // return isDaySelected && slotTime >= availabilityStart && slotTime <= availabilityEnd;
    return slotTime >= availabilityStart && slotTime <= availabilityEnd;
}

function getDayName(dayIndex) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
}


function DayTimeSchedule({ timeSlotSizeMinutes, availabilityStartTime, selectedValidDays, availabilityEndTime }) {
    const [isScheduling, setIsScheduling] = useState(false);
    const [isScheduled, setIsScheduled] = useState(false);
    const [scheduleErr, setScheduleErr] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    // const selectedDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

    const trueDaysArray = Object.keys(selectedValidDays).filter(day => selectedValidDays[day]);
    const selectedDays = trueDaysArray;
    // console.log(selectedDays)

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

    // console.log(API_BASE_URL)
    return (
        <>
            <div className="">
                <StyledTimePickerContainer>
                    {isLoading ? (
                        <div>Loading...</div>
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
                {/* {API_BASE_URL} */}
            </div>
        </>
    )
}

export default DayTimeSchedule