import Transition from "../utils/Transition";

const colors = {
  success: "bg-green-600",
  error: "bg-red-600",
  warning: "bg-yellow-500",
  info: "bg-blue-600",
};

export default function Notification({ show, message, type, onClose }) {
  return (
    <Transition
      show={show}
      enter="transition duration-300"
      enterStart="opacity-0 translate-y-4"
      enterEnd="opacity-100 translate-y-0"
      leave="transition duration-200"
      leaveStart="opacity-100"
      leaveEnd="opacity-0"
      tag="div"
      className="fixed top-6 right-6 z-50"
    >
      <div
        className={`text-white px-4 py-3 rounded-lg shadow-xl ${colors[type]}`}
      >
        <p className="text-sm">{message}</p>
      </div>
    </Transition>
  );
}
