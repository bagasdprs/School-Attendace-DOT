"use client";

import React, { useState } from "react";
import { Table, Typography, Card, Row, Col, DatePicker, Select, Button, Space, Progress, Input } from "antd";
import { FileSearchOutlined, DownloadOutlined, InfoCircleOutlined, BarChartOutlined, TeamOutlined, SearchOutlined } from "@ant-design/icons";
import { trpc } from "@/utils/trpc";
import dayjs from "dayjs";
import StatCard from "@/app/(authenticated)/_components/StatCard";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

function RecapPage() {
  const { data: user } = trpc.auth.me.useQuery();
  const isStudent = user?.role === "STUDENT";
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([dayjs().startOf("month"), dayjs().endOf("month")]);
  const [classId, setClassId] = useState<string | undefined>(undefined);
  const [searchName, setSearchName] = useState("");

  const { data: classes } = trpc.class.getClasses.useQuery(
    {},
    {
      enabled: user?.role === "ADMIN",
    },
  );

  const { data: recapData, isLoading } = trpc.recap.getClassRecap.useQuery({
    startDate: dateRange[0].format("YYYY-MM-DD"),
    endDate: dateRange[1].format("YYYY-MM-DD"),
    classId: classId as any,
    search: searchName,
  });

  const stats = recapData;

  const handleExport = () => {
    window.open(`/api/export/recap?classId=${classId || ""}&start=${dateRange[0].format("YYYY-MM-DD")}&end=${dateRange[1].format("YYYY-MM-DD")}&search=${searchName}`, "_blank");
  };

  const columns = [
    {
      title: "Nama Siswa",
      dataIndex: "studentName",
      key: "studentName",
      render: (text: string) => (
        <Text strong className="text-gray-700">
          {text}
        </Text>
      ),
    },
    { title: "Hadir", dataIndex: "present", key: "present", align: "center" as const },
    {
      title: "Terlambat",
      dataIndex: "late",
      key: "late",
      align: "center" as const,
      render: (val: number) => <Text type="warning">{val}</Text>,
    },
    {
      title: "Izin/Sakit",
      dataIndex: "excused",
      key: "excused",
      align: "center" as const,
      render: (val: number) => <Text type="secondary">{val}</Text>,
    },
    {
      title: "Alpa",
      dataIndex: "absent",
      key: "absent",
      align: "center" as const,
      render: (val: number) => <Text type="danger">{val}</Text>,
    },
    {
      title: "Persentase Kehadiran",
      dataIndex: "attendancePercentage",
      key: "attendancePercentage",
      width: 250,
      render: (percentStr: string) => {
        const percent = parseFloat(percentStr) || 0;
        return (
          <Space size="middle">
            <Progress percent={percent} size="small" strokeColor={percent > 80 ? "#1D9B5E" : percent > 50 ? "#faad14" : "#ff4d4f"} format={(p) => `${p}%`} />
          </Space>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Title level={2} className="mb-0!">
            <BarChartOutlined className="mr-3 text-dot-500" />
            Rekapitulasi Absensi
          </Title>
          <Text className="text-gray-500">Analisis data kehadiran siswa berdasarkan periode waktu tertentu.</Text>
        </div>
        <Button icon={<DownloadOutlined />} size="large" onClick={handleExport} className="border-dot-500 text-dot-500 hover:text-dot-600">
          Export CSV
        </Button>
      </div>

      <Card bordered={false} className="shadow-sm ring-1 ring-gray-100">
        <Row gutter={[16, 16]} align="bottom">
          <Col xs={24} md={8}>
            <Text className="mb-2 block font-medium text-gray-600">Rentang Waktu:</Text>
            <RangePicker className="w-full" size="large" value={dateRange} onChange={(dates) => dates && setDateRange([dates[0]!, dates[1]!])} />
          </Col>

          {!isStudent && (
            <>
              <Col xs={24} md={6}>
                <Text className="mb-2 block font-medium text-gray-600">Filter Kelas:</Text>
                <Select className="w-full" size="large" placeholder="Semua Kelas" allowClear onChange={setClassId}>
                  {classes?.data?.map((c) => (
                    <Select.Option key={c.id} value={c.id}>
                      {c.name}
                    </Select.Option>
                  ))}
                </Select>
              </Col>

              <Col xs={24} md={6}>
                <Text className="mb-2 block font-medium text-gray-600">Cari Siswa:</Text>
                <Input placeholder="Ketik nama..." prefix={<SearchOutlined className="text-gray-400" />} size="large" allowClear onChange={(e) => setSearchName(e.target.value)} />
              </Col>
            </>
          )}

          <Col xs={24} md={isStudent ? 16 : 4}>
            <Button type="primary" block size="large" icon={<FileSearchOutlined />} className="bg-dot-500">
              Terapkan
            </Button>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <StatCard title="Rata-rata Kehadiran" value={stats?.classSummary?.attendancePercentage || "0%"} icon={<TeamOutlined />} valueColor="text-dot-500" />
        </Col>
        <Col xs={24} sm={8}>
          <StatCard title="Total Alpa" value={stats?.classSummary?.absent || 0} icon={<InfoCircleOutlined />} valueColor="text-red-500" />
        </Col>
        <Col xs={24} sm={8}>
          <StatCard title="Total Terlambat" value={stats?.classSummary?.late || 0} icon={<BarChartOutlined />} valueColor="text-orange-500" />
        </Col>
      </Row>

      <Card bordered={false} className="shadow-sm ring-1 ring-gray-100" title={<span className="text-lg font-semibold">Laporan Per Siswa</span>} styles={{ body: { padding: 0 } }}>
        <Table dataSource={stats?.students} columns={columns} loading={isLoading} rowKey="studentId" scroll={{ x: "max-content" }} />
      </Card>
    </div>
  );
}

export default RecapPage;
