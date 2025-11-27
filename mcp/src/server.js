#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getLocalUser } from "../lib/auth.js";

const originalLog = console.log;
console.log = (...args) => console.error(...args);

async function main() {
  try {
    const dotenv = await import("dotenv");
    const path = await import("path");
    
    dotenv.default.config({ 
      path: path.resolve(process.cwd(), "../.env"),
      debug: false 
    });

    const { createMcpServer } = await import("../lib/factory.js");

    const userId = await getLocalUser();
    console.error(`✅ Authenticated as user ID: ${userId}`);

    const server = createMcpServer(userId);
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    console.error('🚀 Composter MCP server running on stdio');

  } catch (error) {
    console.error("❌ Fatal Error:", error.message);
    process.exit(1);
  }
}

main();