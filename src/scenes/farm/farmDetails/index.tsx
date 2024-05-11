/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageURISource,
  Platform,
  FlatList,
  Alert,
  Linking,
} from 'react-native';
import {Colors} from 'src/styles';
import {AppContainer} from 'src/components/organisms';
import {useTranslation} from 'react-i18next';
import {deleteFarm, getFarmDetails} from 'src/api/farm/actions';
import {useState, useEffect} from 'react';
import {FARM} from 'src/api/farm/type.d';
import {SCREEN} from 'src/help';
import {styleSheet} from 'src/styles/styleSheet';
import {InfoLine, Line} from 'src/components/molecules';
import {} from 'react-native-gesture-handler';
import * as RootNavigation from 'src/navigations/root-navigator';
import {useDispatch, useSelector} from 'react-redux';
import ImageUri from 'src/components/organisms/ui/Image/ImageUri';
import {ICON} from 'src/assets';
import CustomModal from 'src/components/organisms/ui/modals/Modal';
import {getUnit} from 'src/api/appData/actions';
import {RootState} from 'src/state/store';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {convertFarmRequest} from 'src/api/farm/convert';
import {saveFarmFlow} from 'src/state/reducers/farm/farmSlice';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import {formatPhoneNumner} from 'src/help/formatPhone';
import {formatDecimal} from 'src/help/formatDecimal';
import IconAwesome from 'react-native-vector-icons/FontAwesome';
import openMap from 'react-native-open-maps';
import Geolocation from '@react-native-community/geolocation';
import MainContentView from './mainContentView';
type AddFarmProps = {
  route: {
    params: {
      farmId: number;
    };
  };
};
const FarmDetails = (props: AddFarmProps) => {
  const {t} = useTranslation();
  const {params} = props.route;
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [farmDetails, setFarmDetails] = useState<FARM.Response.FarmDetails>();
  const role = useSelector((state: RootState) => state.authReducer.role);
  const [selectDropdown, setSelectDropdown] = useState<boolean>(false);
  const sysAccountId = useSelector(
    (state: RootState) => state.authReducer.sysAccountIdOwer || null,
  );

  useEffect(() => {
    fetchFarmInfo();
  }, [params.farmId]);

  const fetchFarmInfo = async () => {
    try {
      setIsLoading(true);

      const res: FARM.Response.FarmDetails = await getFarmDetails(
        params.farmId,
        sysAccountId,
      );
      setFarmDetails(res);
    } catch (error) {
      console.log('🚀 ~ file: index.tsx:74 ~ fetchFarmDetails ~ error:', error);
      RootNavigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContainer
      title={t('farmDetails')}
      headerRight={
        role === 'FARMER' && (
          <TouchableOpacity
            style={{
              height: 60,
              justifyContent: 'center',
            }}
            onPress={() => {
              setSelectDropdown(true);
            }}>
            <IconMaterialIcons
              name="more-horiz"
              size={20}
              color={Colors.GRAY_DARK}
            />
          </TouchableOpacity>
        )
      }>
      <>
        {farmDetails && <FarmDetailsView farmDetails={farmDetails} />}
        <CustomModal
          isVisible={selectDropdown}
          setIsVisible={setSelectDropdown}
          onBackdropPressOnclose
          justifyContent="flex-end"
          backdropOpacity={0.3}>
          <>
            <View
              style={{
                height: 120,
                backgroundColor: Colors.WHITE,
                borderRadius: 8,
              }}>
              <TouchableOpacity
                onPress={() => {
                  if (farmDetails) {
                    setSelectDropdown(false);
                    const body: FARM.Request.Farm =
                      convertFarmRequest(farmDetails);
                    dispatch(saveFarmFlow({farmBody: body, step: 0}));
                    RootNavigation.navigate(SCREEN_NAME.UPDATE_FARM);
                  }
                }}
                style={[styles.buttonModal]}>
                <Text
                  style={[
                    styleSheet.textStyleBold,
                    {color: Colors.SYS_BUTTON, fontSize: 16},
                  ]}>
                  {t('edit')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={isLoading}
                style={[styles.buttonModal]}
                onPress={() => {
                  //on press delete farm
                  Alert.alert(
                    t('confirm_delete_farm'),
                    t('confirm_delete_farm_des').toString(),
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
                          //todo delete api
                          setIsLoading(true);
                          deleteFarm(params.farmId)
                            .then(() => {
                              setSelectDropdown(false);
                              RootNavigation.goBack();
                            })
                            .catch(err => console.log(err))
                            .finally(() => {
                              setIsLoading(false);
                            });
                        },
                      },
                    ],
                  );
                }}>
                <Text
                  style={[
                    styleSheet.textStyleBold,
                    {color: Colors.CANCLE_BUTTON, fontSize: 16},
                  ]}>
                  {t('delete')}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginTop: 10,
                backgroundColor: Colors.WHITE,
                borderRadius: 8,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setSelectDropdown(false);
                }}
                style={[
                  styles.buttonModal,
                  {
                    marginTop: 5,
                  },
                ]}>
                <Text
                  style={[
                    styleSheet.textStyleBold,
                    {color: Colors.BLACK, fontSize: 16},
                  ]}>
                  {t('close')}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        </CustomModal>
      </>
    </AppContainer>
  );
};
const styles = StyleSheet.create({
  buttonModal: {
    width: '100%',
    borderRadius: 8,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: Colors.GRAY_03,
    borderBottomWidth: 0.5,
  },
  containerEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    marginBottom: Platform.OS === 'android' ? 10 : 0,
  },
  mainImage: {
    height: 200,
    width: SCREEN.width,
    backgroundColor: Colors.WHITE,
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
  fontSizeInfo: {
    ...styleSheet.textStyleBasic,
    fontSize: 12,
  },
  imageInfo: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: Colors.WHITE,
  },
  modal: {
    height: '100%',
    width: '100%',
    justifyContent: 'space-between',
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
    // paddingHorizontal: 20,
    // paddingVertical: 10,
  },
});

