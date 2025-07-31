import React, { useState, useEffect } from "react";
import { RTOPlate, User } from "@/entities/all";
import { MapPin, Trophy, Star, Users, Camera, Target, Search, Filter } from "lucide-react";
import { format } from "date-fns";

export default function RTOHunt() {
  const [plates, setPlates] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [discovering, setDiscovering] = useState(null);

  useEffect(() => {
    loadRTOData();
  }, []);

  const loadRTOData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      const platesList = await RTOPlate.list("-discovery_count");
      setPlates(platesList);
    } catch (error) {
      console.error("Failed to load RTO data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const rarityFilters = [
    { id: 'all', name: 'All Plates' },
    { id: 'common', name: 'Common' },
    { id: 'uncommon', name: 'Uncommon' },
    { id: 'rare', name: 'Rare' },
    { id: 'legendary', name: 'Legendary' },
  ];

  const filteredPlates = plates.filter(plate => {
    const matchesRarity = selectedRarity === 'all' || plate.rarity === selectedRarity;
    const matchesSearch = searchTerm === '' || 
      plate.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plate.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plate.region.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRarity && matchesSearch;
  });

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-slate-400 border-slate-500/30 bg-slate-500/20';
      case 'uncommon': return 'text-green-400 border-green-500/30 bg-green-500/20';
      case 'rare': return 'text-blue-400 border-blue-500/30 bg-blue-500/20';
      case 'legendary': return 'text-purple-400 border-purple-500/30 bg-purple-500/20';
      default: return 'text-slate-400 border-slate-500/30 bg-slate-500/20';
    }
  };

  const isCollected = (plateCode) => {
    return currentUser?.rto_collection?.includes(plateCode) || false;
  };

  const handleDiscoverPlate = async (plate) => {
    if (isCollected(plate.code) || discovering) return;

    setDiscovering(plate.id);
    try {
      // Add to user's collection
      const newCollection = [...(currentUser.rto_collection || []), plate.code];
      const newTokens = (currentUser.tokens || 0) + plate.bonus_tokens;
      
      await User.updateMyUserData({ 
        rto_collection: newCollection,
        tokens: newTokens
      });

      // Update plate discovery stats
      const newDiscoveredBy = [...(plate.discovered_by || []), currentUser.id];
      await RTOPlate.update(plate.id, {
        discovered_by: newDiscoveredBy,
        discovery_count: (plate.discovery_count || 0) + 1,
        first_discovered_at: plate.first_discovered_at || new Date().toISOString()
      });

      // Update local state
      setCurrentUser(prev => ({
        ...prev,
        rto_collection: newCollection,
        tokens: newTokens
      }));

      // Refresh data
      loadRTOData();
    } catch (error) {
      console.error("Failed to discover plate:", error);
    } finally {
      setDiscovering(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {Array(8).fill(0).map((_, i) => (
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
          <h1 className="text-4xl font-bold text-white mb-2 text-glow">RTO Plate Hunt</h1>
          <p className="text-slate-200">Collect license plates from across India during your rides</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 text-glow">
              {currentUser?.rto_collection?.length || 0}
            </div>
            <div className="text-slate-300 text-sm">Collected</div>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 text-glow">
              {plates.length}
            </div>
            <div className="text-slate-300 text-sm">Total Plates</div>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400 text-glow">
              {plates.filter(p => p.rarity === 'legendary').length}
            </div>
            <div className="text-slate-300 text-sm">Legendary</div>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400 text-glow">
              {plates.length > 0 ? Math.round(((currentUser?.rto_collection?.length || 0) / plates.length) * 100) : 0}%
            </div>
            <div className="text-slate-300 text-sm">Completion</div>
          </div>
        </div>

        {/* Hunt Instructions */}
        <div className="glass rounded-3xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Camera className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">How to Hunt</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full glass-inset flex items-center justify-center">
                <span className="text-blue-400 font-bold">1</span>
              </div>
              <span>Spot license plates during your rides</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full glass-inset flex items-center justify-center">
                <span className="text-blue-400 font-bold">2</span>
              </div>
              <span>Click "Discover" when you see a new plate</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full glass-inset flex items-center justify-center">
                <span className="text-blue-400 font-bold">3</span>
              </div>
              <span>Earn tokens and unlock rare plates</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="glass rounded-3xl p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by code, state, or region..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 glass-inset rounded-2xl bg-transparent border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 ring-cyan-400"
                />
              </div>
            </div>
            
            {/* Rarity Filter */}
            <div className="flex flex-wrap gap-2">
              {rarityFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedRarity(filter.id)}
                  className={`px-4 py-3 rounded-2xl transition-all duration-200 ${
                    selectedRarity === filter.id
                      ? 'glass-active text-blue-300'
                      : 'glass-hover text-slate-300'
                  }`}
                >
                  <span className="font-medium">{filter.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Plates Grid */}
        {filteredPlates.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPlates.map((plate) => {
              const collected = isCollected(plate.code);
              const isDiscovering = discovering === plate.id;
              
              return (
                <div 
                  key={plate.id} 
                  className={`glass rounded-2xl p-4 transition-all duration-300 ${
                    collected ? 'glass-active border-green-500/30' : 'glass-hover'
                  }`}
                >
                  {/* Plate Code */}
                  <div className="text-center mb-3">
                    <div className={`text-xl font-bold mb-1 ${collected ? 'text-green-400 text-glow' : 'text-white'}`}>
                      {plate.code}
                    </div>
                    <div className="text-slate-300 text-sm">{plate.state}</div>
                    <div className="text-slate-400 text-xs">{plate.region}</div>
                  </div>

                  {/* Rarity Badge */}
                  <div className="flex justify-center mb-3">
                    <div className={`px-2 py-1 rounded-lg text-xs font-medium border ${getRarityColor(plate.rarity)}`}>
                      {plate.rarity}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-2 text-xs text-slate-300 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        <span>Tokens</span>
                      </div>
                      <span className="text-yellow-400 font-medium">{plate.bonus_tokens}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>Found by</span>
                      </div>
                      <span>{plate.discovery_count || 0}</span>
                    </div>
                    {plate.first_discovered_at && (
                      <div className="text-xs text-slate-400">
                        First found: {format(new Date(plate.first_discovered_at), 'MMM dd, yyyy')}
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="pt-3 border-t border-white/10">
                    {collected ? (
                      <div className="flex items-center justify-center gap-2 text-green-400">
                        <Trophy className="w-4 h-4" />
                        <span className="text-sm font-medium">Collected!</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDiscoverPlate(plate)}
                        disabled={isDiscovering}
                        className={`w-full py-2 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                          isDiscovering 
                            ? 'glass text-slate-500 cursor-not-allowed'
                            : 'btn-primary'
                        }`}
                      >
                        {isDiscovering ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Discovering...
                          </>
                        ) : (
                          <>
                            <Target className="w-4 h-4" />
                            Discover
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass rounded-3xl p-12 text-center">
            {searchTerm ? (
              <>
                <Search className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">No plates found</h3>
                <p className="text-slate-400">Try adjusting your search or filter criteria</p>
              </>
            ) : (
              <>
                <MapPin className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">No plates available</h3>
                <p className="text-slate-400">No plates match the selected rarity filter</p>
              </>
            )}
          </div>
        )}

        {/* Collection Progress */}
        {currentUser?.rto_collection && currentUser.rto_collection.length > 0 && (
          <div className="glass rounded-3xl p-6 mt-8">
            <h2 className="text-xl font-bold text-white mb-4">Your Recent Discoveries</h2>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {currentUser.rto_collection.slice(-8).map((plateCode, index) => {
                const plate = plates.find(p => p.code === plateCode);
                return (
                  <div key={index} className="glass-inset rounded-xl p-2 text-center">
                    <div className="text-sm font-bold text-green-400">{plateCode}</div>
                    {plate && (
                      <div className={`text-xs mt-1 px-1 py-0.5 rounded ${getRarityColor(plate.rarity)} border-0`}>
                        {plate.rarity}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
