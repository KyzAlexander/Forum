import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface User {
//   id: number;
//   name: string;
//   email: string;
//   address: string;
//   phone: string;
// }

interface AuthState {
  isAuthenticated: boolean;
  userRole: "user" | "admin" | null;
  // currentUser: User | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userRole: null,
  // currentUser: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ role: "user" | "admin" }>) => {
      state.isAuthenticated = true;
      state.userRole = action.payload.role;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userRole = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
