import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    bookings: [],
  },
  reducers: {
    addBooking: (state, action) => {
      state.bookings.push(action.payload);
    },
    removeBooking: (state, action) => {
      state.bookings = state.bookings.filter(booking => booking.id !== action.payload);
    },
    clearBookings: (state) => {
      state.bookings = [];
    },
  },
});

export const { addBooking, removeBooking, clearBookings } = cartSlice.actions;
export default cartSlice.reducer;