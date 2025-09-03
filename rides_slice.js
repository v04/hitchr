import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentRide: null,
  rideHistory: [],
  activeRideRequests: [],
  nearbyPilots: [],
  rideStatus: 'idle', // idle, searching, matched, ongoing, completed
  loading: false,
  error: null,
};

const ridesSlice = createSlice({
  name: 'rides',
  initialState,
  reducers: {
    setRideStatus: (state, action) => {
      state.rideStatus = action.payload;
    },
    setCurrentRide: (state, action) => {
      state.currentRide = action.payload;
    },
    addRideRequest: (state, action) => {
      state.activeRideRequests.push(action.payload);
    },
    removeRideRequest: (state, action) => {
      state.activeRideRequests = state.activeRideRequests.filter(
        request => request.id !== action.payload
      );
    },
    setNearbyPilots: (state, action) => {
      state.nearbyPilots = action.payload;
    },
    addToHistory: (state, action) => {
      state.rideHistory.push(action.payload);
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
    resetRideState: (state) => {
      state.currentRide = null;
      state.rideStatus = 'idle';
      state.activeRideRequests = [];
      state.error = null;
    },
  },
});

export const {
  setRideStatus,
  setCurrentRide,
  addRideRequest,
  removeRideRequest,
  setNearbyPilots,
  addToHistory,
  setLoading,
  setError,
  clearError,
  resetRideState,
} = ridesSlice.actions;

export default ridesSlice.reducer;