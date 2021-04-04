import { useEffect } from 'react';
import { useDispatch } from 'react-redux'
import styled from 'styled-components';

import Board from './Board';
import StatusBar from './StatusBar';
import { createMap } from '../boardLogic';
import { reset, setMap} from '../redux/appSlice'

const AppDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: fit-content;
  font-size: 24px;
  text-align: center;
  margin: 20px auto;
  .new-game-btn {
    margin-bottom: 12px;
  }
`;

function App() {
  const renewMap = () => {
    const newMap = createMap({ height: 9, width: 12, mineCount: 10 });
    dispatch(reset());
    dispatch(setMap(newMap));
  };
  const dispatch = useDispatch();
  useEffect(renewMap)

  return (
    <AppDiv>
      <div className="top-bar">
        <div className="app-title">Minesweeper game</div>
        <button className="new-game-btn" onClick={renewMap}>New Game</button>
      </div>
      <StatusBar />
      <Board />
    </AppDiv>
  );
}

export default App;
