import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {REDUCER_NAME} from 'src/state/constant';

export type initialNotifyType = {
  notification?: {
    title?: string;
    type?: 'YES_NO' | 'ALERT';
    body?: string;
    onpress?: () => void;
  };
  internet: boolean;
};

const initialState: initialNotifyType = {
  notification: undefined,
  internet: true,
};

export const notify = createSlice({
  name: REDUCER_NAME.notifyReducer,
  initialState,
  reducers: {
    pushNotify: (
      state,
      action: PayloadAction<{
        title: string;
        message: string;
        type?: 'YES_NO' | 'ALERT';
        onpress?: () => void;
      }>,
    ) => {
      state.notification = {
        title: action.payload.title,
        body: action.payload.message,
        type: action.payload.type || 'ALERT',
        onpress: action.payload.onpress,
      };
    },
    removeNotify: state => {
      state.notification = undefined;
    },
    updateStatusInternet: (state, action: PayloadAction<boolean>) => {
      state.internet = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {pushNotify, removeNotify, updateStatusInternet} = notify.actions;

export default notify.reducer;
