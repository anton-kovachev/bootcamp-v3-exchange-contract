import { createSlice } from "@reduxjs/toolkit";

export const exchange = createSlice({
    name: "exchange",
    initialState:
    {
        market: null
    },
    reducers:
    {
        setMarket: (state, action) => {
            state.market = action.payload;
        },
    }
})

export const { setMarket } = exchange.actions;
export default exchange.reducer;
