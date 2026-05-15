"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Layout, Spin, App as AntdApp } from "antd";
import { trpc } from "@/utils/trpc";
import AppSidebar from "./_components/layout/AppSidebar";
import AppHeader from "./_components/layout/AppHeader";

const { Content } = Layout;

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // State for Desktop Sidebar
  const [collapsed, setCollapsed] = useState(false);

  // State for Mobile Drawer
  const [isMobile, setIsMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: user, isLoading, isError } = trpc.auth.me.useQuery(undefined, { retry: false });

  useEffect(() => {
    if (isError) router.push("/login");
  }, [isError, router]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dot-50">
        <Spin size="large" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <AntdApp>
      <Layout className="min-h-screen">
        <AppSidebar collapsed={collapsed} setCollapsed={setCollapsed} userRole={user.role} isMobile={isMobile} drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />

        <Layout className="transition-all duration-300">
          <AppHeader collapsed={collapsed} setCollapsed={setCollapsed} userName={user.name} isMobile={isMobile} setDrawerOpen={setDrawerOpen} />

          <Content className="m-4 rounded-xl bg-white p-4 shadow-sm md:m-6 md:p-6">{children}</Content>
        </Layout>
      </Layout>
    </AntdApp>
  );
}
