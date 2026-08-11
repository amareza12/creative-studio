"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { iconMap, iconOptions } from "@/lib/icons";

type Service = {
  id: string;
  title: string;
  desc: string;
  icon: string;
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const q = query(collection(db, "services"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Service[];
      setServices(data.filter((s) => s.title && s.desc));
    });
    return () => unsub();
  }, []);

  return (
    <section id="services" className="py-24 px-6 max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Layanan Kami</h2>

      {services.length === 0 ? (
        <p className="text-center text-white/40">Belum ada layanan ditampilkan.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => {
            const IconComp = iconMap[service.icon] || iconMap[iconOptions[0]];
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="border border-white/10 rounded-2xl p-6 hover:border-[var(--accent)] transition"
              >
                <IconComp className="text-[var(--accent)] mb-4" size={28} />
                <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                <p className="text-white/50 text-sm">{service.desc}</p>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
