import React, { useState, useEffect } from "react";
import { User, Reward } from "@/entities/all";
import { Gift, Zap, ShoppingBag, Coffee, Plane, Shirt, Check, X } from "lucide-react";

export default function Rewards() {
  const [currentUser, setCurrentUser] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(null);
  const [redeemSuccess, setRedeemSuccess] = useState(null);

  useEffect(() => {
    loadRewardsData();
  }, []);

  const loadRewardsData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);

      const rewardsList = await Reward.list();
      setRewards(rewardsList);
    } catch (error) {
      console.error("Failed to load rewards data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All', icon: Gift },
    { id: 'food', name: 'Food', icon: Coffee },
    { id: 'travel', name: 'Travel', icon: Plane },
    { id: 'clothing', name: 'Clothing', icon: Shirt },
    { id: 'gear', name: 'Gear', icon: ShoppingBag },
    { id: 'voucher', name: 'Vouchers', icon: Gift }
  ];

  const filteredRewards = selectedCategory === 'all' ?
    rewards :
    rewards.filter((reward) => reward.category === selectedCategory);

  const canAfford = (cost) => (currentUser?.tokens || 0) >= cost;

  const handleRedeem = async (reward) => {
    if (!canAfford(reward.token_cost) || redeeming) return;

    setRedeeming(reward.id);
    try {
      // Deduct tokens from user and add redemption history
      const newTokens = (currentUser.tokens || 0) - reward.token_cost;
      const newRedemption = {
        reward_id: reward.id,
        reward_name: reward.name,
        tokens_spent: reward.token_cost,
        redeemed_at: new Date().toISOString()
      };

      await User.updateMyUserData({ 
        tokens: newTokens,
        redeemed_rewards: [...(currentUser.redeemed_rewards || []), newRedemption]
      });

      // Update reward stock if applicable
      if (reward.stock_available > 0) {
        await Reward.update(reward.id, {
          stock_available: reward.stock_available - 1
        });
      }

      // Update local state
      setCurrentUser(prev => ({ 
        ...prev, 
        tokens: newTokens,
        redeemed_rewards: [...(prev.redeemed_rewards || []), newRedemption]
      }));

      // Show success message
      setRedeemSuccess(reward.id);
      setTimeout(() => setRedeemSuccess(null), 3000);

      // Refresh rewards list to get updated stock
      loadRewardsData();
    } catch (error) {
      console.error("Failed to redeem reward:", error);
    } finally {
      setRedeeming(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {Array(6).fill(0).map((_, i) =>
            <div key={i} className="glass rounded-3xl p-6 animate-pulse">
              <div className="h-32 bg-white/10 rounded-2xl"></div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Rewards Store</h1>
          <p className="text-slate-300">Exchange your tokens for amazing rewards</p>
        </div>

        {/* Token Balance */}
        <div className="glass rounded-3xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400/80 to-orange-500/80 flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl text-white font-bold">
                  {(currentUser?.tokens || 0).toLocaleString()}
                </h2>
                <p className="text-slate-300">Available Tokens</p>
              </div>
            </div>
            
            {/* Recent Redemptions Count */}
            <div className="text-right">
              <div className="text-lg font-bold text-cyan-400">
                {currentUser?.redeemed_rewards?.length || 0}
              </div>
              <div className="text-sm text-slate-300">Items Redeemed</div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="glass rounded-3xl p-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) =>
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-200 ${
                  selectedCategory === category.id ? 'glass-active text-white' : 'glass-hover text-slate-300'
                }`}
              >
                <category.icon className="w-4 h-4" />
                <span className="font-medium">{category.name}</span>
              </button>
            )}
          </div>
        </div>

        {/* Rewards Grid */}
        {filteredRewards.length > 0 ?
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards.map((reward) => {
              const affordable = canAfford(reward.token_cost);
              const isRedeeming = redeeming === reward.id;
              const isSuccess = redeemSuccess === reward.id;
              const outOfStock = reward.stock_available <= 0;

              return (
                <div key={reward.id} className="glass rounded-3xl p-5 flex flex-col">
                  <div className="aspect-video bg-white/5 rounded-2xl mb-4 flex items-center justify-center overflow-hidden">
                    {reward.image_url ?
                      <img src={reward.image_url} alt={reward.name} className="w-full h-full object-cover rounded-2xl" /> :
                      <Gift className="w-12 h-12 text-slate-500" />
                    }
                  </div>

                  <div className="flex-grow mb-4">
                    <h3 className="text-lg font-bold text-white mb-1">{reward.name}</h3>
                    <p className="text-slate-300 text-sm line-clamp-2">{reward.description}</p>
                    {reward.partner_brand &&
                      <p className="text-cyan-400 text-xs font-medium mt-1">by {reward.partner_brand}</p>
                    }
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="font-bold text-white">{reward.token_cost}</span>
                      <span className="text-slate-400 text-sm">tokens</span>
                    </div>

                    <button
                      onClick={() => handleRedeem(reward)}
                      disabled={!affordable || isRedeeming || outOfStock}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                        isSuccess 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : outOfStock
                            ? 'bg-slate-600/30 text-slate-500 cursor-not-allowed'
                          : affordable && !isRedeeming
                            ? 'btn-primary' 
                            : 'bg-slate-600/30 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {isSuccess ? (
                        <>
                          <Check className="w-4 h-4" />
                          Redeemed!
                        </>
                      ) : isRedeeming ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Redeeming...
                        </>
                      ) : outOfStock ? (
                        'Out of Stock'
                      ) : affordable ? (
                        'Redeem'
                      ) : (
                        `Need ${reward.token_cost - (currentUser?.tokens || 0)} more`
                      )}
                    </button>
                  </div>

                  {/* Stock and Value Info */}
                  <div className="pt-3 border-t border-white/10 text-xs text-slate-400 space-y-1">
                    <div className="flex justify-between">
                      <span>Stock Available:</span>
                      <span className={outOfStock ? 'text-red-400' : reward.stock_available < 10 ? 'text-orange-400' : ''}>
                        {reward.stock_available}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Real Value:</span>
                      <span className="text-green-400">₹{reward.real_value}</span>
                    </div>
                  </div>

                  {reward.stock_available > 0 && reward.stock_available < 10 && (
                    <div className="mt-3 pt-3 border-t border-orange-500/20">
                      <p className="text-xs text-orange-400 flex items-center gap-1">
                        ⚠️ Only {reward.stock_available} left in stock!
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div> :

          <div className="glass rounded-3xl p-12 text-center">
            <Gift className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No rewards available</h3>
            <p className="text-slate-400">Check back soon for new rewards in this category</p>
          </div>
        }

        {/* Redemption History */}
        {currentUser?.redeemed_rewards && currentUser.redeemed_rewards.length > 0 && (
          <div className="glass rounded-3xl p-6 mt-8">
            <h2 className="text-xl font-bold text-white mb-4">Recent Redemptions</h2>
            <div className="space-y-3">
              {currentUser.redeemed_rewards.slice(-5).reverse().map((redemption, index) => (
                <div key={index} className="glass-inset rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{redemption.reward_name}</h3>
                    <p className="text-sm text-slate-400">
                      {new Date(redemption.redeemed_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Zap className="w-4 h-4" />
                    <span className="font-medium">-{redemption.tokens_spent}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}