import {SEASON} from 'src/api/season/type.d';

export type SeasonState = {
  step: number;
  seasonBody: SEASON.Request.Season;
  crops: SEASON.Basic.Crops | undefined;
  materials: SEASON.Request.Material[];
  filterParams?: paramsFilterSeasonType;
};

export const filterParamsInit = undefined;

export type statusSeasonType = (keyof typeof statusSeason)[];

export const statusSeason = {
  UNCULTIVATED: 'UNCULTIVATED',
  CULTIVATED: 'CULTIVATED',
  HARVESTED: 'HARVESTED',
};

export type paramsFilterSeasonType = {
  sowingDateFrom?: string;
  sowingDateTo?: string;
  harvestDateFrom?: string;
  harvestDateTo?: string;
  status?: statusSeasonType;
  farmId?: number;
  sort?: string;
  sysAccountId?: number | null;
};

export const initialBodyState: SEASON.Request.Season = {
  farmId: null,
  name: '',
  sowingDate: '',
  harvestDate: '',
  // classifications: [],
  businessType: {
    id: null,
    name: null,
    masterDataTypeId: null,
  },
  productsOfFarm: {
    id: null,
    farmProductId: null,
    name: '',
    masterDataTypeId: null,
  },
  grossArea: {
    value: 0,
    unitId: null,
  },
  certifycateOfLandIds: [],
  grossYield: {
    value: 0,
    unitId: null,
  },
  materials: [],
  seasonStatus: 'UNCULTIVATED',
};
