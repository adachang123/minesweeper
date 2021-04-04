import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  map: {
    width: 9,
    height: 9,
    mines: [],
  },
  startTime: 0,
  finished: false,
  failed: false,
  remaining: 0,
};

export const appSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    reset: (state) => {
      return initialState;
    },
    setMap: (state, action) => {
      state.map = action.payload;
      state.remaining = action.payload.mines.length;
    },
    setStart: (state, action) => {
      state.startTime = action.payload;
    },
    setFinished: (state) => {
      state.finished = true;
      state.remaining = 0;
    },
    setFailed: (state) => {
      state.failed = true;
    },
    setRemaining: (state, action) => {
      state.remaining = action.payload;
    }
  },
});

export const { reset, setMap, setStart, setFinished, setFailed, setRemaining } = appSlice.actions;

export const getMap = state => state.app.map;
export const getFinished = state => state.app.finished;
export const getFailed = state => state.app.failed;
export const getStartTime = state => state.app.startTime;
export const getRemaining = state => state.app.remaining;

export default appSlice.reducer;