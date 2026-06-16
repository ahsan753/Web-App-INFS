import type { Activity, Lesson } from "@/lib/types";

const foundations: Activity[] = [
  {
    id: "L01-A01",
    kind: "mcq",
    prompt: "Which part of the IPO model is the amount a student pays for lunch?",
    options: ["Input", "Process", "Output", "Algorithm"],
    correctIndexes: [0],
    explanation: "The amount paid is information that enters the solution.",
    commonMistake: "A process is the calculation or decision, not the raw value."
  },
  {
    id: "L01-A02",
    kind: "matching",
    prompt: "Match each computational thinking term to its meaning.",
    pairs: [
      { left: "Decomposition", right: "Break a problem into smaller parts" },
      { left: "Pattern recognition", right: "Notice what repeats" },
      { left: "Abstraction", right: "Keep only the important details" },
      { left: "Algorithm", right: "Write ordered steps" }
    ],
    explanation: "These four ideas help you plan before writing code."
  },
  {
    id: "L01-A03",
    kind: "orderLines",
    prompt: "Put the breakfast ordering steps into a sensible sequence.",
    lines: [
      "# Choose the meal",
      "# Give the order",
      "# Pay the cashier",
      "# Collect the receipt"
    ],
    explanation: "An algorithm needs steps in a clear order."
  },
  {
    id: "L01-A04",
    kind: "shortAnswer",
    prompt: "What three-letter model describes Input, Process and Output?",
    accepted: ["IPO"],
    expectedAnswerIsCode: false,
    caseSensitive: false,
    explanation: "IPO is a simple way to describe what a program does."
  },
  {
    id: "L01-A05",
    kind: "matching",
    prompt: "Sort each task into its IPO role.",
    pairs: [
      { left: "Student name typed into a form", right: "Input" },
      { left: "Calculate the total QAR price", right: "Process" },
      { left: "Show the final receipt", right: "Output" },
      { left: "Compare two ticket prices", right: "Process" }
    ],
    explanation: "Inputs arrive first, processes transform them, and outputs are shown."
  },
  {
    id: "L01-A06",
    kind: "mcq",
    prompt: "Why do programmers write pseudocode before coding?",
    options: [
      "To plan the logic in plain language",
      "To make the computer run faster",
      "To replace testing",
      "To store passwords"
    ],
    correctIndexes: [0],
    explanation: "Pseudocode lets you focus on the idea before exact syntax."
  },
  {
    id: "L01-A07",
    kind: "shortAnswer",
    prompt: "What word means a step-by-step solution to a problem?",
    accepted: ["algorithm"],
    expectedAnswerIsCode: false,
    explanation: "An algorithm is an ordered set of steps."
  },
  {
    id: "L01-A08",
    kind: "orderLines",
    prompt: "Order this simple campus gate algorithm.",
    lines: [
      "# Check the student card",
      "# Confirm the card is valid",
      "# Open the gate",
      "# Let the student enter"
    ],
    explanation: "Sequence matters when one action depends on an earlier action."
  }
];

const computationalThinking: Activity[] = [
  {
    id: "L02-A01",
    kind: "mcq",
    prompt: "Which cornerstone is used when a large registration problem is split into smaller jobs?",
    options: ["Decomposition", "Output", "Syntax", "Storage"],
    correctIndexes: [0],
    explanation: "Decomposition makes a large problem easier to handle."
  },
  {
    id: "L02-A02",
    kind: "matching",
    prompt: "Match each flowchart idea to its plain meaning.",
    pairs: [
      { left: "Sequence", right: "Steps happen in order" },
      { left: "Selection", right: "A choice changes the path" },
      { left: "Iteration", right: "Steps may repeat" },
      { left: "Terminator", right: "The start or end point" }
    ],
    explanation: "Flowcharts show the control flow before code is written."
  },
  {
    id: "L02-A03",
    kind: "orderLines",
    prompt: "Order this library borrowing algorithm.",
    lines: [
      "# Find the book",
      "# Scan the student card",
      "# Record the due date",
      "# Give the book to the student"
    ],
    explanation: "The steps move from choosing an item to recording the result."
  },
  {
    id: "L02-A04",
    kind: "shortAnswer",
    prompt: "Which control idea means that a set of steps may repeat?",
    accepted: ["iteration"],
    expectedAnswerIsCode: false,
    explanation: "Iteration is the general idea of repetition."
  },
  {
    id: "L02-A05",
    kind: "matching",
    prompt: "Choose the best computational thinking idea for each situation.",
    pairs: [
      { left: "Ignore seat colour when booking a lab", right: "Abstraction" },
      { left: "Notice every booking needs a date", right: "Pattern recognition" },
      { left: "Divide payment into fee and discount", right: "Decomposition" },
      { left: "List the exact booking steps", right: "Algorithm" }
    ],
    explanation: "Each cornerstone supports a different planning habit."
  },
  {
    id: "L02-A06",
    kind: "mcq",
    prompt: "Which detail should be kept when abstracting a parking fee problem?",
    options: ["Hours parked", "Driver shirt colour", "Radio station", "Car nickname"],
    correctIndexes: [0],
    explanation: "The fee depends on the hours, so that detail matters."
  },
  {
    id: "L02-A07",
    kind: "shortAnswer",
    prompt: "What control idea means that a decision chooses one path?",
    accepted: ["selection"],
    expectedAnswerIsCode: false,
    explanation: "Selection is the idea behind choosing between paths."
  },
  {
    id: "L02-A08",
    kind: "orderLines",
    prompt: "Order the problem-solving steps for planning a small app.",
    lines: [
      "# Understand the goal",
      "# Identify the inputs",
      "# Plan the processing steps",
      "# Decide the outputs"
    ],
    explanation: "Good planning starts with the goal and ends with visible results."
  }
];

const inputOutputVariables: Activity[] = [
  {
    id: "L03-A01",
    kind: "mcq",
    prompt: "What value type does the input function give back?",
    inlineCodeRefs: ["input()"],
    options: ["Text", "A whole number", "A decimal number", "A decision"],
    correctIndexes: [0],
    explanation: "The input function gives back text, even if the user types digits.",
    commonMistake: "Cast the value before doing number arithmetic."
  },
  {
    id: "L03-A02",
    kind: "fillGaps",
    prompt: "Complete the line that converts a typed price to a decimal number.",
    template: "price = {{1}}(input())",
    gaps: [{ id: 1, accepted: ["float"] }],
    explanation: "A decimal price should be converted with the float function."
  },
  {
    id: "L03-A03",
    kind: "predictOutput",
    prompt: "What does this snippet print?",
    code: "amount = 17\nriyals = amount // 5\ncoins = amount % 5\nprint(f\"{riyals} and {coins}\")",
    expectedStdout: "3 and 2",
    explanation: "Floor division gives the whole groups and the remainder gives what is left."
  },
  {
    id: "L03-A04",
    kind: "matching",
    prompt: "Match each value to its type after casting.",
    pairs: [
      { left: "Typed age converted to a whole number", right: "int" },
      { left: "Typed distance converted to a decimal", right: "float" },
      { left: "Course code saved as text", right: "str" },
      { left: "A printed receipt line", right: "output" }
    ],
    explanation: "Choosing the right type helps Python process the value correctly."
  },
  {
    id: "L03-A05",
    kind: "fixCode",
    prompt: "Fix the run-time error caused by using typed text in arithmetic.",
    brokenCode: "price = input()\ntotal = price + 5\nprint(total)",
    fixedCode: "price = int(input())\ntotal = price + 5\nprint(total)",
    acceptedFixes: ["price = float(input())\ntotal = price + 5\nprint(total)"],
    expectedErrorType: "TypeError",
    explanation: "The typed value must become a number before it is added to another number."
  },
  {
    id: "L03-A06",
    kind: "shortAnswer",
    prompt: "Write a line that stores the number 30 in a variable named student_count.",
    accepted: ["student_count = 30"],
    expectedAnswerIsCode: true,
    explanation: "Variable names should be meaningful and use lower snake case."
  },
  {
    id: "L03-A07",
    kind: "orderLines",
    prompt: "Order the program that prints the cost of two metro trips.",
    lines: [
      "trip_price = float(input())",
      "total_price = trip_price * 2",
      "print(f\"Total QAR {total_price}\")"
    ],
    explanation: "Read the input, process it, then print the output."
  },
  {
    id: "L03-A08",
    kind: "writeCode",
    prompt: "Write a program that reads a QAR price and prints the price after adding three.",
    starterCode: "price = int(input())\n",
    programTests: [
      { stdin: ["12"], expectedStdout: "15" },
      { stdin: ["20"], expectedStdout: "23" }
    ],
    sampleSolution: "price = int(input())\nnew_price = price + 3\nprint(new_price)",
    explanation: "The program casts the input, adds three, and prints the result."
  },
  {
    id: "L03-A09",
    kind: "matching",
    prompt: "Match each situation to the correct error type.",
    pairs: [
      { left: "Forgetting a colon at the end of an if line", right: "Syntax error" },
      { left: "Adding typed text to a number without casting", right: "Run-time error" },
      { left: "Using the wrong formula so the answer is wrong", right: "Logic error" }
    ],
    explanation: "Syntax errors stop Python reading the code, run-time errors happen while it runs, and logic errors give the wrong answer.",
    commonMistake: "A program can run without crashing and still have a logic error."
  },
  {
    id: "L03-A10",
    kind: "predictOutput",
    prompt: "What does this debugging snippet print?",
    code: "student_count = \"25\"\nprint(type(student_count))",
    expectedStdout: "<class 'str'>",
    explanation: "The value is text because quotation marks make a string.",
    commonMistake: "Digits inside quotation marks are still text."
  },
  {
    id: "L03-A11",
    kind: "predictOutput",
    prompt: "What does this print call show?",
    code: "print(\"QAR\", 5, \"total\")",
    expectedStdout: "QAR 5 total",
    explanation: "The print function puts one space between separate items."
  }
];

