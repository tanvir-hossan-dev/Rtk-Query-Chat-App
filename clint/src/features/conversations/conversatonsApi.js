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

      // async onQueryStarted(arg, { queryFulfilled, dispatch }) {
      //   const conversation = await queryFulfilled;
      //   console.log(conversation);
      //   if (conversation?.data?.id) {
      //     const users = arg.data.users;
      //     console.log(users);
      //     const senderUser = users.find((user) => user.email === arg.sender);
      //     const reciverUser = users.find((user) => user.email !== arg.sender);
      //     console.log("i'm add");
      //     dispatch(
      //       messageApi.endpoints.addConversation.initiate({
      //         conversationId: conversation.data.id,
      //         sender: senderUser,
      //         reciver: reciverUser,
      //         message: arg.data.message,
      //         timestamp: arg.data.timestamp,
      //       })
      //     );
      //   }
      // },

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
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
      },
    }),
    editConversation: builder.mutation({
      query: ({ id, sender, data }) => ({
        url: `/conversations/${id}`,
        method: "PATCH",
        body: data,
      }),
      // async onQueryStarted(arg, { queryFulfilled, dispatch }) {
      //   const conversation = await queryFulfilled;
      //   console.log(conversation);
      //   if (conversation?.data?.id) {
      //     const users = arg?.data?.users;
      //     console.log(users);
      //     console.log("i'm edit");
      //     const senderUser = users.find((user) => user.email === arg.sender);
      //     const reciverUser = users.find((user) => user.email !== arg.sender);
      //     dispatch(
      //       messageApi.endpoints.addConversation.initiate({
      //         conversationId: conversation?.data?.id,
      //         sender: senderUser,
      //         reciver: reciverUser,
      //         message: arg.data.message,
      //         timestamp: arg.data.timestamp,
      //       })
      //     );
      //   }
      // },
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
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
