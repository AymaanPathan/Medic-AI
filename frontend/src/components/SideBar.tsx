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
      className={`group relative p-2 cursor-pointer transition-all duration-200 rounded-lg mb-1.5 border border-transparent hover:border-emerald-100 ${
        activeChat === chat.id
          ? "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200"
          : "hover:bg-gradient-to-r hover:from-gray-50 hover:to-emerald-50"
      }`}
      onMouseEnter={() => setHoveredChat(chat.thread_id)}
      onMouseLeave={() => setHoveredChat(null)}
    >
      <div className="flex items-start gap-2.5">
        {/* Smaller icon */}
        <div
          className={`p-1.5 rounded-lg flex-shrink-0 transition-all duration-200 ${
            activeChat === chat.id
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
              : "bg-gray-100 text-gray-600 group-hover:bg-emerald-100 group-hover:text-emerald-600"
          }`}
        >
          <MessageCircle className="w-3.5 h-3.5" />
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
          {/* Message title - more compact */}
          <h3
            className={`font-medium text-sm truncate mb-1 ${
              activeChat === chat.id ? "text-emerald-900" : "text-gray-900"
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
              className={`flex items-center gap-0.5 transition-all duration-200 ${
                hoveredChat === chat.thread_id ? "opacity-100" : "opacity-0"
              }`}
            >
              <button className="p-1 hover:bg-emerald-100 rounded transition-colors">
                <Edit3 className="w-3 h-3 text-gray-400 hover:text-emerald-600" />
              </button>
              <button className="p-1 hover:bg-red-100 rounded transition-colors">
                <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-600" />
              </button>
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
    <div className="flex flex-col h-full bg-card border-r">
      {/* Header - More compact */}
      <div className="p-3 border-b">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Chat List - More compact scrolling */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {filteredChats.length > 0 ? (
          <div>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">
              Recent Conversations
            </h3>
            <div className="space-y-0">
              {filteredChats.map((chat, index) => (
                <ChatItem key={index} chat={chat} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No conversations yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Start a new chat to begin
            </p>
          </div>
        )}
      </div>

      {/* User Profile - More compact */}
      <div className="p-3 border-t">
        <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              John Doe
            </p>
            <p className="text-xs text-muted-foreground">Patient</p>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
