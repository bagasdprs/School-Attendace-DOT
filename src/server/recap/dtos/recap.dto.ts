export interface TRecapSummary {
  present: number;
  late: number;
  absent: number;
  excused: number;
  totalDays: number;
  attendancePercentage: string;
}

export interface TStudentRecapResponse extends TRecapSummary {
  studentId: string;
  studentName: string;
  nis: string;
}

export interface TClassRecapResponse {
  classId: string;
  className: string;
  period: string;
  classSummary: TRecapSummary;
  students: TStudentRecapResponse[];
}
