export const getAdjPositions = ({ x, y, height, width }) => {
  const adj = [
    [x-1, y-1], [x-1, y], [x-1, y+1],
    [x, y-1], [x, y+1],
    [x+1, y-1], [x+1, y], [x+1, y+1],
  ];

  return adj.filter(([X, Y]) => (X >= 0 && X < height && Y >= 0 && Y < width));
};

export const getInitBoardByMap = (map) => {
  const board = Array(map.height).fill([]);
  for (let i = 0; i < map.height; i++) {
    board[i] = Array(map.width);
    for (let j = 0; j < map.width; j++) {
      board[i][j] = { adj: 0, opened: false, isMine: false };
    }
  }

  map.mines.forEach(m => {
    const x = m[0], y = m[1];
    const adjBlocks = getAdjPositions({ x, y, height: map.height, width: map.width });
    
    board[x][y].isMine = true;
    adjBlocks.forEach(pos => {
      const x = pos[0], y = pos[1];
      board[x][y].adj++;
    });
  });

  return board;
};

export const getBoardByClick = (board, clickPos) => {
  const height = board.length;
  const width = board[0].length;
  const x = clickPos[0], y = clickPos[1];
  let newBoard = Object.assign([], board);

  newBoard[x][y].opened = true;
  
  if (board[x][y].adj === 0) {
    const adjPos = getAdjPositions({ x, y, height, width });
    adjPos.filter(([X, Y]) => !board[X][Y].opened).forEach(pos => {
      newBoard = getBoardByClick(newBoard, pos);
    });
  }

  return newBoard;
};

export const judgeFinished = (board) => {
  const blocks = board.reduce((acc, val) => acc.concat(val), []);
  const unfinished = blocks.filter(b => !b.opened && !b.isMine);

  return (unfinished.length === 0);
};

export const getRemaingCount = (board) => {
  const blocks = board.reduce((acc, val) => acc.concat(val), []);
  const mines = blocks.filter(b => b.isMine);
  const marked = blocks.filter(b => b.marked);

  return mines.length - marked.length;
}

export const createMap = ({ height, width, mineCount }) => {
  const getRandom = (max) => Math.floor(Math.random() * max);
  const map = {
    height,
    width,
    mines: [],
  };

  while(map.mines.length < mineCount) {
    const x = getRandom(height);
    const y = getRandom(width);

    if (!hasMineAt(map, x, y)) {
      map.mines.push([x,y]);
    }
  }

  return map;
};

export const hasMineAt = (map, x, y) => {
  const conflict = map.mines.filter(([X,Y]) => x === X && y === Y);
  return (conflict.length === 0) ? false : true;
}