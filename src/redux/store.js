import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../../src/redux/CartSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});