import React, { useEffect, useState } from "react";
import SymptomSection from "./steps/SymptomSection";
import { PersonalInfoSection } from "./steps/PersonalSection";
import { ThankYouSection } from "./steps/ThankYouSection";
import FollowUpSection from "./steps/FollowUpSection";
import { useDispatch } from "react-redux";
import type { RootDispatch } from "../store";
import { AnimatePresence, motion } from "framer-motion";
import { io } from "socket.io-client";

import { getPersonalInfo, startChat } from "../store/slices/chatSlice";
const socket = io("http://127.0.0.1:8000");
const Chat: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [symptoms, setSymptoms] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const dispatch: RootDispatch = useDispatch();
  const [diagnosis, setDiagnosis] = useState({
    diseaseName: "",
    diseaseSummary: "",
    whyYouHaveThis: "",
    whatToDoFirst: "",
    medicines: [],
    lifestyleChanges: [],
    dangerSigns: [],
  });
  useEffect(() => {
    socket.on("diagnosis_chunk", (data) => {
      console.log("Received diagnosis chunk:", data);
      if (data.text) {
        setDiagnosis({
          diseaseName: data.text.diseaseName,
          diseaseSummary: data.text.diseaseSummary,
          whyYouHaveThis: data.text.whyYouHaveThis,
          whatToDoFirst: data.text.whatToDoFirst,
          medicines: data.text.medicines,
          lifestyleChanges: data.text.lifestyleChanges,
          dangerSigns: data.text.dangerSigns,
        });
      }
    });

    socket.on("diagnosis_done", (data) => {
      console.log("✅ Diagnosis complete:", data);
    });

    return () => {
      socket.off("diagnosis_chunk");
      socket.off("diagnosis_done");
    };
  }, []);
  const user_info = `age ${age} and gender ${gender}`;

  const startDiagnosis = (finalPrompt: string) => {
    setDiagnosis({
      diseaseName: "",
      diseaseSummary: "",
      whyYouHaveThis: "",
      whatToDoFirst: "",
      medicines: [],
      lifestyleChanges: [],
      dangerSigns: [],
    }); // clear old diagnosis
    socket.emit("start_diagnosis", { finalPrompt });
  };

  const nextStep = (): void => {
    if (currentStep === 0) {
      dispatch(startChat({ sessionId: "1", userSymptoms: symptoms }));
    }
    if (currentStep === 1) {
      dispatch(getPersonalInfo({ sessionId: "1", user_info }));
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const restart = (): void => {
    setCurrentStep(0);
    setSymptoms("");
    setAge("");
    setGender("");
  };

  const steps = [
    <SymptomSection
      symptoms={symptoms}
      setSymptoms={setSymptoms}
      onNext={nextStep}
    />,
    <PersonalInfoSection
      age={age}
      setAge={setAge}
      gender={gender}
      setGender={setGender}
      onNext={nextStep}
      onBack={prevStep}
    />,
    <FollowUpSection />,
    <ThankYouSection onRestart={restart} />,
  ];
  console.log("diagnosis", diagnosis);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-950 text-white">
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => startDiagnosis("User has fever and cough for 3 days...")}
      >
        Start Diagnosis
      </button>
    </div>
  );
};

export default Chat;
