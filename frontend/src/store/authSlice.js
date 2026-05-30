import { createSlice } from '@reduxjs/toolkit';

// Retrieve initial state from localStorage
const storedUser = localStorage.getItem('user');
const storedToken = localStorage.getItem('token');

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    authSuccess: (state, action) => {
      state.loading = false;
      state.user = {
        _id: action.payload._id,
        name: action.payload.name,
        email: action.payload.email,
        role: action.payload.role,
        avatar: action.payload.avatar,
      };
      state.token = action.payload.token;
      state.isAuthenticated = true;
      
      localStorage.setItem('user', JSON.stringify(state.user));
      localStorage.setItem('token', state.token);
    },
    authFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    updateProfileSuccess: (state, action) => {
      state.user = {
        ...state.user,
        name: action.payload.name,
        email: action.payload.email,
        role: action.payload.role,
        avatar: action.payload.avatar || state.user.avatar,
      };
      if (action.payload.token) {
        state.token = action.payload.token;
        localStorage.setItem('token', state.token);
      }
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    updateAvatarSuccess: (state, action) => {
      if (state.user) {
        state.user.avatar = action.payload;
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  },
});

export const {
  authStart,
  authSuccess,
  authFailure,
  logout,
  updateProfileSuccess,
  updateAvatarSuccess,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
