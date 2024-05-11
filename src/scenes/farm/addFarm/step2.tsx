import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {Formik} from 'formik';
import * as yup from 'yup';
import {StepButtonSingle} from 'src/components/molecules';
import {FARM} from 'src/api/farm/type.d';
import {
  AppContainer,
  FieldAddressAndLocation,
  ScrollViewKeyboardAvoidView,
} from 'src/components/organisms';
import {styles} from './styles';
import {styleSheet} from 'src/styles/styleSheet';
import Geolocation from '@react-native-community/geolocation';
import {useSelector} from 'react-redux';
import {RootState} from 'src/state/store';
import {UpdateValue, alertPopup, saveValue} from '.';
import {TouchableOpacity, View, Text} from 'react-native';
import {Colors} from 'src/styles';

const Step2 = () => {
  const value = useSelector((state: RootState) => state.farmReducer.farmBody);
  const address: FARM.Request.Address = value.address;
  const [loadingForm, setLoadingForm] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [region, setRegion] = React.useState({
    lat: 0,
    lng: 0,
  });
  const {t} = useTranslation();
  const schema = yup.object().shape({
    address1: yup.string().required(() => t('required_field')),
    provinceId: yup.string().required(() => t('required_field')),
    districtId: yup.string().required(() => t('required_field')),
    wardsId: yup.string().required(() => t('required_field')),
  });
  const formType = value.id ? 'UPDATE' : 'CREATE';

  React.useEffect(() => {
    setTimeout(() => {
      setLoadingForm(false);
    }, 500);
  }, []);

  //get currentposion in first open app
  const getCurrentPosistion = () => {
    setLoading(true);
    if (address.lat && address.lng) {
      setRegion({lat: address.lat, lng: address.lng});
      setLoading(false);
    } else {
      Geolocation.getCurrentPosition(
        async position => {
          setRegion({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoading(false);
        },
        error => {
          console.log('🚀 ~ file: ~ line 74 ~ getLocation ~ error', error);
          setLoading(false);
        },
        {timeout: 15000, maximumAge: 2000, enableHighAccuracy: true},
      );
    }
  };

  React.useEffect(() => {
    getCurrentPosistion();
  }, []);

  return (
    <Formik
      initialValues={address}
      onSubmit={(values: FARM.Request.Address) => {
        saveValue({address: values}, 2);
      }}
      validationSchema={schema}>
      {({handleSubmit, values, setFieldValue, errors}) => (
        <AppContainer
          title={t('farmAddress')}
          headerRight={
            !value.id ? (
              <TouchableOpacity
                onPress={() => {
                  alertPopup(formType, values, true, 1, t);
                }}>
                <Text style={styles.textCancle}>{t('cancel')}</Text>
              </TouchableOpacity>
            ) : (
              <View style={{width: 20}}></View>
            )
          }>
          <ScrollViewKeyboardAvoidView
            loading={loadingForm}
            scrollViewProps={{
              style: styles.container,
              contentContainerStyle: styles.content,
            }}
            bottomButton={
              <>
                {value.id ? (
                  <StepButtonSingle
                    loading={loading}
                    spinColor={Colors.SYS_BUTTON}
                    subTitile={t('addFarm2Info')}
                    title="save"
                    buttonStyle={styleSheet.buttonDefaultStyle}
                    textButtonStyle={styleSheet.buttonDefaultText}
                    onPressRight={() => {
                      Object.keys(errors).length === 0 &&
                        UpdateValue({address: values});
                    }}
                  />
                ) : (
                  <StepButtonSingle
                    loading={loading}
                    // spinColor={Colors.SYS_BUTTON}
                    subTitile={t('addFarm2Info')}
                    disableLeft={false}
                    disableRight={false}
                    onPressRight={handleSubmit}
                  />
                )}
              </>
            }>
            <FieldAddressAndLocation
              autoFocus
              setLoading={setLoading}
              locationTitle="farmLocation"
              defaultValue={{...values, ...region}}
              onChange={(name, value) => {
                setFieldValue(name, value);
              }}
            />
          </ScrollViewKeyboardAvoidView>
        </AppContainer>
      )}
    </Formik>
  );
};

export default Step2;
