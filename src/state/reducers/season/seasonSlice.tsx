import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {SEASON} from 'src/api/season/type.d';
import {REDUCER_NAME} from 'src/state/constant';
import {
  SeasonState,
  filterParamsInit,
  initialBodyState,
  paramsFilterSeasonType,
} from './const';

const initialState: SeasonState = {
  step: 0,
  seasonBody: initialBodyState,
  crops: undefined,
  materials: [],
  filterParams: filterParamsInit,
};

export const season = createSlice({
  name: REDUCER_NAME.seasonReducer,
  initialState,
  reducers: {
    pushValueSeasonCreate: (
      state,
      action: PayloadAction<{
        step: number;
        value: SEASON.Request.Season;
      }>,
    ) => {
      state.step = action.payload.step;
      state.seasonBody = action.payload.value;
    },
    createCrops: (state, action: PayloadAction<SEASON.Basic.Crops>) => {
      state.crops = action.payload;
    },
    clearCrops: state => {
      state.crops = undefined;
    },
    updateMaterials: (
      state,
      action: PayloadAction<SEASON.Request.Material[]>,
    ) => {
      state.materials = action.payload;
    },
    clearMaterials: state => {
      state.materials = [];
    },
    removeOneMaterial: (state, action: PayloadAction<number>) => {
      const newMaterial = state.materials.filter(
        (f, i) => i !== action.payload,
      );
      state.materials = newMaterial;
    },
    resetData: state => {
      state.step = 0;
      state.seasonBody = initialBodyState;
      state.crops = undefined;
      state.filterParams = undefined;
    },
    saveFilterSeason: (
      state,
      action: PayloadAction<paramsFilterSeasonType>,
    ) => {
      state.filterParams = action.payload;
    },
    ClearFilterSeason: state => {
      state.filterParams = filterParamsInit;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  resetData,
  pushValueSeasonCreate,
  removeOneMaterial,
  createCrops,
  clearCrops,
  updateMaterials,
  clearMaterials,
  saveFilterSeason,
  ClearFilterSeason,
} = season.actions;

export default season.reducer;
