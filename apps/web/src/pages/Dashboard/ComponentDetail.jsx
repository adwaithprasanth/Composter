import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Copy, Eye, Code2, FileText, FolderTree, Check, RefreshCw } from "lucide-react";
import { Sandpack } from "@codesandbox/sandpack-react";
import { dracula } from "@codesandbox/sandpack-themes";
import { Button } from "@/components/ui/button";
import CodeBlock from "../../components/ui/CodeBlock.jsx";
import { cn } from "@/lib/utils";
import ComposterLoading from "@/components/ui/ComposterLoading.jsx";

// Copyable code block component
const CopyableCodeBlock = ({ code, label }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {label && <p className="text-xs text-muted-foreground mb-2">{label}</p>}
      <div className="relative group">
        <div className="flex items-center bg-[#0a0a0a] rounded-lg border border-border/20 overflow-hidden">
          <div className="hidden sm:block shrink-0 py-3 pl-4 pr-3 text-right select-none border-r border-border/10">
            <span className="text-xs text-muted-foreground/40 font-mono">1</span>
          </div>
          <pre className="flex-1 py-3 px-4 overflow-x-auto">
            <code className="text-sm font-mono text-zinc-400">{code}</code>
          </pre>
          <button
            onClick={handleCopy}
            className="shrink-0 p-3 text-muted-foreground hover:text-foreground transition-colors"
            title="Copy"
          >
            {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

const ComponentDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("preview");
  const [component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewKey, setPreviewKey] = useState(0);
  const [codeCopied, setCodeCopied] = useState(false);

  useEffect(() => {
    const fetchComponent = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/components/${id}`, {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await response.json();
        setComponent(data.component);
      } catch (error) {
        console.error("Error fetching component:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComponent();
  }, [id]);

  // Parse multi-file structure and dependencies
  const { sandpackFiles, mainFilename, dependencies } = useMemo(() => {
    if (!component) return { sandpackFiles: {}, mainFilename: "", dependencies: {} };

    let files = {};

    try {
      const parsed = JSON.parse(component.code);
      if (typeof parsed === 'object' && parsed !== null) {
        files = parsed;
      } else {
        files = { "/App.js": component.code };
      }
    } catch {
      files = { "/App.js": component.code };
    }

    const normalizedFiles = {};
    let firstFile = "";
    
    Object.keys(files).forEach((filename, index) => {
      const key = filename.startsWith("/") ? filename : `/${filename}`;
      normalizedFiles[key] = typeof files[filename] === 'string' 
        ? files[filename] 
        : files[filename].code || files[filename];
      if (index === 0) firstFile = key;
    });

    const entryImport = firstFile.replace(/\.(tsx|jsx|js)$/, "");
    
    normalizedFiles["/root.js"] = `import React from "react";
import { createRoot } from "react-dom/client";
import * as UserExports from "${entryImport}";

const UserComponent = UserExports.default || 
  Object.values(UserExports).find(exp => typeof exp === 'function') || 
  (() => <div className="text-red-500 p-4">Error: No React component exported.</div>);

const root = createRoot(document.getElementById("root"));
root.render(
  <div className="p-8 flex justify-center min-h-screen items-center bg-[#0a0a0a] text-white">
    <UserComponent />
  </div>
);`;

    normalizedFiles["/public/index.html"] = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`;

    normalizedFiles["/tsconfig.json"] = JSON.stringify({
      compilerOptions: { baseUrl: ".", paths: { "@/*": ["./src/*"] } }
    }, null, 2);

    let deps = {};
    if (component.dependencies) {
      try {
        deps = typeof component.dependencies === 'string' 
          ? JSON.parse(component.dependencies) 
          : component.dependencies;
      } catch (e) {
        console.error("Failed to parse dependencies:", e);
      }
    }

    return { sandpackFiles: normalizedFiles, mainFilename: firstFile, dependencies: deps };
  }, [component]);

  // Generate file tree structure
  const fileTree = useMemo(() => {
    if (!sandpackFiles || Object.keys(sandpackFiles).length === 0) return [];

    const tree = {};
    const visibleFiles = Object.keys(sandpackFiles).filter(
      path => path !== '/root.js' && path !== '/public/index.html' && path !== '/tsconfig.json'
    );

    visibleFiles.forEach(filePath => {
      const parts = filePath.split('/').filter(Boolean);
      let current = tree;

      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          current[part] = { type: 'file', path: filePath };
        } else {
          if (!current[part]) {
            current[part] = { type: 'folder', children: {} };
          }
          current = current[part].children;
        }
      });
    });

    return tree;
  }, [sandpackFiles]);

  const renderFileTree = (tree, parentPath = '') => {
    return Object.entries(tree).map(([name, node]) => {
      if (node.type === 'file') {
        const isSelected = selectedFile === node.path;
        return (
          <button
            key={node.path}
            onClick={() => setSelectedFile(node.path)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors w-full text-left",
              isSelected
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-zinc-800/50"
            )}
          >
            <FileText size={14} />
            <span className="truncate">{name}</span>
          </button>
        );
      } else {
        return (
          <div key={`${parentPath}/${name}`} className="space-y-1">
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground/70">
              <FolderTree size={14} />
              <span>{name}</span>
            </div>
            <div className="ml-3 space-y-1 border-l border-border/20 pl-2">
              {renderFileTree(node.children, `${parentPath}/${name}`)}
            </div>
          </div>
        );
      }
    });
  };

  const handleCopyCode = () => {
    const code = sandpackFiles[selectedFile || mainFilename];
    if (code) {
      navigator.clipboard.writeText(code);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ComposterLoading size={48} className="mb-4" />
        <p className="text-muted-foreground">Loading component...</p>
      </div>
    );
  }

  if (!component) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-medium text-foreground mb-4">Component not found</h2>
        <Button asChild>
          <Link to="/app/components">Back to Components</Link>
        </Button>
      </div>
    );
  }

  if (!selectedFile && mainFilename) {
    setSelectedFile(mainFilename);
  }

  const depsArray = Object.keys(dependencies);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Back Link */}
      <Link 
        to="/app/components" 
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        <span className="hidden sm:inline">Back to Components</span>
        <span className="sm:hidden">Back</span>
      </Link>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground">
        {component.title}
      </h1>

      {/* Tabs */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-zinc-900/50 border border-border/20">
          <button
            onClick={() => setActiveTab("preview")}
            className={cn(
              "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors",
              activeTab === "preview"
                ? "bg-zinc-800 text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Eye size={16} />
            <span>Preview</span>
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={cn(
              "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors",
              activeTab === "code"
                ? "bg-zinc-800 text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Code2 size={16} />
            <span>Code</span>
          </button>
        </div>

        {activeTab === "preview" && (
          <button
            onClick={() => setPreviewKey(k => k + 1)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-zinc-800/50 transition-colors"
            title="Refresh preview"
          >
            <RefreshCw size={18} />
          </button>
        )}
      </div>

      {/* Preview Tab */}
      {activeTab === "preview" && (
        <div className="space-y-6 md:space-y-8">
          {/* Preview Area */}
          <div className="rounded-xl border border-border/20 overflow-hidden bg-[#0a0a0a]">
            <div className="[&_.sp-wrapper]:!bg-[#0a0a0a] [&_.sp-layout]:!bg-[#0a0a0a] [&_.sp-stack]:!h-[350px] [&_.sp-preview-container]:!bg-[#0a0a0a] [&_.sp-preview-iframe]:!bg-[#0a0a0a] [&_.sp-editor]:!hidden [&_.sp-tabs]:!hidden [&_.sp-code-editor]:!hidden">
              <Sandpack
                key={previewKey}
                template="react"
                theme={dracula}
                files={sandpackFiles}
                options={{
                  showNavigator: false,
                  showTabs: false,
                  showLineNumbers: false,
                  showInlineErrors: true,
                  externalResources: ["https://cdn.tailwindcss.com"],
                }}
                customSetup={{
                  entry: "/root.js",
                  dependencies: {
                    ...dependencies,
                    "react": "^18.2.0",
                    "react-dom": "^18.2.0",
                    "lucide-react": "latest",
                    "clsx": "latest",
                    "tailwind-merge": "latest"
                  }
                }}
              />
            </div>
          </div>

          {/* Dependencies */}
          {depsArray.length > 0 && (
            <div>
              <h3 className="text-base sm:text-lg font-medium text-foreground mb-3">Dependencies</h3>
              <div className="flex flex-wrap gap-2">
                {depsArray.map((dep) => (
                  <span
                    key={dep}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800/80 text-zinc-300 text-sm font-mono border border-border/20"
                  >
                    {dep}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Installation Commands */}
          <div className="space-y-4">
            {depsArray.length > 0 && (
              <CopyableCodeBlock 
                code={`npm install ${depsArray.join(' ')}`}
                label="Install dependencies"
              />
            )}
            
            <CopyableCodeBlock 
              code={`composter pull ${component.category?.name || 'category'} ${component.title}`}
              label="Pull component via CLI"
            />
          </div>

          {/* Interactive Sandbox */}
          <div>
            <h3 className="text-base sm:text-lg font-medium text-foreground mb-3">Interactive Sandbox</h3>
            <div className="rounded-xl border border-border/30 overflow-hidden">
              <Sandpack
                template="react"
                theme={dracula}
                files={sandpackFiles}
                options={{
                  showNavigator: false,
                  showTabs: true,
                  editorHeight: 400,
                  activeFile: mainFilename,
                  externalResources: ["https://cdn.tailwindcss.com"],
                }}
                customSetup={{
                  entry: "/root.js",
                  dependencies: {
                    ...dependencies,
                    "react": "^18.2.0",
                    "react-dom": "^18.2.0",
                    "lucide-react": "latest",
                    "clsx": "latest",
                    "tailwind-merge": "latest"
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Code Tab */}
      {activeTab === "code" && (
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* File Tree - Collapsible on mobile */}
          <div className="lg:w-56 shrink-0">
            <div className="rounded-xl border border-border/20 bg-zinc-900/30 p-3">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-2">
                Files
              </h3>
              <div className="space-y-0.5">
                {renderFileTree(fileTree)}
              </div>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="flex-1 min-w-0">
            <div className="rounded-xl border border-border/20 overflow-hidden bg-[#0a0a0a]">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/10 bg-zinc-900/50">
                <span className="text-xs sm:text-sm font-mono text-muted-foreground truncate">
                  {selectedFile || mainFilename}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-zinc-800/50 transition-colors"
                >
                  {codeCopied ? (
                    <>
                      <Check size={14} className="text-emerald-400" />
                      <span className="hidden sm:inline">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span className="hidden sm:inline">Copy</span>
                    </>
                  )}
                </button>
              </div>
              {/* Code */}
              <div className="max-h-[60vh] lg:max-h-[70vh] overflow-auto">
                <CodeBlock 
                  code={sandpackFiles[selectedFile || mainFilename] || "// No code available"} 
                  language="jsx" 
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComponentDetail;
