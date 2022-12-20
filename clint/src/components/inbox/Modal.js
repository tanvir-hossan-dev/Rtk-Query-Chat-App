import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  conversationApi,
  useAddConversationMutation,
  useEditConversationMutation,
} from "../../features/conversations/conversatonsApi";
import { useGetUserQuery } from "../../features/user/userApi";
import isValidEmail from "../../utils/isValidEmail";
import Error from "../ui/Error";

export default function Modal({ open, control }) {
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [responseError, setResponseError] = useState("");
  const [conversation, setConversation] = useState(undefined);
  const [userCheck, setUserCheck] = useState(false);
  const { user: loggedInUser } = useSelector((state) => state.auth) || {};
  const { email: myEmail } = loggedInUser || {};
  const dispatch = useDispatch();

  const { data: participant } = useGetUserQuery(to, {
    skip: !userCheck,
  });

  const [addConversation, { isSuccess: isAddConversationSuccess }] = useAddConversationMutation();
  const [editConversation, { isSuccess: isEditConversationSUccess }] = useEditConversationMutation();

  const debounceHandler = (fn, delay) => {
    let timeOutId;

    return (...args) => {
      clearTimeout(timeOutId);
      timeOutId = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };

  const doSearch = (value) => {
    if (isValidEmail(value)) {
      setUserCheck(true);
      setTo(value);
    }
  };

  const handleChange = debounceHandler(doSearch, 500);
  useEffect(() => {
    if (participant?.length > 0 && participant[0].email !== myEmail) {
      dispatch(conversationApi.endpoints.getConversation.initiate({ userEmail: myEmail, participentEmail: to }))
        .unwrap()
        .then((data) => {
          setConversation(data);
        })
        .catch(() => setResponseError("There was an error!"));
    }
  }, [participant, dispatch, myEmail, to]);

  useEffect(() => {
    if (isAddConversationSuccess || isEditConversationSUccess) {
      control();
    }
  }, [isEditConversationSUccess, isAddConversationSuccess]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (conversation?.length > 0) {
      console.log("edit");
      editConversation({
        id: conversation[0].id,
        sender: myEmail,
        data: {
          participants: `${myEmail}-${participant[0].email}`,
          users: [loggedInUser, participant[0]],
          message,
          timestamp: new Date().getTime(),
        },
      });
      setMessage("");
    } else if (conversation?.length === 0) {
      console.log("add");
      addConversation({
        sender: myEmail,
        data: {
          participants: `${myEmail}-${participant[0].email}`,
          users: [loggedInUser, participant[0]],
          message,
          timestamp: new Date().getTime(),
        },
      });
      setMessage("");
    }
  };

  return (
    open && (
      <>
        <div onClick={control} className="fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer"></div>
        <div className="rounded w-[400px] lg:w-[600px] space-y-8 bg-white p-10 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Send message</h2>
          <form className="mt-8 space-y-6" action="#" onSubmit={handleSubmit} method="POST">
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="to" className="sr-only">
                  To
                </label>
                <input
                  id="to"
                  name="to"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Send to"
                  onChange={(e) => handleChange(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  type="message"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Message"
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={
                  conversation === undefined ||
                  message === "" ||
                  (participant?.length > 0 && participant[0].email === myEmail)
                }
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              >
                Send Message
              </button>
            </div>

            {participant?.length === 0 && <Error message="This user does not found!" />}
            {participant?.length > 0 && participant[0].email === myEmail && (
              <Error message="You can not send message to youself!" />
            )}
            {responseError && <Error message={responseError} />}
          </form>
        </div>
      </>
    )
  );
}
