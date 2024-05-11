/* eslint-disable eslint-comments/no-unlimited-disable */
// @ts-ignore
/* eslint-disable */

import {SEASON} from '../season/type.d';

export declare namespace DIARY {
  namespace Basic {
    // work type
    type WorkType = {
      name: string | null;
      description: string | null;
      media: string | null;
    };

    //UnitDataType
    type UnitDataType = {
      value: number | null;
      unitId: number | null;
      unitName: string | null;
    };
  }

  namespace Request {
    //body request create
    type Diary = {
      id?: number | null;
      farmingSeasonId: number | null;
      works: DIARY.Basic.WorkType[];
      createdDate: string | null; // null data
      expectedOutputToday: DIARY.Basic.UnitDataType;
    };
  }

  namespace Response {
    //get information
    type Diary = {
      id: number;
      seasonStatus?: SEASON.Basic.SeasonStatus;
      value: number | null;
      farmingSeasonId: number | null;
      productionType: string | null;
      farmingSeasonName: string | null;
      createdDate: string | null;
      sysAccountId: number | null;
      sysAccountName: string | null;
      farmName: string | null;
      fullAddress: string | null;
      works: DIARY.Basic.WorkType[];
      expectedOutputToday: DIARY.Basic.UnitDataType;
    };
  }
}
