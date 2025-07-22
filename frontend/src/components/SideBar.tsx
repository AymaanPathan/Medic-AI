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
    <div className="flex flex-col h-full bg-card border-r">
      {/* Header */}
      <div className="p-4 border-b">
        {/* New Chat Button */}
        <button
          onClick={handleNewChat}
          className="w-full cursor-pointer  flex items-center justify-center space-x-2 px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-3">
        {filteredChats.length > 0 ? (
          <div>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-2">
              Recent
            </h3>
            {filteredChats.map((chat, index) => (
              <ChatItem key={index} chat={chat} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No conversations found
            </p>
          </div>
        )}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors">
          <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">John Doe</p>
            <p className="text-xs text-muted-foreground">Patient</p>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
