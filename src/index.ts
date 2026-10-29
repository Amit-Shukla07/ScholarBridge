import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerAttendanceTools } from "./tools/attendance.tools.js";
import { registerAcademicTools } from "./tools/academic.tools.js";
import { registerPlannerTools } from "./tools/planner.tools.js";
import { registerFacultyTools } from "./tools/faculty.tools.js";
import { registerAcademicResources } from "./resources/academic.resources.js";

async function main() {
  const server = new McpServer({
    name: "ScholarBridge MCP",
    version: "1.0.0"
  });

  console.error("ScholarBridge: Registering tools...");
  registerAttendanceTools(server);
  registerAcademicTools(server);
  registerPlannerTools(server);
  registerFacultyTools(server);

  console.error("ScholarBridge: Registering dynamic MCP resources...");
  registerAcademicResources(server);

  console.error("ScholarBridge: Connecting to StdioServerTransport...");
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error("ScholarBridge MCP Server running and ready over stdio.");
}

main().catch((error) => {
  console.error("Fatal error starting ScholarBridge server:", error);
  process.exit(1);
});
