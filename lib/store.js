import { configureStore } from "@reduxjs/toolkit";
import user from "./features/user/user";
import tokens from "./features/tokens/tokens";

export const makeStore = () => {
    return configureStore({ reducer: { user, tokens } });
}