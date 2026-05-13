"use client";

import React, { useState } from "react";
import { Table, Typography, Card, Tag, DatePicker, Select, Input, Space, Button, Modal, Form, Input as AntInput, message, Row, Col } from "antd";
import { SearchOutlined, CalendarOutlined, EditOutlined, CheckCircleOutlined, FilterOutlined } from "@ant-design/icons";
import { trpc } from "@/utils/trpc";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TextArea } = AntInput;

function AttendanceDataPage() {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);

  // State Filter
  const [filterDate, setFilterDate] = useState(dayjs());
  const [filterClass, setFilterClass] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState("");

  // 1. Fetch Data
  const {
    data: attendances,
    isLoading,
    refetch,
  } = trpc.attendance.getAttendances.useQuery({
    date: filterDate.format("YYYY-MM-DD"),
    classId: filterClass,
    search: search,
  });

  const { data: classes } = trpc.class.getClasses.useQuery({});

  // 2. Mutation untuk Update Status/Notes (Manual by Admin)
  const updateMutation = trpc.attendance.updateAttendance.useMutation({
    onSuccess: () => {
      message.success("Data absensi berhasil diperbarui");
      setIsModalOpen(false);
      refetch();
    },
  });

  // 3. Columns Configuration
  const columns = [
    {
      title: "Siswa",
      key: "student",
      render: (_: any, record: any) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.student.name}</Text>
          <Text type="secondary">{record.student.nis}</Text>
        </Space>
      ),
    },
    {
      title: "Kelas",
      dataIndex: ["student", "class", "name"],
      key: "className",
    },
    {
      title: "Masuk",
      dataIndex: "checkInTime",
      key: "checkInTime",
      render: (time: any) => (time ? dayjs(time).format("HH:mm") : "-"),
    },
    {
      title: "Pulang",
      dataIndex: "checkOutTime",
      key: "checkOutTime",
      render: (time: any) => (time ? dayjs(time).format("HH:mm") : "-"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const colors = {
          PRESENT: "success",
          LATE: "warning",
          ABSENT: "error",
          EXCUSED: "purple",
        };
        return (
          <Tag color={colors[status as keyof typeof colors]} className="font-medium">
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Keterangan",
      dataIndex: "notes",
      key: "notes",
      ellipsis: true,
      render: (text: string) => text || "-",
    },
    {
      title: "Aksi",
      key: "action",
      render: (_: any, record: any) => (
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

      <Card bordered={false} className="shadow-sm ring-1 ring-gray-100">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
            <DatePicker className="w-full" size="large" value={filterDate} onChange={(date) => date && setFilterDate(date)} suffixIcon={<CalendarOutlined />} />
          </Col>
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
        </Row>
      </Card>

      <Card bordered={false} className="shadow-sm ring-1 ring-gray-100" styles={{ body: { padding: 0 } }}>
        <Table dataSource={attendances?.data} columns={columns} loading={isLoading} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>

      <Modal title="Update Kehadiran Siswa" open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => form.submit()} confirmLoading={updateMutation.isPending} okButtonProps={{ className: "bg-dot-500" }}>
        <Form form={form} layout="vertical" onFinish={(v) => updateMutation.mutate({ id: editingRecord.id, ...v })} className="mt-4">
          <Form.Item name="status" label="Status Kehadiran" rules={[{ required: true }]}>
            <Select size="large">
              <Select.Option value="PRESENT">PRESENT (Hadir)</Select.Option>
              <Select.Option value="LATE">LATE (Terlambat)</Select.Option>
              <Select.Option value="EXCUSED">EXCUSED (Izin/Sakit)</Select.Option>
              <Select.Option value="ABSENT">ABSENT (Alpa)</Select.Option>
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
