import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminState {}

const initialState: AdminState = {};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    updateUserProfile: (
      state,
      action: PayloadAction<{ userId: number; name: string; email: string }>
    ) => {},
    togglePostPriority: (state, action: PayloadAction<number>) => {},
  },
});

export const { updateUserProfile, togglePostPriority } = adminSlice.actions;
export default adminSlice.reducer;
