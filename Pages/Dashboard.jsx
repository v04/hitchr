
import React, { useState, useEffect } from "react";
import { User, Ride, RTOPlate, Quest } from "@/entities/all";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  MapPin, 
  Car, 
  UserCheck, 
  Zap, 
  TrendingUp, 
  Calendar,
  Star,
  Award,
  ChevronRight,
  Compass,
  Target,
  Leaf
} from "lucide-react";

import StatsGrid from "../components/dashboard/StatsGrid";
import RoleToggle from "../components/dashboard/RoleToggle";
import RecentActivity from "../components/dashboard/RecentActivity";
import QuickActions from "../components/dashboard/QuickActions";
import TokenEarner from "../components/dashboard/TokenEarner";

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [recentRides, setRecentRides] = useState([]);
  const [activeQuests, setActiveQuests] = useState([]);
  const [rtoCollection, setRtoCollection] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      const rides = await Ride.filter(
        { $or: [{ pilot_id: user.id }, { rider_id: user.id }] },
        "-created_date",
        5
      );
      setRecentRides(rides);

      const quests = await Quest.filter({ is_active: true }, "-created_date", 3);
      setActiveQuests(quests);

      const plates = await RTOPlate.list("-discovery_count", 5);
      setRtoCollection(plates);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleToggle = async (newRole) => {
    try {
      await User.updateMyUserData({ current_role: newRole });
      setCurrentUser(prev => ({ ...prev, current_role: newRole }));
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="glass rounded-3xl p-6 animate-pulse">
              <div className="h-24 bg-white/10 rounded-2xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 text-glow">
                Welcome back, {currentUser?.display_name || 'Hitcher'}!
              </h1>
              <p className="text-slate-200">Ready for your next adventure?</p>
            </div>
            
            <RoleToggle 
              currentRole={currentUser?.current_role || 'rider'}
              onRoleChange={handleRoleToggle}
            />
          </div>
        </div>

        {/* Demo Token Earner */}
        <TokenEarner />

        {/* Stats Grid */}
        <StatsGrid 
          tokens={currentUser?.tokens || 0}
          totalRides={currentUser?.total_rides || 0}
          currentStreak={currentUser?.current_streak || 0}
          trustScore={currentUser?.trust_score || 5.0}
          rtoCount={currentUser?.rto_collection?.length || 0}
          co2Saved={currentUser?.co2_saved || 0}
        />

        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions currentRole={currentUser?.current_role || 'rider'} />
        </div>

        {/* Recent Activity */}
        <RecentActivity rides={recentRides} />
      </div>
    </div>
  );
}
