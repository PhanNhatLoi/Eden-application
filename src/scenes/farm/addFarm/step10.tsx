import * as React from 'react';
import {
  Alert,
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
import {RootState} from 'src/state/store';
import {Colors} from 'src/styles';
import {ICON} from 'src/assets';
import {FARM} from 'src/api/farm/type.d';
import {useState} from 'react';
import {
  clearFarmFlow,
  deleteLandCertification,
  saveLandCertification,
} from 'src/state/reducers/farm/farmSlice';
import {optionsType} from 'src/components/organisms/appForm/FieldDropDown';
import {getMasterData, getUnit} from 'src/api/appData/actions';
import {
  createAndUpdateFarm,
  deleteCertificationLand,
  deleteFarm,
} from 'src/api/farm/actions';
import {Skeleton} from '@rneui/themed';
import {
  AppContainer,
  ScrollViewKeyboardAvoidView,
} from 'src/components/organisms';
import {formatDecimal} from 'src/help/formatDecimal';
import {UpdateValue, alertPopup, saveValue} from '.';

const Step10 = () => {
  const value = useSelector((state: RootState) => state.farmReducer.farmBody);
  const {t} = useTranslation();
  const [loading, setloading] = useState<boolean>(false);
  const [unit, setUnit] = useState<optionsType[]>([]);
  const [formOfUses, setFormOfUses] = useState<optionsType[]>([]);
  const [loadingForm, setloadingForm] = useState<boolean>(true);
  const formType = value.id ? 'UPDATE' : 'CREATE';
  const [items, setItems] = useState<optionsType[]>([]);

  const dispatch = useDispatch();

  const toAddCertificate = () => {
    const LaneCetification: FARM.Request.LandCetification = {
      id: null,
      typeId: null,
      landLotNo: null,
      areage: {
        id: null,
        unitId: null,
        value: null,
      },
      status: 'ACTIVATED',
      formOfUsesIds: [],
      images: null,
      ownerId: null,
      ownerNameOther: null,
    };
    RootNavigation.navigate(SCREEN_NAME.ADD_LAND_CERTIFICATE, {
      item: LaneCetification,
    });
  };

  const listLandCertificateRedux = useSelector(
    (state: RootState) => state.farmReducer.certifycateOfLands,
  );

  React.useEffect(() => {
    dispatch(saveLandCertification(value.certifycateOfLands));
    fetchUnit();
    fetchFormOfUses();
    fetchMasterData();
  }, []);

  const fetchMasterData = async () => {
    try {
      const res = await getMasterData('CERTIFICATION_LAND');
      const format = res.map((obj: any) => ({label: obj.name, value: obj.id}));
      setItems(format);
    } catch (error) {
      console.log('🚀 ~ file: step3.tsx:33 ~ fetchUnit ~ error:', error);
    }
  };

  const fetchFormOfUses = () => {
    getMasterData('FORM_OF_USES')
      .then(res => {
        setFormOfUses(
          res.map((m: any) => {
            return {
              label: m.name,
              value: m.id,
            };
          }),
        );
      })
      .catch(err => console.log(err));
  };

  const fetchUnit = () => {
    getUnit('ACREAGE')
      .then(res => {
        setUnit(
          res.map((m: any) => {
            return {
              label: m.shortName,
              value: m.id,
            };
          }),
        );
      })
      .catch(err => console.log(err));
  };

  React.useEffect(() => {
    if (unit.length && formOfUses.length) setloadingForm(false);
  }, [unit, formOfUses]);

  const renderItem = ({
    item,
    index,
  }: {
    item: FARM.Request.LandCetification;
    index: number;
  }) => {
    return (
      <SwipeableView
        swipeViewStyle={{height: '100%'}}
        onPressSwipeView={() => {
          if (item.id) {
            Alert.alert(
              t('delete_cartificationLand'),
              t('delete_cartificationLand_des').toString(),
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
                    if (item.id) {
                      dispatch(
                        deleteLandCertification({index: index, id: item.id}),
                      );
                    }
                  },
                },
              ],
            );
          } else {
            dispatch(deleteLandCertification({index: index}));
          }
        }}
        swipeChildren={
          <View style={styles.rightView}>
            <Image source={ICON['trash']} />
          </View>
        }>
        <TouchableOpacity
          hitSlop={{top: 20, bottom: 20, right: 20, left: 20}}
          style={styles.gcnCard}
          onPress={() => {
            RootNavigation.navigate(SCREEN_NAME.ADD_LAND_CERTIFICATE, {
              item: item,
              index: index,
              step: 1,
            });
          }}>
          {loadingForm ? (
            <Skeleton
              style={{
                backgroundColor: Colors.WHITE,
                borderColor: Colors.GRAY_03,
                flex: 1,
              }}
              skeletonStyle={{backgroundColor: Colors.GRAY_01}}
              animation="wave"
              height={60}
            />
          ) : (
            <View style={{flex: 1}}>
              <Text style={[styleSheet.textStyleBold, {fontSize: 13}]}>
                {item.landLotNo}
              </Text>
              <Text
                style={[
                  styleSheet.textStyleBasic,
                  {fontSize: 9, marginBottom: 10, color: Colors.BLACK_04},
                ]}>
                {'GCN '}
                {items.find(f => f.value === item.typeId)?.label}
              </Text>
              <View
                style={[
                  styleSheet.row,
                  {alignItems: 'flex-start', justifyContent: 'space-between'},
                ]}>
                <View>
                  <Text
                    style={[
                      styleSheet.textStyleBasic,
                      {fontSize: 10, color: Colors.BLACK_04},
                    ]}>
                    {t('area')}:
                  </Text>
                  <Text
                    style={[
                      styleSheet.textStyleBasic,
                      {fontSize: 10, color: Colors.BLACK_04},
                    ]}>
                    {t('landStatus')}:
                  </Text>
                </View>
                <View
                  style={{alignItems: 'flex-start', flex: 1, marginLeft: 20}}>
                  <Text style={[styleSheet.textStyleBasic, {fontSize: 10}]}>
                    {formatDecimal(item.areage.value || 0)}{' '}
                    {unit.find(f => f.value === item.areage.unitId)?.label}
                  </Text>
                  <Text style={[styleSheet.textStyleBasic, {fontSize: 10}]}>
                    {item.formOfUsesIds.length
                      ? formOfUses.find(f => f.value === item.formOfUsesIds[0])
                          ?.label
                      : t('no_data')}
                  </Text>
                </View>
              </View>
            </View>
          )}
          <AntDesign name="right" size={20} color={Colors.BLACK} />
        </TouchableOpacity>
      </SwipeableView>
    );
  };

  const handleSubmit = () => {
    const farmBody: FARM.Request.Farm = {
      ...value,
      certifycateOfLands: listLandCertificateRedux,
    };
    setloading(true);
    createAndUpdateFarm(farmBody)
      .then(res => {
        dispatch(clearFarmFlow());
        if (farmBody.id)
          RootNavigation.navigate(SCREEN_NAME.FARM, {refresh: true});
        else {
          saveValue({}, 10);
        }
      })
      .catch(err => {
        setloading(false);
        console.log(err);
      });
  };

  return (
    <AppContainer
      title={t('GCN2')}
      headerRight={
        !value.id ? (
          <TouchableOpacity
            onPress={() => {
              alertPopup(
                formType,
                {certifycateOfLands: listLandCertificateRedux},
                true,
                9,
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
          <StepButtonSingle
            loading={loading}
            title="finish"
            subTitile={t('addFarm12Info')}
            disableLeft={false}
            onPressRight={() =>
              value.id
                ? UpdateValue({certifycateOfLands: listLandCertificateRedux})
                : handleSubmit()
            }
          />
        }>
        <FlatList
          contentContainerStyle={{paddingBottom: 20}}
          scrollEnabled={false}
          data={listLandCertificateRedux}
          renderItem={renderItem}
          ListFooterComponent={
            <TouchableOpacity style={styles.button} onPress={toAddCertificate}>
              <Text style={styles.filedText}>{t('addGCNQSDD')}</Text>
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
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 15,
    flex: 1,
  },
  filedText: {
    ...styleSheet.textStyleBasic,
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
  button: {
    ...styleSheet.filedText,
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rightView: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    borderRadius: 8,
  },
  gcnCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.GRAY_02,
    padding: 10,
    ...styleSheet.listSpace,
  },
  textCancle: {
    ...styleSheet.textStyleBold,
    fontSize: 16,
    color: Colors.CANCLE_BUTTON,
  },
});

export default Step10;
