"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAdminAuth } from "@/lib/useAdminAuth";
import AdminNav from "@/components/admin/AdminNav";

type Stat = { label: string; value: string };

export default function AdminAbout() {
  const { user, checking } = useAdminAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const snap = await getDoc(doc(db, "content", "about"));
      if (snap.exists()) {
        const data = snap.data();
        setTitle(data.title || "");
        setDescription(data.description || "");
        setStats(data.stats || []);
      } else {
        setTitle("Tentang Kami");
        setDescription("");
        setStats([
          { label: "Proyek Selesai", value: "" },
          { label: "Klien Puas", value: "" },
          { label: "Tahun Pengalaman", value: "" },
          { label: "Tim Kreatif", value: "" },
        ]);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const updateStat = (index: number, field: keyof Stat, val: string) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: val };
    setStats(newStats);
  };

  const addStat = () => {
    setStats([...stats, { label: "", value: "" }]);
  };

  const removeStat = (index: number) => {
    setStats(stats.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await setDoc(doc(db, "content", "about"), { title, description, stats });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  if (checking || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Memuat...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 max-w-3xl mx-auto">
      <AdminNav />
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Kelola About</h1>

      <div className="flex flex-col gap-4">
        <div>
          <label className="text-xs text-white/50 mb-2 block">Judul Section</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-[var(--accent)]"
          />
        </div>

        <div>
          <label className="text-xs text-white/50 mb-2 block">Deskripsi</label>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-[var(--accent)]"
          />
        </div>

        <div>
          <label className="text-xs text-white/50 mb-2 block">Statistik</label>
          <div className="flex flex-col gap-3">
            {stats.map((stat, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Angka (mis: 120+)"
                  value={stat.value}
                  onChange={(e) => updateStat(i, "value", e.target.value)}
                  className="w-28 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                />
                <input
                  type="text"
                  placeholder="Label (mis: Proyek Selesai)"
                  value={stat.label}
                  onChange={(e) => updateStat(i, "label", e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                />
                <button
                  onClick={() => removeStat(i)}
                  className="text-xs border border-red-400/30 text-red-400 px-3 py-2 rounded-full hover:bg-red-400/10 transition"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addStat}
            className="mt-3 text-sm border border-white/20 px-4 py-2 rounded-full hover:border-white/40 transition"
          >
            + Tambah Statistik
          </button>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-4 bg-[var(--accent)] text-black font-semibold px-6 py-3 rounded-full hover:opacity-90 transition disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : saved ? "Tersimpan!" : "Simpan Perubahan"}
        </button>
      </div>
    </div>
  );
}