const simpleDecisions: Activity[] = [
  {
    id: "L04-A01",
    kind: "mcq",
    prompt: "Which comparison checks whether a score is at least fifty?",
    codeOptions: ["score >= 50", "score = 50", "score < 50", "score != 50"],
    correctIndexes: [0],
    explanation: "At least means greater than or equal to."
  },
  {
    id: "L04-A02",
    kind: "predictOutput",
    prompt: "What does this decision print?",
    code: "temperature = 42\nif temperature > 40:\n    print(\"Hot\")\nelse:\n    print(\"Mild\")",
    expectedStdout: "Hot",
    explanation: "The condition is true, so the first branch runs."
  },
  {
    id: "L04-A03",
    kind: "orderLines",
    prompt: "Order the small decision program.",
    lines: [
      "balance = int(input())",
      "if balance >= 10:",
      "    print(\"Enough\")",
      "else:",
      "    print(\"Top up\")"
    ],
    explanation: "The indented lines belong to their branches."
  },
  {
    id: "L04-A04",
    kind: "fillGaps",
    prompt: "Complete the condition that accepts a valid small group size.",
    template: "if group_size >= 2 {{1}} group_size <= 5:\n    print(\"Valid\")",
    gaps: [{ id: 1, accepted: ["and"] }],
    explanation: "Both comparisons must be true, so the and operator is used."
  },
  {
    id: "L04-A05",
    kind: "fixCode",
    prompt: "Fix the indentation problem.",
    brokenCode: "score = int(input())\nif score >= 50:\nprint(\"Pass\")",
    fixedCode: "score = int(input())\nif score >= 50:\n    print(\"Pass\")",
    expectedErrorType: "IndentationError",
    explanation: "The branch body must be indented by four spaces."
  },
  {
    id: "L04-A06",
    kind: "matching",
    prompt: "Match each expression to the best meaning.",
    pairs: [
      { left: "age >= 18", right: "Adult or older" },
      { left: "city == \"Doha\"", right: "Exactly Doha" },
      { left: "not paid", right: "Payment is false" },
      { left: "score != 0", right: "Score is not zero" }
    ],
    codeLabels: ["age >= 18", "city == \"Doha\"", "not paid", "score != 0"],
    explanation: "Comparison and Boolean operators describe true or false conditions."
  },
  {
    id: "L04-A07",
    kind: "shortAnswer",
    prompt: "Write a condition that checks whether amount is below one hundred.",
    accepted: ["amount < 100"],
    expectedAnswerIsCode: true,
    explanation: "The less-than operator checks for a smaller value."
  },
  {
    id: "L04-A08",
    kind: "writeCode",
    prompt: "Write a program that prints Discount when the typed price is at least one hundred.",
    starterCode: "price = int(input())\n",
    programTests: [
      { stdin: ["120"], expectedStdout: "Discount" },
      { stdin: ["80"], expectedStdout: "Regular" }
    ],
    sampleSolution: "price = int(input())\nif price >= 100:\n    print(\"Discount\")\nelse:\n    print(\"Regular\")",
    explanation: "The program chooses between two messages using if and else."
  },
  {
    id: "L04-A09",
    kind: "predictOutput",
    prompt: "What does this decision print?",
    code: "day = \"Sat\"\nif day == \"Fri\" or day == \"Sat\":\n    print(\"Weekend\")\nelse:\n    print(\"Weekday\")",
    expectedStdout: "Weekend",
    explanation: "Only one side of the or condition needs to be true.",
    commonMistake: "Do not write the variable name only on the first comparison."
  }
];

const complexDecisions: Activity[] = [
  {
    id: "L05-A01",
    kind: "mcq",
    prompt: "Which structure is best when exactly one of several grade bands should run?",
    inlineCodeRefs: ["if", "elif", "else"],
    options: ["if with elif and else", "Only separate if statements", "A typed input only", "A comment"],
    correctIndexes: [0],
    explanation: "An if, elif and else chain chooses one matching branch."
  },
  {
    id: "L05-A02",
    kind: "predictOutput",
    prompt: "What category is printed?",
    code: "mark = 76\nif mark >= 85:\n    print(\"High\")\nelif mark >= 70:\n    print(\"Good\")\nelse:\n    print(\"Review\")",
    expectedStdout: "Good",
    explanation: "Python stops after the first true branch in the chain."
  },
  {
    id: "L05-A03",
    kind: "fillGaps",
    prompt: "Complete the middle branch keyword.",
    template: "if total >= 200:\n    print(\"Large\")\n{{1}} total >= 100:\n    print(\"Medium\")\nelse:\n    print(\"Small\")",
    gaps: [{ id: 1, accepted: ["elif"] }],
    explanation: "The middle condition uses elif."
  },
  {
    id: "L05-A04",
    kind: "orderLines",
    prompt: "Order the nested decision.",
    lines: [
      "paid = input()",
      "student = input()",
      "if paid == \"yes\":",
      "    if student == \"yes\":",
      "        print(\"Student entry\")",
      "    else:",
      "        print(\"Guest entry\")",
      "else:",
      "    print(\"Pay first\")"
    ],
    explanation: "The inner decision only runs after the outer condition is true."
  },
  {
    id: "L05-A05",
    kind: "matching",
    prompt: "Use the grade bands below to match each mark to the branch that runs.",
    displayCode:
      "mark = int(input())\nif mark >= 85:\n    print(\"Excellent\")\nelif mark >= 70:\n    print(\"Good\")\nelif mark >= 50:\n    print(\"Pass\")\nelse:\n    print(\"Review\")",
    pairs: [
      { left: "92", right: "Excellent" },
      { left: "74", right: "Good" },
      { left: "61", right: "Pass" },
      { left: "38", right: "Review" }
    ],
    explanation: "Each mark belongs to the first band it satisfies, so 92 is Excellent, 74 is Good, 61 is Pass and 38 is Review."
  },
  {
    id: "L05-A06",
    kind: "fixCode",
    prompt: "Fix the overlapping branch order.",
    brokenCode: "mark = int(input())\nif mark >= 50:\n    print(\"Pass\")\nelif mark >= 85:\n    print(\"High\")",
    fixedCode: "mark = int(input())\nif mark >= 85:\n    print(\"High\")\nelif mark >= 50:\n    print(\"Pass\")",
    explanation: "The more specific high mark check must come first."
  },
  {
    id: "L05-A07",
    kind: "shortAnswer",
    prompt: "Write the condition for a value between ten and twenty inclusive.",
    accepted: ["value >= 10 and value <= 20"],
    expectedAnswerIsCode: true,
    explanation: "The value must satisfy both boundary checks."
  },
  {
    id: "L05-A08",
    kind: "writeCode",
    prompt: "Write a program that prints a fee category from a typed age.",
    starterCode: "age = int(input())\n",
    programTests: [
      { stdin: ["8"], expectedStdout: "Child" },
      { stdin: ["20"], expectedStdout: "Adult" },
      { stdin: ["70"], expectedStdout: "Senior" }
    ],
    sampleSolution: "age = int(input())\nif age < 13:\n    print(\"Child\")\nelif age < 65:\n    print(\"Adult\")\nelse:\n    print(\"Senior\")",
    explanation: "The chain checks age bands from youngest to oldest."
  },
  {
    id: "L05-A09",
    kind: "shortAnswer",
    prompt: "Write the condition that checks whether guess is within three of treasure.",
    accepted: ["guess >= treasure - 3 and guess <= treasure + 3"],
    expectedAnswerIsCode: true,
    explanation: "This checks both ends of a small range using two comparisons.",
    commonMistake: "Both boundary checks are needed, so use and."
  },
  {
    id: "L05-A10",
    kind: "predictOutput",
    prompt: "What does this flag decision print?",
    code: "has_id = True\nage = 16\nallowed = False\nif has_id and age >= 18:\n    allowed = True\nif allowed:\n    print(\"Enter\")\nelse:\n    print(\"Denied\")",
    expectedStdout: "Denied",
    explanation: "The flag stays false because the age is under eighteen."
  }
];

