import { useSelector } from "react-redux";
import { useGetConversationsQuery } from "../../features/conversations/conversatonsApi";
import Error from "../ui/Error";
import ChatItem from "./ChatItem";
import moment from "moment";
import getPartnerInfo from "../../utils/getPartnerInfo";
import gravatarUrl from "gravatar-url";
import { Link } from "react-router-dom";

export default function ChatItems() {
  const { user } = useSelector((state) => state.auth);
  const { email } = user || {};
  const { data: conversations, error, isLoading, isError } = useGetConversationsQuery(email);

  let content = null;

  if (isLoading) {
    content = <li className="m-2 text-center">Loading..... </li>;
  } else if (!isLoading && isError) {
    content = (
      <li className="m-2 text-center">
        <Error message="There was an erro" />
      </li>
    );
  } else if (!isLoading && !isError && conversations?.length === 0) {
    content = <li className="m-2 text-center">No conversation found! </li>;
  } else if (!isLoading && !isError && conversations?.length > 0) {
    content = conversations.map((conversation) => {
      const { message, timestamp, id } = conversation;
      console.log(id);
      const { email: partnerEmail, name } = getPartnerInfo(conversation.users, email);

      return (
        <li key={id} className="list-none">
          <Link to={`inbox/${id}`}>
            <ChatItem
              avatar={gravatarUrl(partnerEmail, { size: 80 })}
              name={name}
              lastMessage={message}
              lastTime={moment(timestamp).fromNow()}
            />
          </Link>
        </li>
      );
    });
  }

  return <ul>{content}</ul>;
}
