import { useState } from "react";
import {
  Plus,
  MessageCircle,
  Clock,
  MoreHorizontal,
  Trash2,
  Edit3,
  MessageSquare,
  User,
  ChevronDown,
  Stethoscope,
  Settings,
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

  // Function to truncate message text
  const truncateMessage = (text: string, maxLength: number = 30) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Function to format time more compactly
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;

    if (diffInHours < 1) {
      return `${Math.round(diffInHours * 60)}m`;
    } else if (diffInHours < 24) {
      return `${Math.round(diffInHours)}h`;
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const ChatItem = ({ chat }: { chat: Ichat }) => (
    <div
      className={`group relative p-2 cursor-pointer transition-all duration-200 rounded-lg mb-1.5 `}
      onMouseEnter={() => setHoveredChat(chat.thread_id)}
      onMouseLeave={() => setHoveredChat(null)}
    >
      <div className="flex items-start gap-2.5">
        <div
          onClick={() => {
            setActiveChat(chat.thread_id);
            if (typeof chat.thread_id === "number" && chat.thread_id !== null) {
              getMessagesBySideBarId(chat.thread_id);
            }
          }}
          className="flex-1 min-w-0"
        >
          {/* Message title - more compact */}
          <h3
            className={`text-sm  ${
              activeChat === chat.id ? "text-white" : "text-gray-200"
            }`}
            title={chat.message}
          >
            {truncateMessage(chat.message, 35)}
          </h3>

          {/* Time and actions row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">
                {formatTime(chat.time_stamp)}
              </span>
            </div>

            {/* Action buttons - only show on hover */}
            <div
              className={`flex items-center gap-0.5 transition-all duration-200`}
            >
              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                <MoreHorizontal className="w-3 h-3 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex overflow-y-scroll scrollbar-thin bg-black/95 backdrop-blur-xl flex-col h-full border-r ">
      {/* Header - Modern styling */}
      <div className="p-4 border-b border-white/10">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5  text-white cursor-pointer hover-bg-white/10 transition-colors duration-200 rounded-lg group"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Chat List - Enhanced scrolling */}
      <div className="flex-1    px-3 py-4">
        {filteredChats.length > 0 ? (
          <div>
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4 px-2">
              Recent Conversations
            </h3>
            <div className="space-y-1">
              {filteredChats.map((chat, index) => (
                <ChatItem key={index} chat={chat} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6 text-gray-500" />
            </div>
            <p className="text-sm text-gray-300 font-medium mb-1">
              No conversations yet
            </p>
            <p className="text-xs text-gray-500">
              Start a new chat to begin your medical consultation
            </p>
          </div>
        )}
      </div>

      {/* User Profile - Premium styling */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all duration-200 group">
          <div className="relative">
            <div className="w-8 h-8  rounded-full flex items-center justify-center shadow-lg">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate group-hover:text-gray-100 transition-colors">
              John Doe
            </p>
            <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
              Patient • Online
            </p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-300 flex-shrink-0 transition-all duration-200 group-hover:rotate-180" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
