import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {REDUCER_NAME} from 'src/state/constant';
import {DIARY} from 'src/api/diary/type.d';

const initialState: DIARY.Request.Diary = {
  works: [],
  createdDate: null,
  farmingSeasonId: null,
  expectedOutputToday: {
    value: null,
    unitId: null,
    unitName: '',
  },
};

export const initialWork: DIARY.Basic.WorkType = {
  name: '',
  description: '',
  media: '',
};

export const diary = createSlice({
  name: REDUCER_NAME.diary,
  initialState,
  reducers: {
    initDataDiary: (
      state: DIARY.Request.Diary,
      actions: PayloadAction<DIARY.Request.Diary>,
    ) => {
      return (state = actions.payload);
    },
    pushWorks: (
      state: DIARY.Request.Diary,
      actions: PayloadAction<DIARY.Basic.WorkType>,
    ) => {
      state.works = [...state.works, actions.payload];
    },

    UpdateWorks: (
      state: DIARY.Request.Diary,
      actions: PayloadAction<{work: DIARY.Basic.WorkType; index: number}>,
    ) => {
      state.works[actions.payload.index] = actions.payload.work;
    },
    removeWorks: (
      state: DIARY.Request.Diary,
      actions: PayloadAction<number>,
    ) => {
      state.works = state.works.filter((f, i) => i !== actions.payload);
    },
    clearDataDiary: (state: DIARY.Request.Diary) => {
      return (state = initialState);
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  pushWorks,
  removeWorks,
  clearDataDiary,
  initDataDiary,
  UpdateWorks,
} = diary.actions;

export default diary.reducer;
