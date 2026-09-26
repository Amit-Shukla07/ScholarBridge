export interface Course {
  code: string;
  title: string;
  instructor: string;
  credits: number;
  room: string;
  slot: string;
}

export interface AttendanceRecord {
  courseCode: string;
  courseTitle: string;
  totalConducted: number;
  attended: number;
  minPercentageRequired: number;
}

export interface AttendanceEvaluation {
  courseCode: string;
  courseTitle: string;
  currentPercentage: number;
  status: "SAFE" | "CRITICAL";
  allowedBunks: number;
  consecutiveRecoveryClassesNeeded: number;
  advice: string;
}

export interface DiningMenu {
  day: string;
  breakfast: string[];
  lunch: string[];
  snacks: string[];
  dinner: string[];
}

export interface AcademicDeadline {
  id: string;
  courseCode: string;
  title: string;
  dueDate: string;
  weightage: number;
  portal: string;
}
