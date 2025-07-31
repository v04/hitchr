import React from "react";
import { User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Zap, Plus } from "lucide-react";

export default function TokenEarner() {
  const [isEarning, setIsEarning] = React.useState(false);

  const earnTokens = async (amount, type) => {
    if (isEarning) return;
    
    setIsEarning(true);
    try {
      const user = await User.me();
      const newTokens = (user.tokens || 0) + amount;
      const currentBreakdown = user.token_breakdown || {
        travel_tokens: 0,
        eco_tokens: 0,
        social_tokens: 0,
        quest_tokens: 0
      };

      // Update the specific token type
      const newBreakdown = {
        ...currentBreakdown,
        [type]: (currentBreakdown[type] || 0) + amount
      };

      await User.updateMyUserData({
        tokens: newTokens,
        token_breakdown: newBreakdown
      });

      // Reload the page to show updated tokens
      window.location.reload();
    } catch (error) {
      console.error("Failed to earn tokens:", error);
    } finally {
      setIsEarning(false);
    }
  };

  return (
    <div className="glass rounded-3xl p-6 mb-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-yellow-400" />
        Quick Token Earner (Demo)
      </h3>
      <p className="text-slate-300 text-sm mb-4">
        Simulate earning tokens from different activities
      </p>
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => earnTokens(50, 'travel_tokens')}
          disabled={isEarning}
          className="btn-primary text-sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          Complete Ride (+50)
        </Button>
        <Button
          onClick={() => earnTokens(25, 'eco_tokens')}
          disabled={isEarning}
          className="btn-primary text-sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          Eco Ride (+25)
        </Button>
        <Button
          onClick={() => earnTokens(15, 'social_tokens')}
          disabled={isEarning}
          className="btn-primary text-sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          Social Share (+15)
        </Button>
        <Button
          onClick={() => earnTokens(100, 'quest_tokens')}
          disabled={isEarning}
          className="btn-primary text-sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          Quest Complete (+100)
        </Button>
      </div>
    </div>
  );
}