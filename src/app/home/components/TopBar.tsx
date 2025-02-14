import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, User } from "lucide-react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

interface TopBarProps {
  title: string;
}

export default function TopBar({ title }: TopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserName(user.displayName || "Usuário");
      } else {
        setCurrentUserName(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log("Usuário deslogado com sucesso!");
      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  const handleLogin = () => {
    window.location.href = "/login";
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full flex items-center justify-between bg-gray-200 text-gray-900 px-6 py-4 shadow-md rounded-b-lg z-50">
        <div className="h-10 w-10 overflow-hidden rounded-full">
          <Image
            src="/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
        <h1 className="text-lg font-semibold">{title}</h1>
        <button
          onClick={() => setMenuOpen(true)}
          className="text-gray-900 hover:text-gray-600"
        >
          <Menu size={28} />
        </button>
      </div>

      <div className="h-20"></div>

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-200 text-black transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 shadow-lg z-50`}
      >
        <div className="relative p-4 border-b border-gray-300 flex flex-col items-center">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
          <div className="flex flex-col items-center mt-8">
            <div className="h-10 w-10 bg-gray-700 rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            {currentUserName && (
              <span className="text-lg font-medium text-gray-900 mt-2">
                {currentUserName}
              </span>
            )}
          </div>
        </div>

        <nav className="flex flex-col p-4 space-y-4 items-center text-center">
          <Link href="/votos" className="menu-item">
            Votação
          </Link>
          <Link href="/graficos" className="menu-item">
            Estatísticas
          </Link>
          <Link href="/admin" className="menu-item">
            Administração
          </Link>
          <Link href="/perfil" className="menu-item">
            Perfil
          </Link>
          {currentUserName ? (
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
