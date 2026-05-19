const boardElement = document.querySelector("#board");
const turnLabel = document.querySelector("#turn-label");
const moveLog = document.querySelector("#move-log");
const resetButton = document.querySelector("#reset-game");
const xpCounter = document.querySelector("#xp-counter");
const coachTitle = document.querySelector("#coach-title");
const coachText = document.querySelector("#coach-text");

const BOARD_SIZE = 8;
let board = [];
let selected = null;
let turn = "light";
let moveNumber = 1;
let xp = 0;

const coachTips = [
  {
    title: "Сначала проверьте взятия",
    text: "Даже в демо-версии полезно привыкать смотреть диагонали перед тихим ходом.",
  },
  {
    title: "Держите центр",
    text: "Шашки в центре контролируют больше диагоналей и быстрее создают угрозы.",
  },
  {
    title: "Не отдавайте темп",
    text: "Если ход не улучшает позицию, соперник может первым занять сильную диагональ.",
  },
];

function createInitialBoard() {
  return Array.from({ length: BOARD_SIZE }, (_, row) =>
    Array.from({ length: BOARD_SIZE }, (_, col) => {
      const playable = (row + col) % 2 === 1;
      if (!playable) {
        return null;
      }

      if (row < 3) {
        return { player: "dark" };
      }

      if (row > 4) {
        return { player: "light" };
      }

      return null;
    }),
  );
}

function renderBoard() {
  boardElement.innerHTML = "";
  const legalTargets = selected ? getLegalTargets(selected.row, selected.col) : [];

  board.forEach((rowItems, row) => {
    rowItems.forEach((piece, col) => {
      const square = document.createElement("button");
      const playable = (row + col) % 2 === 1;
      const isSelected = selected?.row === row && selected?.col === col;
      const isTarget = legalTargets.some((target) => target.row === row && target.col === col);

      square.type = "button";
      square.className = [
        "square",
        playable ? "dark" : "light",
        isSelected ? "selected" : "",
        isTarget ? "target" : "",
      ]
        .filter(Boolean)
        .join(" ");
      square.setAttribute("aria-label", `row ${row + 1}, column ${col + 1}`);
      square.addEventListener("click", () => handleSquareClick(row, col));

      if (piece) {
        const pieceElement = document.createElement("span");
        pieceElement.className = `piece ${piece.player}-piece`;
        square.append(pieceElement);
      }

      boardElement.append(square);
    });
  });
}

function handleSquareClick(row, col) {
  const piece = board[row][col];

  if (selected) {
    const target = getLegalTargets(selected.row, selected.col).find(
      (item) => item.row === row && item.col === col,
    );

    if (target) {
      movePiece(selected, target);
      return;
    }
  }

  if (piece?.player === turn) {
    selected = { row, col };
  } else {
    selected = null;
  }

  renderBoard();
}

function getLegalTargets(row, col) {
  const piece = board[row][col];
  if (!piece) {
    return [];
  }

  const direction = piece.player === "light" ? -1 : 1;
  const candidates = [
    { row: row + direction, col: col - 1 },
    { row: row + direction, col: col + 1 },
  ];

  return candidates.filter((target) => {
    const inside = target.row >= 0 && target.row < BOARD_SIZE && target.col >= 0 && target.col < BOARD_SIZE;
    return inside && !board[target.row][target.col];
  });
}

function movePiece(from, to) {
  const piece = board[from.row][from.col];
  board[to.row][to.col] = piece;
  board[from.row][from.col] = null;

  const notation = `${formatSquare(from)}-${formatSquare(to)}`;
  addMove(notation, piece.player);

  selected = null;
  turn = turn === "light" ? "dark" : "light";
  xp += 2;
  updateStatus();
  renderBoard();
}

function formatSquare(position) {
  const file = String.fromCharCode(97 + position.col);
  return `${file}${BOARD_SIZE - position.row}`;
}

function addMove(notation, player) {
  const item = document.createElement("li");
  item.textContent = `${moveNumber}. ${player === "light" ? "Светлые" : "Темные"}: ${notation}`;
  moveLog.prepend(item);
  moveNumber += 1;

  const tip = coachTips[(moveNumber - 2) % coachTips.length];
  coachTitle.textContent = tip.title;
  coachText.textContent = tip.text;
}

function updateStatus() {
  turnLabel.textContent = `Ход: ${turn === "light" ? "светлые" : "темные"}`;
  xpCounter.textContent = String(xp);
}

function resetGame() {
  board = createInitialBoard();
  selected = null;
  turn = "light";
  moveNumber = 1;
  xp = 0;
  moveLog.innerHTML = "";
  coachTitle.textContent = "Начните с центра";
  coachText.textContent = "Контроль центральных диагоналей помогает создавать будущие взятия.";
  updateStatus();
  renderBoard();
}

resetButton.addEventListener("click", resetGame);
resetGame();
