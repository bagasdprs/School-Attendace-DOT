"use client";

import React, { useState } from "react";
import { Table, Button, Typography, Card, Tag, Modal, Form, message, Popconfirm, TimePicker, Input, InputNumber, Space, Row, Col } from "antd";
import { PlusOutlined, ClockCircleOutlined, CheckCircleOutlined, EditOutlined, DeleteOutlined, SettingOutlined } from "@ant-design/icons";
import { trpc } from "@/utils/trpc";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const { Title, Text } = Typography;

function AttendanceSettingPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);

  // 1. Fetch Data
  const { data: settings, isLoading, refetch } = trpc.attendanceSetting.getSettings.useQuery({});
  const { data: user, isLoading: isUserLoading } = trpc.auth.me.useQuery();

  useEffect(() => {
    if (!isUserLoading && user?.role === "STUDENT") {
      router.replace("/dashboard");
    }
  }, [user, isUserLoading, router]);

  // 2. Mutations
  const createMutation = trpc.attendanceSetting.createSetting.useMutation({
    onSuccess: () => {
      message.success("Setting jam absen berhasil dibuat");
      handleCancel();
      refetch();
    },
    onError: (err) => message.error(err.message),
  });

  const activateMutation = trpc.attendanceSetting.activateSetting.useMutation({
    onSuccess: () => {
      message.success("Jadwal absen berhasil diaktifkan");
      refetch();
    },
  });

  const deleteMutation = trpc.attendanceSetting.deleteSetting.useMutation({
    onSuccess: () => {
      message.success("Setting berhasil dihapus");
      refetch();
    },
  });

  // 3. Handlers
  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingId(null);
    form.resetFields();
  };

  const onFinish = (values: any) => {
    const payload = {
      name: values.name,
      checkInTime: dayjs(values.checkInTime).format("HH:mm"),
      checkOutTime: dayjs(values.checkOutTime).format("HH:mm"),
      lateThreshold: values.lateThreshold,
    };

    if (editingId) {
      // updateMutation.mutate({ id: editingId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const columns = [
    {
      title: "Nama Setting",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          {record.isActive && (
            <Tag color="success" icon={<CheckCircleOutlined />}>
              Aktif Digunakan
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Sesi Masuk",
      dataIndex: "checkInTime",
      key: "checkIn",
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Sesi Pulang",
      dataIndex: "checkOutTime",
      key: "checkOutTime",
      render: (text: string) => <Tag color="orange">{text}</Tag>,
    },
    {
      title: "Toleransi (Menit)",
      dataIndex: "lateThreshold",
      key: "lateThreshold",
      render: (val: number) => (
        <Text strong className="text-red-500">
          {val} Menit
        </Text>
      ),
    },
    {
      title: "Aksi",
      key: "action",
      render: (_: any, record: any) => (
        <Space>
          {!record.isActive && (
            <Button type="primary" size="small" className="bg-dot-500" onClick={() => activateMutation.mutate({ id: record.id })}>
              Aktifkan
            </Button>
          )}
          <Button type="text" icon={<EditOutlined />} />
          <Popconfirm title="Hapus setting ini?" onConfirm={() => deleteMutation.mutate({ id: record.id })}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Title level={2} className="mb-0!">
            <SettingOutlined className="mr-3 text-dot-500" />
            Setting Jam Absen
          </Title>
          <Text className="text-gray-500">Atur parameter waktu kehadiran, pulang, dan batas keterlambatan.</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" className="bg-dot-500" onClick={() => setIsModalOpen(true)}>
          Tambah Setting
        </Button>
      </div>

      <Card bordered={false} className="shadow-sm ring-1 ring-gray-100" styles={{ body: { padding: 0 } }}>
        <Table dataSource={settings?.data} columns={columns} loading={isLoading} rowKey="id" pagination={false} scroll={{ x: "max-content" }} />
      </Card>

      <Modal title="Konfigurasi Waktu Absensi" open={isModalOpen} onCancel={handleCancel} footer={null} width={600}>
        <Form form={form} layout="vertical" onFinish={onFinish} className="mt-4">
          <Form.Item name="name" label="Nama Setting" rules={[{ required: true }]}>
            <Input placeholder="Jam Sekolah Normal" size="large" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="checkInTime" label="Jam Masuk" rules={[{ required: true }]}>
                <TimePicker format="HH:mm" className="w-full" size="large" placeholder="07:00" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="checkOutTime" label="Jam Pulang" rules={[{ required: true }]}>
                <TimePicker format="HH:mm" className="w-full" size="large" placeholder="15:00" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="lateThreshold" label="Batas Toleransi Terlambat (Menit)" rules={[{ required: true }]}>
            <InputNumber min={0} className="w-full" size="large" />
          </Form.Item>

          <div className="flex justify-end gap-3 mt-8">
            <Button onClick={handleCancel}>Batal</Button>
            <Button type="primary" htmlType="submit" className="bg-dot-500" loading={createMutation.isPending}>
              Simpan Konfigurasi
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default AttendanceSettingPage;
