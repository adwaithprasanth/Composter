# CLI Reference

Complete reference for the Composter CLI tool.

## Installation

```bash
# Global installation (recommended)
npm install -g composter-cli

# Or use npx without installation
npx composter-cli <command>
```

## Authentication Commands

### `composter login`

Login to your Composter account.

**Usage:**
```bash
composter login
```

**Interactive prompts:**
- Email address
- Password

**Session:**
- Session stored in `~/.config/composter/session.json`
- Valid for 30 days
- Automatically refreshed on use

**Example:**
```bash
$ composter login
? Email: user@example.com
? Password: ********
✓ Login successful!
```

### `composter logout`

Logout and clear your session.

**Usage:**
```bash
composter logout
```

**Example:**
```bash
$ composter logout
✓ Logged out successfully
```

## Category Commands

### `composter mkcat <name>`

Create a new category to organize components.

**Usage:**
```bash
composter mkcat <category-name>
```

**Arguments:**
- `category-name` - Name of the category (alphanumeric, hyphens, underscores)

**Example:**
```bash
$ composter mkcat buttons
✓ Category 'buttons' created successfully
```

### `composter rmcat <name>`

Delete a category and all its components.

**Usage:**
```bash
composter rmcat <category-name>
```

**Arguments:**
- `category-name` - Name of the category to delete

**Warning:** This permanently deletes all components in the category!

**Example:**
```bash
$ composter rmcat old-components
? Are you sure you want to delete 'old-components'? (y/N) y
✓ Category 'old-components' deleted
```

### `composter lscat`

List all your categories.

**Usage:**
```bash
composter lscat
```

**Alias:**
```bash
composter ls
```

**Example:**
```bash
$ composter lscat
Categories:
  • buttons (5 components)
  • forms (3 components)
  • layouts (2 components)
```

## Component Commands

### `composter push <category> <title> <file>`

Add or update a component in your vault.

**Usage:**
```bash
composter push <category> <title> <file>
```

**Arguments:**
- `category` - Target category name
- `title` - Component name (must be unique within category)
- `file` - Path to component file (`.jsx`, `.tsx`, `.js`)

**Options:**
- `--description <text>` - Component description
- `--tags <tag1,tag2>` - Comma-separated tags

**Example:**
```bash
$ composter push buttons "PrimaryButton" ./src/components/Button.jsx
✓ Component 'PrimaryButton' pushed to 'buttons'

# With description and tags
$ composter push buttons "PrimaryButton" ./Button.jsx \
  --description "Primary action button" \
  --tags "ui,button,primary"
```

### `composter pull <category> <title> <destination>`

Download a component from your vault.

**Usage:**
```bash
composter pull <category> <title> <destination>
```

**Arguments:**
- `category` - Source category name
- `title` - Component name
- `destination` - Local directory path

**Example:**
```bash
$ composter pull buttons "PrimaryButton" ./components/
✓ Component saved to ./components/PrimaryButton.jsx

$ composter pull forms "LoginForm" ./src/forms/
✓ Component saved to ./src/forms/LoginForm.jsx
```

### `composter ls [category]`

List all categories or components in a category.

**Usage:**
```bash
# List all categories
composter ls

# List components in a category
composter ls <category>
```

**Arguments:**
- `category` (optional) - Category to list components from

**Example:**
```bash
# List all categories
$ composter ls
Categories:
  • buttons (5 components)
  • forms (3 components)

# List components in category
$ composter ls buttons
Components in 'buttons':
  • PrimaryButton
  • SecondaryButton
  • IconButton
  • ToggleButton
  • LinkButton
```

### `composter rm <category> <title>`

Remove a component from your vault.

**Usage:**
```bash
composter rm <category> <title>
```

**Arguments:**
- `category` - Category containing the component
- `title` - Component name to delete

**Example:**
```bash
$ composter rm buttons "OldButton"
? Are you sure you want to delete 'OldButton' from 'buttons'? (y/N) y
✓ Component deleted
```

### `composter search <query>`

Search for components across all categories.

**Usage:**
```bash
composter search <query>
```

**Arguments:**
- `query` - Search term (searches titles and descriptions)

**Example:**
```bash
$ composter search modal
Found 3 components:
  • ui/Modal
  • dialogs/ConfirmModal
  • overlays/ImageModal
```

