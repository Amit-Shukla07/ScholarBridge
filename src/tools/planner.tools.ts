import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PlannerService } from "../services/planner.service.js";

const plannerService = new PlannerService();

export function registerPlannerTools(server: McpServer) {
  server.tool(
    "generate_study_plan",
    "Creates a day-by-day, credit-weighted revision schedule based on upcoming exam dates and available daily study hours.",
    {
      exams: z.array(
        z.object({
          courseCode: z.string().describe("Course code, e.g., 'CS301' or 'CSE 302'"),
          examDate: z.string().describe("Exam date in YYYY-MM-DD format, e.g., '2026-11-05'"),
        })
      ).min(1).describe("List of upcoming courses and their respective exam dates"),
      dailyHours: z.number().min(1).max(12).default(4).describe("Dedicated daily study hours (default: 4)")
    },
    async ({ exams, dailyHours }) => {
      try {
        const { markdown } = plannerService.generateStudyPlan(exams, dailyHours);
        return {
          content: [
            {
              type: "text",
              text: markdown
            }
          ]
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: "text",
              text: `❌ Error generating study plan: ${error.message}`
            }
          ],
          isError: true
        };
      }
    }
  );
}
