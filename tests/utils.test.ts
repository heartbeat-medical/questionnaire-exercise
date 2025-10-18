import { describe, expect, it, vi } from "vitest";
import { Question, QuestionCondition, QuestionResponse } from "../src/types";
import { buildResult, conditionsMet, promptQuestion } from "../src/utils";

vi.mock("../src/utils", { spy: true });
vi.mock("@inquirer/prompts", async (importActual) => {
  const actual = await importActual<typeof import("@inquirer/prompts")>();
  return {
    ...actual,
    select: vi.fn().mockResolvedValue("Red"),
    input: vi.fn().mockResolvedValue("Some color"),
    confirm: vi.fn().mockResolvedValue(true),
  };
});

const { select, input, confirm } = await import("@inquirer/prompts");

describe("Utils Tests", () => {
  describe("promptQuestion", () => {
    it("should build a question object", async () => {
      const selectQuestion = promptQuestion({
        name: "q1",
        question: "What is your favorite color?",
        type: "choice",
        options: ["Red", "Blue", "Green", "Other"],
      });
      const inputQuestion = promptQuestion({
        name: "q1",
        question: "What is your favorite color?",
        type: "text",
      });
      const yesnoQuestion = promptQuestion({
        name: "q1",
        question: "Do you want to continue?",
        type: "confirm",
      });

      await selectQuestion();
      expect(select).toHaveBeenCalled();

      await inputQuestion();
      expect(input).toHaveBeenCalled();

      await yesnoQuestion();
      expect(confirm).toHaveBeenCalled();
    });
  });

  describe("buildResult", () => {
    it("should build a result object", () => {
      const questions: Question[] = [
        {
          name: "q1",
          question: "Do you like programming?",
          type: "yesno",
        },
      ];

      const answers = new Map<string, QuestionResponse>([["q1", "Yes"]]);

      const result = buildResult(questions, answers);
      expect(result).toEqual([
        {
          question: "Do you like programming?",
          answer: "Yes",
        },
      ]);
    });
  });

  describe("conditionsMet", () => {
    it("should return true if all conditions are met", () => {
      const answers = new Map<string, QuestionResponse>([
        ["q1", "Other"],
        ["q2", "Some color"],
      ]);

      expect(conditionsMet(answers, [[["q1", "Other"]]])).toBe(true);
      expect(conditionsMet(answers, [[["q2", "Some color"]]])).toBe(true);
    });

    it("should return false if any condition is not met", () => {
      const answers = new Map<string, QuestionResponse>([
        ["q1", "Other"],
        ["q2", "Some color"],
      ]);

      expect(conditionsMet(answers, [[["q1", "None"]]])).toBe(false);
    });

    // OR
    it("should return true if either condition is met", () => {
      const answers = new Map<string, QuestionResponse>([
        ["q1", "Other"],
        ["q2", "Some color"],
      ]);

      expect(
        conditionsMet(answers, [[["q1", "None"]], [["q2", "Some color"]]])
      ).toBe(true);
    });

    // AND
    it("should return true if all conditions are met, and false if not", () => {
      const answers = new Map<string, QuestionResponse>([
        ["q1", "Other"],
        ["q2", "Some color"],
      ]);

      expect(
        conditionsMet(answers, [
          [
            ["q1", "Other"],
            ["q2", "Some color"],
          ],
        ])
      ).toBe(true);
      expect(
        conditionsMet(answers, [
          [
            ["q1", "None"],
            ["q2", "Some color"],
          ],
        ])
      ).toBe(false);
    });
  });
});
