"use client";

import React, { useState } from "react";
import { Table, Button, Typography, Input, Space, Card, Tag, Modal, Form, message, Popconfirm } from "antd";
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, BankOutlined } from "@ant-design/icons";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const { Title, Text } = Typography;

function MasterClassPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);

  // 1. Fetch Data via tRPC
  const { data: classes, isLoading, refetch } = trpc.class.getClasses.useQuery({});
  const { data: user, isLoading: isUserLoading } = trpc.auth.me.useQuery();

  useEffect(() => {
    if (!isUserLoading && user?.role === "STUDENT") {
      router.replace("/dashboard");
    }
  }, [user, isUserLoading, router]);

  // 2. Mutations
  const createMutation = trpc.class.createClass.useMutation({
    onSuccess: () => {
      message.success("Kelas berhasil ditambahkan!");
      handleCancel();
      refetch();
    },
  });

  const updateMutation = trpc.class.updateClass.useMutation({
    onSuccess: () => {
      message.success("Data kelas berhasil diperbarui!");
      handleCancel();
      refetch();
    },
  });

  const deleteMutation = trpc.class.deleteClass.useMutation({
    onSuccess: () => {
      message.success("Kelas berhasil dihapus");
      refetch();
    },
  });

  // 3. Handlers
  const showModal = (record?: any) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue(record);
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingId(null);
    form.resetFields();
  };

  const onFinish = (values: any) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...values });
    } else {
      createMutation.mutate(values);
    }
  };

  // 4. Table Columns
  const columns = [
    {
      title: "Nama Kelas",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <Text strong className="text-gray-700">
          {text}
        </Text>
      ),
    },
    {
      title: "Tahun Ajaran",
      dataIndex: "academicYear",
      key: "academicYear",
    },
    {
      title: "Aksi",
      key: "action",
      width: 150,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined className="text-dot-500" />} onClick={() => showModal(record)} />
          <Popconfirm title="Hapus Kelas?" description="Tindakan ini tidak dapat dibatalkan." onConfirm={() => deleteMutation.mutate(record.id)} okText="Ya, Hapus" cancelText="Batal" okButtonProps={{ danger: true }}>
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
            <BankOutlined className="mr-3 text-dot-500" />
            Master Data Kelas
          </Title>
          <Text className="text-gray-500">Kelola daftar kelas dan wali kelas di instansi Anda.</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" className="bg-dot-500 hover:bg-dot-600" onClick={() => showModal()}>
          Tambah Kelas
        </Button>
      </div>

      <Card bordered={false} className="shadow-sm ring-1 ring-gray-100">
        <Input placeholder="Cari nama kelas atau wali kelas..." prefix={<SearchOutlined className="text-gray-400" />} className="max-w-md rounded-lg" size="large" />
      </Card>

      <Card bordered={false} className="shadow-sm ring-1 ring-gray-100" styles={{ body: { padding: 0 } }}>
        <Table columns={columns} dataSource={classes?.data} loading={isLoading} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>

      <Modal title={editingId ? "Edit Data Kelas" : "Tambah Kelas Baru"} open={isModalOpen} onCancel={handleCancel} footer={null} centered>
        <Form form={form} layout="vertical" onFinish={onFinish} className="mt-4">
          <Form.Item label="Nama Kelas" name="name" rules={[{ required: true, message: "Nama kelas wajib diisi" }]}>
            <Input placeholder="10 IPA 1" size="large" />
          </Form.Item>

          <Form.Item label="Tahun Ajaran" name="academicYear" rules={[{ required: true, message: "Tahun ajaran wajib diisi" }]}>
            <Input placeholder="2023/2024" size="large" />
          </Form.Item>

          <div className="mt-8 flex justify-end gap-3">
            <Button onClick={handleCancel}>Batal</Button>
            <Button type="primary" htmlType="submit" className="bg-dot-500" loading={createMutation.isPending || updateMutation.isPending}>
              {editingId ? "Simpan Perubahan" : "Simpan Data"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default MasterClassPage;