const strings: Activity[] = [
  {
    id: "L06-A01",
    kind: "mcq",
    prompt: "Which expression gives the first character of a course code?",
    codeOptions: ["course_code[0]", "course_code[1]", "course_code[-0]", "course_code[:]"],
    correctIndexes: [0],
    explanation: "String indexing starts at zero."
  },
  {
    id: "L06-A02",
    kind: "predictOutput",
    prompt: "What does this string snippet print?",
    code: "word = \"Doha\"\nprint(word[-1])",
    expectedStdout: "a",
    explanation: "Negative one means the last character."
  },
  {
    id: "L06-A03",
    kind: "fillGaps",
    prompt: "Complete the slice that gives the first four characters.",
    template: "prefix = course_code[{{1}}:{{2}}]",
    gaps: [
      { id: 1, accepted: ["0"] },
      { id: 2, accepted: ["4"] }
    ],
    explanation: "The stop index is not included, so zero to four gives four characters."
  },
  {
    id: "L06-A04",
    kind: "matching",
    prompt: "Match each string method to its result.",
    pairs: [
      { left: "Upper case", right: "DOHA" },
      { left: "Lower case", right: "doha" },
      { left: "Strip spaces", right: "Doha" },
      { left: "Check alphabetic", right: "True for letters only" }
    ],
    explanation: "String methods help clean and inspect text."
  },
  {
    id: "L06-A05",
    kind: "shortAnswer",
    prompt: "Write the slice that reverses the value stored in word.",
    accepted: ["word[::-1]"],
    expectedAnswerIsCode: true,
    explanation: "A step of negative one moves backwards through the string."
  },
  {
    id: "L06-A06",
    kind: "fixCode",
    prompt: "Fix the case mismatch in the comparison.",
    brokenCode: "answer = input()\nif answer == \"yes\":\n    print(\"Accepted\")",
    fixedCode: "answer = input().lower()\nif answer == \"yes\":\n    print(\"Accepted\")",
    explanation: "Normalising the input makes capital letters easier to handle."
  },
  {
    id: "L06-A07",
    kind: "orderLines",
    prompt: "Order the program that checks a course code shape.",
    lines: [
      "course_code = input().strip()",
      "prefix = course_code[0:4]",
      "digits = course_code[4:]",
      "if len(course_code) == 8 and prefix.isupper() and digits.isdigit():",
      "    print(\"Valid\")",
      "else:",
      "    print(\"Check\")"
    ],
    explanation: "The code cleans the input, splits it, then checks each part."
  },
  {
    id: "L06-A08",
    kind: "writeCode",
    prompt: "Write a program that prints the first and last letters of a typed place.",
    starterCode: "place = input().strip()\n",
    programTests: [
      { stdin: ["Doha"], expectedStdout: "Da" },
      { stdin: ["Wakrah"], expectedStdout: "Wh" }
    ],
    sampleSolution: "place = input().strip()\nfirst_letter = place[0]\nlast_letter = place[-1]\nprint(f\"{first_letter}{last_letter}\")",
    explanation: "The program uses positive and negative indexing."
  },
  {
    id: "L06-A09",
    kind: "predictOutput",
    prompt: "What does this membership check print?",
    code: "print(\"Do\" in \"Doha\")",
    expectedStdout: "True",
    explanation: "The small text appears inside the place name."
  },
  {
    id: "L06-A10",
    kind: "predictOutput",
    prompt: "What does this string comparison print?",
    code: "print(\"INFS\" < \"infs\")",
    expectedStdout: "True",
    explanation: "Capital letters are ordered before lowercase letters.",
    commonMistake: "Alphabetical order in Python is also affected by letter case."
  },
  {
    id: "L06-A11",
    kind: "predictOutput",
    prompt: "What does this escaped newline print?",
    code: "print(\"Line1\\nLine2\")",
    expectedStdout: "Line1\nLine2",
    explanation: "The escaped newline moves the second word to the next line."
  }
];

const counterLoops: Activity[] = [
  {
    id: "L07-A01",
    kind: "mcq",
    prompt: "What must change inside a counted loop so it eventually stops?",
    inlineCodeRefs: ["while"],
    options: ["The counter", "The file name", "The app colour", "The comment"],
    correctIndexes: [0],
    explanation: "The counter update moves the loop towards a false condition."
  },
  {
    id: "L07-A02",
    kind: "predictOutput",
    prompt: "What does this loop print?",
    code: "count = 1\nwhile count <= 3:\n    print(count)\n    count = count + 1",
    expectedStdout: "1\n2\n3",
    explanation: "The loop prints before adding one to the counter."
  },
  {
    id: "L07-A03",
    kind: "traceTable",
    prompt: "Fill the trace table for the counted loop.",
    code: "count = 1\ntotal = 0\nwhile count <= 3:\n    total = total + count\n    count = count + 1",
    columns: ["count", "total"],
    rows: [
      [1, 0],
      [2, 1],
      [3, 3],
      [4, 6]
    ],
    explanation: "Each loop pass adds the current count, then increases it."
  },
  {
    id: "L07-A04",
    kind: "orderLines",
    prompt: "Order the countdown loop.",
    lines: [
      "count = 3",
      "while count >= 1:",
      "    print(count)",
      "    count = count - 1",
      "print(\"Go\")"
    ],
    explanation: "The loop counts down, then the final message runs once."
  },
  {
    id: "L07-A05",
    kind: "fillGaps",
    prompt: "Complete the loop that prints five ticket numbers.",
    template: "ticket = 1\nwhile ticket <= {{1}}:\n    print(ticket)\n    ticket = ticket {{2}} 1",
    gaps: [
      { id: 1, accepted: ["5"] },
      { id: 2, accepted: ["+"] }
    ],
    explanation: "The counter starts at one and increases until it passes five."
  },
  {
    id: "L07-A06",
    kind: "fixCode",
    prompt: "Fix the loop that never changes its counter.",
    brokenCode: "count = 1\nwhile count <= 3:\n    print(count)",
    fixedCode: "count = 1\nwhile count <= 3:\n    print(count)\n    count = count + 1",
    explanation: "The counter update prevents the loop from running forever."
  },
  {
    id: "L07-A07",
    kind: "shortAnswer",
    prompt: "Write the counter update that adds one to count.",
    accepted: ["count = count + 1"],
    expectedAnswerIsCode: true,
    explanation: "The update assigns the increased value back to the counter."
  },
  {
    id: "L07-A08",
    kind: "writeCode",
    prompt: "Write a program that prints numbers from one to a typed limit.",
    starterCode: "limit = int(input())\ncount = 1\n",
    programTests: [
      { stdin: ["3"], expectedStdout: "1\n2\n3" },
      { stdin: ["1"], expectedStdout: "1" }
    ],
    sampleSolution: "limit = int(input())\ncount = 1\nwhile count <= limit:\n    print(count)\n    count = count + 1",
    explanation: "A counted while loop uses a start value, a condition and an update."
  },
  {
    id: "L07-A09",
    kind: "fixCode",
    prompt: "Fix the loop that never starts.",
    brokenCode: "count = 1\nwhile count > 3:\n    print(count)\n    count = count + 1",
    fixedCode: "count = 1\nwhile count <= 3:\n    print(count)\n    count = count + 1",
    explanation: "The starting value must make the loop condition true.",
    commonMistake: "A loop can be wrong because its condition is false at the start."
  },
  {
    id: "L07-A10",
    kind: "mcq",
    prompt: "A counter is changed in two places inside a loop body. What is the likely bug?",
    options: [
      "It skips or repeats values",
      "A syntax error",
      "The loop runs faster",
      "Nothing changes"
    ],
    correctIndexes: [0],
    explanation: "Changing a counter twice can move past values or visit them again."
  }
];

