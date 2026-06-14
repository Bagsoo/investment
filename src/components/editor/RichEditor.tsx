"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import YoutubeExtension from "@tiptap/extension-youtube";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { Color } from "@tiptap/extension-color";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Link as LinkIcon,
  Image as ImageIcon,
  Youtube,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Code,
  Undo,
  Redo,
  AlignLeft,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRef } from "react";

interface RichEditorProps {
  content?: Record<string, unknown>;
  onChange?: (content: Record<string, unknown>) => void;
}

const ToolbarButton = ({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-2 rounded transition-colors ${
      active
        ? "bg-brand-gold/20 text-brand-gold"
        : "text-gray-400 hover:text-white hover:bg-gray-700"
    }`}
  >
    {children}
  </button>
);

export default function RichEditor({ content, onChange }: RichEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension.configure({ inline: false }),
      LinkExtension.configure({ openOnClick: false }),
      YoutubeExtension.configure({ width: 640, height: 360 }),
      TextStyle,
      Underline,
      Color,
      Placeholder.configure({ placeholder: "내용을 입력하세요..." }),
    ],
    content: content || "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON() as Record<string, unknown>);
    },
  });

  if (!editor) return null;

  const uploadImage = async (file: File) => {
    const supabase = createClient();
    const filename = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("post-images")
      .upload(filename, file);

    if (error) {
      alert("이미지 업로드 실패: " + error.message);
      return;
    }

    const { data: urlData } = supabase.storage.from("post-images").getPublicUrl(data.path);
    editor.chain().focus().setImage({ src: urlData.publicUrl }).run();
  };

  const addYoutube = () => {
    const url = prompt("YouTube URL을 입력하세요:");
    if (url) editor.commands.setYoutubeVideo({ src: url });
  };

  const setLink = () => {
    const prev = editor.getAttributes("link").href;
    const url = prompt("링크 URL을 입력하세요:", prev);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  };

  return (
    <div className="border border-gray-700 bg-gray-900">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-700 bg-gray-800/50">
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="실행취소">
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="다시실행">
          <Redo className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-gray-700 self-center mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
          title="제목 1"
        >
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="제목 2"
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="제목 3"
        >
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-gray-700 self-center mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="굵게"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="기울임"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="밑줄"
        >
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="취소선"
        >
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title="코드"
        >
          <Code className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-gray-700 self-center mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="목록"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="번호 목록"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="인용"
        >
          <Quote className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="구분선"
        >
          <Minus className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-gray-700 self-center mx-1" />

        <ToolbarButton onClick={setLink} active={editor.isActive("link")} title="링크">
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => fileInputRef.current?.click()} title="이미지 업로드">
          <ImageIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={addYoutube} title="유튜브 삽입">
          <Youtube className="w-4 h-4" />
        </ToolbarButton>

        {/* Color picker */}
        <div className="flex items-center gap-1 ml-1">
          <span className="text-gray-500 text-xs">색상:</span>
          <input
            type="color"
            className="w-7 h-7 bg-transparent border border-gray-600 cursor-pointer rounded"
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            title="텍스트 색상"
          />
        </div>
      </div>

      {/* Editor area */}
      <div className="p-6 min-h-[400px] text-white">
        <EditorContent
          editor={editor}
          className="prose prose-invert max-w-none focus:outline-none tiptap-content"
        />
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadImage(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
