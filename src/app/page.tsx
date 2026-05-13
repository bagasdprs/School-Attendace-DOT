import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-dot-50">
      <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-dot-500 sm:text-[5rem]">Sistem Absensi</h1>

        <p className="max-w-2xl text-center text-xl text-gray-600">Platform modern terpadu untuk mengelola dan memonitoring kehadiran siswa secara efisien, aman, dan presisi.</p>

        <div className="mt-8 flex gap-4">
          <Link href="/login" className="rounded-lg bg-dot-500 px-8 py-3 text-lg font-semibold text-white shadow-md transition-colors hover:bg-dot-600">
            Masuk Sekarang
          </Link>
          <Link href="/register" className="rounded-lg border-2 border-dot-500 bg-white px-8 py-3 text-lg font-semibold text-dot-500 shadow-sm transition-colors hover:bg-dot-100">
            Daftar Akun
          </Link>
        </div>
      </div>
    </main>
  );
}
