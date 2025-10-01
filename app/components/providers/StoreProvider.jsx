"use client";
import { useRef } from "react";
import { makeStore } from "@/lib/store";
import { Provider } from "react-redux";

export default function storeProvider({ children }) {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
