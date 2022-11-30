import apiSlice from "../api/apiSlice";
import { userLogedIn } from "./authSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        const result = await queryFulfilled;
        try {
          localStorage.setItem(
            "auth",
            JSON.stringify({
              accessToken: result.data.accessToken,
              user: result.data.user,
            })
          );
          dispatch(userLogedIn({ accessToken: result.data.accessToken, user: result.data.user }));
        } catch (err) {}
      },
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        const result = await queryFulfilled;
        try {
          localStorage.setItem(
            "auth",
            JSON.stringify({
              accessToken: result.data.accessToken,
              user: result.data.user,
            })
          );
          dispatch(userLogedIn({ accessToken: result.data.accessToken, user: result.data.user }));
        } catch (err) {}
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
