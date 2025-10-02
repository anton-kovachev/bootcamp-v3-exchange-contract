import { createSlice, configureStore } from "@reduxjs/toolkit";

export const tokens = createSlice({
    name: "tokens",
    initialState:
    {
        tokens: [],
        balances: {}
    },
    reducers:
    {
        setTokens: (state, action) => {
            state.tokens[action.payload.index] = (action.payload);
        },
        setBalance: (state, action) => {
            state.balances[action.payload.address] = { wallet: action.payload.wallet, exchange: action.payload.exchange }
        }
    }
})

export const { setTokens, setBalance } = tokens.actions;
export default tokens.reducer;