const sentinelLoops: Activity[] = [
  {
    id: "L08-A01",
    kind: "mcq",
    prompt: "Which pattern reads the first value before a sentinel loop starts?",
    options: ["Read-before and read-at-end", "Break immediately", "Skip input", "Use a future collection"],
    correctIndexes: [0],
    explanation: "The first read lets the loop test the sentinel before processing."
  },
  {
    id: "L08-A02",
    kind: "orderLines",
    prompt: "Order the sentinel sum pattern.",
    lines: [
      "amount = int(input())",
      "total = 0",
      "while amount != 0:",
      "    total = total + amount",
      "    amount = int(input())",
      "print(total)"
    ],
    explanation: "The value is read again at the end of each loop pass."
  },
  {
    id: "L08-A03",
    kind: "predictOutput",
    prompt: "What does this validation loop print?",
    code: "value = 0\nwhile value <= 0:\n    value = 3\nprint(value)",
    expectedStdout: "3",
    explanation: "The loop changes the invalid value to a valid one."
  },
  {
    id: "L08-A04",
    kind: "fillGaps",
    prompt: "Complete the validation condition for a positive number.",
    template: "number = int(input())\nwhile number {{1}} 0:\n    number = int(input())",
    gaps: [{ id: 1, accepted: ["<="] }],
    explanation: "Invalid values are zero or below, so the loop repeats while that is true."
  },
  {
    id: "L08-A05",
    kind: "fixCode",
    prompt: "Fix the sentinel loop that misses the next input.",
    brokenCode: "amount = int(input())\ntotal = 0\nwhile amount != 0:\n    total = total + amount\nprint(total)",
    fixedCode: "amount = int(input())\ntotal = 0\nwhile amount != 0:\n    total = total + amount\n    amount = int(input())\nprint(total)",
    explanation: "A sentinel loop must read the next value inside the loop."
  },
  {
    id: "L08-A06",
    kind: "matching",
    prompt: "Match each validation aim to a useful check.",
    pairs: [
      { left: "Course code length", right: "Length is eight" },
      { left: "Letters part", right: "Upper-case letters" },
      { left: "Number part", right: "Digits only" },
      { left: "Positive price", right: "Greater than zero" }
    ],
    explanation: "Validation checks one small rule at a time."
  },
  {
    id: "L08-A07",
    kind: "traceTable",
    prompt: "Trace the sentinel total.",
    code: "value = 2\ntotal = 0\nwhile value != 0:\n    total = total + value\n    value = value - 1",
    columns: ["value", "total"],
    rows: [
      [2, 0],
      [1, 2],
      [0, 3]
    ],
    explanation: "The loop stops when the value becomes the sentinel."
  },
  {
    id: "L08-A08",
    kind: "writeCode",
    prompt: "Write a program that keeps reading prices until zero and prints the total.",
    starterCode: "price = int(input())\ntotal = 0\n",
    programTests: [
      { stdin: ["5", "7", "0"], expectedStdout: "12" },
      { stdin: ["0"], expectedStdout: "0" }
    ],
    sampleSolution: "price = int(input())\ntotal = 0\nwhile price != 0:\n    total = total + price\n    price = int(input())\nprint(total)",
    explanation: "The sentinel value is not added to the total."
  },
  {
    id: "L08-A09",
    kind: "writeCode",
    prompt: "Write a program that keeps reading until the course code has four capital letters followed by four digits.",
    starterCode: "course_code = input().strip()\n",
    programTests: [
      { stdin: ["abc", "INFS1101"], expectedStdout: "INFS1101" },
      { stdin: ["INFS123", "CMPS2200"], expectedStdout: "CMPS2200" }
    ],
    sampleSolution: "course_code = input().strip()\nprefix = course_code[0:4]\ndigits = course_code[4:8]\nwhile len(course_code) != 8 or not prefix.isupper() or not digits.isdigit():\n    course_code = input().strip()\n    prefix = course_code[0:4]\n    digits = course_code[4:8]\nprint(course_code)",
    explanation: "The loop repeats while the length, letters or digits are invalid.",
    commonMistake: "Update the sliced parts after reading a new value."
  }
];

