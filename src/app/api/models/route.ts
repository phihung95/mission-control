import { NextResponse } from "next/server";
import { execSync } from "child_process";

export async function GET() {
  try {
    const output = execSync("openclaw models status 2>&1", { timeout: 10000 }).toString();

    const models: any[] = [];
    const defaultMatch = output.match(/Default\s+:\s+(.+)/);
    const configuredMatch = output.match(/Configured models \((\d+)\):\s+(.+)/);
    const modelsLine = configuredMatch?.[2] ?? "";
    const modelNames = modelsLine.split(",").map((m: string) => m.trim()).filter(Boolean);

    if (defaultMatch) {
      models.push({
        id: "default",
        name: defaultMatch[1].trim(),
        provider: "default",
        status: "active",
        latency: "—",
        costPerM: "Free",
        isDefault: true,
      });
    }

    for (const name of modelNames) {
      models.push({
        id: name,
        name,
        provider: name.includes("ollama") ? "Ollama" : "OpenRouter",
        status: "active",
        latency: "—",
        costPerM: name.includes("ollama") ? "Free" : "$0.10",
      });
    }

    return NextResponse.json({ models });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, models: [] }, { status: 200 });
  }
}
