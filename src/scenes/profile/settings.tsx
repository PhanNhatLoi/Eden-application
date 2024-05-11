import {StyleSheet, Text, View, Image, Platform} from 'react-native';
import React, {useState} from 'react';
import {AppContainer, ImageUpload} from 'src/components/organisms';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {AppDispatch, RootState} from 'src/state/store';
import {ICON} from 'src/assets';
import IconAnt from 'react-native-vector-icons/AntDesign';
import {margin, padding} from 'src/styles/mixins';
import {styleSheet} from 'src/styles/styleSheet';
import {Colors} from 'src/styles';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch} from 'react-redux';
import CustomModal from 'src/components/organisms/ui/modals/Modal';
import SpinButton from 'src/components/organisms/buttons/SpinButton';
import {
  CommonActions,
  NavigationProp,
  ParamListBase,
  StackActions,
} from '@react-navigation/native';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import {pushNotify} from 'src/state/reducers/Notification/notify';
import {convertProfileRequest} from 'src/api/auth/convert';
import * as RootNavigation from 'src/navigations/root-navigator';
import {updateProfile} from 'src/api/auth/actions';
import {
  logOutUser,
  updateProfileUser,
} from 'src/state/reducers/authUser/authThunk';
import {VERSION_APP} from 'src/config';
import IconFigma from 'src/components/organisms/ui/Image/IconFigma';
import DeviceInfo from 'react-native-device-info';

type Props = {
  navigation: NavigationProp<ParamListBase>;
};

type itemsType = {
  title: string;
  onPress: () => void;
};

const Settings = (props: Props) => {
  const {t} = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector((state: RootState) => state.authReducer.user);
  const token = useSelector((state: RootState) => state.authReducer.token);
  const [visible, setIsVisible] = useState<boolean>(false);
  const versionApp = DeviceInfo.getVersion();
  const {navigation} = props;
  const handleClickFeatureDeveloping = () => {
    dispatch(
      pushNotify({message: 'feature_inprogess', title: 'feature_inprogess'}),
    );
  };

  const items: itemsType[] = [
    {
      title: 'profile_infor',
      onPress: () => navigation.navigate(SCREEN_NAME.PROFILE_INFOR),
    },
    {
      title: 'privacy_policy',
      onPress: () => navigation.navigate(SCREEN_NAME.POLICY),
    },
    {
      title: 'terms_of_use',
      onPress: () => navigation.navigate(SCREEN_NAME.TERMS_OF_SERVICE),
    },
  ];

  const handleChangeAvatar = (value: string) => {
    if (profile) {
      const newProfile = convertProfileRequest({...profile, avatar: value});
      updateProfile(newProfile).then(res => {
        token &&
          dispatch(updateProfileUser({token: token, phone: profile.phone}))
            .unwrap()
            .catch(error => {
              console.log('🚀 ~ file: index.tsx:41 ~ onFinish ~ error:', error);
            })
            .finally(() => {
              // setLoading(false);
            });
      });
    }
  };

  return (
    <AppContainer
      title={t('settings')}
      onGoBack={() =>
        RootNavigation.navigate('Tab', {routerName: SCREEN_NAME.PROFILE})
      }>
      <View style={styles.avatar}>
        <ImageUpload
          shape="circle"
          defaultUri={profile?.avatar || undefined}
          onChange={(val: string) => {
            handleChangeAvatar(val);
          }}
        />
      </View>
      <View style={{marginTop: 40}}>
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={items[0].onPress}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{width: '10%'}}>
                <IconFigma name={'user'} />
              </View>
              <Text style={{...styleSheet.textStyleBold}}>
                {t(items[0].title)}
              </Text>
            </View>
            <IconAnt name="right" size={20} color={Colors.BLACK} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={items[1].onPress}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{width: '10%'}}>
                <IconFigma name={'shield'} />
              </View>
              <Text style={{...styleSheet.textStyleBold}}>
                {t(items[1].title)}
              </Text>
            </View>
            <IconAnt name="right" size={20} color={Colors.BLACK} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={items[2].onPress}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{width: '10%'}}>
                <IconFigma name={'file'} />
              </View>
              <Text style={{...styleSheet.textStyleBold}}>
                {t(items[2].title)}
              </Text>
            </View>
            <IconAnt name="right" size={20} color={Colors.BLACK} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{...styles.itemContainer, borderBottomWidth: 0}}
          onPress={() => setIsVisible(true)}>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '10%'}}>
              <IconFigma name="logOut" />
            </View>
            <Text
              style={{
                ...styleSheet.textStyleBold,
                color: Colors.CANCLE_BUTTON,
              }}>
              {t('log_out')}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <CustomModal
        isVisible={visible}
        setIsVisible={setIsVisible}
        justifyContent="flex-end">
        <View style={styles.modal}>
          <View style={styles.title}>
            <Text
              style={{
                ...styleSheet.textStyleBold,
                color: Colors.CANCLE_BUTTON,
                fontSize: 16,
              }}>
              {t('log_out')}
            </Text>
          </View>
          <View style={styles.body}>
            <Text style={styleSheet.textStyleBasic}>{t('confirm_logout')}</Text>
            <View style={styles.row}>
              <SpinButton
                isLoading={false}
                title={t('cancel')}
                colorSpiner={Colors.SYS_BUTTON}
                buttonProps={{
                  onPress: () => setIsVisible(false),
                  style: {
                    ...styleSheet.buttonDefaultStyle,
                    backgroundColor: Colors.BLACK_02,
                    width: '45%',
                  },
                }}
                titleProps={{
                  style: {...styleSheet.buttonPrimaryText},
                }}
              />
              <SpinButton
                isLoading={false}
                title={t('log_out')}
                colorSpiner={Colors.SYS_BUTTON}
                buttonProps={{
                  onPress: () => {
                    setIsVisible(false);
                    dispatch(logOutUser());
                  },
                  style: {
                    ...styleSheet.buttonDefaultStyle,
                    borderColor: Colors.CANCLE_BUTTON,
                    width: '45%',
                  },
                }}
                titleProps={{
                  style: {
                    ...styleSheet.buttonDefaultText,
                    color: Colors.CANCLE_BUTTON,
                  },
                }}
              />
            </View>
          </View>
        </View>
      </CustomModal>
      <Text
        style={{
          position: 'absolute',
          bottom: 15,
          width: '100%',
          textAlign: 'center',
          color: Colors.GRAY_03,
        }}>
        {t('version')} {versionApp}
      </Text>
    </AppContainer>
  );
};

export default Settings;

const styles = StyleSheet.create({
  avatar: {
    marginTop: 30,
    alignItems: 'center',
  },
  itemContainer: {
    ...margin(0, 20, 0, 20),
    justifyContent: 'center',
    height: 60,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.GRAY_LINE,
  },
  modal: {
    width: '100%',
    padding: 0,
    margin: 0,
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
  },
  title: {
    height: 80,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.GRAY_02,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    alignItems: 'center',
    width: '100%',
    ...padding(25, 20, 35, 20),
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 30,
    justifyContent: 'space-between',
  },
});
