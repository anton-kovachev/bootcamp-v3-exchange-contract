import { createSlice } from "@reduxjs/toolkit";

export const exchange = createSlice({
    name: "exchange",
    initialState:
    {
        market: null,
        allOrders: [],
        cancelledOrders: [],
        filledOrders: []
    },
    reducers:
    {
        setMarket: (state, action) => {
            state.market = action.payload;
        },

        setAllOrders: (state, action) => {
            state.allOrders = action.payload;
        },

        setCancelledOrders: (state, action) => {
            state.cancelledOrders = action.payload
        },

        setFilledOrders: (state, action) => {
            state.filledOrders = action.payload;
        }
    }
})

export const { setMarket, setAllOrders, setCancelledOrders, setFilledOrders } = exchange.actions;
export default exchange.reducer;
