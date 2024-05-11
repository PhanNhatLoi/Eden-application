import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {STAFF} from 'src/api/staff/type.d';
import {REDUCER_NAME} from 'src/state/constant';

const initialState: STAFF.Request.ParamsFilter = {
  job: undefined,
  salaryFrom: undefined,
  salaryTo: undefined,
};

export const staff = createSlice({
  name: REDUCER_NAME.diary,
  initialState,
  reducers: {
    saveFilter: (
      state: STAFF.Request.ParamsFilter,
      actions: PayloadAction<STAFF.Request.ParamsFilter>,
    ) => {
      return (state = actions.payload);
    },
    clearFilterStaff: state => {
      return (state = initialState);
    },
  },
});

// Action creators are generated for each case reducer function
export const {clearFilterStaff, saveFilter} = staff.actions;

export default staff.reducer;
