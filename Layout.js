
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  MapPin, 
  Home, 
  Trophy, 
  Gift, 
  BookOpen, 
  User,
  Car,
  Compass,
  Zap
} from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  const navigationItems = [
    {
      title: "Dashboard",
      url: createPageUrl("Dashboard"),
      icon: Home,
    },
    {
      title: "Map",
      url: createPageUrl("Map"),
      icon: MapPin,
    },
    {
      title: "Trails",
      url: createPageUrl("Trails"),
      icon: Compass,
    },
    {
      title: "Rewards",
      url: createPageUrl("Rewards"),
      icon: Gift,
    },
    {
      title: "Stories",
      url: createPageUrl("Stories"),
      icon: BookOpen,
    },
    {
      title: "Leaderboard",
      url: createPageUrl("Leaderboard"),
      icon: Trophy,
    },
    {
      title: "Profile",
      url: createPageUrl("Profile"),
      icon: User,
    },
  ];

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(160deg, #0d1222 0%, #1f1d3e 40%, #3d1b3d 70%, #1a1f3a 100%)'}}>
      <style>
        {`
          :root {
            --glass-bg: rgba(22, 28, 45, 0.5);
            --glass-border: rgba(255, 255, 255, 0.1);
            --glass-shadow: rgba(0, 0, 0, 0.35);
            --accent-glow: #00aaff;
            --text-primary: #ffffff;
            --text-secondary: #e2e8f0;
            --text-muted: #94a3b8;
          }
          
          .glass {
            background: var(--glass-bg);
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            border: 1px solid var(--glass-border);
            box-shadow: 0 8px 32px var(--glass-shadow);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .glass-hover:hover {
            background: rgba(30, 38, 60, 0.6);
            transform: translateY(-2px);
            box-shadow: 0 12px 48px var(--glass-shadow);
          }
          
          .glass-active {
            background: rgba(0, 170, 255, 0.15);
            border-color: rgba(0, 170, 255, 0.3);
            box-shadow: 0 0 20px rgba(0, 170, 255, 0.2);
          }
          
          .glass-inset {
            background: rgba(0, 0, 0, 0.25);
            box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.5);
          }
          
          .text-glow {
            text-shadow: 0 0 8px var(--accent-glow);
          }
          
          .btn-primary {
            background: rgba(0, 170, 255, 0.2);
            border: 1px solid rgba(0, 170, 255, 0.4);
            color: var(--text-primary);
            transition: all 0.2s ease-in-out;
          }
          .btn-primary:hover {
            background: rgba(0, 170, 255, 0.3);
            box-shadow: 0 0 15px rgba(0, 170, 255, 0.3);
            transform: translateY(-1px);
          }
          .btn-primary:disabled {
            background: rgba(50, 50, 50, 0.3);
            border-color: rgba(255, 255, 255, 0.1);
            color: var(--text-muted);
            cursor: not-allowed;
            transform: translateY(0);
            box-shadow: none;
          }

          .floating-orb {
            position: absolute;
            border-radius: 50%;
            filter: blur(40px);
            pointer-events: none;
            animation: float 6s ease-in-out infinite;
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          
          .orb-1 {
            top: 10%;
            left: 20%;
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, rgba(0, 170, 255, 0.2), transparent);
            animation-delay: 0s;
          }
          
          .orb-2 {
            top: 60%;
            right: 15%;
            width: 150px;
            height: 150px;
            background: radial-gradient(circle, rgba(139, 92, 246, 0.15), transparent);
            animation-delay: 2s;
          }
          
          .orb-3 {
            bottom: 20%;
            left: 10%;
            width: 180px;
            height: 180px;
            background: radial-gradient(circle, rgba(6, 182, 212, 0.25), transparent);
            animation-delay: 4s;
          }
          /* Hide scrollbar for mobile nav */
          .mobile-nav-scroll::-webkit-scrollbar {
            display: none;
          }
          .mobile-nav-scroll {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
        `}
      </style>

      {/* Floating Background Orbs */}
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>
      <div className="floating-orb orb-3"></div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4">
        <div className="glass rounded-3xl px-2 py-3">
          <div className="flex justify-start items-center gap-2 overflow-x-auto mobile-nav-scroll">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-300 flex-shrink-0 w-20 ${
                    isActive ? 'glass-active' : ''
                  }`}
                >
                  <item.icon 
                    className={`w-5 h-5 mb-1 ${
                      isActive ? 'text-cyan-300' : 'text-slate-300'
                    }`} 
                  />
                  <span className={`text-xs text-center font-medium ${
                    isActive ? 'text-white' : 'text-slate-400'
                  }`}>
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <div className="w-72 min-h-screen p-6">
          <div className="glass rounded-3xl p-6 h-full">
            {/* Logo */}
            <div className="flex items-center gap-4 mb-8">
              <div className="glass rounded-2xl p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                <Car className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">HITCH</h1>
                <p className="text-sm text-slate-300">Community Rides</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2 mb-8">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <Link
                    key={item.title}
                    to={item.url}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
                      isActive 
                        ? 'glass-active text-white' 
                        : 'text-slate-300 glass-hover'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-cyan-300' : ''}`} />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Quick Stats */}
            <div className="glass-inset rounded-2xl p-5">
              <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Tokens</span>
                  <span className="font-medium text-yellow-400">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Rides</span>
                  <span className="font-medium text-green-400">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">RTO Plates</span>
                  <span className="font-medium text-blue-400">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Streak</span>
                  <span className="font-medium text-orange-400">0 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          {children}
        </div>
      </div>

      {/* Mobile Main Content */}
      <div className="md:hidden pb-28">
        {children}
      </div>
    </div>
  );
}
