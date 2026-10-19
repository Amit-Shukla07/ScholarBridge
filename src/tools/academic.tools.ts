import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { AcademicService } from "../services/academic.service.js";
import { ClassroomService } from "../services/classroom.service.js";
import { execSync } from "child_process";

const academicService = new AcademicService();
const classroomService = new ClassroomService();

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
    "get_today_menu",
    "Automatically detects the current day of the week and returns the complete breakfast, lunch, snacks, and dinner menu with operating timings for either the South or North Indian mess.",
    {
      mess: z.enum(["south", "north"]).default("south").describe("Select mess type: 'south' or 'north'. Defaults to 'south'.")
    },
    async ({ mess }) => {
      const todayData = academicService.getTodaysMenu(mess);
      if (!todayData.menu) {
        return {
          content: [
            {
              type: "text",
              text: `No mess menu found for today (${todayData.day}) in ${mess} Indian mess.`,
            },
          ],
          isError: true,
        };
      }

      const formattedMarkdown = academicService.formatMenuAsMarkdown(todayData.menu, mess, true);
      return {
        content: [
          {
            type: "text",
            text: formattedMarkdown,
          },
        ],
      };
    }
  );

  server.tool(
    "get_dining_menu",
    "Returns the full meal breakdown for any selected day and mess (North or South).",
    {
      day: z.string().describe("Day of the week, e.g., 'Monday', 'Tuesday'"),
      mess: z.enum(["north", "south"]).default("south").describe("Mess type ('north' or 'south')"),
      meal: z.enum(["breakfast", "lunch", "snacks", "dinner"]).optional().describe("Optional specific meal slot")
    },
    async ({ day, mess, meal }) => {
      const menu = academicService.getDiningMenu(day, mess, meal);
      if (!menu) {
        return {
          content: [{ type: "text", text: `Error: No menu found for day '${day}'. Please provide a valid day of the week (Monday - Sunday).` }],
          isError: true
        };
      }
      if (meal) {
        const slot = menu as any;
        const messLabel = mess === "north" ? "NORTH INDIAN MESS (NORTH)" : "SOUTH INDIAN MESS (SOUTH)";
        const text = `# 🍽️ SRM-AP Central Dining Portal\n\n` +
          `### 📅 ${slot.day.toUpperCase()} • ${slot.meal.toUpperCase()} — [ ${messLabel} ] \`[ ${slot.timing} ]\`\n\n` +
          `* 🍴 **Items**: ${slot.items.join(", ")}`;
        return {
          content: [{ type: "text", text }]
        };
      }
      return {
        content: [{ type: "text", text: academicService.formatMenuAsMarkdown(menu as any, mess, false) }]
      };
    }
  );

  server.tool(
    "get_mess_timings",
    "Returns operational hours for Weekday Breakfast, Weekend Breakfast, Lunch, Snacks, and Dinner.",
    {},
    async () => {
      const timings = academicService.getMessTimings();
      const text = `
# ⏰ SRM-AP Hostel Mess Operating Timings

| 🕒 Meal Slot | 📅 Weekday Timings (Mon–Fri) | 🌴 Weekend Timings (Sat–Sun) |
| :--- | :--- | :--- |
| **🌅 Breakfast** | \`${timings.weekdayBreakfast}\` | \`${timings.weekendBreakfast}\` |
| **☀️ Lunch** | \`${timings.lunch}\` | \`${timings.lunch}\` |
| **🍵 Evening Snacks** | \`${timings.snacks}\` | \`${timings.snacks}\` |
| **🌙 Dinner** | \`${timings.dinner}\` | \`${timings.dinner}\` |

*Note: Kitchen service closes promptly at the end of each meal window.*
`.trim();
      return {
        content: [{ type: "text", text }]
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

  function formatDeadlinesTable(deadlines: Array<{ courseCode: string; title: string; dueDate: string; weightage: number; portal: string; link?: string }>): string {
    if (deadlines.length === 0) {
      return "✅ **No pending deadlines!** You're all caught up with your submissions.";
    }

    const rows = deadlines.map(d => {
      const formattedDate = new Date(d.dueDate).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
      const linkStr = d.link ? `[Submit ↗](${d.link})` : `\`${d.portal}\``;
      return `| **${d.courseCode}** | ${d.title} | \`${formattedDate}\` | ${d.weightage > 0 ? `${d.weightage}%` : "—"} | ${linkStr} |`;
    });

    return [
      `# 📌 Upcoming Academic Deadlines`,
      ``,
      `| 📚 Course | 📝 Assignment / Assessment | ⏰ Due Date | ⚖️ Weightage | 🌐 Portal |`,
      `| :--- | :--- | :--- | :--- | :--- |`,
      ...rows
    ].join("\n");
  }

  function getAuthHelpMessage(authUrl: string, featureName: string): string {
    return [
      `# ⚠️ Google Authorization Required for ${featureName}`,
      ``,
      `Your Google Classroom authentication token is either missing or has expired (Google security policies expire test tokens after 7 days).`,
      ``,
      `### 🔑 Quick 30-Second Re-authorization:`,
      `1. Click this link: **[Authorize SRM-AP Google Account](${authUrl})**`,
      `2. Select your college Google account (\`amit_shukla@srmap.edu.in\`) and click **Allow**.`,
      `3. You will be redirected to a page that starts with \`http://localhost/?code=...\` (it's completely normal if the browser says "Site can't be reached").`,
      `4. **Copy the entire URL from your browser's address bar** and paste it here in the chat.`,
      `5. The token will be saved immediately and live Google Classroom data will load!`
    ].join("\n");
  }

  server.tool(
    "get_pending_deadlines",
    "Returns upcoming assignments, deadlines, and submission portals across all active Google Classroom courses and curriculum schedule.",
    {},
    async () => {
      await classroomService.initialize();
      const authUrl = classroomService.getAuthUrl();
      let allDeadlines: Array<{ id?: string; courseCode: string; title: string; dueDate: string; weightage: number; portal: string; link?: string }> = [];
      let isClassroomLoaded = false;

      try {
        const courses = await classroomService.getCourses();
        isClassroomLoaded = true;
        for (const course of courses) {
          const work = await classroomService.getPendingCourseWork(course.id!);
          for (const item of work) {
            if (item.dueDate) {
              const due = new Date(Date.UTC(
                item.dueDate.year || new Date().getFullYear(),
                (item.dueDate.month || 1) - 1,
                item.dueDate.day || 1,
                item.dueTime?.hours || 23,
                item.dueTime?.minutes || 59
              ));

              if (due.getTime() > Date.now()) {
                allDeadlines.push({
                  id: item.id || undefined,
                  courseCode: course.name || "Classroom",
                  title: item.title || "Assignment",
                  dueDate: due.toISOString(),
                  weightage: item.maxPoints || 0,
                  portal: "Google Classroom",
                  link: item.alternateLink || undefined
                });
              }
            }
          }
        }
      } catch (e: any) {
        isClassroomLoaded = false;
        const catalogDeadlines = academicService.getPendingDeadlines();
        for (const cd of catalogDeadlines) {
          allDeadlines.push({
            id: cd.id,
            courseCode: cd.courseCode,
            title: cd.title,
            dueDate: cd.dueDate,
            weightage: cd.weightage,
            portal: cd.portal
          });
        }
      }

      allDeadlines.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      let text = formatDeadlinesTable(allDeadlines);

      if (!isClassroomLoaded) {
        text += `\n\n---\n> ⚠️ **Notice**: Google Classroom OAuth token has expired. Showing official semester schedule deadlines.\n> 👉 To sync live Google Classroom assignments, **[Click here to re-authorize](${authUrl})** and paste the redirected URL back.`;
      }

      return {
        content: [{ type: "text", text }]
      };
    }
  );

  server.tool(
    "get_classroom_courses",
    "Fetches all active Google Classroom courses the student is enrolled in.",
    {},
    async () => {
      await classroomService.initialize();
      const authUrl = classroomService.getAuthUrl();
      try {
        const courses = await classroomService.getCourses();
        if (courses.length === 0) {
          return {
            content: [{ type: "text", text: "ℹ️ No active Google Classroom courses found for this account." }]
          };
        }

        const rows = courses.map(c => {
          const link = c.alternateLink ? `[Open Course ↗](${c.alternateLink})` : "—";
          const section = c.section ? c.section : (c.room ? `Room ${c.room}` : "Standard");
          return `| **${c.name}** | \`${c.id}\` | ${section} | ${link} |`;
        });

        const text = [
          `# 🏫 Enrolled Google Classroom Courses (${courses.length})`,
          ``,
          `| 📚 Course Name | 🆔 Course ID | 📍 Section / Room | 🔗 Classroom Link |`,
          `| :--- | :--- | :--- | :--- |`,
          ...rows
        ].join("\n");

        return {
          content: [{ type: "text", text }]
        };
      } catch (e: any) {
        return {
          content: [{ type: "text", text: getAuthHelpMessage(authUrl, "Google Classroom Courses") }]
        };
      }
    }
  );

  server.tool(
    "get_classroom_coursework",
    "Fetches assignments and coursework for a Google Classroom course. Accepts course code (e.g. 'CSE 302', 'CSE 309', 'HIS 251'), title, or numeric ID. If omitted, shows coursework overview across active courses.",
    {
      courseId: z.string().optional().describe("Optional: Course code (e.g. 'CSE 302', 'CSE 309', 'HIS 251'), title, or numeric Google Classroom ID. If omitted, displays coursework across current active courses.")
    },
    async ({ courseId }) => {
      await classroomService.initialize();
      const authUrl = classroomService.getAuthUrl();
      try {
        const courses = await classroomService.getCourses();

        // 1. If courseId is provided, resolve it
        if (courseId && courseId.trim()) {
          const query = courseId.trim().toLowerCase();
          const normQ = query.replace(/[^a-z0-9]/g, "");

          let matchedCourse = courses.find(c => c.id === courseId.trim());
          if (!matchedCourse) {
            matchedCourse = courses.find(c => c.name?.toLowerCase().includes(query));
          }
          if (!matchedCourse && normQ.length > 2) {
            matchedCourse = courses.find(c => c.name?.toLowerCase().replace(/[^a-z0-9]/g, "").includes(normQ));
          }

          if (!matchedCourse) {
            const available = courses.slice(0, 10).map(c => `| **${c.name}** | \`${c.id}\` |`).join("\n");
            const text = [
              `⚠️ **Course "${courseId}" not found** in your enrolled Google Classroom courses.`,
              ``,
              `### 📋 Available Enrolled Courses:`,
              `| 📚 Course Name | 🆔 Course ID / Code |`,
              `| :--- | :--- |`,
              available,
              ``,
              `💡 *Tip: You can pass either the course code (e.g., "CSE 302") or the numeric ID.*`
            ].join("\n");
            return {
              content: [{ type: "text", text }]
            };
          }

          const work = await classroomService.getPendingCourseWork(matchedCourse.id!);
          if (work.length === 0) {
            return {
              content: [{ type: "text", text: `ℹ️ **${matchedCourse.name}**: No coursework or assignments found posted in this course.` }]
            };
          }

          const rows = work.map(item => {
            let dueStr = "No due date";
            if (item.dueDate) {
              dueStr = `${item.dueDate.year || 2026}-${String(item.dueDate.month || 1).padStart(2, '0')}-${String(item.dueDate.day || 1).padStart(2, '0')}`;
              if (item.dueTime?.hours !== undefined) {
                dueStr += ` ${String(item.dueTime.hours).padStart(2, '0')}:${String(item.dueTime.minutes || 0).padStart(2, '0')}`;
              }
            }
            const link = item.alternateLink ? `[View Assignment ↗](${item.alternateLink})` : "—";
            const points = item.maxPoints !== undefined ? `${item.maxPoints} pts` : "Ungraded";
            return `| **${item.title}** | \`${dueStr}\` | ${points} | ${link} |`;
          });

          const text = [
            `# 📝 Coursework: ${matchedCourse.name}`,
            `**Course ID**: \`${matchedCourse.id}\` • **Total Assignments**: ${work.length}`,
            ``,
            `| 📋 Assignment Title | ⏰ Due Date | 🎯 Max Points | 🔗 Assignment Link |`,
            `| :--- | :--- | :--- | :--- |`,
            ...rows
          ].join("\n");

          return {
            content: [{ type: "text", text }]
          };
        }

        // 2. If courseId is omitted, display recent coursework across active semester courses!
        const activeCourses = courses.filter(c => /CSE 302|CSE 309|CSE 303|CSE 305|HIS 251|Computer Organization|ML/i.test(c.name || "")).slice(0, 5);
        const targetCourses = activeCourses.length > 0 ? activeCourses : courses.slice(0, 4);

        let sections: string[] = [
          `# 📝 Google Classroom Coursework Overview`,
          `Showing recent assignments across your active semester courses. To view a specific course, pass its code (e.g. \`CSE 302\`) or ID.`,
          ``
        ];

        for (const c of targetCourses) {
          try {
            const work = await classroomService.getPendingCourseWork(c.id!);
            if (work.length > 0) {
              sections.push(`### 📚 ${c.name} (\`${c.id}\`)`);
              sections.push(`| 📋 Assignment Title | ⏰ Due Date | 🎯 Max Points | 🔗 Link |`);
              sections.push(`| :--- | :--- | :--- | :--- |`);
              for (const item of work.slice(0, 5)) {
                let dueStr = "No due date";
                if (item.dueDate) {
                  dueStr = `${item.dueDate.year || 2026}-${String(item.dueDate.month || 1).padStart(2, '0')}-${String(item.dueDate.day || 1).padStart(2, '0')}`;
                }
                const link = item.alternateLink ? `[View ↗](${item.alternateLink})` : "—";
                sections.push(`| **${item.title}** | \`${dueStr}\` | ${item.maxPoints || 0} pts | ${link} |`);
              }
              sections.push(``);
            }
          } catch {}
        }

        return {
          content: [{ type: "text", text: sections.join("\n") }]
        };
      } catch (e: any) {
        if (e.message?.includes("invalid_grant") || e.message?.includes("Not authenticated") || e.status === 401) {
          return {
            content: [{ type: "text", text: getAuthHelpMessage(authUrl, "Classroom Coursework") }]
          };
        }
        return {
          content: [{ type: "text", text: `❌ Error fetching coursework: ${e.message}` }],
          isError: true
        };
      }
    }
  );
}
