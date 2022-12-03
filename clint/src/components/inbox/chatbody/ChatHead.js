import { useSelector } from "react-redux";
import gravatarUrl from "gravatar-url";

export default function ChatHead({ message }) {
  const { sender, reciver } = message;
  const { user } = useSelector((state) => state.auth);
  const partnerEmail = sender.email === user.email ? reciver.email : sender.email;
  const partnerName = sender.email === user.email ? reciver.name : sender.name;
  return (
    <div className="relative flex items-center p-3 border-b border-gray-300">
      <img className="object-cover w-10 h-10 rounded-full" src={gravatarUrl(partnerEmail)} />
      <span className="block ml-2 font-bold text-gray-600">{partnerName}</span>
    </div>
  );
}
