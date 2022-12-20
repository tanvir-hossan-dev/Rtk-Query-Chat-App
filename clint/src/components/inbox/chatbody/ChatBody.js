// import Blank from "./Blank";
import ChatHead from "./ChatHead";
import Messages from "./Messages";
import Options from "./Options";
import { useGetMessageQuery } from "../../../features/message/messageApi";
import { useParams } from "react-router-dom";
import Error from "../../ui/Error";

export default function ChatBody() {
  const { id } = useParams();
  const { data: messages, error, isLoading, isError } = useGetMessageQuery(id);
  let content = null;

  if (isLoading) {
    content = <div>Loading......</div>;
  } else if (!isLoading && isError) {
    content = <Error message="There was an error!" />;
  } else if (!isLoading && !isError && messages?.length === 0) {
    content = <div>No message found</div>;
  } else if (!isLoading && !isError && messages?.length > 0) {
    content = (
      <div>
        {" "}
        <ChatHead message={messages[0]} />
        <Messages messages={messages} />
        <Options info={messages[0]} />
      </div>
    );
  }
  return (
    <div className="w-full lg:col-span-2 lg:block">
      <div className="w-full grid conversation-row-grid">{content}</div>
    </div>
  );
}
