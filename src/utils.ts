import { input, select, confirm } from "@inquirer/prompts";
import { Question, QuestionCondition, QuestionResponse } from "./types";

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
      case "text":
        return input({ message });
      case "choice":
        return select({ message, choices: options || [] });
      case "yesno":
        return select({ message, choices: ["Yes", "No"] });
      case "confirm":
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
