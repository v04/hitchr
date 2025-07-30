import React, { useState, useEffect } from "react";
import { User, Badge } from "@/entities/all";
import {
  User as UserIcon,
  Edit3,
  Zap,
  Car,
  TrendingUp,
  Star,
  Award,
  Calendar,
  MapPin
} from "lucide-react";
import BadgeGrid from "../components/badges/BadgeGrid";
import AvatarUpload from "../components/profile/AvatarUpload";

export default function Profile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      setEditForm({
        display_name: user.display_name || '',
        bio: user.bio || ''
      });

      const badges = await Badge.list();
      const earned = badges.filter(badge => {
        const req = badge.requirements;
        if (!req) return false;
        if (req.total_rides && (user.total_rides || 0) < req.total_rides) return false;
        if (req.current_streak && (user.current_streak || 0) < req.current_streak) return false;
        if (req.tokens && (user.tokens || 0) < req.tokens) return false;
        if (req.trust_score && (user.trust_score || 0) < req.trust_score) return false;
        if (req.rto_plates && (user.rto_collection?.length || 0) < req.rto_plates) return false;
        if (req.co2_saved && (user.co2_saved || 0) < req.co2_saved) return false;
        if (req.referrals && (user.referral_count || 0) < req.referrals) return false;
        return true;
      });
      setEarnedBadges(earned);
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await User.updateMyUserData(editForm);
      setCurrentUser((prev) => ({ ...prev, ...editForm }));
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleAvatarUpdated = (newAvatarUrl) => {
    setCurrentUser(prev => ({ ...prev, avatar_url: newAvatarUrl }));
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="glass rounded-3xl p-6 animate-pulse">
              <div className="h-32 bg-white/10 rounded-2xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getCurrentTitle = () => {
    if (earnedBadges.length === 0) return "New Hitcher";
    
    const rarityOrder = ['legendary', 'epic', 'rare', 'uncommon', 'common'];
    for (const rarity of rarityOrder) {
      const badge = earnedBadges.find(b => b.rarity === rarity);
      if (badge) return badge.title;
    }
    return "New Hitcher";
  };

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Profile</h1>
          <p className="text-slate-300">Manage your account and view your achievements</p>
        </div>

        {/* Profile Card */}
        <div className="glass rounded-3xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar with Upload */}
            <AvatarUpload 
              currentUser={currentUser}
              onAvatarUpdated={handleAvatarUpdated}
            />

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editForm.display_name}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, display_name: e.target.value }))}
                    placeholder="Display name"
                    className="w-full glass-inset rounded-2xl px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-2 ring-cyan-400 text-white bg-transparent border-white/10"
                  />
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    className="w-full glass-inset rounded-2xl px-4 py-3 focus:outline-none resize-none focus:ring-2 ring-cyan-400 text-slate-200 bg-transparent border-white/10"
                  />
                  <div className="flex gap-3">
                    <button onClick={handleSaveProfile} className="btn-primary rounded-2xl px-6 py-2">Save</button>
                    <button onClick={() => setIsEditing(false)} className="glass-hover rounded-2xl px-6 py-2 text-slate-200">Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                    <h2 className="text-2xl font-bold text-white">{currentUser?.display_name || currentUser?.full_name || 'Unknown User'}</h2>
                    <button onClick={() => setIsEditing(true)} className="glass-hover rounded-xl p-2">
                      <Edit3 className="w-4 h-4 text-slate-300" />
                    </button>
                  </div>
                  <p className="text-slate-400 mb-2">{currentUser?.email}</p>
                  <div className="mb-4">
                    <span className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-cyan-300 border border-cyan-400/30">
                      {getCurrentTitle()}
                    </span>
                  </div>
                  {currentUser?.bio && <p className="text-slate-200 mb-4">{currentUser.bio}</p>}
                  <div className="flex items-center gap-4 justify-center md:justify-start">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-cyan-500/20 text-cyan-300">
                      <Car className="w-4 h-4" />
                      <span>{currentUser?.current_role === 'pilot' ? 'Pilot' : 'Rider'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {new Date(currentUser?.created_date).getFullYear()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { title: "Tokens Earned", value: (currentUser?.tokens || 0).toLocaleString(), icon: Zap, color: "text-yellow-400" },
            { title: "Total Rides", value: (currentUser?.total_rides || 0).toLocaleString(), icon: Car, color: "text-blue-400" },
            { title: "Current Streak", value: `${currentUser?.current_streak || 0} days`, icon: TrendingUp, color: "text-green-400" },
            { title: "Trust Score", value: (currentUser?.trust_score || 5.0).toFixed(1), icon: Star, color: "text-purple-400" }
          ].map((stat, index) => (
            <div key={index} className="glass rounded-3xl p-6 text-center glass-hover">
              <div className={`w-12 h-12 glass-inset rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className={`text-2xl font-bold text-white mb-1`}>{stat.value}</p>
              <p className="text-slate-400 text-sm">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Badge Collection */}
        <div className="mb-8">
          <BadgeGrid />
        </div>

        {/* Legacy Achievements Section (for backward compatibility) */}
        <div className="glass rounded-3xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Recent Achievements</h2>
          {earnedBadges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {earnedBadges.slice(-4).map((badge, index) => (
                <div key={index} className="glass-inset rounded-2xl p-4 flex items-center gap-3">
                  <div className="text-3xl">{badge.icon}</div>
                  <div>
                    <h3 className="font-semibold text-white">{badge.name}</h3>
                    <p className="text-sm text-cyan-300">{badge.title}</p>
                    <p className="text-xs text-slate-400">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No achievements yet</h3>
              <p className="text-slate-400">Complete rides to unlock your first badge!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
