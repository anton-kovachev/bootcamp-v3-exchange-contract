import { get } from "lodash";

export const selectAccount = state => get(state, "user.account", null);
export const selectETHBalance = state => get(state, "user.balance", null);