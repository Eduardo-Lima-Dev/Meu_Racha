"use client";

import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaLock, FaArrowLeft } from "react-icons/fa";
import ProfileModal from "./modal/ProfileModal";
import { useRouter } from "next/navigation";
import { auth } from "../../config/firebaseConfig"; // Importe a configuração do Firebase
import { onAuthStateChanged, User } from "firebase/auth";

export default function Profile() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe(); 
  }, [router]);

  const openModal = (type: string) => {
    setModalType(type);
    setModalOpen(true);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg font-semibold">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 text-gray-700 hover:text-gray-900 flex items-center gap-2"
      >
        <FaArrowLeft className="text-xl" />
        <span className="text-lg">Voltar</span>
      </button>

      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm text-center">
        <h2 className="text-xl font-semibold mb-4">Perfil</h2>

        <button onClick={() => openModal("User")} className="flex flex-col items-center w-full p-3 hover:bg-gray-200 rounded-lg">
          <FaUser className="text-2xl" />
          <span className="text-lg mt-2">{user.displayName || "Nome não definido"}</span>
        </button>
        
        <button onClick={() => openModal("Email")} className="flex flex-col items-center w-full p-3 hover:bg-gray-200 rounded-lg">
          <FaEnvelope className="text-2xl" />
          <span className="text-lg mt-2">{user.email}</span>
        </button>
        
        <button onClick={() => openModal("Senha")} className="flex flex-col items-center w-full p-3 hover:bg-gray-200 rounded-lg">
          <FaLock className="text-2xl" />
          <span className="text-lg mt-2">********</span>
        </button>
      </div>

      {modalOpen && <ProfileModal type={modalType} onClose={() => setModalOpen(false)} />}
    </div>
  );
}
