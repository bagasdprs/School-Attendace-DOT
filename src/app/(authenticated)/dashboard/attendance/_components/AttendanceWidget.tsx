import React, { useState, useEffect } from "react";
import { Card, Button, Typography, Tag } from "antd";
import { LoginOutlined, LogoutOutlined, ClockCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

// Extend dayjs untuk durasi
dayjs.extend(duration);

const { Title, Text } = Typography;

interface AttendanceWidgetProps {
  todayRecord?: any; // Data absensi hari ini (jika ada)
  onCheckIn: () => void;
  onCheckOut: () => void;
  isLoading: boolean;
}

function AttendanceWidget({ todayRecord, onCheckIn, onCheckOut, isLoading }: AttendanceWidgetProps) {
  const [liveTimer, setLiveTimer] = useState<string>("00:00:00");
  const currentDay = dayjs().day();
  const isWeekend = currentDay === 0 || currentDay === 6; // 0 = Minggu, 6 = Sabtu

  // Logika Live Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    // Hanya jalankan timer JIKA sudah Check-In tapi BELUM Check-Out
    if (todayRecord && todayRecord.checkInTime && !todayRecord.checkOutTime) {
      interval = setInterval(() => {
        const checkIn = dayjs(todayRecord.checkInTime);
        const now = dayjs();
        const diff = now.diff(checkIn);

        // Format milidetik ke HH:mm:ss
        const formattedTime = dayjs.duration(diff).format("HH:mm:ss");
        setLiveTimer(formattedTime);
      }, 1000);
    }

    // Cleanup interval saat komponen dibongkar
    return () => clearInterval(interval);
  }, [todayRecord]);

  // Menentukan Status Fase
  const isCheckedIn = !!todayRecord?.checkInTime;
  const isCheckedOut = !!todayRecord?.checkOutTime;

  return (
    <Card className="mb-6 overflow-hidden rounded-xl border-none shadow-sm ring-1 ring-gray-100">
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        {/* Bagian Kiri: Info dan Status */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <CheckCircleOutlined className="text-xl text-dot-500" />
            <Title level={4} className="mb-0!">
              Presensi Mandiri Siswa
            </Title>
          </div>
          <Text className="mt-1 text-gray-500">{dayjs().format("dddd, DD MMMM YYYY")}</Text>

          <div className="mt-4">
            {/* 🚨 LOGIC WEEKEND UNTUK TAG STATUS 🚨 */}
            {isWeekend ? (
              <Tag color="error" className="px-3 py-1 text-sm">
                Hari Libur
              </Tag>
            ) : (
              <>
                {!isCheckedIn && (
                  <Tag color="default" className="px-3 py-1 text-sm">
                    Menunggu Check-In
                  </Tag>
                )}
                {isCheckedIn && !isCheckedOut && (
                  <Tag color="processing" icon={<ClockCircleOutlined />} className="animate-pulse px-3 py-1 text-sm">
                    Sedang Berjalan
                  </Tag>
                )}
                {isCheckedOut && (
                  <Tag color="success" className="px-3 py-1 text-sm">
                    Selesai Hari Ini
                  </Tag>
                )}
              </>
            )}
          </div>
        </div>

        {/* Bagian Kanan: Aksi dan Timer */}
        <div className="flex w-full flex-col gap-4 md:w-auto md:flex-row md:items-center">
          {/* 🚨 LOGIC WEEKEND UNTUK TOMBOL AKSI 🚨 */}
          {isWeekend ? (
            <div className="flex flex-col rounded-lg bg-gray-50 px-6 py-3 text-center ring-1 ring-gray-200">
              <Text className="font-medium text-gray-500">Bukan Hari Efektif Sekolah</Text>
              <Text className="mt-1 text-sm text-gray-400">Presensi mandiri hanya aktif Senin - Jumat.</Text>
            </div>
          ) : (
            <>
              {/* FASE 1: Tombol Check-In */}
              {!isCheckedIn && (
                <Button type="primary" size="large" icon={<LoginOutlined />} className="h-14 bg-dot-500 px-8 text-lg font-semibold shadow-md hover:bg-dot-600 md:w-48" onClick={onCheckIn} loading={isLoading}>
                  Check-In Sekarang
                </Button>
              )}

              {/* FASE 2: Live Timer + Tombol Check-Out */}
              {isCheckedIn && !isCheckedOut && (
                <>
                  <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 px-6 py-2 ring-1 ring-gray-200">
                    <Text className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Waktu Belajar</Text>
                    <Text className="font-mono text-2xl font-bold tracking-tight text-gray-800">{liveTimer}</Text>
                  </div>
                  <Button danger type="primary" size="large" icon={<LogoutOutlined />} className="h-14 px-8 text-lg font-semibold shadow-md md:w-48" onClick={onCheckOut} loading={isLoading}>
                    Check-Out
                  </Button>
                </>
              )}

              {/* FASE 3: Ringkasan Selesai */}
              {isCheckedOut && (
                <div className="flex flex-col rounded-lg bg-green-50 px-6 py-3 text-center ring-1 ring-green-100">
                  <Text className="font-medium text-green-700">Terima kasih telah menyelesaikan absen hari ini!</Text>
                  <div className="mt-1 flex items-center justify-center gap-4 text-sm text-green-600">
                    <span>Masuk: {dayjs(todayRecord.checkInTime).format("HH:mm")}</span>
                    <span>•</span>
                    <span>Pulang: {dayjs(todayRecord.checkOutTime).format("HH:mm")}</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  );
}

export default AttendanceWidget;
