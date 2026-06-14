"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Layout,
  Users,
  BarChart3,
  Settings,
  LogOut,
  TrendingUp,
  Menu,
  X,
  PenSquare,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { icon: LayoutDashboard, label: "대시보드", href: "/admin" },
  { icon: PenSquare, label: "새 글 작성", href: "/admin/posts/new" },
  { icon: Layout, label: "게시판 관리", href: "/admin/boards" },
  { icon: BarChart3, label: "통계 관리", href: "/admin/stats" },
  { icon: Users, label: "팀 관리", href: "/admin/team" },
  { icon: Settings, label: "사이트 설정", href: "/admin/settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const NavContent = () => (
    <>
      <div className="p-6 border-b border-gray-800">
        <Link href="/admin" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
          <div className="w-9 h-9 bg-gradient-to-br from-brand-gold to-brand-gold-dark flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-brand-navy" />
          </div>
          <div>
            <div className="font-display text-sm font-bold gold-text">앤써인베스트먼트</div>
            <div className="text-xs text-gray-500">Admin Panel</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/admin" && item.href !== "/admin/posts/new" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                active
                  ? "bg-brand-gold/10 text-brand-gold border-l-2 border-brand-gold"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-1">
        <Link
          href="/"
          target="_blank"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-brand-gold transition-colors"
        >
          <TrendingUp className="w-4 h-4" />
          사이트 보기
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-red-400 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          로그아웃
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 flex-col z-40">
        <NavContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 h-14">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-brand-gold to-brand-gold-dark flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-brand-navy" />
          </div>
          <span className="font-display text-sm font-bold gold-text">앤써인베스트먼트</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-gray-400 hover:text-white"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="lg:hidden fixed left-0 top-0 h-full w-72 bg-gray-900 border-r border-gray-800 flex flex-col z-50">
            <NavContent />
          </aside>
        </>
      )}
    </>
  );
}
