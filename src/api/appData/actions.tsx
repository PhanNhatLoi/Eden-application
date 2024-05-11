import FETCH from '../fetch';

export const getProvinceList = () => FETCH('sys', '/provinces', 'GET');
export const getDistrictList = (provinceId: string | number) =>
  FETCH('sys', `/districts?provinceId=${provinceId}`, 'GET');
export const getWardList = (districtId: string | number) =>
  FETCH('sys', `/wards?districtId=${districtId}`, 'GET');

export const getUnit = (unit: string) =>
  FETCH('sys', `/units?type=${unit}`, 'GET', undefined, undefined, true);
export const getMasterData = (type: string) =>
  FETCH(
    'sys',
    `/master-data/types?type=${type}&page=0&size=9999`,
    'GET',
    undefined,
    undefined,
    true,
  );
export const getUnitMass = () =>
  FETCH('sys', '/units?type=MASS', 'GET', undefined, undefined, true);
export const getProductList = () =>
  FETCH(
    'sys',
    '/products/filter?type=PRODUCT',
    'GET',
    undefined,
    undefined,
    true,
  );
export const getCategoryMaterial = () =>
  FETCH(
    'sys',
    '/categories/filter?type=MATERIAL',
    'GET',
    undefined,
    undefined,
    false,
  );

export const getManufacturer = () =>
  FETCH('godi', '/manufacturer/filter', 'GET', undefined, undefined, false);

export const getMaterialByManufacturer = (params?: Object) =>
  FETCH(
    'godi',
    `/manufacturer/material/filter`,
    'GET',
    undefined,
    undefined,
    false,
    params,
  );

export const getOwner = () =>
  FETCH('sys', `/profiles/filter`, 'GET', undefined, undefined, false);
export const addOtherMasterData = (body: {name: string; type: string}) =>
  FETCH('sys', `/master-data/master-data-types`, 'POST', undefined, body, true);

export const inviteInstall = () => FETCH('sys', `/invite/sys`, 'GET', {});
export const inviteSeason = (params: {farmingSeasonId: number | null}) =>
  FETCH('sys', `/invite/web`, 'GET', {}, undefined, false, params);

export const getVersionApp = () =>
  FETCH('sys', `/version/sys`, 'GET', {}, undefined, false, {});
