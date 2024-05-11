import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {REDUCER_NAME} from 'src/state/constant';
import {DIARY} from 'src/api/diary/type.d';

type InitProps = {
  skippedVersion: string;
};
const initialState = {
  skippedVersion: '',
};

export const initialWork = {};

export const appInfo = createSlice({
  name: REDUCER_NAME.appInfor,
  initialState,
  reducers: {
    saveSkipVersion: (state: InitProps, actions: PayloadAction<string>) => {
      state.skippedVersion = actions.payload;
    },
    removeSkipVersion: (state: InitProps) => {
      state.skippedVersion = '';
    },
  },
});

// Action creators are generated for each case reducer function
export const {saveSkipVersion, removeSkipVersion} = appInfo.actions;

export default appInfo.reducer;
