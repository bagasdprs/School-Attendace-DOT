"use client";

import React, { useState } from "react";
import { Table, Typography, Card, Tag, DatePicker, Select, Input, Space, Button, Modal, Form, Input as AntInput, message, Row, Col } from "antd";
import { SearchOutlined, CalendarOutlined, EditOutlined, CheckCircleOutlined, FilterOutlined } from "@ant-design/icons";
import { trpc } from "@/utils/trpc";
import dayjs from "dayjs";
import AttendanceWidget from "./_components/AttendanceWidget";

const { Title, Text } = Typography;
const { TextArea } = AntInput;

interface IAttendanceRecord {
  id: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: string;
  notes: string | null;
  student?: { name: string; nis: string; class?: { name: string } };
  studentName?: string;
  studentNis?: string;
  nis?: string;
  className?: string;
}

function AttendanceDataPage() {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<IAttendanceRecord | null>(null);

  // State Filter
  const [filterDate, setFilterDate] = useState(dayjs());
  const [filterClass, setFilterClass] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState("");
  const isViewingToday = filterDate.isSame(dayjs(), "day");

  // 1. Fetch Data - Get user first
  const { data: user } = trpc.auth.me.useQuery();
  const isStudent = user?.role === "STUDENT";

  const {
    data: attendances,
    isLoading,
    refetch,
  } = trpc.attendance.getAttendances.useQuery({
    date: filterDate.format("YYYY-MM-DD"),
    classId: filterClass,
    search: search,
  });

  // Detect RECORD LIVE TIME
  const todayRecord = attendances?.data?.[0];

  // Check-in
  const checkInMutation = trpc.attendance.checkIn.useMutation({
    onSuccess: () => {
      message.success("Check-In berhasil, Semangat Belajar nya yaa! 🔥");
      refetch();
    },
    onError: (err) => message.error(err.message),
  });

  // Check-out
  const checkOutMutation = trpc.attendance.checkOut.useMutation({
    onSuccess: () => {
      message.success("Berhasil Check-Out. Selamat istirahat! 😴🏡");
      refetch();
    },
    onError: (err) => message.error(err.message),
  });

  const handleCheckIn = () => {
    checkInMutation.mutate({});
  };

  const handleCheckOut = () => {
    if (todayRecord) {
      checkOutMutation.mutate({ notes: "" });
    }
  };

  const { data: classes } = trpc.class.getClasses.useQuery(
    {},
    {
      enabled: user?.role === "ADMIN",
    },
  );

  // 2. Mutation untuk Update Status/Notes (Manual by Admin)
  const updateMutation = trpc.attendance.updateAttendance.useMutation({
    onSuccess: () => {
      message.success("Data absensi berhasil diperbarui");
      setIsModalOpen(false);
      refetch();
    },
  });

  const allColumns = [
    {
      title: "Siswa",
      key: "student",
      hidden: isStudent,
      render: (_: unknown, record: IAttendanceRecord) => (
        <Space orientation="vertical" size={0}>
          <Text strong>{record.student?.name || record.studentName || "Tanpa Nama"}</Text>
          <Text type="secondary">{record.student?.nis || record.studentNis || "-"}</Text>
        </Space>
      ),
    },
    {
      title: "Kelas",
      key: "className",
      hidden: false,
      render: (_: unknown, record: IAttendanceRecord) => {
        const kelas = record.student?.class?.name || record.className;
        return <Text>{kelas || "-"}</Text>;
      },
    },
    {
      title: "Masuk",
      dataIndex: "checkInTime",
      key: "checkInTime",
      hidden: false,
      render: (time: any) => (time ? dayjs(time).format("HH:mm") : "-"),
    },
    {
      title: "Pulang",
      dataIndex: "checkOutTime",
      key: "checkOutTime",
      hidden: false,
      render: (time: any) => (time ? dayjs(time).format("HH:mm") : "-"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      hidden: false,
      render: (status: string) => {
        const statusMap: Record<string, { color: string; text: string }> = {
          PRESENT: { color: "success", text: "HADIR" },
          LATE: { color: "warning", text: "TERLAMBAT" },
          EXCUSED: { color: "purple", text: "IZIN/SAKIT" },
          ABSENT: { color: "error", text: "ALPA" },
        };

        const mapped = statusMap[status] || { color: "default", text: status };

        return (
          <Tag color={mapped.color} className="font-medium">
            {mapped.text}
          </Tag>
        );
      },
    },
    {
      title: "Keterangan",
      dataIndex: "notes",
      key: "notes",
      ellipsis: true,
      hidden: false,
      render: (text: string) => text || "-",
    },
    {
      title: "Aksi",
      key: "action",
      hidden: isStudent,
      render: (_: unknown, record: IAttendanceRecord) => (
        <Button
          type="text"
          icon={<EditOutlined className="text-dot-500" />}
          onClick={() => {
            setEditingRecord(record);
            form.setFieldsValue(record);
            setIsModalOpen(true);
          }}
        />
      ),
    },
  ];

  // 3. Eksekusi filter kolom (Hanya render kolom yang hidden-nya false/undefined)
  const columns = allColumns.filter((col) => !col.hidden);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Title level={2} className="mb-0!">
            <CheckCircleOutlined className="mr-3 text-dot-500" />
            Data Absensi Siswa
          </Title>
          <Text className="text-gray-500">Monitoring kehadiran siswa secara real-time harian.</Text>
        </div>
      </div>

      {/* {isStudent && <AttendanceWidget todayRecord={todayRecord} onCheckIn={handleCheckIn} onCheckOut={handleCheckOut} isLoading={checkInMutation.isPending || checkOutMutation.isPending} />} */}
      {isStudent && isViewingToday && <AttendanceWidget todayRecord={todayRecord} onCheckIn={handleCheckIn} onCheckOut={handleCheckOut} isLoading={checkInMutation.isPending || checkOutMutation.isPending} />}

      <Card bordered={false} className="shadow-sm ring-1 ring-gray-100">
        <Row gutter={[16, 16]}>
          {/* 1. Filter Tanggal: Semua Role (Admin & Siswa) Boleh Lihat */}
          <Col xs={24} md={isStudent ? 24 : 6}>
            {/* Lebar dibuat full (24) jika dia siswa, agar UI-nya tidak bolong di kanan */}
            <DatePicker className="w-full" size="large" value={filterDate} onChange={(date) => date && setFilterDate(date)} suffixIcon={<CalendarOutlined />} />
          </Col>

          {/* 2. Filter Kelas & Pencarian: HANYA ADMIN YANG BOLEH LIHAT */}
          {!isStudent && (
            <>
              <Col xs={24} md={6}>
                <Select className="w-full" size="large" placeholder="Filter Kelas" allowClear onChange={setFilterClass} suffixIcon={<FilterOutlined />}>
                  {classes?.data?.map((c: any) => (
                    <Select.Option key={c.id} value={c.id}>
                      {c.name}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} md={12}>
                <Input placeholder="Cari nama siswa atau NIS..." prefix={<SearchOutlined className="text-gray-400" />} size="large" onChange={(e) => setSearch(e.target.value)} />
              </Col>
            </>
          )}
        </Row>
      </Card>

      <Card bordered={false} className="shadow-sm ring-1 ring-gray-100" styles={{ body: { padding: 0 } }}>
        <Table dataSource={attendances?.data} columns={columns} loading={isLoading} rowKey="id" pagination={{ pageSize: 10 }} scroll={{ x: "max-content" }} />
      </Card>

      <Modal title="Update Kehadiran Siswa" open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => form.submit()} confirmLoading={updateMutation.isPending} okButtonProps={{ className: "bg-dot-500" }}>
        <Form form={form} layout="vertical" onFinish={(v) => editingRecord && updateMutation.mutate({ id: editingRecord.id, ...v })} className="mt-4">
          <Form.Item name="status" label="Status Kehadiran" rules={[{ required: true }]}>
            <Select size="large">
              <Select.Option value="PRESENT">HADIR</Select.Option>
              <Select.Option value="LATE">TERLAMBAT</Select.Option>
              <Select.Option value="EXCUSED">IZIN/SAKIT</Select.Option>
              <Select.Option value="ABSENT">ALPA/TIDAK HADIR</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="notes" label="Catatan / Alasan">
            <TextArea rows={4} placeholder="Contoh: Sakit dengan surat dokter atau Izin lomba" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AttendanceDataPage;
