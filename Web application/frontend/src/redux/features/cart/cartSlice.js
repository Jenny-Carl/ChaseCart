// cartSlice.js
import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  products: [],        // [{ id, name, price, quantity }]
  selectedItems: 0,
  totalPrice: 0,
  tax: 0,
  taxRate: 0.15,       // 15%
  grandTotal: 0,
};

const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

const updateTotals = (state) => {
  const qty = state.products.reduce((sum, p) => sum + (p.quantity || 0), 0);
  const total = state.products.reduce(
    (sum, p) => sum + ((p.price || 0) * (p.quantity || 0)),
    0
  );
  state.selectedItems = qty;
  state.totalPrice = round2(total);
  state.tax = round2(state.totalPrice * (state.taxRate || 0));
  state.grandTotal = round2(state.totalPrice + state.tax);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = state.products.find(p => p.id === action.payload.id);
      if (!item) {
        state.products.push({ ...action.payload, quantity: 1 });
      } else {
        item.quantity = (item.quantity || 0) + 1;
      }
      updateTotals(state);
    },

    incrementQuantity: (state, action) => {
      const item = state.products.find(p => p.id === action.payload.id);
      if (item) {
        item.quantity = (item.quantity || 0) + 1;
      }
      updateTotals(state);
    },

    decrementQuantity: (state, action) => {
      const id = action.payload.id;
      const item = state.products.find(p => p.id === id);
      if (item) {
        item.quantity = (item.quantity || 0) - 1;
        if (item.quantity <= 0) {
          state.products = state.products.filter(p => p.id !== id);
        }
      }
      updateTotals(state);
    },

    removeFromCart: (state, action) => {
      state.products = state.products.filter(p => p.id !== action.payload.id);
      updateTotals(state);
    },

    clearCart: (state) => {
      state.products = [];
      state.selectedItems = 0;
      state.totalPrice = 0;
      state.tax = 0;
      state.grandTotal = 0;
    },

    setTaxRate: (state, action) => {
      const rate = Number(action.payload);
      state.taxRate = Number.isFinite(rate) && rate >= 0 ? rate : state.taxRate;
      updateTotals(state);
    },
  },
});

// Selectors
export const selectCartProducts = (state) => state.cart.products;

export const selectCartTotals = createSelector(
  (state) => state.cart,
  (cart) => ({
    selectedItems: cart.selectedItems,
    totalPrice: cart.totalPrice,
    tax: cart.tax,
    grandTotal: cart.grandTotal,
    taxRate: cart.taxRate,
  })
);

export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
  setTaxRate,
} = cartSlice.actions;

export default cartSlice.reducer;
