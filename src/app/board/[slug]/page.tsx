import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PublicLayout from "@/components/layout/PublicLayout";
import PageHero from "@/components/ui/PageHero";
import { Calendar, Eye, Tag } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: board } = await supabase
    .from("boards")
    .select("name, description")
    .eq("slug", slug)
    .single();

  if (!board) return { title: "게시판을 찾을 수 없습니다" };

  return {
    title: board.name,
    description: board.description || undefined,
  };
}

export default async function BoardPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: board } = await supabase
    .from("boards")
    .select("*")
    .eq("slug", slug)
    .eq("is_visible", true)
    .single();

  if (!board) notFound();

  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, excerpt, thumbnail_url, tags, view_count, published_at, is_pinned")
    .eq("board_id", board.id)
    .eq("is_published", true)
    .order("is_pinned", { ascending: false })
    .order("published_at", { ascending: false });

  // Fetch all boards for sidebar
  const { data: allBoards } = await supabase
    .from("boards")
    .select("*")
    .eq("is_visible", true)
    .order("order_index");

  return (
    <PublicLayout>
      <PageHero
        eyebrow="Board"
        title={board.name}
        subtitle={board.description || undefined}
      />

      <section className="py-16 bg-brand-navy min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex gap-12">
            {/* Sidebar */}
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="sticky top-28">
                <p className="text-brand-gold text-xs tracking-widest uppercase mb-4">게시판</p>
                <nav className="space-y-1">
                  {allBoards?.map((b) => (
                    <Link
                      key={b.id}
                      href={`/board/${b.slug}`}
                      className={`block px-4 py-3 text-sm transition-colors ${
                        b.slug === slug
                          ? "bg-brand-gold/10 text-brand-gold border-l-2 border-brand-gold"
                          : "text-brand-slate hover:text-white hover:bg-brand-navy-mid"
                      }`}
                    >
                      {b.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Posts list */}
            <div className="flex-1">
              {posts && posts.length > 0 ? (
                <div className="divide-y divide-brand-gold/10">
                  {posts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/board/${slug}/${post.id}`}
                      className="block py-6 group hover:bg-brand-gold/5 -mx-4 px-4 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            {post.is_pinned && (
                              <span className="text-xs bg-brand-gold/20 text-brand-gold px-2 py-0.5 border border-brand-gold/30">
                                공지
                              </span>
                            )}
                            <h3 className="text-white font-semibold group-hover:text-brand-gold transition-colors truncate">
                              {post.title}
                            </h3>
                          </div>
                          {post.excerpt && (
                            <p className="text-brand-slate text-sm truncate mb-3">{post.excerpt}</p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-brand-slate/70">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {post.published_at
                                ? new Date(post.published_at).toLocaleDateString("ko-KR")
                                : ""}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {post.view_count}
                            </span>
                            {post.tags && post.tags.length > 0 && (
                              <span className="flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                {post.tags.slice(0, 2).join(", ")}
                              </span>
                            )}
                          </div>
                        </div>
                        {post.thumbnail_url && (
                          <div className="w-20 h-16 flex-shrink-0 overflow-hidden">
                            <img
                              src={post.thumbnail_url}
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-24">
                  <p className="text-brand-slate">아직 게시글이 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
