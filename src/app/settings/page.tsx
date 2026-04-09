"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { TopBar } from "@/components/layout/TopBar";
import { Avatar } from "@/components/shared/Avatar";
import { Plus, Trash2, Save } from "lucide-react";

export default function SettingsPage() {
  const { organization, members, agents, updateOrganizationName, addMember, removeMember } = useStore();
  const [orgName, setOrgName] = useState(organization.name);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);

  const handleSaveOrgName = () => {
    updateOrganizationName(orgName);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName || !newMemberEmail) return;

    const newMember = {
      id: `member-${Date.now()}`,
      name: newMemberName,
      email: newMemberEmail,
      role: "member" as const,
    };

    addMember(newMember);
    setNewMemberName("");
    setNewMemberEmail("");
    setShowAddMember(false);
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar 
        title="Settings" 
        subtitle="Manage your organization"
      />
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl space-y-8">
          {/* Organization Settings */}
          <section className="bg-[#17171A] border border-[#2A2A30] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Organization</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#8A8A8E] mb-2">
                  Organization Name
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="flex-1"
                  />
                  <button
                    onClick={handleSaveOrgName}
                    className="flex items-center gap-2 px-4 py-2 bg-[#5E5CE6] hover:bg-[#6E6CF0] text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-[#2A2A30]">
                <div className="text-sm">
                  <span className="text-[#8A8A8E]">Slug: </span>
                  <span className="text-white">{organization.slug}</span>
                </div>
                <div className="text-sm mt-1">
                  <span className="text-[#8A8A8E]">Created: </span>
                  <span className="text-white">{new Date(organization.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Members */}
          <section className="bg-[#17171A] border border-[#2A2A30] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Members</h2>
              <button
                onClick={() => setShowAddMember(!showAddMember)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[#5E5CE6] hover:bg-[#5E5CE620] rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Member
              </button>
            </div>

            {showAddMember && (
              <form onSubmit={handleAddMember} className="mb-6 p-4 bg-[#0D0D0F] rounded-lg">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-[#8A8A8E] mb-1">Name</label>
                    <input
                      type="text"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      className="w-full"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#8A8A8E] mb-1">Email</label>
                    <input
                      type="email"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      className="w-full"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#5E5CE6] hover:bg-[#6E6CF0] text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Add Member
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddMember(false)}
                    className="px-4 py-2 text-sm text-[#8A8A8E] hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {members.map((member) => (
                <div 
                  key={member.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#0D0D0F]"
                >
                  <Avatar name={member.name} avatar={member.avatar} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white">{member.name}</div>
                    <div className="text-xs text-[#5C5C60]">{member.email}</div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded font-medium bg-[#1A1A1F] text-[#8A8A8E] capitalize">
                    {member.role}
                  </span>
                  {member.role !== "owner" && (
                    <button
                      onClick={() => removeMember(member.id)}
                      className="p-2 text-[#5C5C60] hover:text-[#FF4444] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Agents */}
          <section className="bg-[#17171A] border border-[#2A2A30] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Agents</h2>
            <p className="text-sm text-[#8A8A8E] mb-4">
              Manage agents from the <a href="/agents" className="text-[#5E5CE6] hover:underline">Agents page</a>.
            </p>
            
            <div className="space-y-2">
              {agents.map((agent) => (
                <div 
                  key={agent.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#0D0D0F]"
                >
                  <Avatar name={agent.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white">{agent.name}</div>
                    <div className="text-xs text-[#5C5C60]">{agent.model} • {agent.provider}</div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded font-medium bg-[#1A1A1F] text-[#8A8A8E] capitalize">
                    {agent.role}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
