import type { Metadata } from "next";
import { Noto_Serif_KR, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSerifKR = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-display",
  display: "swap",
});

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://answerinvestment.co.kr"
  ),
  title: {
    default: "앤써인베스트먼트 | 당신의 자산에 정답을 드립니다",
    template: "%s | 앤써인베스트먼트",
  },
  description:
    "앤써인베스트먼트는 데이터 기반 분석과 전문 투자 전략으로 고객의 수익률을 극대화합니다. 누적 수익률 847%, 종목 적중률 91.2%.",
  keywords: ["투자자문", "주식투자", "수익률", "투자전략", "앤써인베스트먼트"],
  authors: [{ name: "앤써인베스트먼트" }],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://answerinvestment.co.kr",
    siteName: "앤써인베스트먼트",
    title: "앤써인베스트먼트 | 당신의 자산에 정답을 드립니다",
    description:
      "데이터 기반 분석과 전문 투자 전략으로 고객의 수익률을 극대화합니다.",
  },
  twitter: {
    card: "summary_large_image",
    title: "앤써인베스트먼트",
    description: "당신의 자산에 정답을 드립니다",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${notoSerifKR.variable} ${notoSansKR.variable}`}>
      <body className="font-body bg-brand-navy text-white antialiased">
        {children}
      </body>
    </html>
  );
}
