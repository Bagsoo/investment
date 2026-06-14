"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Board } from "@/types";

const staticNavItems = [
  { label: "홈", href: "/" },
  { label: "회사소개", href: "/about" },
  { label: "서비스", href: "/services" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [boards, setBoards] = useState<Board[]>([]);
  const [boardsOpen, setBoardsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchBoards = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("boards")
        .select("*")
        .eq("is_visible", true)
        .order("order_index");
      if (data) setBoards(data);
    };
    fetchBoards();
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-brand-navy/95 backdrop-blur-md border-b border-brand-gold/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-gold to-brand-gold-dark flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-brand-navy" />
            </div>
            <div>
              <span className="font-display text-lg font-bold gold-text tracking-tight">
                앤써인베스트먼트
              </span>
              <p className="text-[10px] text-brand-slate tracking-widest uppercase">
                Answer Investment
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {staticNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium tracking-wide transition-colors duration-200 relative group ${
                  pathname === item.href
                    ? "text-brand-gold"
                    : "text-brand-slate-light hover:text-white"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-brand-gold transition-all duration-300 ${
                    pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}

            {/* 게시판 드롭다운 */}
            <div
              className="relative"
              onMouseEnter={() => setBoardsOpen(true)}
              onMouseLeave={() => setBoardsOpen(false)}
            >
              <button className="text-sm font-medium tracking-wide text-brand-slate-light hover:text-white transition-colors flex items-center gap-1">
                게시판
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {boardsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-44 bg-brand-navy-light border border-brand-gold/20 shadow-xl"
                  >
                    {boards.map((board) => (
                      <Link
                        key={board.id}
                        href={`/board/${board.slug}`}
                        className="block px-5 py-3 text-sm text-brand-slate-light hover:text-brand-gold hover:bg-brand-gold/5 transition-colors border-b border-brand-gold/10 last:border-0"
                      >
                        {board.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/contact" className="btn-gold text-sm py-2.5 px-6">
              무료 상담
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-brand-navy-light border-t border-brand-gold/20"
          >
            <div className="px-4 py-6 space-y-4">
              {staticNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-brand-slate-light hover:text-brand-gold py-2 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-brand-gold/20 pt-4">
                <p className="text-xs text-brand-slate mb-2 uppercase tracking-widest">게시판</p>
                {boards.map((board) => (
                  <Link
                    key={board.id}
                    href={`/board/${board.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="block text-brand-slate-light hover:text-brand-gold py-2 pl-2 text-sm transition-colors"
                  >
                    {board.name}
                  </Link>
                ))}
              </div>
              <Link href="/contact" onClick={() => setIsOpen(false)} className="btn-gold w-full text-center text-sm py-3">
                무료 상담 신청
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
