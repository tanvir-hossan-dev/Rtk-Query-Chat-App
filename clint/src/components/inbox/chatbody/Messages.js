import { useSelector } from "react-redux";
import Message from "./Message";

export default function Messages({ messages = [] }) {
  const auth = useSelector((state) => state.auth);
  const { user } = auth;
  const { email: loggedInEmail } = user || {};
  return (
    <div className="relative w-full h-[calc(100vh_-_197px)] p-6 overflow-y-auto flex flex-col-reverse">
      <ul className="space-y-2">
        {messages
          .slice()
          .sort((a, b) => a.timestamp - b.timestamp)
          .map((message) => {
            const { message: lastMessage, id } = message;

            const justify = loggedInEmail === message.sender.email ? "end" : "start";

            return <Message key={id} justify={justify} message={lastMessage} />;
          })}
      </ul>
    </div>
  );
}
