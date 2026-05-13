"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layout, Menu } from "antd";
import { AppstoreOutlined, TeamOutlined, CheckSquareOutlined, BarChartOutlined, SettingOutlined, BankOutlined } from "@ant-design/icons";

const { Sider } = Layout;

interface AppSidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  userRole: string;
}

export default function AppSidebar({ collapsed, setCollapsed, userRole }: AppSidebarProps) {
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

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="light" width={260} className="border-r border-gray-200 bg-white shadow-xs">
      <div className="flex flex-col justify-center px-6 py-6 text-center">
        <h1 className={`font-extrabold text-dot-700 transition-all ${collapsed ? "text-xl" : "text-2xl"}`}>{collapsed ? "EA" : "EduAttend"}</h1>
        {!collapsed && <span className="mt-1 text-xs font-medium text-dot-500">{userRole === "ADMIN" ? "Administrator" : "Siswa Dashboard"}</span>}
      </div>

      <Menu mode="inline" selectedKeys={[pathname]} items={menuItems} className="mt-2 border-none px-3" />
    </Sider>
  );
}
