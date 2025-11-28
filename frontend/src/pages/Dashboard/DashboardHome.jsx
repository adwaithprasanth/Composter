import React, { useState, useEffect } from "react";
import { Box, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card.jsx";

const StatCard = ({ title, value, icon: Icon }) => (
  <Card className="h-full">
    <div className="flex items-start justify-between mb-4">
      <div>
        <p className="text-white/60 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
      </div>
      <div className="p-2 rounded-lg bg-[#060010] text-white/80">
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
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-white/60">Welcome back, here's what's happening with your components.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard title="Total Components" value={componentsCount} icon={Box} />
        <StatCard title="Total Categories" value={categoriesCount} icon={Star} />
      </div>

      {/* Recent Components */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Recent Components</h2>
        <div className="space-y-4">
          {recentComponents.length === 0 ? (
            <Card>
              <p className="text-white/50 text-center">No components yet. Create your first component!</p>
            </Card>
          ) : (
            recentComponents.map((comp) => (
              <Card 
                key={comp.id} 
                hoverEffect 
                className="group cursor-pointer"
                onClick={() => navigate(`/app/components/${comp.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center text-violet-300">
                      <Box size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-medium group-hover:text-violet-400 transition-colors">{comp.title}</h4>
                      <p className="text-xs text-white/50">{comp.category.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-white/40">{formatTimeAgo(comp.createdAt)}</span>
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