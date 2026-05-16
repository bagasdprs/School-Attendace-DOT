import React from "react";

const features = [
  {
    title: "Real-time Attendance",
    desc: "Pelacakan kehadiran instan tanpa delay. Pantau langsung dari dashboard.",
    icon: "🕒",
  },
  {
    title: "Rekapitulasi Otomatis",
    desc: "Sistem menghitung persentase kehadiran, alpa, dan keterlambatan secara otomatis tanpa rekap manual.",
    icon: "📑",
  },
  {
    title: "Role-Based Access",
    desc: "Akses khusus dan aman yang terpisah untuk Admin, dan Siswa.",
    icon: "🛡️",
  },
  {
    title: "Export to Excel",
    desc: "Laporan kehadiran siap pakai yang rapi dalam hitungan detik.",
    icon: "📊",
  },
];

export default function FeaturesSection() {
  return (
    <section id="fitur" className="bg-gray-50 py-24">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl">Fitur Unggulan</h2>
          <p className="mt-4 text-lg text-gray-600">Dirancang khusus untuk memudahkan administrasi sekolah tanpa mengorbankan keamanan data.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => (
            <div key={idx} className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-2xl">{feature.icon}</div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
