import React, { useState, useEffect } from "react";
import { User, Quest } from "@/entities/all";
import { Target, Users, Calendar, Zap, Trophy, MapPin, Leaf, Clock } from "lucide-react";
import { format } from "date-fns";

export default function Quests() {
  const [quests, setQuests] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQuestsData();
  }, []);

  const loadQuestsData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      const questsList = await Quest.list();
      setQuests(questsList);
    } catch (error) {
      console.error("Failed to load quests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const questTypes = [
    { id: 'all', name: 'All Quests', icon: Target },
    { id: 'individual', name: 'Solo', icon: Target },
    { id: 'community', name: 'Community', icon: Users },
    { id: 'trail', name: 'Trail', icon: MapPin },
    { id: 'event', name: 'Event', icon: Calendar },
  ];

  const filteredQuests = selectedType === 'all' 
    ? quests 
    : quests.filter(quest => quest.type === selectedType);

  const getQuestTypeColor = (type) => {
    switch (type) {
      case 'individual': return 'text-blue-400 border-blue-500/30 bg-blue-500/20';
      case 'community': return 'text-purple-400 border-purple-500/30 bg-purple-500/20';
      case 'trail': return 'text-green-400 border-green-500/30 bg-green-500/20';
      case 'event': return 'text-orange-400 border-orange-500/30 bg-orange-500/20';
      default: return 'text-slate-400 border-slate-500/30 bg-slate-500/20';
    }
  };

  const isQuestActive = (quest) => {
    const now = new Date();
    const startDate = new Date(quest.start_date);
    const endDate = new Date(quest.end_date);
    return now >= startDate && now <= endDate && quest.is_active;
  };

  const getUserProgress = (quest) => {
    if (!currentUser) return 0;
    
    const req = quest.requirements;
    let progress = 0;
    let total = 0;

    if (req.rides_count) {
      progress += Math.min(currentUser.total_rides || 0, req.rides_count);
      total += req.rides_count;
    }
    if (req.distance_km) {
      progress += Math.min(currentUser.distance_traveled || 0, req.distance_km);
      total += req.distance_km;
    }
    if (req.streak_days) {
      progress += Math.min(currentUser.current_streak || 0, req.streak_days);
      total += req.streak_days;
    }
    
    return total > 0 ? Math.round((progress / total) * 100) : 0;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="glass rounded-3xl p-6 animate-pulse">
              <div className="h-32 bg-white/10 rounded-2xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 text-glow">Quests & Challenges</h1>
          <p className="text-slate-200">Join solo and community challenges to earn rewards</p>
        </div>

        {/* Active Quests Overview */}
        <div className="glass rounded-3xl p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 text-glow">
                {quests.filter(q => q.type === 'individual' && isQuestActive(q)).length}
              </div>
              <div className="text-slate-300 text-sm">Solo Quests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 text-glow">
                {quests.filter(q => q.type === 'community' && isQuestActive(q)).length}
              </div>
              <div className="text-slate-300 text-sm">Community</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 text-glow">
                {currentUser?.active_quests?.length || 0}
              </div>
              <div className="text-slate-300 text-sm">Joined</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 text-glow">
                {quests.reduce((sum, q) => sum + (q.rewards?.tokens || 0), 0)}
              </div>
              <div className="text-slate-300 text-sm">Total Tokens</div>
            </div>
          </div>
        </div>

        {/* Quest Type Filter */}
        <div className="glass rounded-3xl p-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {questTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-200 ${
                  selectedType === type.id
                    ? 'glass-active text-blue-300'
                    : 'glass-hover text-slate-300'
                }`}
              >
                <type.icon className="w-4 h-4" />
                <span className="font-medium">{type.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quests Grid */}
        {filteredQuests.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredQuests.map((quest) => {
              const progress = getUserProgress(quest);
              const isActive = isQuestActive(quest);
              const isJoined = currentUser?.active_quests?.includes(quest.id);
              
              return (
                <div key={quest.id} className={`glass rounded-3xl p-6 ${isActive ? 'glass-hover' : 'opacity-75'}`}>
                  {/* Quest Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-white">{quest.title}</h3>
                        <div className={`px-2 py-1 rounded-lg text-xs font-medium border ${getQuestTypeColor(quest.type)}`}>
                          {quest.type}
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm mb-3">{quest.description}</p>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-2">Requirements:</h4>
                    <div className="space-y-2">
                      {quest.requirements.rides_count && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">Complete {quest.requirements.rides_count} rides</span>
                          <span className="text-blue-400">{Math.min(currentUser?.total_rides || 0, quest.requirements.rides_count)}/{quest.requirements.rides_count}</span>
                        </div>
                      )}
                      {quest.requirements.distance_km && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">Travel {quest.requirements.distance_km} km</span>
                          <span className="text-green-400">{Math.min(currentUser?.distance_traveled || 0, quest.requirements.distance_km)}/{quest.requirements.distance_km}</span>
                        </div>
                      )}
                      {quest.requirements.streak_days && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">Maintain {quest.requirements.streak_days}-day streak</span>
                          <span className="text-orange-400">{Math.min(currentUser?.current_streak || 0, quest.requirements.streak_days)}/{quest.requirements.streak_days}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-400">Progress</span>
                        <span className="text-xs text-slate-300">{progress}%</span>
                      </div>
                      <div className="glass-inset rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Rewards */}
                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-2">Rewards:</h4>
                    <div className="flex items-center gap-4 text-sm">
                      {quest.rewards.tokens && (
                        <div className="flex items-center gap-1">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400 font-medium">{quest.rewards.tokens} tokens</span>
                        </div>
                      )}
                      {quest.rewards.badge && (
                        <div className="flex items-center gap-1">
                          <Trophy className="w-4 h-4 text-purple-400" />
                          <span className="text-purple-400 font-medium">{quest.rewards.badge}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quest Stats and Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{quest.participants?.length || 0} joined</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Ends {format(new Date(quest.end_date), 'MMM d')}</span>
                      </div>
                    </div>
                    
                    <button 
                      disabled={!isActive || isJoined}
                      className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                        isJoined 
                          ? 'glass-inset text-green-400 cursor-default' 
                          : isActive 
                            ? 'btn-primary' 
                            : 'glass text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {isJoined ? 'Joined ✓' : isActive ? 'Join Quest' : 'Ended'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass rounded-3xl p-12 text-center">
            <Target className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No quests available</h3>
            <p className="text-slate-400">Check back soon for new challenges in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}