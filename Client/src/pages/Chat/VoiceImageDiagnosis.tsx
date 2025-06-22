import type { RootDispatch, RootState } from "@/store";
import { analyzeImageAndVoiceThunk } from "@/store/slices/chatSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const VoiceImageDiagnosis: React.FC = () => {
  const dispatch: RootDispatch = useDispatch();
  const { diagnosis, audioUrl, loading, error } = useSelector(
    (state: RootState) => state.chat
  );

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [typedSymptoms, setTypedSymptoms] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImageFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!imageFile || !typedSymptoms.trim()) {
      alert("Please upload an image and describe your symptoms.");
      return;
    }

    // Convert text to a Blob so it mimics voice file
    const blob = new Blob([typedSymptoms], { type: "text/plain" });
    const audioFile = new File([blob], "typed_symptoms.txt", {
      type: "text/plain",
    });

    dispatch(analyzeImageAndVoiceThunk({ imageFile, audioFile }));
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-md p-6 rounded-xl space-y-4">
      <h2 className="text-2xl font-semibold text-center text-green-700">
        AI Medical Diagnosis
      </h2>

      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Upload Image:
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Describe your symptoms:
        </label>
        <textarea
          value={typedSymptoms}
          onChange={(e) => setTypedSymptoms(e.target.value)}
          rows={4}
          placeholder="e.g., I have rashes and redness around my nose"
          className="w-full border px-3 py-2 rounded resize-none"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Submit
      </button>

      {loading && <p className="text-blue-600">Analyzing...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {diagnosis && (
        <div className="mt-4 p-4 border rounded-lg bg-green-50">
          <h3 className="font-bold text-green-800 mb-2">Diagnosis:</h3>
          <p className="text-gray-800 whitespace-pre-line">{diagnosis}</p>
        </div>
      )}

      {audioUrl && (
        <audio
          controls
          className="w-full mt-4"
          src={`http://localhost:8000${audioUrl}`}
        />
      )}
    </div>
  );
};

export default VoiceImageDiagnosis;
