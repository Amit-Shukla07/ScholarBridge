import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { AcademicService } from "../services/academic.service.js";

const academicService = new AcademicService();

export function registerAcademicTools(server: McpServer) {
  server.tool(
    "get_enrolled_courses",
    "Returns all enrolled courses with instructor and room metadata",
    {},
    async () => {
      const courses = academicService.getAllCourses();
      return {
        content: [{ type: "text", text: JSON.stringify(courses, null, 2) }]
      };
    }
  );

  server.tool(
    "lookup_course",
    "Looks up a specific course by its code and returns schedule, faculty, and room allocation",
    {
      code: z.string().describe("The course code to look up (e.g., CS301)")
    },
    async ({ code }) => {
      const course = academicService.getCourseByCode(code);
      if (!course) {
        return {
          content: [{ type: "text", text: `Error: Course with code ${code} not found.` }],
          isError: true
        };
      }
      return {
        content: [{ type: "text", text: JSON.stringify(course, null, 2) }]
      };
    }
  );

  server.tool(
    "get_dining_menu",
    "Returns the complete dining menu (breakfast, lunch, snacks, dinner) for a given day",
    {
      day: z.string().describe("The day of the week (e.g., Monday, Tuesday)")
    },
    async ({ day }) => {
      const menu = academicService.getMenuByDay(day);
      if (!menu) {
        return {
          content: [{ type: "text", text: `Error: No menu found for day ${day}.` }],
          isError: true
        };
      }
      return {
        content: [{ type: "text", text: JSON.stringify(menu, null, 2) }]
      };
    }
  );

  server.tool(
    "get_pending_deadlines",
    "Returns upcoming assignments, deadlines, and submission portals",
    {},
    async () => {
      const deadlines = academicService.getPendingDeadlines();
      return {
        content: [{ type: "text", text: JSON.stringify(deadlines, null, 2) }]
      };
    }
  );
}
