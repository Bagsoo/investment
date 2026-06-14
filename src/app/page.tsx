import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import PublicLayout from "@/components/layout/PublicLayout";
import HeroSection from "@/components/sections/HeroSection";
import StatsSection from "@/components/sections/StatsSection";
import ServicesSection from "@/components/sections/ServicesSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CTASection from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "앤써인베스트먼트 | 당신의 자산에 정답을 드립니다",
  description:
    "데이터 기반 분석과 전문 투자 전략으로 고객의 수익률을 극대화합니다. 누적 수익률 847%, 종목 적중률 91.2%.",
};

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: stats }, { data: services }, { data: testimonials }] =
    await Promise.all([
      supabase
        .from("performance_stats")
        .select("*")
        .order("order_index"),
      supabase
        .from("services")
        .select("*")
        .eq("is_visible", true)
        .order("order_index"),
      supabase
        .from("testimonials")
        .select("*")
        .eq("is_visible", true)
        .order("order_index"),
    ]);

  return (
    <PublicLayout>
      <HeroSection />
      <StatsSection stats={stats || []} />
      <ServicesSection services={services || []} />
      <TestimonialsSection testimonials={testimonials || []} />
      <CTASection />
    </PublicLayout>
  );
}
