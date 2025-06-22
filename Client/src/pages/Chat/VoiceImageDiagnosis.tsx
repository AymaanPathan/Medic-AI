import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootDispatch, RootState } from "@/store";
import { analyzeImageAndVoiceThunk } from "@/store/slices/chatSlice";

const VoiceImageDiagnosis: React.FC = () => {
  const dispatch: RootDispatch = useDispatch();
  const { diagnosis, audioUrl, loading, error } = useSelector(
    (state: RootState) => state.chat
  );

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImageFile(e.target.files[0]);
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const audioFile = new File([audioBlob], "voice_note.wav", {
        type: "audio/wav",
      });

      if (imageFile) {
        dispatch(
          analyzeImageAndVoiceThunk({
            imageFile,
            audioFile,
          })
        );
      } else {
        alert("Please upload an image first.");
      }
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
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

      <div className="flex items-center space-x-4">
        <button
          onClick={startRecording}
          disabled={recording}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          🎤 Start Recording
        </button>
        <button
          onClick={stopRecording}
          disabled={!recording}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          🛑 Stop
        </button>
      </div>

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
