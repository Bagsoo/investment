import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { FileText, Layout, Eye, PenSquare } from "lucide-react";

export const metadata: Metadata = { title: "대시보드" };

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: postCount },
    { count: boardCount },
    { data: recentPosts },
  ] = await Promise.all([
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase.from("boards").select("*", { count: "exact", head: true }),
    supabase
      .from("posts")
      .select("id, title, is_published, created_at, board:boards(name)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const stats = [
    { icon: FileText, label: "전체 게시글", value: postCount || 0, href: "/admin/posts/new" },
    { icon: Layout, label: "게시판 수", value: boardCount || 0, href: "/admin/boards" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">대시보드</h1>
          <p className="text-gray-400 text-sm mt-1">앤써인베스트먼트 관리자 패널</p>
        </div>
        <Link href="/admin/posts/new" className="btn-gold text-sm py-2.5 px-5">
          <PenSquare className="w-4 h-4" />
          새 글 작성
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-gray-900 border border-gray-800 p-6 hover:border-brand-gold/40 transition-colors"
            >
              <Icon className="w-6 h-6 text-brand-gold mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </Link>
          );
        })}
      </div>

      {/* Recent posts */}
      <div className="bg-gray-900 border border-gray-800">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-white font-semibold">최근 게시글</h2>
          <Link href="/admin/posts/new" className="text-brand-gold text-sm hover:text-brand-gold-light">
            새 글 작성 →
          </Link>
        </div>
        <div className="divide-y divide-gray-800">
          {recentPosts?.map((post) => (
            <div key={post.id} className="flex items-center justify-between p-4 hover:bg-gray-800/50">
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{post.title}</p>
                <p className="text-gray-500 text-xs mt-0.5">
                  {(post.board as { name: string } | null)?.name} ·{" "}
                  {new Date(post.created_at).toLocaleDateString("ko-KR")}
                </p>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <span
                  className={`text-xs px-2 py-0.5 ${
                    post.is_published
                      ? "text-green-400 bg-green-400/10"
                      : "text-gray-400 bg-gray-700"
                  }`}
                >
                  {post.is_published ? "발행됨" : "임시저장"}
                </span>
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="text-gray-400 hover:text-brand-gold text-xs transition-colors"
                >
                  수정
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
