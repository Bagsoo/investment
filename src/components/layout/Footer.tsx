import Link from "next/link";
import { TrendingUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-navy border-t border-brand-gold/20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-gold to-brand-gold-dark flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-brand-navy" />
              </div>
              <div>
                <span className="font-display text-lg font-bold gold-text">앤써인베스트먼트</span>
                <p className="text-[10px] text-brand-slate tracking-widest uppercase">Answer Investment</p>
              </div>
            </Link>
            <p className="text-brand-slate text-sm leading-relaxed max-w-sm">
              당신의 자산에 정답을 드립니다. 데이터 기반 분석과 전문가의 통찰력으로 최적의 투자 전략을 제시합니다.
            </p>
            <p className="text-brand-slate/60 text-xs mt-6">
              본 서비스는 유사투자자문업으로 등록된 서비스입니다.<br />
              투자에 따른 손실은 투자자 본인에게 귀속됩니다.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wide">서비스</h4>
            <ul className="space-y-3">
              {["회사소개", "서비스 안내", "투자 인사이트", "수익 인증", "Q&A"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-brand-slate text-sm hover:text-brand-gold transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wide">연락처</h4>
            <ul className="space-y-3 text-sm text-brand-slate">
              <li>서울특별시 강남구</li>
              <li>info@answerinvestment.co.kr</li>
              <li>02-0000-0000</li>
              <li className="pt-2">
                <Link href="/contact" className="text-brand-gold hover:text-brand-gold-light transition-colors">
                  무료 상담 신청 →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-gold/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-brand-slate/60 text-xs">
            © 2024 앤써인베스트먼트. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["이용약관", "개인정보처리방침"].map((item) => (
              <Link key={item} href="#" className="text-brand-slate/60 text-xs hover:text-brand-slate transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
