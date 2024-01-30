import { MongoClient, MongoClientOptions, InsertOneResult } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse, NextRequest } from "next/server";

// Define the request body type
interface StoreAvailabilityRequestBody {
  userAddress: string;
  timeSlotSizeMinutes: number;
  availabilityStartTime: string;
  availabilityEndTime: string;
  selectedDays: {
    sunday: boolean;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
  };
  selectedTimeZone: string;
}

// Define the response body type
interface StoreAvailabilityResponseBody {
  success: boolean;
  data?: {
    _id: string;
    userAddress: string;
    timeSlotSizeMinutes: number;
    availabilityStartTime: string;
    availabilityEndTime: string;
    selectedDays: {
      sunday: boolean;
      monday: boolean;
      tuesday: boolean;
      wednesday: boolean;
      thursday: boolean;
      friday: boolean;
      saturday: boolean;
    };
    selectedTimeZone: string;
    createdAt: Date;
    updatedAt: Date;
  } | null; // Allow null for the data property
  error?: string;
}

export async function POST(
  req: NextRequest,
  res: NextApiResponse<StoreAvailabilityResponseBody>
) {
  const {
    userAddress,
    timeSlotSizeMinutes,
    availabilityStartTime,
    availabilityEndTime,
    selectedDays,
    selectedTimeZone,
  }: StoreAvailabilityRequestBody = await req.json();

  // console.log(
  //   userAddress,
  //   timeSlotSizeMinutes,
  //   availabilityStartTime,
  //   availabilityEndTime,
  //   selectedDays,
  //   selectedTimeZone
  // );

  try {
    // Connect to your MongoDB database
    console.log("Connecting to MongoDB...");
    const client = await MongoClient.connect(process.env.MONGODB_URI!, {
      dbName: `chora-club`,
      useNewUrlParser: true,
      useUnifiedTopology: true, // Use this option for backward compatibility
    } as MongoClientOptions);
    console.log("Connected to MongoDB");

    // Access the collection
    const db = client.db(process.env.MONGODB_DB!);
    const collection = db.collection("scheduling");

    // Insert the new availability document
    console.log("Inserting availability document...");
    const result = await collection.insertOne({
      userAddress,
      timeSlotSizeMinutes,
      availabilityStartTime,
      availabilityEndTime,
      selectedDays,
      selectedTimeZone,

      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("Availability document inserted:", result);

    client.close();
    console.log("MongoDB connection closed");

    if (result.insertedId) {
      // Retrieve the inserted document using the insertedId
      console.log("Retrieving inserted document...");
      const insertedDocument = await collection.findOne({
        _id: result.insertedId,
      });
      console.log("Inserted document retrieved");
      // console.log("Inserted document retrieved:", insertedDocument);
      return NextResponse.json({ result: insertedDocument }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "Failed to retrieve inserted document" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error storing availability:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
