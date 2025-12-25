// MCP configuration has moved to a separate package: composter-mcp
// This command now redirects users to the new package

export async function initMcp(client) {
  console.log("\n📦 MCP Server has moved to a separate package!\n");
  console.log("To configure MCP for your AI assistant, run:\n");
  console.log(`  npx composter-mcp init ${client || "<client>"}\n`);
  console.log("Supported clients: claude, cursor, vscode, windsurf\n");
  console.log("For more info: https://www.npmjs.com/package/composter-mcp\n");
}
