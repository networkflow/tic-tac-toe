import { createInterface } from 'node:readline/promises';

import { GameState } from './game-state'
import { printBoard, promptUserForValidMove } from './interface';


// Wrapping everything in a main function this way to avoid warnings like
//   Top-level 'await' expressions are only allowed when the 'module' option is
//   set to ...
// See this https://stackoverflow.com/a/68824041/3113439 and this
// https://stackoverflow.com/a/43756836/3113439 for more context.
const main = async () => {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  let gameState = new GameState();

  while (!gameState.isGameFinished()) {
    printBoard(gameState);
    const move = await promptUserForValidMove(rl, gameState);
    gameState.makeMove(...move);
  }
  printBoard(gameState);
};
main();
