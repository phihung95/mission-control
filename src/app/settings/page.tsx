"use client";

import { TopBar } from "@/components/layout/TopBar";
import {
  Terminal,
  Key,
  Bell,
  Shield,
  Database,
  Globe,
  Save,
} from "lucide-react";

function SettingsSection({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#17171A] rounded-lg border border-[#1A1A1F]">
      <div className="flex items-start gap-3 px-4 py-4 border-b border-[#1A1A1F]">
        <div className="w-8 h-8 rounded-md bg-[#1F1F24] flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-[#8A8A8E]" />
        </div>
        <div>
          <h3 className="text-[13px] font-semibold text-white">{title}</h3>
          <p className="text-[12px] text-[#8A8A8E] mt-0.5">{description}</p>
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-9 h-5 rounded-full transition-colors ${
        enabled ? "bg-indigo-500" : "bg-[#252529]"
      }`}
    >
      <div
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
          enabled ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div>
        <div className="text-[12px] text-white">{label}</div>
        {description && (
          <div className="text-[11px] text-[#5C5C60] mt-0.5">{description}</div>
        )}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar title="Settings" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-2xl">
        <SettingsSection
          title="General"
          description="Core mission control settings"
          icon={Globe}
        >
          <div className="space-y-1 divide-y divide-[#1A1A1F]">
            <SettingRow label="Gateway URL" description="OpenClaw gateway endpoint">
              <input
                type="text"
                defaultValue="http://localhost:18789"
                className="bg-[#0D0D0F] border border-[#1A1A1F] rounded-md px-3 py-1.5 text-[12px] text-white w-48 outline-none focus:border-indigo-500 transition-colors"
              />
            </SettingRow>
            <SettingRow label="Default Model">
              <select className="bg-[#0D0D0F] border border-[#1A1A1F] rounded-md px-3 py-1.5 text-[12px] text-white outline-none">
                <option>gemma4:e4b (Ollama)</option>
                <option>llama4-scout (OpenRouter)</option>
              </select>
            </SettingRow>
            <SettingRow label="Max concurrent runs">
              <input
                type="number"
                defaultValue={5}
                className="bg-[#0D0D0F] border border-[#1A1A1F] rounded-md px-3 py-1.5 text-[12px] text-white w-20 outline-none focus:border-indigo-500 transition-colors text-right"
              />
            </SettingRow>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Notifications"
          description="Alert and notification preferences"
          icon={Bell}
        >
          <div className="space-y-1 divide-y divide-[#1A1A1F]">
            <SettingRow
              label="Run failure alerts"
              description="Notify when a tool run fails"
            >
              <Toggle enabled={true} onChange={() => {}} />
            </SettingRow>
            <SettingRow
              label="Weekly summary"
              description="Send a weekly run summary"
            >
              <Toggle enabled={false} onChange={() => {}} />
            </SettingRow>
            <SettingRow label="Sound notifications">
              <Toggle enabled={false} onChange={() => {}} />
            </SettingRow>
          </div>
        </SettingsSection>

        <SettingsSection
          title="API Keys"
          description="Manage external service credentials"
          icon={Key}
        >
          <div className="space-y-3">
            {[
              { name: "OpenRouter", key: "sk-or-...", status: "active" },
              { name: "Slack", key: "xoxb-...", status: "active" },
              { name: "Notion", key: "secret_...", status: "active" },
            ].map((api) => (
              <div
                key={api.name}
                className="flex items-center justify-between py-2 border-b border-[#1A1A1F] last:border-0"
              >
                <div>
                  <div className="text-[12px] text-white">{api.name}</div>
                  <div className="text-[11px] text-[#5C5C60] font-mono">
                    {api.key}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400">
                    {api.status}
                  </span>
                  <button className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            ))}
            <button className="w-full py-2 rounded-md border border-dashed border-[#1A1A1F] text-[12px] text-[#8A8A8E] hover:text-white hover:border-[#2A2A30] transition-colors">
              + Add API Key
            </button>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Security"
          description="Authentication and access control"
          icon={Shield}
        >
          <div className="space-y-1 divide-y divide-[#1A1A1F]">
            <SettingRow
              label="Require authentication"
              description="Enforce auth for all tool endpoints"
            >
              <Toggle enabled={true} onChange={() => {}} />
            </SettingRow>
            <SettingRow label="Allowed origins (CORS)">
              <input
                type="text"
                defaultValue="*"
                className="bg-[#0D0D0F] border border-[#1A1A1F] rounded-md px-3 py-1.5 text-[12px] text-white w-48 outline-none focus:border-indigo-500 transition-colors"
              />
            </SettingRow>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Data"
          description="Run history and persistence"
          icon={Database}
        >
          <div className="space-y-1 divide-y divide-[#1A1A1F]">
            <SettingRow
              label="Retention period"
              description="How long to keep run history"
            >
              <select className="bg-[#0D0D0F] border border-[#1A1A1F] rounded-md px-3 py-1.5 text-[12px] text-white outline-none">
                <option>7 days</option>
                <option>30 days</option>
                <option selected>90 days</option>
                <option>Forever</option>
              </select>
            </SettingRow>
            <SettingRow label="Storage used">
              <span className="text-[12px] text-white">2.4 GB</span>
            </SettingRow>
          </div>
        </SettingsSection>

        <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-[12px] font-medium transition-colors">
          <Save className="w-3.5 h-3.5" />
          Save Settings
        </button>
      </div>
    </div>
  );
}
