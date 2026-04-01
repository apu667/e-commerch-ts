// hooks.ts
import type { TypedUseSelectorHook } from "react-redux"; // ✅ type-only import
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";

// typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;