import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./slices/postsSlice";
import usersReducer from "./slices/usersSlice";
import commentsReducer from "./slices/commentsSlice";
import adminReducer from "./slices/adminSlice";

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    users: usersReducer,
    comments: commentsReducer,
    admin: adminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
