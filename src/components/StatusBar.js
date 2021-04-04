import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux'
import styled from 'styled-components';

import { getFinished, getFailed, getStartTime, getRemaining } from '../redux/appSlice';

const BarDiv = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  margin: 4px 0;
`;

const Field = styled.div`
  .desc {
    font-size: 0.6em;
  }
`;

const StatusBar = () => {
  const [timeLapsed, setTimeLapsed] = useState(0);
  const [clock, setClock] = useState(undefined);
  const finished = useSelector(getFinished);
  const failed = useSelector(getFailed);
  const startTime = useSelector(getStartTime);
  const remaining = useSelector(getRemaining);

  const startClock = useCallback(() => {
    if (clock) {
      clearInterval(clock);
    }
    const newClock = setInterval(() => {
      const diff = Math.floor((Date.now() - startTime)/1000);
      setTimeLapsed(diff);
    }, 1000);

    setClock(newClock);
  }, [startTime, clock]);

  const stopClock = useCallback(() => {
    if (clock) {
      clearInterval(clock);
    }
  }, [clock]);

  useEffect(() => {

    if (finished || failed) {
      stopClock();
    } else if (startTime !== 0) {
      startClock();
    } else { // when start new game
      stopClock();
      setTimeLapsed(0);
    }
  }, [finished, failed, startTime]);

  let statusText = 'Not started';
  if (finished) {
    statusText = 'Finished';
  } else if (failed) {
    statusText = 'Failed';
  } else if (startTime !== 0) {
    statusText = 'Started';
  }

  return (
    <BarDiv>
      <Field className="remain-count">
        <div className="desc">Remaining</div>
        <div>{remaining}</div>
      </Field>
      <Field className="game-state">
        <div className="desc">Status</div>
        <div>{statusText}</div>
      </Field>
      <Field className="time-lapsed">
        <div className="desc">Time Lapsed</div>
        <div>{timeLapsed}</div>
      </Field>
    </BarDiv>
  );
};

export default StatusBar;
