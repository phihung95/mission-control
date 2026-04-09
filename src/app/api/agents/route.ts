import { NextResponse } from "next/server";

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL ?? "http://localhost:18789";
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN ?? "94dd905425b997e83e9c869c510141722786b0e355928a82";

export async function GET() {
  try {
    const res = await fetch(`${GATEWAY_URL}/tools/invoke`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GATEWAY_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tool: "sessions_list", action: "json", args: {} }),
    });
    const data = await res.json();

    if (!data.ok) {
      return NextResponse.json({ error: data.error, agents: [] }, { status: 200 });
    }

    const sessions = data.result?.content?.[0]?.sessions ?? [];
    const agents = sessions.map((s: any) => ({
      id: s.sessionId ?? s.key,
      name: s.displayName ?? s.key,
      model: s.model ?? "unknown",
      provider: s.model?.includes("ollama") ? "ollama" : "openrouter",
      status: s.status === "done" ? "idle" : s.status === "running" ? "busy" : "idle",
      role: "coder",
      sessionKey: s.key,
    }));

    return NextResponse.json({ agents });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, agents: [] }, { status: 200 });
  }
}
