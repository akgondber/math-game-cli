import type { Operation } from "./types.js";

const suites: Array<[number, number, Operation, number, boolean]> = [
  [8, 5, "multiply", 40, true],
  [6, 8, "multiply", 48, true],
  [5, 9, "multiply", 45, true],
  [4, 7, "multiply", 28, true],
  [2, 4, "multiply", 8, true],
  [3, 6, "multiply", 18, true],
  [6, 9, "multiply", 54, true],
  [8, 8, "multiply", 64, true],
];

export { suites };
