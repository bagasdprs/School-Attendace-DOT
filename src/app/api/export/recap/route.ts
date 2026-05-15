import { NextRequest, NextResponse } from "next/server";
import { serverCheckPermission } from "@/common/utils/server-check-permission";
import { PERMISSIONS } from "@/common/enum/permission.enum";
import { getClassRecapAction } from "@/server/recap/actions/recap.action";
import ExcelJS from "exceljs";

export async function GET(req: NextRequest) {
  try {
    // 1. Cek Permission Admin
    await serverCheckPermission([PERMISSIONS.EXPORT_RECAP]);

    // 2. Query Parameters
    const { searchParams } = new URL(req.url);
    const classIdParam = searchParams.get("classId");
    const startDate = searchParams.get("start") || "";
    const endDate = searchParams.get("end") || "";
    const searchName = searchParams.get("search") || "";

    const classId = classIdParam ? BigInt(classIdParam) : undefined;

    // 3. GET Data dari Action
    const recap = await getClassRecapAction({
      classId: classId as any,
      startDate,
      endDate,
      search: searchName,
    });

    // 4. Inisialisasi Workbook Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Rekapitulasi Absensi");

    // 5. Struktur & Lebar Kolom
    worksheet.columns = [
      { header: "No", key: "no", width: 5 },
      { header: "Nama Siswa", key: "studentName", width: 35 },
      { header: "Hadir", key: "totalPresent", width: 10 },
      { header: "Terlambat", key: "totalLate", width: 12 },
      { header: "Izin/Sakit", key: "totalExcused", width: 12 },
      { header: "Alpa", key: "totalAbsent", width: 10 },
      { header: "Persentase", key: "attendancePercentage", width: 15 },
    ];

    // 6. Masukkan Data Rekap ke Baris (Row)
    recap.students.forEach((s: any, index: number) => {
      worksheet.addRow({
        no: index + 1,
        studentName: s.studentName,
        totalPresent: s.totalPresent,
        totalLate: s.totalLate,
        totalExcused: s.totalExcused,
        totalAbsent: s.totalAbsent,
        attendancePercentage: `${s.attendancePercentage}%`,
      });
    });

    // 7. Styling Header
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF1D9B5E" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // 8. Rata Tengah (Center Alignment) untuk Data Angka
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.getCell("no").alignment = { horizontal: "center" };
        row.getCell("totalPresent").alignment = { horizontal: "center" };
        row.getCell("totalLate").alignment = { horizontal: "center" };
        row.getCell("totalExcused").alignment = { horizontal: "center" };
        row.getCell("totalAbsent").alignment = { horizontal: "center" };
        row.getCell("attendancePercentage").alignment = { horizontal: "center" };
      }
    });

    // 9. Render Excel ke Buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // 10. Kembalikan Response berupa File .xlsx
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="Rekap_Absensi_${startDate}_to_${endDate}.xlsx"`,
      },
    });
  } catch (error: any) {
    console.error("Export Error:", error);
    return NextResponse.json({ message: error.message || "Gagal melakukan export" }, { status: error.status || 500 });
  }
}
