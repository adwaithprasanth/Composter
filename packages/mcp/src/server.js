#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createMcpServer } from "../lib/factory.js";
import { loadSession, getBaseUrl } from "../lib/auth.js";

// Redirect console.log to stderr (MCP uses stdout for protocol communication)
console.log = (...args) => console.error(...args);

async function main() {
  try {
    // Check if user is logged in via CLI
    const session = loadSession();
    if (!session) {
      console.error("❌ No session found. Please run 'composter login' first.");
      process.exit(1);
    }

    const baseUrl = getBaseUrl();
    console.error(`🚀 Composter MCP Server starting...`);
    console.error(`📡 API: ${baseUrl}`);

    // Create and start MCP server
    const server = createMcpServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.error("✅ Composter MCP server running on stdio");
  } catch (error) {
    console.error("❌ Fatal Error:", error.message);
    process.exit(1);
  }
}

main();
