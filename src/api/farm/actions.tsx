import FETCH from '../fetch';
import {FARM} from './type.d';

export const getFarmList = (params?: FARM.Response.ParamsFilterList) =>
  FETCH('sys', '/farm/all', 'GET', {}, undefined, false, {
    ...params,
    sort: 'lastModifiedDate,desc',
  });

export const getFarmLocationNear = (params: {}) =>
  FETCH('sys', '/profile-all', 'GET', {}, undefined, false, params);

export const getFarmDetails = (
  id: string | number,
  sysAccountId: number | null,
) => FETCH('sys', `/farms/${id}?sysAccountId=${sysAccountId}`, 'GET', {});

export const createAndUpdateFarm = (body: FARM.Request.Farm) =>
  FETCH('sys', `/farms`, body.id ? 'PUT' : 'POST', {}, body);

export const deleteFarm = (id: number) =>
  FETCH('sys', `/farms/and-childs`, 'DELETE', {}, {id: id});

export const deleteCertificationLand = (params: {
  farmId: number;
  certificationId: number;
}) =>
  FETCH('sys', `/remove/certification`, 'DELETE', {}, undefined, false, params);

export const getProductSeasonUse = (farmId: number) =>
  FETCH('sys', `/sys/product/farming-season/${farmId}`, 'GET', {});
