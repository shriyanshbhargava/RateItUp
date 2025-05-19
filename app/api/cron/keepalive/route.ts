import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  return NextResponse.json(
    {
      message: "Keepalive route is working",
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
