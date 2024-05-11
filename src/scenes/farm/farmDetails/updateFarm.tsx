import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppContainer, ImageUpload, Spiner} from 'src/components/organisms';
import {useTranslation} from 'react-i18next';
import {Colors} from 'src/styles';
import {SCREEN} from 'src/help';
import {styleSheet} from 'src/styles/styleSheet';
import ItemBox from '../components/itemBox';
import {useDispatch, useSelector} from 'react-redux';
import {clearFarmFlow, saveFarmFlow} from 'src/state/reducers/farm/farmSlice';
import * as RootNavigation from 'src/navigations/root-navigator';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import {RootState} from 'src/state/store';
import {
  createAndUpdateFarm,
  deleteCertificationLand,
} from 'src/api/farm/actions';
import {getUnit} from 'src/api/appData/actions';
import {Formik} from 'formik';
import * as Yup from 'yup';
import CustomModal from 'src/components/organisms/ui/modals/Modal';
import IconAnt from 'react-native-vector-icons/AntDesign';
import {formatDecimal} from 'src/help/formatDecimal';
import {FARM} from 'src/api/farm/type.d';
import IconFigma from 'src/components/organisms/ui/Image/IconFigma';
import MainContentView from './mainContentView';

type Props = {};

type itemType = {
  title: string;
  icon: React.ReactNode;
  require?: boolean;
  id: number;
  data: any[];
  handlePress?: () => void;
};
const UpdateFarm = (props: Props) => {
  const farmBody = useSelector(
    (state: RootState) => state.farmReducer.farmBody,
  );
  const deleteCertification = useSelector(
    (state: RootState) => state.farmReducer.certificationOfLandDelete,
  );
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [units, setUnits] = useState<{id: number; shortName: string}[]>([]);
  const [units2, setUnits2] = useState<{id: number; shortName: string}[]>([]);
  const [dirty, setDirty] = useState<boolean>();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handlePress = (step: number) => {
    dispatch(saveFarmFlow({farmBody: farmBody, step: step}));
    RootNavigation.navigate(SCREEN_NAME.ADD_FARM, {type: 'UPDATE', step: step});
  };

  useEffect(() => {
    if (dirty === undefined) {
      setDirty(false);
    } else {
      if (dirty === false) setDirty(true);
    }
  }, [farmBody]);

  useEffect(() => {
    getUnit('ACREAGE')
      .then(res => {
        setUnits(res);
      })
      .catch(err => console.log(err));
  }, []);
  useEffect(() => {
    getUnit('MASS')
      .then(res => {
        setUnits2(res);
      })
      .catch(err => console.log(err));
  }, []);

  const item: itemType[] = [
    // {
    //   id: 0,
    //   data: farmBody.businessTypesIds,
    //   title: t('farmMethod'),
    //   icon: <IconFigma name="cropsShovel" size={21} />,
    //   require: true,
    //   handlePress: () => handlePress(3),
    // },
    {
      id: 1,
      data: farmBody.products,
      title: t('typeTree'),
      icon: <IconFigma name="crops" size={21} />,
      require: true,
      handlePress: () => handlePress(3),
    },
    {
      id: 2,
      data: farmBody.products.some(
        s => s.grossAreas.value && s.grossAreas.value !== 0,
      )
        ? [farmBody.products]
        : [],
      title: t('cultivatedArea'),
      icon: <IconFigma name="area" size={17} />,
      handlePress: () => {
        if (farmBody.products.length === 0)
          Alert.alert(
            t('not_yet_crops'),
            t(
              'you_must_add_crops_before_update_production_capacity',
            ).toString(),
            [
              {
                text: t('confirm').toString(),
                style: 'default',
                onPress: () => handlePress(4),
              },
              {
                text: t('cancel').toString(),
                style: 'destructive',
                onPress: () => {},
              },
            ],
          );
        else handlePress(4);
      },
    },
    {
      id: 3,
      data: farmBody.products.some(
        s => s.grossProductivities.value && s.grossProductivities.value !== 0,
      )
        ? [farmBody.products]
        : [],
      title: t('productionCapacity'),
      icon: <IconFigma name="shovel" size={24} />,

      handlePress: () => {
        if (farmBody.products.length === 0)
          Alert.alert(
            t('not_yet_crops'),
            t(
              'you_must_add_crops_before_update_production_capacity',
            ).toString(),
            [
              {
                text: t('confirm').toString(),
                style: 'default',
                onPress: () => handlePress(4),
              },
              {
                text: t('cancel').toString(),
                style: 'destructive',
                onPress: () => {},
              },
            ],
          );
        else handlePress(5);
      },
    },
    {
      id: 4,
      data: farmBody.products.some(
        s => s.farmingSeasonNumber && s.farmingSeasonNumber !== 0,
      )
        ? [farmBody.products]
        : [],
      title: t('seasonNumber'),
      icon: <IconFigma name="seasonSelected" size={24} />,
      handlePress: () => {
        if (farmBody.products.length === 0)
          Alert.alert(
            t('not_yet_crops'),
            t('you_must_add_crops_before_update_season_number').toString(),
            [
              {
                text: t('confirm').toString(),
                style: 'default',
                onPress: () => handlePress(4),
              },
              {
                text: t('cancel').toString(),
                style: 'destructive',
                onPress: () => {},
              },
            ],
          );
        else handlePress(6);
      },
    },
    {
      id: 5,
      data: farmBody.consumptionMarket,
      title: t('market'),
      icon: <IconFigma name="market" size={24} />,
      handlePress: () => handlePress(7),
    },
    {
      id: 6,
      data: farmBody.certifications,
      title: t('GCNs'),
      icon: <IconFigma name="papers" size={24} />,
      handlePress: () => handlePress(8),
    },
    {
      id: 7,
      data: farmBody.certifycateOfLands,
      title: t('GCNLands'),
      icon: <IconFigma name="GCN" size={24} />,
      handlePress: () => handlePress(9),
    },
    {
      id: 8,
      data: farmBody.address ? [farmBody.address] : [],
      title: t('address'),
      require: true,
      icon: <IconFigma name="map" size={17} />,
      handlePress: () => handlePress(1),
    },
    {
      id: 9,
      data: farmBody.phone ? [farmBody.phone] : [],
      title: t('phone_number'),
      icon: <IconFigma name="phone" size={17} />,
      handlePress: () => handlePress(0),
    },
  ];

  const renderItem = ({
    item,
    index,
  }: {
    item: FARM.Basic.FarmProductType;
    index: number;
  }) => {
    return (
      <View
        style={{
          borderTopColor: Colors.GRAY_02,
          borderTopWidth: index === 0 ? 0 : 0.5,
          paddingVertical: 20,
        }}>
        <View style={[styleSheet.row]}>
          <Text
            style={[
              styleSheet.textStyleBold,
              {color: Colors.BLACK, fontSize: 14},
            ]}>
            {item?.productType?.name || ''}
          </Text>
        </View>
        <View
          style={[
            styleSheet.row,
            {marginTop: 10, justifyContent: 'space-between'},
          ]}>
          <Text
            style={[
              styleSheet.textStyleBasic,
              {width: '50%', color: Colors.GRAY_DARK},
            ]}>
            {t('grossAreas')}:
          </Text>
          {item?.grossAreas?.value ? (
            <Text style={styleSheet.textStyleBasic}>
              {formatDecimal(item?.grossAreas?.value) +
                ' ' +
                units.find(f => f.id === Number(item?.grossAreas?.unitId))
                  ?.shortName}
            </Text>
          ) : (
            <Text
              style={[
                styleSheet.textStyleBasic,
                {color: Colors.GRAY_04, fontStyle: 'italic'},
              ]}>
              {t('no_data')}
            </Text>
          )}
        </View>
        <View
          style={[
            styleSheet.row,
            {marginTop: 10, justifyContent: 'space-between'},
          ]}>
          <Text
            style={[
              styleSheet.textStyleBasic,
              {
                width: '50%',
                color: Colors.GRAY_DARK,
                height: '100%',
              },
            ]}>
            {t('grossProductivities')}:
          </Text>
          {item?.grossProductivities?.value ? (
            <Text
              style={[
                styleSheet.textStyleBasic,
                {flexWrap: 'wrap', width: '50%', textAlign: 'right'},
              ]}>
              {formatDecimal(item?.grossProductivities?.value) +
                ' ' +
                units2.find(
                  f => f.id === Number(item.grossProductivities.unitId),
                )?.shortName +
                '/' +
                t('YEAR')}
            </Text>
          ) : (
            <Text
              style={[
                styleSheet.textStyleBasic,
                {color: Colors.GRAY_04, fontStyle: 'italic'},
              ]}>
              {t('no_data')}
            </Text>
          )}
        </View>

        <View
          style={[
            styleSheet.row,
            {
              marginTop: 10,
              justifyContent: 'space-between',
            },
          ]}>
          <Text
            style={[
              styleSheet.textStyleBasic,
              {width: '50%', color: Colors.GRAY_DARK},
            ]}>
            {t('farmingSeasonNumber')}:
          </Text>
          {item?.farmingSeasonNumber ? (
            <Text style={styleSheet.textStyleBasic}>
              {item?.farmingSeasonNumber}
            </Text>
          ) : (
            <Text
              style={[
                styleSheet.textStyleBasic,
                {color: Colors.GRAY_04, fontStyle: 'italic'},
              ]}>
              {t('no_data')}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const handleDeleteCertificationLands = async (landIds: number[]) => {
    landIds.map(async m => {
      farmBody.id &&
        (await deleteCertificationLand({
          farmId: farmBody.id,
          certificationId: m,
        }));
    });
  };

  const Schema = Yup.object().shape({
    // name: Yup.string().required(t('required_field').toString()),
  });
  return (
    <AppContainer
      title={t('update_farm_infor')}
      onGoBack={() => {
        if (dirty) {
          Alert.alert(t('confirm_cancel'), t('confirm_cancel_des').toString(), [
            {
              text: t('confirm').toString(),
              style: 'default',
              onPress: () => {
                dispatch(clearFarmFlow());
                RootNavigation.goBack();
              },
            },
            {
              text: t('cancel').toString(),
              style: 'destructive',
              onPress: () => {},
            },
          ]);
        } else {
          dispatch(clearFarmFlow());
          RootNavigation.goBack();
        }
      }}
      headerRight={
        <TouchableOpacity
          disabled={loading}
          onPress={() => {
            if (farmBody.name && farmBody.address && farmBody.grossArea) {
              // console.log(farmBody.certifycateOfLands);
              setLoading(true);
              if (deleteCertification.length) {
                handleDeleteCertificationLands(deleteCertification)
                  .then(() => {
                    createAndUpdateFarm(farmBody)
                      .then(res => {
                        dispatch(clearFarmFlow());
                        RootNavigation.navigate(SCREEN_NAME.FARM);
                      })
                      .catch(err => {
                        setLoading(false);
                        console.log(err);
                      });
                  })
                  .catch(err => {
                    setLoading(false);
                  });
              } else {
                createAndUpdateFarm(farmBody)
                  .then(res => {
                    dispatch(clearFarmFlow());
                    RootNavigation.navigate(SCREEN_NAME.FARM);
                  })
                  .catch(err => {
                    setLoading(false);
                    console.log(err);
                  });
              }
            }
          }}>
          <Text style={styleSheet.linkTextStyle}>{t('save')}</Text>
        </TouchableOpacity>
      }>
      <Formik
        initialValues={farmBody}
        validationSchema={Schema}
        onSubmit={values => {
          if (
            farmBody.businessTypesIds.length &&
            farmBody.name &&
            farmBody.address &&
            farmBody.grossArea
          ) {
            setLoading(true);
            createAndUpdateFarm(farmBody)
              .then(res => {
                dispatch(clearFarmFlow());
                RootNavigation.navigate(SCREEN_NAME.FARM);
              })
              .catch(err => console.log(err))
              .finally(() => setLoading(false));
          }
        }}>
        {({errors, touched, handleSubmit, handleChange}) => (
          <>
            <Spiner loading={loading} />
            <ScrollView
              style={styles.container}
              contentContainerStyle={{alignItems: 'center'}}
              // stickyHeaderIndices={[1]}
            >
              {/* <TouchableOpacity onPress={() => handlePress(0)}> */}
              <ImageUpload
                positionButton={{top: 10, right: 30}}
                defaultUri={farmBody?.avatar || undefined}
                shape="square"
                width={SCREEN.width + 40}
                height={200}
                onChange={(uri: string) =>
                  dispatch(
                    saveFarmFlow({
                      farmBody: {...farmBody, avatar: uri},
                      step: 0,
                    }),
                  )
                }
              />
              <MainContentView
                formType="UPDATE"
                farmDetails={farmBody}
                units={units}
                units2={units2}
              />
              <View style={styles.scrollItem}>
                <View style={styles.itemList}>
                  {item.map((m: itemType, index: number) => {
                    return <ItemBox key={index} {...m} />;
                  })}
                </View>
              </View>
              <CustomModal isVisible={isVisible} setIsVisible={setIsVisible}>
                <View style={styles.modal}>
                  <View style={styles.containerModal}>
                    <View
                      style={{
                        height: 60,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        paddingHorizontal: 20,
                        borderBottomColor: Colors.GRAY_LINE,
                        borderBottomWidth: 1,
                      }}>
                      <IconAnt name="close" size={17} color={Colors.WHITE} />
                      <Text style={[styleSheet.textStyleBold, {fontSize: 16}]}>
                        {t('productionCapacity')}
                      </Text>
                      <TouchableOpacity onPress={() => setIsVisible(false)}>
                        <IconAnt
                          name="close"
                          size={20}
                          color={Colors.BLACK_03}
                        />
                      </TouchableOpacity>
                    </View>
                    <FlatList
                      data={farmBody.products || []}
                      renderItem={renderItem}
                      contentContainerStyle={{paddingHorizontal: 20}}
                    />
                  </View>
                </View>
              </CustomModal>
            </ScrollView>
          </>
        )}
      </Formik>
    </AppContainer>
  );
};

export default UpdateFarm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    // alignItems: 'center',
    height: '100%',
  },
  mainImage: {
    height: 200,
    width: SCREEN.width,
    backgroundColor: Colors.GRAY_LIGHT,
  },
  mainInfoView: {
    width: SCREEN.width - 60,
    borderRadius: 8,
    backgroundColor: Colors.WHITE,
    ...styleSheet.shadown,
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: -50,
  },
  fontSizeInfoTitle: {
    ...styleSheet.textStyleBasic,
    width: '50%',
    fontSize: 12,
    textAlignVertical: 'top',
  },
  fontSizeInfo: {
    ...styleSheet.textStyleBasic,
    fontSize: 12,
  },
  imageInfo: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: Colors.GRAY_LIGHT,
  },
  itemList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  scrollItem: {
    marginTop: 20,
    flex: 1,
  },
  icon: {
    height: 13,
    width: 13,
  },
  modal: {
    height: '100%',
    width: '100%',
    justifyContent: 'space-between',
    // backgroundColor: Colors.WHITE,
  },
  button: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'flex-end',
    width: '100%',
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
    marginTop: 10,
  },
  containerModal: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
