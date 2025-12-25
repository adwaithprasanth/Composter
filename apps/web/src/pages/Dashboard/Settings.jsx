import React, { useState, useEffect, useRef } from "react";
import { User, Camera } from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import { Button } from "@/components/ui/button";
import ComposterLoading from "@/components/ui/ComposterLoading.jsx";

const Settings = () => {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        avatar: null
    });

    const [formData, setFormData] = useState(profile);
    const [loading, setLoading] = useState(true);

    const fileInputRef = useRef(null);

    // Fetch user profile from backend
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/me`, {
                    credentials: "include",
                });
                const data = await response.json();
                
                if (data?.user) {
                    const user = data.user;
                    const profileData = {
                        name: user.name || "",
                        email: user.email || "",
                        avatar: user.image || null
                    };
                    setProfile(profileData);
                    setFormData(profileData);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, avatar: imageUrl }));
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleSave = (e) => {
        e.preventDefault();
        // TODO: Implement update API endpoint
        setProfile(formData);
        console.log("Profile updated:", formData);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <ComposterLoading size={48} className="mb-4" />
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-medium text-foreground mb-1">Settings</h1>
                <p className="text-muted-foreground">Manage your account preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all bg-primary/10 text-primary border border-primary/20 font-medium text-sm">
                        <User size={18} />
                        Profile
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3">
                    <Card>
                        <h2 className="text-lg font-medium text-foreground mb-6">Profile Information</h2>

                        {/* Avatar Section */}
                        <div className="flex items-center gap-6 mb-8">
                            <div className="relative group">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-2xl font-semibold text-white overflow-hidden">
                                    {formData.avatar ? (
                                        <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span>
                                            {formData.name?.charAt(0)?.toUpperCase() || "U"}
                                        </span>
                                    )}
                                </div>
                                <div
                                    onClick={triggerFileInput}
                                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                    <Camera size={20} className="text-white" />
                                </div>
                            </div>

                            <div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleAvatarChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <Button variant="outline" size="sm" className="mb-2" onClick={triggerFileInput}>
                                    Change Avatar
                                </Button>
                                <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 800K</p>
                            </div>
                        </div>

                        {/* Profile Form */}
                        <form className="space-y-5" onSubmit={handleSave}>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-foreground/80 mb-2">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/50 border border-border/50 text-foreground placeholder-muted-foreground outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-foreground/80 mb-2">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/50 border border-border/50 text-foreground placeholder-muted-foreground outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button type="submit">Save Changes</Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Settings;