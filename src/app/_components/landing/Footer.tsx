import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white py-12">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <span className="text-xl font-extrabold text-gray-900 tracking-tight">Dotify EDU</span>
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} Dotify EDU. All rights reserved. Powered by Bagas Dwiprasandi.</p>
          </div>

          <div className="flex gap-6 text-sm font-medium text-gray-500">
            <Link href="#" className="hover:text-green-700 transition-colors">
              Privasi
            </Link>
            <Link href="#" className="hover:text-green-700 transition-colors">
              Syarat & Ketentuan
            </Link>
            <Link href="#" className="hover:text-green-700 transition-colors">
              Bantuan
            </Link>
            <Link href="#" className="hover:text-green-700 transition-colors">
              Kontak
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
