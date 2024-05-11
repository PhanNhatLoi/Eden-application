import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {AUTH} from 'src/api/auth/type';
import {store} from 'src/state/store';
import {clearFarmFlow} from '../farm/farmSlice';

interface LoginState {
  user: AUTH.PROFILE.Response.Profile | null;
  token: string | null;
  loginTouchId: {
    user: AUTH.LOGIN.Request.Login;
    type?: 'TouchID' | 'FaceID';
  };
  role?: 'STAFF' | 'FARMER';
  sysAccountIdOwer: number | null;
}
interface LoginActionPayload {
  user: AUTH.PROFILE.Response.Profile | null;
  token: string | null;
}

const initialState: LoginState = {
  user: null,
  token: null,
  loginTouchId: {
    user: {
      username: '',
      password: '',
    },
    type: undefined,
  },
  role: undefined,
  sysAccountIdOwer: null,
};
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginActionPayload>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.role =
        action.payload.user?.createdById === null
          ? 'FARMER'
          : action.payload.user?.createdById !==
            action.payload.user?.sysAccountId
          ? 'STAFF'
          : 'FARMER';
      state.sysAccountIdOwer =
        action.payload.user?.createdById ||
        action.payload.user?.sysAccountId ||
        null;
    },
    logout: state => {
      state.user = initialState.user;
      state.token = initialState.token;
    },
    pushUser: (
      state,
      action: PayloadAction<AUTH.PROFILE.Response.Profile | null>,
    ) => {
      state.user = action.payload;
    },
    saveUserLogin: (state, action: PayloadAction<AUTH.LOGIN.Request.Login>) => {
      state.loginTouchId = {
        user: action.payload,
        type: state.loginTouchId?.type || undefined,
      };
    },
    changeLoginTouchId: (
      state,
      action: PayloadAction<'TouchID' | 'FaceID' | undefined>,
    ) => {
      state.loginTouchId.type = action.payload;
    },
    removeUserLogin: state => {
      state.loginTouchId = {
        user: {
          username: '',
          password: '',
        },
        type: undefined,
      };
    },
  },
});
// Action creators are generated for each case reducer function
export const {
  login,
  logout,
  pushUser,
  saveUserLogin,
  changeLoginTouchId,
  removeUserLogin,
} = authSlice.actions;

export default authSlice.reducer;
