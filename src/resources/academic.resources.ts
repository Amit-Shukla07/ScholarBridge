import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AcademicService } from "../services/academic.service.js";
import { AttendanceService } from "../services/attendance.service.js";
import { facultyService } from "../services/faculty.service.js";

const academicService = new AcademicService();
const attendanceService = new AttendanceService();

function getActiveMealSlot(): { name: string; timing: string } {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const totalMins = hours * 60 + minutes;

  if (totalMins >= 420 && totalMins < 570) {
    return { name: "BREAKFAST", timing: "7:00 AM – 9:00 AM" };
  }
  if (totalMins >= 720 && totalMins < 870) {
    return { name: "LUNCH", timing: "12:00 PM – 2:30 PM" };
  }
  if (totalMins >= 990 && totalMins < 1065) {
    return { name: "SNACKS", timing: "4:30 PM – 5:45 PM" };
  }
  if (totalMins >= 1140 && totalMins < 1305) {
    return { name: "DINNER", timing: "7:00 PM – 9:45 PM" };
  }
  if (totalMins < 420) return { name: "UPCOMING: BREAKFAST", timing: "7:00 AM – 9:00 AM" };
  if (totalMins < 720) return { name: "UPCOMING: LUNCH", timing: "12:00 PM – 2:30 PM" };
  if (totalMins < 990) return { name: "UPCOMING: SNACKS", timing: "4:30 PM – 5:45 PM" };
  if (totalMins < 1140) return { name: "UPCOMING: DINNER", timing: "7:00 PM – 9:45 PM" };
  return { name: "NIGHT RECOVERY (NEXT: BREAKFAST)", timing: "Tomorrow 7:00 AM" };
}

function renderProgressBar(percentage: number, totalBars: number = 10): string {
  const clamped = Math.max(0, Math.min(100, percentage));
  const filled = Math.round((clamped / 100) * totalBars);
  const empty = totalBars - filled;
  return `[${"█".repeat(filled)}${"░".repeat(empty)}] ${percentage.toFixed(1)}%`;
}

