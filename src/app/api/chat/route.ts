import { NextRequest, NextResponse } from "next/server";

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL ?? "http://localhost:18789";
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN ?? "94dd905425b997e83e9c869c510141722786b0e355928a82";

export async function POST(req: NextRequest) {
  try {
    const { sessionKey, message } = await req.json();
    const targetSession = sessionKey ?? "agent:main:main";

    const res = await fetch(`${GATEWAY_URL}/tools/invoke`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GATEWAY_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tool: "sessions_send",
        action: "json",
        args: { message, sessionKey: targetSession },
      }),
    });

    const data = await res.json();

    if (!data.ok) {
      return NextResponse.json({
        ok: true,
        reply: "Message queued. The agent will respond on the next heartbeat.",
        sessionKey: targetSession,
      });
    }

    return NextResponse.json({ ok: true, data, sessionKey: targetSession });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
