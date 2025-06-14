import React, { useState } from "react";
import {
  ChevronRight,
  User,
  Calendar,
  Stethoscope,
  CheckCircle,
  Sparkles,
} from "lucide-react";

// TypeScript interfaces
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface CardDescriptionProps {
  children: React.ReactNode;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface SymptomSectionProps {
  symptoms: string;
  setSymptoms: (symptoms: string) => void;
  onNext: () => void;
}

interface PersonalInfoSectionProps {
  age: string;
  setAge: (age: string) => void;
  gender: string;
  setGender: (gender: string) => void;
  onNext: () => void;
  onBack: () => void;
}

interface ThankYouSectionProps {
  onRestart: () => void;
}

// Input Component
const Input: React.FC<InputProps> = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${className}`}
    {...props}
  />
);

// Button Component
const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "default",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    default:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105",
    outline:
      "border border-gray-700 bg-transparent text-white hover:bg-gray-800",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Card Components
const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div
    className={`rounded-lg border border-gray-800 bg-gray-900/50 backdrop-blur shadow-xl ${className}`}
  >
    {children}
  </div>
);
const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = "",
}) => (
  <div className={`flex flex-col space-y-1.5 p-6 pb-4 ${className}`}>
    {children}
  </div>
);

const CardTitle: React.FC<CardTitleProps> = ({ children, className = "" }) => (
  <h3
    className={`text-2xl font-semibold leading-none tracking-tight text-white ${className}`}
  >
    {children}
  </h3>
);

const CardDescription: React.FC<CardDescriptionProps> = ({ children }) => (
  <p className="text-sm text-gray-400">{children}</p>
);
const CardContent: React.FC<CardContentProps> = ({
  children,
  className = "",
}) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;

// Symptom Input Section
const SymptomSection: React.FC<SymptomSectionProps> = ({
  symptoms,
  setSymptoms,
  onNext,
}) => (
  <div className="w-full min-h-screen flex items-center justify-center p-4">
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-600/20 rounded-full">
            <Stethoscope className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <CardTitle className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Describe Your Symptoms
        </CardTitle>
        <CardDescription>
          Tell us about what you're experiencing. Be as detailed as possible to
          help us understand your condition better.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            What symptoms are you experiencing?
          </label>
          <textarea
            value={symptoms}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setSymptoms(e.target.value)
            }
            placeholder="Describe your symptoms in detail... (e.g., headache, fever, fatigue)"
            className="flex min-h-[120px] w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            rows={5}
          />
        </div>
        <Button
          onClick={onNext}
          disabled={!symptoms.trim()}
          className="w-full py-3 text-base"
        >
          Continue to Personal Information
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  </div>
);

// Personal Info Section
const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  age,
  setAge,
  gender,
  setGender,
  onNext,
  onBack,
}) => (
  <div className="w-full min-h-screen flex items-center justify-center p-4">
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-purple-600/20 rounded-full">
            <User className="h-8 w-8 text-purple-400" />
          </div>
        </div>
        <CardTitle className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Personal Information
        </CardTitle>
        <CardDescription>
          Help us provide more accurate insights by sharing some basic
          information about yourself.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-blue-400" />
              Age
            </label>
            <Input
              type="number"
              value={age}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAge(e.target.value)
              }
              placeholder="Enter your age"
              min="1"
              max="120"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center">
              <User className="h-4 w-4 mr-2 text-purple-400" />
              Gender
            </label>
            <select
              value={gender}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setGender(e.target.value)
              }
              className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1 py-3">
            Back
          </Button>
          <Button
            onClick={onNext}
            disabled={!age || !gender}
            className="flex-1 py-3 text-base"
          >
            Complete Assessment
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Thank You Section
const ThankYouSection: React.FC<ThankYouSectionProps> = ({ onRestart }) => (
  <div className="w-full min-h-screen flex items-center justify-center p-4">
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-green-600/20 rounded-full animate-pulse">
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <CardTitle className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          Assessment Complete!
        </CardTitle>
        <CardDescription>
          Thank you for providing your information. Our system is processing
          your symptoms and will provide recommendations shortly.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 text-center">
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2 text-gray-300">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            <span>Your assessment has been successfully submitted</span>
          </div>
          <div className="p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
            <h4 className="font-medium text-blue-400 mb-2">What's Next?</h4>
            <p className="text-sm text-gray-400">
              We'll analyze your symptoms and personal information to provide
              personalized health insights. You should receive your results
              within the next few minutes.
            </p>
          </div>
        </div>
        <Button
          onClick={onRestart}
          variant="outline"
          className="w-full py-3 text-base"
        >
          Start New Assessment
        </Button>
      </CardContent>
    </Card>
  </div>
);

// Main Chat Component
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
