import { Prisma } from "@prisma/client";
import { Student, Class } from "@prisma/client";

export type TStudentEntity = Student & {
  class?: Class | null;
};

type TStudentWithClass = Prisma.StudentGetPayload<{
  include: { class: true };
}>;

export interface TStudentResponse {
  id: string;
  nis: string;
  name: string;
  email: string;
  classId: string;
  className?: string;
  createdAt: string;
}

export const StudentDTO = {
  toResponse(student: TStudentWithClass | any): TStudentResponse {
    return {
      id: student.id.toString(),
      nis: student.nis,
      name: student.name,
      email: student.email,
      classId: student.classId.toString(),
      className: student.class?.name,
      createdAt: student.createdAt.toISOString(),
    };
  },

  toResponseList(students: any[]): TStudentResponse[] {
    return students.map((student) => this.toResponse(student));
  },
};
