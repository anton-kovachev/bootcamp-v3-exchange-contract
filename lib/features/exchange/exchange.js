import { createSlice } from "@reduxjs/toolkit";

export const exchange = createSlice({
  name: "exchange",
  initialState: {
    market: null,
    allOrders: [],
    cancelledOrders: [],
    filledOrders: [],
    orderToFill: null,
    flashLoans: [],
  },
  reducers: {
    setMarket: (state, action) => {
      state.market = action.payload;
    },

    setAllOrders: (state, action) => {
      state.allOrders = action.payload;
    },

    setCancelledOrders: (state, action) => {
      state.cancelledOrders = action.payload;
    },

    setFilledOrders: (state, action) => {
      state.filledOrders = action.payload;
    },

    addNewOrder: (state, action) => {
      state.allOrders[action.payload.id - 1] = action.payload;
    },

    cancelOrder: (state, action) => {
      state.cancelledOrders[action.payload.id - 1] = action.payload;
    },

    setOrderToFill: (state, action) => {
      state.orderToFill = action.payload;
    },

    addNewFilledOrder: (state, action) => {
      state.filledOrders[action.payload.id - 1] = action.payload;
    },

    setFlashLoans: (state, action) => {
      state.flashLoans = action.payload;
    },

    addNewFlashLoan: (state, action) => {
      state.flashLoans = [...state.flashLoans, action.payload];
    },
  },
});

export const {
  setMarket,
  setAllOrders,
  setCancelledOrders,
  setFilledOrders,
  addNewOrder,
  cancelOrder,
  setOrderToFill,
  addNewFilledOrder,
  setFlashLoans,
  addNewFlashLoan,
} = exchange.actions;
export default exchange.reducer;
