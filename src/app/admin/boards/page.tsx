"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Board } from "@/types";
import { Plus, Trash2, GripVertical, Eye, EyeOff, Save } from "lucide-react";

export default function AdminBoardsPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(false);
  const [newBoard, setNewBoard] = useState({ name: "", slug: "", description: "" });
  const [showForm, setShowForm] = useState(false);

  const fetchBoards = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("boards").select("*").order("order_index");
    if (data) setBoards(data);
  };

  useEffect(() => { fetchBoards(); }, []);

  const createBoard = async () => {
    if (!newBoard.name.trim() || !newBoard.slug.trim()) {
      alert("이름과 슬러그를 입력하세요.");
      return;
    }
    const slugPattern = /^[a-z0-9-]+$/;
    if (!slugPattern.test(newBoard.slug)) {
      alert("슬러그는 영문 소문자, 숫자, 하이픈만 사용 가능합니다.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("boards").insert({
      ...newBoard,
      order_index: boards.length + 1,
    });
    setLoading(false);
    if (error) { alert("생성 실패: " + error.message); return; }
    setNewBoard({ name: "", slug: "", description: "" });
    setShowForm(false);
    fetchBoards();
  };

  const toggleVisibility = async (board: Board) => {
    const supabase = createClient();
    await supabase.from("boards").update({ is_visible: !board.is_visible }).eq("id", board.id);
    fetchBoards();
  };

  const deleteBoard = async (id: string) => {
    if (!confirm("게시판을 삭제하면 모든 게시글도 삭제됩니다. 계속하시겠습니까?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("boards").delete().eq("id", id);
    if (error) { alert("삭제 실패: " + error.message); return; }
    fetchBoards();
  };

  const updateBoard = async (board: Board) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("boards")
      .update({ name: board.name, description: board.description })
      .eq("id", board.id);
    if (error) alert("수정 실패: " + error.message);
    else fetchBoards();
  };

  return (
    <div className="max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">게시판 관리</h1>
          <p className="text-gray-400 text-sm mt-1">게시판을 추가, 수정, 삭제하세요</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-gold text-sm py-2.5 px-5"
        >
          <Plus className="w-4 h-4" />
          게시판 추가
        </button>
      </div>

      {/* New board form */}
      {showForm && (
        <div className="bg-gray-900 border border-brand-gold/30 p-6 mb-6">
          <h3 className="text-white font-semibold mb-4">새 게시판</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-gray-400 text-xs mb-1 block">게시판 이름 *</label>
              <input
                type="text"
                value={newBoard.name}
                onChange={(e) => setNewBoard((f) => ({ ...f, name: e.target.value }))}
                placeholder="예: 공지사항"
                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 focus:outline-none focus:border-brand-gold text-sm"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">슬러그 (영문) *</label>
              <input
                type="text"
                value={newBoard.slug}
                onChange={(e) => setNewBoard((f) => ({ ...f, slug: e.target.value.toLowerCase() }))}
                placeholder="예: notice"
                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 focus:outline-none focus:border-brand-gold text-sm"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="text-gray-400 text-xs mb-1 block">설명</label>
            <input
              type="text"
              value={newBoard.description}
              onChange={(e) => setNewBoard((f) => ({ ...f, description: e.target.value }))}
              placeholder="게시판 설명"
              className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 focus:outline-none focus:border-brand-gold text-sm"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={createBoard}
              disabled={loading}
              className="btn-gold text-sm py-2 px-5 disabled:opacity-50"
            >
              {loading ? "생성 중..." : "생성"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-5 py-2 text-sm text-gray-400 border border-gray-700 hover:border-gray-500 transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* Board list */}
      <div className="space-y-3">
        {boards.map((board) => (
          <BoardItem
            key={board.id}
            board={board}
            onToggle={() => toggleVisibility(board)}
            onDelete={() => deleteBoard(board.id)}
            onSave={updateBoard}
          />
        ))}
        {boards.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            게시판이 없습니다. 첫 게시판을 추가해보세요.
          </div>
        )}
      </div>
    </div>
  );
}

function BoardItem({
  board,
  onToggle,
  onDelete,
  onSave,
}: {
  board: Board;
  onToggle: () => void;
  onDelete: () => void;
  onSave: (b: Board) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(board.name);
  const [description, setDescription] = useState(board.description || "");

  return (
    <div className={`bg-gray-900 border p-5 transition-colors ${board.is_visible ? "border-gray-800" : "border-gray-800 opacity-60"}`}>
      <div className="flex items-start gap-4">
        <GripVertical className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="space-y-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 text-sm focus:outline-none focus:border-brand-gold"
              />
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="설명"
                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 text-sm focus:outline-none focus:border-brand-gold"
              />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white font-medium">{board.name}</span>
                <span className="text-gray-500 text-xs font-mono">/board/{board.slug}</span>
                {!board.is_visible && (
                  <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5">숨김</span>
                )}
              </div>
              {board.description && (
                <p className="text-gray-400 text-sm mt-1">{board.description}</p>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {editing ? (
            <>
              <button
                onClick={() => { onSave({ ...board, name, description }); setEditing(false); }}
                className="p-1.5 text-brand-gold hover:bg-brand-gold/10 rounded transition-colors"
                title="저장"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setName(board.name); setDescription(board.description || ""); setEditing(false); }}
                className="p-1.5 text-gray-400 hover:bg-gray-800 rounded transition-colors"
                title="취소"
              >
                <span className="text-xs">취소</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors text-xs"
              >
                수정
              </button>
              <button onClick={onToggle} className="p-1.5 text-gray-400 hover:text-brand-gold hover:bg-gray-800 rounded transition-colors" title="보이기/숨기기">
                {board.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button onClick={onDelete} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded transition-colors" title="삭제">
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
