"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";
import type { Board } from "@/types";
import { Save, Eye, Trash2, Tag, X } from "lucide-react";

const RichEditor = dynamic(() => import("@/components/editor/RichEditor"), { ssr: false });

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [postId, setPostId] = useState<string>("");
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [initialized, setInitialized] = useState(false);

  const [form, setForm] = useState({
    board_id: "",
    title: "",
    excerpt: "",
    content: {} as Record<string, unknown>,
    thumbnail_url: "",
    tags: [] as string[],
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    is_published: false,
    is_pinned: false,
  });

  useEffect(() => {
    params.then(({ id }) => {
      setPostId(id);
    });
  }, [params]);

  useEffect(() => {
    if (!postId) return;
    const init = async () => {
      const supabase = createClient();
      const [{ data: boardsData }, { data: post }] = await Promise.all([
        supabase.from("boards").select("*").order("order_index"),
        supabase.from("posts").select("*").eq("id", postId).single(),
      ]);
      if (boardsData) setBoards(boardsData);
      if (post) {
        setForm({
          board_id: post.board_id,
          title: post.title,
          excerpt: post.excerpt || "",
          content: post.content,
          thumbnail_url: post.thumbnail_url || "",
          tags: post.tags || [],
          meta_title: post.meta_title || "",
          meta_description: post.meta_description || "",
          meta_keywords: post.meta_keywords || "",
          is_published: post.is_published,
          is_pinned: post.is_pinned,
        });
      }
      setInitialized(true);
    };
    init();
  }, [postId]);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
  };

  const uploadThumbnail = async (file: File) => {
    const supabase = createClient();
    const filename = `thumb-${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from("post-images").upload(filename, file);
    if (error) { alert("업로드 실패: " + error.message); return; }
    const { data: urlData } = supabase.storage.from("post-images").getPublicUrl(data.path);
    setForm((f) => ({ ...f, thumbnail_url: urlData.publicUrl }));
  };

  const handleSave = async (publish: boolean) => {
    if (!form.title.trim()) { alert("제목을 입력하세요."); return; }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("posts").update({
      ...form,
      is_published: publish,
      published_at: publish ? new Date().toISOString() : null,
    }).eq("id", postId);
    setLoading(false);
    if (error) { alert("저장 실패: " + error.message); return; }
    alert("저장되었습니다.");
  };

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) return;
    const supabase = createClient();
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (error) { alert("삭제 실패: " + error.message); return; }
    router.push("/admin");
  };

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">게시글 수정</h1>
          <p className="text-gray-400 text-sm mt-1">내용을 수정하고 저장하세요</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 border border-red-400/30 hover:bg-red-400/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            삭제
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 border border-gray-700 hover:border-gray-500 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            임시저장
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={loading}
            className="btn-gold text-sm py-2.5 px-5 disabled:opacity-50"
          >
            <Eye className="w-4 h-4" />
            {loading ? "저장 중..." : "발행하기"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">제목 *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-brand-gold text-lg"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">요약</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              rows={2}
              className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-brand-gold resize-none text-sm"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">내용</label>
            <RichEditor
              content={form.content}
              onChange={(content) => setForm((f) => ({ ...f, content }))}
            />
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-gray-900 border border-gray-800 p-5">
            <h3 className="text-white font-semibold mb-4 text-sm">게시판</h3>
            <select
              value={form.board_id}
              onChange={(e) => setForm((f) => ({ ...f, board_id: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 focus:outline-none focus:border-brand-gold text-sm"
            >
              {boards.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-5">
            <h3 className="text-white font-semibold mb-4 text-sm">옵션</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_pinned}
                  onChange={(e) => setForm((f) => ({ ...f, is_pinned: e.target.checked }))}
                  className="w-4 h-4 accent-brand-gold"
                />
                <span className="text-gray-300 text-sm">상단 고정</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
                  className="w-4 h-4 accent-brand-gold"
                />
                <span className="text-gray-300 text-sm">발행 상태</span>
              </label>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-5">
            <h3 className="text-white font-semibold mb-4 text-sm">썸네일</h3>
            {form.thumbnail_url ? (
              <div className="relative">
                <img src={form.thumbnail_url} alt="썸네일" className="w-full h-32 object-cover" />
                <button
                  onClick={() => setForm((f) => ({ ...f, thumbnail_url: "" }))}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <label className="block w-full border-2 border-dashed border-gray-700 hover:border-brand-gold/50 p-6 text-center cursor-pointer transition-colors">
                <input type="file" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadThumbnail(f); }} />
                <span className="text-gray-500 text-sm">클릭하여 업로드</span>
              </label>
            )}
          </div>

          <div className="bg-gray-900 border border-gray-800 p-5">
            <h3 className="text-white font-semibold mb-4 text-sm">태그</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Enter로 추가"
                className="flex-1 bg-gray-800 border border-gray-700 text-white px-3 py-2 text-sm focus:outline-none focus:border-brand-gold"
              />
              <button onClick={addTag} className="px-3 bg-brand-gold/20 text-brand-gold hover:bg-brand-gold/30 transition-colors">
                <Tag className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 text-xs bg-brand-gold/10 text-brand-gold border border-brand-gold/30 px-2 py-1">
                  #{tag}
                  <button onClick={() => removeTag(tag)}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-5">
            <h3 className="text-white font-semibold mb-4 text-sm">SEO</h3>
            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-xs mb-1 block">SEO 제목</label>
                <input type="text" value={form.meta_title}
                  onChange={(e) => setForm((f) => ({ ...f, meta_title: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 text-sm focus:outline-none focus:border-brand-gold" />
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1 block">SEO 설명</label>
                <textarea value={form.meta_description}
                  onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 text-sm focus:outline-none focus:border-brand-gold resize-none" />
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1 block">키워드</label>
                <input type="text" value={form.meta_keywords}
                  onChange={(e) => setForm((f) => ({ ...f, meta_keywords: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 text-sm focus:outline-none focus:border-brand-gold" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
