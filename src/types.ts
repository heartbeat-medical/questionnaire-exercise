export type AndConditions = [Question["name"], QuestionResponse][];
export type OrConditions = AndConditions[];
export type YesNoresponse = "yes" | "no";
export type QuestionResponse = string | YesNoresponse;
export type QuestionType = "text" | "choice" | "yesno" | "confirm";
export type QuestionCondition = OrConditions;
export type Question = {
  name: string;
  question: string;
  type: QuestionType;
  options?: string[];
  conditions?: QuestionCondition;
};

export type Result = {
  id: string;
  json(): { question: string; answer?: string }[];
};

export type QuestionnaireEngine = {
  runSession: (sessionId: string, questions: Question[]) => Promise<Result>;
};
