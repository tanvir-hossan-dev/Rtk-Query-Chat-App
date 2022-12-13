import apiSlice from "../api/apiSlice";

export const messageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessage: builder.query({
      query: (id) => `/messages?conversationId=${id}&_sort=timestamp&_order=desc&_page=1&_limit=5`,
    }),
    addMessage: builder.mutation({
      query: (data) => ({
        url: "messages",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetMessageQuery, useAddMessageMutation } = messageApi;
