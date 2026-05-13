"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Form, Input, Button, message } from "antd";
import { trpc } from "@/utils/trpc";
import AuthSplitLayout from "@/components/layouts/AuthSplitLayout";
import { TRegisterInput } from "@/server/auth/validations/auth.validation";

function RegisterForm() {
  const router = useRouter();

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: () => {
      message.success("Pendaftaran berhasil! Silakan login.");
      router.push("/login");
    },
    onError: (err) => {
      message.error(err.message || "Terjadi kesalahan saat mendaftar");
    },
  });

  const onFinish = (values: TRegisterInput) => {
    registerMutation.mutate(values);
  };

  const VisualContent = (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-dot-400/40 via-dot-600/80 to-dot-900 mix-blend-multiply" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center p-12 text-center text-white">
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight drop-shadow-lg lg:text-5xl">
          Bergabung <br /> Bersama Kami
        </h1>
        <p className="max-w-md text-lg text-dot-50 drop-shadow-md">Daftarkan akun administrator untuk mulai mengatur dan memonitor data kehadiran di instansi Anda.</p>
      </div>
    </>
  );

  return (
    <AuthSplitLayout visualContent={VisualContent} reverse={true}>
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Buat Akun Baru</h2>
        <p className="mt-2 text-sm text-gray-500">Lengkapi data di bawah ini untuk mendaftarkan akun Administrator.</p>
      </div>

      <Form layout="vertical" onFinish={onFinish} requiredMark={false} className="space-y-4">
        <Form.Item label={<span className="font-medium text-gray-700">Nama Lengkap</span>} name="name" rules={[{ required: true, message: "Nama wajib diisi" }]}>
          <Input size="large" placeholder="Bagas Dwiprasandi" className="rounded-lg" />
        </Form.Item>

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

        <Form.Item label={<span className="font-medium text-gray-700">Kata Sandi</span>} name="password" rules={[{ required: true, min: 8, message: "Password minimal 8 karakter" }]}>
          <Input.Password size="large" placeholder="Buat kata sandi yang kuat" className="rounded-lg" />
        </Form.Item>

        <Button type="primary" htmlType="submit" size="large" block loading={registerMutation.isPending} className="mt-2 h-12 rounded-xl bg-dot-500 font-semibold text-white hover:bg-dot-600">
          Daftar Sekarang
        </Button>
      </Form>

      <p className="mt-8 text-center text-sm text-gray-500">
        Sudah memiliki akun?{" "}
        <Link href="/login" className="font-semibold text-dot-500 transition-colors hover:text-dot-700 hover:underline">
          Masuk di sini
        </Link>
      </p>
    </AuthSplitLayout>
  );
}

export default RegisterForm;
