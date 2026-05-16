import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold text-green-700 tracking-tight">
          Dotify EDU
        </Link>

        {/* Links (Desktop) */}
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
          <Link href="#fitur" className="hover:text-green-600 transition-colors">
            Fitur
          </Link>
          <Link href="#cara-kerja" className="hover:text-green-600 transition-colors">
            Cara Kerja
          </Link>
          <Link href="#testimoni" className="hover:text-green-600 transition-colors">
            Testimoni
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4 text-sm font-semibold">
          <Link href="/login" className="text-gray-600 hover:text-green-600 transition-colors">
            Masuk / Login
          </Link>
          <Link href="/register" className="rounded-full bg-green-700 px-5 py-2 text-white shadow-sm transition-all hover:bg-green-800">
            Daftar Sekarang
          </Link>
        </div>
      </div>
    </nav>
  );
}
