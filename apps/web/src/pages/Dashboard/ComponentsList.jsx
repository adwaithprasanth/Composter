import React, { useState, useEffect } from "react";
import { Search, Filter, Layers, Code2, Eye, Plus, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card.jsx";
import { Button } from "@/components/ui/button";
import { SpringModal } from "@/components/ui/SpringModal.jsx";

// --- SUB-COMPONENT: Simple card without live preview ---
const ComponentCard = ({ comp, formatTimeAgo, onDeleteClick }) => {
  // Parse dependencies count
  let depsCount = 0;
  if (comp.dependencies) {
    try {
      const deps = typeof comp.dependencies === 'string' 
        ? JSON.parse(comp.dependencies) 
        : comp.dependencies;
      depsCount = Object.keys(deps).length;
    } catch {
      // ignore parse errors for dependency metadata
    }
  }

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDeleteClick) onDeleteClick(comp.id, comp.title);
  };

  return (
    <Link to={`/app/components/${comp.id}`}>
      <Card hoverEffect className="h-full group relative">
        {/* Delete Button - Top Right */}
        <button
          onClick={handleDelete}
          className="absolute top-3 right-3 z-20 p-1.5 rounded-md bg-zinc-800/80 hover:bg-red-500/20 border border-border/30 hover:border-red-500/50 text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200"
          title="Delete component"
        >
          <Trash size={14} />
        </button>

        {/* Preview Area - Static Placeholder */}
        <div className="aspect-video rounded-lg mb-4 overflow-hidden border border-border/30 bg-zinc-950 flex items-center justify-center relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
          <div className="relative z-10 flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
            <Code2 size={28} strokeWidth={1.5} />
            <div className="flex items-center gap-1 text-xs">
              <Eye size={12} />
              <span>Click to preview</span>
            </div>
          </div>
        </div>

        {/* Component Info */}
        <div className="space-y-2">
          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
            {comp.title}
          </h3>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground text-xs">
              {comp.category?.name || "Uncategorized"}
            </span>
            <div className="flex items-center gap-3">
              {depsCount > 0 && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Layers size={12} /> {depsCount}
                </span>
              )}
              <span className="text-muted-foreground/70 text-xs">
                {formatTimeAgo(comp.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

const ComponentsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [components, setComponents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, componentId: null, componentName: "" });

  const openDeleteModal = (componentId, componentName) => {
    setDeleteModal({ open: true, componentId, componentName });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, componentId: null, componentName: "" });
  };

  const handleDeleteComponent = async () => {
    const { componentId } = deleteModal;
    if (!componentId) return;
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/components/${componentId}`, {
        method: "DELETE",
        credentials: "include"
      });
      
      if (res.ok) {
        setComponents(prev => prev.filter(c => c.id !== componentId));
      } else {
        console.error("Failed to delete component");
      }
    } catch (error) {
      console.error("Error deleting component:", error);
    } finally {
      closeDeleteModal();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [compsRes, catsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/components/list`, { 
            headers: { "Content-Type": "application/json" },
            credentials: "include" 
          }),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories`, { 
            headers: { "Content-Type": "application/json" },
            credentials: "include" 
          })
        ]);
        
        const compsData = await compsRes.json();
        const catsData = await catsRes.json();

        setComponents(compsData.components || []);
        setCategories(catsData.categories || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  return (
    
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium text-foreground mb-1">My Components</h1>
          <p className="text-muted-foreground">Manage and organize your component library</p>
        </div>
        <Button asChild>
          <Link to="/app/upload">
            <Plus size={18} className="mr-2" />
            Upload Component
          </Link>
        </Button>
      </div>

      {/* Search Bar with Filter */}
      <div className="flex items-center gap-3 p-1.5 rounded-xl border border-border/30 bg-zinc-900/50">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search components..."
            className="w-full bg-transparent border-none text-foreground placeholder-muted-foreground pl-10 pr-4 py-2 outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm ${
              selectedCategory !== "all" 
                ? "bg-primary/10 text-primary border border-primary/20" 
                : "bg-zinc-800/50 text-muted-foreground hover:text-foreground border border-border/30"
            }`}
          >
            <Filter size={16} />
            <span className="font-medium">
              {selectedCategory === "all" ? "Filter" : selectedCategory}
            </span>
          </button>
          
          {/* Filter Dropdown */}
          {showFilter && (
            <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-border/50 rounded-xl shadow-xl z-50 overflow-hidden">
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setShowFilter(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                  selectedCategory === "all"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-zinc-800 hover:text-foreground"
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
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                    selectedCategory === category.name
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-zinc-800 hover:text-foreground"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      {!loading && displayComponents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayComponents.map((comp) => (
            <ComponentCard 
              key={comp.id} 
              comp={comp} 
              formatTimeAgo={formatTimeAgo} 
              onDeleteClick={openDeleteModal}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && displayComponents.length === 0 && (
        <div className="text-center text-muted-foreground py-16">
          <Code2 size={48} className="mx-auto mb-4 opacity-30" />
          <p>{searchQuery ? "No components found matching your search" : "No components yet. Upload your first component!"}</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <SpringModal 
        isOpen={deleteModal.open} 
        setIsOpen={(val) => !val && closeDeleteModal()}
        title="Delete Component?"
        message={`Are you sure you want to delete "${deleteModal.componentName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteComponent}
        variant="danger"
      />
    </div>
  );
};

export default ComponentsList;