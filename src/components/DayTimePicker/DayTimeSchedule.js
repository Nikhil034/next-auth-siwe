"use client"

import React, { useState, useEffect } from 'react';
import Select from "react-select";
import { StyledTimePickerContainer } from "@/components/style components/StylesDayTimeSchedule";
import DayTimeScheduler from '@captainwalterdev/daytimescheduler';
import { fakeRequest } from './fakeRequest';
import { API_BASE_URL } from '@/config/constants';
import timezonesData from "../../config/timezones.json";

function customTimeSlotValidator(slotTime, availabilityStartTime, availabilityEndTime) {
    const startTime = new Date(slotTime);
    const availabilityStart = new Date(slotTime);
    const availabilityEnd = new Date(slotTime);

    const [startHour, startMinute] = availabilityStartTime.split(':');
    const [endHour, endMinute] = availabilityEndTime.split(':');

    availabilityStart.setHours(parseInt(startHour, 10), parseInt(startMinute, 10), 0, 0);
    availabilityEnd.setHours(parseInt(endHour, 10), parseInt(endMinute, 10), 0, 0);

    return slotTime >= availabilityStart && slotTime <= availabilityEnd;
}

function DayTimeSchedule({ timeSlotSizeMinutes, availabilityStartTime, selectedValidDays, availabilityEndTime }) {
    const [isScheduling, setIsScheduling] = useState(false);
    const [isScheduled, setIsScheduled] = useState(false);
    const [scheduleErr, setScheduleErr] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState(null);

    const trueDaysArray = Object.keys(selectedValidDays).filter(day => selectedValidDays[day]);
    const selectedDays = trueDaysArray;

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

    const handleScheduled = (date) => {
        setIsScheduling(true);
        setScheduleErr('');

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
        <div className="">
            <div className="dropdown">
                <label>
                    <span>Select Time Zone:</span>
                    <Select
                        value={selectedOption}
                        onChange={handleSearchChange}
                        options={options}
                        isSearchable
                    />
                </label>
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
                            timeSlotValidator={(slotTime) =>
                                customTimeSlotValidator(slotTime, availabilityStartTime, availabilityEndTime)
                            }
                        />
                    </>
                )}
            </StyledTimePickerContainer>
        </div>
    );
}

export default DayTimeSchedule;