const patterns: Activity[] = [
  {
    id: "L09-A01",
    kind: "matching",
    prompt: "Match each loop pattern to its purpose.",
    pairs: [
      { left: "Counting", right: "Track how many" },
      { left: "Accumulation", right: "Build a total" },
      { left: "Flag", right: "Remember whether something happened" },
      { left: "Maximum", right: "Keep the largest value" }
    ],
    explanation: "Patterns give names to common loop jobs."
  },
  {
    id: "L09-A02",
    kind: "predictOutput",
    prompt: "What total is printed?",
    code: "count = 1\ntotal = 0\nwhile count <= 4:\n    total = total + count\n    count = count + 1\nprint(total)",
    expectedStdout: "10",
    explanation: "The loop accumulates one plus two plus three plus four."
  },
  {
    id: "L09-A03",
    kind: "traceTable",
    prompt: "Trace the maximum pattern.",
    code: "current = 2\nlargest = current\nwhile current < 5:\n    current = current + 1\n    if current > largest:\n        largest = current",
    columns: ["current", "largest"],
    rows: [
      [2, 2],
      [3, 3],
      [4, 4],
      [5, 5]
    ],
    explanation: "The largest value changes only when a bigger value appears."
  },
  {
    id: "L09-A04",
    kind: "fillGaps",
    prompt: "Complete the accumulation update.",
    template: "total = 0\ncount = 1\nwhile count <= 3:\n    total = total {{1}} count\n    count = count + 1",
    gaps: [{ id: 1, accepted: ["+"] }],
    explanation: "Accumulation adds the new value to the running total."
  },
  {
    id: "L09-A05",
    kind: "mcq",
    prompt: "Which variable name best suits a flag pattern?",
    options: ["found_match", "x", "list", "max"],
    correctIndexes: [0],
    explanation: "A flag name should say what true or false means."
  },
  {
    id: "L09-A06",
    kind: "fixCode",
    prompt: "Fix the counting pattern so it updates the number of passes.",
    brokenCode: "count = 1\npasses = 0\nwhile count <= 3:\n    count = count + 1\nprint(passes)",
    fixedCode: "count = 1\npasses = 0\nwhile count <= 3:\n    passes = passes + 1\n    count = count + 1\nprint(passes)",
    explanation: "The passes variable must increase inside the loop."
  },
  {
    id: "L09-A07",
    kind: "shortAnswer",
    prompt: "Write the update that sets found_match to true.",
    accepted: ["found_match = True"],
    expectedAnswerIsCode: true,
    caseSensitive: true,
    explanation: "A flag uses a Boolean value to remember a condition."
  },
  {
    id: "L09-A08",
    kind: "writeCode",
    prompt: "Write a program that reads three scores and prints their total.",
    starterCode: "count = 1\ntotal_score = 0\n",
    programTests: [
      { stdin: ["3", "4", "5"], expectedStdout: "12" },
      { stdin: ["10", "0", "2"], expectedStdout: "12" }
    ],
    sampleSolution: "count = 1\ntotal_score = 0\nwhile count <= 3:\n    score = int(input())\n    total_score = total_score + score\n    count = count + 1\nprint(total_score)",
    explanation: "The program combines a counted loop with accumulation."
  },
  {
    id: "L09-A09",
    kind: "writeCode",
    prompt: "Write a program that reads three numbers and prints the smallest.",
    starterCode: "count = 1\n",
    programTests: [
      { stdin: ["5", "2", "8"], expectedStdout: "2" },
      { stdin: ["9", "9", "9"], expectedStdout: "9" }
    ],
    sampleSolution: "current_value = int(input())\nsmallest_value = current_value\ncount = 2\nwhile count <= 3:\n    current_value = int(input())\n    if current_value < smallest_value:\n        smallest_value = current_value\n    count = count + 1\nprint(smallest_value)",
    explanation: "The smallest value changes only when a lower number is read.",
    commonMistake: "Start the pattern with the first input, not with zero."
  },
  {
    id: "L09-A10",
    kind: "writeCode",
    prompt: "Write a program that reads three numbers and prints the largest.",
    starterCode: "count = 1\n",
    programTests: [
      { stdin: ["3", "7", "4"], expectedStdout: "7" },
      { stdin: ["10", "2", "2"], expectedStdout: "10" }
    ],
    sampleSolution: "current_value = int(input())\nlargest_value = current_value\ncount = 2\nwhile count <= 3:\n    current_value = int(input())\n    if current_value > largest_value:\n        largest_value = current_value\n    count = count + 1\nprint(largest_value)",
    explanation: "The largest value changes only when a higher number is read.",
    commonMistake: "Do not use a variable name that shadows a built-in function."
  },
  {
    id: "L09-A11",
    kind: "writeCode",
    prompt: "Write a program that reads five scores and reports if any score is below fifty.",
    starterCode: "count = 1\nsome_failed = False\n",
    programTests: [
      {
        stdin: ["60", "70", "45", "80", "90"],
        expectedStdout: "Some failed"
      },
      {
        stdin: ["60", "70", "80", "90", "55"],
        expectedStdout: "All passed"
      }
    ],
    sampleSolution: "count = 1\nsome_failed = False\nwhile count <= 5:\n    score = int(input())\n    if score < 50:\n        some_failed = True\n    count = count + 1\nif some_failed:\n    print(\"Some failed\")\nelse:\n    print(\"All passed\")",
    explanation: "The flag remembers whether any score failed during the loop.",
    commonMistake: "Do not reset the flag back to false after a passing score."
  },
  {
    id: "L09-A12",
    kind: "writeCode",
    prompt: "Write a program that reads three answers and reports if any answer is yes.",
    starterCode: "count = 1\nfound = False\n",
    programTests: [
      { stdin: ["no", "yes", "no"], expectedStdout: "Found" },
      { stdin: ["no", "no", "no"], expectedStdout: "Not found" }
    ],
    sampleSolution: "count = 1\nfound = False\nwhile count <= 3:\n    answer = input()\n    if answer == \"yes\":\n        found = True\n    count = count + 1\nif found:\n    print(\"Found\")\nelse:\n    print(\"Not found\")",
    explanation: "The flag remembers whether any answer matched yes.",
    commonMistake: "Keep the flag true after it has found a match."
  },
  {
    id: "L09-A13",
    kind: "writeCode",
    prompt: "Write a program that adds prices until -1 is entered, then prints the total.",
    starterCode: "total = 0\n",
    programTests: [
      { stdin: ["10", "5", "3", "-1"], expectedStdout: "18" },
      { stdin: ["-1"], expectedStdout: "0" },
      { stdin: ["100", "50", "-1"], expectedStdout: "150" }
    ],
    sampleSolution: "total = 0\nprice = int(input())\nwhile price != -1:\n    total = total + price\n    price = int(input())\nprint(total)",
    explanation: "The accumulator starts at zero and grows until the sentinel -1 stops the loop.",
    commonMistake: "Read the next price inside the loop, or it will never reach -1."
  },
  {
    id: "L09-A14",
    kind: "writeCode",
    prompt: "Read how many temperatures follow, then print the highest one.",
    starterCode: "count = int(input())\n",
    programTests: [
      { stdin: ["4", "18", "25", "19", "22"], expectedStdout: "25" },
      { stdin: ["1", "37"], expectedStdout: "37" },
      { stdin: ["3", "9", "2", "9"], expectedStdout: "9" }
    ],
    sampleSolution: "count = int(input())\nhighest = int(input())\nindex = 1\nwhile index < count:\n    temperature = int(input())\n    if temperature > highest:\n        highest = temperature\n    index = index + 1\nprint(highest)",
    explanation: "Start the maximum with the first reading, then update it whenever a bigger value appears.",
    commonMistake: "Do not start the highest at zero, or all-negative data would fail."
  }
];

