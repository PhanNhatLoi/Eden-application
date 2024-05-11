import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {AppContainer} from 'src/components/organisms';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {AppDispatch, RootState} from 'src/state/store';
import {AUTH} from 'src/api/auth/type';
import {Colors} from 'src/styles';
import {styleSheet} from 'src/styles/styleSheet';
import {boxShadow, padding} from 'src/styles/mixins';
import {ICON} from 'src/assets';
import {CANCLE_BUTTON, SYS_BUTTON} from 'src/styles/colors';
import CustomModal from 'src/components/organisms/ui/modals/Modal';
import {SCREEN} from 'src/help';
import Icon from 'react-native-vector-icons/Octicons';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import SpinButton from 'src/components/organisms/buttons/SpinButton';
import {updateProfile} from 'src/api/auth/actions';
import {useDispatch} from 'react-redux';
import {
  convertProfileAddress,
  convertProfileRequest,
} from 'src/api/auth/convert';
import {updateProfileUser} from 'src/state/reducers/authUser/authThunk';
import IconFigma from 'src/components/organisms/ui/Image/IconFigma';

type Props = {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<{
    params?: {refresh?: boolean};
  }>;
};

const AddressPage = (props: Props) => {
  const {t} = useTranslation();
  const profile = useSelector((state: RootState) => state.authReducer.user);
  const token = useSelector((state: RootState) => state.authReducer.token);
  const [addressList, setAddressList] = useState<
    AUTH.PROFILE.Response.Address[]
  >([]);
  const [focusItemId, setFocusItemId] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const fullAddress = (id: number): string => {
    const address = profile?.addresses.find(f => f.id === id);
    let fullAddress: string[] = [
      address?.address1 || '',
      address?.wards?.name || '',
      address?.district?.name || '',
      address?.province?.name || '',
      address?.country?.name || '',
    ];
    return fullAddress.filter(f => f).join(', ');
  };

  useEffect(() => {
    setAddressList(
      (profile?.addresses.length && [
        ...profile?.addresses.filter(f => f.isDefault),
        ...profile?.addresses.filter(f => !f.isDefault),
      ]) ||
        [],
    );
  }, [profile]);

  const handleUpdateProfile = (value: AUTH.PROFILE.Request.Address[]) => {
    if (profile) {
      const newProfile: AUTH.PROFILE.Request.Profile = {
        ...convertProfileRequest(profile),
        addresses: value,
      };
      updateProfile(newProfile)
        .then(res => {
          setLoading(true);
          token &&
            dispatch(updateProfileUser({token: token, phone: profile.phone}))
              .unwrap()
              .catch(error => {
                console.log(
                  '🚀 ~ file: index.tsx:41 ~ onFinish ~ error:',
                  error,
                );
              })
              .finally(() => {
                setLoading(false);
              });
        })
        .catch(err => console.log(err));
    }
  };

  const handleDeleteAddress = (id: number) => {
    if (profile) {
      setLoading(true);
      const newProfile: AUTH.PROFILE.Request.Profile = {
        ...convertProfileRequest(profile),
        addresses: profile.addresses
          .filter(f => f.id !== id)
          .map(m => convertProfileAddress(m)),
      };
      updateProfile(newProfile)
        .then(res => {
          token &&
            dispatch(updateProfileUser({token: token, phone: profile.phone}))
              .unwrap()
              .catch(error => {
                console.log(
                  '🚀 ~ file: index.tsx:41 ~ onFinish ~ error:',
                  error,
                );
              })
              .finally(() => {
                setLoading(false);
              });
        })
        .catch(err => console.log(err))
        .finally(() => setLoading(false));
    }
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: AUTH.PROFILE.Response.Address;
    index: number;
  }) => {
    return (
      <View style={{...styles.addressCard, marginTop: item.isDefault ? 20 : 0}}>
        {item.isDefault && (
          <View style={styles.default}>
            <Text style={{...styleSheet.textStyleBold, color: SYS_BUTTON}}>
              {t('default')}
            </Text>
          </View>
        )}
        <View style={styles.cardContent}>
          <IconFigma name="location" size={19} />
          <View style={styles.infor}>
            <View
              style={{
                width: '100%',
              }}>
              <View
                style={[
                  {
                    flexDirection: 'row',
                  },
                ]}>
                <Text style={[styleSheet.textStyleBold, {flexWrap: 'nowrap'}]}>
                  {item.fullName || ''}
                  {', '}
                  {(item.phoneNumber && '+84 ' + item.phoneNumber) || ''}
                </Text>
              </View>

              <Text
                style={{
                  ...styleSheet.textStyleBasic,
                  color: Colors.GRAY_05,
                  width: '100%',
                  marginTop: 5,
                }}>
                {fullAddress(item.id)}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  props.navigation.navigate(SCREEN_NAME.CREATE_ADDRESS, {
                    item: item,
                    id: item.id,
                  })
                }>
                <Text style={[styleSheet.linkTextStyle, {marginTop: 10}]}>
                  {t('edit')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              justifyContent: 'flex-end',
            }}>
            {!item.isDefault && (
              <TouchableOpacity onPress={() => setFocusItemId(item.id)}>
                <Image
                  source={ICON['trash']}
                  style={{height: 16.25, width: 16.67}}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={styles.check}
          disabled={Boolean(item.isDefault)}
          onPress={() => {
            const newAddress = addressList.map((m, i) => {
              return {
                fullName: m.fullName || null,
                phoneNumber: m.phoneNumber || null,
                address1: m.address1 || null,
                apartmentNumber: m.apartmentNumber || null,
                countryId: m.country?.id || null,
                provinceId: m.province?.id || null,
                districtId: m.district?.id || null,
                wardsId: m.wards?.id || null,
                areaCode: m.areaCode || null,
                zipCode: m.zipCode || null,
                isDefault: Boolean(i === index),
              };
            });
            handleUpdateProfile(newAddress || []);
          }}>
          <IconFigma
            name={item.isDefault ? 'checkCircle' : 'circle'}
            size={17}
          />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <AppContainer title={t('address')}>
      {loading ? (
        <View style={{height: '100%', justifyContent: 'center'}}>
          <ActivityIndicator size={'large'} />
        </View>
      ) : (
        <View
          style={{
            justifyContent: 'space-between',
            flex: 1,
            height: SCREEN.height,
          }}>
          <FlatList
            data={addressList}
            renderItem={renderItem}
            refreshing={loading}
            ListEmptyComponent={
              <View
                style={{
                  height: SCREEN.height - 200,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={styleSheet.textStyleBasic}>
                  {t('empty_address')}
                </Text>
              </View>
            }
          />
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate(SCREEN_NAME.CREATE_ADDRESS)
            }
            style={{
              ...styleSheet.buttonDefaultStyle,
              marginVertical: 10,
              marginHorizontal: 20,
              width: SCREEN.width - 40,
            }}>
            <Text style={styleSheet.buttonDefaultText}>{t('add_address')}</Text>
            <Icon name="diff-added" size={18} color={Colors.SYS_BUTTON} />
          </TouchableOpacity>
          <CustomModal isVisible={Boolean(focusItemId)}>
            <View style={styles.modal}>
              <Text style={styleSheet.textStyleBasic}>
                {t('confirm_delete_address')}
              </Text>
              <View style={styles.row}>
                <TouchableOpacity
                  onPress={() => setFocusItemId(undefined)}
                  style={{
                    ...styleSheet.buttonPrimaryStyle,
                    backgroundColor: Colors.BLACK_02,
                    marginTop: 0,
                    width: '48%',
                  }}>
                  <Text style={styleSheet.buttonPrimaryText}>
                    {t('cancel')}
                  </Text>
                </TouchableOpacity>
                <SpinButton
                  isLoading={loading}
                  title={t('delete')}
                  colorSpiner={Colors.CANCLE_BUTTON}
                  buttonProps={{
                    onPress: () => {
                      focusItemId && handleDeleteAddress(focusItemId);
                      setFocusItemId(undefined);
                    },
                    style: {
                      ...styleSheet.buttonDefaultStyle,
                      borderColor: Colors.CANCLE_BUTTON,
                      width: '48%',
                    },
                  }}
                  titleProps={{
                    style: {
                      ...styleSheet.buttonPrimaryText,
                      color: CANCLE_BUTTON,
                    },
                  }}
                />
              </View>
            </View>
          </CustomModal>
        </View>
      )}
    </AppContainer>
  );
};

export default AddressPage;

const styles = StyleSheet.create({
  addressCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.WHITE,
    ...styleSheet.listSpace,
    borderColor: Colors.GRAY_LINE,
    borderWidth: 1,
    ...boxShadow(Colors.BLACK),
    borderRadius: 8,
  },
  check: {
    position: 'absolute',
    right: 17,
    top: 11,
  },
  default: {
    paddingHorizontal: 17,
    height: 40,
    justifyContent: 'center',
    borderBottomColor: Colors.GRAY_LINE,
    borderBottomWidth: 1,
  },
  cardContent: {
    // maxHeight: 125,
    // backgroundColor: 'red',
    width: '100%',
    flexDirection: 'row',
    ...padding(8.5, 15, 12, 16),
  },
  infor: {
    flex: 1,
    width: '100%',
    marginLeft: 10,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  modal: {
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
    ...padding(42, 20, 20, 20),
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 32,
  },
});
