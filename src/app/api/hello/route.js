import { NextResponse } from "next/server";

// export function GET() {
//     return new Response('Inside Hello');
// }

export function GET() {
    return new NextResponse('Inside Hello');
}

