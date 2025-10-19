import { input, select, confirm } from "@inquirer/prompts";
import {
  Question,
  QuestionCondition,
  QuestionResponse,
  questionSchema,
  QuestionType,
} from "./types";

export async function validateQuestions(questions: unknown) {
  const result = await questionSchema.safeParseAsync(questions);
  if (!result.success) {
    throw new Error(`Invalid questions: ${result.error}`);
  }
  return result.data;
}

export function conditionsMet(
  answers: Map<string, QuestionResponse>,
  conditions: QuestionCondition = []
) {
  if (conditions.length === 0) {
    return true;
  }
  return conditions.some((andCondition) => {
    return andCondition.every(([questionName, response]) => {
      if (!answers.has(questionName)) {
        throw new Error(
          `Condition check failed: No answer found for question "${questionName}"`
        );
      }
      return answers.get(questionName) === response;
    });
  });
}

export function promptQuestion(question: Question) {
  return function () {
    const { type, question: message, options } = question;

    switch (type) {
      case QuestionType.Text:
        return input({ message });
      case QuestionType.Choice:
        return select({ message, choices: options || [] });
      case QuestionType.YesNo:
        return select({ message, choices: ["Yes", "No"] });
      case QuestionType.Confirm:
        return confirm({ message });
      default:
        throw new Error(
          `Unsupported question type: ${type} for question "${message}"`
        );
    }
  };
}

export function buildResult(
  questions: Question[],
  answers: Map<string, QuestionResponse>
) {
  const resultArray: { question: string; answer?: string }[] = [];

  for (const question of questions) {
    resultArray.push({
      question: question.question,
      answer: answers.get(question.name)?.toString(),
    });
  }

  return resultArray;
}
