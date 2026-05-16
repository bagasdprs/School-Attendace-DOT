import React from "react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-green-50/50 to-white pt-20 pb-24">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Teks Kiri */}
          <div className="flex flex-col items-start gap-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-100/50 px-3 py-1 text-xs font-semibold text-green-700">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              Sistem Modern & Terintegrasi
            </div>

            <h1 className="text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl lg:text-6xl tracking-tight">
              Kelola Kehadiran Siswa Lebih <span className="text-green-700">Praktis & Real-Time</span>
            </h1>

            <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
              Solusi manajemen presensi otomatis untuk efisiensi sekolah modern. Hemat waktu rekapitulasi, tingkatkan akurasi data absensi, dan pantau kehadiran dalam satu dasbor terpadu.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/register" className="rounded-full bg-green-700 px-8 py-3.5 text-base font-semibold text-white shadow-md transition-all hover:bg-green-800 hover:shadow-lg">
                Mulai Sekarang
              </Link>
              <Link href="#fitur" className="rounded-full border-2 border-gray-200 bg-white px-8 py-3.5 text-base font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50">
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>

          {/* Gambar/Mockup Kanan */}
          <div className="relative mx-auto w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl lg:max-w-none">
            <div className="aspect-[4/3] w-full rounded-xl bg-green-50 flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-50 opacity-80"></div>
              <p className="z-10 font-medium text-green-800">[Area Gambar Mockup Dashboard]</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
