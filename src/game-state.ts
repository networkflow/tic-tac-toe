import { BOARD_HEIGHT, BOARD_WIDTH } from "./config";


export enum Player {
  X, O,
};

export class GameState {
  protected board: (Player | null)[][];
  protected nextTurn: Player;
  protected gameFinished: boolean;

  // Creates an empty game state:
  constructor() {
    this.board = Array(BOARD_HEIGHT).fill(0).map(
      () => Array(BOARD_WIDTH).fill(null),
    );
    // O always goes first:
    this.nextTurn = Player.O;
    this.gameFinished = false;
  }

  getValueAtSquare(row: number, col: number): Player | null {
    return this.board[row][col];
  }

  isGameFinished(): boolean {
    return this.gameFinished;
  }

  moveAllowed(row: number, col: number): boolean {
    return !this.isGameFinished() && this.board[row][col] === null;
  }

  makeMove(row: number, col: number): void {
    if (!this.moveAllowed(row, col)) {
      throw new Error("Can't choose a space that's already taken.");
    }
    this.board[row][col] = this.nextTurn;
    this.nextTurn = (this.nextTurn === Player.O ? Player.X : Player.O);
  }

  protected _checkGameFinished(): void {
    // TODO
  }
}
