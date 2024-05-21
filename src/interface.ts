import { BOARD_HEIGHT, BOARD_WIDTH } from './config';
import { GameState, Player } from './game-state';


/* Returns a display string that looks like this, based on the given state:
   1   2   3
A  O |   |
  -----------
B    | X |
  -----------
C    |   |   
*/
export function getBoardRendering(state: GameState): string {
  if (BOARD_HEIGHT > 26) {
    // Currently only supports labels A-Z:
    throw new Error('Unsupported BOARD_WIDTH');
  }
  if (BOARD_WIDTH > 9) {
    // Currently only formats column widths for 1-9:
    throw new Error('Unsupported BOARD_HEIGHT');
  }

  const LEFT_LABEL_MARGIN_RIGHT = 1;
  const SQUARE_MARGIN_LEFT_RIGHT = 1;
  // May be dynamic in the future, based on board size:
  const rowLabelWidth = 1;
  const columnLabelWidth = 1;

  const padColumnEntry = (entry: string) => {
    const totalPadding = columnLabelWidth - entry.length;
    const leftPadding = Math.floor(totalPadding / 2);
    const rightPadding = totalPadding - leftPadding;
    return (
      ' '.repeat(leftPadding) +
      entry +
      ' '.repeat(rightPadding)
    );
  }
  const getPaddedSquareRendering = (value: Player | null) => {
    let squareRendering: string;
    switch (value) {
      case null: squareRendering = ' '; break;
      case Player.X: squareRendering = 'X'; break;
      case Player.O: squareRendering = 'O'; break;
    }
    return padColumnEntry(squareRendering);
  };
  const getPaddedColumnLabel = (column: number) => {
    const label = String.fromCharCode('A'.charCodeAt(0) + column);
    return padColumnEntry(label);
  };
  const getPaddedRowLabel = (row: number) => {
    const label = (row + 1).toString();
    return (
      ' '.repeat(rowLabelWidth - label.length) +
      label
    );
  };
  // Render the first row of text in the board, displaying column labels in the
  // appropriate positions:
  const getColumnLabelsRowRendering = () => {
    let rowString = '';
    rowString +=
      ' '.repeat(rowLabelWidth) +
      ' '.repeat(LEFT_LABEL_MARGIN_RIGHT);
    for (let column = 0; column < BOARD_WIDTH; column += 1) {
      rowString +=
        ' '.repeat(SQUARE_MARGIN_LEFT_RIGHT) +
        getPaddedColumnLabel(column) +
        ' '.repeat(SQUARE_MARGIN_LEFT_RIGHT);
      if (column !== BOARD_WIDTH - 1) {
        // Space for the vertical divider:
        rowString += ' ';
      }
    }
    rowString += '\n';
    return rowString;
  };
  // Render the text for a given row of the board, with the row label, vertical
  // dividers, and square entries in the appropriate positions:
  const getBoardRowRendering = (row: number) => {
    let rowString = '';
    rowString +=
      getPaddedRowLabel(row) + 
      ' '.repeat(LEFT_LABEL_MARGIN_RIGHT);
    for (let column = 0; column < BOARD_WIDTH; column += 1) {
      rowString +=
        ' '.repeat(SQUARE_MARGIN_LEFT_RIGHT) +
        getPaddedSquareRendering(state.getValueAtSquare(row, column)) +
        ' '.repeat(SQUARE_MARGIN_LEFT_RIGHT);
      if (column !== BOARD_WIDTH - 1) {
        rowString += '|';
      }
    }
    rowString += '\n';
    return rowString;
  };
  // Render a horizontal divider row:
  const getDividerRowRendering = () => {
    let rowString = '';
    rowString +=
      ' '.repeat(rowLabelWidth) +
      ' '.repeat(LEFT_LABEL_MARGIN_RIGHT);
    for (let column = 0; column < BOARD_WIDTH; column += 1) {
      rowString +=
        '-'.repeat(SQUARE_MARGIN_LEFT_RIGHT) +
        '-'.repeat(columnLabelWidth) +
        '-'.repeat(SQUARE_MARGIN_LEFT_RIGHT);
      if (column !== BOARD_WIDTH - 1) {
        // Space for the vertical divider:
        rowString += '-';
      }
    }
    rowString += '\n';
    return rowString;
  };

  ////////////////////////////// Main method code //////////////////////////////

  let boardString: string = '';
  boardString += getColumnLabelsRowRendering();
  for (let row = 0; row < BOARD_HEIGHT; row += 1) {
    boardString += getBoardRowRendering(row);
    if (row !== BOARD_HEIGHT - 1) {
      boardString += getDividerRowRendering();
    }
  }
  return boardString;
}
