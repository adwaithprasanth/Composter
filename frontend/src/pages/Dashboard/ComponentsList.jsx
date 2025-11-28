import React, { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { SandpackProvider, SandpackPreview } from "@codesandbox/sandpack-react";
import { dracula } from "@codesandbox/sandpack-themes";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";

const ComponentsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [components, setComponents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/components/list`, {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        setComponents(data.components || []);
      } catch (error) {
        console.error("Error fetching components:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories`, {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchComponents();
    fetchCategories();
  }, []);

  // Filter components based on search query and category
  const displayComponents = components.filter((comp) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = comp.title.toLowerCase().includes(query) ||
           (comp.category?.name || "").toLowerCase().includes(query);
    const matchesCategory = selectedCategory === "all" || comp.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Components</h1>
          <p className="text-white/60">Manage and organize your component library</p>
        </div>
        <Link to="/app/upload">
          <Button>
            Upload Component
          </Button>
        </Link>
      </div>

      {/* Search Bar with Filter */}
      <div className="flex items-center gap-4 bg-[#060010] p-2 rounded-2xl border border-white/10">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input
            type="text"
            placeholder="Search components..."
            className="w-full bg-transparent border-none text-white placeholder-white/40 pl-10 pr-4 py-2 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
              selectedCategory !== "all" 
                ? "bg-violet-500/20 text-violet-300 border border-violet-500/30" 
                : "bg-[#0a0018] text-white/70 hover:text-white border border-white/10"
            }`}
          >
            <Filter size={18} />
            <span className="text-sm font-medium">
              {selectedCategory === "all" ? "Filter" : selectedCategory}
            </span>
          </button>
          
          {/* Filter Dropdown */}
          {showFilter && (
            <div className="absolute right-0 mt-2 w-56 bg-[#060010] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setShowFilter(false);
                }}
                className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                  selectedCategory === "all"
                    ? "bg-violet-500/20 text-violet-300"
                    : "text-white/70 hover:bg-[#0a0018] hover:text-white"
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.name);
                    setShowFilter(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                    selectedCategory === category.name
                      ? "bg-violet-500/20 text-violet-300"
                      : "text-white/70 hover:bg-[#0a0018] hover:text-white"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center text-white/60 py-12">
          Loading components...
        </div>
      )}

      {/* Empty State */}
      {!loading && displayComponents.length === 0 && (
        <div className="text-center text-white/60 py-12">
          {searchQuery ? "No components found matching your search" : "No components yet. Upload your first component!"}
        </div>
      )}

      {/* Grid */}
      {!loading && displayComponents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayComponents.map((comp) => (
            <Link key={comp.id} to={`/app/components/${comp.id}`}>
              <Card hoverEffect className="h-full group cursor-pointer">
                {/* Preview Only */}
                <div className="aspect-video rounded-xl mb-4 overflow-hidden border border-white/5 bg-[#151515]">
                  <SandpackProvider
                    template="react"
                    theme={dracula}
                    files={{
                      "/App.js": comp.code,
                      "/index.js": `import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(<App />);`,
                      "/styles.css": `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #0a0a0a;
}`,
                      "/public/index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Component Preview</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`
                    }}
                    customSetup={{
                      dependencies: {
                        "react": "^18.2.0",
                        "react-dom": "^18.2.0",
                        "tailwindcss": "^3.3.0"
                      }
                    }}
                    options={{
                      autorun: true,
                      autoReload: false,
                    }}
                  >
                    <SandpackPreview
                      showNavigator={false}
                      showRefreshButton={false}
                      showOpenInCodeSandbox={false}
                      style={{ height: '100%' }}
                    />
                  </SandpackProvider>
                </div>

                {/* Component Info */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white group-hover:text-violet-400 transition-colors">
                    {comp.title}
                  </h3>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">
                      {comp.category?.name || "Uncategorized"}
                    </span>
                    <span className="text-white/40 text-xs">
                      {formatTimeAgo(comp.createdAt)}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComponentsList;