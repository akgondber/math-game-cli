import * as R from "remeda";
import type { BasicMathOperation, TwoItemsOperation } from "./types.js";

const multiplyOperationsSuite: TwoItemsOperation[] = R.map(
  [
    [8, 5, 40],
    [6, 8, 48],
    [5, 9, 45],
    [4, 7, 28],
    [2, 4, 8],
    [3, 6, 18],
    [6, 9, 54],
    [8, 8, 64],
  ],
  (item): TwoItemsOperation => {
    return {
      first: item[0] as number,
      second: item[1] as number,
      operation: "multiply" as BasicMathOperation,
      result: item[2] as number,
    };
  },
);

const addOperationsSuite: TwoItemsOperation[] = R.map(
  [
    [17, 15, 32],
    [11, 8, 19],
    [18, 23, 41],
    [13, 24, 37],
    [26, 38, 64],
  ],
  (item): TwoItemsOperation => {
    return {
      first: item[0] as number,
      second: item[1] as number,
      operation: "add" as BasicMathOperation,
      result: item[2] as number,
    };
  },
);

const suites: Array<TwoItemsOperation[]> = [
  multiplyOperationsSuite,
  addOperationsSuite,
];

export { suites };
