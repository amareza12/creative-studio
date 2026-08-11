"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAdminAuth } from "@/lib/useAdminAuth";
import AdminNav from "@/components/admin/AdminNav";

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Timestamp | null;
};

export default function AdminDashboard() {
  const { user, checking } = useAdminAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchMessages = async () => {
      setLoadingMessages(true);
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(data);
      setLoadingMessages(false);
    };
    fetchMessages();
  }, [user]);

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
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Pesan Masuk</h1>

      {loadingMessages ? (
        <p className="text-white/50">Memuat data...</p>
      ) : messages.length === 0 ? (
        <p className="text-white/50">Belum ada pesan masuk.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">{msg.name}</p>
                  <p className="text-white/50 text-sm">{msg.email}</p>
                </div>
                <p className="text-white/30 text-xs">
                  {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleString("id-ID") : "-"}
                </p>
              </div>
              <p className="text-white/80 text-sm mt-2">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