const functionConcepts: Activity[] = [
  {
    id: "L10-A01",
    kind: "mcq",
    prompt: "Which keyword sends a value back from a function?",
    inlineCodeRefs: ["return"],
    options: ["return", "input", "while", "elif"],
    correctIndexes: [0],
    explanation: "A return statement gives the result to the caller."
  },
  {
    id: "L10-A02",
    kind: "orderLines",
    prompt: "Order the function and its call.",
    lines: [
      "def calculate_double(amount):",
      "    \"\"\"Return double the amount parameter.\"\"\"",
      "    return amount * 2",
      "result = calculate_double(5)",
      "print(result)"
    ],
    explanation: "The function is defined before it is called."
  },
  {
    id: "L10-A03",
    kind: "predictOutput",
    prompt: "What does this function code print?",
    code: "def add_two(number):\n    \"\"\"Return the number plus two.\"\"\"\n    return number + 2\n\nprint(add_two(5))",
    expectedStdout: "7",
    explanation: "The returned value is printed by the main program."
  },
  {
    id: "L10-A04",
    kind: "fillGaps",
    prompt: "Complete the function header and result line.",
    template: "def {{1}}(price):\n    \"\"\"Return a service fee for the price parameter.\"\"\"\n    return price + 5",
    gaps: [{ id: 1, accepted: ["add_service_fee"] }],
    explanation: "A function name should describe the result it calculates."
  },
  {
    id: "L10-A05",
    kind: "fixCode",
    prompt: "Fix the function that prints instead of returning.",
    brokenCode: "def add_fee(price):\n    \"\"\"Show the price with a fee.\"\"\"\n    print(price + 5)",
    fixedCode: "def add_fee(price):\n    \"\"\"Return the price plus a five QAR fee.\"\"\"\n    return price + 5",
    explanation: "A calculation function should return its result."
  },
  {
    id: "L10-A06",
    kind: "matching",
    prompt: "Match each function idea to its meaning.",
    pairs: [
      { left: "Parameter", right: "Name used inside the function" },
      { left: "Argument", right: "Value passed into the function" },
      { left: "Docstring", right: "Description inside the function" },
      { left: "Return value", right: "Result sent back" }
    ],
    explanation: "These terms describe how functions receive and return values."
  },
  {
    id: "L10-A07",
    kind: "shortAnswer",
    prompt: "Write the function call that passes ten to calculate_fee.",
    accepted: ["calculate_fee(10)"],
    expectedAnswerIsCode: true,
    explanation: "A function call uses the function name followed by arguments."
  },
  {
    id: "L10-A08",
    kind: "writeCode",
    prompt: "Write a function named calculate_fee that adds five to a price.",
    starterCode: "def calculate_fee(price):\n    \"\"\"Return the fee for the price parameter.\"\"\"\n",
    functionTests: [
      {
        functionName: "calculate_fee",
        cases: [
          { args: [10], expected: 15 },
          { args: [30], expected: 35 }
        ]
      }
    ],
    requireFunctionName: "calculate_fee",
    sampleSolution: "def calculate_fee(price):\n    \"\"\"Return the price plus a five QAR fee.\"\"\"\n    return price + 5",
    explanation: "The function receives one parameter and returns one calculated value."
  },
  {
    id: "L10-A09",
    kind: "writeCode",
    prompt: "Write a function named delivery_fee that returns the fee for an order total.",
    starterCode: "def delivery_fee(order_total):\n    \"\"\"Return the delivery fee for the order total parameter.\"\"\"\n",
    functionTests: [
      {
        functionName: "delivery_fee",
        cases: [
          { args: [40], expected: 12 },
          { args: [100], expected: 7 },
          { args: [200], expected: 0 }
        ]
      }
    ],
    requireFunctionName: "delivery_fee",
    sampleSolution: "def delivery_fee(order_total):\n    \"\"\"Return the delivery fee for the order total parameter.\"\"\"\n    if order_total < 50:\n        fee = 12\n    elif order_total < 150:\n        fee = 7\n    else:\n        fee = 0\n    return fee",
    explanation: "The function uses an if, elif and else chain before returning.",
    commonMistake: "Keep input and printing out of a calculation function."
  },
  {
    id: "L10-A10",
    kind: "orderLines",
    prompt: "Order the zero-argument function and its call.",
    lines: [
      "def get_welcome():",
      "    \"\"\"Return a welcome message for UDST students.\"\"\"",
      "    return \"Welcome to UDST\"",
      "message = get_welcome()",
      "print(message)"
    ],
    explanation: "A function can return the same value each time without parameters."
  },
  {
    id: "L10-A11",
    kind: "writeCode",
    prompt: "Write a function named is_passing that returns whether a grade is at least sixty.",
    starterCode: "def is_passing(grade):\n    \"\"\"Return True when the grade is at least sixty.\"\"\"\n",
    functionTests: [
      {
        functionName: "is_passing",
        cases: [
          { args: [72], expected: true },
          { args: [55], expected: false },
          { args: [60], expected: true }
        ]
      }
    ],
    requireFunctionName: "is_passing",
    sampleSolution: "def is_passing(grade):\n    \"\"\"Return True when the grade is at least sixty.\"\"\"\n    if grade >= 60:\n        result = True\n    else:\n        result = False\n    return result",
    explanation: "A full if and else sets a True or False result that the function returns.",
    commonMistake: "Return the boolean from the function instead of printing it inside."
  },
  {
    id: "L10-A12",
    kind: "writeCode",
    prompt: "Write a function named delivery_fee that returns 12, 7 or 0 QAR by order total.",
    starterCode: "def delivery_fee(order_total):\n    \"\"\"Return the delivery fee in QAR for the order total.\"\"\"\n",
    functionTests: [
      {
        functionName: "delivery_fee",
        cases: [
          { args: [30], expected: 12 },
          { args: [50], expected: 7 },
          { args: [149], expected: 7 },
          { args: [150], expected: 0 }
        ]
      }
    ],
    requireFunctionName: "delivery_fee",
    sampleSolution: "def delivery_fee(order_total):\n    \"\"\"Return the delivery fee in QAR for the order total.\"\"\"\n    if order_total < 50:\n        fee = 12\n    elif order_total < 150:\n        fee = 7\n    else:\n        fee = 0\n    return fee",
    explanation: "One if/elif/else picks the band: under 50, under 150, or 150 and above.",
    commonMistake: "Orders of exactly 150 QAR are free, so use < 150 for the middle band."
  }
];

const pythonFunctions: Activity[] = [
  {
    id: "L11-A01",
    kind: "mcq",
    prompt: "Which module gives access to square roots?",
    inlineCodeRefs: ["math.sqrt"],
    options: ["math", "random", "input", "print"],
    correctIndexes: [0],
    explanation: "The math module contains square-root tools."
  },
  {
    id: "L11-A02",
    kind: "predictOutput",
    prompt: "What error type appears after this code runs?",
    code: "def set_name():\n    \"\"\"Create a local name for demonstration.\"\"\"\n    local_name = \"Aisha\"\n\nset_name()\nprint(local_name)",
    expectedError: {
      type: "NameError",
      message: "The local name exists only inside the function."
    },
    explanation: "A local variable cannot be used outside its function."
  },
  {
    id: "L11-A03",
    kind: "orderLines",
    prompt: "Order the function that uses the math module.",
    lines: [
      "import math",
      "def circle_area(radius):",
      "    \"\"\"Return the area for the radius parameter.\"\"\"",
      "    return math.pi * radius * radius",
      "area = circle_area(2)",
      "print(area)"
    ],
    explanation: "The module is imported before the function uses it."
  },
  {
    id: "L11-A04",
    kind: "fillGaps",
    prompt: "Complete the square-root return statement.",
    template: "import math\n\ndef find_root(number):\n    \"\"\"Return the square root for the number parameter.\"\"\"\n    return math.{{1}}(number)",
    gaps: [{ id: 1, accepted: ["sqrt"] }],
    explanation: "The square-root function is in the math module."
  },
  {
    id: "L11-A05",
    kind: "matching",
    prompt: "Match each scope idea to its meaning.",
    pairs: [
      { left: "Local variable", right: "Created inside a function" },
      { left: "Global variable", right: "Created outside functions" },
      { left: "Return value", right: "Carries data out safely" },
      { left: "Parameter", right: "Carries data into a function" }
    ],
    explanation: "Good function design moves data with parameters and return values."
  },
  {
    id: "L11-A06",
    kind: "traceTable",
    prompt: "Trace the function call and returned value.",
    code: "def add_bonus(points):\n    \"\"\"Return points after adding a bonus.\"\"\"\n    result = points + 2\n    return result\n\nscore = add_bonus(3)",
    columns: ["points", "result", "score"],
    rows: [
      [3, "", ""],
      [3, 5, ""],
      ["", "", 5]
    ],
    explanation: "The local values disappear after the returned value is assigned."
  },
  {
    id: "L11-A07",
    kind: "shortAnswer",
    prompt: "Write the expression that uses the math module to find a square root of area.",
    accepted: ["math.sqrt(area)"],
    expectedAnswerIsCode: true,
    explanation: "Module functions are called with the module name and a dot."
  },
  {
    id: "L11-A08",
    kind: "writeCode",
    prompt: "Write a function named calculate_hypotenuse that uses the math module.",
    starterCode: "import math\n\ndef calculate_hypotenuse(side_a, side_b):\n    \"\"\"Return the hypotenuse for two side parameters.\"\"\"\n",
    functionTests: [
      {
        functionName: "calculate_hypotenuse",
        cases: [{ args: [3, 4], expected: 5 }]
      }
    ],
    requireFunctionName: "calculate_hypotenuse",
    sampleSolution: "import math\n\ndef calculate_hypotenuse(side_a, side_b):\n    \"\"\"Return the hypotenuse for two side parameters.\"\"\"\n    total = math.pow(side_a, 2) + math.pow(side_b, 2)\n    return math.sqrt(total)",
    explanation: "The function combines math module calls and returns the result."
  },
  {
    id: "L11-A09",
    kind: "predictOutput",
    prompt: "What does this name-cleaning snippet print?",
    code: "student_name = \"aisha\"\nprint(student_name.capitalize())",
    expectedStdout: "Aisha",
    explanation: "The method makes the first letter capital and the rest lowercase.",
    commonMistake: "It does not make every letter capital."
  },
  {
    id: "L11-A10",
    kind: "predictOutput",
    prompt: "What does this function print?",
    code: "message = \"Welcome\"\ndef show():\n    \"\"\"Print the global message.\"\"\"\n    print(message)\n\nshow()",
    expectedStdout: "Welcome",
    explanation: "A function can read a global value, but this course avoids changing one."
  },
  {
    id: "L11-A11",
    kind: "predictOutput",
    prompt: "What does this math module call print?",
    code: "import math\nprint(math.pow(2, 3))",
    expectedStdout: "8.0",
    explanation: "The math power call returns a decimal value."
  },
  {
    id: "L11-A12",
    kind: "writeCode",
    prompt: "Write a function named hypotenuse that uses math.sqrt to return the longest side.",
    starterCode: "import math\n\n\ndef hypotenuse(side_a, side_b):\n    \"\"\"Return the hypotenuse length for the two sides.\"\"\"\n",
    functionTests: [
      {
        functionName: "hypotenuse",
        cases: [
          { args: [3, 4], expected: 5.0 },
          { args: [6, 8], expected: 10.0 }
        ]
      }
    ],
    requireFunctionName: "hypotenuse",
    sampleSolution: "import math\n\n\ndef hypotenuse(side_a, side_b):\n    \"\"\"Return the hypotenuse length for the two sides.\"\"\"\n    squared_sum = side_a * side_a + side_b * side_b\n    length = math.sqrt(squared_sum)\n    return length",
    explanation: "Square each side, add them, then math.sqrt gives the hypotenuse length.",
    commonMistake: "Import math at the top before you call math.sqrt."
  },
  {
    id: "L11-A13",
    kind: "writeCode",
    prompt: "Write a function named seconds_total that returns the seconds in hours and minutes.",
    starterCode: "def seconds_total(hours, minutes):\n    \"\"\"Return the total number of seconds in the time.\"\"\"\n",
    functionTests: [
      {
        functionName: "seconds_total",
        cases: [
          { args: [1, 30], expected: 5400 },
          { args: [0, 45], expected: 2700 },
          { args: [2, 0], expected: 7200 }
        ]
      }
    ],
    requireFunctionName: "seconds_total",
    sampleSolution: "def seconds_total(hours, minutes):\n    \"\"\"Return the total number of seconds in the time.\"\"\"\n    total = hours * 3600 + minutes * 60\n    return total",
    explanation: "Each hour is 3600 seconds and each minute is 60, so combine both parts.",
    commonMistake: "Return the total rather than printing it inside the function."
  }
];

