import {Logger} from "./logger";

type Result = {
  id: string,
  json(): { question: string, answer?: string }[];
}

type QuestionnaireEngine = {
  runSession: (sessionId: string) => Promise<Result>;
}

export const QuestionnaireEngineFactory = {
  mockEngine: (logger: Logger): QuestionnaireEngine => {
    const mockResult: Result = {
      id: "test-session-1",
      json: () => {
        return [
          {question: "What is your name?", answer: "John Doe"},
          {question: "How old are you?", answer: "30"},
        ];
      }
    }
    return {
      runSession: () => {
        const cLogger = logger.child('runSession')
        cLogger.info("Running mock session, returning static result");
        return Promise.resolve(mockResult)
      }
    }
  }

}
