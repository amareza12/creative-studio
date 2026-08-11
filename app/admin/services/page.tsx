"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { iconMap, iconOptions } from "@/lib/icons";
import AdminNav from "@/components/admin/AdminNav";

type Service = {
  id: string;
  title: string;
  desc: string;
  icon: string;
};

export default function AdminServices() {
  const { user, checking } = useAdminAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [icon, setIcon] = useState(iconOptions[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "services"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Service[];
      setServices(data);
    });
    return () => unsub();
  }, [user]);

  const resetForm = () => {
    setTitle("");
    setDesc("");
    setIcon(iconOptions[0]);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !desc) return;
    setSaving(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, "services", editingId), { title, desc, icon });
      } else {
        await addDoc(collection(db, "services"), {
          title,
          desc,
          icon,
          createdAt: new Date(),
        });
      }
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setTitle(service.title);
    setDesc(service.desc);
    setIcon(service.icon);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin mau hapus layanan ini?")) return;
    await deleteDoc(doc(db, "services", id));
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Memeriksa akses...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 max-w-5xl mx-auto">
      <AdminNav />
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Kelola Layanan</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col gap-3 mb-8"
      >
        <p className="font-semibold text-sm text-white/70">
          {editingId ? "Edit Layanan" : "Tambah Layanan Baru"}
        </p>
        <input
          type="text"
          placeholder="Judul layanan (mis: Branding)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-[var(--accent)]"
        />
        <textarea
          placeholder="Deskripsi singkat"
          rows={2}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-[var(--accent)]"
        />

        <div>
          <label className="text-xs text-white/50 mb-2 block">Pilih Ikon</label>
          <div className="grid grid-cols-6 gap-2">
            {iconOptions.map((name) => {
              const IconComp = iconMap[name];
              return (
                <button
                  type="button"
                  key={name}
                  onClick={() => setIcon(name)}
                  className={`flex items-center justify-center p-3 rounded-lg border transition ${
                    icon === name
                      ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                      : "border-white/10 text-white/50 hover:border-white/30"
                  }`}
                  title={name}
                >
                  <IconComp size={20} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 mt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-[var(--accent)] text-black font-semibold px-6 py-3 rounded-full hover:opacity-90 transition disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : editingId ? "Update" : "Tambah"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="border border-white/20 px-6 py-3 rounded-full hover:border-white/40 transition"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((service) => {
          const IconComp = iconMap[service.icon] || iconMap[iconOptions[0]];
          return (
            <div key={service.id} className="border border-white/10 rounded-2xl p-5">
              <IconComp className="text-[var(--accent)] mb-3" size={24} />
              <h3 className="font-semibold mb-1">{service.title}</h3>
              <p className="text-white/50 text-sm mb-4">{service.desc}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="text-xs border border-white/20 px-3 py-1.5 rounded-full hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="text-xs border border-red-400/30 text-red-400 px-3 py-1.5 rounded-full hover:bg-red-400/10 transition"
                >
                  Hapus
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {services.length === 0 && (
        <p className="text-white/50 mt-4">Belum ada layanan. Tambah dulu lewat form di atas.</p>
      )}
    </div>
  );
}
