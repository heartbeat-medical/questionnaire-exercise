import z from "zod";

export type AndConditions = [Question["name"], QuestionResponse][];
export type OrConditions = AndConditions[];
export type YesNoresponse = "Yes" | "No";
export type QuestionResponse = string | YesNoresponse | boolean;
export enum QuestionType {
  Text = "text",
  Choice = "choice",
  YesNo = "yesno",
  Confirm = "confirm",
}
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

const questionBaseSchema = z.object({
  name: z.string(),
  question: z.string(),
  conditions: z
    .array(
      z.array(
        z.tuple([
          z.string(),
          z.union([z.string(), z.literal("yes"), z.literal("no")]),
        ])
      )
    )
    .optional(),
});

export const questionSchema = z
  .discriminatedUnion("type", [
    questionBaseSchema.extend({
      type: z.literal(QuestionType.YesNo),
    }),
    questionBaseSchema.extend({
      type: z.literal(QuestionType.Confirm),
    }),
    questionBaseSchema.extend({
      type: z.literal(QuestionType.Text),
    }),
    questionBaseSchema.extend({
      type: z.literal(QuestionType.Choice),
      options: z.array(z.string()).min(1),
    }),
  ])
  .array();
