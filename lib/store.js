import { configureStore } from "@reduxjs/toolkit";
import user from "./features/user/user";

export const makeStore = () => {
    return configureStore({ reducer: { user } });
}