"use client";

import React, { useState, useEffect } from 'react';
import { StyledTimePickerContainer, } from "@/components/style components/StylesDayTimeSchedule";
import DayTimeScheduler from '@captainwalterdev/daytimescheduler';
import { fakeRequest } from './fakeRequest';
import { useAccount } from 'wagmi';

function DayTimeSchedule() {
    const { address } = useAccount();
    const [isScheduling, setIsScheduling] = useState(false);
    const [isScheduled, setIsScheduled] = useState(false);
    const [scheduleErr, setScheduleErr] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [APIData, setAPIData] = useState();
    const [combinedStart, setCombinedStart] = useState("");
    const [timeSlotSizeMinutes, setTimeSlotSizeMinutes] = useState();
    const [dateAndRanges, setDateAndRanges] = useState([])
    const [allowedDates, setAllowedDates] = useState([]);

    useEffect(() => {
        const loadingTimeout = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        const getAvailability = async () => {
            try {
                const response = await fetch(`/api/get-availability/${address}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                    }
                })

                const result = await response.json();
                console.log("result", result);
                if (result.success) {
                    setAPIData(result.data)
                    const { timeSlotSizeMinutes, allowedDates, dateAndRanges } = result.data;
                    setTimeSlotSizeMinutes(timeSlotSizeMinutes);
                    setAllowedDates(allowedDates);
                    setDateAndRanges(dateAndRanges);
                }
            } catch (error) {
                console.log("error in catch", error);
            }
        }

        getAvailability()
        return () => {
            clearTimeout(loadingTimeout);
        };
    }, []);

    const getLocalTimeFromUTC = (utcTimeString) => {
        console.log("utcTimeString", utcTimeString);
        console.log("APIData", APIData[3].dateAndRanges[0].formattedUTCTime_startTime);
        const utcDateTime = new Date(APIData[3].dateAndRanges[0].formattedUTCTime_startTime);
        // const utcDateTime = new Date(utcTimeString);
        console.log("utcDateTime", utcDateTime);
        const localDateTime = new Date(
            utcDateTime.toLocaleString(undefined, {
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            })
        );
        return localDateTime;
    };

    const handleApplyButtonClick = () => {
        console.log("combinedStart", combinedStart);
        const localStartTime = getLocalTimeFromUTC(combinedStart);
        // const localEndTime = getLocalTimeFromUTC(utcEndTime);

        console.log("localStartTime", localStartTime);
        // console.log("localEndTime", localEndTime);
    };



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

    // const timeSlotSizeMinutes = 15;

    // const dateAndRanges = [
    //     {
    //         date: new Date('2024-02-11'),
    //         timeRanges: [[9, 0, 12, 0]],
    //         formattedUTCTime_startTime: "Sun, 11 Feb 2024 09:00:00 GMT",
    //         utcTime_startTime: "09:00",
    //         formattedUTCTime_endTime: "Sun, 11 Feb 2024 12:00:00 GMT",
    //         utcTime_endTime: "12:00"
    //     },
    //     {
    //         date: new Date("2024-02-22"),
    //         timeRanges: [[10, 0, 13, 0]],
    //         formattedUTCTime_startTime: "Thu, 22 Feb 2024 10:00:00 GMT",
    //         utcTime_startTime: "10:00",
    //         formattedUTCTime_endTime: "Thu, 22 Feb 2024 13:00:00 GMT",
    //         utcTime_endTime: "13:00"
    //     },
    // ];

    // const allowedDates = dateAndRanges.map(({ date }) => date);


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

            {isLoading ? (
                <StyledTimePickerContainer>
                    <div style={{ padding: "1rem" }}>Loading...</div>
                </StyledTimePickerContainer>
            ) : (
                <>
                    <div style={{ margin: "1rem" }}>
                        <button onClick={() => handleApplyButtonClick()}>ConvertTime</button>
                    </div>
                    <StyledTimePickerContainer>
                        <div>
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
                        </div>
                    </StyledTimePickerContainer>
                </>
            )}
        </div >
    );
}

export default DayTimeSchedule;