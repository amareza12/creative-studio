import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://creative-studio-xi-three.vercel.app"),
  title: "Creative Studio | Digital & Branding Agency",
  description:
    "Creative Studio membantu brand tumbuh lewat desain, web, dan konten visual yang berdampak.",
  keywords: [
    "creative studio",
    "digital agency",
    "branding",
    "web design",
    "desain grafis",
    "jasa branding",
  ],
  openGraph: {
    title: "Creative Studio | Digital & Branding Agency",
    description:
      "Creative Studio membantu brand tumbuh lewat desain, web, dan konten visual yang berdampak.",
    url: "https://creative-studio-xi-three.vercel.app",
    siteName: "Creative Studio",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Creative Studio | Digital & Branding Agency",
    description:
      "Creative Studio membantu brand tumbuh lewat desain, web, dan konten visual yang berdampak.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={sora.className}>{children}</body>
    </html>
  );
}
