import { Class } from "@prisma/client";

export interface TClassResponse {
  id: string;
  name: string;
  academicYear: string;
  createdAt: string;
}

export const ClassDTO = {
  toResponse(classData: Class): TClassResponse {
    return {
      id: classData.id.toString(),
      name: classData.name,
      academicYear: classData.academicYear,
      createdAt: classData.createdAt.toISOString(),
    };
  },

  toResponseList(classes: Class[]): TClassResponse[] {
    return classes.map((c) => this.toResponse(c));
  },
};
