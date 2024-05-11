// In App.js in a new project

import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabBar from './tab-navigatior';
import {SCREEN_NAME} from './screen-name';
import {
  HomeDetails,
  SettingFilterSeason,
  SeasonDetails,
  AddSeaSon,
  AddCrops,
  FarmDetails,
  AddMaterial,
  SeasonCompletedCreate,
  Works,
  AddWork,
  SettingProfile,
  Staff,
  FilterStaff,
  AddStaff,
  ProfileInfor,
  UserInfor,
  AddressPage,
  CreateAddress,
  ChangePhone,
  ChangeEmail,
  ChangePassword,
  UpdateFarm,
  Notification,
  ShareFriend,
  ShareSeason,
  News,
  NewsDetails,
  Playvideo,
  TermsOfService,
  Policy,
  ImagePreview,
} from 'src/scenes';
import FarmNavigator from './FarmNavigator/farm-navigator';
import CertificateNavigator from './FarmNavigator/Certificate-navigator';
import {CommonActions, RouteProp} from '@react-navigation/native';
import LandCertificateNavigator from './FarmNavigator/LandCertificate-navigator';
import AuthNavigator from './auth-navigator';
import {useSelector} from 'react-redux';
import {RootState, store} from 'src/state/store';
import * as RootNavigation from 'src/navigations/root-navigator';
import {clearFarmFlow} from 'src/state/reducers/farm/farmSlice';

const Stack = createNativeStackNavigator();

type Props = {
  route?: RouteProp<{
    params: any;
  }>;
};
function AppNavigator(props: Props) {
  const token = useSelector((state: RootState) => state.authReducer.token);
  const [firstLoad, setFirstLoad] = React.useState<boolean>(true);
  let defaultStep = token ? SCREEN_NAME.Tab : SCREEN_NAME.AUTH;
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

  React.useEffect(() => {
    if (!firstLoad) {
      if (!token) {
        handleSigninNavigation(SCREEN_NAME.AUTH);
      }
      if (token) {
        handleSigninNavigation(SCREEN_NAME.Tab);
      }
    }
  }, [token]);

  React.useEffect(() => {
    setFirstLoad(false);
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
      initialRouteName={defaultStep}>
      {/* tab bottom */}

      <Stack.Screen
        options={{animation: 'slide_from_right'}}
        name={SCREEN_NAME.Tab}
        component={TabBar}
      />

      {/* tab bottom */}

      {/* auth navigator */}

      <Stack.Screen
        options={{animation: 'slide_from_right'}}
        name={SCREEN_NAME.AUTH}
        component={AuthNavigator}
      />

      {/* auth navigator */}
      {/* Home */}
      <Stack.Screen name={SCREEN_NAME.HOME_DETAILS} component={HomeDetails} />
      {/* Home */}

      {/* FARM */}
      <Stack.Screen name={SCREEN_NAME.ADD_FARM} component={FarmNavigator} />
      <Stack.Screen
        name={SCREEN_NAME.ADD_STANDARD_CERTIFICATE}
        component={CertificateNavigator}
        initialParams={props.route?.params}
      />
      <Stack.Screen
        name={SCREEN_NAME.ADD_LAND_CERTIFICATE}
        component={LandCertificateNavigator}
      />
      {/* <Stack.Screen name={SCREEN_NAME.ADD_FARM} component={AddFarm} /> */}
      {/* <Stack.Screen
        name={SCREEN_NAME.ADD_STANDARD_CERTIFICATE}
        component={AddStandardCertificate}
      /> */}
      {/* FARM */}

      <Stack.Screen
        name={SCREEN_NAME.SETTING_FILTER_SEASON}
        component={SettingFilterSeason}
      />
      <Stack.Screen
        name={SCREEN_NAME.SEASON_DETAILS}
        component={SeasonDetails}
      />
      <Stack.Screen name={SCREEN_NAME.ADD_SEASON} component={AddSeaSon} />
      <Stack.Screen name={SCREEN_NAME.ADD_CROPS} component={AddCrops} />
      <Stack.Screen name={SCREEN_NAME.ADD_MATERIAL} component={AddMaterial} />
      <Stack.Screen
        options={{gestureEnabled: false}}
        name={SCREEN_NAME.SEASON_CREATE_COMPLETED}
        component={SeasonCompletedCreate}
      />
      <Stack.Screen name={SCREEN_NAME.FARM_DETAILS} component={FarmDetails} />
      <Stack.Screen name={SCREEN_NAME.UPDATE_FARM} component={UpdateFarm} />
      <Stack.Screen name={SCREEN_NAME.DIARY_WORKS} component={Works} />
      <Stack.Screen name={SCREEN_NAME.DIARY_ADD_WORKS} component={AddWork} />

      <Stack.Screen
        name={SCREEN_NAME.SETTINGS_PROFILE}
        component={SettingProfile}
      />

      <Stack.Screen name={SCREEN_NAME.STAFF} component={Staff} />
      <Stack.Screen name={SCREEN_NAME.FILTER_STAFF} component={FilterStaff} />
      <Stack.Screen name={SCREEN_NAME.ADD_STAFF} component={AddStaff} />
      <Stack.Screen name={SCREEN_NAME.PROFILE_INFOR} component={ProfileInfor} />
      <Stack.Screen name={SCREEN_NAME.USER_INFOR} component={UserInfor} />
      <Stack.Screen name={SCREEN_NAME.ADDRESS_INFO} component={AddressPage} />
      <Stack.Screen
        name={SCREEN_NAME.CREATE_ADDRESS}
        component={CreateAddress}
      />
      <Stack.Screen
        name={SCREEN_NAME.CHANGE_INFOR_PHONE}
        component={ChangePhone}
      />
      <Stack.Screen
        name={SCREEN_NAME.CHANGE_INFOR_EMAIL}
        component={ChangeEmail}
      />
      <Stack.Screen
        name={SCREEN_NAME.CHANGE_INFOR_PASSWORD}
        component={ChangePassword}
      />
      <Stack.Screen name={SCREEN_NAME.NOTIFICATION} component={Notification} />
      <Stack.Screen name={SCREEN_NAME.SHARE_FRIEND} component={ShareFriend} />
      <Stack.Screen name={SCREEN_NAME.SHARE_SEASON} component={ShareSeason} />
      <Stack.Screen name={SCREEN_NAME.NEWS} component={News} />
      <Stack.Screen name={SCREEN_NAME.NEWS_DETAILS} component={NewsDetails} />
      <Stack.Screen name={SCREEN_NAME.PLAY_VIDEO} component={Playvideo} />
      <Stack.Screen name={SCREEN_NAME.PRE_IMAGE} component={ImagePreview} />
      <Stack.Screen
        name={SCREEN_NAME.TERMS_OF_SERVICE}
        component={TermsOfService}
      />
      <Stack.Screen name={SCREEN_NAME.POLICY} component={Policy} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
