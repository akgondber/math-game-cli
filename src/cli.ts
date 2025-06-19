#!/usr/bin/env node

import terminalSize from "terminal-size";
import {
  clearTerminal,
  drawEight,
  drawOne,
  drawMinus,
  drawEqual,
  drawZero,
  drawDot,
  drawQuestion,
  drawMultiply,
  drawDivide,
  drawNine,
  drawSix,
  drawPlus,
  drawFive,
  drawSeven,
  drawFour,
  drawThree,
  drawTwo,
  drawSuccess,
  drawError,
} from "math-figures";
import ansiEscapes from "ansi-escapes";
import figureSet from "figures";
import chalk from "chalk";
import * as R from "remeda";
import readline from "readline";
import { promisify } from "util";
import type { BasicMathOperation, TwoItemsOperation } from "./types.js";
import { suites } from "./index.js";
import delay from "delay";

readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY) process.stdin.setRawMode(true);

const getShuffledSuites = (suites) => R.take(R.shuffle(R.flat(suites)), 15);
let shuffledSuites: TwoItemsOperation[] = getShuffledSuites(suites);
let score = 0;
const leftPadding = 2;
let userStr = "";
let lastOccupied;

const updateScore = (newValue: number) => {
  process.stdout.write(ansiEscapes.cursorSavePosition);
  process.stdout.write(ansiEscapes.cursorTo(0, 0));
  // process.stdout.write(`Score: ${newValue}`);
  process.stdout.write(ansiEscapes.cursorRestorePosition);
};
let roundIndex = 0;

// const drawTick = () => {
//   process.stdout.write(ansiEscapes.cursorSavePosition);
//   process.stdout.write(ansiEscapes.cursorMove(1, 3));
//   process.stdout.write(chalk.green(figureSet.lineBackslash));
//   process.stdout.write(chalk.green(figureSet.lineSlash));
//   process.stdout.write(ansiEscapes.cursorMove(0, -1));
//   process.stdout.write(chalk.green(figureSet.lineSlash));
//   process.stdout.write(ansiEscapes.cursorRestorePosition);
// };

// const drawError = () => {
//   process.stdout.write(ansiEscapes.cursorSavePosition);
//   process.stdout.write(ansiEscapes.cursorMove(1, 3));
//   process.stdout.write(chalk.green(figureSet.lineSlash));
//   process.stdout.write(ansiEscapes.cursorMove(1, 1));
//   process.stdout.write(chalk.green(figureSet.lineSlash));

//   process.stdout.write(ansiEscapes.cursorMove(0, -1));
//   process.stdout.write(chalk.green(figureSet.lineBackslash));

//   process.stdout.write(ansiEscapes.cursorRestorePosition);
// };

const showResults = () => {
  process.stdout.write(ansiEscapes.cursorMove(1, 1));
  process.stdout.write(`Score: ${score}`);
  process.stdout.write(ansiEscapes.cursorNextLine);
  process.stdout.write(ansiEscapes.cursorNextLine);
  process.stdout.write(ansiEscapes.cursorForward(1));
  process.stdout.write(`${chalk.bold.cyan("n")} - Start new round`);
  process.stdout.write(ansiEscapes.cursorForward(3));
  process.stdout.write(
    `${chalk.bold.cyan("n")} or ${chalk.bold.cyan("CTRL")}+${chalk.cyan("C")}- Quit`,
  );
};

const handleMenu = () => {
  process.stdin.on("keypress", menuListener);
};

const menuListener = (ch: string, key: any) => {
  if (key && key.name === "y") {
    // handleUserAnswer();
    // roundIndex = 0;
    shuffledSuites = getShuffledSuites(suites);
    startGame();
    runRound(shuffledSuites[0]);
  } else if (key && key.name === "q") {
    process.stdin.pause();
  } else if (key && key.ctrl && key.name === "c") {
    process.stdin.pause();
  }
};

const userAnswerListener = async (ch: string, key: any) => {
  if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(key.name)) {
    userStr += key.name;
    const occupied = drawDigit(Number(key.name));
    lastOccupied = occupied;
    process.stdout.write(ansiEscapes.cursorMove(occupied[0] + 2, 0));
  } else if (key && key.name === "return") {
    if (shuffledSuites[roundIndex].result === Number(userStr)) {
      score++;
      process.stdout.write(ansiEscapes.cursorMove(2, 0));
      drawSuccess();
    } else {
      process.stdout.write(ansiEscapes.cursorMove(2, 0));
      drawError();
    }
    roundIndex++;

    await delay(1400);
    if (roundIndex >= shuffledSuites.length) {
      stopGame();
    } else {
      runRound(shuffledSuites[roundIndex]);
    }
  } else if (key && key.name === "backspace") {
    // process.stdout.write(key.name);
    // process.stdout.write(ansiEscapes.cursorMove(-lastOccupied[0]-2, 0))
    // process.stdout.write(ansiEscapes.cursorMove(-2, 1));
    // process.stdout.write(` `);
    // process.stdout.write(` `);
    // process.stdout.write(` `);
    R.times(lastOccupied[1] + 1, (i) => {
      process.stdout.write(ansiEscapes.cursorMove(-lastOccupied[0] - 2, 0));

      R.times(lastOccupied[0] + 2, () => {
        process.stdout.write(` `);
      });
      process.stdout.write(ansiEscapes.cursorMove(0, 1));
      // process.stdout.write(ansiEscapes.cursorMove(-lastOccupied[0]-1, i));
    });
    process.stdout.write(ansiEscapes.cursorMove(-1, -lastOccupied[1] - 1));

    // R.times(lastOccupied[0] + 2, () => {
    //   process.stdout.write(' ');
    // });
    // process.stdout.write(' ');
    process.stdout.write(ansiEscapes.cursorMove(-lastOccupied[0] - 1, 0));
    // process.stdout.write(ansiEscapes.cursorMove(-1, -lastOccupied[1]));

    userStr = userStr.slice(0, userStr.length - 1);
  } else if (key.name === "y") {
    // if ()
    roundIndex++;

    score++;
    if (roundIndex >= suites.length) {
      stopGame();
    } else {
      runRound(shuffledSuites[roundIndex]);
    }
  } else if (key.name === "n") {
    roundIndex++;
    if (roundIndex >= suites.length) {
      stopGame();
    } else {
      runRound(shuffledSuites[roundIndex]);
    }
  } else if (key && key.ctrl && key.name == "c") {
    process.stdout.write(ansiEscapes.clearTerminal);
    process.stdin.pause();
  }
};

const handleUserAnswer = () => {
  process.stdin.on("keypress", userAnswerListener);
};

const startGame = () => {
  process.stdin.removeListener("keypress", menuListener);
  handleUserAnswer();
  roundIndex = 0;
};

const stopGame = () => {
  clearTerminal();
  process.stdin.removeListener("keypress", userAnswerListener);
  showResults();
  handleMenu();
};

const runRound = (expression: TwoItemsOperation) => {
  process.stdout.write(ansiEscapes.clearTerminal);
  let topOffset = 1;
  updateScore(score);
  userStr = "";

  process.stdout.write(ansiEscapes.cursorMove(0, topOffset));
  // process.stdout.write(ansiEscapes.cursorSavePosition);
  // let occupied31 = drawThree();
  const occupyingList: number[][] = [];
  let occupied = drawNumber(expression.first);
  occupyingList.push(occupied);
  // process.stdout.write(ansiEscapes.cursorRestorePosition);
  process.stdout.write(ansiEscapes.cursorMove(occupied[0] + leftPadding, 0));
  process.stdout.write(ansiEscapes.cursorSavePosition);
  let operOccupied = drawOper(expression.operation);
  occupyingList.push(operOccupied);
  process.stdout.write(ansiEscapes.cursorRestorePosition);
  process.stdout.write(
    ansiEscapes.cursorMove(operOccupied[0] + leftPadding, 0),
  );
  // process.stdout.write(ansiEscapes.cursorSavePosition);
  let occupied2 = drawNumber(expression.second);
  occupyingList.push(occupied2);
  // process.stdout.write(ansiEscapes.cursorRestorePosition);
  process.stdout.write(ansiEscapes.cursorMove(occupied2[0] + leftPadding, 0));
  process.stdout.write(ansiEscapes.cursorSavePosition);
  const equalOccupied = drawEqual();
  occupyingList.push(equalOccupied);
  process.stdout.write(ansiEscapes.cursorRestorePosition);
  process.stdout.write(
    ansiEscapes.cursorMove(equalOccupied[0] + leftPadding, 0),
  );
  //   occupyingList.push([leftPadding, 0]);

  // const valueOccupied = drawNumber(value);
  // occupyingList.push(valueOccupied);
  // process.stdout.write(ansiEscapes.cursorMove(1, 0));
  // let occupied72 = drawDot();
  // process.stdout.write(ansiEscapes.cursorMove(2, -(occupied[1]-occupied72[1] - 1)));
  // let occupied73 = drawEight();
  // process.stdout.write(ansiEscapes.cursorMove(2, -(occupied73[1] - signOffset)));
  // let occupied2 = drawMultiply();
  // process.stdout.write(ansiEscapes.cursorMove(2, -(occupied2[1])));

  // let occupied3 = drawSix();
  // process.stdout.write(ansiEscapes.cursorMove(2, -(occupied3[1] - topOffset - topOffset)));
  // process.stdout.write(ansiEscapes.cursorSavePosition);
  // let occupied31 = drawThree();
  // process.stdout.write(ansiEscapes.cursorRestorePosition);
  // process.stdout.write(ansiEscapes.cursorMove(8, 0));
  // process.stdout.write(ansiEscapes.cursorSavePosition);
  // let occupied4 = drawEqual();
  // process.stdout.write(ansiEscapes.cursorRestorePosition);
  // // process.stdout.write(ansiEscapes.cursorNextLine);

  // process.stdout.write(ansiEscapes.cursorMove(6, 0));
  // // process.stdout.write(ansiEscapes.cursorMove(1, -(occupied4[1] + topOffset + nextLineCount)));
  // process.stdout.write(ansiEscapes.cursorSavePosition);
  // let occupied5 = drawFive();
  // process.stdout.write(ansiEscapes.cursorRestorePosition);
  // // process.stdout.write(ansiEscapes.cursorMove(1, -(occupied5[1] + topOffset + nextLineCount)));
  // process.stdout.write(ansiEscapes.cursorMove(occupied5[0], 0));
  // let occupied6 = drawTwo();
  //   process.stdout.write(ansiEscapes.cursorNextLine);
  let horizontalTaken = 0;

  // for (let i = 0; i < occupyingList.length; i++) {
  //     horizontalTaken += occupyingList[i][0];
  // }
  horizontalTaken = R.reduce(
    occupyingList,
    (prev: number, curr: number[]): number => {
      return prev + curr[0];
    },
    0,
  );
  process.stdout.write(ansiEscapes.cursorSavePosition);
  process.stdout.write(ansiEscapes.cursorNextLine);
  // process.stdout.write(ansiEscapes.cursorNextLine);
  // process.stdout.write(ansiEscapes.cursorNextLine);
  const { columns, rows } = terminalSize();

  process.stdout.write(
    ansiEscapes.cursorMove(horizontalTaken > rows - 3 ? 4 : 3, 8),
  );
  // process.stdout.write(`${Math.floor(horizontalTaken / 2)}`);
  // drawQuestion();
  //   process.stdout.write(ansiEscapes.cursorMove(3, 0));
  process.stdout.write(`${chalk.bold("SCORE")}: ${chalk.cyan(score)}`);
  process.stdout.write(ansiEscapes.cursorForward(3));
  process.stdout.write(`${chalk.bold("ENTER")} - submit`);
  // process.stdout.write(occupyingList.reduce((prev, curr) => {
  //     return prev + curr[0];
  // }, 0);

  process.stdout.write(ansiEscapes.cursorRestorePosition);
  let i = 0;
  // setInterval(() => {
  //   updateScore(i);
  //   i += 2;
  // }, 1000);
};

