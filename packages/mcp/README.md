# 🤖 Composter MCP Server

> Model Context Protocol server that lets AI assistants access your Composter component vault.

[![npm version](https://img.shields.io/npm/v/composter-mcp.svg)](https://www.npmjs.com/package/composter-mcp)
[![license](https://img.shields.io/npm/l/composter-mcp.svg)](https://github.com/binit2-1/Composter/blob/main/LICENSE)

Let **Claude**, **Cursor**, **GitHub Copilot**, and other MCP-compatible AI assistants search and read components from your personal Composter vault.

---

## 🚀 Quick Start

```bash
# 1) Install & login (once)
npm install -g composter-cli
composter login

# 2) Auto-configure your AI assistant
#    Pick one of: claude | cursor | vscode | windsurf
npx composter-mcp init cursor

# 3) Restart your AI assistant
```

**That's it!** Restart and Composter tools will appear.

---

## 📦 Installation

### Auto-Configure (Recommended)

One command to set up everything:

```bash
npx composter-mcp init claude   # Claude Desktop
npx composter-mcp init cursor   # Cursor
npx composter-mcp init vscode   # VS Code (Copilot)
npx composter-mcp init windsurf # Windsurf
```

This automatically creates/updates the right config file for your AI assistant.

### Manual Configuration

If you prefer manual setup, add to your IDE's MCP config:

```json
{
  "mcpServers": {
    "composter": {
      "command": "npx",
      "args": ["composter-mcp"]
    }
  }
}
```

**Config file locations:**
- **Claude Desktop (macOS):** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Claude Desktop (Linux):** `~/.config/claude/claude_desktop_config.json`
- **Claude Desktop (Windows):** `%APPDATA%\Claude\claude_desktop_config.json`
- **Cursor:** `.cursor/mcp.json` (in project)
- **VS Code:** `.vscode/mcp.json` (in project)
- **Windsurf:** `~/.codeium/windsurf/mcp_config.json`

---

## 🛠️ Available Tools

Once configured, your AI assistant can use these tools:

| Tool | Description |
|------|-------------|
| `search_components` | Search your vault by component name or category |
| `list_categories` | List all categories in your vault |
| `list_components` | List all components in a specific category |
| `read_component` | Read the full source code of a component |

---

## 💬 Example Prompts

After setup, you can ask your AI assistant:

- *"Search my Composter vault for button components"*
- *"What categories do I have in Composter?"*
- *"List all components in my ui category"*
- *"Read the DataTable component from my ui category"*
- *"Show me the code for my useLocalStorage hook"*

---

## 🔧 Development Mode

For local development with `localhost:3000` backend:

```bash
# Set environment variable
COMPOSTER_DEV=true npx composter-mcp

# Or set custom API URL
COMPOSTER_API_URL=http://localhost:3000/api npx composter-mcp
```

---

## 🐛 Troubleshooting

### "No session found"

You need to login via the CLI first:

```bash
npm install -g composter-cli
composter login
```

### "Session expired"

Your session has expired (30 days). Login again:

```bash
composter login
```

### Tools not appearing in AI assistant

1. Make sure you've restarted your AI assistant after config changes
2. Check the config file path is correct for your OS
3. Verify the MCP server starts: `npx composter-mcp`

### Network errors

- Check your internet connection
- Verify the backend: `https://composter.onrender.com/api/health`
- Try logging in again: `composter login`

---

## 🔐 Security

- Uses JWT authentication (same as CLI)
- Tokens stored locally at `~/.config/composter/session.json`
- All API calls over HTTPS
- Read-only access to your vault

---

## 🔗 Links

| Resource | URL |
|----------|-----|
| 🌐 Web App | [composter.vercel.app](https://composter.vercel.app) |
| 📦 CLI | [npmjs.com/package/composter-cli](https://www.npmjs.com/package/composter-cli) |
| 💻 GitHub | [github.com/binit2-1/Composter](https://github.com/binit2-1/Composter) |

---

## 📄 License

MIT © [binit2-1](https://github.com/binit2-1)
