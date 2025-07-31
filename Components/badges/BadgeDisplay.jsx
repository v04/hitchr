import React from "react";
import { Award, Star, Crown, Zap } from "lucide-react";

export default function BadgeDisplay({ badge, size = "md", earned = false }) {
  const sizes = {
    sm: "w-12 h-12 text-xs",
    md: "w-16 h-16 text-sm", 
    lg: "w-20 h-20 text-base"
  };

  const rarityColors = {
    common: "from-slate-400 to-slate-600",
    uncommon: "from-green-400 to-green-600", 
    rare: "from-blue-400 to-blue-600",
    epic: "from-purple-400 to-purple-600",
    legendary: "from-yellow-400 to-orange-500"
  };

  const rarityGlow = {
    common: "shadow-slate-500/20",
    uncommon: "shadow-green-500/30",
    rare: "shadow-blue-500/30", 
    epic: "shadow-purple-500/30",
    legendary: "shadow-yellow-500/40"
  };

  return (
    <div className={`relative ${earned ? '' : 'opacity-40'}`}>
      <div className={`${sizes[size]} rounded-2xl bg-gradient-to-br ${rarityColors[badge.rarity]} flex items-center justify-center shadow-lg ${rarityGlow[badge.rarity]} transition-all duration-300 hover:scale-105`}>
        <span className="text-2xl">{badge.icon}</span>
      </div>
      
      {badge.rarity === 'legendary' && (
        <Crown className="absolute -top-2 -right-2 w-5 h-5 text-yellow-400" />
      )}
      
      {earned && (
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
          <Star className="w-3 h-3 text-white fill-current" />
        </div>
      )}
    </div>
  );
}