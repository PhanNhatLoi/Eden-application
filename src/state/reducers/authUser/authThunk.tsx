import {createAsyncThunk} from '@reduxjs/toolkit';
import {getProfile, loginApi} from 'src/api/auth/actions';
import {AUTH} from 'src/api/auth/type';
import {
  login,
  logout,
  pushUser,
  removeUserLogin,
  saveUserLogin,
} from './authSlice';
import {pushNotify} from 'src/state/reducers/Notification/notify';
import {store} from 'src/state/store';
import {clearFarmFlow} from '../farm/farmSlice';
import {resetData} from '../season/seasonSlice';
import {DeleteAccount, DeleteProfile} from 'src/api/staff/actions';
import * as RootNavigation from 'src/navigations/root-navigator';
import {Alert} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {SCREEN_NAME} from 'src/navigations/screen-name';

const handleSigninNavigation = (screenName: string) => {
  setTimeout(() => {
    RootNavigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: screenName}],
      }),
    );
  }, 300);
};
export const loginUser = createAsyncThunk(
  'login/loginUser',
  async (loginBody: AUTH.LOGIN.Request.Login, thunkAPI) => {
    try {
      await loginApi(loginBody)
        .then(async res => {
          const loginTouchId = store.getState().authReducer.loginTouchId;

          if (
            loginTouchId?.user?.username !== loginBody.username ||
            loginTouchId?.user?.password !== loginBody.password
          ) {
            thunkAPI.dispatch(removeUserLogin());
          }
          const profile: AUTH.PROFILE.Response.Profile = await getProfile(
            res.id_token,
            loginBody.username,
          );
          thunkAPI.dispatch(
            login({
              user: profile || null,
              token: res.id_token,
            }),
          );
          thunkAPI.dispatch(saveUserLogin(loginBody));

          // handleSigninNavigation(SCREEN_NAME.Tab);
        })
        .catch(err => {
          store.dispatch(
            pushNotify({title: err.message, message: err.message}),
          );
          return thunkAPI.rejectWithValue(err.response);
        });
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response);
    }
  },
);

export const logOutUser = createAsyncThunk(
  'logout/logoutUser',
  async (body: undefined, thunkAPI) => {
    try {
      store.dispatch(clearFarmFlow());
      store.dispatch(resetData());
      store.dispatch(logout());
      // handleSigninNavigation(SCREEN_NAME.AUTH);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response);
    }
  },
);

export const updateProfileUser = createAsyncThunk(
  'login/updateProfileUser',
  async (params: {token: string; phone: string}, thunkAPI) => {
    try {
      await getProfile(params.token, params.phone)
        .then(async (res: AUTH.PROFILE.Response.Profile) => {
          if (res) thunkAPI.dispatch(pushUser(res));
        })
        .catch(err => {
          store.dispatch(
            pushNotify({title: err.message, message: err.message}),
          );
          return thunkAPI.rejectWithValue(err.response);
        });
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response);
    }
  },
);

export const deleteAccount = createAsyncThunk(
  'user/deleteAccount',
  async (params: {phone: string; id: number}, thunkAPI) => {
    try {
      await DeleteProfile({phone: params.phone})
        .then(res => {
          DeleteAccount({login: params.phone})
            .then(res => {
              store.dispatch(removeUserLogin());
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response);
    }
  },
);
