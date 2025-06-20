import { ImageIcon, MessageCircle, Stethoscope } from "lucide-react";
import React from "react";

type SidebarProps = {
  selected: string;
  onSelect: (section: string) => void;
};

const SideBar: React.FC<SidebarProps> = ({ selected, onSelect }) => {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 w-72 bg-white shadow-2xl flex flex-col justify-between transition-all duration-300 border-r border-green-100">
      <div>
        <div className="flex items-center gap-3 px-8 py-8 border-b border-green-100">
          <div className="p-3 bg-green-100 rounded-full">
            <Stethoscope className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-green-800 tracking-tight">
              Medic AI
            </h1>
            <p className="text-green-500 text-xs mt-1">Health Assistant</p>
          </div>
        </div>
        <nav className="flex flex-col gap-2 mt-8 px-4">
          <button
            className={`flex items-center gap-4 px-6 py-4 rounded-xl text-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-200 focus:bg-green-50 hover:bg-green-100 text-green-800 ${
              selected === "chat" ? "bg-green-50 ring-2 ring-green-200" : ""
            }`}
            onClick={() => onSelect("chat")}
          >
            <MessageCircle className="w-6 h-6" /> Chat
          </button>
          <button
            className={`flex items-center gap-4 px-6 py-4 rounded-xl text-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-200 focus:bg-green-50 hover:bg-green-100 text-green-800 ${
              selected === "upload" ? "bg-green-50 ring-2 ring-green-200" : ""
            }`}
            onClick={() => onSelect("upload")}
          >
            <ImageIcon className="w-6 h-6" /> Upload Image & Get Diagnosis
          </button>
        </nav>
      </div>
      <div className="px-8 py-6 border-t border-green-100 text-green-400 text-xs bg-white">
        <p>© {new Date().getFullYear()} Medic AI. All rights reserved.</p>
      </div>
    </aside>
  );
};
export default SideBar;
