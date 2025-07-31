import React, { useState, useEffect } from "react";
import { Badge, User } from "@/entities/all";
import BadgeDisplay from "./BadgeDisplay";
import { Award, Filter } from "lucide-react";

export default function BadgeGrid() {
  const [badges, setBadges] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      const badgesList = await Badge.list();
      setBadges(badgesList);
    } catch (error) {
      console.error("Failed to load badges:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All Badges' },
    { id: 'rides', name: 'Rides' },
    { id: 'distance', name: 'Distance' },
    { id: 'streak', name: 'Streaks' },
    { id: 'eco', name: 'Eco' },
    { id: 'rto', name: 'RTO Hunt' },
    { id: 'social', name: 'Social' },
    { id: 'special', name: 'Special' }
  ];

  const filteredBadges = selectedCategory === 'all' 
    ? badges 
    : badges.filter(badge => badge.category === selectedCategory);

  const isBadgeEarned = (badge) => {
    if (!currentUser) return false;
    
    const requirements = badge.requirements;
    
    if (requirements.total_rides && (currentUser.total_rides || 0) < requirements.total_rides) return false;
    if (requirements.distance_km && (currentUser.distance_traveled || 0) < requirements.distance_km) return false;
    if (requirements.current_streak && (currentUser.current_streak || 0) < requirements.current_streak) return false;
    if (requirements.tokens && (currentUser.tokens || 0) < requirements.tokens) return false;
    if (requirements.trust_score && (currentUser.trust_score || 0) < requirements.trust_score) return false;
    if (requirements.rto_plates && (currentUser.rto_collection?.length || 0) < requirements.rto_plates) return false;
    if (requirements.co2_saved && (currentUser.co2_saved || 0) < requirements.co2_saved) return false;
    if (requirements.referrals && (currentUser.referral_count || 0) < requirements.referrals) return false;
    
    return true;
  };

  if (isLoading) {
    return (
      <div className="glass rounded-3xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/10 rounded"></div>
          <div className="grid grid-cols-4 gap-4">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="aspect-square bg-white/10 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const earnedCount = filteredBadges.filter(isBadgeEarned).length;
  const totalCount = filteredBadges.length;

  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Award className="w-7 h-7 text-yellow-400" />
            Badge Collection
          </h2>
          <p className="text-slate-300 mt-1">{earnedCount}/{totalCount} badges earned</p>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-yellow-400">{Math.round((earnedCount/totalCount) * 100)}%</div>
          <div className="text-sm text-slate-300">Complete</div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              selectedCategory === category.id
                ? 'glass-active text-cyan-300'
                : 'glass-hover text-slate-300'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {filteredBadges.map((badge) => {
          const earned = isBadgeEarned(badge);
          return (
            <div key={badge.id} className="text-center">
              <BadgeDisplay badge={badge} earned={earned} />
              <h3 className={`text-xs font-medium mt-2 ${earned ? 'text-white' : 'text-slate-500'}`}>
                {badge.name}
              </h3>
              <p className={`text-xs mt-1 ${earned ? 'text-cyan-300' : 'text-slate-600'}`}>
                {badge.title}
              </p>
            </div>
          );
        })}
      </div>

      {filteredBadges.length === 0 && (
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No badges in this category</h3>
          <p className="text-slate-400">Try a different filter</p>
        </div>
      )}
    </div>
  );
}