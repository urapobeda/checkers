export type Player = "light" | "dark";

export type Piece = {
  player: Player;
  king: boolean;
};

export type Position = {
  row: number;
  col: number;
};

export type Board = Array<Array<Piece | null>>;

export type Move = {
  from: Position;
  to: Position;
  path: Position[];
  captures: Position[];
  notation: string;
};

export type BotLevel = "beginner" | "club" | "elite";

const BOARD_SIZE = 8;
const DIAGONALS = [
  { row: -1, col: -1 },
  { row: -1, col: 1 },
  { row: 1, col: -1 },
  { row: 1, col: 1 },
];

export function createInitialBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, (_, row) =>
    Array.from({ length: BOARD_SIZE }, (_, col) => {
      if (!isPlayable(row, col)) {
        return null;
      }

      if (row < 3) {
        return { player: "dark", king: false };
      }

      if (row > 4) {
        return { player: "light", king: false };
      }

      return null;
    }),
  );
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => row.map((piece) => (piece ? { ...piece } : null)));
}

export function otherPlayer(player: Player): Player {
  return player === "light" ? "dark" : "light";
}

export function isPlayable(row: number, col: number): boolean {
  return (row + col) % 2 === 1;
}

export function getLegalMoves(board: Board, player: Player): Move[] {
  const captures = board.flatMap((row, rowIndex) =>
    row.flatMap((piece, colIndex) => (piece?.player === player ? getCaptureMovesForPiece(board, { row: rowIndex, col: colIndex }) : [])),
  );

  if (captures.length > 0) {
    return captures.sort(compareMoves);
  }

  return board
    .flatMap((row, rowIndex) =>
      row.flatMap((piece, colIndex) => (piece?.player === player ? getQuietMovesForPiece(board, { row: rowIndex, col: colIndex }) : [])),
    )
    .sort(compareMoves);
}

export function applyMove(board: Board, move: Move): Board {
  const nextBoard = cloneBoard(board);
  const piece = nextBoard[move.from.row][move.from.col];

  if (!piece) {
    return nextBoard;
  }

  nextBoard[move.from.row][move.from.col] = null;
  for (const capture of move.captures) {
    nextBoard[capture.row][capture.col] = null;
  }

  const promoted = piece.king || shouldPromote(piece.player, move.to.row);
  nextBoard[move.to.row][move.to.col] = { ...piece, king: promoted };

  return nextBoard;
}

export function getWinner(board: Board, currentPlayer: Player): Player | null {
  const currentPieces = countPieces(board, currentPlayer);
  const opponent = otherPlayer(currentPlayer);
  const opponentPieces = countPieces(board, opponent);

  if (currentPieces === 0) {
    return opponent;
  }

  if (opponentPieces === 0) {
    return currentPlayer;
  }

  if (getLegalMoves(board, currentPlayer).length === 0) {
    return opponent;
  }

  return null;
}

