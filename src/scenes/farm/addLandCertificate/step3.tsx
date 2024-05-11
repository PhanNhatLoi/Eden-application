import * as React from 'react';
import {
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import {ErrorMessage, Formik} from 'formik';
import * as yup from 'yup';
import {SCREEN} from 'src/help';
import {FieldTitle, StepButtonSingle} from 'src/components/molecules';
import SingleImagePicker from 'src/components/organisms/appForm/SingleImagePicker';
import {FARM} from 'src/api/farm/type.d';
import {
  AppContainer,
  ScrollViewKeyboardAvoidView,
} from 'src/components/organisms';
import {Colors} from 'src/styles';
import * as RootNavigation from 'src/navigations/root-navigator';
import {RouteProp} from '@react-navigation/native';
import {handleSetValue} from '.';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import {store} from 'src/state/store';
import {
  addLandCertification,
  updateLandCertification,
} from 'src/state/reducers/farm/farmSlice';

type Props = {
  route?: RouteProp<{
    params: {
      item: FARM.Request.LandCetification;
      index: number;
    };
  }>;
};

const Step3 = (props: Props) => {
  const {t} = useTranslation();
  const schema = yup.object().shape({});
  const {params} = props.route || {};
  const [loading, setLoading] = React.useState<boolean>(false);

  return (
    <Formik
      initialValues={{
        images: (params?.item?.images && params.item.images.split('|')) || [],
      }}
      onSubmit={values => {
        const item = params?.item;
        const newValue: FARM.Request.LandCetification = {
          id: item?.id || null,
          status: 'ACTIVATED',
          typeId: item?.typeId || null,
          landLotNo: item?.landLotNo || null,
          areage: {
            id: item?.areage.id || null,
            unitId: item?.areage.unitId || null,
            value: item?.areage.value || null,
          },
          formOfUsesIds: item?.formOfUsesIds || [],
          images: values.images.join('|'),
          ownerId: null,
          ownerNameOther: item?.ownerNameOther || null,
        };
        if (params?.index || params?.index === 0) {
          store.dispatch(
            updateLandCertification({body: newValue, index: params.index}),
          );
        } else {
          store.dispatch(addLandCertification({body: newValue}));
        }
        RootNavigation.navigate(SCREEN_NAME.ADD_FARM, {step: 10});
      }}
      validationSchema={schema}>
      {({handleSubmit, setFieldValue, values}) => (
        <AppContainer
          title={t('GCNInfo2')}
          onGoBack={() => {
            const item = params?.item;
            const newValue: FARM.Request.LandCetification = {
              id: item?.id || null,
              typeId: item?.typeId || null,
              landLotNo: item?.landLotNo || null,
              status: 'ACTIVATED',
              areage: {
                id: item?.areage.id || null,
                unitId: item?.areage.unitId || null,
                value: item?.areage.value || null,
              },
              formOfUsesIds: item?.formOfUsesIds || [],
              images: values.images.join('|'),
              ownerId: null,
              ownerNameOther: item?.ownerNameOther || null,
            };
            handleSetValue(
              newValue,
              SCREEN_NAME.ADD_LAND_CERTIFICATE_STEP_2 as keyof typeof SCREEN_NAME,
              params?.index,
            );
          }}
          headerRight={
            <TouchableOpacity
              onPress={() =>
                RootNavigation.navigate(SCREEN_NAME.ADD_FARM, {step: 10})
              }>
              <Text style={styles.textCancle}>{t('cancel')}</Text>
            </TouchableOpacity>
          }>
          <ScrollViewKeyboardAvoidView
            scrollViewProps={{
              style: styles.container,
            }}
            bottomButton={
              <StepButtonSingle
                loading={loading}
                title="save"
                subTitile={t('addLandCertificateInfo1')}
                disableLeft={false}
                disableRight={false}
                onPressRight={handleSubmit}
              />
            }>
            {/* <FieldTitle title={t('updateCertificate')} isRequired={false} /> */}
            <View style={styles.rowWrap}>
              <View style={styles.box}>
                <Text
                  style={[
                    styleSheet.textStyleBasic,
                    {
                      color: Colors.GRAY_04,
                      textAlign: 'center',
                      marginBottom: 15,
                    },
                  ]}>
                  {t('frontGCN')}
                </Text>
                <SingleImagePicker
                  name="front"
                  subTitle={t('frontGCN')}
                  value={values.images[0] || undefined}
                  imageStyle={styles.imageSize}
                  onSelectImage={image => setFieldValue('images[0]', image.uri)}
                />
              </View>
              <View style={styles.box}>
                <Text
                  style={[
                    styleSheet.textStyleBasic,
                    {
                      color: Colors.GRAY_04,
                      textAlign: 'center',
                      marginBottom: 15,
                    },
                  ]}>
                  {t('backGCN')}
                </Text>
                <SingleImagePicker
                  name="back"
                  subTitle={t('backGCN')}
                  value={values.images[1]}
                  imageStyle={styles.imageSize}
                  onSelectImage={image => setFieldValue('images[1]', image.uri)}
                />
              </View>
            </View>
            <View style={styles.rowWrap}>
              <View style={styles.box}>
                <SingleImagePicker
                  name="user"
                  subTitle={t('selfieGCN')}
                  value={values.images[2]}
                  imageStyle={styles.imageSize}
                  onSelectImage={image => setFieldValue('images[2]', image.uri)}
                />
                <Text
                  style={[
                    styleSheet.textStyleBasic,
                    {
                      color: Colors.GRAY_04,
                      textAlign: 'center',
                      flexWrap: 'wrap',
                    },
                  ]}>
                  {t('selfieGCN')}
                </Text>
              </View>
              <View style={styles.box}>
                <SingleImagePicker
                  setLoading={setLoading}
                  name="other"
                  subTitle={t('otherGCN')}
                  value={values.images[3]}
                  imageStyle={styles.imageSize}
                  onSelectImage={image => setFieldValue('images[3]', image.uri)}
                />
                <Text
                  style={[
                    styleSheet.textStyleBasic,
                    {
                      color: Colors.GRAY_04,
                      textAlign: 'center',
                    },
                  ]}>
                  {t('otherGCN')}
                </Text>
              </View>
            </View>

            <Text style={styleSheet.errorTextStyle}>
              <ErrorMessage name={'value'} />
            </Text>
          </ScrollViewKeyboardAvoidView>
        </AppContainer>
      )}
    </Formik>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 15,
    flex: 1,
  },
  filedText: {
    ...styleSheet.filedText,
    width: SCREEN.width - 40,
  },
  dropDownContainerStyle: {
    ...styleSheet.filedText,
    width: SCREEN.width - 40,
    height: 150,
  },
  bottomTab: {
    width: SCREEN.width,
    alignItems: 'center',
  },
  imageSize: {
    width: (SCREEN.width - 40) / 2 - 20,
    height: (SCREEN.width - 40) / 2 - 20,
    backgroundColor: Colors.WHITE,
  },
  rowWrap: {
    ...styleSheet.row,
    flexWrap: 'wrap',
    // marginTop: 20,
  },
  box: {
    width: (SCREEN.width - 40) / 2 - 20,
    marginHorizontal: 10,
    height: '100%',
  },
  textCancle: {
    ...styleSheet.textStyleBold,
    color: Colors.CANCLE_BUTTON,
  },
});

export default Step3;
