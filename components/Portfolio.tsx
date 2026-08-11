"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Project = {
  id: string;
  title: string;
  image: string;
  description?: string; // ⬅️ field baru, isi dari Firestore
  tags?: string[];       // ⬅️ opsional, kalau mau tampilkan tech stack
};

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<Project | null>(null); // ⬅️ state modal

  useEffect(() => {
    const q = query(collection(db, "portfolio"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Project[];
      setProjects(data.filter((p) => p.image && p.image.trim() !== "" && p.title));
    });
    return () => unsub();
  }, []);

  return (
    <section id="portfolio" className="py-24 px-6 max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Portofolio</h2>

      {projects.length === 0 ? (
        <p className="text-center text-white/40">Belum ada project ditampilkan.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() => setSelected(project)} // ⬅️ trigger modal
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-white/5 cursor-pointer"
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-end p-5">
                <p className="font-semibold">{project.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ⬇️ Modal detail project */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="bg-[#0d0d0d] rounded-2xl max-w-2xl w-full overflow-hidden max-h-[85vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full aspect-[16/9]">
                <Image
                  src={selected.image}
                  alt={selected.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-2xl font-bold">{selected.title}</h3>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-white/60 hover:text-white shrink-0"
                  >
                    <X size={22} />
                  </button>
                </div>

                {selected.description ? (
                  <p className="text-white/70 mt-4 leading-relaxed whitespace-pre-line">
                    {selected.description}
                  </p>
                ) : (
                  <p className="text-white/40 mt-4 italic">Belum ada deskripsi.</p>
                )}

                {selected.tags && selected.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-5">
                    {selected.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-white/10 px-3 py-1 rounded-full text-white/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}