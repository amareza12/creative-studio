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
import { uploadToCloudinary } from "@/lib/cloudinary";
import AdminNav from "@/components/admin/AdminNav";

type Project = {
  id: string;
  title: string;
  image: string;
  description?: string; // ⬅️ baru
};

export default function AdminPortfolio() {
  const { user, checking } = useAdminAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // ⬅️ baru
  const [image, setImage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "portfolio"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Project[];
      setProjects(data);
    });
    return () => unsub();
  }, [user]);

  const resetForm = () => {
    setTitle("");
    setDescription(""); // ⬅️ baru
    setImage("");
    setFile(null);
    setPreview("");
    setEditingId(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    if (!file && !image) return;

    setSaving(true);
    try {
      let imageUrl = image;

      if (file) {
        setUploading(true);
        imageUrl = await uploadToCloudinary(file);
        setUploading(false);
      }

      if (editingId) {
        await updateDoc(doc(db, "portfolio", editingId), {
          title,
          image: imageUrl,
          description, // ⬅️ baru
        });
      } else {
        await addDoc(collection(db, "portfolio"), {
          title,
          image: imageUrl,
          description, // ⬅️ baru
          createdAt: new Date(),
        });
      }
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan project. Coba lagi.");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setTitle(project.title);
    setDescription(project.description || ""); // ⬅️ baru
    setImage(project.image);
    setPreview(project.image);
    setFile(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin mau hapus project ini?")) return;
    await deleteDoc(doc(db, "portfolio", id));
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
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Kelola Portfolio</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col gap-3 mb-8"
      >
        <p className="font-semibold text-sm text-white/70">
          {editingId ? "Edit Project" : "Tambah Project Baru"}
        </p>
        <input
          type="text"
          placeholder="Judul project (mis: Brand Identity - Kopi Nusantara)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-[var(--accent)]"
        />

        {/* ⬇️ field baru */}
        <textarea
          placeholder="Deskripsi pekerjaan (apa yang dikerjakan, tools yang dipakai, dll)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-[var(--accent)] resize-none"
        />

        <div>
          <label className="text-xs text-white/50 mb-2 block">Upload Gambar</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[var(--accent)] file:text-black file:font-semibold file:cursor-pointer"
          />
        </div>

        {preview && (
          <div className="w-32 aspect-[4/3] rounded-lg overflow-hidden bg-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-[var(--accent)] text-black font-semibold px-6 py-3 rounded-full hover:opacity-90 transition disabled:opacity-50"
          >
            {uploading ? "Mengupload gambar..." : saving ? "Menyimpan..." : editingId ? "Update" : "Tambah"}
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

      <div className="grid md:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <div className="aspect-[4/3] bg-white/10 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <p className="font-semibold text-sm mb-1">{project.title}</p>
              {project.description && (
                <p className="text-xs text-white/50 mb-3 line-clamp-2">{project.description}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="text-xs border border-white/20 px-3 py-1.5 rounded-full hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="text-xs border border-red-400/30 text-red-400 px-3 py-1.5 rounded-full hover:bg-red-400/10 transition"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <p className="text-white/50 mt-4">Belum ada project. Tambah dulu lewat form di atas.</p>
      )}
    </div>
  );
}