import React from "react";

const reviews = [
  {
    name: "Ibu Sri",
    role: "Kepala Sekolah",
    quote: "Sistem ini benar-benar mengubah cara kami mengelola sekolah. Rekapitulasi otomatisnya sangat membantu!",
    avatar: "👩‍💼",
  },
  {
    name: "Pak Budi",
    role: "Guru Senior",
    quote: "Sangat mudah digunakan. Sekarang saya punya lebih banyak waktu untuk mengajar daripada rekap manual.",
    avatar: "👨‍🏫",
  },
];

export default function TestimonialSection() {
  return (
    <section id="testimoni" className="py-24">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="rounded-3xl bg-blue-50/50 px-6 py-16 md:px-12 lg:px-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Dipercaya oleh Pendidik</h2>
            <p className="mt-4 text-lg text-gray-600">Mendukung efisiensi administrasi di berbagai institusi.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {reviews.map((review, idx) => (
              <div key={idx} className="rounded-2xl bg-white p-8 shadow-sm">
                <div className="flex text-green-500 mb-4 text-lg">★★★★★</div>
                <p className="text-gray-700 italic mb-6">"{review.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-2xl">{review.avatar}</div>
                  <div>
                    <h4 className="font-bold text-gray-900">{review.name}</h4>
                    <p className="text-sm text-gray-500">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
