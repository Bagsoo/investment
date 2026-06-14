import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import PublicLayout from "@/components/layout/PublicLayout";
import PageHero from "@/components/ui/PageHero";
import TeamSection from "@/components/sections/TeamSection";

export const metadata: Metadata = {
  title: "회사소개",
  description:
    "앤써인베스트먼트는 고객의 수익률 극대화를 최우선으로 하는 유사투자자문업체입니다.",
};

export default async function AboutPage() {
  const supabase = await createClient();

  const [{ data: company }, { data: team }] = await Promise.all([
    supabase.from("company_info").select("*").single(),
    supabase
      .from("team_members")
      .select("*")
      .eq("is_visible", true)
      .order("order_index"),
  ]);

  return (
    <PublicLayout>
      <PageHero
        eyebrow="About Us"
        title="앤써인베스트먼트"
        subtitle="당신의 자산에 정답을 드립니다"
      />

      {/* Mission */}
      <section className="py-24 bg-brand-navy">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-brand-gold text-xs tracking-[0.3em] uppercase mb-4">Our Mission</p>
              <h2 className="font-display text-4xl font-black text-white leading-tight mb-6">
                고객의 수익이 곧<br />
                <span className="gold-text">우리의 성과입니다</span>
              </h2>
              <p className="text-brand-slate-light leading-relaxed mb-4">
                {company?.description ||
                  "앤써인베스트먼트는 고객의 수익률 극대화를 최우선으로 하는 유사투자자문업체입니다. 데이터 기반 분석과 전문가의 통찰력으로 최적의 투자 전략을 제시합니다."}
              </p>
              <p className="text-brand-slate-light leading-relaxed">
                설립 이후 단 한 번도 고객의 신뢰를 배신하지 않았습니다.
                투명한 성과 공개와 검증된 전략으로 업계 최고의 적중률을 자랑합니다.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-px bg-brand-gold/10">
              {[
                { label: "설립연도", value: company?.founded_year?.toString() || "2019" },
                { label: "누적 회원수", value: "2,400+" },
                { label: "누적 수익률", value: "+847%" },
                { label: "종목 적중률", value: "91.2%" },
              ].map((item) => (
                <div key={item.label} className="bg-brand-navy-mid p-8 text-center">
                  <div className="font-display text-3xl font-black gold-text mb-2">{item.value}</div>
                  <div className="text-brand-slate text-sm">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      {team && team.length > 0 && <TeamSection members={team} />}

      {/* Philosophy */}
      <section className="py-24 bg-brand-navy-mid">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <p className="text-brand-gold text-xs tracking-[0.3em] uppercase mb-4">Philosophy</p>
          <h2 className="font-display text-4xl font-black text-white mb-8">
            투자 철학
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-brand-gold/10">
            {[
              {
                title: "데이터 기반",
                desc: "감이 아닌 데이터로 판단합니다. 수백만 개의 시장 데이터를 분석하여 최적의 진입 타이밍을 포착합니다.",
              },
              {
                title: "리스크 관리",
                desc: "수익보다 리스크 관리가 먼저입니다. 손실을 최소화하는 포트폴리오 전략으로 안정적인 수익을 추구합니다.",
              },
              {
                title: "투명한 소통",
                desc: "모든 분석 근거와 성과를 투명하게 공개합니다. 고객과의 신뢰가 곧 우리의 자산입니다.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-brand-navy p-8">
                <h3 className="font-display text-xl font-bold gold-text mb-3">{item.title}</h3>
                <p className="text-brand-slate text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
