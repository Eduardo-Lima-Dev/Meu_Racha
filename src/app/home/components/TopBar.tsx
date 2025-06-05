import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, User } from "lucide-react";
import { getAuth, signOut } from "firebase/auth";
import { useAuthStatus } from "../hooks/useAuthStatus";

interface TopBarProps {
  title: string;
  isAdmin?: boolean;
}

export default function TopBar({ title }: TopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, currentUserName } = useAuthStatus();

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  const handleLogin = () => {
    window.location.href = "/login";
  };

  const isHomePage = title === "Ranking de Jogadores";

  return (
    <div className="relative">
      {/* Barra superior */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="ml-4 text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated && (
            <div className="flex items-center space-x-2">
              <User size={20} className="text-gray-600 dark:text-gray-300" />
              <span className="text-gray-700 dark:text-gray-300">
                {currentUserName}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Menu lateral */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center p-4 border-b border-gray-200 dark:border-gray-700">
          <Image
            src="/logo.png"
            alt="Logo"
            width={150}
            height={150}
            className="rounded-lg"
          />
        </div>

        {/* Links do menu */}
        <nav className="flex flex-col p-4 space-y-4 items-center text-center">
          {/* Links sempre visíveis */}
          <Link href="/" className="menu-item">
            Home
          </Link>
          <Link href="/graficos" className="menu-item">
            Estatísticas
          </Link>

          {/* Links apenas para usuários autenticados */}
          {isAuthenticated && (
            <>
              <Link href="/perfil" className="menu-item">
                Perfil
              </Link>
            </>
          )}

          {/* Links apenas para administradores */}
          {isAdmin && (
            <>
              <Link href="/votos" className="menu-item">
                Votação
              </Link>
              <Link href="/notas" className="menu-item">
                Notas Estatísticas
              </Link>
              <Link href="/times" className="menu-item">
                Times
              </Link>
              <Link href="/cadastro" className="menu-item">
                Cadastrar Admin
              </Link>
              <Link href="/dashboard" className="menu-item">
                Administração
              </Link>
            </>
          )}

          {/* Botão de Login/Logout */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="menu-item text-red-500 hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="menu-item text-blue-500 hover:bg-blue-600"
            >
              Login
            </button>
          )}
        </nav>
      </div>

      {/* Overlay para fechar o menu ao clicar fora */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </div>
  );
}
