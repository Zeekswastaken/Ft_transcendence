import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import avatarReducer from "./features/avatarSlice";
import userDataReducer from "./features/userDataSlice"; // Import the userDataReducer

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const store = configureStore({
  reducer: {
    avatarReducer,
    userDataReducer, // Include the userDataReducer
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;