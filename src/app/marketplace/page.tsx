"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Search, Star, Download, Check } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  description: string;
  author: string;
  installs: number;
  rating: number;
  tags: string[];
  installed: boolean;
}

const mockSkills: Skill[] = [
  {
    id: "s1",
    name: "Health Check",
    description: "Host security hardening and risk-tolerance configuration for OpenClaw deployments.",
    author: "openclaw",
    installs: 8432,
    rating: 4.9,
    tags: ["security", "openclaw"],
    installed: true,
  },
  {
    id: "s2",
    name: "Node Connect",
    description: "Diagnose OpenClaw node connection and pairing failures for Android, iOS, and macOS companion apps.",
    author: "openclaw",
    installs: 6201,
    rating: 4.8,
    tags: ["network", "openclaw"],
    installed: true,
  },
  {
    id: "s3",
    name: "Weather",
    description: "Get current weather and forecasts via wttr.in or Open-Meteo.",
    author: "openclaw",
    installs: 12403,
    rating: 4.7,
    tags: ["weather", "api"],
    installed: false,
  },
  {
    id: "s4",
    name: "Tmux",
    description: "Remote-control tmux sessions for interactive CLIs by sending keystrokes and scraping pane output.",
    author: "openclaw",
    installs: 3891,
    rating: 4.6,
    tags: ["tmux", "cli"],
    installed: false,
  },
  {
    id: "s5",
    name: "Slack Poster",
    description: "Post messages and files to Slack channels with rich formatting support.",
    author: "community",
    installs: 2341,
    rating: 4.5,
    tags: ["slack", "messaging"],
    installed: false,
  },
  {
    id: "s6",
    name: "Gmail Monitor",
    description: "Watch Gmail inbox and trigger workflows on new emails matching filters.",
    author: "community",
    installs: 5102,
    rating: 4.8,
    tags: ["gmail", "automation"],
    installed: false,
  },
  {
    id: "s7",
    name: "Cron Scheduler",
    description: "Schedule recurring tasks and reminders with natural language syntax.",
    author: "community",
    installs: 1876,
    rating: 4.3,
    tags: ["scheduler", "tasks"],
    installed: false,
  },
  {
    id: "s8",
    name: "Web Scraper",
    description: "Extract structured data from any website using CSS selectors.",
    author: "community",
    installs: 7234,
    rating: 4.6,
    tags: ["scraping", "data"],
    installed: false,
  },
];

const filters = ["All", "Installed", "openclaw", "community"];

export default function MarketplacePage() {
  const [skills, setSkills] = useState(mockSkills);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch =
      skill.name.toLowerCase().includes(search.toLowerCase()) ||
      skill.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Installed" && skill.installed) ||
      skill.author === activeFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const toggleInstall = (id: string) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, installed: !s.installed } : s))
    );
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Marketplace" subtitle="Skills & Extensions" />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C5C60]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search skills..."
              className="w-full bg-[#17171A] border border-[#2A2A30] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#5C5C60] outline-none focus:border-[#5E5CE6]"
            />
          </div>
          <div className="flex items-center gap-1 bg-[#17171A] border border-[#2A2A30] rounded-lg p-1">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeFilter === filter
                    ? "bg-[#5E5CE6] text-white"
                    : "text-[#8A8A8E] hover:text-white"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="bg-[#17171A] border border-[#2A2A30] rounded-xl p-5 hover:border-[#3A3A40] transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-white mb-1">{skill.name}</h3>
                  <span
                    className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      skill.author === "openclaw"
                        ? "bg-[#5E5CE620] text-[#5E5CE6]"
                        : "bg-[#8844FF20] text-[#8844FF]"
                    }`}
                  >
                    {skill.author}
                  </span>
                </div>
                <button
                  onClick={() => toggleInstall(skill.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    skill.installed
                      ? "bg-[#22C55E20] text-[#22C55E] hover:bg-[#22C55E30]"
                      : "bg-[#5E5CE6] text-white hover:bg-[#6E6CF0]"
                  }`}
                >
                  {skill.installed ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Installed
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      Install
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-[#8A8A8E] mb-4 line-clamp-2">{skill.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-[#FFCC00]" />
                    <span className="text-xs text-[#8A8A8E]">{skill.rating}</span>
                  </div>
                  <span className="text-xs text-[#5C5C60]">
                    {skill.installs.toLocaleString()} installs
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {skill.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] text-[#5C5C60] bg-[#1F1F24] px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center text-[#5C5C60] mt-12">
            No skills found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
