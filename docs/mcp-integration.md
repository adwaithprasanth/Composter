# MCP Integration Guide

Connect Composter with AI assistants using the Model Context Protocol (MCP).

## What is MCP?

Model Context Protocol is a standard that allows AI assistants to interact with external tools and services. With MCP, Claude, Cursor, GitHub Copilot, and other AI tools can:

- List your component categories
- Search and retrieve components
- Read component source code
- Help you integrate components into your projects

## Supported AI Tools

| Tool | Status | Auto-Setup |
|------|--------|-----------|
| Claude Desktop | ✅ Supported | ✅ Yes |
| Cursor | ✅ Supported | ✅ Yes |
| GitHub Copilot (VS Code) | ✅ Supported | ✅ Yes |
| Windsurf | ✅ Supported | ✅ Yes |

## Quick Setup (Recommended)

### Step 1: Login First

MCP uses your CLI session for authentication, so login first:

```bash
composter login
```

### Step 2: Auto-Configure

Run the init command for your AI tool:

```bash
# For Claude Desktop
npx composter-mcp init claude

# For Cursor
npx composter-mcp init cursor

# For VS Code (GitHub Copilot)
npx composter-mcp init vscode

# For Windsurf
npx composter-mcp init windsurf
```

### Step 3: Restart Your AI Assistant

Close and reopen your AI tool to load the new MCP configuration.

### Step 4: Test It

Ask your AI assistant:
```
"List my Composter categories"
```

The AI should respond with your component categories!

## Manual Setup

If auto-configuration doesn't work, follow these manual steps:

### Claude Desktop

1. **Find the config file:**
   - **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Linux:** `~/.config/claude/claude_desktop_config.json`
   - **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

2. **Add Composter MCP:**
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

3. **Restart Claude Desktop**

### Cursor

1. **Create MCP config in your project:**
   ```bash
   mkdir -p .cursor
   touch .cursor/mcp.json
   ```

2. **Add configuration:**
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

3. **Restart Cursor**

### VS Code (GitHub Copilot)

1. **Create MCP config in your project:**
   ```bash
   mkdir -p .vscode
   touch .vscode/mcp.json
   ```

2. **Add configuration:**
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

3. **Install GitHub Copilot MCP extension** (if not already installed)

4. **Reload VS Code window** (Cmd/Ctrl + Shift + P → "Reload Window")

### Windsurf

1. **Find the config file:**
   ```bash
   ~/.codeium/windsurf/mcp_config.json
   ```

2. **Add Composter MCP:**
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

3. **Restart Windsurf**

## Available MCP Tools

Once configured, your AI assistant can use these tools:

### `list_categories`

Lists all your component categories.

**AI Usage Example:**
```
You: "What component categories do I have?"
AI: [Uses list_categories tool]
    "You have 4 categories: buttons, forms, layouts, and hooks."
```

### `list_components`

Lists all components in a specific category.

**AI Usage Example:**
```
You: "Show me my button components"
AI: [Uses list_components with category="buttons"]
    "You have 5 button components: PrimaryButton, SecondaryButton, IconButton, ToggleButton, and LinkButton."
```

### `read_component`

Retrieves the full source code of a component.

**AI Usage Example:**
```
You: "Show me the PrimaryButton code"
AI: [Uses read_component with category="buttons", title="PrimaryButton"]
    "Here's the PrimaryButton component: [displays code]"
```

### `search_components`

Searches for components by name across all categories.

**AI Usage Example:**
```
You: "Find all my modal components"
AI: [Uses search_components with query="modal"]
    "I found 3 modal components: Modal in ui, ConfirmModal in dialogs, and ImageModal in overlays."
```

### `ask_composter` (Natural Language)

A flexible tool that interprets natural language requests.

**AI Usage Example:**
```
You: "Get me the login form from my vault"
AI: [Uses ask_composter to find and retrieve LoginForm]
    "I found your LoginForm component. Would you like me to add it to your current project?"
```

## Usage Examples

### Example 1: Adding a Component to Your Project

```
You: "I need a button component for my app"

AI: "Let me check your Composter vault for button components."
    [Uses list_components with category="buttons"]
    
    "You have these buttons available:
     - PrimaryButton
     - SecondaryButton
     - IconButton
     
     Which one would you like to use?"

You: "The PrimaryButton"

AI: [Uses read_component to get PrimaryButton code]
    "I'll add the PrimaryButton to your project. Here's the code:
    
    ```jsx
    export default function PrimaryButton({ children, onClick }) {
      return (
        <button 
          onClick={onClick}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {children}
        </button>
      );
    }
    ```
    
    I've created ./components/PrimaryButton.jsx for you."
```

