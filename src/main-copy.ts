// import { createLogger } from "./logger";
// import { QuestionnaireEngineFactory } from "./engine";

// const logger = createLogger("main");
import inquirer from "inquirer";

// type AndConditions = { [key: Question["name"]]: QuestionResponse }[];
type AndConditions = [Question["name"], QuestionResponse][];
type OrConditions = AndConditions[];
type YesNoresponse = "yes" | "no";
type QuestionResponse = string | YesNoresponse;
type QuestionType = "text" | "choice" | "yesno";
type QuestionCondition = OrConditions;
type Question = {
  name: string;
  question: string;
  type?: QuestionType;
  options?: string[];
  conditions?: QuestionCondition;
};

const questions: Question[] = [
  {
    name: "q1",
    question: "What is your favorite color?",
    type: "choice",
    options: ["Red", "Blue", "Green", "Other"],
  },
  {
    name: "q2",
    question: "Please specify your favorite color:",
    type: "text",
    conditions: [[["q1", "Other"]]],
  },
  {
    name: "q3",
    question: "Do you like programming?",
    type: "yesno",
  },
  {
    name: "q4",
    question: "What is your favorite programming language?",
    type: "text",
    conditions: [[["q3", "yes"]]],
  },
];

function conditionsMet(
  answers: Map<string, QuestionResponse>,
  conditions: QuestionCondition
) {
  return conditions.some((andCondition) => {
    return andCondition.every(([questionName, response]) => {
      return answers.get(questionName) === response;
    });
  });
}

async function run(questions: Question[]) {
  let questionIndex = 0;
  const answers = new Map<string, QuestionResponse>();
  while (questionIndex < questions.length) {
    const { name, question, type, options, conditions } =
      questions[questionIndex];

    if (conditions) {
      const conditionsPassed = conditions.some((andCondition) => {
        andCondition.every(([questionName, response]) => {
          return answers.get(questionName) === response;
        });
      });

      if (!conditionsPassed) {
        questionIndex += 1;
        continue;
      }
    }

    const answer = await inquirer.prompt({
      type: type === "choice" || type === "yesno" ? "list" : "input",
      name: name,
      message: question,
      choices:
        type === "choice"
          ? options
          : type === "yesno"
          ? ["yes", "no"]
          : undefined,
    });

    answers.set(name, answer[name]);

    console.log(`You answered: ${answer[name]}`);
    console.log(questionIndex, questions.length);
    if (questionIndex < questions.length - 1) {
      questionIndex += 1;
    } else {
      const continueResponse = await inquirer.prompt({
        type: "confirm",
        name: "restart",
        message: "Would you like to restart the questionnaire?",
      });

      if (continueResponse.restart) {
        questionIndex = 0;
        answers.clear();
      } else {
        console.log("Thank you for completing the questionnaire!");
        break;
      }
    }
  }
}

run(questions);

// async function start() {
//   logger.info("Application started!");

//   const engine = QuestionnaireEngineFactory.mockEngine(
//     createLogger("MockEngine")
//   );
//   const sessionResult = await engine.runSession("test-session-1");

//   logger.info("Session result:", {
//     id: sessionResult.id,
//     result: sessionResult.json(),
//   });
// }

// start().catch((error) => {
//   logger.error(`Application failed to start: ${error.message}`);
//   process.exit(1);
// });
