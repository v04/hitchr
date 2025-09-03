import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  feed: [],
  myStories: [],
  communities: [],
  following: [],
  followers: [],
  loading: false,
  error: null,
};

const socialSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {
    setFeed: (state, action) => {
      state.feed = action.payload;
    },
    addToFeed: (state, action) => {
      state.feed.unshift(action.payload);
    },
    setMyStories: (state, action) => {
      state.myStories = action.payload;
    },
    addStory: (state, action) => {
      state.myStories.unshift(action.payload);
    },
    setCommunities: (state, action) => {
      state.communities = action.payload;
    },
    joinCommunity: (state, action) => {
      const community = state.communities.find(c => c.id === action.payload.id);
      if (community) {
        community.isMember = true;
        community.memberCount += 1;
      }
    },
    leaveCommunity: (state, action) => {
      const community = state.communities.find(c => c.id === action.payload.id);
      if (community) {
        community.isMember = false;
        community.memberCount -= 1;
      }
    },
    likePost: (state, action) => {
      const post = state.feed.find(p => p.id === action.payload);
      if (post) {
        post.isLiked = !post.isLiked;
        post.likes += post.isLiked ? 1 : -1;
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
  setFeed,
  addToFeed,
  setMyStories,
  addStory,
  setCommunities,
  joinCommunity,
  leaveCommunity,
  likePost,
  setLoading,
  setError,
  clearError,
} = socialSlice.actions;

export default socialSlice.reducer;