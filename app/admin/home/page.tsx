"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import AdminNav from "@/components/admin/AdminNav";

export default function AdminHome() {
  const { user, checking } = useAdminAuth();
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonLink, setButtonLink] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const snap = await getDoc(doc(db, "content", "hero"));
      if (snap.exists()) {
        const data = snap.data();
        setHeading(data.heading || "");
        setDescription(data.description || "");
        setButtonText(data.buttonText || "");
        setButtonLink(data.buttonLink || "");
        setBackgroundImage(data.backgroundImage || "");
        setPreview(data.backgroundImage || "");
      } else {
        setHeading("Kami Membangun\nBrand yang Diingat.");
        setDescription("Studio kreatif untuk branding dan desain digital yang membantu bisnis kamu tumbuh.");
        setButtonText("Mulai Proyek");
        setButtonLink("#contact");
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      let imageUrl = backgroundImage;
      if (file) {
        setUploading(true);
        imageUrl = await uploadToCloudinary(file);
        setUploading(false);
      }
      await setDoc(doc(db, "content", "hero"), {
        heading,
        description,
        buttonText,
        buttonLink,
        backgroundImage: imageUrl,
      });
      setBackgroundImage(imageUrl);
      setFile(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan. Coba lagi.");
    } finally {
      setSaving(false);
      setUploading(false);
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
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Kelola Halaman Home</h1>

      <div className="flex flex-col gap-4">
        <div>
          <label className="text-xs text-white/50 mb-2 block">
            Judul (Enter untuk ganti baris)
          </label>
          <textarea
            rows={2}
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-[var(--accent)]"
          />
        </div>

        <div>
          <label className="text-xs text-white/50 mb-2 block">Deskripsi</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-[var(--accent)]"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs text-white/50 mb-2 block">Teks Tombol</label>
            <input
              type="text"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-[var(--accent)]"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-white/50 mb-2 block">Link Tombol</label>
            <input
              type="text"
              value={buttonLink}
              onChange={(e) => setButtonLink(e.target.value)}
              placeholder="#contact"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-[var(--accent)]"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-white/50 mb-2 block">Background Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[var(--accent)] file:text-black file:font-semibold file:cursor-pointer"
          />
          {preview && (
            <div className="mt-3 w-full aspect-video rounded-lg overflow-hidden bg-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-4 bg-[var(--accent)] text-black font-semibold px-6 py-3 rounded-full hover:opacity-90 transition disabled:opacity-50"
        >
          {uploading ? "Mengupload gambar..." : saving ? "Menyimpan..." : saved ? "Tersimpan!" : "Simpan Perubahan"}
        </button>
      </div>
    </div>
  );
}
