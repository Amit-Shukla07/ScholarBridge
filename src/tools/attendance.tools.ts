import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { AttendanceService } from "../services/attendance.service.js";

const attendanceService = new AttendanceService();

export function registerAttendanceTools(server: McpServer) {
  server.tool(
    "check_attendance_status",
    "Check attendance status for a specific course or all courses, returning metrics for safe bunks or recovery classes",
    {
      courseCode: z.string().optional().describe("The course code (e.g., CS301). If omitted, returns all courses.")
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
