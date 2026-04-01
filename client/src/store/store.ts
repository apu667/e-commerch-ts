import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";

// 🔥 CUSTOM STORAGE (THIS FIXES YOUR ERROR)
const storage = {
  getItem: (key: string) => {
    return Promise.resolve(localStorage.getItem(key));
  },
  setItem: (key: string, value: string) => {
    localStorage.setItem(key, value);
    return Promise.resolve(true);
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
};

import { authSlice } from "./authSlice";
import { productSlice } from "./productSlice";
import cartReducer from "./cartSlice";
import { orderSlice } from "./orderSlice";
import { catagorySlice } from "./catagorySlice";
import userReducer from "./userSlice";

// reducers
const rootReducer = combineReducers({
  cart: cartReducer,
  user: userReducer,
  [authSlice.reducerPath]: authSlice.reducer,
  [productSlice.reducerPath]: productSlice.reducer,
  [orderSlice.reducerPath]: orderSlice.reducer,
  [catagorySlice.reducerPath]: catagorySlice.reducer,
});

// persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "user"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(authSlice.middleware)
      .concat(productSlice.middleware)
      .concat(orderSlice.middleware)
      .concat(catagorySlice.middleware),
});

// persistor
export const persistor = persistStore(store);

// types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;