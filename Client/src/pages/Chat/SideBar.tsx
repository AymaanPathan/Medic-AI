import React, { useState } from "react";
import {
  Plus,
  MessageCircle,
  Clock,
  Star,
  Settings,
  User,
  Search,
  MoreHorizontal,
  Trash2,
  Edit3,
  Pin,
} from "lucide-react";

const Sidebar = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredChat, setHoveredChat] = useState(null);

  const chatHistory = [
    {
      id: 1,
      title: "Medical Consultation Query",
      preview: "Can you help me understand my symptoms?",
      timestamp: "2 hours ago",
      isPinned: true,
      isStarred: false,
    },
    {
      id: 2,
      title: "Dietary Recommendations",
      preview: "What foods should I avoid with diabetes?",
      timestamp: "Yesterday",
      isPinned: false,
      isStarred: true,
    },
    {
      id: 3,
      title: "Exercise Routine Planning",
      preview: "Help me create a workout schedule",
      timestamp: "2 days ago",
      isPinned: false,
      isStarred: false,
    },
    {
      id: 4,
      title: "Sleep Health Assessment",
      preview: "I've been having trouble sleeping lately",
      timestamp: "3 days ago",
      isPinned: false,
      isStarred: false,
    },
    {
      id: 5,
      title: "Stress Management Tips",
      preview: "How can I reduce work-related stress?",
      timestamp: "1 week ago",
      isPinned: false,
      isStarred: false,
    },
    {
      id: 6,
      title: "Medication Information",
      preview: "Tell me about potential side effects",
      timestamp: "1 week ago",
      isPinned: false,
      isStarred: false,
    },
    {
      id: 7,
      title: "Nutrition Guidance",
      preview: "What vitamins should I take daily?",
      timestamp: "1 week ago",
      isPinned: false,
      isStarred: false,
    },
    {
      id: 8,
      title: "Mental Health Support",
      preview: "Dealing with anxiety and depression",
      timestamp: "2 weeks ago",
      isPinned: false,
      isStarred: false,
    },
    {
      id: 9,
      title: "Physical Therapy Questions",
      preview: "Exercises for back pain relief",
      timestamp: "2 weeks ago",
      isPinned: false,
      isStarred: false,
    },
    {
      id: 10,
      title: "Preventive Care Planning",
      preview: "What health screenings do I need?",
      timestamp: "3 weeks ago",
      isPinned: false,
      isStarred: false,
    },
    {
      id: 11,
      title: "Allergy Management",
      preview: "How to manage seasonal allergies",
      timestamp: "3 weeks ago",
      isPinned: false,
      isStarred: false,
    },
    {
      id: 12,
      title: "Skin Care Consultation",
      preview: "Treatment for acne and skin issues",
      timestamp: "1 month ago",
      isPinned: false,
      isStarred: false,
    },
    {
      id: 13,
      title: "Heart Health Assessment",
      preview: "Understanding cholesterol levels",
      timestamp: "1 month ago",
      isPinned: false,
      isStarred: false,
    },
    {
      id: 14,
      title: "Weight Management Plan",
      preview: "Healthy weight loss strategies",
      timestamp: "1 month ago",
      isPinned: false,
      isStarred: false,
    },
    {
      id: 15,
      title: "Women's Health Topics",
      preview: "Hormonal health questions",
      timestamp: "2 months ago",
      isPinned: false,
      isStarred: false,
    },
  ];

  const handleNewChat = () => {
    setActiveChat(null);
    console.log("Starting new consultation...");
  };

  const filteredChats = chatHistory.filter(
    (chat) =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedChats = filteredChats.filter((chat) => chat.isPinned);
  const regularChats = filteredChats.filter((chat) => !chat.isPinned);

  const ChatItem = ({ chat }) => (
    <div
      className={`group relative p-2 cursor-pointer transition-all duration-200 rounded-2xl mb-2 border border-transparent hover:border-emerald-100 ${
        activeChat === chat.id
          ? "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-sm"
          : "hover:bg-gradient-to-r hover:from-gray-50 hover:to-emerald-50"
      }`}
      onMouseEnter={() => setHoveredChat(chat.id)}
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

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3
              className={`font-medium text-sm truncate ${
                activeChat === chat.id ? "text-emerald-900" : "text-gray-900"
              }`}
            >
              {chat.title}
            </h3>
          </div>

          <p
            className={`text-xs truncate mb-2 ${
              activeChat === chat.id ? "text-emerald-700" : "text-gray-600"
            }`}
          >
            {chat.preview}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">{chat.timestamp}</span>
            </div>

            <div
              className={`flex items-center space-x-1 transition-all duration-200 ${
                hoveredChat === chat.id ? "opacity-100" : "opacity-0"
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
        {regularChats.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
              Recent
            </h3>
            {regularChats.map((chat) => (
              <ChatItem key={chat.id} chat={chat} />
            ))}
          </div>
        )}

        {filteredChats.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              {searchQuery ? "No conversations found" : "No conversations yet"}
            </h3>
            <p className="text-xs text-gray-400 max-w-48 mx-auto">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Start a new consultation to begin your health journey"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
