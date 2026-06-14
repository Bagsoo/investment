"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import type { TeamMember } from "@/types";

export default function TeamSection({ members }: { members: TeamMember[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 bg-brand-navy-mid">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-brand-gold text-xs tracking-[0.3em] uppercase mb-4">Our Team</p>
          <h2 className="font-display text-4xl font-black text-white">
            전문가 <span className="gold-text">팀 소개</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {members.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="glass-card p-8 group"
            >
              <div className="w-20 h-20 rounded-full bg-brand-gold/20 border-2 border-brand-gold/30 overflow-hidden mb-6 mx-auto">
                {member.photo_url ? (
                  <Image
                    src={member.photo_url}
                    alt={member.name}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-gold font-display font-bold text-2xl">
                    {member.name[0]}
                  </div>
                )}
              </div>
              <div className="text-center mb-4">
                <h3 className="text-white font-bold text-lg">{member.name}</h3>
                <p className="text-brand-gold text-sm">{member.position}</p>
              </div>
              {member.bio && (
                <p className="text-brand-slate text-sm text-center leading-relaxed mb-4">{member.bio}</p>
              )}
              {member.career && member.career.length > 0 && (
                <ul className="space-y-1">
                  {member.career.map((c, j) => (
                    <li key={j} className="text-brand-slate/70 text-xs flex items-center gap-2">
                      <span className="w-1 h-1 bg-brand-gold rounded-full flex-shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
