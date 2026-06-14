import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PublicLayout from "@/components/layout/PublicLayout";
import PostContent from "@/components/ui/PostContent";
import { Calendar, Eye, Tag, ChevronLeft } from "lucide-react";

interface Props {
  params: Promise<{ slug: string; postId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postId } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("title, meta_title, meta_description, meta_keywords, thumbnail_url, excerpt")
    .eq("id", postId)
    .single();

  if (!post) return { title: "게시글을 찾을 수 없습니다" };

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || undefined,
    keywords: post.meta_keywords || undefined,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || undefined,
      images: post.thumbnail_url ? [post.thumbnail_url] : [],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug, postId } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("*, board:boards(name, slug)")
    .eq("id", postId)
    .eq("is_published", true)
    .single();

  if (!post) notFound();

  // Increment view count
  await supabase.rpc("increment_view_count", { post_id: postId });

  return (
    <PublicLayout>
      <div className="pt-28 pb-20 bg-brand-navy min-h-screen">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-sm text-brand-slate">
            <Link href="/" className="hover:text-brand-gold transition-colors">홈</Link>
            <span>/</span>
            <Link href={`/board/${slug}`} className="hover:text-brand-gold transition-colors">
              {post.board?.name}
            </Link>
            <span>/</span>
            <span className="text-brand-slate/60 truncate max-w-xs">{post.title}</span>
          </div>

          {/* Post header */}
          <div className="mb-10 pb-8 border-b border-brand-gold/20">
            {post.is_pinned && (
              <span className="inline-block text-xs bg-brand-gold/20 text-brand-gold px-2 py-0.5 border border-brand-gold/30 mb-4">
                공지
              </span>
            )}
            <h1 className="font-display text-3xl md:text-4xl font-black text-white leading-tight mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-brand-slate/70">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {post.published_at
                  ? new Date(post.published_at).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : ""}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                조회 {post.view_count}
              </span>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 text-xs text-brand-gold/70 bg-brand-gold/10 border border-brand-gold/20 px-3 py-1"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Thumbnail */}
          {post.thumbnail_url && (
            <div className="mb-10 overflow-hidden">
              <img
                src={post.thumbnail_url}
                alt={post.title}
                className="w-full max-h-96 object-cover"
              />
            </div>
          )}

          {/* Post content */}
          <div className="tiptap-content">
            <PostContent content={post.content} />
          </div>

          {/* Back button */}
          <div className="mt-16 pt-8 border-t border-brand-gold/20">
            <Link
              href={`/board/${slug}`}
              className="inline-flex items-center gap-2 text-brand-slate hover:text-brand-gold transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
