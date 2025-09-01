import {createLogger} from "./logger";
import {QuestionnaireEngineFactory} from "./engine";

const logger = createLogger('main');

async function start() {
  logger.info('Application started!');

  const engine = QuestionnaireEngineFactory.mockEngine(createLogger('MockEngine'))
  const sessionResult = await engine.runSession('test-session-1');

  logger.info('Session result:', {id: sessionResult.id, result: sessionResult.json()});
}

start().catch((error) => {
  logger.error(`Application failed to start: ${error.message}`);
  process.exit(1);
});



