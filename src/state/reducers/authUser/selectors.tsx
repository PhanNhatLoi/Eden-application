import {createSelector} from 'reselect';
import {REDUCER_NAME} from 'src/state/constant';

const userDataSelector = (state: any) => state[REDUCER_NAME.authReducer];

export const getAuthUser = createSelector(
  userDataSelector,
  state => state.user,
);

export const getToken = createSelector(userDataSelector, state => state.token);
