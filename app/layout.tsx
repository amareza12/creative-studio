import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Creative Studio | Digital & Branding Agency",
  description: "Creative Studio membantu brand tumbuh lewat desain, web, dan konten visual yang berdampak.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={sora.className}>{children}</body>
    </html>
  );
}