"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layout, Menu, Drawer } from "antd";
import { AppstoreOutlined, TeamOutlined, CheckSquareOutlined, BarChartOutlined, SettingOutlined, BankOutlined } from "@ant-design/icons";

const { Sider } = Layout;

interface AppSidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  userRole: string;
  isMobile: boolean;
  drawerOpen: boolean;
  setDrawerOpen: (value: boolean) => void;
}

export default function AppSidebar({ collapsed, setCollapsed, userRole, isMobile, drawerOpen, setDrawerOpen }: AppSidebarProps) {
  const pathname = usePathname();

  const baseMenu = [
    {
      key: "/dashboard",
      icon: <AppstoreOutlined className="text-lg" />,
      label: (
        <Link href="/dashboard" className="font-medium">
          Dashboard
        </Link>
      ),
    },
  ];

  const adminMenu =
    userRole === "ADMIN"
      ? [
          {
            key: "/dashboard/class",
            icon: <BankOutlined className="text-lg" />,
            label: (
              <Link href="/dashboard/class" className="font-medium">
                Data Kelas
              </Link>
            ),
          },
          {
            key: "/dashboard/student",
            icon: <TeamOutlined className="text-lg" />,
            label: (
              <Link href="/dashboard/student" className="font-medium">
                Data Siswa
              </Link>
            ),
          },
          {
            key: "/dashboard/attendance-setting",
            icon: <SettingOutlined className="text-lg" />,
            label: (
              <Link href="/dashboard/attendance-setting" className="font-medium">
                Setting Jam Absen
              </Link>
            ),
          },
        ]
      : [];

  const transactionMenu = [
    {
      key: "/dashboard/attendance",
      icon: <CheckSquareOutlined className="text-lg" />,
      label: (
        <Link href="/dashboard/attendance" className="font-medium">
          Data Absensi
        </Link>
      ),
    },
    {
      key: "/dashboard/recap",
      icon: <BarChartOutlined className="text-lg" />,
      label: (
        <Link href="/dashboard/recap" className="font-medium">
          Rekapitulasi
        </Link>
      ),
    },
  ];

  const menuItems = [...baseMenu, ...adminMenu, ...transactionMenu];

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white">
      <div className="flex flex-col justify-center px-6 py-6 text-center">
        <h1 className={`font-extrabold text-dot-700 transition-all ${!isMobile && collapsed ? "text-xl" : "text-2xl"}`}>{!isMobile && collapsed ? "DE" : "Dotify EDU"}</h1>
        {(!collapsed || isMobile) && <span className="mt-1 text-xs font-medium text-dot-500">{userRole === "ADMIN" ? "Administrator" : "Dashboard Siswa"}</span>}
      </div>

      <Menu
        mode="inline"
        selectedKeys={[pathname]}
        items={menuItems}
        className="mt-2 border-none px-3"
        onClick={() => {
          if (isMobile) setDrawerOpen(false);
        }}
      />
    </div>
  );

  return (
    <>
      {!isMobile && (
        <Sider trigger={null} collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="light" width={260} className="border-r border-gray-200 bg-white shadow-xs">
          {sidebarContent}
        </Sider>
      )}

      {isMobile && (
        <Drawer placement="left" closable={false} onClose={() => setDrawerOpen(false)} open={drawerOpen} size="default" styles={{ body: { padding: 0 } }}>
          {sidebarContent}
        </Drawer>
      )}
    </>
  );
}
