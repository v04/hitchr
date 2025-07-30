
import React, { useState, useEffect } from "react";
import { User, Ride } from "@/entities/all";
import { MapPin, Navigation, Plus, Users } from "lucide-react";

export default function Map() {
  const [currentUser, setCurrentUser] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMapData();
  }, []);

  const loadMapData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      // Simulate nearby users for demo
      const users = await User.list();
      setNearbyUsers(users.slice(0, 5));
    } catch (error) {
      console.error("Failed to load map data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-3xl p-6 animate-pulse">
            <div className="h-96 bg-white/10 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">
            {currentUser?.current_role === 'pilot' ? 'Offer a Ride' : 'Find a Ride'}
          </h1>
          <p className="text-slate-300">
            {currentUser?.current_role === 'pilot' 
              ? 'Share your journey with fellow travelers' 
              : 'Discover nearby rides and start your adventure'
            }
          </p>
        </div>

        {/* Map Container */}
        <div className="glass rounded-3xl p-4 sm:p-6 mb-6">
          <div className="relative">
            {/* Mock Map Interface */}
            <div className="bg-slate-900 rounded-2xl h-96 flex items-center justify-center relative overflow-hidden border border-white/10">
              <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'url(https://www.transparenttextures.com/patterns/subtle-grid.png)'}}></div>
              
              {/* Center Location Indicator */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-6 h-6 rounded-full bg-cyan-400 animate-ping"></div>
                <div className="absolute inset-0 w-6 h-6 rounded-full bg-cyan-400 border-2 border-white"></div>
              </div>

              {/* Mock Nearby User Markers */}
              {nearbyUsers.slice(0, 3).map((user, index) => {
                const positions = [
                  { top: '25%', left: '35%' },
                  { top: '65%', left: '70%' },
                  { top: '40%', left: '20%' }
                ];
                
                return (
                  <div key={user.id} className="absolute transform -translate-x-1/2 -translate-y-1/2" style={positions[index]}>
                    <div className="glass rounded-full p-2 bg-green-500/30 cursor-pointer glass-hover">
                      {user.current_role === 'pilot' ? 
                        <Users className="w-4 h-4 text-white" /> : 
                        <MapPin className="w-4 h-4 text-white" />
                      }
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <button className="glass rounded-xl p-3 glass-hover">
                <Plus className="w-5 h-5 text-slate-300" />
              </button>
              <button className="glass rounded-xl p-3 glass-hover">
                <Navigation className="w-5 h-5 text-slate-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Nearby Users List */}
        <div className="glass rounded-3xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Nearby {currentUser?.current_role === 'pilot' ? 'Riders' : 'Pilots'}
          </h2>
          
          {nearbyUsers.length > 0 ? (
            <div className="space-y-3">
              {nearbyUsers.map((user) => (
                <div key={user.id} className="glass-inset rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/50 to-purple-500/50 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {(user.display_name || user.full_name || 'U')[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">
                          {user.display_name || user.full_name || 'Unknown User'}
                        </h3>
                        <p className="text-sm text-slate-400">
                          ⭐ {user.trust_score?.toFixed(1) || '5.0'} • {user.total_rides || 0} rides
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-400">0.5 km away</span>
                      <button className="btn-primary rounded-xl px-4 py-2 text-sm">
                        Connect
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">No nearby users</h3>
              <p className="text-slate-400">Check back soon for available rides</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
