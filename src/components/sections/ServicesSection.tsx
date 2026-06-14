"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, PieChart, Activity, Crown, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Service } from "@/types";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp,
  PieChart,
  Activity,
  Crown,
};

interface ServicesSectionProps {
  services: Service[];
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 bg-brand-navy">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mb-20"
        >
          <p className="text-brand-gold text-xs tracking-[0.3em] uppercase mb-4">Services</p>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white leading-tight mb-6">
            수익률을 극대화하는<br />
            <span className="gold-text">전문 투자 서비스</span>
          </h2>
          <p className="text-brand-slate-light leading-relaxed">
            단순한 정보 제공이 아닙니다. 고객 한 분 한 분의 자산 성장을 위한
            정밀하고 검증된 투자 전략을 제공합니다.
          </p>
        </motion.div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-brand-gold/10">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon || "TrendingUp"] || TrendingUp;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="group relative bg-brand-navy p-10 overflow-hidden hover:bg-brand-navy-mid transition-colors duration-500"
              >
                {/* Hover accent line */}
                <div className="absolute top-0 left-0 w-0 h-px bg-brand-gold group-hover:w-full transition-all duration-500" />
                <div className="absolute bottom-0 right-0 w-0 h-px bg-brand-gold group-hover:w-full transition-all duration-500" />

                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-gold/20 transition-colors duration-300">
                    <Icon className="w-7 h-7 text-brand-gold" />
                  </div>
                  <div className="flex-1">
                    <p className="text-brand-gold/70 text-xs tracking-widest uppercase mb-1">
                      {service.subtitle}
                    </p>
                    <h3 className="font-display text-xl font-bold text-white mb-3">
                      {service.title}
                    </h3>
                    <p className="text-brand-slate text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-brand-gold/50 text-sm group-hover:text-brand-gold transition-colors duration-300">
                  <span>자세히 보기</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <Link href="/services" className="btn-outline-gold">
            전체 서비스 보기
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
