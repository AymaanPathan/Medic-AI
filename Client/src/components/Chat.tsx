import React, { useState } from "react";
import SymptomSection from "./steps/SymptomSection";
import { PersonalInfoSection } from "./steps/PersonalSection";
import { ThankYouSection } from "./steps/ThankYouSection";

const Chat: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [symptoms, setSymptoms] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("");

  const nextStep = (): void => {
    if (currentStep < 2) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-gray-900"></div>
      <div className="fixed inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>

      {/* Content Container */}
      <div className="relative">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentStep * 100}%)` }}
        >
          {/* Step 1: Symptoms */}
          <div className="w-full flex-shrink-0">
            <SymptomSection
              symptoms={symptoms}
              setSymptoms={setSymptoms}
              onNext={nextStep}
            />
          </div>

          {/* Step 2: Personal Info */}
          <div className="w-full flex-shrink-0">
            <PersonalInfoSection
              age={age}
              setAge={setAge}
              gender={gender}
              setGender={setGender}
              onNext={nextStep}
              onBack={prevStep}
            />
          </div>

          {/* Step 3: Thank You */}
          <div className="w-full flex-shrink-0">
            <ThankYouSection onRestart={restart} />
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex space-x-2">
          {[0, 1, 2].map((step) => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                step <= currentStep ? "bg-blue-500 scale-125" : "bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chat;
