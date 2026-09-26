import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { AttendanceService } from "../services/attendance.service.js";

const attendanceService = new AttendanceService();

export function registerAttendanceTools(server: McpServer) {
  server.tool(
    "check_attendance_status",
    "Check attendance status for a specific course or all courses, returning metrics for safe bunks or recovery classes",
    {
      courseCode: z.enum([
        "CSE 302", 
        "CSE 303", 
        "CSE 305", 
        "CSE 309", 
        "HIS 251", 
        "SEC 302"
      ]).optional().describe("The course code. Select from the dropdown. If omitted, returns all courses.")
    },
    async ({ courseCode }) => {
      try {
        if (courseCode) {
          const result = await attendanceService.getCourseAttendance(courseCode);
          if (!result) {
            return {
              content: [{ type: "text", text: `Error: Course ${courseCode} not found in attendance records.` }],
              isError: true
            };
          }
          return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
          };
        } else {
          const results = await attendanceService.getAllAttendance();
          return {
            content: [{ type: "text", text: JSON.stringify(results, null, 2) }]
          };
        }
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `Failed to fetch attendance: ${error.message}` }],
          isError: true
        }
      }
    }
  );
}
