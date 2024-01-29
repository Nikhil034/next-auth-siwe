// pages/api/timeConversion.js
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import moment from "moment-timezone";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { from, to, time } = req.json();
  

    // if (!from || !to || !time) {
    //   return NextResponse.json({
    //     error:
    //       'Incomplete parameters. Please provide "from", "to", and "time".',
    //   });
    // }
    const originalMoment = moment(time).tz(from);

    const convertedTime = originalMoment
      .clone()
      .tz(to)
      .format("YYYY-MM-DD HH:mm:ss");

    // Check if the request was successful
    console.log(convertedTime);
  } catch (error) {
    console.error("Error processing time conversion:", error);
    // Send an error response to the client
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