export function chooseBotMove(board: Board, player: Player, level: BotLevel): Move | null {
  const legalMoves = getLegalMoves(board, player);

  if (legalMoves.length === 0) {
    return null;
  }

  if (level === "beginner") {
    return legalMoves[Math.floor(Math.random() * legalMoves.length)];
  }

  if (level === "club") {
    return pickBestImmediateMove(board, player, legalMoves);
  }

  let bestMove = legalMoves[0];
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const move of legalMoves) {
    const score = minimax(applyMove(board, move), otherPlayer(player), player, 3, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

export function squareName(position: Position): string {
  return `${String.fromCharCode(97 + position.col)}${BOARD_SIZE - position.row}`;
}

export function positionsEqual(a: Position, b: Position): boolean {
  return a.row === b.row && a.col === b.col;
}

function getQuietMovesForPiece(board: Board, from: Position): Move[] {
  const piece = board[from.row][from.col];
  if (!piece) {
    return [];
  }

  if (piece.king) {
    return DIAGONALS.flatMap((direction) => {
      const moves: Move[] = [];
      let row = from.row + direction.row;
      let col = from.col + direction.col;

      while (isInside(row, col) && !board[row][col]) {
        moves.push(makeMove(from, { row, col }, [{ ...from }, { row, col }], []));
        row += direction.row;
        col += direction.col;
      }

      return moves;
    });
  }

  const forward = piece.player === "light" ? -1 : 1;
  return [
    { row: forward, col: -1 },
    { row: forward, col: 1 },
  ].flatMap((direction) => {
    const to = { row: from.row + direction.row, col: from.col + direction.col };
    if (!isInside(to.row, to.col) || board[to.row][to.col]) {
      return [];
    }

    return [makeMove(from, to, [{ ...from }, to], [])];
  });
}

function getCaptureMovesForPiece(board: Board, from: Position): Move[] {
  const piece = board[from.row][from.col];
  if (!piece) {
    return [];
  }

  return collectCaptures(board, from, piece, [{ ...from }], []);
}

function collectCaptures(board: Board, from: Position, piece: Piece, path: Position[], captures: Position[]): Move[] {
  const branches = piece.king ? getKingCaptureBranches(board, from, piece) : getManCaptureBranches(board, from, piece);

  if (branches.length === 0) {
    if (captures.length === 0) {
      return [];
    }

    return [makeMove(path[0], from, path, captures)];
  }

  return branches.flatMap((branch) => {
    const nextBoard = cloneBoard(board);
    nextBoard[from.row][from.col] = null;
    nextBoard[branch.capture.row][branch.capture.col] = null;

    const nextPiece = {
      ...piece,
      king: piece.king || shouldPromote(piece.player, branch.to.row),
    };

    nextBoard[branch.to.row][branch.to.col] = nextPiece;

    return collectCaptures(nextBoard, branch.to, nextPiece, [...path, branch.to], [...captures, branch.capture]);
  });
}

function getManCaptureBranches(board: Board, from: Position, piece: Piece): Array<{ to: Position; capture: Position }> {
  return DIAGONALS.flatMap((direction) => {
    const capture = { row: from.row + direction.row, col: from.col + direction.col };
    const to = { row: from.row + direction.row * 2, col: from.col + direction.col * 2 };

    if (!isInside(to.row, to.col) || !isInside(capture.row, capture.col)) {
      return [];
    }

    const capturedPiece = board[capture.row][capture.col];
    if (!capturedPiece || capturedPiece.player === piece.player || board[to.row][to.col]) {
      return [];
    }

    return [{ to, capture }];
  });
}

function getKingCaptureBranches(board: Board, from: Position, piece: Piece): Array<{ to: Position; capture: Position }> {
  const branches: Array<{ to: Position; capture: Position }> = [];

  for (const direction of DIAGONALS) {
    let row = from.row + direction.row;
    let col = from.col + direction.col;
    let capture: Position | null = null;

    while (isInside(row, col)) {
      const scannedPiece = board[row][col];

      if (scannedPiece) {
        if (scannedPiece.player === piece.player || capture) {
          break;
        }

        capture = { row, col };
      } else if (capture) {
        branches.push({ to: { row, col }, capture });
      }

      row += direction.row;
      col += direction.col;
    }
  }

  return branches;
}

function makeMove(from: Position, to: Position, path: Position[], captures: Position[]): Move {
  const separator = captures.length > 0 ? "x" : "-";
  const notation = path.map(squareName).join(separator);
  return {
    from,
    to,
    path,
    captures,
    notation,
  };
}

function pickBestImmediateMove(board: Board, player: Player, legalMoves: Move[]): Move {
  return [...legalMoves].sort((a, b) => scoreImmediateMove(board, player, b) - scoreImmediateMove(board, player, a))[0];
}

function scoreImmediateMove(board: Board, player: Player, move: Move): number {
  const nextBoard = applyMove(board, move);
  const piece = nextBoard[move.to.row][move.to.col];
  const opponentReplies = getLegalMoves(nextBoard, otherPlayer(player));
  const moveCaptures = move.captures.length * 120;
  const promotion = piece?.king ? 75 : 0;
  const safetyPenalty = opponentReplies.some((reply) => reply.captures.some((capture) => positionsEqual(capture, move.to))) ? 80 : 0;

  return evaluateBoard(nextBoard, player) + moveCaptures + promotion - safetyPenalty;
}

function minimax(board: Board, turn: Player, perspective: Player, depth: number, alpha: number, beta: number): number {
  const winner = getWinner(board, turn);
  if (winner) {
    return winner === perspective ? 10000 + depth : -10000 - depth;
  }

  if (depth === 0) {
    return evaluateBoard(board, perspective);
  }

  const moves = getLegalMoves(board, turn);

  if (turn === perspective) {
    let value = Number.NEGATIVE_INFINITY;
    for (const move of moves) {
      value = Math.max(value, minimax(applyMove(board, move), otherPlayer(turn), perspective, depth - 1, alpha, beta));
      alpha = Math.max(alpha, value);
      if (beta <= alpha) {
        break;
      }
    }
    return value;
  }

  let value = Number.POSITIVE_INFINITY;
  for (const move of moves) {
    value = Math.min(value, minimax(applyMove(board, move), otherPlayer(turn), perspective, depth - 1, alpha, beta));
    beta = Math.min(beta, value);
    if (beta <= alpha) {
      break;
    }
  }
  return value;
}

function evaluateBoard(board: Board, perspective: Player): number {
  let score = 0;

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const piece = board[row][col];
      if (!piece) {
        continue;
      }

      const direction = piece.player === "light" ? 1 : -1;
      const advancement = piece.king ? 0 : direction * (row - 3.5) * 8;
      const center = 10 - Math.abs(3.5 - row) * 2 - Math.abs(3.5 - col) * 2;
      const value = (piece.king ? 250 : 100) + advancement + center;
      score += piece.player === perspective ? value : -value;
    }
  }

  return score;
}

function countPieces(board: Board, player: Player): number {
  return board.flat().filter((piece) => piece?.player === player).length;
}

function shouldPromote(player: Player, row: number): boolean {
  return (player === "light" && row === 0) || (player === "dark" && row === BOARD_SIZE - 1);
}

function isInside(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

function compareMoves(a: Move, b: Move): number {
  if (b.captures.length !== a.captures.length) {
    return b.captures.length - a.captures.length;
  }

  return a.notation.localeCompare(b.notation);
}
