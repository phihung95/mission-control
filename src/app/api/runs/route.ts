import { NextResponse } from "next/server";

export async function GET() {
  // Run history is populated from agent session events
  // This will be expanded when agent run logging is added
  return NextResponse.json({ runs: [], total: 0 });
}
