import type { CartItem, CartState } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: CartState = {
  cart: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state: CartState, action: PayloadAction<CartItem>) => {
      const existingItem = state.cart.find(
        (item) => item._id.toString() === action.payload._id.toString()
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cart.push(action.payload);
      }
    },

    incrementQuantity: (state: CartState, action: PayloadAction<string>) => {
      const item = state.cart.find((i) => i._id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },

    decrementQuantity: (state: CartState, action: PayloadAction<string>) => {
      const item = state.cart.find((i) => i._id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.cart = state.cart.filter((i) => i._id !== action.payload);
        }
      }
    },

    removeFromCart: (state: CartState, action: PayloadAction<string>) => {
      state.cart = state.cart.filter((i) => i._id !== action.payload);
    },

    clearCart: (state: CartState) => {
      state.cart = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  incrementQuantity,
  decrementQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;