### `composter info <category> <title>`

Show detailed information about a component.

**Usage:**
```bash
composter info <category> <title>
```

**Arguments:**
- `category` - Category containing the component
- `title` - Component name

**Example:**
```bash
$ composter info buttons "PrimaryButton"

PrimaryButton
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Category:    buttons
Created:     2024-12-15
Updated:     2024-12-18
Size:        1.2 KB
Description: Primary action button with hover effects
Tags:        ui, button, primary

Preview URL: https://composter.vercel.app/components/123
```

## Utility Commands

### `composter --version`

Show CLI version.

**Usage:**
```bash
composter --version
# or
composter -v
```

**Example:**
```bash
$ composter --version
composter-cli version 1.0.11
```

### `composter --help`

Show help for all commands.

**Usage:**
```bash
composter --help
# or
composter -h

# Help for specific command
composter <command> --help
```

**Example:**
```bash
$ composter push --help
Usage: composter push <category> <title> <file>

Push a component to your vault

Options:
  --description <text>  Component description
  --tags <tags>         Comma-separated tags
  -h, --help           Show help
```

## Environment Variables

Configure CLI behavior with environment variables:

```bash
# Custom API base URL (for self-hosted instances)
export COMPOSTER_API_URL="https://your-api.com/api"

# Disable color output
export NO_COLOR=1

# Custom session file location
export COMPOSTER_SESSION_PATH="~/.composter/session.json"
```

## Configuration File

Create `~/.composterrc` for persistent configuration:

```json
{
  "apiUrl": "https://composter.onrender.com/api",
  "defaultCategory": "components",
  "autoUpdate": true,
  "colorOutput": true
}
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | General error |
| 2 | Authentication error |
| 3 | Network error |
| 4 | File not found |
| 5 | Invalid arguments |

## Examples

### Complete Workflow

```bash
# 1. Login
composter login

# 2. Create categories
composter mkcat ui
composter mkcat hooks
composter mkcat utils

# 3. Push components
composter push ui "Button" ./src/components/Button.jsx
composter push ui "Modal" ./src/components/Modal.jsx
composter push hooks "useFetch" ./src/hooks/useFetch.js

# 4. List everything
composter ls

# 5. Search for specific component
composter search modal

# 6. Pull component to new project
composter pull ui "Button" ./components/

# 7. Clean up old components
composter rm ui "OldButton"
```

## Developer / Debugging (CLI)

When working on the `composter` CLI itself, use the local package to iterate and debug quickly.

- Install and run locally:

```bash
cd cli
npm install
# Run a subcommand directly (use npx or node)
npx node ./bin/composter.js ls
```

- Session file location (useful when testing auth):

```
~/.config/composter/session.json
```

- Run CLI against a local API instance by overriding the API URL:

```bash
export COMPOSTER_API_URL="http://localhost:3000/api"
npx node ./bin/composter.js ls
```

- Tips:
  - Use `DEBUG` or `NODE_DEBUG` env vars in the CLI package if you add logging.
  - When updating the CLI code, re-run the `npx node ./bin/composter.js` command to pick up changes.

### Batch Operations

```bash
# Push multiple components
for file in ./src/components/*.jsx; do
  name=$(basename "$file" .jsx)
  composter push ui "$name" "$file"
done

# Pull all components from a category
composter ls buttons | while read component; do
  composter pull buttons "$component" ./components/buttons/
done
```

### Working with MCP

After installing MCP integration, your AI assistant can use these commands:

```
You: "List my button components"
AI: [Uses composter ls buttons internally]

You: "Show me the Modal component code"
AI: [Uses composter pull to fetch and display code]
```

## Troubleshooting

### "Not authenticated"
Run `composter login` to authenticate.

### "Category not found"
Use `composter lscat` to see available categories.

### "Component already exists"
Use `composter rm` to delete the old version first, or the push will update it.

### "Network error"
Check your internet connection and API status.

For more issues, see [troubleshooting.md](troubleshooting.md).

## See Also

- [Getting Started Guide](getting-started.md)
- [API Reference](api-reference.md)
- [MCP Integration](mcp-integration.md)
- [Self-Hosting Guide](self-hosting.md)