export function registerAcademicResources(server: McpServer) {
  // 1. scholarbridge://dining/today
  server.resource(
    "today-dining-menu",
    "scholarbridge://dining/today",
    {
      description: "Today's active SRM-AP mess dining schedule, active serving slot, and menu breakdown for South and North Indian messes.",
      mimeType: "text/markdown"
    },
    async (uri) => {
      const southData = academicService.getTodaysMenu("south");
      const northData = academicService.getTodaysMenu("north");
      const activeWindow = getActiveMealSlot();

      const southMenu = southData.menu;
      const northMenu = northData.menu;

      let markdown = `# 🍽️ **SRM-AP Central Dining Live Dashboard**\n`;
      markdown += `> 🕒 **Active Meal Window:** \`${activeWindow.name} (${activeWindow.timing})\`\n\n`;

      if (southMenu) {
        markdown += `## 🌴 **${southMenu.day.toUpperCase()} (TODAY)** — *SOUTH INDIAN MESS*\n\n`;
        markdown += `| 🕒 MEAL | 🍴 MENU ITEMS | ⏰ SERVING TIMINGS |\n`;
        markdown += `| :--- | :--- | :--- |\n`;
        markdown += `| **BREAKFAST** | ${southMenu.breakfast.items.join(", ")} | \`${southMenu.breakfast.timing}\` |\n`;
        markdown += `| **LUNCH** | ${southMenu.lunch.items.join(", ")} | \`${southMenu.lunch.timing}\` |\n`;
        markdown += `| **SNACKS** | ${southMenu.snacks.items.join(", ")} | \`${southMenu.snacks.timing}\` |\n`;
        markdown += `| **DINNER** | ${southMenu.dinner.items.join(", ")} | \`${southMenu.dinner.timing}\` |\n\n`;
        markdown += `*Highlighted Specialties: 🍉 Cut Watermelon • 🍨 Ice Cream • 🍗 Kodi Curry*\n\n---\n\n`;
      }

      if (northMenu) {
        markdown += `## 🏔️ **${northMenu.day.toUpperCase()} (TODAY)** — *NORTH INDIAN MESS*\n\n`;
        markdown += `| 🕒 MEAL | 🍴 MENU ITEMS | ⏰ SERVING TIMINGS |\n`;
        markdown += `| :--- | :--- | :--- |\n`;
        markdown += `| **BREAKFAST** | ${northMenu.breakfast.items.join(", ")} | \`${northMenu.breakfast.timing}\` |\n`;
        markdown += `| **LUNCH** | ${northMenu.lunch.items.join(", ")} | \`${northMenu.lunch.timing}\` |\n`;
        markdown += `| **SNACKS** | ${northMenu.snacks.items.join(", ")} | \`${northMenu.snacks.timing}\` |\n`;
        markdown += `| **DINNER** | ${northMenu.dinner.items.join(", ")} | \`${northMenu.dinner.timing}\` |\n\n`;
        markdown += `*Highlighted Specialties: 🍈 Fresh Papaya • 🧀 Shahi Paneer • 🍨 Ice Cream*\n`;
      }

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "text/markdown",
            text: markdown
          }
        ]
      };
    }
  );

  // 2. scholarbridge://attendance/summary
  server.resource(
    "attendance-summary-report",
    "scholarbridge://attendance/summary",
    {
      description: "Real-time attendance safety margin report with visual progress bars, safe bunk balances, and 75% regulatory margin forecasts.",
      mimeType: "text/markdown"
    },
    async (uri) => {
      const records = await attendanceService.getAllAttendance();
      const totalAllowedBunks = records.reduce((acc, r) => acc + (r.allowedBunks || 0), 0);
      const avgPercentage = records.length > 0
        ? (records.reduce((acc, r) => acc + r.currentPercentage, 0) / records.length).toFixed(1)
        : "0.0";

      let markdown = `# 📊 **SRM-AP Attendance Safety Margin Report**\n\n`;
      markdown += `> **Executive Overview**: Overall Average: **${avgPercentage}%** • Total Safe Leave Buffer: **${totalAllowedBunks} class(es)**\n\n`;
      markdown += `| 📘 Course Code | 🎓 Course Title | 📈 Attendance Bar | 🚦 Status | 🏖️ Safe Bunks / Action |\n`;
      markdown += `| :--- | :--- | :--- | :--- | :--- |\n`;

      for (const r of records) {
        const isSafe = r.status === "SAFE";
        const badge = isSafe ? "🟢 `SAFE`" : "🔴 `CRITICAL`";
        const bar = renderProgressBar(r.currentPercentage, 8);
        const action = isSafe
          ? `+${r.allowedBunks} safe bunk(s)`
          : `Attend next ${r.consecutiveRecoveryClassesNeeded} consecutive`;

        markdown += `| **${r.courseCode}** | ${r.courseTitle} | \`${bar}\` | ${badge} | ${action} |\n`;
      }

      markdown += `\n---\n\n### 📋 Course-by-Course Action Protocols\n\n`;

      for (const r of records) {
        const isSafe = r.status === "SAFE";
        const badge = isSafe ? "🟢 [SAFE]" : "🔴 [CRITICAL WARNING]";
        const bar = renderProgressBar(r.currentPercentage);

        markdown += `#### 📘 **${r.courseCode}** — *${r.courseTitle}*\n`;
        markdown += `- **🚦 Status:** \`${badge}\`\n`;
        markdown += `- **📈 Attendance Level:** \`${bar}\`\n`;
        if (isSafe) {
          markdown += `- **🏖️ Safe Leaves Available:** **${r.allowedBunks} class(es)** can be missed without penalty.\n`;
        } else {
          markdown += `- **🚨 Mandatory Recovery:** Attend next **${r.consecutiveRecoveryClassesNeeded} consecutive class(es)** to restore 75%.\n`;
        }
        markdown += `- **💡 Recommendation:** ${r.advice}\n\n`;
      }

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "text/markdown",
            text: markdown.trim()
          }
        ]
      };
    }
  );

  // 3. scholarbridge://faculty/directory
  server.resource(
    "faculty-cabin-directory",
    "scholarbridge://faculty/directory",
    {
      description: "Official SRM University-AP faculty directory index with cabin locations, block levels, and contact emails.",
      mimeType: "text/markdown"
    },
    async (uri) => {
      const faculty = await facultyService.getAllFaculty();

      let markdown = `# 🏛️ **SRM University-AP Faculty Directory & Cabin Locator**\n\n`;
      markdown += `> Total Verified Faculty Profiles: **${faculty.length} Records**\n\n`;
      markdown += `| 👨‍🏫 Faculty Name | 🎓 Designation & Dept | 📍 Cabin Location | 📧 Contact Email |\n`;
      markdown += `| :--- | :--- | :--- | :--- |\n`;

      for (const f of faculty) {
        markdown += `| **${f.name}** | ${f.designation} (${f.department.replace("Department of ", "")}) | ${f.officeLocation.rawLocation} | [${f.email}](mailto:${f.email}) |\n`;
      }

      markdown += `\n---\n\n### 📍 Faculty Profile Cards\n\n`;

      for (const f of faculty) {
        const socialItems: string[] = [];
        if (f.socialLinks?.linkedin) socialItems.push("LinkedIn");
        if (f.socialLinks?.googleScholar) socialItems.push("Google Scholar");
        if (f.socialLinks?.scopus) socialItems.push("Scopus");
        if (f.socialLinks?.orcid) socialItems.push("ORCID");

        markdown += `#### 👨‍🏫 **${f.name}**\n`;
        markdown += `*${f.designation}* — **${f.department}**\n\n`;
        markdown += `- **📧 Email:** [${f.email}](mailto:${f.email})\n`;
        markdown += `- **📍 Cabin Location:** ${f.officeLocation.rawLocation}\n`;
        markdown += `  - **Building:** ${f.officeLocation.block}\n`;
        markdown += `  - **Floor:** ${f.officeLocation.level}\n`;
        markdown += `  - **Room/Cubicle:** ${f.officeLocation.roomOrCubicle}\n`;
        markdown += `- **🖼️ Avatar Photo:** \`${f.avatarUrl}\`\n`;
        if (socialItems.length > 0) {
          markdown += `- **🔗 Academic Links:** ${socialItems.join(" • ")}\n`;
        }
        markdown += `\n---\n\n`;
      }

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "text/markdown",
            text: markdown.trim()
          }
        ]
      };
    }
  );
}
