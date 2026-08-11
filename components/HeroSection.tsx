"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function HeroSection() {
  const [heading, setHeading] = useState("Kami Membangun\nBrand yang Diingat.");
  const [description, setDescription] = useState(
    "Studio kreatif untuk branding dan desain digital yang membantu bisnis kamu tumbuh."
  );
  const [buttonText, setButtonText] = useState("Mulai Proyek");
  const [buttonLink, setButtonLink] = useState("#contact");
  const [backgroundImage, setBackgroundImage] = useState("/hero-bg.jpg");

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "content", "hero"), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setHeading(data.heading || "Kami Membangun\nBrand yang Diingat.");
        setDescription(data.description || "");
        setButtonText(data.buttonText || "Mulai Proyek");
        setButtonLink(data.buttonLink || "#contact");
        if (data.backgroundImage) setBackgroundImage(data.backgroundImage);
      }
    });
    return () => unsub();
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center px-6 overflow-hidden"
    >
      {/* Background Image */}
      <Image
        src={backgroundImage}
        alt="Hero background"
        fill
        priority
        className="object-cover"
      />

      {/* Overlay gelap supaya teks tetap kebaca */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Konten */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 max-w-4xl mx-auto w-full"
      >
        <h1 className="text-4xl md:text-6xl font-semibold leading-tight tracking-tight whitespace-pre-line">
          {heading}
        </h1>

        <p className="text-white/50 max-w-md mt-6 text-base md:text-lg">
          {description}
        </p>

        <Link
          href={buttonLink}
          className="inline-block mt-8 border border-white/20 px-6 py-3 rounded-full text-sm font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
        >
          {buttonText}
        </Link>
      </motion.div>
    </section>
  );
}
