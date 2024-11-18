import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../axios/axiosConfig";

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
  liked: boolean;
  favorite: boolean;
}

interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await api.get("/posts");
  return response.data;
});

export const fetchPostsByUserId = createAsyncThunk(
  "posts/fetchPostsByUserId",
  async (userId: number) => {
    const response = await api.get(`/posts?userId=${userId}`);
    return response.data;
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost: (state, action: PayloadAction<Omit<Post, "id">>) => {
      const newPost = {
        id: state.posts.length + 1,
        ...action.payload,
      };
      state.posts.push(newPost);
    },
    deletePost: (state, action: PayloadAction<number>) => {
      const postId = action.payload;
      state.posts = state.posts.filter((post) => post.id !== postId);
    },
    toggleLike: (state, action: PayloadAction<number>) => {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post) {
        post.liked = !post.liked;
      }
    },
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post) {
        post.favorite = !post.favorite;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load posts";
      });
  },
});

export const deletePostById = (postId: number) => (dispatch: any) => {
  dispatch(deletePost(postId));
};
export const { addPost, deletePost, toggleLike, toggleFavorite } =
  postsSlice.actions;
export default postsSlice.reducer;
