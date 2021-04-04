import { render, screen } from '@testing-library/react';
import * as func from './boardLogic';

test('test getAdjPositions', () => {
  // [0, 0] [0, 1] [0, 2]
  // [1, 0] [1, 1] [1, 2]
  // [2, 0] [2, 1] [2, 2]

  const adjTopLeft = func.getAdjPositions({ x: 0, y: 0, height: 3, width: 3 });
  expect(adjTopLeft).toStrictEqual([[0, 1], [1, 0], [1, 1]]);

  const adjTopRight = func.getAdjPositions({ x: 0, y: 2, height: 3, width: 3 });
  expect(adjTopRight).toStrictEqual([[0, 1], [1, 1], [1, 2]]);

  const adjBottomLeft = func.getAdjPositions({ x: 2, y: 0, height: 3, width: 3 });
  expect(adjBottomLeft).toStrictEqual([[1, 0], [1, 1], [2, 1]]);

  const adjBottomRight = func.getAdjPositions({ x: 2, y: 2, height: 3, width: 3 });
  expect(adjBottomRight).toStrictEqual([[1, 1], [1, 2], [2, 1]]);
});

test('test createMap', () => {
  const width = 9, height = 9, mineCount = 10;
  const map = func.createMap({ height, width, mineCount });

  expect(map.width).toBe(width);
  expect(map.height).toBe(height);
  expect(map.mines.length).toBe(mineCount);
  map.mines.forEach(pos => {
    expect(pos[0]).toBeLessThan(height);
    expect(pos[1]).toBeLessThan(width);
  });
});

test('test hasMineAt', () => {
  const map = {
    height: 3,
    width: 3,
    mines: [[0,0], [1,1]],
  };

  expect(func.hasMineAt(map, 0, 0)).toBe(true);
  expect(func.hasMineAt(map, 0, 1)).toBe(false);
});

test('test getInitBoardByMap', () => {
  //    * 3 * 1 0
  //    2 * 2 1 0
  //    1 1 1 0 0
  //    0 0 0 0 0
  const map = {
    height: 4,
    width: 5,
    mines: [[0,0], [1,1], [0,2]],
  }; 

  const board = func.getInitBoardByMap(map);
  expect(board.length).toBe(4);
  expect(board[0].length).toBe(5);
  expect(board[0][0].isMine).toBe(true);
  expect(board[0][1].isMine).toBe(false);
  expect(board[0][1].adj).toBe(3);
  expect(board[1][0].adj).toBe(2);
  expect(board[2][2].adj).toBe(1);
  expect(board[2][3].adj).toBe(0);
  expect(board[3][0].adj).toBe(0);
});

test('test getBoardByClick', () => {
  //    * 3 * 1 0
  //    2 * 2 1 0
  //    1 1 1 0 0
  //    0 0 0 0 0
  const map = {
    height: 4,
    width: 5,
    mines: [[0,0], [1,1], [0,2]],
  };

  let board = func.getInitBoardByMap(map);
  board = func.getBoardByClick(board, [2,3]);
  expect(board[3][3].opened).toBe(true);
  expect(board[3][4].opened).toBe(true);
  expect(board[1][3].opened).toBe(true);
  expect(board[1][2].opened).toBe(true);
  expect(board[0][1].opened).toBe(false);
  expect(board[1][0].opened).toBe(false);
});

test('test getRemaingCount', () => {
  const map = {
    height: 3,
    width: 3,
    mines: [[0,0], [1,1]],
  };

  const testWithMarked = (map, marked, expectRes) => {
    const board = func.getInitBoardByMap(map);
    marked.forEach(([x,y]) => board[x][y].marked = true);
    expect(func.getRemaingCount(board)).toBe(expectRes);
  }

  testWithMarked(map, [], 2);
  testWithMarked(map, [[1,0]], 1);
  testWithMarked(map, [[0,0], [0,1], [1,1]], -1);
});

test('test judgeFinished', () => {
  //    * 2 1
  //    2 * 2
  //    1 2 *
  const map = {
    height: 3,
    width: 3,
    mines: [[0,0], [1,1], [2,2]],
  };

  const testWithOpened = (map, opened, expectRes) => {
    const board = func.getInitBoardByMap(map);
    opened.forEach(([x,y]) => board[x][y].opened = true);
    expect(func.judgeFinished(board)).toBe(expectRes);
  }

  testWithOpened(map, [[0,1], [0,2], [1,0], [1,2]], false);
  testWithOpened(map, [[0,1], [0,2], [1,0], [1,2], [2,0], [2,1]], true);
});