export default FarmDetails;

const FarmDetailsView = ({
  farmDetails,
}: {
  farmDetails?: FARM.Response.FarmDetails;
}) => {
  const {t} = useTranslation();
  const fullAddress = [
    farmDetails?.address?.address1,
    farmDetails?.address?.address2,
    farmDetails?.address?.wards?.name,
    farmDetails?.address?.district?.name,
    farmDetails?.address?.province?.name,
  ].filter(n => n);
  // const farmMethod = farmDetails?.businessTypes.map(o => o.name).filter(n => n);
  const farmTrees = farmDetails?.products
    .map(o => o.productType.name)
    .filter(n => n);
  const markets = farmDetails?.consumptionMarket
    ? farmDetails?.consumptionMarket.map(o => o?.name).filter(n => n)
    : [];
  const [units, setUnits] = useState<{id: number; shortName: string}[]>([]);
  const [units2, setUnits2] = useState<{id: number; shortName: string}[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.04,
    longitudeDelta: 0.05,
  });

  //get currentposion in first open app
  const getCurrentPosistion = () => {
    Geolocation.getCurrentPosition(
      async position => {
        setRegion({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.05,
        });
      },
      error => {
        console.log('🚀 ~ file: ~ line 74 ~ getLocation ~ error', error);
      },
      {timeout: 15000, maximumAge: 2000, enableHighAccuracy: true},
    );
  };

  useEffect(() => {
    getUnit('ACREAGE')
      .then(res => {
        setUnits(res);
      })
      .catch(err => console.log(err))
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 700);
      });
  }, []);
  useEffect(() => {
    getUnit('MASS')
      .then(res => {
        setUnits2(res);
      })
      .catch(err => console.log(err));
    getCurrentPosistion();
  }, []);

  return loading ? (
    <View style={{height: '100%', justifyContent: 'center'}}>
      <ActivityIndicator color={Colors.SYS_BUTTON} size={25} />
    </View>
  ) : (
    <ScrollView
      contentContainerStyle={{
        alignItems: 'center',
      }}>
      <ImageUri
        supportViewFullSise
        uri={farmDetails?.avatar}
        style={styles.mainImage}
      />

      <MainContentView
        formType="VIEW"
        farmDetails={farmDetails}
        units={units}
        units2={units2}
      />
      <View style={{marginTop: 30}}>
        <TouchableOpacity
          onPress={() => {
            openMap({
              latitude: Number(farmDetails?.address?.lat) || 0,
              longitude: Number(farmDetails?.address?.lng) || 0,
              provider: 'google',
              waypoints: [],
              start: `${Number(region.latitude)},${Number(region.longitude)}`,
              end: `${Number(farmDetails?.address?.lat)},${Number(
                farmDetails?.address?.lng,
              )}`,
            });
          }}>
          <InfoLine
            title={t('address')}
            icon={
              <Image
                source={ICON['map']}
                style={{height: 11.72, width: 11.88}}
              />
            }
            info={fullAddress.join(', ')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!farmDetails?.phone}
          onPress={() => {
            let phoneNumber = '';

            if (Platform.OS === 'android') {
              phoneNumber = `tel:${farmDetails?.phone}`;
            } else {
              phoneNumber = `telprompt:${farmDetails?.phone}`;
            }

            Linking.openURL(phoneNumber)
              .then(res => {})
              .catch(err => console.log(err));
          }}>
          <InfoLine
            title={t('phone_number')}
            info={
              farmDetails?.phone && formatPhoneNumner(farmDetails?.phone).label
            }
            icon={
              <IconAwesome name="phone" size={15} color={Colors.SYS_DETAILS} />
            }
          />
        </TouchableOpacity>
        {/* <Line colors={Colors.GRAY_LINE} /> */}
        {/* <InfoLine title={t('farmMethod')} info={farmMethod?.join(', ')} /> */}
        <InfoLine title={t('typeTree')} info={farmTrees?.join(', ')} />
        <InfoLine title={t('market')} info={markets?.join(', ')} />
      </View>
      <View>
        {farmDetails?.certifications.map(obj => {
          return <CetificateView key={obj.id} certificate={obj} />;
        })}
      </View>
      <View>
        {farmDetails?.certifycateOfLands.map(obj => {
          return (
            <LandCetificateView key={obj.id} certificate={obj} units={units} />
          );
        })}
      </View>
    </ScrollView>
  );
};
const DateInfo = ({date, title}: {date: string | Date; title: string}) => {
  const {t} = useTranslation();
  const dateFormat: string =
    (date && new Date(date).toLocaleDateString('vi-VN')) ||
    t('no_data').toString();
  return (
    <View style={{width: (SCREEN.width - 40) / 2, marginBottom: 11}}>
      <Text style={[styleSheet.textStyleBasic, {fontSize: 12}]}>
        {dateFormat}
      </Text>
      <Text style={[styleSheet.textStyleSub, {fontSize: 12}]}>{title}</Text>
    </View>
  );
};
const DataInfo = ({data, title}: {data: string; title: string}) => {
  return (
    <View style={{width: (SCREEN.width - 40) / 2, marginBottom: 11}}>
      <Text style={[styleSheet.textStyleBasic, {fontSize: 12}]}>{data}</Text>
      <Text style={[styleSheet.textStyleSub, {fontSize: 12}]}>{title}</Text>
    </View>
  );
};
const CetificateView = ({
  certificate,
}: {
  certificate: FARM.Response.Certifications;
}) => {
  const {t} = useTranslation();
  const imageList =
    (certificate.images && certificate.images?.split('|')) || [];
  return (
    <View
      style={{width: SCREEN.width, paddingHorizontal: 20, paddingBottom: 10}}>
      <Line colors={Colors.GRAY_LIGHT} />
      <Text style={[styleSheet.textStyleBold, {marginBottom: 5}]}>
        {certificate?.type?.name}
      </Text>
      <InfoLine
        title={t('GCN')}
        info={`${t('granted_by')}: ${certificate.issuedBy}`}
      />
      <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
        <DateInfo date={certificate.issuedDate} title={t('dateProvider')} />
        <DateInfo date={certificate.expirationDate} title={t('dateExpire')} />
        <DateInfo date={certificate.evaluationDate} title={t('dateReview')} />
        <DateInfo
          date={certificate.reassessmentDate}
          title={t('dateReReview')}
        />
      </View>
      {imageList.length > 0 && (
        <FlatList
          data={imageList}
          horizontal
          style={{height: 90}}
          renderItem={({item, index}) => {
            return (
              <ImageUri
                supportViewFullSise
                style={styles.imageInfo}
                uri={item}
              />
            );
          }}
        />
      )}
    </View>
  );
};
const LandCetificateView = ({
  certificate,
  units,
}: {
  certificate: FARM.Response.CertifycateOfLands;
  units: {id: number; shortName: string}[];
}) => {
  const {t} = useTranslation();
  const imageList =
    (certificate.images?.length && certificate.images?.split('|')) || [];
  const formOfUse = certificate?.formOfUses
    ?.map(obj => obj.name)
    .filter(n => n);
  return (
    <View
      style={{width: SCREEN.width, paddingHorizontal: 20, paddingBottom: 10}}>
      <Line colors={Colors.GRAY_02} />

      <Text style={[styleSheet.textStyleBold, {marginBottom: 5}]}>
        {t('certificateOfLands')} {certificate?.landLotNo}
      </Text>
      <Text style={[styleSheet.textStyleSub, {fontSize: 12, marginBottom: 10}]}>
        {'GCN'} {certificate.type.name}
      </Text>
      {/* <InfoLine title={t('GCN2')} info={certificate.type.name} /> */}
      <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
        <DataInfo
          data={`${formatDecimal(certificate?.areage?.value)} ${
            units.find(f => certificate?.areage?.unitId)?.shortName || '0'
          }`}
          title={t('totalArea')}
        />
        {formOfUse.length > 0 && (
          <DataInfo data={formOfUse.join(', ')} title={t('landStatus')} />
        )}
        {certificate.ownerNameOther && (
          <DataInfo data={certificate.ownerNameOther} title={t('landOwner')} />
        )}
      </View>
      <ScrollView horizontal>
        {imageList.length > 0 &&
          imageList.map((obj, index) => {
            return (
              obj && (
                <View key={index} style={{}}>
                  <ImageUri
                    supportViewFullSise
                    style={styles.imageInfo}
                    key={obj}
                    uri={obj}
                  />

                  <Text
                    style={{
                      ...styleSheet.textStyleSub,
                      fontSize: 10,
                      width: 80,
                      textAlign: 'center',
                    }}
                    numberOfLines={2}>
                    {index === 0 && t('frontGCN')}
                    {index === 1 && t('backGCN')}
                    {index === 2 && t('selfieGCN')}
                    {index === 3 && t('otherGCN')}
                  </Text>
                </View>
              )
            );
          })}
      </ScrollView>
    </View>
  );
};
