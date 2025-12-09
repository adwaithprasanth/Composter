import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getAuthToken, getBaseUrl } from "./auth.js";

// API request helper with JWT auth
async function apiRequest(path, options = {}) {
  const token = getAuthToken();
  const baseUrl = getBaseUrl();

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    ...options.headers,
  };

  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
  });

  return res;
}

// Shared helpers
async function fetchCategories() {
  const res = await apiRequest("/categories", { method: "GET" });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || error.error || res.statusText);
  }
  const data = await res.json();
  return data.categories || [];
}

async function fetchComponentsByCategory(category) {
  const res = await apiRequest(`/components/list-by-category?category=${encodeURIComponent(category)}`, { method: "GET" });
  if (res.status === 404) throw new Error(`Category "${category}" not found.`);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || error.error || res.statusText);
  }
  const data = await res.json();
  return data.components || [];
}

async function fetchComponent(category, title) {
  const res = await apiRequest(
    `/components?category=${encodeURIComponent(category)}&title=${encodeURIComponent(title)}`,
    { method: "GET" }
  );
  if (res.status === 404) throw new Error(`Component "${title}" not found in category "${category}".`);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || error.error || res.statusText);
  }
  const data = await res.json();
  return data.component;
}

async function searchComponents(query) {
  const res = await apiRequest(`/components/search?q=${encodeURIComponent(query)}`, { method: "GET" });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || error.error || res.statusText);
  }
  const data = await res.json();
  return data.components || [];
}

function renderComponent(category, component) {
  if (!component) return "Component not found.";

  let codeOutput = "";
  try {
    const files = JSON.parse(component.code);
    codeOutput = Object.entries(files)
      .map(([path, content]) => `### ${path}\n\`\`\`tsx\n${content}\n\`\`\``)
      .join("\n\n");
  } catch {
    codeOutput = `\`\`\`tsx\n${component.code}\n\`\`\``;
  }

  let depsOutput = "";
  if (component.dependencies && Object.keys(component.dependencies).length > 0) {
    const deps = Object.entries(component.dependencies)
      .map(([pkg, ver]) => `- ${pkg}: ${ver}`)
      .join("\n");
    depsOutput = `\n\n**Dependencies:**\n${deps}`;
  }

  return `# ${component.title}

**Category:** ${category}
**Created:** ${new Date(component.createdAt).toLocaleDateString()}${depsOutput}

## Source Code

${codeOutput}`;
}