### Example 2: Exploring Your Component Library

```
You: "What components do I have?"

AI: [Uses list_categories]
    "You have components organized in these categories:
     - buttons (5 components)
     - forms (3 components)
     - layouts (2 components)
     - hooks (4 components)
     
     Would you like to see the components in any specific category?"

You: "Show me the forms"

AI: [Uses list_components with category="forms"]
    "Your forms category contains:
     - LoginForm
     - SignupForm
     - ContactForm"
```

### Example 3: Finding a Specific Component

```
You: "Do I have a modal component?"

AI: [Uses search_components with query="modal"]
    "Yes! I found 2 modal components:
     - Modal (in ui category)
     - ConfirmModal (in dialogs category)
     
     Would you like to see the code for either of these?"
```

## Troubleshooting

### "Composter MCP server not found"

**Solution:**
1. Make sure you're logged in: `composter login`
2. Install the MCP package: `npm install -g composter-mcp`
3. Restart your AI assistant

### "Authentication failed"

**Solution:**
1. Re-login: `composter login`
2. Check session file exists: `~/.config/composter/session.json`
3. Verify session hasn't expired (30-day limit)

### "No categories found"

**Solution:**
1. Create some categories: `composter mkcat buttons`
2. Add components: `composter push buttons "MyButton" ./Button.jsx`
3. Try the MCP command again

### AI assistant doesn't recognize Composter

**Solution:**
1. Verify MCP config file exists in the correct location
2. Check JSON syntax is valid (use a JSON validator)
3. Completely restart your AI assistant (quit and reopen)
4. Check MCP server logs (see below)

### Viewing MCP Logs

**Claude Desktop:**
```bash
# macOS/Linux
tail -f ~/Library/Logs/Claude/mcp*.log

# Windows
type %APPDATA%\Claude\Logs\mcp*.log
```

**Cursor:**
```bash
# Check Cursor's developer console
Cmd/Ctrl + Shift + P → "Toggle Developer Tools"
# Look in the Console tab
```

**VS Code:**
```bash
# Open Output panel
Cmd/Ctrl + Shift + U
# Select "GitHub Copilot MCP" from dropdown
```

## Advanced Configuration

### Using Self-Hosted Instance

If you're running your own Composter instance:

```json
{
  "mcpServers": {
    "composter": {
      "command": "npx",
      "args": ["composter-mcp"],
      "env": {
        "COMPOSTER_API_URL": "https://your-api.com/api"
      }
    }
  }
}
```

### Custom Session Path

If your session file is in a custom location:

```json
{
  "mcpServers": {
    "composter": {
      "command": "npx",
      "args": ["composter-mcp"],
      "env": {
        "COMPOSTER_SESSION_PATH": "/custom/path/session.json"
      }
    }
  }
}
```

### Debugging Mode

Enable verbose logging:

```json
{
  "mcpServers": {
    "composter": {
      "command": "npx",
      "args": ["composter-mcp"],
      "env": {
        "DEBUG": "composter:*"
      }
    }
  }
}
```

## Best Practices

1. **Keep CLI Updated:** Run `npm update -g composter-cli composter-mcp` regularly
2. **Organize Components:** Use clear category names for easier AI discovery
3. **Descriptive Names:** Name components clearly (e.g., "PrimaryButton" not "btn1")
4. **Test Manually First:** Verify components work via CLI before using MCP
5. **Restart After Changes:** Restart your AI assistant after modifying MCP config

## Security Considerations

- **Session Security:** MCP uses your CLI session token, keep it secure
- **Token Expiry:** Sessions expire after 30 days, re-login when needed
- **Local Only:** MCP runs locally on your machine, no additional cloud access
- **Code Privacy:** Your component code is only accessible to you via your session

## Updating MCP

To update to the latest MCP version:

```bash
npm update -g composter-mcp
```

Then restart your AI assistant.

## Uninstalling MCP

To remove Composter MCP integration:

1. **Remove from config file:**
   Delete the `composter` entry from your MCP config file

2. **Uninstall npm package:**
   ```bash
   npm uninstall -g composter-mcp
   ```

3. **Restart your AI assistant**

## See Also

- [Getting Started Guide](getting-started.md)
- [CLI Reference](cli-reference.md)
- [API Reference](api-reference.md)
- [Troubleshooting](troubleshooting.md)

## Feedback

MCP integration feedback? [Open an issue](https://github.com/binit2-1/Composter/issues) or [start a discussion](https://github.com/binit2-1/Composter/discussions)!
