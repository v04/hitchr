
import React, { useState, useEffect } from "react";
import { User } from "@/entities/all";
import { Trophy, Medal, Award, Crown, TrendingUp } from "lucide-react";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('tokens');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLeaderboardData();
  }, []);

  const loadLeaderboardData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);

      const usersList = await User.list();
      setUsers(usersList);
    } catch (error) {
      console.error("Failed to load leaderboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { id: 'tokens', name: 'Top Earners', field: 'tokens', icon: Trophy },
    { id: 'rides', name: 'Most Rides', field: 'total_rides', icon: Medal },
    { id: 'trust', name: 'Highest Rated', field: 'trust_score', icon: Award },
    { id: 'streak', name: 'Best Streaks', field: 'current_streak', icon: TrendingUp }];


  const currentCategory = categories.find((cat) => cat.id === selectedCategory);
  const sortedUsers = [...users].sort((a, b) => {
    const aValue = a[currentCategory.field] || 0;
    const bValue = b[currentCategory.field] || 0;
    return bValue - aValue;
  });

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 1: return <Medal className="w-6 h-6 text-slate-300" />;
      case 2: return <Award className="w-6 h-6 text-amber-400" />;
      default: return <span className="text-lg font-bold text-slate-400">{index + 1}</span>;
    }
  };

  const getRankStyle = (index) => {
    switch (index) {
      case 0: return 'border-yellow-400/50';
      case 1: return 'border-slate-300/50';
      case 2: return 'border-amber-400/50';
      default: return 'border-transparent';
    }
  };

  const formatValue = (value, field) => {
    switch (field) {
      case 'tokens':
        return value?.toLocaleString() || '0';
      case 'trust_score':
        return (value || 5.0).toFixed(1);
      case 'current_streak':
        return `${value || 0} days`;
      default:
        return value?.toLocaleString() || '0';
    }
  };

  const getUserAccolades = (user, rank) => {
    const accolades = [];

    // Rank-based accolades
    if (rank === 0) accolades.push({ text: 'Reigning Champ', color: 'bg-yellow-500/20 text-yellow-300' });
    if (rank > 0 && rank < 3) accolades.push({ text: 'Podium Finisher', color: 'bg-slate-400/20 text-slate-300' });
    if (rank < 10) accolades.push({ text: 'Top 10', color: 'bg-amber-500/20 text-amber-400' });

    // Ride-based accolades
    if (user.total_rides >= 50) accolades.push({ text: 'Trailblazer', color: 'bg-purple-500/20 text-purple-300' });
    else if (user.total_rides >= 10) accolades.push({ text: 'Voyager', color: 'bg-indigo-500/20 text-indigo-300' });

    // Streak-based
    if (user.current_streak >= 7) accolades.push({ text: 'Streak Master', color: 'bg-red-500/20 text-red-300' });
    else if (user.current_streak >= 3) accolades.push({ text: 'On Fire', color: 'bg-orange-500/20 text-orange-300' });
    
    // Eco-based
    if (user.co2_saved >= 10) accolades.push({ text: 'Eco-Warrior', color: 'bg-green-500/20 text-green-300' });
    
    // RTO based
    if (user.rto_collection?.length >= 10) accolades.push({ text: 'Plate Collector', color: 'bg-cyan-500/20 text-cyan-300' });

    return accolades.slice(0, 3); // Show max 3 accolades
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {Array(8).fill(0).map((_, i) =>
            <div key={i} className="neumorphic rounded-3xl p-6 animate-pulse">
              <div className="h-16 bg-gray-200 rounded-2xl"></div>
            </div>
          )}
        </div>
      </div>);

  }

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Leaderboard</h1>
          <p className="text-slate-300">See how you rank among fellow hitchers</p>
        </div>

        {/* Category Selector */}
        <div className="glass rounded-3xl p-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) =>
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-200 ${
                  selectedCategory === category.id ? 'glass-active text-white' : 'glass-hover text-slate-300'
                }`}
              >
                <category.icon className="w-4 h-4" />
                <span className="font-medium">{category.name}</span>
              </button>
            )}
          </div>
        </div>

        {/* Full Rankings */}
        <div className="glass rounded-3xl p-6">
          <h2 className="text-white mb-6 text-2xl font-bold">Full Rankings</h2>
          
          <div className="space-y-3">
            {sortedUsers.map((user, index) => {
              const isCurrentUser = user.id === currentUser?.id;
              const accolades = getUserAccolades(user, index);

              return (
                <div
                  key={user.id}
                  className={`glass-inset rounded-2xl p-4 border-2 ${getRankStyle(index)} ${isCurrentUser ? 'ring-2 ring-cyan-400' : ''}`}
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-10 h-10 flex items-center justify-center">
                        {getRankIcon(index)}
                      </div>
                      
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/50 to-purple-500/50 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">
                          {(user.display_name || user.full_name || 'U')[0]}
                        </span>
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="font-semibold text-white">
                          {user.display_name || user.full_name || 'Unknown User'}
                          {isCurrentUser && <span className="ml-2 text-cyan-400 text-sm">(You)</span>}
                        </h3>
                        <p className="text-sm text-slate-400">
                          ⭐ {(user.trust_score || 5.0).toFixed(1)} • {user.total_rides || 0} rides
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right mt-3 sm:mt-0 w-full sm:w-auto flex-shrink-0">
                      <p className="text-2xl font-bold text-white">
                        {formatValue(user[currentCategory.field], currentCategory.field)}
                      </p>
                      <p className="text-sm text-slate-400">{currentCategory.name.replace('Most ', '').replace('Top ', '').replace('Highest ', '').replace('Best ', '')}</p>
                    </div>
                  </div>
                  {accolades.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap gap-2">
                      {accolades.map(accolade => (
                        <span key={accolade.text} className={`px-2 py-1 text-xs font-medium rounded-full ${accolade.color}`}>
                          {accolade.text}
                        </span>
                      ))}
                    </div>
                  )}
                </div>);
            })}
          </div>
        </div>
      </div>
    </div>);
}