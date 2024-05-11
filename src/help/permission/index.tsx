import React, {useEffect} from 'react';
import {Alert, Linking, Platform} from 'react-native';
import requestPermission from '../requestPermission';
import DeviceInfo from 'react-native-device-info';
import {store} from 'src/state/store';
import compareVersionNumbers from '../compareVersion';
import {useTranslation} from 'react-i18next';
import {APP_INSTALL_LINK} from 'src/config';
import {
  removeSkipVersion,
  saveSkipVersion,
} from 'src/state/reducers/appInfo/InforSlice';
import {getVersionApp} from 'src/api/appData/actions';
import {ClearFilterSeason} from 'src/state/reducers/season/seasonSlice';

const CheckPermissionAndVerSion = () => {
  const {t} = useTranslation();

  //effect
  useEffect(() => {
    // getPermission();
    checkVersion();
    store.dispatch(ClearFilterSeason()); // clear filter season
  }, []);

  // request permission for app
  const getPermission = async () => {
    setTimeout(
      () => {
        requestPermission({
          key: 'ACCESS_FINE_LOCATION',
          title: 'location',
        })
          .then(result => {
            // console.log(result);
          })
          .catch(error => {
            console.log(error);
          });
      },
      Platform.OS === 'ios' ? 2000 : 1000,
    );
  };

  const checkVersion = async () => {
    // todo check version app
    try {
      const versionApp = DeviceInfo.getVersion();
      const versionServerCheck = await getVersionApp();
      const skippedVersion = store.getState().appInfo?.skippedVersion || '';
      if (
        compareVersionNumbers(versionApp, versionServerCheck.version) === -1 &&
        versionServerCheck?.version !== skippedVersion
      ) {
        Alert.alert(
          t('new_version_release'),
          t('update_version_note').toString(),
          versionServerCheck?.force
            ? [
                {
                  text: t('update').toString(),
                  onPress: () => {
                    Linking.openURL(APP_INSTALL_LINK);
                  },
                  style: 'cancel',
                },
              ]
            : [
                {
                  text: t('update').toString(),
                  onPress: () => {
                    Linking.openURL(APP_INSTALL_LINK);
                  },
                  style: 'cancel',
                },
                {
                  text: t('later').toString(),
                  onPress: () => {
                    store.dispatch(saveSkipVersion(versionServerCheck.version));
                  },
                },
              ],
        );
      } else if (
        compareVersionNumbers(versionApp, versionServerCheck?.version) !== -1
      ) {
        store.dispatch(removeSkipVersion());
        getPermission();
      } else {
        getPermission();
      }
    } catch (error) {
      console.log(
        '🚀 ~ file: index.js ~ line 41 ~ checkVersion ~ error',
        error,
      );
    }
  };

  return <></>;
};

export default CheckPermissionAndVerSion;
