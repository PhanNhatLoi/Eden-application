import {t} from 'i18next';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import {request, PERMISSIONS} from 'react-native-permissions';
import {Linking} from 'react-native';

type PropsRequestPermissionType = {
  key: keyPermission;
  title: string;
  message?: string;
  onClose?: () => void;
};

type keyPermission =
  | 'READ_CALENDAR'
  | 'WRITE_CALENDAR'
  | 'CAMERA'
  | 'READ_CONTACTS'
  | 'WRITE_CONTACTS'
  | 'GET_ACCOUNTS'
  | 'ACCESS_BACKGROUND_LOCATION'
  | 'ACCESS_FINE_LOCATION'
  | 'ACCESS_COARSE_LOCATION'
  | 'RECORD_AUDIO'
  | 'READ_PHONE_STATE'
  | 'CALL_PHONE'
  | 'READ_CALL_LOG'
  | 'WRITE_CALL_LOG'
  | 'com.android.voicemail.permission.ADD_VOICEMAIL'
  | 'com.android.voicemail.permission.READ_VOICEMAIL'
  | 'com.android.voicemail.permission.WRITE_VOICEMAIL'
  | 'USE_SIP'
  | 'PROCESS_OUTGOING_CALLS'
  | 'BODY_SENSORS'
  | 'BODY_SENSORS_BACKGROUND'
  | 'SEND_SMS'
  | 'RECEIVE_SMS'
  | 'READ_SMS'
  | 'RECEIVE_WAP_PUSH'
  | 'RECEIVE_MMS'
  | 'READ_EXTERNAL_STORAGE'
  | 'READ_MEDIA_IMAGES'
  | 'READ_MEDIA_VIDEO'
  | 'READ_MEDIA_AUDIO'
  | 'WRITE_EXTERNAL_STORAGE'
  | 'BLUETOOTH_CONNECT'
  | 'BLUETOOTH_SCAN'
  | 'BLUETOOTH_ADVERTISE'
  | 'ACCESS_MEDIA_LOCATION'
  | 'ACCEPT_HANDOVER'
  | 'ACTIVITY_RECOGNITION'
  | 'ANSWER_PHONE_CALLS'
  | 'READ_PHONE_NUMBERS'
  | 'UWB_RANGING'
  | 'POST_NOTIFICATIONS'
  | 'NEARBY_WIFI_DEVICES';
const androidToIosPermission = (key: keyPermission) => {
  switch (key) {
    case 'CAMERA':
      return PERMISSIONS.IOS.CAMERA;
    case 'RECORD_AUDIO':
      return PERMISSIONS.IOS.MICROPHONE;
    case 'READ_MEDIA_IMAGES':
      return PERMISSIONS.IOS.PHOTO_LIBRARY;
    case 'READ_EXTERNAL_STORAGE':
      return PERMISSIONS.IOS.MEDIA_LIBRARY;
    case 'ACCESS_BACKGROUND_LOCATION':
      return PERMISSIONS.IOS.LOCATION_ALWAYS;
    case 'ACCESS_FINE_LOCATION':
      return PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
    default:
      break;
  }
};
const requestPermission = async (props: PropsRequestPermissionType) => {
  const {onClose = () => {}} = props;
  try {
    const permission = androidToIosPermission(props.key);
    const result =
      Platform.OS === 'android'
        ? await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS[props.key],
            {
              title: t(`cool_permission_`) + t(props.title),
              message:
                t('cool_this_feature_needs_access_to_your') +
                t(props.title) +
                t('please_allow'),
              buttonNeutral: t('ask_me_later').toString(),
              buttonNegative: t('cancel').toString(),
              buttonPositive: t('ok').toString(),
            },
          )
        : permission
        ? await request(permission)
        : null;
    if (
      (Platform.OS === 'ios' && result === 'blocked') ||
      result === 'never_ask_again'
    ) {
      Alert.alert(
        t(`cool_permission_`) + t(props.title),
        t('cool_this_feature_needs_access_to_your') +
          t(props.title) +
          t('please_allow'),
        [
          {
            text: t('cancel').toString(),
            style: 'destructive',
            onPress: onClose,
          },
          {
            text: t('ok').toString(),
            onPress: () => Linking.openSettings(),
            style: 'default',
          },
        ],
      );
    }
    return result;
  } catch (err) {
    console.warn(err);
  }
};

export default requestPermission;
