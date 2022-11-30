import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: undefined,
  user: undefined,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    userLogedIn: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },
    userLogedOut: (state, action) => {
      state.accessToken = undefined;
      state.user = undefined;
    },
  },
});

export const { userLogedIn, userLogedOut } = authSlice.actions;
export default authSlice.reducer;
