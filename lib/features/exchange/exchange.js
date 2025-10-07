import { createSlice } from "@reduxjs/toolkit";

export const exchange = createSlice({
  name: "exchange",
  initialState: {
    market: null,
    allOrders: [],
    cancelledOrders: [],
    filledOrders: [],
    orderToFill: null,
    // orderToFill: {
    //   id: 11,
    //   user: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    //   tokenGet: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    //   amountGet: "10000000000000000000",
    //   tokenGive: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    //   amountGive: "10000000000000000000",
    //   timestamp: "1759508960",
    //   type: "sell",
    // },
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
} = exchange.actions;
export default exchange.reducer;