const checkAnswer = () => {};

const drawDigit = (number: number): number[] => {
  let result = [0, 0];
  process.stdout.write(ansiEscapes.cursorSavePosition);
  if (number === 0) {
    result = drawZero();
  } else if (number === 1) {
    result = drawOne();
  } else if (number === 2) {
    result = drawTwo();
  } else if (number === 3) {
    result = drawThree();
  } else if (number === 4) {
    result = drawFour();
  } else if (number === 5) {
    result = drawFive();
  } else if (number === 6) {
    result = drawSix();
  } else if (number === 7) {
    result = drawSeven();
  } else if (number === 8) {
    result = drawEight();
  } else if (number === 9) {
    result = drawNine();
  }

  process.stdout.write(ansiEscapes.cursorRestorePosition);
  return result;
  // return [0, 0];
};

const drawNumber = (value: number): number[] => {
  if (value.toString().length === 1) {
    return drawDigit(value);
  } else {
    const digitSymbols = value.toString().split("");
    const accum: Array<number[]> = [];
    const digits = R.map(digitSymbols, (digitStr, index) => {
      // process.stdout.write(ansiEscapes.cursorSavePosition);
      const currOccupying = drawDigit(Number(digitStr));
      // process.stdout.write(ansiEscapes.cursorRestorePosition);
      if (index < digitSymbols.length - 1) {
        process.stdout.write(ansiEscapes.cursorMove(currOccupying[0], 0));
      }
      accum.push(currOccupying);
      if (index < digitSymbols.length - 1) {
        process.stdout.write(ansiEscapes.cursorMove(leftPadding, 0));
        accum.push([leftPadding, 0]);
      }
    });
    // return accum;
    const totalOccupied = R.reduce(
      accum,
      (prev, curr) => {
        return [prev[0] + curr[0], prev[1] + curr[1]];
      },
      [0, 0],
    );
    // process.stdout.write(ansiEscapes.cursorMove(-(totalOccupied[0] + 4), 0));
    return accum[accum.length - 1];
    // return totalOccupied;
  }

  // return [0, 0];
};

const drawOper = (oper: BasicMathOperation): number[] => {
  if (oper === "add") {
    return drawPlus();
  } else if (oper === "divide") {
    return drawDivide();
  } else if (oper === "multiply") {
    return drawMultiply();
  } else if (oper === "subtract") {
    return drawMinus();
  }

  return [0, 0];
};

startGame();
runRound(shuffledSuites[0]);

// process.stdout.write(ansiEscapes.cursorSavePosition);
// process.stdout.write('score');
// process.stdout.write(ansiEscapes.cursorRestorePosition);
// process.stdout.write(ansiEscapes.cursorMove(2, occupied3[1] - occupied4[1]));
