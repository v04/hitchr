
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MapPin, Gift, BookOpen, Trophy, Compass, Target } from "lucide-react";

export default function QuickActions({ currentRole }) {
  const actions = [
    {
      title: currentRole === 'pilot' ? 'Offer a Ride' : 'Find a Ride',
      description: currentRole === 'pilot' ? 'Share your journey' : 'Get a lift',
      icon: MapPin,
      color: 'from-blue-400 to-blue-600',
      url: createPageUrl('Map'),
    },
    {
      title: 'Explore Trails',
      description: 'Discover scenic routes',
      icon: Compass,
      color: 'from-purple-400 to-purple-600',
      url: createPageUrl('Trails'),
    },
    {
      title: 'Browse Rewards',
      description: 'Spend your tokens',
      icon: Gift,
      color: 'from-green-400 to-green-600',
      url: createPageUrl('Rewards'),
    },
    {
      title: 'Join Quests',
      description: 'Complete challenges',
      icon: Target,
      color: 'from-orange-400 to-orange-600',
      url: createPageUrl('Quests'),
    },
    {
      title: 'Share Story',
      description: 'Tell your adventure',
      icon: BookOpen,
      color: 'from-cyan-400 to-cyan-600',
      url: createPageUrl('Stories'),
    },
    {
      title: 'View Rankings',
      description: 'Check leaderboard',
      icon: Trophy,
      color: 'from-yellow-400 to-orange-500',
      url: createPageUrl('Leaderboard'),
    },
  ];

  return (
    <div className="glass rounded-3xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6 text-glow">Quick Actions</h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.url}
            className="glass rounded-2xl p-4 glass-hover text-center transition-all duration-300"
          >
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${action.color} flex items-center justify-center mx-auto mb-3`}>
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-slate-200 mb-1 text-sm lg:text-base">
              {action.title}
            </h3>
            <p className="text-slate-300 text-xs">{action.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
