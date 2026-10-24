import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({ subsets: ["arabic"], weight: ["400", "500", "700", "800"], variable: "--font-tajawal" });
export const metadata: Metadata = { title: "CAC Election Desk", description: "نظام تسجيل المشاركة في انتخابات نادي علم الحاسوب" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ar" dir="rtl"><body className={`${tajawal.variable} font-sans antialiased`}>{children}</body></html>;
}