export function createMcpServer() {
  const server = new McpServer({
    name: "Composter",
    version: "1.0.0",
  });

  // Tool: Search components
  server.tool(
    "search_components",
    "Search vault components by name or topic. Triggers on queries like 'find button components', 'search cards', 'look up forms'. Returns matches with IDs and categories.",
    {
      query: z.string().describe("Search term for component title or category name"),
    },
    async ({ query }) => {
      try {
        const res = await apiRequest(`/components/search?q=${encodeURIComponent(query)}`, { method: "GET" });

        if (!res.ok) {
          const error = await res.json().catch(() => ({}));
          return {
            content: [{ type: "text", text: `Error searching: ${error.message || error.error || res.statusText}` }],
          };
        }

        const data = await res.json();
        const components = data.components || [];

        if (components.length === 0) {
          return {
            content: [{ type: "text", text: "No components found matching that query." }],
          };
        }

        const formatted = components.map((c) =>
          `- **${c.title}** (Category: ${c.category?.name || "unknown"}) [ID: ${c.id}]`
        ).join("\n");

        return {
          content: [{ type: "text", text: `Found ${components.length} component(s):\n\n${formatted}` }],
        };
      } catch (err) {
        return {
          content: [{ type: "text", text: `Error: ${err.message}` }],
        };
      }
    }
  );

  // Tool: Natural language helper (catch-all)
  server.tool(
    "ask_composter",
    "Ask in plain English to list categories, show components in a category, search components, or read a component (e.g., 'list categories', 'show components in ui', 'read Simple Card from ui', 'find button components').",
    {
      query: z.string().describe("e.g. 'list categories', 'show components in ui', 'read Simple Card from ui', 'find button components'"),
    },
    async ({ query }) => {
      const q = query.trim();
      const qLower = q.toLowerCase();
      const respond = (text) => ({ content: [{ type: "text", text }] });

      try {
        // List categories
        if (/\b(list|show|what)\b.*\bcategories\b/.test(qLower)) {
          const categories = await fetchCategories();
          if (!categories.length) return respond("No categories found. Create one with 'composter mkcat <name>'.");
          const formatted = categories.map((c) => `- ${c.name}`).join("\n");
          return respond(`Your categories:\n\n${formatted}`);
        }

        // List components in a category
        const listCatMatch = qLower.match(/(?:list|show|what).*(?:components|items).*(?:in|for)\s+([a-z0-9_-]+)/);
        if (listCatMatch) {
          const cat = listCatMatch[1];
          const components = await fetchComponentsByCategory(cat);
          if (!components.length) return respond(`No components found in category "${cat}".`);
          const formatted = components
            .map((c) => `- ${c.title} (created: ${new Date(c.createdAt).toLocaleDateString()})`)
            .join("\n");
          return respond(`Components in "${cat}":\n\n${formatted}`);
        }

        // Read component with optional category
        const readMatch = q.match(/(?:read|show|get|open|fetch)\s+(.+?)(?:\s+from\s+([a-z0-9_-]+))?$/i);
        if (readMatch) {
          const titleRaw = readMatch[1].trim();
          const categoryRaw = readMatch[2]?.trim();

          if (!categoryRaw) {
            const hits = await searchComponents(titleRaw);
            if (!hits.length) return respond(`No components found matching "${titleRaw}".`);
            if (hits.length > 1) {
              const list = hits
                .slice(0, 5)
                .map((c) => `- ${c.title} (category: ${c.category?.name || "unknown"})`)
                .join("\n");
              return respond(
                `Found multiple components matching "${titleRaw}". Please specify a category:\n\n${list}${
                  hits.length > 5 ? "\n(and more...)" : ""
                }`
              );
            }
            const hit = hits[0];
            const comp = await fetchComponent(hit.category?.name, hit.title);
            return respond(renderComponent(hit.category?.name, comp));
          }

          const comp = await fetchComponent(categoryRaw, titleRaw);
          return respond(renderComponent(categoryRaw, comp));
        }

        // Fallback: search
        const hits = await searchComponents(q);
        if (!hits.length) return respond("No components found matching that query.");
        const formatted = hits
          .map((c) => `- **${c.title}** (Category: ${c.category?.name || "unknown"}) [ID: ${c.id}]`)
          .join("\n");
        return respond(`Found ${hits.length} component(s):\n\n${formatted}`);
      } catch (err) {
        return respond(`Error: ${err.message}`);
      }
    }
  );

  // Tool: List categories
  server.tool(
    "list_categories",
    "List all categories in the vault. Trigger when user asks 'what categories do I have', 'show my categories', 'list vault categories'.",
    {},
    async () => {
      try {
        const res = await apiRequest("/categories", { method: "GET" });

        if (!res.ok) {
          const error = await res.json().catch(() => ({}));
          return {
            content: [{ type: "text", text: `Error: ${error.message || error.error || res.statusText}` }],
          };
        }

        const data = await res.json();
        const categories = data.categories || [];

        if (categories.length === 0) {
          return {
            content: [{ type: "text", text: "No categories found. Create one with 'composter mkcat <name>'." }],
          };
        }

        const formatted = categories.map((c) => `- ${c.name}`).join("\n");

        return {
          content: [{ type: "text", text: `Your categories:\n\n${formatted}` }],
        };
      } catch (err) {
        return {
          content: [{ type: "text", text: `Error: ${err.message}` }],
        };
      }
    }
  );

  // Tool: List components in category
  server.tool(
    "list_components",
    "List components inside a given category. Trigger on requests like 'show components in ui', 'what's in forms', 'list items in buttons'.",
    {
      category: z.string().describe("The category name to list components from"),
    },
    async ({ category }) => {
      try {
        const res = await apiRequest(`/components/list-by-category?category=${encodeURIComponent(category)}`, { method: "GET" });

        if (res.status === 404) {
          return {
            content: [{ type: "text", text: `Category "${category}" not found.` }],
          };
        }

        if (!res.ok) {
          const error = await res.json().catch(() => ({}));
          return {
            content: [{ type: "text", text: `Error: ${error.message || error.error || res.statusText}` }],
          };
        }

        const data = await res.json();
        const components = data.components || [];

        if (components.length === 0) {
          return {
            content: [{ type: "text", text: `No components found in category "${category}".` }],
          };
        }

        const formatted = components.map((c) =>
          `- **${c.title}** (created: ${new Date(c.createdAt).toLocaleDateString()})`
        ).join("\n");

        return {
          content: [{ type: "text", text: `Components in "${category}":\n\n${formatted}` }],
        };
      } catch (err) {
        return {
          content: [{ type: "text", text: `Error: ${err.message}` }],
        };
      }
    }
  );

  // Tool: Read component
  server.tool(
    "read_component",
    "Read a component's full source. Trigger on 'read/open/show/get <component> from <category>' or similar. Returns code, category, dependencies, and creation date.",
    {
      category: z.string().describe("The category name the component belongs to"),
      title: z.string().describe("The title/name of the component to read"),
    },
    async ({ category, title }) => {
      try {
        const res = await apiRequest(
          `/components?category=${encodeURIComponent(category)}&title=${encodeURIComponent(title)}`,
          { method: "GET" }
        );

        if (res.status === 404) {
          return {
            content: [{ type: "text", text: `Component "${title}" not found in category "${category}".` }],
          };
        }

        if (!res.ok) {
          const error = await res.json().catch(() => ({}));
          return {
            content: [{ type: "text", text: `Error: ${error.message || error.error || res.statusText}` }],
          };
        }

        const data = await res.json();
        const component = data.component;

        if (!component) {
          return {
            content: [{ type: "text", text: `Component "${title}" not found.` }],
          };
        }

        // Parse code - could be JSON (multi-file) or string (single file)
        let codeOutput = "";
        try {
          const files = JSON.parse(component.code);
          codeOutput = Object.entries(files)
            .map(([path, content]) => `### ${path}\n\`\`\`tsx\n${content}\n\`\`\``)
            .join("\n\n");
        } catch {
          codeOutput = `\`\`\`tsx\n${component.code}\n\`\`\``;
        }

        // Format dependencies
        let depsOutput = "";
        if (component.dependencies && Object.keys(component.dependencies).length > 0) {
          const deps = Object.entries(component.dependencies)
            .map(([pkg, ver]) => `- ${pkg}: ${ver}`)
            .join("\n");
          depsOutput = `\n\n**Dependencies:**\n${deps}`;
        }

        const output = `# ${component.title}

**Category:** ${category}
**Created:** ${new Date(component.createdAt).toLocaleDateString()}
${depsOutput}

## Source Code

${codeOutput}`;

        return {
          content: [{ type: "text", text: output }],
        };
      } catch (err) {
        return {
          content: [{ type: "text", text: `Error: ${err.message}` }],
        };
      }
    }
  );

  return server;
}
