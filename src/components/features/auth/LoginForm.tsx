"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Form, Input, Button, message } from "antd";
import { trpc } from "@/utils/trpc";
import AuthSplitLayout from "@/components/layouts/AuthSplitLayout";
import { TLoginInput } from "@/server/auth/validations/auth.validation";

function LoginForm() {
  const router = useRouter();

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: () => {
      message.success("Berhasil masuk ke sistem!");
      router.push("/dashboard");
    },
    onError: (err) => {
      message.error(err.message || "Terjadi kesalahan saat login");
    },
  });

  const onFinish = (values: TLoginInput) => {
    loginMutation.mutate(values);
  };

  const VisualContent = (
    <>
      <div className="absolute inset-0 bg-gradient-to-t from-dot-900 via-dot-600/80 to-dot-400/40 mix-blend-multiply" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center p-12 text-center text-white">
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight drop-shadow-lg lg:text-5xl">
          Sistem Absensi <br /> Modern
        </h1>
        <p className="max-w-md text-lg text-dot-50 drop-shadow-md">Platform terpadu untuk mengelola dan memonitoring kehadiran siswa secara efisien dan presisi.</p>
      </div>
    </>
  );

  return (
    <AuthSplitLayout visualContent={VisualContent} reverse={false}>
      <div className="mb-10">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-dot-50 text-dot-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-8 w-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Selamat Datang</h2>
        <p className="mt-2 text-sm text-gray-500">Silakan masukkan email dan password Anda untuk masuk ke sistem.</p>
      </div>

      <Form layout="vertical" onFinish={onFinish} requiredMark={false} className="space-y-4">
        <Form.Item
          label={<span className="font-medium text-gray-700">Alamat Email</span>}
          name="email"
          rules={[
            { required: true, message: "Email wajib diisi" },
            { type: "email", message: "Format email tidak valid" },
          ]}
        >
          <Input size="large" placeholder="nama@sekolah.sch.id" className="rounded-lg" />
        </Form.Item>

        <Form.Item label={<span className="font-medium text-gray-700">Kata Sandi</span>} name="password" rules={[{ required: true, message: "Password wajib diisi" }]}>
          <Input.Password size="large" placeholder="Masukkan minimal 8 karakter" className="rounded-lg" />
        </Form.Item>

        <Button type="primary" htmlType="submit" size="large" block loading={loginMutation.isPending} className="mt-2 h-12 rounded-xl bg-dot-500 font-semibold text-white hover:bg-dot-600">
          Masuk ke Akun
        </Button>
      </Form>

      <p className="mt-8 text-center text-sm text-gray-500">
        Belum memiliki akun?{" "}
        <Link href="/register" className="font-semibold text-dot-500 transition-colors hover:text-dot-700 hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </AuthSplitLayout>
  );
}

export default LoginForm;
