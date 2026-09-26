import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { AcademicService } from "../services/academic.service.js";
import { execSync } from "child_process";

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
      code: z.enum([
        "CSE 302", 
        "CSE 303", 
        "CSE 305", 
        "CSE 309", 
        "HIS 251", 
        "SEC 302"
      ]).describe("The course code to look up. Select from the dropdown.")
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
      day: z.enum([
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ]).describe("The day of the week. Select from the dropdown.")
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
    "sync_timetable_to_calendar",
    "Pushes the current semester's timetable to the user's Google Calendar using OAuth",
    {},
    async () => {
      try {
        // We call the standalone script we just built which handles everything nicely.
        const output = execSync("npx tsx sync-calendar.ts").toString();
        return {
          content: [{ type: "text", text: `Successfully synced timetable to Google Calendar!\n\n${output}` }]
        };
      } catch (e: any) {
        return {
          content: [{ type: "text", text: `Failed to sync to Google Calendar. Make sure token.json exists. Error: ${e.message}` }],
          isError: true
        };
      }
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
