export type CoachingMessage = {
  why: string;
  fix: string;
};

const notInToolkit = {
  why: "This feature is outside the INFS 1101 toolkit, so it can hide the step-by-step thinking this course is practising.",
  fix: "Rewrite it with the simple tools from this lesson, usually variables, decisions, and while loops."
};

const literalCollection = {
  why: "Collection values are not part of this course section yet.",
  fix: "Use separate variables or a simple repeated input pattern instead."
};

export const coachingMessages: Record<string, CoachingMessage> = {
  for: {
    why: "For loops are not used in this course. The course checks that you can build the loop logic yourself.",
    fix: "Use a while loop with a counter or a sentinel value when loops are allowed."
  },
  "while-early": {
    why: "While loops come later in the course sequence.",
    fix: "For this lesson, solve the task with input, variables, output, and decisions only."
  },
  "def-early": {
    why: "Functions come later in the course sequence.",
    fix: "Write the steps directly in the program for this lesson."
  },
  docstring: {
    why: "A docstring tells the reader what a function is meant to do.",
    fix: "Put a short triple-quoted sentence as the first line inside the function."
  },
  "name-style": {
    why: "Clear lower_snake_case names make code easier to read and mark.",
    fix: "Use lower-case words joined with underscores, such as total_price."
  },
  "import-early": {
    why: "Modules are introduced later, so this lesson should not depend on imports.",
    fix: "Remove the import and use only the tools already taught."
  },
  module: {
    why: "INFS 1101 only uses a small set of modules.",
    fix: "Use math or random only when the lesson allows modules."
  },
  "unsupported-call": {
    why: "This call is not in the INFS 1101 toolkit for this exercise.",
    fix: "Replace it with simple statements that do the same job step by step."
  },
  "call-early": {
    why: "Calling your own functions comes later in the course.",
    fix: "Write the calculation directly in the program for now."
  },
  scope: {
    why: "This tool belongs to a later lesson.",
    fix: "Use the simpler operator, method, or pattern taught in the current lesson."
  },
  shadow: {
    why: "This name already belongs to a Python built-in. Reusing it can make later code confusing.",
    fix: "Choose a clearer variable name, such as total, price, count, or user_text."
  },
  indent: {
    why: "Python uses indentation to decide which lines belong together.",
    fix: "Use four spaces for each indented block."
  },
  "line-length": {
    why: "Shorter lines are easier to read and debug.",
    fix: "Break the idea into a shorter statement or use a clearer variable name."
  },
  syntax: {
    why: "Python cannot run the program until it can read the code.",
    fix: "Check the line named in the message for a missing colon, bracket, quote, or incorrect indentation."
  },
  "required-function": {
    why: "This exercise is checking a specific function.",
    fix: "Define the function with exactly the requested name, then put your solution inside it."
  },
  Break: {
    why: "Break is not part of the loop patterns used in INFS 1101.",
    fix: "Put the stopping condition in the while condition instead."
  },
  Continue: {
    why: "Continue can make loop flow harder to trace at this level.",
    fix: "Use an if statement inside the loop to choose which lines should run."
  },
  Try: {
    why: "Try/except is outside the current course toolkit.",
    fix: "Use careful input casting and simple checks from the current lesson."
  },
  Lambda: {
    why: "Lambda functions are not used in INFS 1101.",
    fix: "Use a normal expression, or a def function only in lessons where functions are allowed."
  },
  IfExp: {
    why: "Short if expressions can hide the decision structure.",
    fix: "Use a normal if/else block."
  },
  ListComp: {
    why: "Comprehensions are not used in this course.",
    fix: "Use a while loop with an accumulator instead."
  },
  SetComp: {
    why: "Comprehensions are not used in this course.",
    fix: "Use a while loop and update one value at a time."
  },
  DictComp: {
    why: "Comprehensions are not used in this course.",
    fix: "Use simple variables and a while loop pattern instead."
  },
  GeneratorExp: {
    why: "Generator expressions are not used in this course.",
    fix: "Use a while loop that updates a running value."
  },
  List: literalCollection,
  Dict: literalCollection,
  Set: literalCollection,
  Tuple: literalCollection
};

export function getCoachingMessage(code: string) {
  return coachingMessages[code] ?? null;
}
