import React from "react";
import { Layout, Dropdown, Avatar, Button } from "antd";
import { LogoutOutlined, UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { trpc } from "@/utils/trpc";

const { Header } = Layout;

interface AppHeaderProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  userName: string;
  isMobile: boolean;
  setDrawerOpen: (value: boolean) => void;
}

export default function AppHeader({ collapsed, setCollapsed, userName, isMobile, setDrawerOpen }: AppHeaderProps) {
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

  // Logic klik Hamburger
  const handleMenuClick = () => {
    if (isMobile) {
      setDrawerOpen(true);
    } else {
      setCollapsed(!collapsed);
    }
  };

  return (
    <Header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-xs md:px-6">
      <div className="flex items-center gap-4">
        <Button type="text" icon={isMobile || collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={handleMenuClick} className="text-lg text-gray-600 hover:text-dot-500" />
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-600 hidden sm:block">Halo, {userName}</span>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={["click"]}>
          <div className="flex cursor-pointer items-center gap-2 rounded-full p-1 transition-all hover:bg-gray-50">
            <Avatar className="bg-dot-500" icon={<UserOutlined />} />
          </div>
        </Dropdown>
      </div>
    </Header>
  );
}
