import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import userReducer from "./slices/userSlice"
import buildingReducer from "./slices/buildingSlice"

import navigationReducer from "./slices/navigationSlice";


const reducer = {
  user: userReducer,
  navigation: navigationReducer,
  building: buildingReducer
};

export const store = configureStore({
  reducer,
  // devTools: process.env.NODE_ENV === "development",
  devTools: true,
});

// export type of root state from reducers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
