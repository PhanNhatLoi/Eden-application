import FETCH from '../fetch';
import {DIARY} from './type.d';

export const getDiarys = (params: {}) =>
  FETCH('sys', `/production-log`, 'GET', {}, undefined, true, params);

export const CreateDiary = (body: DIARY.Request.Diary) =>
  FETCH('sys', `/production-log`, 'POST', {}, body, true);
