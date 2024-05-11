import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {persistReducer, persistStore} from 'redux-persist';
import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-async-storage/async-storage';

import authReducer from './reducers/authUser/authSlice';
import counterReducer from 'src/state/reducers/counter/counterSlice';
import notifyReducer from './reducers/Notification/notify';
import seasonReducer from './reducers/season/seasonSlice';
import farmReducer from './reducers/farm/farmSlice';
import diary from './reducers/diary/diarySlice';
import staff from './reducers/staff/staffSlice';
import appInfo from './reducers/appInfo/InforSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  authReducer: authReducer,
  counter: counterReducer,
  notify: notifyReducer,
  season: seasonReducer,
  farmReducer: farmReducer,
  diary: diary,
  staff: staff,
  appInfo: appInfo,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false}).concat(thunk),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
