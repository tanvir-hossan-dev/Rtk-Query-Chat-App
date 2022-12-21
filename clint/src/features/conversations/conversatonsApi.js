import apiSlice from "../api/apiSlice";
import { messageApi } from "../message/messageApi";

export const conversationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: (email) => `/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=1&_limit=5`,
    }),
    getConversation: builder.query({
      query: ({ userEmail, participentEmail }) =>
        `/conversations?participants_like=${userEmail}-${participentEmail}&&participants_like=${participentEmail}-${userEmail}`,
    }),
    addConversation: builder.mutation({
      query: ({ sender, data }) => ({
        url: "/conversations",
        method: "POST",
        body: data,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        //  optomistic cach update start
        // const conversation = await queryFulfilled;
        // const patchResult1 = dispatch(
        //   apiSlice.util.updateQueryData("getConversations", arg.sender, (draft) => {
        //     const draftConversations = draft.find((c) => c.id == conversation?.data?.id);
        //     draftConversations.message = arg.data.message;
        //     draftConversations.timestamp = arg.data.timestamp;
        //   })
        // );

        //  optomistic cach update end

        try {
          const conversation = await queryFulfilled;
          if (conversation?.data?.id) {
            // silent entry to message table
            const users = arg.data.users;
            const senderUser = users.find((user) => user.email === arg.sender);
            const receiverUser = users.find((user) => user.email !== arg.sender);

            dispatch(
              messageApi.endpoints.addMessage.initiate({
                conversationId: conversation?.data?.id,
                sender: senderUser,
                receiver: receiverUser,
                message: arg.data.message,
                timestamp: arg.data.timestamp,
              })
            );
          }
        } catch (err) {
          // patchResult1.undo();
        }
      },
    }),
    editConversation: builder.mutation({
      query: ({ id, sender, data }) => ({
        url: `/conversations/${id}`,
        method: "PATCH",
        body: data,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        //  optomistic cach update start

        const patchResult1 = dispatch(
          apiSlice.util.updateQueryData("getConversations", arg.sender, (draft) => {
            const draftConversations = draft.find((c) => c.id == arg.id);
            draftConversations.message = arg.data.message;
            draftConversations.timestamp = arg.data.timestamp;
          })
        );

        //  optomistic cach update end

        try {
          const conversation = await queryFulfilled;
          if (conversation?.data?.id) {
            // silent entry to message table
            const users = arg.data.users;
            const senderUser = users.find((user) => user.email === arg.sender);
            const receiverUser = users.find((user) => user.email !== arg.sender);

            const res = await dispatch(
              messageApi.endpoints.addMessage.initiate({
                conversationId: conversation?.data?.id,
                sender: senderUser,
                receiver: receiverUser,
                message: arg.data.message,
                timestamp: arg.data.timestamp,
              })
            ).unwrap();

            dispatch(
              apiSlice.util.updateQueryData("getMessage", res.conversationId.toString(), (draft) => {
                draft.push(res);
              })
            );
          }
        } catch (err) {
          patchResult1.undo();
        }
      },
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useAddConversationMutation,
  useEditConversationMutation,
} = conversationApi;
