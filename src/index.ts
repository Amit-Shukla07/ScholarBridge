import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerAttendanceTools } from "./tools/attendance.tools.js";
import { registerAcademicTools } from "./tools/academic.tools.js";

async function main() {
  const server = new McpServer({
    name: "ScholarBridge MCP",
    version: "1.0.0"
  });

  console.error("Registering tools...");
  
  registerAttendanceTools(server);
  registerAcademicTools(server);

  console.error("Connecting to standard transport...");
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error("ScholarBridge MCP Server running and ready to handle requests.");
}

main().catch((error) => {
  console.error("Fatal error starting ScholarBridge server:", error);
  process.exit(1);
});
