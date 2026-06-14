"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export default function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 bg-brand-navy relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />

      <div className="relative max-w-4xl mx-auto px-4 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-brand-gold text-xs tracking-[0.3em] uppercase mb-6">지금 시작하세요</p>
          <h2 className="font-display text-4xl md:text-6xl font-black text-white leading-tight mb-8">
            더 이상 기회를<br />
            <span className="gold-text">놓치지 마세요</span>
          </h2>
          <p className="text-brand-slate-light text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
            매일 수십 개의 종목이 목표가를 달성합니다.
            지금 무료 상담을 신청하고 앤써인베스트먼트의 검증된 투자 전략을 직접 경험해 보세요.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-gold text-base py-5 px-10">
              무료 상담 신청하기
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="tel:02-0000-0000" className="btn-outline-gold text-base py-5 px-10">
              <Phone className="w-5 h-5" />
              02-0000-0000
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
