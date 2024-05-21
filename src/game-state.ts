import { BOARD_HEIGHT, BOARD_WIDTH } from "./config";


export enum Player {
  X, O,
};

export class GameState {
  board: (Player | null)[][];
  nextTurn: Player;

  // Creates an empty game state:
  constructor() {
    this.board = Array(BOARD_HEIGHT).fill(0).map(
      () => Array(BOARD_WIDTH).fill(null),
    );
    // O always goes first:
    this.nextTurn = Player.O;
  }

  getValueAtSquare(row: number, col: number): Player | null {
    return this.board[row][col];
  }

  makeMove(row: number, col: number) {
    if (this.board[row][col] !== null) {
      throw new Error("Can't choose a space that's already taken.");
    }
    this.board[row][col] = this.nextTurn;
    this.nextTurn = (this.nextTurn === Player.O ? Player.X : Player.O);
  }
}
