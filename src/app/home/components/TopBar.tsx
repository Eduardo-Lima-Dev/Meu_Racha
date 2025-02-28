import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, User } from "lucide-react";
import { getAuth, signOut } from "firebase/auth";
import Cookies from "js-cookie";
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
      Cookies.remove("role", { path: "/" });
      Cookies.remove("token", { path: "/" });
      Cookies.remove("userId", { path: "/" });
      Cookies.remove("isAuthenticated", { path: "/" });

      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  const handleLogin = () => {
    window.location.href = "/login";
  };

  const isHomePage = title === "Ranking de Jogadores";
  const adminLink = isHomePage ? "/dashboard" : "/";
  const adminText = isHomePage ? "Administração" : "Home";

  return (
    <>
      {/* Barra de topo */}
      <div className="fixed top-0 left-0 w-full flex items-center justify-between bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-2 shadow-md rounded-b-lg z-50">
        {/* Logo */}
        <div className="h-15 w-15 overflow-hidden rounded-10">
          <Image
            src="/logo-2.png"
            alt="Logo"
            width={60}
            height={60}
            className="object-cover"
          />
        </div>

        {/* Título */}
        <h1 className="text-lg font-semibold">{title}</h1>

        {/* Botão do Menu */}
        <button
          onClick={() => setMenuOpen(true)}
          className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-400"
        >
          <Menu size={38} />
        </button>
      </div>

      <div className="h-20"></div>

      {/* Sidebar do menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-200 dark:bg-gray-800 text-black dark:text-white transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 shadow-lg z-50`}
      >
        {/* Cabeçalho do menu */}
        <div className="relative p-4 border-b border-gray-300 dark:border-gray-600 flex flex-col items-center">
          {/* Botão de Fechar */}
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-4 right-4 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-500"
          >
            <X size={24} />
          </button>

          {/* Avatar do Usuário */}
          <div className="flex flex-col items-center mt-8">
            <div className="h-10 w-10 bg-gray-700 dark:bg-gray-500 rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            {currentUserName && (
              <span className="text-lg font-medium text-gray-900 dark:text-white mt-2">
                {currentUserName}
              </span>
            )}
          </div>
        </div>

        {/* Links do menu */}
        <nav className="flex flex-col p-4 space-y-4 items-center text-center">
          <Link href="/votos" className="menu-item">
            Votação
          </Link>
          <Link href="/graficos" className="menu-item">
            Estatísticas
          </Link>

          {isAdmin && (
            <Link href="/notas" className="menu-item">
              Notas Estatísticas
            </Link>
          )}

          {/* Botão de Home/Administração com lógica corrigida */}
          <Link href={isAdmin ? adminLink : "/"} className="menu-item">
            {isAdmin ? adminText : "Home"}
          </Link>

          <Link href="/perfil" className="menu-item">
            Perfil
          </Link>

          {isAdmin && (
            <Link href="/times" className="menu-item">
              Times
            </Link>
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

      <style jsx>{`
        .menu-item {
          padding: 10px;
          border-radius: 5px;
          transition: background 0.2s;
          font-size: 16px;
          width: 100%;
        }
        .menu-item:hover {
          background: rgba(214, 89, 89, 0.5);
        }
        .menu-item.text-red-500:hover {
          background: rgba(214, 89, 89, 0.5);
        }
        .menu-item.text-blue-500:hover {
          background: rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </>
  );
}
