export type Lesson = {
  id: string;
  number: number;
  title: string;
  blurb: string;
  newSkills: string[];
  activities: Activity[];
};

export type ActivityBase = {
  id: string;
  kind:
    | "mcq"
    | "fillGaps"
    | "orderLines"
    | "matching"
    | "predictOutput"
    | "traceTable"
    | "shortAnswer"
    | "fixCode"
    | "writeCode";
  prompt: string;
  displayCode?: string;
  inlineCodeRefs?: string[];
  explanation: string;
  commonMistake?: string;
};

export type MultipleChoice = ActivityBase & {
  kind: "mcq";
  multi?: boolean;
  options?: string[];
  codeOptions?: string[];
  correctIndexes: number[];
};

export type Matching = ActivityBase & {
  kind: "matching";
  pairs: { left: string; right: string }[];
  codeLabels?: string[];
};

export type FillGaps = ActivityBase & {
  kind: "fillGaps";
  template: string;
  gaps: { id: number; accepted: string[]; caseSensitive?: boolean }[];
};

export type OrderLines = ActivityBase & {
  kind: "orderLines";
  lines: string[];
};

export type TraceTable = ActivityBase & {
  kind: "traceTable";
  code: string;
  columns: string[];
  rows: (string | number)[][];
};

export type ShortAnswer = ActivityBase & {
  kind: "shortAnswer";
  accepted: string[];
  expectedAnswerIsCode: boolean;
  caseSensitive?: boolean;
};

export type FixCode = ActivityBase & {
  kind: "fixCode";
  brokenCode: string;
  fixedCode: string;
  acceptedFixes?: string[];
  expectedErrorType?: string;
};

export type PredictOutput = ActivityBase & {
  kind: "predictOutput";
  code: string;
  expectedStdout?: string;
  expectedError?: {
    type: string;
    message: string;
  };
};

export type WriteCode = ActivityBase & {
  kind: "writeCode";
  starterCode?: string;
  programTests?: { stdin: string[]; expectedStdout: string }[];
  functionTests?: {
    functionName: string;
    cases: {
      args: unknown[];
      expected?: unknown;
      property?:
        | { type: "intInRange"; min: number; max: number }
        | { type: "inSet"; values: unknown[] }
        | { type: "predicate"; pythonExpr: string };
    }[];
  }[];
  randomMode?: "range";
  requireFunctionName?: string;
  docstring?: {
    exactText?: string;
  };
  sampleSolution: string;
};

export type Activity =
  | MultipleChoice
  | FillGaps
  | OrderLines
  | Matching
  | PredictOutput
  | TraceTable
  | ShortAnswer
  | FixCode
  | WriteCode;

export type ActivityResult = {
  attempted: boolean;
  correct: boolean;
  attempts: number;
  solutionViewed: boolean;
  xpAwarded: boolean;
};

export type ProgressState = {
  schemaVersion: number;
  contentVersion: string;
  xp: number;
  streak: number;
  lastStudyDate?: string;
  lastVisitedLesson?: string;
  theme: "light" | "dark";
  lessons: Record<string, Record<string, ActivityResult>>;
};
