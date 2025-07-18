export interface Medicine {
  name: string;
  purpose: string;
  how_it_works: string;
  dosage: Record<string, string>; // e.g., "Adult (20+)": "20-30 mg"
  pros: string[];
  cons: string[];
  when_not_to_take: string[];
  age_restriction: string;
}

export interface Diagnosis {
  diseaseName: string;
  diseaseSummary: string;
  whyYouHaveThis: string;
  whatToDoFirst: string;
  dangerSigns: string[];
  lifestyleChanges: string[];
  medicines: Medicine[];
}

export interface IDiagnosisResponse {
  sessionId: string;
  userSymptoms: string;
  user_info: string;
  followupQuestions: string[];
  user_response: Record<string, string>;
  finalPrompt: string;
  diagnosis: Diagnosis;
  audioUrl: string; // ✅ make it string, not optional or default to empty
  loading: boolean;
  error: string | null;
}
