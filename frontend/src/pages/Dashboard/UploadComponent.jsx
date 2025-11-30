import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card.jsx";
import { Button } from "@/components/ui/button";

const UploadComponent = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link to="/app/components" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft size={16} />
          Back to Components
        </Link>
        <h1 className="text-3xl font-medium text-foreground mb-1">Upload Component</h1>
        <p className="text-muted-foreground">Share your component with the team or save it for later.</p>
      </div>

      <Card>
        <form className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground/80 mb-2">
                Component Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="e.g. Auth Modal"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/50 border border-border/50 text-foreground placeholder-muted-foreground/50 outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label htmlFor="version" className="block text-sm font-medium text-foreground/80 mb-2">
                Version
              </label>
              <input
                id="version"
                type="text"
                placeholder="1.0.0"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/50 border border-border/50 text-foreground placeholder-muted-foreground/50 outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">Description</label>
            <textarea
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-border/50 text-foreground placeholder-muted-foreground/50 outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20 min-h-[100px] resize-none"
              placeholder="Describe what this component does..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">Component Code</label>
            <div className="relative">
              <textarea
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-border/50 text-zinc-300 placeholder-muted-foreground/50 outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20 min-h-[250px] font-mono text-sm resize-none"
                placeholder="// Paste your component code here..."
              ></textarea>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button variant="outline" asChild>
              <Link to="/app/components">Cancel</Link>
            </Button>
            <Button type="submit">
              Upload Component
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default UploadComponent;