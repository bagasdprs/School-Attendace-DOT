"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Layout, Spin } from "antd";
import { trpc } from "@/utils/trpc";
import AppSidebar from "./_components/layout/AppSidebar";
import AppHeader from "./_components/layout/AppHeader";

const { Content } = Layout;

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const {
    data: user,
    isLoading,
    isError,
  } = trpc.auth.me.useQuery(undefined, {
    retry: false,
  });

  useEffect(() => {
    if (isError) {
      router.push("/login");
    }
  }, [isError, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dot-50">
        <Spin size="large" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <Layout className="min-h-screen">
      <AppSidebar collapsed={collapsed} setCollapsed={setCollapsed} userRole={user.role} />

      <Layout className="transition-all duration-300">
        <AppHeader collapsed={collapsed} setCollapsed={setCollapsed} userName={user.name} />

        <Content className="m-6 rounded-xl bg-white p-6 shadow-sm">{children}</Content>
      </Layout>
    </Layout>
  );
}
