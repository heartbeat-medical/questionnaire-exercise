import {describe, it, expect} from "vitest";
import {QuestionnaireEngineFactory} from "../src/engine";
import {createLogger} from "../src/logger";

describe('Engine Tests', () => {
  describe('MockEngine Tests', () => {
    it('should run a mock session', async () => {
      const engine = QuestionnaireEngineFactory.mockEngine(createLogger('TestEngine'))

      const sessionResult = await engine.runSession('test-session-1');
      expect(sessionResult.json()).toBeTruthy()
    })
  })

})
