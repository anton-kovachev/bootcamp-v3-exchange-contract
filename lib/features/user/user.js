import { createSlice } from "@reduxjs/toolkit";

export const user = createSlice({
    name: "user",
    initialState:
    {
        account: null,
        balance: 0
    },
    reducers:
    {
        setAccount: (state, action) => {
            state.account = action.payload;
        },
        setBalance: (state, action) => {
            state.balance = action.payload;
        }
    }
})

export const { setAccount, setBalance } = user.actions;
export default user.reducer;
