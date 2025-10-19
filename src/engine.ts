import { confirm } from "@inquirer/prompts";
import { Logger } from "./logger";
import {
  Question,
  QuestionnaireEngine,
  QuestionResponse,
  Result,
} from "./types";
import {
  buildResult,
  conditionsMet,
  promptQuestion,
  validateQuestions,
} from "./utils";

async function cycleQuestions(
  questions: Question[],
  answers: Map<string, QuestionResponse>,
  logger: Logger
) {
  for (const question of questions) {
    try {
      if (conditionsMet(answers, question.conditions)) {
        const answer = await promptQuestion(question)();
        answers.set(question.name, answer as QuestionResponse);
      } else {
        logger.info(`Conditions not met, skipping question: ${question.name}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "ExitPromptError") {
          throw error;
        }
        logger.error(error.message);
      } else {
        throw error;
      }
    }
  }
}

async function runQuestionaire(questions: Question[], logger: Logger) {
  if (questions.length === 0) {
    logger.warn("No questions provided for the questionnaire.");
    return new Map<string, QuestionResponse>();
  }

  await validateQuestions(questions);
  // improvement: question types could be the inferred type from the zod schema

  const answers = new Map<string, QuestionResponse>();

  while (true) {
    await cycleQuestions(questions, answers, logger);

    const continueResponse = await confirm({
      message: "Would you like to restart the questionnaire?",
    });

    if (continueResponse) {
      answers.clear();
    } else {
      console.log("Thank you for completing the questionnaire!");
      break;
    }
  }
  return answers;
}

export const QuestionnaireEngineFactory = {
  engine: (logger: Logger): QuestionnaireEngine => {
    return {
      runSession: async (sessionId: string, questions: Question[]) => {
        const cLogger = logger.child("runSession");
        cLogger.info("Running session.");

        const answers = await runQuestionaire(questions, cLogger);

        const result: Result = {
          id: sessionId,
          json: () => {
            return buildResult(questions, answers);
          },
        };
        return Promise.resolve(result);
      },
    };
  },
};
