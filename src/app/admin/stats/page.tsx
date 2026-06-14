"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PerformanceStat } from "@/types";
import { Save, Plus, Trash2 } from "lucide-react";

export default function AdminStatsPage() {
  const [stats, setStats] = useState<PerformanceStat[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("performance_stats").select("*").order("order_index");
    if (data) setStats(data);
  };

  useEffect(() => { fetchStats(); }, []);

  const addStat = async () => {
    const supabase = createClient();
    await supabase.from("performance_stats").insert({
      label: "새 통계",
      value: "0%",
      description: "",
      order_index: stats.length + 1,
    });
    fetchStats();
  };

  const updateStat = async (stat: PerformanceStat) => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("performance_stats")
      .update({ label: stat.label, value: stat.value, description: stat.description })
      .eq("id", stat.id);
    setLoading(false);
    if (error) alert("저장 실패: " + error.message);
    else fetchStats();
  };

  const deleteStat = async (id: string) => {
    if (!confirm("삭제하시겠습니까?")) return;
    const supabase = createClient();
    await supabase.from("performance_stats").delete().eq("id", id);
    fetchStats();
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">수익률 통계 관리</h1>
          <p className="text-gray-400 text-sm mt-1">메인 페이지에 표시되는 통계를 관리하세요</p>
        </div>
        <button onClick={addStat} className="btn-gold text-sm py-2.5 px-5">
          <Plus className="w-4 h-4" />
          추가
        </button>
      </div>

      <div className="space-y-4">
        {stats.map((stat) => (
          <StatItem
            key={stat.id}
            stat={stat}
            onSave={updateStat}
            onDelete={() => deleteStat(stat.id)}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
}

function StatItem({
  stat,
  onSave,
  onDelete,
  loading,
}: {
  stat: PerformanceStat;
  onSave: (s: PerformanceStat) => void;
  onDelete: () => void;
  loading: boolean;
}) {
  const [local, setLocal] = useState(stat);

  return (
    <div className="bg-gray-900 border border-gray-800 p-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <div>
          <label className="text-gray-400 text-xs mb-1 block">라벨</label>
          <input
            value={local.label}
            onChange={(e) => setLocal((s) => ({ ...s, label: e.target.value }))}
            className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 text-sm focus:outline-none focus:border-brand-gold"
          />
        </div>
        <div>
          <label className="text-gray-400 text-xs mb-1 block">값</label>
          <input
            value={local.value}
            onChange={(e) => setLocal((s) => ({ ...s, value: e.target.value }))}
            className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 text-sm focus:outline-none focus:border-brand-gold"
          />
        </div>
        <div>
          <label className="text-gray-400 text-xs mb-1 block">설명</label>
          <input
            value={local.description || ""}
            onChange={(e) => setLocal((s) => ({ ...s, description: e.target.value }))}
            className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 text-sm focus:outline-none focus:border-brand-gold"
          />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => onSave(local)}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-1.5 text-xs text-brand-gold border border-brand-gold/30 hover:bg-brand-gold/10 transition-colors disabled:opacity-50"
        >
          <Save className="w-3 h-3" />
          저장
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1.5 px-4 py-1.5 text-xs text-red-400 border border-red-400/30 hover:bg-red-400/10 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          삭제
        </button>
      </div>
    </div>
  );
}
