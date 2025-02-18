"use client"

import Link from "next/link";
import Image from "next/image";

export default function AcessoNegado() {

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#1B2A4E] p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-center">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <Image
              src="/logo.png"
              alt="Logo"
              width={50}
              height={50}
              className="object-cover"
            />
          </div>
          <h1 className="text-3xl text-center md:text-4xl font-semibold text-[#FFFF] ml-4">
            Meu Racha
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="flex flex-col items-center text-center">
          <div className="w-full max-w-md">
            <Image
              src="/acesso-negado.jpg"
              alt="Acesso Negado"
              width={500}
              height={400}
              className="w-full h-auto"
              priority
            />
          </div>
          <div className="mt-8 space-y-2">
            <h1 className="text-2xl md:text-3xl font-semibold text-[#1B2A4E]">
              Sem Acesso!
            </h1>
            <p className="text-gray-600 max-w-md mx-auto">
              Esta página não está disponível no momento, você nao é um administrador do sistema.
            </p>
          </div>
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/admin"
            className="text-[#1B2A4E] hover:underline text-lg font-semibold"
          >
            Login Administrativo
          </Link>
        </div>
      </main>
    </div>
  );
}
