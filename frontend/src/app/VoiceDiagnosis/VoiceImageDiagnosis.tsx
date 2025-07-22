import type { RootDispatch, RootState } from "@/store";
import { analyzeImageAndVoiceThunk } from "@/store/slices/diagnosis.slice";
import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Upload,
  Image,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  Camera,
  Mic,
  Brain,
  Sparkles,
} from "lucide-react";

const VoiceImageDiagnosis: React.FC = () => {
  const dispatch: RootDispatch = useDispatch();
  const { diagnosis, audioUrl, loading, error } = useSelector(
    (state: RootState) => state.chat
  );

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [typedSymptoms, setTypedSymptoms] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSymptomsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 1000) {
      setTypedSymptoms(value);
      setCharCount(value.length);
    }
  };

  const handleSubmit = async () => {
    if (!imageFile || !typedSymptoms.trim()) {
      return;
    }

    // Convert text to a Blob so it mimics voice file
    const blob = new Blob([typedSymptoms], { type: "text/plain" });
    const audioFile = new File([blob], "typed_symptoms.txt", {
      type: "text/plain",
    });

    dispatch(analyzeImageAndVoiceThunk({ imageFile, audioFile }));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-[0_20px_50px_rgb(0,0,0,0.08)] border border-gray-100/50 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-8 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full border border-white/30">
              <Brain className="w-4 h-4" />
              <span className="text-sm font-medium">AI Visual Diagnosis</span>
            </div>
            <h2 className="text-3xl font-bold">Upload & Analyze</h2>
            <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
              Combine visual evidence with symptom description for comprehensive
              AI-powered medical insights
            </p>
          </div>
          <div className="absolute top-4 right-4 opacity-20">
            <Sparkles className="w-8 h-8" />
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                imageFile
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-gray-50 border-gray-200 text-gray-500"
              }`}
            >
              <Camera className="w-4 h-4" />
              <span className="text-sm font-medium">Image Upload</span>
              {imageFile && <CheckCircle className="w-4 h-4" />}
            </div>
            <div className="w-8 h-0.5 bg-gray-200 rounded-full">
              <div
                className={`h-full bg-emerald-500 rounded-full transition-all duration-500 ${
                  imageFile ? "w-full" : "w-0"
                }`}
              ></div>
            </div>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                typedSymptoms
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-gray-50 border-gray-200 text-gray-500"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">Symptoms</span>
              {typedSymptoms && <CheckCircle className="w-4 h-4" />}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Image Upload Section */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                <Image className="w-5 h-5 inline mr-2" />
                Medical Image
              </label>

              {!imagePreview ? (
                <div
                  onClick={triggerFileInput}
                  className="relative border-2 border-dashed border-gray-300 rounded-2xl p-8 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all cursor-pointer group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-emerald-200 transition-colors">
                      <Upload className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        Click to upload image
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        PNG, JPG, JPEG up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-200">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                    <div className="p-4 flex gap-2 w-full">
                      <button
                        onClick={triggerFileInput}
                        className="px-4 py-2 bg-white/90 hover:bg-white text-gray-800 rounded-lg text-sm font-medium transition-colors"
                      >
                        Change Image
                      </button>
                      <button
                        onClick={removeImage}
                        className="px-4 py-2 bg-red-500/90 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Symptoms Section */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                <Mic className="w-5 h-5 inline mr-2" />
                Symptom Description
              </label>

              <div className="relative">
                <textarea
                  value={typedSymptoms}
                  onChange={handleSymptomsChange}
                  rows={8}
                  placeholder="Describe your symptoms in detail. For example: 'I notice redness and swelling around the affected area that started 3 days ago. It's tender to touch and seems to be getting worse...'"
                  className="w-full p-4 text-base border-2 border-gray-200 rounded-2xl resize-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-200 bg-gray-50/50 focus:bg-white placeholder-gray-400 leading-relaxed"
                />
                <div className="absolute bottom-4 right-4">
                  <span
                    className={`text-xs font-medium ${
                      charCount > 800
                        ? "text-red-500"
                        : charCount > 600
                        ? "text-amber-500"
                        : "text-gray-400"
                    }`}
                  >
                    {charCount}/1000
                  </span>
                </div>
              </div>

              <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-xl border border-blue-200">
                💡 <strong>Tip:</strong> Include onset, duration, severity,
                triggers, and any treatments you&apos;ve tried
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              onClick={handleSubmit}
              disabled={!imageFile || !typedSymptoms.trim() || loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold py-5 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/25 transform hover:-translate-y-1 disabled:hover:transform-none flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Analyze with AI
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-800 mb-1">
                    Analysis Error
                  </h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {diagnosis && (
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-emerald-800">
                  AI Analysis Results
                </h3>
              </div>
              <div className="prose prose-emerald max-w-none">
                <div className="text-gray-800 leading-relaxed whitespace-pre-line bg-white/50 p-4 rounded-xl border border-emerald-200">
                  {diagnosis}
                </div>
              </div>
            </div>
          )}

          {audioUrl && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <Mic className="w-5 h-5" />
                Audio Response
              </h3>
              <audio
                controls
                className="w-full"
                src={`http://localhost:8000${audioUrl}`}
              />
            </div>
          )}

          {/* Disclaimer */}
          <div className="pt-6 border-t border-gray-200">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs text-amber-800 text-center leading-relaxed font-medium">
                ⚠️ <strong>Medical Disclaimer:</strong> This AI analysis is for
                informational purposes only and should not replace professional
                medical advice. Always consult with healthcare professionals for
                proper diagnosis and treatment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceImageDiagnosis;
