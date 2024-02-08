"use client";

import React, { useState, useEffect } from "react";
import { StyledTimePickerContainer } from "@/components/style components/StylesDayTimeSchedule";
import DayTimeScheduler from "@captainwalterdev/daytimescheduler";
import { fakeRequest } from "./fakeRequest";
import { useAccount } from "wagmi";
import { DateTime, Duration } from "luxon";

function DayTimeSchedule() {
    const { address } = useAccount();
    // const address = "0x3013bb4E03a7B81106D69C10710EaE148C8410E1";
    const [isScheduling, setIsScheduling] = useState(false);
    const [isScheduled, setIsScheduled] = useState(false);
    const [scheduleErr, setScheduleErr] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [APIData, setAPIData] = useState();

    useEffect(() => {
        const loadingTimeout = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        getAvailability();

        return () => {
            clearTimeout(loadingTimeout);
        };
    }, [address]);

    const getAvailability = async () => {
        try {
            const response = await fetch(`/api/get-availability/${address}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const result = await response.json();
            console.log("result", result);
            if (result.success) {
                setAPIData(result.data);
                setIsLoading(false);
            }
        } catch (error) {
            console.log("error in catch", error);
        }
    };

    const handleScheduled = (date) => {
        setIsScheduling(true);
        setScheduleErr("");
        console.log("date in handleScheduled", date);

        fakeRequest(date)
            .then((json) => {
                setScheduleErr("");
                setIsScheduled(true);
                console.log("fake response: ", json);
                setTimeout(() => {
                    setIsScheduled(false);
                }, 2000);
            })
            .catch((err) => {
                setScheduleErr(err);
            })
            .finally(() => {
                setIsScheduling(false);
            });
    };

    const timeSlotSizeMinutes = 15;
    let dateAndRanges = [];
    let allowedDates = [];

    // Check if API data exists
    if (APIData) {
        console.log("APIData", APIData)
        APIData.forEach((item) => {
            console.log("item", item)
            dateAndRanges.push(...item.dateAndRanges);
            allowedDates.push(...item.allowedDates);
        });

        dateAndRanges.forEach((range) => {
            console.log("range", range)
            range.date = new Date(range.date);
            range.formattedUTCTime_startTime = new Date(range.formattedUTCTime_startTime)
            range.formattedUTCTime_endTime = new Date(range.formattedUTCTime_endTime)

            console.log("range.formattedUTCTime_startTime", range.formattedUTCTime_startTime)
            console.log("range.formattedUTCTime_endTime", range.formattedUTCTime_endTime)

            const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
            const formattedStartTime = range.formattedUTCTime_startTime.toLocaleTimeString(undefined, timeOptions);
            const formattedEndTime = range.formattedUTCTime_endTime.toLocaleTimeString(undefined, timeOptions);

            console.log("formattedStartTime", formattedStartTime);
            console.log("formattedEndTime", formattedEndTime);

            range.utcTime_startTime = formattedStartTime;
            range.utcTime_endTime = formattedEndTime;

            // const formatFromUTCTime_startTime = DateTime.fromFormat(formattedStartTime, "HH:mm");
            // const localTime_startTime = formatFromUTCTime_startTime.toFormat("HH:mm");
            // console.log("localTime_startTime", localTime_startTime);
            const [startHourTime, startMinuteTime] = formattedStartTime.split(":");

            // const formatFromUTCTime_endTime = DateTime.fromFormat(formattedEndTime, "HH:mm");
            // const localTime_endTime = formatFromUTCTime_endTime.toFormat("HH:mm");
            // console.log("localTime_endTime", localTime_endTime);
            const [endHourTime, endMinuteTime] = formattedEndTime.split(":");

            console.log([startHourTime, startMinuteTime, endHourTime, endMinuteTime])

            // range.timeRanges.forEach((time) => {
            //     console.log("time", time)
            // })

            range.timeRanges = [[startHourTime, startMinuteTime, endHourTime, endMinuteTime]]
        });


        allowedDates = allowedDates.map(dateString => new Date(dateString));
    }

    // dateAndRanges.forEach((range) => {
    //     const startTimeUTCtoLocal = new Date(range.formattedUTCTime_startTime);
    //     const endTimeUTCtoLocal = new Date(range.formattedUTCTime_endTime);

    //     console.log("startTimeUTCtoLocal", startTimeUTCtoLocal);
    //     console.log("endTimeUTCtoLocal", endTimeUTCtoLocal);

    // });

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
                            timeSlotValidator={(slotTime) =>
                                timeSlotValidator(slotTime, dateAndRanges)
                            }
                            dateAndRanges={dateAndRanges.map((range) => ({
                                ...range,
                                formattedUTCTime_startTime: new Date(
                                    range.utcTime_startTime
                                ).toLocaleString(),
                                formattedUTCTime_endTime: new Date(
                                    range.utcTime_endTime
                                ).toLocaleString(),
                            }))}
                        />
                    </>
                )}
            </StyledTimePickerContainer>
        </div>
    );
}

export default DayTimeSchedule;
