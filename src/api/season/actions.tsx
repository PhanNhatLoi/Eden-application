import {paramsFilterSeasonType} from 'src/state/reducers/season/const';
import FETCH from '../fetch';
import {SEASON} from './type.d';

// FETCHB( type,path,method,headers = {} ,body ,isNotHaveVersion = false,params = {})
export const getFarmingSeason = (id: number) =>
  FETCH('sys', `/farming-seasons/${id}`, 'GET', {});

export const getCertificateOfLands = (farmId: number) =>
  FETCH('sys', `/farms/${farmId}/certificate-of-lands`, 'GET', {});

export const getUnits = (params: Object) =>
  FETCH('sys', `/units`, 'GET', {}, undefined, true, params);

export const createOrUpdateSeason = (body: SEASON.Request.Season) =>
  FETCH('sys', `/farming-seasons`, body.id ? 'PUT' : 'POST', {}, body);

export const getSeasons = (params?: paramsFilterSeasonType) =>
  FETCH('sys', `/farming-seasons/all`, 'GET', {}, undefined, false, params);

export const DeleteSeason = (id: number) =>
  FETCH('sys', `/farming-season/deleted/${id}`, 'DELETE', {});
