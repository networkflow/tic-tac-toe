import { GameState } from "./game-state";
import { getBoardRendering } from "./interface";


let gameState = new GameState();
gameState.makeMove(0, 0);
gameState.makeMove(1, 1);
console.log(getBoardRendering(gameState));
