"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { TeamMember } from "@/types";
import { Plus, Trash2, Save, X } from "lucide-react";

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", position: "", bio: "", career: [""] });

  const fetchMembers = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("team_members").select("*").order("order_index");
    if (data) setMembers(data);
  };

  useEffect(() => { fetchMembers(); }, []);

  const createMember = async () => {
    if (!newMember.name || !newMember.position) { alert("이름과 직책을 입력하세요."); return; }
    const supabase = createClient();
    await supabase.from("team_members").insert({
      ...newMember,
      career: newMember.career.filter((c) => c.trim()),
      order_index: members.length + 1,
    });
    setNewMember({ name: "", position: "", bio: "", career: [""] });
    setShowForm(false);
    fetchMembers();
  };

  const deleteMember = async (id: string) => {
    if (!confirm("삭제하시겠습니까?")) return;
    const supabase = createClient();
    await supabase.from("team_members").delete().eq("id", id);
    fetchMembers();
  };

  const updateMember = async (member: TeamMember) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("team_members")
      .update({ name: member.name, position: member.position, bio: member.bio, career: member.career })
      .eq("id", member.id);
    if (error) alert("저장 실패: " + error.message);
    else fetchMembers();
  };

  return (
    <div className="max-w-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">팀 관리</h1>
          <p className="text-gray-400 text-sm mt-1">팀원 정보를 관리하세요</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-gold text-sm py-2.5 px-5">
          <Plus className="w-4 h-4" />
          팀원 추가
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-900 border border-brand-gold/30 p-6 mb-6">
          <h3 className="text-white font-semibold mb-4">새 팀원</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-gray-400 text-xs mb-1 block">이름 *</label>
                <input value={newMember.name} onChange={(e) => setNewMember((m) => ({ ...m, name: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 text-sm focus:outline-none focus:border-brand-gold" />
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1 block">직책 *</label>
                <input value={newMember.position} onChange={(e) => setNewMember((m) => ({ ...m, position: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 text-sm focus:outline-none focus:border-brand-gold" />
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">소개</label>
              <textarea value={newMember.bio} onChange={(e) => setNewMember((m) => ({ ...m, bio: e.target.value }))}
                rows={2} className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 text-sm focus:outline-none focus:border-brand-gold resize-none" />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-2 block">경력</label>
              {newMember.career.map((c, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input value={c}
                    onChange={(e) => {
                      const career = [...newMember.career];
                      career[i] = e.target.value;
                      setNewMember((m) => ({ ...m, career }));
                    }}
                    placeholder={`경력 ${i + 1}`}
                    className="flex-1 bg-gray-800 border border-gray-700 text-white px-3 py-2 text-sm focus:outline-none focus:border-brand-gold"
                  />
                  <button onClick={() => setNewMember((m) => ({ ...m, career: m.career.filter((_, j) => j !== i) }))}
                    className="p-2 text-gray-500 hover:text-red-400"><X className="w-4 h-4" /></button>
                </div>
              ))}
              <button onClick={() => setNewMember((m) => ({ ...m, career: [...m.career, ""] }))}
                className="text-brand-gold/70 text-xs hover:text-brand-gold">+ 경력 추가</button>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={createMember} className="btn-gold text-sm py-2 px-5">추가</button>
              <button onClick={() => setShowForm(false)} className="px-5 py-2 text-sm text-gray-400 border border-gray-700">취소</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {members.map((member) => (
          <MemberItem key={member.id} member={member} onDelete={() => deleteMember(member.id)} onSave={updateMember} />
        ))}
        {members.length === 0 && <div className="text-center py-16 text-gray-500">팀원이 없습니다.</div>}
      </div>
    </div>
  );
}

function MemberItem({ member, onDelete, onSave }: { member: TeamMember; onDelete: () => void; onSave: (m: TeamMember) => void }) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState(member);

  return (
    <div className="bg-gray-900 border border-gray-800 p-5">
      {editing ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input value={local.name} onChange={(e) => setLocal((m) => ({ ...m, name: e.target.value }))}
              className="bg-gray-800 border border-gray-700 text-white px-3 py-2 text-sm focus:outline-none focus:border-brand-gold" />
            <input value={local.position} onChange={(e) => setLocal((m) => ({ ...m, position: e.target.value }))}
              className="bg-gray-800 border border-gray-700 text-white px-3 py-2 text-sm focus:outline-none focus:border-brand-gold" />
          </div>
          <textarea value={local.bio || ""} onChange={(e) => setLocal((m) => ({ ...m, bio: e.target.value }))}
            rows={2} className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 text-sm focus:outline-none focus:border-brand-gold resize-none" />
          <div className="flex gap-3">
            <button onClick={() => { onSave(local); setEditing(false); }} className="flex items-center gap-1.5 px-4 py-1.5 text-xs text-brand-gold border border-brand-gold/30 hover:bg-brand-gold/10">
              <Save className="w-3 h-3" /> 저장
            </button>
            <button onClick={() => { setLocal(member); setEditing(false); }} className="px-4 py-1.5 text-xs text-gray-400 border border-gray-700">취소</button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-white font-medium">{member.name}</div>
            <div className="text-brand-gold text-sm">{member.position}</div>
            {member.bio && <p className="text-gray-400 text-sm mt-1">{member.bio}</p>}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setEditing(true)} className="text-xs text-gray-400 hover:text-white px-3 py-1.5 border border-gray-700 hover:border-gray-500 transition-colors">수정</button>
            <button onClick={onDelete} className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
