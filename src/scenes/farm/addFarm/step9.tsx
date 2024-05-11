/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import {SCREEN} from 'src/help';
import {
  StepButton,
  StepButtonSingle,
  SwipeableView,
} from 'src/components/molecules';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as RootNavigation from 'src/navigations/root-navigator';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, store} from 'src/state/store';
import {
  addCertification,
  deleteCertification,
  saveCertification,
} from 'src/state/reducers/farm/farmSlice';
import {FARM} from 'src/api/farm/type.d';
import {ICON} from 'src/assets';
import {
  AppContainer,
  ScrollViewKeyboardAvoidView,
} from 'src/components/organisms';
import {Colors} from 'src/styles';
import {UpdateValue, alertPopup, saveValue} from '.';
import {getMasterData} from 'src/api/appData/actions';
import {optionsType} from 'src/components/organisms/appForm/FieldDropDown';

const Step9 = () => {
  const value = useSelector((state: RootState) => state.farmReducer.farmBody);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [typeId, setTypeId] = React.useState<optionsType[]>([]);

  const listCertificateRedux = useSelector(
    (state: RootState) => state.farmReducer.certifications,
  );
  const formType = value.id ? 'UPDATE' : 'CREATE';

  const fetchUnit = async () => {
    try {
      const res = await getMasterData('CERTIFICATION');
      const format = res.map((obj: any) => ({label: obj.name, value: obj.id}));

      setTypeId(format);
    } catch (error) {
      console.log('🚀 ~ file: step3.tsx:33 ~ fetchUnit ~ error:', error);
    }
  };
  React.useEffect(() => {
    dispatch(saveCertification(value.certifications));
    fetchUnit();
  }, []);

  const toAddCertificate = () => {
    const CERTIFICATION: FARM.Request.Cetification = {
      id: null,
      typeId: null,
      issuedDate: null,
      expirationDate: null,
      images: null,
      reassessmentDate: null,
      issuedBy: null,
      evaluationDate: null,
    };
    RootNavigation.navigate(SCREEN_NAME.ADD_STANDARD_CERTIFICATE, {
      item: CERTIFICATION,
    });
  };
  const renderItem = ({
    item,
    index,
  }: {
    item: FARM.Request.Cetification;
    index: number;
  }) => {
    return (
      <SwipeableView
        swipeViewStyle={{height: '100%'}}
        onPressSwipeView={() => dispatch(deleteCertification(index))}
        swipeChildren={
          <View style={styles.rightView}>
            <Image source={ICON['trash']} />
          </View>
        }>
        <TouchableOpacity
          hitSlop={{top: 20, bottom: 20, right: 20, left: 20}}
          style={styles.button}
          onPress={() => {
            RootNavigation.navigate(SCREEN_NAME.ADD_STANDARD_CERTIFICATE, {
              item: item,
              index: index,
              step: 1,
            });
          }}>
          <View>
            <Text style={styleSheet.textStyleBold}>
              {typeId.find(f => f.value === item.typeId)?.label}
            </Text>
            <View style={[styleSheet.row, {marginTop: 6}]}>
              <View>
                <Text style={styles.cerInfo}>{t('dateProvider')}:</Text>
                <Text style={styles.cerInfo}>{t('dateExpire')}:</Text>
                <Text style={styles.cerInfo}>{t('dateReview')}:</Text>
                <Text style={styles.cerInfo}>{t('dateReReview')}:</Text>
              </View>
              <View style={{marginLeft: 10}}>
                <Text style={styles.cerValue}>
                  {new Date(item.issuedDate || '').toLocaleDateString('vi-VN')}
                </Text>
                <Text style={styles.cerValue}>
                  {(item.expirationDate &&
                    new Date(item.expirationDate || '').toLocaleDateString(
                      'vi-VN',
                    )) ||
                    t('no_data')}
                </Text>
                <Text style={styles.cerValue}>
                  {(item.evaluationDate &&
                    new Date(item.evaluationDate || '').toLocaleDateString(
                      'vi-VN',
                    )) ||
                    t('no_data')}
                </Text>
                <Text style={styles.cerValue}>
                  {(item.reassessmentDate &&
                    new Date(item.reassessmentDate || '').toLocaleDateString(
                      'vi-VN',
                    )) ||
                    t('no_data')}
                </Text>
              </View>
            </View>
          </View>

          <AntDesign name="right" size={20} color={Colors.BLACK} />
        </TouchableOpacity>
      </SwipeableView>
    );
  };
  return (
    <AppContainer
      title={t('GCN')}
      headerRight={
        !value.id ? (
          <TouchableOpacity
            onPress={() => {
              alertPopup(
                formType,
                {certifications: listCertificateRedux},
                true,
                8,
                t,
              );
            }}>
            <Text style={styles.textCancle}>{t('cancel')}</Text>
          </TouchableOpacity>
        ) : (
          <View style={{width: 20}}></View>
        )
      }>
      <ScrollViewKeyboardAvoidView
        scrollViewProps={{
          style: styles.container,
        }}
        bottomButton={
          <>
            {value.id ? (
              <StepButtonSingle
                subTitile={t('addFarm11Info')}
                title="save"
                buttonStyle={styleSheet.buttonDefaultStyle}
                textButtonStyle={styleSheet.buttonDefaultText}
                onPressRight={() =>
                  UpdateValue({certifications: listCertificateRedux})
                }
              />
            ) : (
              <StepButtonSingle
                subTitile={t('addFarm11Info')}
                disableLeft={false}
                disableRight={false}
                onPressRight={() =>
                  saveValue({certifications: listCertificateRedux}, 9)
                }
              />
            )}
          </>
        }>
        <FlatList
          contentContainerStyle={{paddingBottom: 20}}
          scrollEnabled={false}
          data={listCertificateRedux}
          renderItem={renderItem}
          ListFooterComponent={
            <TouchableOpacity style={styles.button} onPress={toAddCertificate}>
              <Text style={styles.filedText}>{t('addGCN')}</Text>
              <AntDesign name="right" size={20} color={Colors.BLACK} />
            </TouchableOpacity>
          }
        />
      </ScrollViewKeyboardAvoidView>
    </AppContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 15,
    flex: 1,
    width: '100%',
  },
  filedText: {
    ...styleSheet.textStyleBasic,
  },
  cerInfo: {
    ...styleSheet.textStyleSub,
    fontSize: 12,
    marginBottom: 5,
  },
  cerValue: {
    ...styleSheet.textStyleBasic,
    fontSize: 12,
    marginBottom: 5,
  },
  button: {
    ...styleSheet.filedText,
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: undefined,
    marginTop: 0,
    ...styleSheet.listSpace,
  },
  bottomTab: {
    width: SCREEN.width,
    alignItems: 'center',
  },
  rightView: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    borderRadius: 8,
  },
  textCancle: {
    ...styleSheet.textStyleBold,
    fontSize: 16,
    color: Colors.CANCLE_BUTTON,
  },
});

export default Step9;
