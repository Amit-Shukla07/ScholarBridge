import { AttendanceRecord, AttendanceEvaluation } from "../types/academic.js";
import { ErpScraper } from "./erp.scraper.js";

const DEFAULT_ATTENDANCE: Record<string, AttendanceRecord> = {
  "CSE 302": { courseCode: "CSE 302", courseTitle: "OPERATING SYSTEMS", totalConducted: 40, attended: 32, minPercentageRequired: 75 },
  "CSE 303": { courseCode: "CSE 303", courseTitle: "MACHINE LEARNING", totalConducted: 35, attended: 25, minPercentageRequired: 75 },
  "CSE 305": { courseCode: "CSE 305", courseTitle: "COMPUTER ORGANIZATION AND ARCHITECTURE", totalConducted: 42, attended: 35, minPercentageRequired: 75 },
  "CSE 309": { courseCode: "CSE 309", courseTitle: "ADVANCED JAVA PROGRAMMING", totalConducted: 38, attended: 26, minPercentageRequired: 75 },
  "HIS 251": { courseCode: "HIS 251", courseTitle: "INTRODUCTION TO GENDER", totalConducted: 15, attended: 12, minPercentageRequired: 75 },
  "SEC 302": { courseCode: "SEC 302", courseTitle: "GENERATIVE AI WITH AGENTIC AI - I", totalConducted: 20, attended: 18, minPercentageRequired: 75 }
};

export class AttendanceService {
  private scraper = new ErpScraper();

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

  // Refactored to fetch live data if available!
  private async fetchRecords(): Promise<Record<string, AttendanceRecord>> {
    try {
      if (process.env.ERP_USERNAME) {
        console.error("ERP credentials found in .env. Attempting live web scrape...");
        let liveData;
        try {
          liveData = await this.scraper.scrapeAttendance();
        } catch (err: any) {
          console.error("Scrape failed. Retrying one more time in case of Captcha error...");
          liveData = await this.scraper.scrapeAttendance();
        }
        
        const liveRecordMap: Record<string, AttendanceRecord> = {};
        for (const record of liveData) {
          liveRecordMap[record.courseCode] = record;
        }
        return liveRecordMap;
      }
    } catch (e: any) {
      console.error(`Live scrape failed (${e.message}). Falling back to mock data...`);
    }
    
    return DEFAULT_ATTENDANCE;
  }

  public async getCourseAttendance(courseCode: string): Promise<AttendanceEvaluation | null> {
    const records = await this.fetchRecords();
    const normalizedQuery = courseCode.replace(/\s+/g, '').toUpperCase();
    const record = Object.values(records).find(r => 
      r.courseCode.replace(/\s+/g, '').toUpperCase() === normalizedQuery
    );
    if (!record) return null;
    return this.evaluateAttendance(record);
  }

  public async getAllAttendance(): Promise<AttendanceEvaluation[]> {
    const records = await this.fetchRecords();
    return Object.values(records).map(record => this.evaluateAttendance(record));
  }
}
