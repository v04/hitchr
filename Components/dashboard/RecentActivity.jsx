
import React from "react";
import { format } from "date-fns";
import { Car, UserCheck, Clock, MapPin, Zap } from "lucide-react";

export default function RecentActivity({ rides }) {
  if (rides.length === 0) {
    return (
      <div className="glass rounded-3xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6 text-glow">Recent Activity</h2>
        
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full glass-inset flex items-center justify-center mx-auto mb-4">
            <Car className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-300 mb-2">No rides yet</h3>
          <p className="text-slate-400">Your ride history will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6 text-glow">Recent Activity</h2>
      
      <div className="space-y-4">
        {rides.map((ride) => (
          <div key={ride.id} className="glass-inset rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  ride.status === 'completed' 
                    ? 'bg-green-500/20 border border-green-500/30' 
                    : ride.status === 'in_progress'
                    ? 'bg-blue-500/20 border border-blue-500/30'
                    : 'bg-slate-500/20 border border-slate-500/30'
                }`}>
                  <Car className={`w-5 h-5 ${
                    ride.status === 'completed' 
                      ? 'text-green-400' 
                      : ride.status === 'in_progress'
                      ? 'text-blue-400'
                      : 'text-slate-400'
                  }`} />
                </div>
                <div>
                  <p className="font-medium text-slate-200">
                    {ride.pickup_location?.address || 'Pickup Location'} → {ride.destination?.address || 'Destination'}
                  </p>
                  <p className="text-sm text-slate-300">
                    {format(new Date(ride.created_date), "MMM d, h:mm a")}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                  ride.status === 'completed' 
                    ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                    : ride.status === 'in_progress'
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                }`}>
                  {ride.status === 'completed' && '✓ Completed'}
                  {ride.status === 'in_progress' && '🚗 In Progress'}
                  {ride.status === 'requested' && '📋 Requested'}
                </div>
                {ride.tokens_earned && (
                  <div className="flex items-center gap-1 justify-end mt-1">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <span className="text-sm text-yellow-400 font-medium">
                      +{ride.tokens_earned}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {ride.distance_km && (
              <div className="flex items-center gap-4 text-sm text-slate-300">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{ride.distance_km} km</span>
                </div>
                {ride.duration_minutes && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{ride.duration_minutes} min</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
