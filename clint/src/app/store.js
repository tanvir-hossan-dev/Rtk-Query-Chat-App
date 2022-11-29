import { configureStore } from "@reduxjs/toolkit";
import apiSlice from "../features/api/apiSlice";
import authSlice from "../features/auth/authSlice";
import conversatonSlice from "../features/conversations/conversatonSlice";
import messageSlice from "../features/message/messageSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
    conversations: conversatonSlice,
    messages: messageSlice,
  },
  middleware: (defaultMiddlewares) => defaultMiddlewares().concat(apiSlice.middleware),
});
