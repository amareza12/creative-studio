"use client";

import { motion } from "framer-motion";

const testimonials = [
  { name: "Andi Pratama", role: "CEO, Kopi Nusantara", text: "Timnya sangat responsif dan hasil desainnya melebihi ekspektasi." },
  { name: "Sinta Dewi", role: "Founder, Local Fashion", text: "Website yang dibuat cepat dan sesuai brand kami banget." },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Apa Kata Klien</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="border border-white/10 rounded-2xl p-6"
          >
            <p className="text-white/70 mb-4">&ldquo;{t.text}&rdquo;</p>
            <p className="font-semibold">{t.name}</p>
            <p className="text-white/40 text-sm">{t.role}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}