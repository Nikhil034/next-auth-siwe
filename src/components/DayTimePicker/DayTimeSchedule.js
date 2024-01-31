"use client";

import React, { useState, useEffect } from 'react';
import Select from "react-select";
import moment from 'moment-timezone';
import { StyledTimePickerContainer } from "@/components/style components/StylesDayTimeSchedule";
import DayTimeScheduler from '@captainwalterdev/daytimescheduler';
import { fakeRequest } from './fakeRequest';
import { API_BASE_URL } from '@/config/constants';
import timezonesData from "../../config/timezones.json";

function customTimeSlotValidator(slotTime, availabilityStartTime, availabilityEndTime) {
    // No changes in customTimeSlotValidator function
    const availabilityStart = new Date(slotTime);
    const availabilityEnd = new Date(slotTime);

    availabilityStart.setHours(availabilityStartTime.getHours(), availabilityStartTime.getMinutes(), 0, 0);
    availabilityEnd.setHours(availabilityEndTime.getHours(), availabilityEndTime.getMinutes(), 0, 0);

    return slotTime >= availabilityStart && slotTime <= availabilityEnd;
}

// function customTimeSlotValidator(slotTime, availabilityStartTime, availabilityEndTime) {
//     const availabilityStart = new Date(slotTime);
//     const availabilityEnd = new Date(slotTime);

//     console.log("availabilityStartTime", availabilityStartTime);
//     console.log("availabilityEndTime", availabilityEndTime);

//     const [startHour, startMinute] = availabilityStartTime.split(':');
//     const [endHour, endMinute] = availabilityEndTime.split(':');

//     availabilityStart.setHours(parseInt(startHour, 10), parseInt(startMinute, 10), 0, 0);
//     availabilityEnd.setHours(parseInt(endHour, 10), parseInt(endMinute, 10), 0, 0);

//     return slotTime >= availabilityStart && slotTime <= availabilityEnd;
// }

function DayTimeSchedule({ timeSlotSizeMinutes, availabilityStartTime, selectedValidDays, availabilityEndTime }) {
    const [isScheduling, setIsScheduling] = useState(false);
    const [isScheduled, setIsScheduled] = useState(false);
    const [scheduleErr, setScheduleErr] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState();

    // Add state variables and setter functions for availability start and end times
    const [convertedAvailabilityStartTime, setConvertedAvailabilityStartTime] = useState(availabilityStartTime);
    const [convertedAvailabilityEndTime, setConvertedAvailabilityEndTime] = useState(availabilityEndTime);

    const trueDaysArray = Object.keys(selectedValidDays).filter(day => selectedValidDays[day]);
    const selectedDays = trueDaysArray;

    const handleSearchChange = (selectedOption) => {
        if (selectedOption) {
            const selectedTimezone = selectedOption.value;

            // Convert availabilityStartTime from UTC to selected timezone
            const convertedStartTime = moment.utc(availabilityStartTime, 'HH:mm').tz(selectedTimezone, true).toDate();

            // Convert availabilityEndTime from UTC to selected timezone
            const convertedEndTime = moment.utc(availabilityEndTime, 'HH:mm').tz(selectedTimezone, true).toDate();

            // Update the state with the converted values
            setConvertedAvailabilityStartTime(convertedStartTime);
            setConvertedAvailabilityEndTime(convertedEndTime);
        }

        setSelectedOption(selectedOption);
    };


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

    // Update timeSlotValidator function to use the converted values
    const timeSlotValidator = (slotTime) => {
        return customTimeSlotValidator(slotTime, convertedAvailabilityStartTime, convertedAvailabilityEndTime);
    };

    return (
        <div className="" style={{ display: "flex" }}>
            <div className="dropdown" style={{ minWidth: "300px", marginRight: "10px" }}>
                <label>
                    <span>Select Time Zone:</span>
                    <Select
                        value={selectedOption}
                        onChange={handleSearchChange}
                        options={timezonesData.map((timezone) => ({
                            value: timezone.name,
                            label: `${timezone.name} (${timezone.offset})`,
                        }))}
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
                            // Pass the updated timeSlotValidator function
                            timeSlotValidator={timeSlotValidator}
                        />
                    </>
                )}
            </StyledTimePickerContainer>
        </div>
    );
}

export default DayTimeSchedule;
