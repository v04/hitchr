import { configureStore } from '@reduxjs/toolkit';
import ridesReducer from './slices/ridesSlice';
import tokensReducer from './slices/tokensSlice';
import socialReducer from './slices/socialSlice';

export const store = configureStore({
  reducer: {
    rides: ridesReducer,
    tokens: tokensReducer,
    social: socialReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});