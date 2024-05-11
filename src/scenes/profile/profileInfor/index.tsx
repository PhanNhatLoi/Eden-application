import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {
  AppContainer,
  ScrollViewKeyboardAvoidView,
} from 'src/components/organisms';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import {Colors} from 'src/styles';
import {useSelector} from 'react-redux';
import {AppDispatch, RootState} from 'src/state/store';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import renderItem, {itemType} from '../ItemCard';
import CustomModal from 'src/components/organisms/ui/modals/Modal';
import Icon from 'react-native-vector-icons/AntDesign';
import SpinButton from 'src/components/organisms/buttons/SpinButton';
import DatePicker from 'react-native-date-picker';
import {formatPhoneNumner} from 'src/help/formatPhone';
import {updateProfile} from 'src/api/auth/actions';
import {useDispatch} from 'react-redux';
import {convertProfileRequest} from 'src/api/auth/convert';
import {updateProfileUser} from 'src/state/reducers/authUser/authThunk';
import TextInput from 'src/components/molecules/TextInput';

type Props = {
  navigation: NavigationProp<ParamListBase>;
};

const ProfileInfor = (props: Props) => {
  const {t} = useTranslation();
  const {navigation} = props;
  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector((state: RootState) => state.authReducer.user);
  const token = useSelector((state: RootState) => state.authReducer.token);
  const [visible, setVisible] = useState<boolean>(false);
  const [modalIndex, setModalIndex] = useState<number>(0);
  const [modalDatePicker, setModalDatePicker] = useState<boolean>(false);
  const [loadingName, setLoadingName] = useState<boolean>(false);
  const [loadingGender, setLoadingGender] = useState<boolean>(false);
  const [loadingBirthday, setLoadingBirthday] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [name, setName] = useState<{
    name: string | null;
    shortName: string | null;
  }>({
    name: profile?.name || '',
    shortName: profile?.shortName || '',
  });

  function addYears(date: Date, years: number) {
    date.setFullYear(date.getFullYear() + years);
    return date;
  }

  const handleUpdateProfile = (value: any) => {
    if (profile) {
      setLoading(true);
      const newProfile = convertProfileRequest({...profile, ...value});
      updateProfile(newProfile).then(res => {
        setVisible(false);
        setModalDatePicker(false);
        token &&
          dispatch(updateProfileUser({token: token, phone: profile.phone}))
            .unwrap()
            .catch(error => {
              console.log('🚀 ~ file: index.tsx:41 ~ onFinish ~ error:', error);
            })
            .finally(() => {
              setTimeout(() => {
                setLoadingBirthday(false);
                setLoadingGender(false);
                setLoadingName(false);
                setLoading(false);
              }, 700);
            });
      });
    }
  };

  const items: itemType[] = [
    {
      id: 0,
      title: t('user_infor'),
      label:
        (profile?.phone && formatPhoneNumner(profile?.phone || '').label) ||
        t('no_data'),
      onPress: () => !loading && navigation.navigate(SCREEN_NAME.USER_INFOR),
    },
    {
      id: 1,
      title: t('full_name'),
      label: profile?.fullName || '',
      onPress: () => {
        if (!loading) {
          setModalIndex(0);
          setVisible(true);
        }
      },
      loading: loadingName,
    },
    {
      id: 2,
      title: t('gender'),
      label: t(profile?.gender?.toLocaleLowerCase() || 'no_data'),
      onPress: () => {
        if (!loading) {
          setModalIndex(1);
          setVisible(true);
        }
      },
      loading: loadingGender,
    },
    {
      id: 3,
      title: t('birth_day'),
      label:
        (profile?.birthday &&
          new Date(profile?.birthday).toLocaleDateString('vi-VN')) ||
        t('no_data'),
      onPress: () => {
        !loading && setModalDatePicker(true);
      },
      loading: loadingBirthday,
    },
    {
      id: 4,
      title: t('address'),
      label:
        (profile?.addresses.length &&
          profile?.addresses.find(f => f.isDefault)?.province?.name) ||
        t('settings'),
      onPress: () => !loading && navigation.navigate(SCREEN_NAME.ADDRESS_INFO),
    },
  ];
  const Hr = () => {
    return <View style={styles.hr}></View>;
  };

  const itemModal = [
    {
      id: 0,
      content: (
        <ScrollViewKeyboardAvoidView
          bottomButton={
            <View style={styles.Modal}>
              <View style={styles.modalTitle}>
                <Text style={styles.modalTitleText}>{t('full_name')}</Text>
                <TouchableOpacity
                  disabled={!visible}
                  onPress={() => {
                    setName({
                      name: profile?.name || '',
                      shortName: profile?.shortName || '',
                    });
                    setVisible(false);
                  }}
                  style={styles.closeButton}>
                  <Icon name="closecircle" size={20} color={Colors.GRAY_03} />
                </TouchableOpacity>
              </View>
              <View style={styles.modalContent}>
                <TextInput
                  defaultValue={profile?.name || undefined}
                  placeholder={t('first_name').toString()}
                  placeholderTextColor={Colors.GRAY_03}
                  style={styles.input}
                  onChangeText={value =>
                    setName(pre => {
                      return {
                        ...pre,
                        name: value.trim(),
                      };
                    })
                  }
                />
                <TextInput
                  defaultValue={profile?.shortName || undefined}
                  placeholder={t('last_name').toString()}
                  placeholderTextColor={Colors.GRAY_03}
                  style={styles.input}
                  onChangeText={value =>
                    setName(pre => {
                      return {
                        ...pre,
                        shortName: value.trim(),
                      };
                    })
                  }
                />

                <SpinButton
                  isLoading={false}
                  disabled={!name.name?.trim() || !name.shortName?.trim()}
                  title={t('save')}
                  buttonProps={{
                    // call api update name
                    onPress: () => {
                      setLoadingName(true);
                      handleUpdateProfile({...name});
                    },
                    style: {
                      ...styleSheet.buttonPrimaryStyle,
                    },
                  }}
                  titleProps={{
                    style: {...styleSheet.buttonPrimaryText},
                  }}
                />
              </View>
            </View>
          }>
          <></>
        </ScrollViewKeyboardAvoidView>
      ),
    },
    {
      id: 1,
      content: (
        <>
          <View style={styles.Modal}>
            <View style={styles.modalTitle}>
              <Text style={styles.modalTitleText}>{t('gender')}</Text>
            </View>
            <View style={{paddingHorizontal: 20}}>
              <TouchableOpacity
                disabled={!visible}
                style={styles.genderItem}
                onPress={() => {
                  setLoadingGender(true);
                  handleUpdateProfile({gender: 'MALE'});
                }}>
                <Text style={styleSheet.textStyleBasic}>{t('male')}</Text>
              </TouchableOpacity>
              <Hr />
              <TouchableOpacity
                disabled={!visible}
                style={styles.genderItem}
                onPress={() => {
                  setLoadingGender(true);
                  handleUpdateProfile({gender: 'FEMALE'});
                }}>
                <Text style={styleSheet.textStyleBasic}>{t('female')}</Text>
              </TouchableOpacity>
              <Hr />
              <TouchableOpacity
                disabled={!visible}
                style={styles.genderItem}
                onPress={() => {
                  setLoadingGender(true);
                  handleUpdateProfile({gender: 'OTHER'});
                }}>
                <Text style={styleSheet.textStyleBasic}>{t('other')}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setVisible(false)}>
            <Text
              style={{...styleSheet.textStyleBold, color: Colors.SYS_BUTTON}}>
              {t('cancel')}
            </Text>
          </TouchableOpacity>
        </>
      ),
    },
  ];

  return (
    <AppContainer title={t('profile_infor')}>
      <FlatList data={items} renderItem={renderItem} />

      <CustomModal
        onBackdropPressOnclose={false}
        isVisible={visible}
        setIsVisible={setVisible}
        justifyContent={modalIndex === 0 ? 'flex-start' : 'flex-end'}>
        {itemModal[modalIndex].content}
      </CustomModal>
      <DatePicker
        modal
        locale="vi-VN"
        androidVariant="iosClone"
        open={modalDatePicker}
        date={new Date(profile?.birthday || Date.now())}
        title={t('birth_day')}
        confirmText={t('confirm').toString()}
        cancelText={t('cancel').toString()}
        mode="date"
        minimumDate={addYears(new Date(), -100)}
        maximumDate={new Date()}
        onConfirm={(d: Date) => {
          // call api update birthDay
          setLoadingBirthday(true);
          handleUpdateProfile({birthday: d.toISOString()});
        }}
        onCancel={() => {
          setModalDatePicker(false);
        }}
      />
    </AppContainer>
  );
};

export default ProfileInfor;

const styles = StyleSheet.create({
  Modal: {
    width: '100%',
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
  },
  modalTitle: {
    height: 70,
    borderBottomColor: Colors.GRAY_02,
    borderBottomWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitleText: {
    ...styleSheet.textStyleBold,
    color: Colors.SYS_BUTTON,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
  },
  modalContent: {
    padding: 20,
  },
  input: {
    height: 40,
    borderBottomColor: Colors.GRAY_03,
    borderBottomWidth: 1,
    ...styleSheet.textStyleBold,
    marginVertical: 10,
  },
  genderItem: {
    height: 57,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: Colors.GRAY_02,
    borderBottomWidth: 0.3,
  },
  hr: {
    width: '100%',
    borderWidth: 0.25,
    borderColor: Colors.GRAY_02,
  },
  cancelButton: {
    height: 50,
    marginTop: 20,
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
