import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {FARM} from 'src/api/farm/type.d';
import {REDUCER_NAME} from 'src/state/constant';

export const initFarmBody: FARM.Request.Farm = {
  id: null,
  status: 'ACTIVATED',
  phone: '',
  grossProductivity: {
    interval: 'YEAR',
    unitId: null,
    value: 0,
  },
  avatar: '',
  address: {
    address1: '',
    countryId: null,
    districtId: null,
    wardsId: null,
    provinceId: null,
    lat: null,
    lng: null,
  },
  businessTypesIds: [],
  farmingSeasonNumber: 0,
  grossArea: {
    value: 0,
    unitId: null,
  },
  products: [],
  grossYield: {
    value: 0,
    interval: 'YEAR',
    unitId: null,
  },
  marketsIds: [],
  consumptionMarket: [],
  name: '',
  productionTypesIds: [],
  certifications: [],
  certifycateOfLands: [],
};
interface FarmState {
  farmBody: FARM.Request.Farm;
  certifications: FARM.Request.Cetification[];
  certifycateOfLands: FARM.Request.LandCetification[];
  step: number;
  dirty: boolean;
  certificationOfLandDelete: number[];
}
interface SaveFarmActionPayload {
  farmBody: FARM.Request.Farm;
  step: number;
}
const initialState: FarmState = {
  farmBody: initFarmBody,
  certifications: [],
  certifycateOfLands: [],
  step: 0,
  dirty: false,
  certificationOfLandDelete: [],
};
export const farmSlice = createSlice({
  name: REDUCER_NAME.farm,
  initialState,
  reducers: {
    saveFarmFlow: (state, action: PayloadAction<SaveFarmActionPayload>) => {
      state.farmBody = action.payload.farmBody;
      state.step = action.payload.step;
      state.dirty = true;
    },
    clearFarmFlow: state => {
      state.farmBody = initialState.farmBody;
      state.certifications = initialState.certifications;
      state.certifycateOfLands = initialState.certifycateOfLands;
      state.step = 0;
      state.dirty = false;
    },
    saveCertification: (
      state,
      action: PayloadAction<FARM.Request.Cetification[]>,
    ) => {
      state.certifications = action.payload;
    },
    addCertification: (
      state,
      action: PayloadAction<{body: FARM.Request.Cetification}>,
    ) => {
      state.certifications = [...state.certifications, action.payload.body];
    },
    deleteCertification: (state, action: PayloadAction<number>) => {
      state.certifications = state.certifications.filter(
        (f, i) => i !== action.payload,
      );
    },
    updateCertification: (
      state,
      action: PayloadAction<{body: FARM.Request.Cetification; index: number}>,
    ) => {
      if (state.certifications.length >= action.payload.index)
        state.certifications[action.payload.index] = action.payload.body;
    },
    saveLandCertification: (
      state,
      action: PayloadAction<FARM.Request.LandCetification[]>,
    ) => {
      state.certifycateOfLands = action.payload;
    },
    addLandCertification: (
      state,
      action: PayloadAction<{body: FARM.Request.LandCetification}>,
    ) => {
      state.certifycateOfLands = [
        ...state.certifycateOfLands,
        action.payload.body,
      ];
    },
    deleteLandCertification: (
      state,
      action: PayloadAction<{index: number; id?: number}>,
    ) => {
      state.certifycateOfLands = state.certifycateOfLands.filter(
        (f, i) => i !== action.payload.index,
      );
      if (action.payload.id) {
        state.certificationOfLandDelete = [
          ...state.certificationOfLandDelete,
          action.payload.id,
        ];
      }
    },

    clearDeleteCertificationLand: state => {
      state.certificationOfLandDelete = [];
    },
    updateLandCertification: (
      state,
      action: PayloadAction<{
        body: FARM.Request.LandCetification;
        index: number;
      }>,
    ) => {
      if (state.certifycateOfLands.length >= action.payload.index)
        state.certifycateOfLands[action.payload.index] = action.payload.body;
    },
  },
});
// Action creators are generated for each case reducer function
export const {
  saveFarmFlow,
  clearFarmFlow,
  clearDeleteCertificationLand,
  addCertification,
  deleteCertification,
  updateCertification,
  saveCertification,
  addLandCertification,
  deleteLandCertification,
  updateLandCertification,
  saveLandCertification,
} = farmSlice.actions;

export default farmSlice.reducer;
