import apiSlice from "../api/apiSlice";

export const messageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessage: builder.query({
      query: (id) => `/messages?conversationId=${id}&_sort=timestamp&_order=desc&_page=1&_limit=5`,
    }),
  }),
});

export const { useGetMessageQuery } = messageApi;
