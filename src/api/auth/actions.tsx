import FETCH from '../fetch';
import * as Types from './type';
import {store} from 'src/state/store';

export const loginApi = (data: Types.AUTH.LOGIN.Request.Login) =>
  FETCH('auth', '/sys/account/authenticate', 'POST', {}, data);

export const checkPhone = (data: {login: string}): Promise<boolean> =>
  FETCH('auth', `/sys/account/register/check/${data.login}`, 'GET', {});

export const register = (phone: string) =>
  FETCH('auth', `/otp/register/init/${phone}`, 'POST', {});

export const sendOtpRegister = (
  data: Types.AUTH.PASSWORD.Request.ValidateOtpResetPassword,
) => FETCH('auth', `/otp/validate/${data.phone}/${data.otp}`, 'POST', {});

export const finishRegister = (data: Types.AUTH.REGISTER.Request.UserInit) =>
  FETCH('auth', `/sys/account/register`, 'POST', {}, data);

export const activeUser = (params: {}) =>
  FETCH('auth', `/sys/account/activate`, 'GET', {}, undefined, false, params);

export const forgotPassword = (data: {
  login: string;
}): Promise<Types.AUTH.PASSWORD.Response.ResetPassword> =>
  FETCH('auth', '/sys/account/reset-password/init', 'POST', {}, data);

export const validateOtpResetPassword = (
  data: Types.AUTH.PASSWORD.Request.ValidateOtpResetPassword,
): Promise<{resetKey: string}> =>
  FETCH('auth', '/sys/account/reset-password/validate-otp', 'POST', {}, data);

export const resetPassword = (
  data: Types.AUTH.PASSWORD.Request.ResetPassword,
) => FETCH('auth', '/sys/account/reset-password/finish', 'POST', {}, data);

export const getProfile = (token: string, phone: string) =>
  FETCH('sys', `/profiles/main-profile/${phone}`, 'GET', {
    Authorization: `Bearer ${token}`,
  });

export const updateProfile = (body: Types.AUTH.PROFILE.Request.Profile) =>
  FETCH(
    'sys',
    store.getState().authReducer.role === 'FARMER'
      ? '/sys-accounts/main-profile'
      : '/profiles/employees-profile/account',
    'PUT',
    {},
    body,
  );

export const initProfile = (token: string, body: any) =>
  FETCH(
    'sys',
    '/sys-accounts/main/profile',
    'POST',
    {
      Authorization: `Bearer ${token}`,
    },
    body,
  );
