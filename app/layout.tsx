import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Bảng chấm công", description: "Bảng theo dõi giờ làm theo tháng.", robots: { index: false, follow: false } };
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f5f7fa" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
