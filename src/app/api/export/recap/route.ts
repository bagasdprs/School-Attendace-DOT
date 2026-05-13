import { NextRequest, NextResponse } from "next/server";
import { serverCheckPermission } from "@/common/utils/server-check-permission";
import { PERMISSIONS } from "@/common/enum/permission.enum";
import { getClassRecapAction } from "@/server/recap/actions/recap.action";

export async function GET(req: NextRequest) {
  try {
    await serverCheckPermission([PERMISSIONS.EXPORT_RECAP]);

    const { searchParams } = new URL(req.url);
    const classIdParam = searchParams.get("classId");
    const startDate = searchParams.get("start") || "";
    const endDate = searchParams.get("end") || "";

    const classId = classIdParam ? BigInt(classIdParam) : undefined;

    const recap = await getClassRecapAction({
      classId: classId as any,
      startDate,
      endDate,
    });

    const csvHeader = "Nama Siswa,Hadir,Terlambat,Izin/Sakit,Alpa,Persentase\n";
    const csvRows = recap.students.map((s: any) => `${s.studentName},${s.totalPresent},${s.totalLate},${s.totalExcused},${s.totalAbsent},${s.attendancePercentage}%`).join("\n");

    const csvContent = csvHeader + csvRows;

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=recap-absensi-${startDate}-to-${endDate}.csv`,
      },
    });
  } catch (error: any) {
    console.error("Export Error:", error);
    return NextResponse.json({ message: error.message || "Gagal melakukan export" }, { status: error.status || 500 });
  }
}
