/**
 * Documentation Content Configuration
 * 
 * This file contains all documentation content in an easily editable format.
 * To add new sections:
 * 1. Add a new entry to the appropriate category in `sidebarNav`
 * 2. Add corresponding content in `docsContent` with matching id
 * 
 * Content types:
 * - text: Simple paragraph text
 * - code: Code block with syntax highlighting
 * - list: Bullet or numbered list
 * - cards: Grid of info cards
 * - steps: Numbered steps with optional code
 */

// Sidebar navigation structure
export const sidebarNav = [
  {
    title: "Get Started",
    items: [
      { id: "introduction", label: "Introduction" },
      { id: "installation", label: "Installation" },
      { id: "quick-start", label: "Quick Start" },
    ],
  },
  {
    title: "CLI",
    items: [
      { id: "cli-login", label: "Login" },
      { id: "cli-push", label: "Push Components" },
      { id: "cli-pull", label: "Pull Components" },
      { id: "cli-list", label: "List Components" },
      { id: "cli-update", label: "Update Components" },
    ],
  },
  {
    title: "Dashboard",
    items: [
      { id: "dashboard-overview", label: "Overview" },
      { id: "dashboard-upload", label: "Upload Components" },
      { id: "dashboard-manage", label: "Manage Components" },
    ],
  },
];

// Documentation content - easily editable
export const docsContent = {
  // ============================================
  // GET STARTED SECTION
  // ============================================
  
  introduction: {
    title: "Introduction",
    description: `Composter is your personal vault for storing and retrieving reusable React components. 
Save components once, then pull them into any project using the CLI or web dashboard.`,
    cards: [
      {
        title: "CLI Tool",
        description: "Push, pull, and manage components directly from your terminal with simple commands.",
      },
      {
        title: "Web Dashboard",
        description: "Visual interface to browse, upload, and organize your component library.",
      },
    ],
  },

  installation: {
    title: "Installation",
    description: "Using components is very straightforward, anyone can do it.",
    methodDescription: "You can keep it simple and copy code directly from the dashboard, or you can use CLI commands to install components into your project.",
    methodNote: "Click the cards below to change your preferred method.",
    steps: {
      cli: [
        {
          title: "Install the CLI",
          description: "Install the Composter CLI globally to get started.",
          code: "npm install -g composter-cli",
        },
        {
          title: "Login to your account",
          description: "Authenticate with your Composter account.",
          code: "composter login",
        },
        {
          title: "Pull components",
          description: "Pull any component from your vault into your current project.",
          code: "composter pull buttons PrimaryButton",
        },
      ],
      manual: [
        {
          title: "Browse components",
          description: "Navigate to the dashboard and find a component you want to use.",
        },
        {
          title: "Copy the code",
          description: "Click on the component to view its code, then copy it to your project.",
        },
        {
          title: "Install dependencies",
          description: "Check if the component has any dependencies and install them.",
        },
      ],
    },
  },

  "quick-start": {
    title: "Quick Start",
    description: "Get up and running with Composter in under 2 minutes.",
    steps: [
      {
        title: "Create a category",
        description: "Categories help you organize related components together.",
        code: "composter mkcat buttons",
      },
      {
        title: "Push your first component",
        description: "Upload a component file to your vault.",
        code: "composter push buttons ./src/components/Button.jsx",
      },
      {
        title: "Pull into another project",
        description: "Download the component into your current working directory.",
        code: "composter pull buttons Button",
      },
    ],
  },

  // ============================================
  // CLI SECTION
  // ============================================

  "cli-login": {
    title: "Login",
    description: "Authenticate with your Composter account to access your component vault.",
    code: "composter login",
    note: "You'll be prompted to enter your email and password. Your session token is stored locally for future commands.",
  },

  "cli-push": {
    title: "Push Components",
    description: "Upload components to your vault for later use.",
    code: `composter push <category> <file-path>

# Example
composter push buttons ./src/Button.jsx
composter push cards ./src/ProfileCard.tsx`,
    args: [
      { name: "category", description: "The category to store the component in" },
      { name: "file-path", description: "Path to your component file" },
    ],
  },

  "cli-pull": {
    title: "Pull Components",
    description: "Download components from your vault into your project.",
    code: `composter pull <category> <component-name>

# Example
composter pull buttons PrimaryButton`,
    note: "Components are downloaded to a `composter/` folder in your current directory.",
  },

  "cli-list": {
    title: "List Components",
    description: "View all components in a category.",
    code: `composter list <category>

# Example
composter list buttons`,
  },

  "cli-update": {
    title: "Update Components",
    description: "Replace an existing component with a new version.",
    code: `composter update <category> <file-path>

# Example
composter update buttons ./src/Button.jsx`,
  },

  // ============================================
  // DASHBOARD SECTION
  // ============================================

  "dashboard-overview": {
    title: "Dashboard Overview",
    description: "The web dashboard provides a visual interface to manage your component library without using the command line.",
    features: [
      { title: "Browse Components", description: "View all your stored components organized by category." },
      { title: "Live Preview", description: "See components rendered in real-time with Sandpack." },
      { title: "Code View", description: "Inspect and copy component source code directly." },
      { title: "Search", description: "Quickly find components across all categories." },
    ],
  },

  "dashboard-upload": {
    title: "Upload Components",
    description: "Add new components to your vault through the web interface.",
    steps: [
      "Navigate to your dashboard and select a category",
      "Click the \"Upload Component\" button",
      "Paste your component code or select a file",
      "Add any npm dependencies if required",
      "Click \"Upload\" to save to your vault",
    ],
  },

  "dashboard-manage": {
    title: "Manage Components",
    description: "Edit, update, or delete components from your vault.",
    actions: [
      {
        title: "Update a Component",
        description: "Select a component → Click \"Edit\" → Upload the new version or modify the code directly.",
      },
      {
        title: "Delete a Component",
        description: "Select a component → Click \"Delete\" → Confirm the action. This cannot be undone.",
      },
      {
        title: "Manage Categories",
        description: "Create, rename, or delete categories from the sidebar. Deleting a category removes all components inside.",
      },
    ],
  },
};

// CTA section at the bottom
export const ctaSection = {
  title: "Ready to get started?",
  description: "Create an account and start building your personal component library.",
  buttons: [
    { label: "Create Account", href: "/signup", variant: "primary" },
    { label: "Go to Dashboard", href: "/app", variant: "outline" },
  ],
};

