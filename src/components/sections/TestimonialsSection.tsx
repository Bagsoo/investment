"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote } from "lucide-react";
import type { Testimonial } from "@/types";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 bg-brand-navy-mid">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-brand-gold text-xs tracking-[0.3em] uppercase mb-4">Testimonials</p>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white">
            실제 회원들의 <span className="gold-text">수익 후기</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="glass-card p-8 relative group hover:border-brand-gold/40 transition-all duration-300"
            >
              {/* Profit badge */}
              {t.profit_rate && (
                <div className="absolute top-6 right-6 bg-brand-gold/10 border border-brand-gold/40 px-3 py-1">
                  <span className="text-brand-gold font-bold text-sm">{t.profit_rate}</span>
                </div>
              )}

              <Quote className="w-8 h-8 text-brand-gold/30 mb-6" />

              <p className="text-brand-slate-light text-sm leading-relaxed mb-6">
                {t.content}
              </p>

              <div className="border-t border-brand-gold/10 pt-6 flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">{t.author_name}</p>
                  {t.author_title && (
                    <p className="text-brand-slate text-xs mt-1">{t.author_title}</p>
                  )}
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-brand-gold fill-brand-gold" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center text-brand-slate/50 text-xs mt-10"
        >
          * 위 수익률은 개인 투자 결과이며, 미래 수익을 보장하지 않습니다.
        </motion.p>
      </div>
    </section>
  );
}
