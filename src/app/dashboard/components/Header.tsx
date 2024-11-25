// src/components/Header.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogOut } from "lucide-react";

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="flex justify-between w-full max-w-md mb-4 p-4 bg-gray-800 text-white rounded-lg">
      <Link href="/" passHref>
        <Button variant="ghost" className="text-lg text-white">
          Home
        </Button>
      </Link>
      <Button variant="ghost" className="text-lg text-red-500 flex items-center" onClick={onLogout}>
        <LogOut className="mr-1" /> Logout
      </Button>
    </header>
  );
};

export default Header;