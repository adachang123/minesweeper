import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import {
  getMap, getFinished, getFailed, getStartTime,
  setMap, setStart, setFinished, setFailed, setRemaining,
} from '../redux/appSlice';

import {
  getInitBoardByMap,
  getBoardByClick,
  judgeFinished,
  getRemaingCount,
  createMap,
  hasMineAt,
} from '../boardLogic';

import Block from './Block';

const BoardDiv = styled.div`
  margin: 12px;
  .row {
    display: flex;
  }
  .index {
    width: 20px;
  }
`;

const preventContextMenu = () => {
  window.addEventListener("contextmenu", e => {
    e.preventDefault();

    const cls = e.target ? e.target.className : '';
    const m = cls.match(/b-(\d+)-(\d+)/);
  
    if (m[1] && m[2]) {
      const event = new CustomEvent("RIGH_CLICK", { 
        detail: { x: parseInt(m[1]), y: parseInt(m[2]) }
      });
      document.dispatchEvent(event);
    }
  });
};

preventContextMenu();

const Board = () => {
  const [board, setBoard] = useState([]);
  const [resumeClick, setResumeClick] = useState(undefined);
  const map = useSelector(getMap);
  const finished = useSelector(getFinished);
  const failed = useSelector(getFailed);
  const startTime = useSelector(getStartTime);
  const dispatch = useDispatch();

  const onClick = (x, y) => {
    if (startTime === 0) {
      dispatch(setStart(Date.now()));
      if (board[x][y].isMine) {
        handleFirstClickOnMine(x, y);
        return;
      }
    }
    if (board[x][y].isMine) {
      dispatch(setFailed(true));
    }
    const newBoard = getBoardByClick(board, [x, y]);
    setBoard(newBoard);
    if (judgeFinished(newBoard)) {
      dispatch(setFinished(true));
    }
  };

  const onRightClick = useCallback((e) => {
    const { x, y } = e.detail;
    const newBoard = Object.assign([], board);

    newBoard[x][y].marked = !board[x][y].marked;
    setBoard(newBoard);

    const remain = getRemaingCount(newBoard);
    dispatch(setRemaining(remain));
  }, [board, dispatch]);

  const handleFirstClickOnMine = (x, y) => {
    let m = map;
    while(hasMineAt(m, x, y)) {
      m = createMap({ height: m.height, width: m.width, mineCount: m.mines.length });
    }
    setResumeClick([x, y]);
    dispatch(setMap(m));
  };

  useEffect(() => {
    let newBoard = getInitBoardByMap(map);
    if (resumeClick) {
      newBoard = getBoardByClick(newBoard, resumeClick);
      setResumeClick(undefined);
    }

    setBoard(newBoard);
  }, [map, resumeClick]);

  useEffect(() => {
    document.addEventListener("RIGH_CLICK", onRightClick);
    return () => {
      document.removeEventListener("RIGH_CLICK", onRightClick);
    };
  }, [board, onRightClick]);

  return (
    <BoardDiv>
      {board.map((row, x) => {
        return (
          <div className={`row ${x}`} key={`row-${x}`}>
          {/* <div className="index">{x}</div> */}
          {row.map((b, y) => {
            return (
              <Block
                className={`b-${x}-${y}`}
                key={`col-${y}`}
                adjCount={b.adj}
                opened={b.opened}
                failed={failed}
                finished={finished}
                isMine={b.isMine}
                marked={b.marked}
                onClick={() => onClick(x, y)}
              />);
          })}
          </div>
        );
      })}
    </BoardDiv>
  );
};

export default Board;
