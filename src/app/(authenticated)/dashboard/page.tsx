"use client";

import React from "react";
import { Col, Row, Table, Tag, Card, Spin } from "antd";
import { trpc } from "@/utils/trpc";
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import WelcomeBanner from "@/app/(authenticated)/_components/WelcomeBanner";
import StatCard from "@/app/(authenticated)/_components/StatCard";

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

  const allColumns = [
    {
      title: "Nama Siswa",
      dataIndex: "studentName",
      key: "studentName",
      hidden: false,
      render: (text: string) => <span className="font-medium text-gray-700">{text}</span>,
    },
    { title: "Kelas", dataIndex: "className", key: "className", hidden: false },
    {
      title: "Waktu Masuk",
      dataIndex: "checkInTime",
      hidden: false,
      render: (time: string | null) => (time ? dayjs(time).format("HH:mm") : "-"),
    },
    {
      title: "Status",
      dataIndex: "status",
      hidden: false,
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
    // { title: "Aksi", key: "action", hidden: isStudent, render: () => <Button type="text" icon={<MoreOutlined />} /> },
  ];

  const columns = allColumns.filter((col: { hidden?: boolean }) => !col.hidden);

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
          <StatCard title={isStudent ? "Hadir Bulan Ini" : "Total Siswa"} value={summary?.totalStudents ?? 0} icon={<CheckCircleOutlined />} valueColor="text-dot-500" />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard title={isStudent ? "Total Alpa / Izin" : "Siswa Alpa / Izin"} value={summary?.totalAbsentOrExcused ?? 0} icon={<CloseCircleOutlined />} valueColor="text-red-500" />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard title="Terlambat" value={summary?.totalLate ?? 0} icon={<ClockCircleOutlined />} valueColor="text-purple-500" />
        </Col>
      </Row>

      <Card title="Log Absensi Hari Ini" styles={{ body: { padding: 0 } }}>
        <Table dataSource={attendanceResponse?.data || []} columns={columns} rowKey="id" scroll={{ x: "max-content" }} />
      </Card>
    </div>
  );
}

export default DashboardPage;
