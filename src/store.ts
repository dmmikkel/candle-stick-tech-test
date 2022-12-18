import { configureStore } from '@reduxjs/toolkit';
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from '@reduxjs/toolkit/query';
import { alphaVantageApi } from './services/alpha-vantage';

export const store = configureStore({
  reducer: {
    [alphaVantageApi.reducerPath]: alphaVantageApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(alphaVantageApi.middleware),
});

setupListeners(store.dispatch);
