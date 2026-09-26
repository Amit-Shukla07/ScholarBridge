import { AttendanceRecord, AttendanceEvaluation } from "../types/academic.js";

const DEFAULT_ATTENDANCE: Record<string, AttendanceRecord> = {
  "CS301": { courseCode: "CS301", courseTitle: "Operating Systems", totalConducted: 40, attended: 32, minPercentageRequired: 75 },
  "CS304": { courseCode: "CS304", courseTitle: "DBMS", totalConducted: 35, attended: 25, minPercentageRequired: 75 },
  "CS308": { courseCode: "CS308", courseTitle: "Computer Networks", totalConducted: 42, attended: 35, minPercentageRequired: 75 },
  "CS312": { courseCode: "CS312", courseTitle: "Theory of Computation", totalConducted: 38, attended: 26, minPercentageRequired: 75 }
};

export class AttendanceService {
  public evaluateAttendance(record: AttendanceRecord): AttendanceEvaluation {
    const percentage = (record.attended / record.totalConducted) * 100;
    const isSafe = percentage >= record.minPercentageRequired;
    
    let allowedBunks = 0;
    let consecutiveRecoveryClassesNeeded = 0;
    
    if (isSafe) {
      allowedBunks = Math.floor((record.attended - 0.75 * record.totalConducted) / 0.75);
    } else {
      consecutiveRecoveryClassesNeeded = Math.ceil((0.75 * record.totalConducted - record.attended) / 0.25);
    }
    
    return {
      courseCode: record.courseCode,
      courseTitle: record.courseTitle,
      currentPercentage: Number(percentage.toFixed(2)),
      status: isSafe ? "SAFE" : "CRITICAL",
      allowedBunks,
      consecutiveRecoveryClassesNeeded,
      advice: isSafe 
        ? `You can safely miss ${allowedBunks} more classes while maintaining 75%.` 
        : `CRITICAL: You must attend the next ${consecutiveRecoveryClassesNeeded} consecutive classes to reach 75%.`
    };
  }

  public getCourseAttendance(courseCode: string): AttendanceEvaluation | null {
    const record = DEFAULT_ATTENDANCE[courseCode];
    if (!record) return null;
    return this.evaluateAttendance(record);
  }

  public getAllAttendance(): AttendanceEvaluation[] {
    return Object.values(DEFAULT_ATTENDANCE).map(record => this.evaluateAttendance(record));
  }
}
