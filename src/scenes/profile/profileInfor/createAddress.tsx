import {StyleSheet, Text, View, Switch} from 'react-native';
import React, {useState} from 'react';
import {
  AppContainer,
  FieldAddress,
  ScrollViewKeyboardAvoidView,
} from 'src/components/organisms';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import {Colors} from 'src/styles';
import {Formik} from 'formik';
import * as yup from 'yup';
import {AUTH} from 'src/api/auth/type';
import {
  phoneValidateWithCountryCode,
  requiredFieldValidate,
} from 'src/help/validation/input';
import * as RootNavigation from 'src/navigations/root-navigator';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import {RouteProp} from '@react-navigation/native';
import {StepButtonSingle} from 'src/components/molecules';
import {useSelector} from 'react-redux';
import {AppDispatch, RootState} from 'src/state/store';
import {updateProfile} from 'src/api/auth/actions';
import {convertProfileAddress} from 'src/api/auth/convert';
import {convertProfileRequest} from 'src/api/auth/convert';
import {updateProfileUser} from 'src/state/reducers/authUser/authThunk';
import {useDispatch} from 'react-redux';
import {pushNotify} from 'src/state/reducers/Notification/notify';

type Props = {
  route: RouteProp<{
    params?: {item?: AUTH.PROFILE.Response.Address; id: number};
  }>;
};
const CreateAddress = (props: Props) => {
  const {t} = useTranslation();
  const {params} = props.route;
  const [loading, setLoading] = useState(false);
  const profile = useSelector((state: RootState) => state.authReducer.user);
  const token = useSelector((state: RootState) => state.authReducer.token);
  const dispatch = useDispatch<AppDispatch>();

  //schema formik
  const schema = yup.object().shape({
    fullName: requiredFieldValidate,
    phoneNumber: phoneValidateWithCountryCode,
    // countryId: requiredFieldValidate,
    address1: requiredFieldValidate,
    provinceId: requiredFieldValidate,
    districtId: requiredFieldValidate,
    wardsId: requiredFieldValidate,
  });

  //initData address customer
  const initData: AUTH.PROFILE.Request.Address = {
    fullName: null,
    phoneNumber: null,
    address1: null,
    apartmentNumber: null,
    countryId: 1,
    provinceId: null,
    districtId: null,
    wardsId: null,
    areaCode: null,
    zipCode: null,
    isDefault: !profile?.addresses.length, // if don't have address then set default address
  };

  //function update list address
  const handleUpdateProfile = (value: AUTH.PROFILE.Request.Address) => {
    if (profile) {
      const newAddresses: AUTH.PROFILE.Request.Address[] = profile.addresses
        .filter(f => f.id !== params?.id)
        .map((m: AUTH.PROFILE.Response.Address, i: number) => {
          const temp = convertProfileAddress(m);
          return value.isDefault
            ? {
                ...temp,
                isDefault: false,
              }
            : temp;
        });
      const newProfile: AUTH.PROFILE.Request.Profile = {
        ...convertProfileRequest(profile),
        addresses: [...newAddresses, value],
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
                RootNavigation.navigate(SCREEN_NAME.ADDRESS_INFO, {
                  refresh: true,
                });
              });
        })
        .catch(err => console.log(err))
        .finally(() => setLoading(false));
    }
  };

  return (
    <AppContainer title={t('address')}>
      <Formik
        initialValues={
          (params?.item && convertProfileAddress(params.item)) || initData
        }
        onSubmit={values => {
          setLoading(true);
          handleUpdateProfile(values);
        }}
        validationSchema={schema}>
        {({handleSubmit, handleChange, handleBlur, values, setFieldValue}) => (
          <View style={{padding: 20}}>
            <ScrollViewKeyboardAvoidView
              headerHeight={80}
              scrollViewProps={{
                stickyHeaderIndices: [0],
                contentContainerStyle: styles.content,
              }}
              bottomButton={
                <>
                  <View
                    style={{
                      marginVertical: 20,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}>
                    <Text style={styleSheet.textStyleBasic}>
                      {t('set_default_address')}
                    </Text>
                    <Switch
                      disabled={!profile?.addresses.length}
                      trackColor={{
                        false: Colors.GRAY_03,
                        true: Colors.SYS_BUTTON,
                      }}
                      thumbColor={Colors.WHITE}
                      onValueChange={() => {
                        if (params?.item?.isDefault) {
                          dispatch(
                            pushNotify({
                              title: 'not_set_default_address',
                              message: 'not_set_default_address',
                            }),
                          );
                        } else setFieldValue('isDefault', !values.isDefault);
                      }}
                      value={
                        !profile?.addresses.length ? true : values.isDefault
                      }
                    />
                  </View>
                  <StepButtonSingle
                    spinColor={Colors.SYS_BUTTON}
                    loading={loading}
                    title={t('save').toString()}
                    disableLeft={false}
                    onPressLeft={() => handleSubmit}
                    disableRight={false}
                    onPressRight={handleSubmit}
                    buttonStyle={styleSheet.buttonDefaultStyle}
                    textButtonStyle={styleSheet.buttonDefaultText}
                  />
                </>
              }>
              <View
                style={{
                  paddingBottom: 5,
                  flex: 1,
                  backgroundColor: Colors.WHITE,
                }}>
                <Text
                  style={{...styleSheet.textStyleBasic, fontStyle: 'italic'}}>
                  {t('address_description_note')}
                </Text>
              </View>
              <View>
                <FieldAddress
                  defaultValue={
                    (params?.item && convertProfileAddress(params.item)) ||
                    initData
                  }
                  onChange={(key, value) => setFieldValue(key, value)}
                />
              </View>
            </ScrollViewKeyboardAvoidView>
          </View>
        )}
      </Formik>
    </AppContainer>
  );
};

export default CreateAddress;

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  content: {
    width: '100%',
  },
});
