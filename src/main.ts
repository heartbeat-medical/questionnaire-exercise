import { QuestionnaireEngineFactory } from "./engine";
import { createLogger } from "./logger";
import { Question } from "./types";
import questions from "./questions.json";

const logger = createLogger("Main");

async function start() {
  logger.info("Application started!");

  const engine = QuestionnaireEngineFactory.engine(createLogger("Engine"));
  const sessionResult = await engine.runSession(
    "test-session-1",
    questions as Question[]
  );

  logger.info("Session result:", {
    id: sessionResult.id,
    result: sessionResult.json(),
  });
}

start().catch((error) => {
  if (error instanceof Error && error.name === "ExitPromptError") {
    logger.error("Session terminated by user.");
    process.exit(1);
  }
  logger.error(`Application failed to start: ${error.message}`);
  process.exit(1);
});
