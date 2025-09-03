import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  totalTokens: 0,
  tokenHistory: [],
  achievements: [],
  badges: [],
  currentStreak: 0,
  longestStreak: 0,
  loading: false,
  error: null,
};

const tokensSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    setTotalTokens: (state, action) => {
      state.totalTokens = action.payload;
    },
    addTokens: (state, action) => {
      const { amount, source, rideId } = action.payload;
      state.totalTokens += amount;
      state.tokenHistory.push({
        id: Date.now().toString(),
        amount,
        source,
        rideId,
        timestamp: new Date().toISOString(),
      });
    },
    redeemTokens: (state, action) => {
      const { amount, reward } = action.payload;
      if (state.totalTokens >= amount) {
        state.totalTokens -= amount;
        state.tokenHistory.push({
          id: Date.now().toString(),
          amount: -amount,
          source: 'redemption',
          reward,
          timestamp: new Date().toISOString(),
        });
      }
    },
    addAchievement: (state, action) => {
      state.achievements.push({
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    addBadge: (state, action) => {
      if (!state.badges.includes(action.payload)) {
        state.badges.push(action.payload);
      }
    },
    updateStreak: (state, action) => {
      state.currentStreak = action.payload;
      if (action.payload > state.longestStreak) {
        state.longestStreak = action.payload;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setTotalTokens,
  addTokens,
  redeemTokens,
  addAchievement,
  addBadge,
  updateStreak,
  setLoading,
  setError,
  clearError,
} = tokensSlice.actions;

export default tokensSlice.reducer;