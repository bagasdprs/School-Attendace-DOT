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

export interface TStudentRecap {
  studentId: string;
  studentName: string;
  totalPresent: number;
  totalLate: number;
  totalExcused: number;
  totalAbsent: number;
  attendancePercentage: number;
}

export interface TOverallClassRecapResponse {
  overallPercentage: number;
  grandTotalAbsent: number;
  grandTotalLate: number;
  students: TStudentRecap[];
}
