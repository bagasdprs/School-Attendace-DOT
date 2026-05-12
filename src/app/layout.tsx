import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TrpcProvider } from "../providers/trpc-provider";
import { ConfigProvider } from "antd";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dotify HR - Sistem Monitoring & Absensi Siswa",
  description: "Challenge Mini Project Fullstack",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <TrpcProvider>
          <ConfigProvider theme={{ token: { colorPrimary: "#1677ff" } }}>{children}</ConfigProvider>
        </TrpcProvider>
      </body>
    </html>
  );
}
