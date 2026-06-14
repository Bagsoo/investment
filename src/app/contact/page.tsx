import type { Metadata } from "next";
import PublicLayout from "@/components/layout/PublicLayout";
import PageHero from "@/components/ui/PageHero";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "무료 상담",
  description: "앤써인베스트먼트 무료 투자 상담을 신청하세요.",
};

export default function ContactPage() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="Contact"
        title="무료 상담 신청"
        subtitle="지금 바로 전문가와 상담하세요"
      />

      <section className="py-20 bg-brand-navy">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact info */}
            <div>
              <h2 className="font-display text-2xl font-bold text-white mb-8">
                언제든지 <span className="gold-text">연락하세요</span>
              </h2>

              <div className="space-y-6">
                {[
                  { icon: Phone, label: "전화 상담", value: "02-0000-0000", sub: "평일 09:00 - 18:00" },
                  { icon: Mail, label: "이메일", value: "info@answerinvestment.co.kr", sub: "24시간 접수" },
                  { icon: MapPin, label: "주소", value: "서울특별시 강남구", sub: "방문 상담 사전 예약 필수" },
                  { icon: MessageCircle, label: "카카오톡 채널", value: "@앤써인베스트먼트", sub: "실시간 응대" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-brand-gold" />
                      </div>
                      <div>
                        <p className="text-brand-slate text-xs tracking-widest uppercase mb-1">{item.label}</p>
                        <p className="text-white font-medium">{item.value}</p>
                        <p className="text-brand-slate/60 text-xs mt-0.5">{item.sub}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10 p-6 bg-brand-gold/5 border border-brand-gold/20">
                <p className="text-brand-gold text-sm font-semibold mb-2">⚡ 빠른 상담</p>
                <p className="text-brand-slate-light text-sm leading-relaxed">
                  카카오톡 채널 채팅을 통해 실시간으로 전문가와 상담하실 수 있습니다.
                  평균 응답 시간 5분 이내.
                </p>
              </div>
            </div>

            {/* Contact form */}
            <div className="bg-brand-navy-mid border border-brand-gold/20 p-8">
              <h3 className="text-white font-bold text-xl mb-6">상담 신청서</h3>
              <form className="space-y-4">
                <div>
                  <label className="text-brand-slate text-sm mb-2 block">이름 *</label>
                  <input
                    type="text"
                    required
                    placeholder="홍길동"
                    className="w-full bg-brand-navy border border-brand-gold/20 text-white px-4 py-3 focus:outline-none focus:border-brand-gold transition-colors text-sm placeholder:text-brand-slate/50"
                  />
                </div>
                <div>
                  <label className="text-brand-slate text-sm mb-2 block">연락처 *</label>
                  <input
                    type="tel"
                    required
                    placeholder="010-0000-0000"
                    className="w-full bg-brand-navy border border-brand-gold/20 text-white px-4 py-3 focus:outline-none focus:border-brand-gold transition-colors text-sm placeholder:text-brand-slate/50"
                  />
                </div>
                <div>
                  <label className="text-brand-slate text-sm mb-2 block">이메일</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    className="w-full bg-brand-navy border border-brand-gold/20 text-white px-4 py-3 focus:outline-none focus:border-brand-gold transition-colors text-sm placeholder:text-brand-slate/50"
                  />
                </div>
                <div>
                  <label className="text-brand-slate text-sm mb-2 block">관심 서비스</label>
                  <select className="w-full bg-brand-navy border border-brand-gold/20 text-white px-4 py-3 focus:outline-none focus:border-brand-gold transition-colors text-sm">
                    <option value="">선택해주세요</option>
                    <option value="basic">Basic 멤버십</option>
                    <option value="premium">Premium 멤버십</option>
                    <option value="vip">VIP 서비스</option>
                    <option value="portfolio">포트폴리오 컨설팅</option>
                  </select>
                </div>
                <div>
                  <label className="text-brand-slate text-sm mb-2 block">문의 내용</label>
                  <textarea
                    rows={4}
                    placeholder="궁금하신 내용을 자유롭게 작성해주세요."
                    className="w-full bg-brand-navy border border-brand-gold/20 text-white px-4 py-3 focus:outline-none focus:border-brand-gold transition-colors text-sm placeholder:text-brand-slate/50 resize-none"
                  />
                </div>
                <p className="text-brand-slate/50 text-xs">
                  * 개인정보는 상담 목적으로만 사용되며 제3자에게 제공되지 않습니다.
                </p>
                <button type="submit" className="btn-gold w-full justify-center py-4">
                  상담 신청하기
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
