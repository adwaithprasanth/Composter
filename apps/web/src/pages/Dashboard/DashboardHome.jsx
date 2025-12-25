import React, { useState, useEffect } from "react";
import { Box, Folder, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card.jsx";

// eslint-disable-next-line no-unused-vars
const StatCard = ({ title, value, icon: Icon }) => (
  <Card className="h-full">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-muted-foreground text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-semibold text-foreground">{value}</h3>
      </div>
      <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
        <Icon size={20} />
      </div>
    </div>
  </Card>
);

const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? 's' : ''} ago`;
};

const DashboardHome = () => {
  const navigate = useNavigate();
  const [componentsCount, setComponentsCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [recentComponents, setRecentComponents] = useState([]);

  useEffect(() => {
    const fetchComponentsCount = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/components/count`, {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        setComponentsCount(data.count);
      } catch (error) {
        console.error("Error fetching components count:", error);
      }
    };

    const fetchCategoriesCount = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories/count`, {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        setCategoriesCount(data.count);
      } catch (error) {
        console.error("Error fetching categories count:", error);
      }
    };

    const fetchRecentComponents = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/components/recent?limit=5`, {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        setRecentComponents(data.components || []);
      } catch (error) {
        console.error("Error fetching recent components:", error);
      }
    };

    fetchCategoriesCount();
    fetchComponentsCount();
    fetchRecentComponents();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-medium text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, here's what's happening with your components.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard title="Total Components" value={componentsCount} icon={Box} />
        <StatCard title="Total Categories" value={categoriesCount} icon={Folder} />
      </div>

      {/* Recent Components */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-foreground">Recent Components</h2>
          <button 
            onClick={() => navigate('/app/components')}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            View all
          </button>
        </div>
        <div className="space-y-3">
          {recentComponents.length === 0 ? (
            <Card>
              <p className="text-muted-foreground text-center py-4">No components yet. Create your first component!</p>
            </Card>
          ) : (
            recentComponents.map((comp) => (
              <Card 
                key={comp.id} 
                hoverEffect 
                className="group"
                onClick={() => navigate(`/app/components/${comp.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Box size={18} />
                    </div>
                    <div>
                      <h4 className="text-foreground font-medium group-hover:text-primary transition-colors">{comp.title}</h4>
                      <p className="text-xs text-muted-foreground">{comp.category.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{formatTimeAgo(comp.createdAt)}</span>
                    <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;