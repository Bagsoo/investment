"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface Stat {
  label: string;
  value: string;
  description: string | null;
}

interface StatsSectionProps {
  stats: Stat[];
}

function CountUp({ value, inView }: { value: string; inView: boolean }) {
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;

    const prefix = value.startsWith("+") ? "+" : "";
    const suffix = value.endsWith("%") ? "%" : value.endsWith("년+") ? "년+" : "";
    const numStr = value.replace(/[+%년+]/g, "");
    const num = parseFloat(numStr);

    if (isNaN(num)) {
      setDisplay(value);
      return;
    }

    let start = 0;
    const duration = 2000;
    const step = 16;
    const increment = num / (duration / step);

    const timer = setInterval(() => {
      start += increment;
      if (start >= num) {
        setDisplay(`${prefix}${num}${suffix}`);
        clearInterval(timer);
      } else {
        setDisplay(`${prefix}${start.toFixed(num % 1 !== 0 ? 1 : 0)}${suffix}`);
      }
    }, step);

    return () => clearInterval(timer);
  }, [inView, value]);

  return <span>{display}</span>;
}

export default function StatsSection({ stats }: StatsSectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 bg-brand-navy-mid border-y border-brand-gold/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-brand-gold text-xs tracking-[0.3em] uppercase mb-4">Performance</p>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white">
            숫자로 증명하는 <span className="gold-text">실력</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-brand-gold/10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-brand-navy-mid p-10 text-center group hover:bg-brand-gold/5 transition-colors duration-300"
            >
              <div className="font-display text-4xl md:text-5xl font-black gold-text mb-3">
                <CountUp value={stat.value} inView={inView} />
              </div>
              <div className="text-white font-semibold mb-2">{stat.label}</div>
              {stat.description && (
                <div className="text-brand-slate text-xs leading-relaxed">{stat.description}</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
