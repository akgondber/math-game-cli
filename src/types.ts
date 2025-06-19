type BasicMathOperation = "add" | "subtract" | "multiply" | "divide";

type TwoItemsOperation = {
  first: number;
  second: number;
  operation: BasicMathOperation;
  result: number;
};

export { BasicMathOperation, TwoItemsOperation };
