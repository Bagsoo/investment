"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { CompanyInfo } from "@/types";
import { Save } from "lucide-react";

export default function AdminSettingsPage() {
  const [form, setForm] = useState<Partial<CompanyInfo>>({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchInfo = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("company_info").select("*").single();
      if (data) setForm(data);
    };
    fetchInfo();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("company_info")
      .update(form)
      .eq("id", form.id);
    setLoading(false);
    if (error) { alert("저장 실패: " + error.message); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const field = (key: keyof CompanyInfo, label: string, placeholder?: string, textarea?: boolean) => (
    <div>
      <label className="text-gray-400 text-xs mb-1 block">{label}</label>
      {textarea ? (
        <textarea
          value={(form[key] as string) || ""}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          placeholder={placeholder}
          rows={3}
          className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 text-sm focus:outline-none focus:border-brand-gold resize-none"
        />
      ) : (
        <input
          type="text"
          value={(form[key] as string) || ""}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          placeholder={placeholder}
          className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 text-sm focus:outline-none focus:border-brand-gold"
        />
      )}
    </div>
  );

  return (
    <div className="max-w-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">사이트 설정</h1>
          <p className="text-gray-400 text-sm mt-1">회사 정보 및 SEO 설정을 관리하세요</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="btn-gold text-sm py-2.5 px-5 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {loading ? "저장 중..." : saved ? "저장됨 ✓" : "저장"}
        </button>
      </div>

      <div className="space-y-6">
        {/* 기본 정보 */}
        <div className="bg-gray-900 border border-gray-800 p-6">
          <h2 className="text-white font-semibold mb-5">기본 정보</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field("company_name", "회사명")}
            {field("ceo_name", "대표자명")}
            {field("slogan", "슬로건")}
            {field("business_number", "사업자 번호")}
            {field("phone", "전화번호")}
            {field("email", "이메일")}
            {field("address", "주소")}
            {field("founded_year", "설립연도")}
          </div>
          <div className="mt-4">
            {field("description", "회사 소개", "회사 소개 문구", true)}
          </div>
        </div>

        {/* SNS */}
        <div className="bg-gray-900 border border-gray-800 p-6">
          <h2 className="text-white font-semibold mb-5">SNS / 링크</h2>
          <div className="space-y-4">
            {field("kakao_url", "카카오톡 채널 URL")}
            {field("youtube_url", "유튜브 URL")}
            {field("blog_url", "블로그 URL")}
          </div>
        </div>

        {/* SEO */}
        <div className="bg-gray-900 border border-gray-800 p-6">
          <h2 className="text-white font-semibold mb-5">SEO 설정</h2>
          <div className="space-y-4">
            {field("meta_title", "사이트 대표 타이틀")}
            {field("meta_description", "사이트 대표 설명", "검색 결과에 표시됩니다", true)}
            {field("meta_keywords", "키워드 (쉼표 구분)")}
            {field("og_image_url", "OG 이미지 URL (SNS 공유 이미지)")}
          </div>
        </div>
      </div>
    </div>
  );
}
