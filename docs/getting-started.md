# Getting Started with Composter

Welcome to Composter! This guide will help you get started with storing, organizing, and retrieving your React components.

## What is Composter?

Composter is a personal vault for React components that allows you to:
- 🗃️ Store reusable components in organized categories
- ⚡ Access components via CLI, web dashboard, or AI assistants
- 📦 Preview components with live rendering
- 🔌 Integrate with your favorite AI tools (Claude, Cursor, VS Code)

## Quick Start (5 minutes)

### Step 1: Install the CLI

```bash
npm install -g composter-cli
```

Verify installation:
```bash
composter --version
```

### Step 2: Create an Account

Visit [composter.vercel.app](https://composter.vercel.app) and sign up with your email.

### Step 3: Login via CLI

```bash
composter login
```

Enter your credentials when prompted. Your session will be saved for 30 days.

### Step 4: Create Your First Category

```bash
composter mkcat buttons
```

### Step 5: Add a Component

Create a simple React component:

```jsx
// MyButton.jsx
export default function MyButton({ children, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      {children}
    </button>
  );
}
```

Push it to your vault:

```bash
composter push buttons "MyButton" ./MyButton.jsx
```

### Step 6: Retrieve Your Component

List all components in the category:
```bash
composter ls buttons
```

Pull a component to your project:
```bash
composter pull buttons "MyButton" ./components/
```

## What's Next?

- **Browse your components:** Visit the [web dashboard](https://composter.vercel.app/dashboard)
- **Connect AI assistants:** Set up [MCP integration](mcp-integration.md)
- **Learn all CLI commands:** Check the [CLI Reference](cli-reference.md)
- **Self-host Composter:** Follow the [Self-Hosting Guide](self-hosting.md)

## Common Use Cases

### 1. Building a Personal Component Library

```bash
# Organize by component type
composter mkcat buttons
composter mkcat forms
composter mkcat cards
composter mkcat layouts

# Add components
composter push buttons "PrimaryButton" ./src/components/Button.jsx
composter push forms "LoginForm" ./src/forms/Login.jsx
```

### 2. Sharing Components Across Projects

```bash
# In Project A - Save component
composter push ui "Modal" ./components/Modal.jsx

# In Project B - Retrieve component
composter pull ui "Modal" ./src/components/
```

### 3. Using with AI Assistants

After setting up [MCP integration](mcp-integration.md):

1. Open Claude/Cursor/VS Code
2. Ask: "Show me my Button components from Composter"
3. AI will list and help you use your components

## Understanding the Workflow

```
┌─────────────┐
│   Create    │
│  Component  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Push     │
│  to Vault   │  ← composter push
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Browse    │
│  Dashboard  │  ← Web UI or CLI
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Pull     │
│  to Project │  ← composter pull
└─────────────┘
```

## Tips for Success

1. **Use Descriptive Names:** Name components clearly (e.g., "PrimaryButton" not "btn1")
2. **Organize by Purpose:** Create categories that match your workflow
3. **Include Dependencies:** Document any required packages in your component comments
4. **Test Before Pushing:** Ensure components work before saving
5. **Regular Backups:** Export important components locally

## Getting Help

- **Documentation:** Browse the [docs folder](/)
- **Troubleshooting:** See [troubleshooting.md](troubleshooting.md)
- **Issues:** Report bugs on [GitHub](https://github.com/binit2-1/Composter/issues)
- **Discussions:** Ask questions in [GitHub Discussions](https://github.com/binit2-1/Composter/discussions)

## Next Steps

Now that you're set up, explore:
- [CLI Reference](cli-reference.md) - Complete command documentation
- [API Reference](api-reference.md) - Build custom integrations
- [MCP Integration](mcp-integration.md) - Connect AI assistants
- [Self-Hosting](self-hosting.md) - Run your own instance

Happy composting! 🌱

## Developer / Local Development

If you're developing Composter itself (CLI, API, frontend, or MCP), here are quick commands and tips.

- **Run the API (dev):**

```bash
cd api
npm install
# start with nodemon or the project's dev script
npm run dev
```

- **Run the frontend (dev):**

```bash
cd frontend
npm install
npm run dev
```

- **Run the CLI locally:**

```bash
cd cli
npm install
# run the CLI commands via npx during development
npx node ./bin/composter.js login
```

- **Run MCP server (dev):**

```bash
cd packages/mcp
npm install
npm start
# or run the inspector (see MCP docs) to debug MCP interactions
```

- **Inspector (MCP debugging):** The project includes the Model Context Protocol inspector. From `packages/mcp` you can run:

```bash
cd packages/mcp
npm run server:inspect
# which runs: npx @modelcontextprotocol/inspector node src/server.js
```

These will help you iterate quickly while developing integrations and QA-ing the MCP/CLI flows.
