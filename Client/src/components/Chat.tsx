import React, { useState } from "react";
import SymptomSection from "./steps/SymptomSection";
import { PersonalInfoSection } from "./steps/PersonalSection";
import { ThankYouSection } from "./steps/ThankYouSection";
import FollowUpSection from "./steps/FollowUpSection";
import { useDispatch } from "react-redux";
import type { RootDispatch } from "../store";
import { AnimatePresence, motion } from "framer-motion";

import { getPersonalInfo, startChat } from "../store/slices/chatSlice";

const Chat: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [symptoms, setSymptoms] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const dispatch: RootDispatch = useDispatch();

  const user_info = `age ${age} and gender ${gender}`;

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

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-950 text-white">
      {/* Background Layer (absolute, not fixed) */}
      <div className="absolute inset-0 z-0">
        <div className="h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-black" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            {steps[currentStep]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Step Indicators */}
      <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-2">
          {[0, 1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                step === currentStep ? "bg-blue-500 scale-125" : "bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chat;
