import type { Metadata } from "next";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: {
    default: "관리자",
    template: "%s | 앤써인베스트먼트 관리자",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950">
      <AdminSidebar />
      <main className="lg:ml-64 pt-14 lg:pt-0 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
