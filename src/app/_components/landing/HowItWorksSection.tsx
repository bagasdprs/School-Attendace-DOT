import React from "react";

const steps = [
  {
    step: "1",
    title: "Setup Kelas",
    desc: "Daftarkan kelas dan jadwal pelajaran dengan mudah melalui dashboard admin yang intuitif.",
  },
  {
    step: "2",
    title: "Siswa Check-In",
    desc: "Siswa mencatat kehadiran secara mandiri atau melalui guru dengan cepat dan real-time.",
  },
  {
    step: "3",
    title: "Evaluasi & Laporan",
    desc: "Pantau tren kehadiran berkala dan dapatkan rangkuman data otomatis secara instan.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="cara-kerja" className="bg-white py-24">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl">Cara Kerja Semudah 1-2-3</h2>
          <p className="mt-4 text-lg text-gray-600">Alur kerja intuitif yang didesain untuk meminimalkan waktu administrasi.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 relative">
          {/* Garis penghubung (hanya Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gray-100 -z-10 -translate-y-1/2"></div>

          {steps.map((item, idx) => (
            <div key={idx} className="relative rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-green-700 text-xl font-bold text-white shadow-md">{item.step}</div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
