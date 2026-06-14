import Link from "next/link";
import PublicLayout from "@/components/layout/PublicLayout";

export default function NotFound() {
  return (
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center bg-brand-navy">
        <div className="text-center px-4">
          <p className="font-display text-8xl font-black gold-text mb-4">404</p>
          <h1 className="text-white text-2xl font-bold mb-4">페이지를 찾을 수 없습니다</h1>
          <p className="text-brand-slate mb-8">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
          <Link href="/" className="btn-gold">홈으로 돌아가기</Link>
        </div>
      </div>
    </PublicLayout>
  );
}
