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

export type MessType = "north" | "south";

export interface MealSlot {
  items: string[];
  timing: string;
  veg?: string[];
  nonVeg?: string[];
}

export interface DailyDiningMenu {
  day: string;
  breakfast: MealSlot;
  lunch: MealSlot;
  snacks: MealSlot;
  dinner: MealSlot;
}

export interface MessTimings {
  weekdayBreakfast: string;
  weekendBreakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
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

export interface ExamDetail {
  courseCode: string;
  examDate: string; // ISO date format, e.g., "2026-11-05"
}

export interface StudySession {
  dayNumber: number;
  date: string;
  focusSubject: string;
  courseCode: string;
  durationHours: number;
  recommendedTopics: string[];
  notes: string;
}

export interface StudyPlanReport {
  totalDays: number;
  dailyHoursAllocated: number;
  schedule: StudySession[];
  strategyAdvice: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  department: string;
  email: string;
  officeLocation: {
    block: string;
    level: string;
    roomOrCubicle: string;
    rawLocation: string;
  };
  avatarUrl: string; // Path or hosted URL for profile picture (e.g., assets/faculty/<id>.jpg)
  socialLinks?: {
    linkedin?: boolean;
    googleScholar?: boolean;
    scopus?: boolean;
    orcid?: boolean;
  };
}
