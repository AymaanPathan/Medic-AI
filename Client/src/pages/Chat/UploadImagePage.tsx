import { ImageIcon } from "lucide-react";
import React from "react";
const UploadImagePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="bg-white border border-green-100 rounded-xl shadow-lg p-10 flex flex-col items-center">
        <ImageIcon className="w-16 h-16 text-green-400 mb-4" />
        <h2 className="text-2xl font-bold text-green-800 mb-2">Upload Image</h2>
        <p className="text-green-600 mb-6">
          Upload a medical image (e.g., X-ray, skin photo) to get an AI-powered
          diagnosis.
        </p>
        <input type="file" className="mb-4" accept="image/*" />
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
          Analyze Image
        </button>
        <div className="text-xs text-gray-500 text-center mt-6 p-3 bg-gray-50 rounded-lg">
          <p className="font-semibold">⚠️ Important Disclaimer</p>
          <p>
            This feature is for demonstration only. Do not rely on AI image
            analysis for medical decisions.
          </p>
        </div>
      </div>
    </div>
  );
};
export default UploadImagePage;
