import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import fs from "node:fs";
import path from "node:path";
import { facultyService } from "../services/faculty.service.js";

function getFacultyCardImageBase64(facultyId: string): string | null {
  try {
    const cardPath = path.resolve(process.cwd(), `assets/faculty/${facultyId}-card.png`);
    if (fs.existsSync(cardPath)) {
      return fs.readFileSync(cardPath).toString("base64");
    }
  } catch (err) {
    console.error("Failed to read faculty card image:", err);
  }
  return null;
}

export function registerFacultyTools(server: McpServer) {
  server.registerTool(
    "find_faculty_office",
    {
      title: "Find Faculty Cabin & Contact Details",
      description:
        "Searches faculty members by name, department, or cabin block. Returns clean official faculty directory cards with cabin/cubicle number, block, level, official email, and designation.",
      inputSchema: {
        query: z
          .string()
          .describe("Faculty name, department (e.g. CSE), or building block (e.g. CV Raman, Homi J Bhabha)"),
      },
    },
    async ({ query }) => {
      const results = await facultyService.searchFaculty(query);

      if (results.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: `No faculty found matching "${query}". Please check the spelling or search by department (e.g. "CSE", "History") or block name (e.g. "CV Raman", "Homi J Bhabha").`,
            },
          ],
        };
      }

      const contentItems: Array<
        | { type: "text"; text: string }
        | { type: "image"; data: string; mimeType: string }
      > = [];

      // Short and crisp markdown text (no base64 strings in text!)
      const formattedMarkdown = results
        .map((f) => {
          const socialItems: string[] = [];
          if (f.socialLinks?.linkedin) socialItems.push("LinkedIn");
          if (f.socialLinks?.googleScholar) socialItems.push("Google Scholar");
          if (f.socialLinks?.scopus) socialItems.push("Scopus");
          if (f.socialLinks?.orcid) socialItems.push("ORCID");

          return `### 👨‍🏫 ${f.name}
**${f.designation}** | *${f.department}*

- **📧 Contact Details:** [${f.email}](mailto:${f.email})
- **📍 Office Location:** ${f.officeLocation.rawLocation}
${socialItems.length > 0 ? `- **🔗 Social Links:** ${socialItems.join(" • ")}` : ""}`;
        })
        .join("\n\n---\n\n");

      contentItems.push({
        type: "text" as const,
        text: formattedMarkdown,
      });

      // Attach the exact 2-column official card image for each matching faculty member
      for (const f of results) {
        const cardB64 = getFacultyCardImageBase64(f.id);
        if (cardB64) {
          contentItems.push({
            type: "image" as const,
            data: cardB64,
            mimeType: "image/png",
          });
        }
      }

      return {
        content: contentItems,
      };
    }
  );
}