const pythonFunctionsTwo: Activity[] = [
  {
    id: "L12-A01",
    kind: "predictOutput",
    prompt: "What does this string-method snippet print?",
    code: "code = \"infs1101\"\nclean_code = code.replace(\"infs\", \"INFS\", 1)\nprint(clean_code)",
    expectedStdout: "INFS1101",
    explanation: "The replace method changes the first matching part."
  },
  {
    id: "L12-A02",
    kind: "mcq",
    prompt: "Which call can generate an integer between one and six?",
    codeOptions: ["random.randint(1, 6)", "math.sqrt(6)", "len(\"six\")", "input()"],
    correctIndexes: [0],
    explanation: "The random module can choose an integer in a closed range."
  },
  {
    id: "L12-A03",
    kind: "fillGaps",
    prompt: "Complete the print call that joins two labels with a dash.",
    template: "print(\"INFS\", \"1101\", {{1}}=\"-\")",
    gaps: [{ id: 1, accepted: ["sep"] }],
    explanation: "The sep keyword controls the separator between printed values."
  },
  {
    id: "L12-A04",
    kind: "matching",
    prompt: "Match each extra string method to its purpose.",
    pairs: [
      { left: "startswith", right: "Check the beginning" },
      { left: "endswith", right: "Check the ending" },
      { left: "find", right: "Locate text" },
      { left: "isspace", right: "Check spaces only" }
    ],
    explanation: "These methods support richer validation and text processing."
  },
  {
    id: "L12-A05",
    kind: "orderLines",
    prompt: "Order the function that counts vowels in a word.",
    lines: [
      "def count_vowels(word):",
      "    \"\"\"Return the number of vowels in the word parameter.\"\"\"",
      "    index = 0",
      "    total_vowels = 0",
      "    while index < len(word):",
      "        if word[index].lower() in \"aeiou\":",
      "            total_vowels = total_vowels + 1",
      "        index = index + 1",
      "    return total_vowels"
    ],
    explanation: "The loop visits each character by index."
  },
  {
    id: "L12-A06",
    kind: "fixCode",
    prompt: "Fix the signed-number validation.",
    brokenCode: "value = input()\nif value.isnumeric():\n    print(\"Integer\")",
    fixedCode: "value = input()\nclean_value = value.replace(\"-\", \"\", 1)\nif clean_value.isnumeric():\n    print(\"Integer\")",
    explanation: "Removing one leading minus sign allows negative integers."
  },
  {
    id: "L12-A07",
    kind: "shortAnswer",
    prompt: "Write the expression that checks whether code starts with INFS.",
    accepted: ["code.startswith(\"INFS\")"],
    expectedAnswerIsCode: true,
    caseSensitive: true,
    explanation: "The startswith method checks the beginning of a string."
  },
  {
    id: "L12-A08",
    kind: "writeCode",
    prompt: "Write a function named roll_die that returns a random die value.",
    starterCode: "import random\n\ndef roll_die():\n    \"\"\"Return a random die value.\"\"\"\n",
    functionTests: [
      {
        functionName: "roll_die",
        cases: [{ args: [], property: { type: "intInRange", min: 1, max: 6 } }]
      }
    ],
    requireFunctionName: "roll_die",
    randomMode: "range",
    sampleSolution: "import random\n\ndef roll_die():\n    \"\"\"Return a random integer from one to six.\"\"\"\n    return random.randint(1, 6)",
    explanation: "The result is checked by range so the test is not flaky."
  },
  {
    id: "L12-A09",
    kind: "writeCode",
    prompt: "Write a function named qar_to_usd that converts QAR to USD.",
    starterCode: "def qar_to_usd(amount):\n    \"\"\"Return the USD amount rounded to two decimal places.\"\"\"\n",
    functionTests: [
      {
        functionName: "qar_to_usd",
        cases: [
          { args: [36.5], expected: 10.0 },
          { args: [73], expected: 20.0 }
        ]
      }
    ],
    requireFunctionName: "qar_to_usd",
    sampleSolution: "def qar_to_usd(amount):\n    \"\"\"Return the USD amount rounded to two decimal places.\"\"\"\n    usd_amount = amount / 3.65\n    return round(usd_amount, 2)",
    explanation: "The function converts the amount and rounds it to two decimals.",
    commonMistake: "Return the rounded value instead of printing it."
  },
  {
    id: "L12-A10",
    kind: "writeCode",
    prompt: "Write a function named is_close that checks whether a guess is within three.",
    starterCode: "def is_close(guess, target):\n    \"\"\"Return whether the guess is within three of the target.\"\"\"\n",
    functionTests: [
      {
        functionName: "is_close",
        cases: [
          { args: [10, 12], expected: true },
          { args: [10, 20], expected: false }
        ]
      }
    ],
    requireFunctionName: "is_close",
    sampleSolution: "def is_close(guess, target):\n    \"\"\"Return whether the guess is within three of the target.\"\"\"\n    difference = abs(guess - target)\n    if difference <= 3:\n        close_enough = True\n    else:\n        close_enough = False\n    return close_enough",
    explanation: "The absolute difference works for guesses above or below the target.",
    commonMistake: "Use a full if and else, not a one-line decision."
  },
  {
    id: "L12-A11",
    kind: "predictOutput",
    prompt: "What does this power expression print?",
    code: "print(2 ** 5)",
    expectedStdout: "32",
    explanation: "The power operator multiplies two by itself five times."
  },
  {
    id: "L12-A12",
    kind: "matching",
    prompt: "Match each math call to its result.",
    displayCode: "import math",
    pairs: [
      { left: "math.factorial of five", right: "120" },
      { left: "math greatest common divisor of twelve and eighteen", right: "6" }
    ],
    codeLabels: ["math.factorial(5)", "math.gcd(12, 18)"],
    explanation: "The factorial call multiplies down to one, and gcd finds the largest shared factor."
  },
  {
    id: "L12-A13",
    kind: "fillGaps",
    prompt: "Complete the keyword value so the output is A, space, B and an exclamation mark.",
    template: "print(\"A\", \"B\", end={{1}})",
    gaps: [{ id: 1, accepted: ["\"!\"", "'!'"] }],
    explanation: "The end keyword changes what is written after the last value."
  },
  {
    id: "L12-A14",
    kind: "writeCode",
    prompt: "Write a function named final_price that applies a discount.",
    starterCode: "def final_price(price, discount_percent):\n    \"\"\"Return the price after the discount, rounded to two decimals.\"\"\"\n",
    functionTests: [
      {
        functionName: "final_price",
        cases: [
          { args: [100, 10], expected: 90.0 },
          { args: [50, 5], expected: 47.5 },
          { args: [80, 25], expected: 60.0 }
        ]
      }
    ],
    requireFunctionName: "final_price",
    sampleSolution: "def final_price(price, discount_percent):\n    \"\"\"Return the price after the discount, rounded to two decimals.\"\"\"\n    discount = price * discount_percent / 100\n    new_price = price - discount\n    return round(new_price, 2)",
    explanation: "The function calculates the discount first, then rounds the result."
  },
  {
    id: "L12-A15",
    kind: "shortAnswer",
    prompt: "What value does abs of negative seven return?",
    accepted: ["7"],
    expectedAnswerIsCode: false,
    explanation: "The absolute value is the distance from zero."
  },
  {
    id: "L12-A16",
    kind: "shortAnswer",
    prompt: "Write the expression that returns the value in name with its first letter capitalised.",
    accepted: ["name.capitalize()"],
    expectedAnswerIsCode: true,
    caseSensitive: true,
    explanation: "The capitalise method changes the first letter and returns a string."
  },
  {
    id: "L12-A17",
    kind: "orderLines",
    prompt: "Order the function that reverses a word using a while loop.",
    lines: [
      "def reverse_text(word):",
      "    \"\"\"Return the word reversed using a while loop.\"\"\"",
      "    index = len(word) - 1",
      "    result = \"\"",
      "    while index >= 0:",
      "        result = result + word[index]",
      "        index = index - 1",
      "    return result",
      "word = \"Doha\"",
      "print(reverse_text(word))"
    ],
    explanation: "The loop builds a new string from the last character to the first."
  },
  {
    id: "L12-A18",
    kind: "writeCode",
    prompt: "Write a function named power_value that returns the base raised to the exponent.",
    starterCode: "def power_value(base, exponent):\n    \"\"\"Return the base raised to the exponent.\"\"\"\n",
    functionTests: [
      {
        functionName: "power_value",
        cases: [
          { args: [2, 5], expected: 32 },
          { args: [10, 3], expected: 1000 },
          { args: [5, 0], expected: 1 }
        ]
      }
    ],
    requireFunctionName: "power_value",
    sampleSolution: "def power_value(base, exponent):\n    \"\"\"Return the base raised to the exponent.\"\"\"\n    result = base ** exponent\n    return result",
    explanation: "The ** operator raises the base to the exponent, and any value to the power 0 is 1.",
    commonMistake: "Use the ** operator rather than multiplying the base by hand."
  },
  {
    id: "L12-A19",
    kind: "writeCode",
    prompt: "Write a function named count_vowels that returns how many vowels a word contains.",
    starterCode: "def count_vowels(word):\n    \"\"\"Return the number of vowels in the word.\"\"\"\n",
    functionTests: [
      {
        functionName: "count_vowels",
        cases: [
          { args: ["Doha"], expected: 2 },
          { args: ["Qatar"], expected: 2 },
          { args: ["xyz"], expected: 0 },
          { args: ["AEIOU"], expected: 5 }
        ]
      }
    ],
    requireFunctionName: "count_vowels",
    sampleSolution: "def count_vowels(word):\n    \"\"\"Return the number of vowels in the word.\"\"\"\n    vowels = \"aeiou\"\n    count = 0\n    index = 0\n    lowered = word.lower()\n    while index < len(lowered):\n        letter = lowered[index]\n        if letter in vowels:\n            count = count + 1\n        index = index + 1\n    return count",
    explanation: "Lower the word, then a while loop checks each letter against the vowels string.",
    commonMistake: "Lower the word first so capital vowels are counted too."
  }
];

