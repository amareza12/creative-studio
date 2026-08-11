"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const menu = [
  { label: "Pesan Masuk", href: "/admin" },
  { label: "Home", href: "/admin/home" },
  { label: "About", href: "/admin/about" },
  { label: "Services", href: "/admin/services" },
  { label: "Portfolio", href: "/admin/portfolio" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  return (
    <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4 overflow-x-auto">
      <div className="flex gap-4">
        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm px-3 py-2 rounded-full transition whitespace-nowrap ${
              pathname === item.href
                ? "bg-[var(--accent)] text-black font-semibold"
                : "text-white/60 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <button
        onClick={handleLogout}
        className="border border-white/20 px-4 py-2 rounded-full text-sm hover:border-[var(--accent)] hover:text-[var(--accent)] transition whitespace-nowrap ml-4"
      >
        Logout
      </button>
    </div>
  );
}
