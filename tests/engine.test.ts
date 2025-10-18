import { describe, expect, it, vi } from "vitest";
import { QuestionnaireEngineFactory } from "../src/engine";
import { createLogger } from "../src/logger";

vi.mock("../src/logger", async (importActual) => {
  const actual = await importActual<typeof import("../src/logger")>();
  return {
    ...actual,
    createLogger: vi.fn().mockReturnValue({
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      child: vi.fn().mockReturnThis(),
    }),
  };
});
vi.mock("@inquirer/prompts", async (importActual) => {
  const actual = await importActual<typeof import("@inquirer/prompts")>();
  return {
    ...actual,
    confirm: vi.fn().mockResolvedValue(false),
    input: vi.fn().mockResolvedValue("Test answer"),
    select: vi.fn().mockResolvedValue("Test choice"),
  };
});

import { confirm, input, select } from "@inquirer/prompts";
import { Question } from "../src/types";

describe("Engine Tests", () => {
  const questions: Question[] = [
    {
      name: "q1",
      question: "What is your favorite color?",
      type: "choice",
      options: ["Red", "Blue", "Green", "Other"],
    },
  ];

  it("should run a mock session", async () => {
    const engine = QuestionnaireEngineFactory.engine(
      createLogger("TestEngine")
    );
    const sessionResult = await engine.runSession("test-session-1", questions);
    expect(select).toHaveBeenCalled();
    expect(sessionResult.json()).toEqual([
      {
        question: "What is your favorite color?",
        answer: "Test choice",
      },
    ]);
  });

  it("should restart the questionnaire when prompted", async () => {
    const engine = QuestionnaireEngineFactory.engine(
      createLogger("TestEngineRestart")
    );
    await engine.runSession("test-session-2", [
      { name: "q1", question: "Test?", type: "text" },
    ]);
    expect(input).toHaveBeenCalled();
    expect(confirm).toHaveBeenCalled();
  });

  it("should warn when no questions are provided", async () => {
    const logger = createLogger("TestEngineRestart");

    const engine = QuestionnaireEngineFactory.engine(logger);
    await engine.runSession("test-session-2", []);
    expect(logger.warn).toHaveBeenCalledWith(
      "No questions provided for the questionnaire."
    );
  });
});
