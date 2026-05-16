import React from "react";
import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="py-12 pb-24">
      <div className="container mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-green-800 px-6 py-16 text-center shadow-2xl sm:px-16 sm:py-20">
          {/* Efek dekorasi background */}
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-green-700 blur-3xl opacity-50"></div>
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-green-900 blur-3xl opacity-50"></div>

          <h2 className="relative z-10 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Siap mengubah cara sekolahmu mencatat kehadiran?</h2>
          <p className="relative z-10 mx-auto mt-6 max-w-2xl text-lg text-green-100">Bergabunglah dengan ratusan sekolah lain yang telah meningkatkan efisiensi administrasi mereka.</p>
          <div className="relative z-10 mt-10 flex justify-center">
            <Link href="/register" className="rounded-full bg-white px-10 py-4 text-base font-bold text-green-800 shadow-lg transition-all hover:bg-gray-50 hover:scale-105">
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
