export interface IChat {
  sessionId: string;
  userSymptoms: string;
  user_info: string;
  followupQuestions: string[];
  user_response: Record<string, string>;
  finalPrompt: string;
}
