"use client";

import React, { useState } from "react";
import { Table, Button, Typography, Input, Space, Card, Tag, Modal, Form, message, Popconfirm, Select } from "antd";
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const { Title, Text } = Typography;

function MasterStudentPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // 1. Data Fetching
  const { data: user, isLoading: isUserLoading } = trpc.auth.me.useQuery();
  const { data: students, isLoading, refetch } = trpc.student.getStudents.useQuery({ search });
  const { data: classes } = trpc.class.getClasses.useQuery({});

  useEffect(() => {
    if (!isUserLoading && user?.role === "STUDENT") {
      router.replace("/dashboard");
    }
  }, [user, isUserLoading, router]);

  // 2. Mutations
  const createMutation = trpc.student.createStudent.useMutation({
    onSuccess: () => {
      message.success("Siswa berhasil ditambahkan!");
      // console.log("Siswa tambah di kelas: ", form.getFieldValue("classId"));
      handleCancel();
      refetch();
    },
  });

  const updateMutation = trpc.student.updateStudent.useMutation({
    onSuccess: () => {
      message.success("Data siswa berhasil diperbarui!");
      handleCancel();
      refetch();
    },
  });

  const deleteMutation = trpc.student.deleteStudent.useMutation({
    onSuccess: () => {
      message.success("Siswa berhasil dihapus");
      refetch();
    },
  });

  // 3. Handlers
  const showModal = (record?: any) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue({
        ...record,
        nis: record.nis,
        classId: record.class?.id,
      });
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

  // 4. Columns Configuration
  const columns = [
    {
      title: "NIS",
      dataIndex: "nis",
      key: "nis",
      render: (text: string) => <Text code>{text}</Text>,
    },
    {
      title: "Nama Lengkap",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <Text strong className="text-gray-700">
          {text}
        </Text>
      ),
    },
    {
      title: "Kelas",
      dataIndex: "className",
      key: "className",
      render: (className: string) => {
        return className ? <span className="font-medium text-gray-700">{className}</span> : <Tag color="default">Belum ada kelas</Tag>;
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      className: "text-gray-500",
    },
    {
      title: "Aksi",
      key: "action",
      width: 120,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined className="text-dot-500" />} onClick={() => showModal(record)} />
          <Popconfirm title="Hapus Siswa?" onConfirm={() => deleteMutation.mutate({ id: record.id })} okText="Hapus" cancelText="Batal" okButtonProps={{ danger: true }}>
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
            <UserOutlined className="mr-3 text-dot-500" />
            Master Data Siswa
          </Title>
          <Text className="text-gray-500">Kelola informasi data diri dan penempatan kelas siswa.</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" className="bg-dot-500" onClick={() => showModal()}>
          Tambah Siswa
        </Button>
      </div>

      <Card bordered={false} className="shadow-sm ring-1 ring-gray-100">
        <Input placeholder="Cari NIS atau Nama Siswa..." prefix={<SearchOutlined className="text-gray-400" />} className="max-w-md rounded-lg" size="large" onChange={(e) => setSearch(e.target.value)} />
      </Card>

      <Card bordered={false} className="shadow-sm ring-1 ring-gray-100" styles={{ body: { padding: 0 } }}>
        <Table columns={columns} dataSource={students?.data} loading={isLoading} rowKey="id" scroll={{ x: "max-content" }} />
      </Card>

      <Modal title={editingId ? "Edit Profil Siswa" : "Registrasi Siswa Baru"} open={isModalOpen} onCancel={handleCancel} footer={null} centered>
        <Form form={form} layout="vertical" onFinish={onFinish} className="mt-4">
          <Form.Item label="NIS (Nomor Induk Siswa)" name="nis" rules={[{ required: true }]}>
            <Input placeholder="Contoh: 2024001" size="large" />
          </Form.Item>

          <Form.Item label="Nama Lengkap" name="name" rules={[{ required: true }]}>
            <Input placeholder="Masukkan nama lengkap siswa" size="large" />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
            <Input placeholder="email@sekolah.sch.id" size="large" />
          </Form.Item>

          <Form.Item label="Penempatan Kelas" name="classId" rules={[{ required: true }]}>
            <Select placeholder="Pilih Kelas" size="large">
              {classes?.data?.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div className="mt-8 flex justify-end gap-3">
            <Button onClick={handleCancel}>Batal</Button>
            <Button type="primary" htmlType="submit" className="bg-dot-500">
              {editingId ? "Perbarui Data" : "Simpan Siswa"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default MasterStudentPage;
