import FETCH from '../fetch';
import {STAFF} from './type.d';

export const getStaffList = (params?: {}) =>
  FETCH('sys', '/profiles/staff-profile', 'GET', {}, undefined, false, params);

export const getDetailsStaff = (phone: string) =>
  FETCH('sys', `/profiles/employees-profile/account/${phone}`, 'GET', {});

export const createStaff = (body: STAFF.Request.StaffUser) =>
  FETCH('auth', '/users-employees', 'POST', {}, body, true);

export const InitProfileEmployees = (
  body: STAFF.Request.StaffProfile,
  token: string,
) =>
  FETCH(
    'sys',
    '/profiles/employees-profile/account',
    'PUT',
    {
      Authorization: `Bearer ${token}`,
    },
    body,
  );

export const UpdateProfileStaff = (body: STAFF.Request.StaffProfile) =>
  FETCH('sys', '/sys-accounts/owner/employees-profile', 'PUT', {}, body);

export const DeleteProfile = (params: {phone: string}) =>
  FETCH(
    'sys',
    `/profiles/profile-main`,
    'DELETE',
    {},
    undefined,
    false,
    params,
  );

export const DeleteProfileStaff = (params: {phone: string}) =>
  FETCH(
    'sys',
    `/profiles/profile-employees`,
    'DELETE',
    {},
    undefined,
    false,
    params,
  );

export const DeleteAccount = (params: {login: string}) =>
  FETCH('auth', `/users/employees`, 'DELETE', {}, undefined, true, params);
