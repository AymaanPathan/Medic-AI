export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardDescriptionProps {
  children: React.ReactNode;
}

export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export interface SymptomSectionProps {
  symptoms: string;
  setSymptoms: (symptoms: string) => void;
  onNext: () => void;
}

export interface FollowUpSectionProps {
  onBack: () => void;
  onNext: () => void;
}

export interface PersonalInfoSectionProps {
  age: string;
  setAge: (age: string) => void;
  gender: string;
  setGender: (gender: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export interface ThankYouSectionProps {
  onRestart: () => void;
}

// Chat Types
export interface IMedicine {
  name: string;
  purpose: string;
  how_it_works: string;
  dosage: {
    [ageGroup: string]: string; // e.g., "Adult": "1 tablet/day"
  };
  pros: string[];
  cons: string[];
  when_not_to_take: string[];
  age_restriction: string;
}
export type Diagnosis = {
  diseaseName: string;
  diseaseSummary: string;
  whyYouHaveThis: string;
  whatToDoFirst: string;
  medicines: Array<{
    name: string;
    purpose: string;
    how_it_works: string;
    pros: string[];
    cons: string[];
    when_not_to_take: string[];
    dosage: { [key: string]: string };
    age_restriction?: string;
  }>;
  lifestyleChanges?: string[];
  dangerSigns?: string[];
};

export type IMessage = {
  id: string;
  text: string;
  message: string | number;
  sender: string;
  time_stamp: Date;
};
