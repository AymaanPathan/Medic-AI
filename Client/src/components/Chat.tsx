import { useLocation, useNavigate } from "react-router-dom";
import type { Message } from "@/types/interfaces";
import { useEffect } from "react";

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state || !location.state.messages) {
      navigate("/symptoms-checker");
    }
  }, [location, navigate]);

  const messages = location.state?.messages ?? [];

  return (
    <div className="min-h-screen bg-green-50 p-6 flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-green-700 text-center">
        Consultation Summary
      </h2>

      {messages.map((message: Message) => (
        <div
          key={message.id}
          className={`flex gap-4 ${
            message.type === "user" ? "flex-row-reverse" : ""
          } items-start`}
        >
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white ${
              message.type === "user"
                ? "bg-green-600"
                : "bg-green-200 text-green-800"
            }`}
          >
            {message.type === "user" ? "U" : "AI"}
          </div>
          <div
            className={`rounded-xl px-6 py-4 max-w-xl ${
              message.type === "user"
                ? "bg-green-600 text-white"
                : message.type === "bot-diagnosis"
                ? "bg-white border border-green-200"
                : "bg-green-100 text-green-800"
            }`}
          >
            {/* {message.type === "bot-diagnosis" &&
            typeof message.content !== "string" ? (
              <DiagnosisCard diagnosis={message.content as Diagnosis} />
            ) : (
              <p>{message.content}</p>
            )} */}
            <p className="text-xs mt-2 text-gray-500">
              {new Date(message.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chat;
