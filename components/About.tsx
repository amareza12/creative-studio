"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Stat = { label: string; value: string };

export default function About() {
  const [title, setTitle] = useState("Tentang Kami");
  const [description, setDescription] = useState("");
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "content", "about"), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setTitle(data.title || "Tentang Kami");
        setDescription(data.description || "");
        setStats(data.stats || []);
      }
    });
    return () => unsub();
  }, []);

  return (
    <section id="about" className="py-24 px-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid md:grid-cols-2 gap-12 items-center"
      >
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-white/60 leading-relaxed whitespace-pre-line">{description}</p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="border border-white/10 rounded-2xl p-6">
              <p className="text-3xl font-bold text-[var(--accent)]">{stat.value}</p>
              <p className="text-white/50 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
