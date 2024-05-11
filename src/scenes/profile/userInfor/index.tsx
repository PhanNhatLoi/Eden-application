import {
  StyleSheet,
  FlatList,
  Text,
  View,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {AppContainer} from 'src/components/organisms';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {AppDispatch, RootState} from 'src/state/store';
import renderItem, {itemType} from '../ItemCard';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import {formatPhoneNumner} from 'src/help/formatPhone';
import {useDispatch} from 'react-redux';
import {pushNotify} from 'src/state/reducers/Notification/notify';
import SpinButton from 'src/components/organisms/buttons/SpinButton';
import {styleSheet} from 'src/styles/styleSheet';
import {SCREEN} from 'src/help';
import {deleteAccount, logOutUser} from 'src/state/reducers/authUser/authThunk';
import {Colors} from 'src/styles';

type Props = {
  navigation: NavigationProp<ParamListBase>;
};

const UserInfor = (props: Props) => {
  const {t} = useTranslation();
  const {navigation} = props;
  const profile = useSelector((state: RootState) => state.authReducer.user);
  const role = useSelector((state: RootState) => state.authReducer.role);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const handleClickFeatureDeveloping = () => {
    dispatch(
      pushNotify({message: 'feature_inprogess', title: 'feature_inprogess'}),
    );
  };
  const items: itemType[] = [
    {
      id: 0,
      title: t('member_code'),
      label: profile?.code || 'USER_' + profile?.id,
      disable: true,
      onPress: () => {},
    },
    //to do after
    {
      id: 1,
      title: t('phone_number'),
      disable: true,
      label:
        (profile?.phone && formatPhoneNumner(profile?.phone).label) ||
        t('no_data'),
      onPress: () => handleClickFeatureDeveloping(),
      // navigation.navigate(SCREEN_NAME.CHANGE_INFOR_PHONE, {
      //   phone: profile?.phone,
      // }),
    },
    // {
    //   id: 2,
    //   title: t('email_address'),
    //   disable: true,
    //   label: profile?.email || t('no_data'),
    //   onPress: () => handleClickFeatureDeveloping(),
    //   // navigation.navigate(SCREEN_NAME.CHANGE_INFOR_EMAIL, {
    //   //   email: profile?.email,
    //   // }),
    // },
    {
      id: 3,
      title: t('password'),
      label: '',
      onPress: () =>
        navigation.navigate(SCREEN_NAME.CHANGE_INFOR_PASSWORD, {
          phone: profile?.phone,
        }),
    },
  ];

  return (
    <AppContainer title={t('user_infor')}>
      {loading ? (
        <View style={{height: '100%', justifyContent: 'center'}}>
          <ActivityIndicator size={30} color={Colors.SYS_BUTTON} />
        </View>
      ) : (
        <>
          <FlatList data={items} renderItem={renderItem} />
          <View style={{paddingHorizontal: 20}}>
            {role === 'FARMER' && (
              <SpinButton
                isLoading={loading}
                title={t('delete_account')}
                buttonProps={{
                  onPress: () => {
                    Alert.alert(
                      t('delete_account'),
                      t('confirm_delete_account').toString(),
                      [
                        {
                          text: t('cancel').toString(),
                          style: 'destructive',
                          onPress: () => {},
                        },
                        {
                          text: t('confirm').toString(),
                          style: 'default',
                          onPress: () => {
                            if (profile && profile.id) {
                              setLoading(true);
                              dispatch(
                                deleteAccount({
                                  phone: profile.phone,
                                  id: profile.id,
                                }),
                              )
                                .unwrap()
                                .catch(error => {
                                  console.log(error);
                                })
                                .finally(() => {
                                  setLoading(false);
                                  dispatch(logOutUser());
                                });
                            }
                          },
                        },
                      ],
                    );
                  },
                  style: [styleSheet.buttonDefaultStyle, {marginBottom: 10}],
                }}
                titleProps={{
                  style: styleSheet.buttonDefaultText,
                }}
              />
            )}
          </View>
        </>
      )}
    </AppContainer>
  );
};

export default UserInfor;

const styles = StyleSheet.create({});
