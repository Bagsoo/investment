import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import PublicLayout from "@/components/layout/PublicLayout";
import PageHero from "@/components/ui/PageHero";
import ServicesSection from "@/components/sections/ServicesSection";
import CTASection from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "서비스",
  description: "앤써인베스트먼트의 프리미엄 투자 자문 서비스를 소개합니다.",
};

export default async function ServicesPage() {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("is_visible", true)
    .order("order_index");

  return (
    <PublicLayout>
      <PageHero
        eyebrow="Services"
        title="투자 서비스"
        subtitle="검증된 전략으로 수익률을 극대화합니다"
      />
      <ServicesSection services={services || []} />

      {/* Pricing section placeholder */}
      <section className="py-24 bg-brand-navy-mid">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <p className="text-brand-gold text-xs tracking-[0.3em] uppercase mb-4">Membership</p>
          <h2 className="font-display text-4xl font-black text-white mb-4">
            멤버십 <span className="gold-text">요금제</span>
          </h2>
          <p className="text-brand-slate-light mb-12">
            상담을 통해 최적의 플랜을 안내드립니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-brand-gold/10">
            {[
              {
                name: "Basic",
                price: "문의",
                features: ["주간 종목 추천", "시장 분석 리포트", "카카오톡 알림"],
                highlight: false,
              },
              {
                name: "Premium",
                price: "문의",
                features: [
                  "일일 종목 추천",
                  "실시간 시장 분석",
                  "포트폴리오 컨설팅",
                  "전담 매니저",
                ],
                highlight: true,
              },
              {
                name: "VIP",
                price: "문의",
                features: [
                  "소수 정예 운용",
                  "1:1 전담 전문가",
                  "맞춤형 전략 설계",
                  "24시간 대응",
                ],
                highlight: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`p-10 ${
                  plan.highlight
                    ? "bg-brand-gold/10 border border-brand-gold/30"
                    : "bg-brand-navy"
                }`}
              >
                {plan.highlight && (
                  <p className="text-brand-gold text-xs tracking-widest uppercase mb-4">추천</p>
                )}
                <h3 className="font-display text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-brand-gold text-3xl font-black mb-6">{plan.price}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="text-brand-slate-light text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-brand-gold rounded-full" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="/contact" className={plan.highlight ? "btn-gold w-full text-center block" : "btn-outline-gold w-full text-center block"}>
                  상담 신청
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTASection />
    </PublicLayout>
  );
}
