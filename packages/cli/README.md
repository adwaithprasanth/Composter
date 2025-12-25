# 🌱 Composter CLI

> Your personal vault for storing, syncing, and retrieving reusable React components from the command line.

[![npm version](https://img.shields.io/npm/v/composter-cli.svg)](https://www.npmjs.com/package/composter-cli)
[![license](https://img.shields.io/npm/l/composter-cli.svg)](https://github.com/binit2-1/Composter/blob/main/LICENSE)
[![node](https://img.shields.io/node/v/composter-cli.svg)](https://nodejs.org)

**Composter** is like your personal shadcn/ui — but for YOUR components. Push components from any project, pull them into new ones, and let AI assistants access your vault via MCP.

---

## 🎯 Why Composter?

Ever built an amazing component and wanted to reuse it in another project? Tired of copy-pasting files and forgetting dependencies? Composter solves this:

- **No more copy-paste chaos** — Push once, pull anywhere
- **Dependencies tracked automatically** — Never forget to install packages again
- **Smart bundling** — Relative imports are bundled, npm packages are tracked
- **AI-ready** — Let Claude, Cursor, or Copilot access your vault via MCP
- **Private by default** — Your components, your vault, your control

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📤 **Push** | Upload components with all local dependencies auto-bundled |
| 📥 **Pull** | Download components with original folder structure preserved |
| 📁 **Categories** | Organize components into logical groups (UI, Hooks, Utils) |
| 🔗 **Smart Bundling** | Automatically crawls `./` and `@/` imports |
| 📦 **Dependency Detection** | Reads your `package.json` and tracks npm packages |
| ⚠️ **Missing Dep Alerts** | Tells you exactly what to `npm install` after pulling |
| 🤖 **MCP Integration** | Works with AI assistants via Model Context Protocol |

---

## 📦 Installation

### Global Install (Recommended)

```bash
npm install -g composter-cli
```

### Using npx

```bash
npx composter-cli login
```

### Verify Installation

```bash
composter --version
```

---

## 🚀 Quick Start

### 1. Create an Account

Visit **[composter.vercel.app](https://composter.vercel.app)** and sign up.

### 2. Login via CLI

```bash
composter login
```

```
=== Composter Login ===
? Email: you@example.com
? Password: ********

Logged in successfully!
Session expires: 2025-01-09T12:00:00.000Z
```

### 3. Create a Category

```bash
composter mkcat ui
```

### 4. Push Your First Component

```bash
composter push ui "Fancy Button" ./src/components/FancyButton.tsx
```

```
Scanning FancyButton.tsx and its dependencies...
📦 Bundled 3 file(s) and detected 2 external package(s).
✅ Success! Component 'Fancy Button' pushed to 'ui'.
```

### 5. Pull It In Another Project

```bash
composter pull ui "Fancy Button" ./src/components/
```

```
⏳ Fetching 'Fancy Button' from 'ui'...
📦 Unpacking 3 file(s) into: /Users/you/new-project/src/components
   + FancyButton.tsx
   + FancyButton.module.css
   + useButtonAnimation.ts

⚠️  Missing Dependencies (Run this to fix):
   npm install framer-motion clsx

✅ Component 'Fancy Button' pulled successfully!
```

---

## 📖 Commands Reference

### `composter login`

Authenticate with your Composter account.

```bash
composter login
```

**What happens:**
- Prompts for email and password
- Creates a JWT session token
- Stores session at `~/.config/composter/session.json`
- Session lasts 30 days

---

### `composter mkcat <category-name>`

Create a new category to organize your components.

```bash
composter mkcat hooks
```

**Output:**
```
Category 'hooks' created successfully!
ID: clx1234567890
```

**Rules:**
| Rule | Example |
|------|---------|
| No spaces | ❌ `my buttons` → ✅ `buttons` |
| Max 10 characters | ❌ `superlongname` → ✅ `utils` |
| Unique per user | Each category name must be unique |

---

### `composter ls`

List all your categories.

```bash
composter ls
```

**Output:**
```
ui          hooks       utils       layouts     forms
```

---

### `composter push <category> <title> <file-path>`

Push a component to your vault.

```bash
composter push ui "Data Table" ./src/components/DataTable/index.tsx
```

**Arguments:**

| Argument | Description | Example |
|----------|-------------|---------|
| `category` | Target category name | `ui` |
| `title` | Human-readable component name | `"Data Table"` |
| `file-path` | Entry file path | `./src/components/DataTable.tsx` |

**What gets bundled:**
```
Your Entry File
│
├── ./relative/imports      → ✅ Bundled into package
├── @/alias/imports         → ✅ Bundled (assumes @/ = src/)
├── ./styles.css            → ✅ Bundled
│
└── External packages       → 📦 Tracked as dependencies
    ├── react               
    ├── framer-motion       
    └── @tanstack/react-table
```

**Example Output:**
```
Scanning DataTable.tsx and its dependencies...
📦 Bundled 5 file(s) and detected 4 external package(s).
✅ Success! Component 'Data Table' pushed to 'ui'.
```

---

### `composter pull <category> <title> <target-directory>`

Pull a component from your vault.

```bash
composter pull ui "Data Table" ./src/components/
```

**Arguments:**

| Argument | Description | Example |
|----------|-------------|---------|
| `category` | Source category name | `ui` |
| `title` | Component name to pull | `"Data Table"` |
| `target-directory` | Where to save files | `./src/components/` |

**What happens:**
1. Fetches component bundle from your vault
2. Recreates original folder structure
3. Writes all files to target directory
4. Checks your `package.json` for missing dependencies
5. Suggests `npm install` command if needed

**Example Output:**
```
⏳ Fetching 'Data Table' from 'ui'...
📦 Unpacking 5 file(s) into: /Users/you/project/src/components
   + DataTable/index.tsx
   + DataTable/DataTableHeader.tsx
   + DataTable/DataTableRow.tsx
   + DataTable/DataTablePagination.tsx
   + DataTable/data-table.css

⚠️  Missing Dependencies (Run this to fix):
   npm install @tanstack/react-table lucide-react

✅ Component 'Data Table' pulled successfully!
```

---

## 🔧 How Smart Bundling Works

When you push a component, the CLI performs intelligent dependency crawling:

### Import Resolution

```tsx
// Entry: src/components/Button.tsx

import { cn } from "@/lib/utils"           // ✅ Bundled (alias import)
import { useToggle } from "./hooks/toggle" // ✅ Bundled (relative import)
import "./button.css"                       // ✅ Bundled (CSS import)
import { motion } from "framer-motion"      // 📦 Tracked as npm dependency
import React from "react"                   // 📦 Tracked as npm dependency
```

### Alias Support

The `@/` alias is automatically resolved to your `src/` directory:

```
@/components/Button  →  src/components/Button
@/lib/utils          →  src/lib/utils
@/hooks/useAuth      →  src/hooks/useAuth
```

### File Extensions

The crawler automatically resolves these extensions:

```
import { Button } from "./Button"
                           ↓
Tries: Button.tsx → Button.ts → Button.jsx → Button.js → Button/index.tsx
```

### Package Version Detection

npm dependencies are tracked with versions from your `package.json`:

```json
// Your package.json
{
  "dependencies": {
    "framer-motion": "^10.16.0",
    "clsx": "^2.0.0"
  }
}

// Stored with component
{
  "framer-motion": "^10.16.0",
  "clsx": "^2.0.0"
}
```

---

## 🤖 AI Integration (MCP)

Let AI assistants like **Claude**, **Cursor**, and **GitHub Copilot** access your vault via MCP.

### One-Command Setup

Login once, then auto-configure your IDE/assistant:

```bash
# Login (if you haven't)
composter login

# Auto-configure (pick one)
npx composter-mcp init claude   # Claude Desktop
npx composter-mcp init cursor   # Cursor
npx composter-mcp init vscode   # VS Code (Copilot)
npx composter-mcp init windsurf # Windsurf
```

Then restart your AI assistant — done!

#### Manual config (if you prefer)
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

Config file locations:
- Cursor: `.cursor/mcp.json` (project root)
- VS Code: `.vscode/mcp.json` (project root)
- Claude Desktop (Linux): `~/.config/claude/claude_desktop_config.json`
- Claude Desktop (macOS): `~/Library/Application Support/Claude/claude_desktop_config.json`
- Claude Desktop (Windows): `%APPDATA%\\Claude\\claude_desktop_config.json`
- Windsurf: `~/.codeium/windsurf/mcp_config.json`

### Available AI Tools

| Tool | Description |
|------|-------------|
| `search_components` | Search your vault by name or category |
| `list_categories` | List all your categories |
| `list_components` | List components in a category |
| `read_component` | Read full source code of a component |

### Example Prompts

- *"Search my Composter vault for button components"*
- *"What categories do I have in Composter?"*
- *"Read the DataTable component from my ui category"*

📖 [Full MCP Documentation](https://www.npmjs.com/package/composter-mcp)

---

## 📂 File Locations

| File | Location | Purpose |
|------|----------|---------|
| Session | `~/.config/composter/session.json` | JWT auth token |
| Config Dir | `~/.config/composter/` | All CLI data |

### Session File Structure

```json
{
  "jwt": "eyJhbGciOiJSUzI1NiIs...",
  "cookies": "session_token=...",
  "createdAt": "2024-12-10T10:00:00.000Z",
  "expiresAt": "2025-01-09T10:00:00.000Z"
}
```

---

## 🐛 Troubleshooting

### "You must be logged in"

Your session doesn't exist or has expired.

```bash
composter login
```

### "Session expired"

Sessions last 30 days. Re-authenticate:

```bash
composter login
```

### "Invalid category name"

Category names have strict rules:

```bash
# ❌ These will fail
composter mkcat "My Components"    # No spaces
composter mkcat verylongcatname    # Max 10 chars

# ✅ These work
composter mkcat ui
composter mkcat hooks
composter mkcat utils
```

### "File not found" when pushing

Check your file path:

```bash
# Make sure you're in the right directory
pwd

# Use relative path from current directory
composter push ui "Button" ./src/components/Button.tsx

# Or use absolute path
composter push ui "Button" /Users/me/project/src/components/Button.tsx
```

### "Component not found" when pulling

- Check the exact component title (case-sensitive)
- Verify the category name
- List your components on the web dashboard

### Missing dependencies after pull

The CLI tells you what's missing. Just run:

```bash
npm install package1 package2 package3
```

### Network errors

- Check your internet connection
- Verify the backend is accessible: `https://composter.onrender.com/api/health`
- Try logging in again

---

## 🌐 Web Dashboard

Manage your components visually at **[composter.vercel.app](https://composter.vercel.app)**

- 📋 Browse all components
- 👁️ Live code preview with Sandpack
- ✏️ Edit component metadata
- 📊 View dependency graphs
- 📋 Copy code snippets
- 🗑️ Delete components

---

## 🔒 Security

| Feature | Description |
|---------|-------------|
| 🔐 JWT Auth | Secure token-based authentication |
| 🏠 Local Storage | Tokens stored locally, never shared |
| 🔒 User Isolation | Each vault is completely private |
| 🌐 HTTPS | All API traffic encrypted |
| ⏰ Expiring Sessions | 30-day token lifetime |

---

## 📋 Examples

### Push a Shadcn-style Component

```bash
# Push a button with all its dependencies
composter push ui "Shadcn Button" ./src/components/ui/button.tsx
```

### Push a Custom Hook

```bash
composter push hooks "useLocalStorage" ./src/hooks/useLocalStorage.ts
```

### Push a Full Feature

```bash
# Push a data table that imports multiple files
composter push features "User Table" ./src/features/users/UserTable.tsx
```

### Pull Into a New Project

```bash
# Create components folder if needed
mkdir -p src/components

# Pull your button
composter pull ui "Shadcn Button" ./src/components/ui/

# Install any missing deps
npm install
```

---

## 🔗 Links

| Resource | URL |
|----------|-----|
| 🌐 Web App | [composter.vercel.app](https://composter.vercel.app) |
| 📦 npm | [npmjs.com/package/composter-cli](https://www.npmjs.com/package/composter-cli) |
| 💻 GitHub | [github.com/binit2-1/Composter](https://github.com/binit2-1/Composter) |
| 🐛 Issues | [Report a bug](https://github.com/binit2-1/Composter/issues) |
| 🤖 MCP Docs | [MCP Setup Guide](https://github.com/binit2-1/Composter/tree/main/mcp) |

---

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](https://github.com/binit2-1/Composter/blob/main/CONTRIBUTING.md)

---

## 📄 License

MIT © [binit2-1](https://github.com/binit2-1)

---

<p align="center">
  <b>Built with ❤️ for developers who hate copy-pasting components</b>
</p>