export const lessons: Lesson[] = [
  {
    id: "L01",
    number: 1,
    title: "Foundations & Computational Thinking",
    blurb: "Plan problems with IPO, algorithms and clear steps.",
    newSkills: ["IPO model", "Algorithms", "Pseudocode", "Sequence"],
    activities: foundations
  },
  {
    id: "L02",
    number: 2,
    title: "Computational Thinking",
    blurb: "Use decomposition, patterns, abstraction and flowchart ideas.",
    newSkills: ["Decomposition", "Pattern recognition", "Abstraction", "Flowcharts"],
    activities: computationalThinking
  },
  {
    id: "L03",
    number: 3,
    title: "Input, Output & Variables",
    blurb: "Read typed values, cast them and print useful results.",
    newSkills: ["input", "print", "variables", "casting", "arithmetic", "f-strings", "error types"],
    activities: inputOutputVariables
  },
  {
    id: "L04",
    number: 4,
    title: "Simple Decisions",
    blurb: "Use comparisons and simple branches.",
    newSkills: ["comparisons", "and", "or", "not", "if", "else"],
    activities: simpleDecisions
  },
  {
    id: "L05",
    number: 5,
    title: "Complex Decisions",
    blurb: "Choose between several paths and nested decisions.",
    newSkills: ["elif", "nested if", "range checks", "flags with decisions"],
    activities: complexDecisions
  },
  {
    id: "L06",
    number: 6,
    title: "Strings",
    blurb: "Inspect, slice and clean text values.",
    newSkills: ["len", "indexing", "slicing", "string methods", "normalisation"],
    activities: strings
  },
  {
    id: "L07",
    number: 7,
    title: "Counter-Controlled Loops",
    blurb: "Repeat steps with counted while loops.",
    newSkills: ["while loops", "counters", "trace tables", "loop bugs"],
    activities: counterLoops
  },
  {
    id: "L08",
    number: 8,
    title: "Sentinel-Controlled Loops",
    blurb: "Repeat until a sentinel or valid value is reached.",
    newSkills: ["sentinel loops", "validation loops", "read-before pattern"],
    activities: sentinelLoops
  },
  {
    id: "L09",
    number: 9,
    title: "Programming Patterns",
    blurb: "Apply counting, accumulation, flags and maximum patterns.",
    newSkills: ["counting", "accumulation", "flag pattern", "maximum pattern", "minimum pattern"],
    activities: patterns
  },
  {
    id: "L10",
    number: 10,
    title: "Function Concepts",
    blurb: "Define functions, pass parameters and return values.",
    newSkills: ["def", "parameters", "return", "docstrings", "local variables"],
    activities: functionConcepts
  },
  {
    id: "L11",
    number: 11,
    title: "Python Functions",
    blurb: "Use functions with scope ideas and the math module.",
    newSkills: ["math module", "local scope", "global scope", "module calls", "capitalize"],
    activities: pythonFunctions
  },
  {
    id: "L12",
    number: 12,
    title: "Python Functions 2",
    blurb: "Use richer string methods, math tools and random values.",
    newSkills: ["random", "extra string methods", "print options", "extra math tools", "round", "abs", "power operator"],
    activities: pythonFunctionsTwo
  }
];
