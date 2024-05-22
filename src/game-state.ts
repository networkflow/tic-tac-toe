import { BOARD_HEIGHT, BOARD_WIDTH, NUM_IN_A_ROW_TO_WIN } from "./config";


export enum Player {
  // The default integer values cause problems with the || operator due to 0:
  X = "X",
  O = "O",
};
export enum GameResult {
  XWon,
  OWon,
  Tie,
}

export class GameState {
  protected board: (Player | null)[][];
  protected nextTurn: Player;
  protected gameResult: GameResult | null;

  // Creates an empty game state:
  constructor() {
    this.board = Array(BOARD_HEIGHT).fill(0).map(
      () => Array(BOARD_WIDTH).fill(null),
    );
    // O goes first:
    this.nextTurn = Player.O;
    this.gameResult = null;
  }

  getValueAtSquare(row: number, col: number): Player | null {
    return this.board[row][col];
  }

  getResult(): GameResult | null {
    return this.gameResult;
  }

  isGameFinished(): boolean {
    return this.gameResult !== null;
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
    this.gameResult = this._computeGameResult();
  }

  protected _computeGameResult(): GameResult | null {
    // Either a) someone won, b) no more free squares (tie), or c) nothing yet
    switch (this._checkIfPlayerWon()) {
      case Player.O: return GameResult.OWon;
      case Player.X: return GameResult.XWon;
      case null: return this._isBoardFull() ? GameResult.Tie : null;
    }
  }

  protected _checkIfPlayerWon(): Player | null {
    const topRowLocations: [number, number][] =
      Array.from({length: BOARD_WIDTH}, (_, i) => [0, i]);
    const leftColLocations: [number, number][] =
      Array.from({length: BOARD_HEIGHT}, (_, i) => [i, 0]);
    const bottomRowLocations: [number, number][] =
      Array.from({length: BOARD_WIDTH}, (_, i) => [BOARD_HEIGHT - 1, i]);
    // One corner is duplicated in these but not a big deal:
    const leftColAndTopRowLocations = leftColLocations.concat(topRowLocations);
    const leftColAndBottomRowLocations =
      leftColLocations.concat(bottomRowLocations);

    const horizontalWin = this._checkForWinFromLocationsInDirection(
      leftColLocations,
      [0, 1],
    );
    const verticalWin = this._checkForWinFromLocationsInDirection(
      topRowLocations,
      [1, 0],
    );
    const diagonalDownRightWin = this._checkForWinFromLocationsInDirection(
      leftColAndTopRowLocations,
      [1, 1],
    );
    const diagonalUpRightWin = this._checkForWinFromLocationsInDirection(
      leftColAndBottomRowLocations,
      [-1, 1],
    );

    return (
      horizontalWin || verticalWin ||
      diagonalDownRightWin || diagonalUpRightWin
    );
  }

  // Takes a list of locations and a direction (for example, the direction
  // [0, 1] means move right and [1, 1] means move down and to the right): for
  // every location in the list, it starts at this location, keeps moving in the
  // given direction, and checks if there's any "streak" of NUM_IN_A_ROW_TO_WIN
  // consecutive Xs/Os along this sequence of squares.
  //
  // For example, starting at the location [2, 0] and moving in the direction
  // [0, 1] will examine the third row of the board to see if any player has at
  // least NUM_IN_A_ROW_TO_WIN consecutive squares in this row.
  protected _checkForWinFromLocationsInDirection(
    startingLocations: [number, number][],
    direction: [number, number],
  ): Player | null {
    const isValidLocation = (row: number, col: number) => {
      return (
        0 <= row && row < BOARD_HEIGHT &&
        0 <= col && col < BOARD_WIDTH
      );
    }

    for (let [row, col] of startingLocations) {
      let streak: [Player, number] | null = null;
      while (isValidLocation(row, col)) {
        const entry = this.board[row][col];
        // Update streak
        if (entry === null) {
          streak = null;
        } else if (streak === null || streak[0] !== entry) {
          streak = [entry, 1];
        } else {
          streak[1]++;
        }

        // Check streak and move in direction:
        if (streak !== null && streak[1] >= NUM_IN_A_ROW_TO_WIN) {
          return streak[0];
        }
        row += direction[0];
        col += direction[1];
      }
    }
    return null;
  }

  protected _isBoardFull(): boolean {
    return this.board.every((row) => row.every(
      (entry) => entry !== null,
    ));
  }
}
