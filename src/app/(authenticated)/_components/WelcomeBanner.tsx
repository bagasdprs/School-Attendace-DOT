import React from "react";

interface WelcomeBannerProps {
  name?: string;
  role?: string;
}

function WelcomeBanner({ name, role }: WelcomeBannerProps) {
  return (
    <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-r from-dot-900 to-dot-500 p-8 text-white shadow-md md:flex-row md:items-center">
      <div>
        <h2 className="mb-2 text-3xl font-bold">Selamat Datang kembali, {name}! 👋</h2>
        <p className="text-dot-50">Berikut adalah ringkasan absensi harian sekolah untuk hari ini.</p>
      </div>
      <div className="mt-4 md:mt-0">
        <span className="rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm">Role: {role}</span>
      </div>
    </div>
  );
}

export default WelcomeBanner;
