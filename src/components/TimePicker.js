"use client";

import React, { useState, useEffect } from 'react';
// import DayTimePicker from '@mooncake-dev/react-day-time-picker';
import styled from 'styled-components';
import { fakeRequest } from './fakeRequest';

function DayTimePicker() {
    console.log("Hello");
}

const StyledTimePickerContainer = styled.div`
    width: fit-content;
    margin: 0 auto;
    padding: 20px;
    background-color: #f0fff;
    border-radius: 8px;
    box-shadow: 0 2px 24px rgba(0, 0, 0, 0.1);
`;

function customTimeSlotValidator(slotTime, selectedDays, availabilityStartTime, availabilityEndTime) {
    const startTime = new Date(slotTime);
    const availabilityStart = new Date(slotTime);
    const availabilityEnd = new Date(slotTime);

    const [startHour, startMinute] = availabilityStartTime.split(':');
    const [endHour, endMinute] = availabilityEndTime.split(':');

    availabilityStart.setHours(parseInt(startHour, 10), parseInt(startMinute, 10), 0, 0);
    availabilityEnd.setHours(parseInt(endHour, 10), parseInt(endMinute, 10), 0, 0);

    const dayOfWeek = startTime.getDay();
    const isDaySelected = selectedDays[getDayName(dayOfWeek)];

    return isDaySelected && slotTime >= availabilityStart && slotTime <= availabilityEnd;
}

function getDayName(dayIndex) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[dayIndex];
}

function TimePicker({ timeSlotSizeMinutes, availabilityStartTime, availabilityEndTime, selectedDays }) {
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
        console.log(date);

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
                        <div>Loading...</div>
                    ) : (
                        <DayTimePicker
                            timeSlotSizeMinutes={timeSlotSizeMinutes}
                            isLoading={isScheduling}
                            isDone={isScheduled}
                            err={scheduleErr}
                            onConfirm={handleScheduled}
                            timeSlotValidator={(slotTime) =>
                                customTimeSlotValidator(slotTime, selectedDays, availabilityStartTime, availabilityEndTime)
                            }
                        />
                    )}
                </StyledTimePickerContainer>
            </div>
        </>
    );
}

export default TimePicker;
