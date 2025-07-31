import React, { useState } from "react";
import { Car, UserCheck } from "lucide-react";

export default function RoleToggle({ currentRole, onRoleChange }) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleToggle = async (newRole) => {
    if (newRole === currentRole || isTransitioning) return;
    
    setIsTransitioning(true);
    await onRoleChange(newRole);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className="glass rounded-2xl p-2 flex">
      <button
        onClick={() => handleToggle('rider')}
        className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
          currentRole === 'rider'
            ? 'glass-active text-blue-400'
            : 'text-slate-300 glass-hover'
        }`}
        disabled={isTransitioning}
      >
        <UserCheck className="w-5 h-5" />
        <span className="font-medium">Rider</span>
      </button>
      
      <button
        onClick={() => handleToggle('pilot')}
        className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
          currentRole === 'pilot'
            ? 'glass-active text-blue-400'
            : 'text-slate-300 glass-hover'
        }`}
        disabled={isTransitioning}
      >
        <Car className="w-5 h-5" />
        <span className="font-medium">Pilot</span>
      </button>
    </div>
  );
}