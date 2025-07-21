import { useState } from "react";
import {
  Plus,
  MessageCircle,
  Clock,
  MoreHorizontal,
  Trash2,
  Edit3,
} from "lucide-react";
import type { RootDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { clearChat, getMessagesByThreadId } from "@/store/slices/chat.slice";
import {
  setCurrentUserThreadId,
  storeInitalThread,
} from "@/store/slices/thread.slice";
import { Ichat } from "@/models/chat";

const Sidebar = () => {
  const [activeChat, setActiveChat] = useState<string | number | null>(null);
  const dispatch: RootDispatch = useDispatch();
  const [hoveredChat, setHoveredChat] = useState<string | number | null>(null);
  const messages = useSelector((state: RootState) => state.chat.message);
  const messageForSideBar = useSelector(
    (state: RootState) => state.chat.sidebarMessage
  );

  const handleNewChat = async () => {
    dispatch(clearChat());
    if (messages.length > 0) {
      await dispatch(storeInitalThread());
    }
  };
  const getMessagesBySideBarId = async (thread_id: number) => {
    await dispatch(getMessagesByThreadId(thread_id));
    dispatch(setCurrentUserThreadId(thread_id));
  };

  const filteredChats = messageForSideBar as unknown as Ichat[];

  const ChatItem = ({ chat }: { chat: Ichat }) => (
    <div
      className={`group relative p-2 cursor-pointer transition-all duration-200 rounded-2xl mb-2 border border-transparent hover:border-emerald-100 ${
        activeChat === chat.id
          ? "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-sm"
          : "hover:bg-gradient-to-r hover:from-gray-50 hover:to-emerald-50"
      }`}
      onMouseEnter={() => setHoveredChat(chat.thread_id)}
      onMouseLeave={() => setHoveredChat(null)}
    >
      <div className="flex items-start space-x-3">
        <div
          className={`p-2 rounded-xl flex-shrink-0 transition-all duration-200 ${
            activeChat === chat.id
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
              : "bg-gray-100 text-gray-600 group-hover:bg-emerald-100 group-hover:text-emerald-600"
          }`}
        >
          <MessageCircle className="w-4 h-4" />
        </div>

        <div
          onClick={() => {
            setActiveChat(chat.thread_id);
            if (typeof chat.thread_id === "number" && chat.thread_id !== null) {
              getMessagesBySideBarId(chat.thread_id);
            }
          }}
          className="flex-1 min-w-0"
        >
          <div className="flex items-center justify-between mb-1">
            <h3
              className={`font-medium text-sm truncate ${
                activeChat === chat.id ? "text-emerald-900" : "text-gray-900"
              }`}
            >
              {chat.message}
            </h3>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">
                {new Date(chat.time_stamp).toLocaleString()}
              </span>
            </div>

            <div
              className={`flex items-center space-x-1 transition-all duration-200 ${
                hoveredChat === chat.thread_id ? "opacity-100" : "opacity-0"
              }`}
            >
              <button className="p-1 hover:bg-emerald-100 rounded-lg transition-colors">
                <Edit3 className="w-3 h-3 text-gray-400 hover:text-emerald-600" />
              </button>
              <button className="p-1 hover:bg-red-100 rounded-lg transition-colors">
                <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-600" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreHorizontal className="w-3 h-3 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="p-6 border-b border-gray-100">
        {/* New Chat Button */}
        <button
          onClick={handleNewChat}
          className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>New Consultation</span>
        </button>
      </div>

      {/* Enhanced Scrollable Area with Tailwind Scrollbar */}
      <div className="flex-1 overflow-y-auto px-4 py-3 custom-scrollbar">
        {filteredChats.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
              Recent
            </h3>
            {filteredChats.map((chat: Ichat, index) => (
              <ChatItem key={index} chat={chat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
