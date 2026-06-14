"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animated stock chart lines on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const points: { x: number; y: number }[] = [];
    const numPoints = 80;
    let baseY = canvas.height * 0.6;
    let frame = 0;

    for (let i = 0; i < numPoints; i++) {
      baseY += (Math.random() - 0.35) * 20;
      baseY = Math.max(canvas.height * 0.2, Math.min(canvas.height * 0.8, baseY));
      points.push({ x: (i / numPoints) * canvas.width, y: baseY });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines
      ctx.strokeStyle = "rgba(201, 168, 76, 0.05)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(0, (canvas.height / 8) * i);
        ctx.lineTo(canvas.width, (canvas.height / 8) * i);
        ctx.stroke();
      }

      // Draw chart line
      const visiblePoints = Math.min(
        Math.floor((frame / 100) * numPoints),
        points.length
      );
      if (visiblePoints < 2) {
        frame++;
        requestAnimationFrame(animate);
        return;
      }

      // Gradient fill
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "rgba(201, 168, 76, 0.15)");
      gradient.addColorStop(1, "rgba(201, 168, 76, 0)");

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < visiblePoints; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.lineTo(points[visiblePoints - 1].x, canvas.height);
      ctx.lineTo(points[0].x, canvas.height);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw line
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < visiblePoints; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.strokeStyle = "rgba(201, 168, 76, 0.7)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Moving dot
      if (visiblePoints > 1) {
        const lastPoint = points[visiblePoints - 1];
        ctx.beginPath();
        ctx.arc(lastPoint.x, lastPoint.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#C9A84C";
        ctx.fill();

        // Pulse
        ctx.beginPath();
        ctx.arc(lastPoint.x, lastPoint.y, 10 + Math.sin(frame * 0.1) * 3, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(201, 168, 76, 0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      if (frame < 200) frame++;
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-brand-navy">
      {/* Background canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-60"
      />

      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-navy via-transparent to-brand-navy pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-transparent to-brand-navy pointer-events-none" />

      {/* Decorative elements */}
      <div className="absolute top-1/4 right-10 w-px h-40 bg-gradient-to-b from-transparent via-brand-gold/40 to-transparent" />
      <div className="absolute bottom-1/3 left-10 w-px h-60 bg-gradient-to-b from-transparent via-brand-gold/20 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-20">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="flex items-center gap-2 bg-brand-gold/10 border border-brand-gold/30 px-4 py-2">
              <TrendingUp className="w-4 h-4 text-brand-gold" />
              <span className="text-brand-gold text-sm font-medium tracking-widest uppercase">
                유사투자자문업 등록
              </span>
            </div>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] mb-8"
          >
            당신의 자산에{" "}
            <br />
            <span className="gold-text">정답</span>을 드립니다
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-brand-slate-light text-lg md:text-xl leading-relaxed max-w-2xl mb-12"
          >
            수백만 개의 데이터 포인트를 분석하고, 최정상 전문가의 통찰력을 결합한
            투자 전략. 평범한 자문이 아닌, 검증된 수익률로 증명합니다.
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="flex flex-wrap gap-8 mb-12"
          >
            {[
              { value: "+847%", label: "누적 수익률" },
              { value: "91.2%", label: "종목 적중률" },
              { value: "5년+", label: "운용 경력" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="font-display text-3xl font-black gold-text">{stat.value}</span>
                <span className="text-brand-slate text-xs tracking-widest uppercase mt-1">{stat.label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/contact" className="btn-gold">
              무료 상담 신청
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/services" className="btn-outline-gold">
              서비스 알아보기
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-brand-slate text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-10 bg-gradient-to-b from-brand-gold to-transparent"
        />
      </motion.div>
    </section>
  );
}
