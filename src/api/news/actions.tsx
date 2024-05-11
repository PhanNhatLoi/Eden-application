import FETCH from '../fetch';
import {NEWS} from './type.d';
// FETCHB( type,path,method,headers = {} ,body ,isNotHaveVersion = false,params = {})
export const getNews = (params?: {}) =>
  FETCH(
    'mock',
    `https://645a202e65bd868e93119bce.mockapi.io/news`,
    'GET',
    {},
    undefined,
    false,
    params,
  );

export const getNewsDetails = (id: number) =>
  FETCH(
    'mock',
    `https://645a202e65bd868e93119bce.mockapi.io/news/${id}`,
    'GET',
    {},
  );
