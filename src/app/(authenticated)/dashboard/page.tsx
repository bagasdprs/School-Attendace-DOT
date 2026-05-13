"use client";

import React from "react";
import { Col, Row, Button, Table, Tag, Card, Typography, Spin } from "antd";
import { trpc } from "@/utils/trpc";
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, DownloadOutlined, MoreOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import WelcomeBanner from "@/app/(authenticated)/_components/WelcomeBanner";
import StatCard from "@/app/(authenticated)/_components/StatCard";

const { Title, Text } = Typography;

interface TDashboardSummary {
  totalStudents: number;
  totalAbsentOrExcused: number;
  totalLate: number;
}

function DashboardPage() {
  const today = dayjs().format("YYYY-MM-DD");
  const { data: user, isLoading: isLoadingUser } = trpc.auth.me.useQuery();
  const isStudent = user?.role === "STUDENT";
  const { data: summary, isLoading: isLoadingSummary } = trpc.student.getDashboardSummary.useQuery<TDashboardSummary>();
  const { data: attendanceResponse, isLoading: isLoadingAttendance } = trpc.attendance.getAttendances.useQuery({ date: today });

  const columns = [
    {
      title: "Nama Siswa",
      dataIndex: "studentName",
      key: "studentName",
      render: (text: string) => <span className="font-medium text-gray-700">{text}</span>,
    },
    { title: "Kelas", dataIndex: "className", key: "className" },
    {
      title: "Waktu Masuk",
      dataIndex: "checkInTime",
      render: (time: string | null) => (time ? dayjs(time).format("HH:mm") : "-"),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => {
        const colors: Record<string, string> = {
          PRESENT: "success",
          LATE: "warning",
          ABSENT: "error",
          EXCUSED: "purple",
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      },
    },
    { title: "Aksi", render: () => <Button type="text" icon={<MoreOutlined />} /> },
  ];

  if (isLoadingUser || isLoadingSummary || isLoadingAttendance) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WelcomeBanner name={user?.name} role={user?.role} />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            // Jika STUDENT, ubah judulnya jadi "Hadir Bulan Ini"
            title={isStudent ? "Hadir Bulan Ini" : "Total Siswa"}
            value={summary?.totalStudents ?? 0}
            icon={<CheckCircleOutlined />}
            valueColor="text-dot-500"
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            // Jika STUDENT, ubah judulnya jadi "Total Alpa / Izin"
            title={isStudent ? "Total Alpa / Izin" : "Siswa Alpa / Izin"}
            value={summary?.totalAbsentOrExcused ?? 0}
            icon={<CloseCircleOutlined />}
            valueColor="text-red-500"
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard title="Terlambat" value={summary?.totalLate ?? 0} icon={<ClockCircleOutlined />} valueColor="text-purple-500" />
        </Col>
      </Row>

      <Card title="Log Absensi Hari Ini" styles={{ body: { padding: 0 } }}>
        <Table dataSource={attendanceResponse?.data || []} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
}

export default DashboardPage;
