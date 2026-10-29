import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { AttendanceService } from "../services/attendance.service.js";

const attendanceService = new AttendanceService();

function renderProgressBar(percentage: number, totalBars: number = 10): string {
  const clamped = Math.max(0, Math.min(100, percentage));
  const filled = Math.round((clamped / 100) * totalBars);
  const empty = totalBars - filled;
  return `[${"█".repeat(filled)}${"░".repeat(empty)}] ${percentage.toFixed(1)}%`;
}

function formatCourseCard(r: any): string {
  const isSafe = r.status === "SAFE";
  const badge = isSafe ? "🟢 [SAFE]" : "🔴 [CRITICAL WARNING]";
  const bar = renderProgressBar(r.currentPercentage, 10);

  if (isSafe) {
    return [
      `### 📘 **${r.courseCode}** — *${r.courseTitle}*`,
      `- **🚦 Status:** ${badge}`,
      `- **📈 Current Attendance:** \`${bar}\``,
      `- **🏖️ Safe Leaves Allowed:** **${r.allowedBunks} class(es)** can be safely missed while maintaining ≥ 75.0%`,
      `- **💡 Advice:** ${r.advice}`
    ].join("\n");
  } else {
    return [
      `### 📘 **${r.courseCode}** — *${r.courseTitle}*`,
      `- **🚦 Status:** ${badge}`,
      `- **📈 Current Attendance:** \`${bar}\``,
      `- **🚨 Recovery Required:** Attend next **${r.consecutiveRecoveryClassesNeeded} consecutive class(es)** to reach 75.0%`,
      `- **📋 Immediate Action Steps:**`,
      `  1. Mandatory attendance: Do not bunk any upcoming classes for **${r.courseCode}**.`,
      `  2. Check medical / on-duty (OD) certificates with course faculty or HOD for retroactive credit.`,
      `  3. Track progress closely after attending the next ${r.consecutiveRecoveryClassesNeeded} classes.`,
      `- **💡 Advice:** ${r.advice}`
    ].join("\n");
  }
}

export function registerAttendanceTools(server: McpServer) {
  server.tool(
    "check_attendance_status",
    "Check attendance status for a specific course or all courses, returning interactive visual status cards with safe bunk allowances and recovery roadmaps.",
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
            content: [{ type: "text", text: formatCourseCard(result) }]
          };
        } else {
          const results = await attendanceService.getAllAttendance();
          if (results.length === 0) {
            return {
              content: [{ type: "text", text: "No attendance records available." }]
            };
          }

          const totalSafeBunks = results.reduce((acc, r) => acc + (r.allowedBunks || 0), 0);
          const avg = (results.reduce((acc, r) => acc + r.currentPercentage, 0) / results.length).toFixed(1);

          let markdown = `# 📊 **SRM-AP Attendance Status Board**\n\n`;
          markdown += `> **Overall Semester Average:** **${avg}%** • **Combined Safe Leave Buffer:** **${totalSafeBunks} class(es)**\n\n`;
          markdown += `| 📘 Course | 🎓 Course Title | 📊 Progress Bar | 🚦 Status | 🎯 Safe Bunks / Action |\n`;
          markdown += `| :--- | :--- | :--- | :--- | :--- |\n`;

          for (const r of results) {
            const isSafe = r.status === "SAFE";
            const badge = isSafe ? "🟢 `SAFE`" : "🔴 `CRITICAL`";
            const bar = renderProgressBar(r.currentPercentage, 8);
            const action = isSafe
              ? `+${r.allowedBunks} safe bunk(s)`
              : `Attend next ${r.consecutiveRecoveryClassesNeeded} consecutive`;

            markdown += `| **${r.courseCode}** | ${r.courseTitle} | \`${bar}\` | ${badge} | ${action} |\n`;
          }

          markdown += `\n---\n\n### 📋 Detailed Course Status Cards\n\n`;
          markdown += results.map(formatCourseCard).join("\n\n---\n\n");

          return {
            content: [{ type: "text", text: markdown }]
          };
        }
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `Failed to fetch attendance: ${error.message}` }],
          isError: true
        };
      }
    }
  );
}
