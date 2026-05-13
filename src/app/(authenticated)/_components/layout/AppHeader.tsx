import React from "react";
import { Layout, Dropdown, Avatar, Button } from "antd";
import { LogoutOutlined, UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { trpc } from "@/utils/trpc";

const { Header } = Layout;

interface AppHeaderProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  userName: string;
}

export default function AppHeader({ collapsed, setCollapsed, userName }: AppHeaderProps) {
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      window.location.href = "/login";
    },
  });

  const userMenuItems = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Keluar Akun",
      danger: true,
      onClick: () => logoutMutation.mutate(),
    },
  ];

  return (
    <Header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-xs">
      <div className="flex items-center gap-4">
        <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)} className="text-lg text-gray-600 hover:text-dot-500" />
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-600">Halo, {userName}</span>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={["click"]}>
          <div className="flex cursor-pointer items-center gap-2 rounded-full p-1 transition-all hover:bg-gray-50">
            <Avatar className="bg-dot-500" icon={<UserOutlined />} />
          </div>
        </Dropdown>
      </div>
    </Header>
  );
}
