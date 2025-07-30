
import React, { useState, useEffect } from "react";
import { HitchTrail, User } from "@/entities/all";
import { Compass, MapPin, Clock, Users, Star, ChevronRight, Trophy } from "lucide-react";

export default function Trails() {
  const [trails, setTrails] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTrailsData();
  }, []);

  const loadTrailsData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      const trailsList = await HitchTrail.list();
      setTrails(trailsList);
    } catch (error) {
      console.error("Failed to load trails:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All Trails' },
    { id: 'scenic', name: 'Scenic' },
    { id: 'heritage', name: 'Heritage' },
    { id: 'adventure', name: 'Adventure' },
    { id: 'cultural', name: 'Cultural' },
    { id: 'nature', name: 'Nature' },
  ];

  const filteredTrails = selectedCategory === 'all' 
    ? trails 
    : trails.filter(trail => trail.category === selectedCategory);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 border-green-500/30 bg-green-500/20';
      case 'moderate': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/20';
      case 'challenging': return 'text-red-400 border-red-500/30 bg-red-500/20';
      default: return 'text-slate-400 border-slate-500/30 bg-slate-500/20';
    }
  };

  const isTrailCompleted = (trailId) => {
    return currentUser?.completed_trails?.includes(trailId) || false;
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
          <h1 className="text-4xl font-bold text-white mb-2 text-glow">HITCH Trails</h1>
          <p className="text-slate-200">Discover scenic routes and cultural journeys</p>
        </div>

        {/* Trail Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 text-glow">
              {trails.length}
            </div>
            <div className="text-slate-300 text-sm">Total Trails</div>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400 text-glow">
              {currentUser?.completed_trails?.length || 0}
            </div>
            <div className="text-slate-300 text-sm">Completed</div>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400 text-glow">
              {trails.filter(t => t.special_badge).length}
            </div>
            <div className="text-slate-300 text-sm">Special Badges</div>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 text-glow">
              {trails.reduce((sum, t) => sum + (t.token_reward || 0), 0)}
            </div>
            <div className="text-slate-300 text-sm">Total Tokens</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="glass rounded-3xl p-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-3 rounded-2xl transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'glass-active text-blue-300'
                    : 'glass-hover text-slate-300'
                }`}
              >
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Trails Grid */}
        {filteredTrails.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrails.map((trail) => {
              const completed = isTrailCompleted(trail.id);
              
              return (
                <div key={trail.id} className={`glass rounded-3xl p-6 glass-hover ${completed ? 'ring-2 ring-green-500/30' : ''}`}>
                  {/* Trail Image */}
                  <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl mb-4 flex items-center justify-center overflow-hidden relative">
                    {trail.featured_image ? (
                      <img 
                        src={trail.featured_image} 
                        alt={trail.name}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      <Compass className="w-12 h-12 text-slate-500" />
                    )}
                    
                    {completed && (
                      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="text-white text-lg">✓</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Trail Info */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-white">{trail.name}</h3>
                      <div className={`px-2 py-1 rounded-lg text-xs font-medium border ${getDifficultyColor(trail.difficulty)}`}>
                        {trail.difficulty}
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm line-clamp-2 mb-3">{trail.description}</p>
                    
                    {/* Trail Stats */}
                    <div className="flex items-center gap-4 text-sm text-slate-300 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{trail.distance_km} km</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{trail.estimated_duration}h</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{trail.completed_by?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Rewards */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="font-bold text-slate-200">{trail.token_reward}</span>
                        <span className="text-slate-400 text-sm">tokens</span>
                      </div>
                    </div>
                    
                    {/* Special Badge Unlock */}
                    {trail.special_badge && (
                      <div className="glass-inset rounded-2xl p-3 mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Trophy className="w-4 h-4 text-purple-400" />
                          <span className="text-sm font-medium text-white">Unlocks Badge:</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🏆</span>
                          <div>
                            <p className="font-medium text-purple-400">{trail.special_badge}</p>
                            <p className="text-xs text-slate-400">Complete this trail to earn this exclusive title</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Button */}
                  <button 
                    disabled={completed}
                    className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
                      completed 
                        ? 'glass-inset text-green-400 cursor-default' 
                        : 'btn-primary'
                    }`}
                  >
                    {completed ? 'Completed ✓' : 'Start Trail'}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass rounded-3xl p-12 text-center">
            <Compass className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No trails available</h3>
            <p className="text-slate-400">Check back soon for new scenic routes in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
