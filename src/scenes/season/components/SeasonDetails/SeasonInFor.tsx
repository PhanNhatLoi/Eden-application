import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Background} from 'src/components/molecules';
import {styleSheet} from 'src/styles/styleSheet';
import {Colors} from 'src/styles';
import {RenderStatusSeaSon} from 'src/api/appData/type';
import {RouteProp} from '@react-navigation/native';
import {
  DeleteSeason,
  getCertificateOfLands,
  getFarmingSeason,
} from 'src/api/season/actions';
import {getFarmDetails, getFarmList} from 'src/api/farm/actions';
import {FARM} from 'src/api/farm/type.d';
import {SEASON} from 'src/api/season/type.d';
import {Spiner} from 'src/components/organisms';
import {useTranslation} from 'react-i18next';
import SpinButton from 'src/components/organisms/buttons/SpinButton';
import * as Styles from './styles';
import {Hr} from './styles';
import * as RootNavigator from 'src/navigations/root-navigator';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import {getUnit, getUnitMass} from 'src/api/appData/actions';
import {OptionType} from 'src/api/appData/type';
import {convertSeason} from 'src/api/season/convert';
import {useSelector} from 'react-redux';
import {RootState} from 'src/state/store';
import {formatDecimal} from 'src/help/formatDecimal';
import IconAwesome from 'react-native-vector-icons/FontAwesome';
import IconFigma from 'src/components/organisms/ui/Image/IconFigma';
import {SCREEN} from 'src/help';
import * as RootNavigation from 'src/navigations/root-navigator';

type Props = {
  route?: RouteProp<{params: {id: number; farmId: number}}>;
};

const {styles} = Styles;

const SeasonInFor = (props: Props) => {
  const id = props.route?.params.id;
  const farmId = props.route?.params.farmId;
  const {t} = useTranslation();
  const [seasonDetails, setSeasonDetails] =
    React.useState<SEASON.Response.SeasonDetails>();
  const [farmList, setFarmlist] = React.useState<FARM.Response.FarmGetList[]>(
    [],
  );
  const sysAccountId = useSelector(
    (state: RootState) => state.authReducer.sysAccountIdOwer || null,
  );
  const [unitMass, setUnitMass] = useState<OptionType[]>([]);
  const [unitArea, setUnitArea] = useState<OptionType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [logo, setLogo] = useState<string>('');
  const [certificateOfLands, setCertificateOfLands] = React.useState<
    SEASON.Response.CertificateOfLands[]
  >([]);
  const role = useSelector((state: RootState) => state.authReducer.role);
  //fetch value details
  React.useEffect(() => {
    if (id) {
      setLoading(true);
      getFarmingSeason(id)
        .then((res: SEASON.Response.SeasonDetails) => {
          setSeasonDetails(res);
        })
        .catch(err => {
          RootNavigator.goBack();
          console.log(err);
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false);
          }, 500);
        });
    }
  }, [id]);

  // get farm list, units for show text name follow id
  React.useEffect(() => {
    getFarmList({sysAccountId: sysAccountId})
      .then((res: FARM.Response.FarmGetList[]) => {
        setFarmlist(res);
      })
      .catch(err => console.log(err));
    getUnitMass()
      .then(res => {
        setUnitMass(() => {
          return res.map((m: any) => {
            return {
              value: m.id,
              label: m.shortName,
            };
          });
        });
      })
      .catch(err => console.log(err));
    getUnit('ACREAGE')
      .then(res => {
        setUnitArea(() => {
          return res.map((m: any) => {
            return {
              value: m.id,
              label: m.shortName,
            };
          });
        });
      })
      .catch(err => console.log(err));
  }, []);

  //fetch list certificate lands for view text name follow certificateOflandsId
  React.useEffect(() => {
    if (farmId) {
      getCertificateOfLands(farmId)
        .then((res: SEASON.Response.CertificateOfLands[]) => {
          setCertificateOfLands(res);
        })
        .catch(err => console.log(err));

      getFarmDetails(farmId, sysAccountId)
        .then(res => {
          setLogo(res.avatar);
        })
        .catch(err => console.log(err));
    }
  }, [farmId]);

  return (
    <>
      <View
        style={{
          position: 'absolute',
          top: 0,
          height: SCREEN.height,
          width: '100%',
        }}>
        <Background />
      </View>
      <Spiner opacity={1} loading={loading} />
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{seasonDetails?.name}</Text>
        <View>
          <TouchableOpacity
            disabled={
              !(
                role === 'FARMER' && seasonDetails?.seasonStatus !== 'HARVESTED'
              )
            }
            style={styles.row}
            onPress={() => {
              RootNavigator.navigate(SCREEN_NAME.ADD_SEASON, {
                data: seasonDetails && convertSeason(seasonDetails),
                step: 6,
              });
            }}>
            <Text
              style={{
                ...styleSheet.textStyleBold,
                color: Colors.SYS_BUTTON,
              }}>
              {farmList &&
                farmList.find(f => f.id === seasonDetails?.farmId)?.name}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={[styleSheet.textStyleBold, {fontSize: 12}]}>
                {seasonDetails &&
                  RenderStatusSeaSon(seasonDetails?.seasonStatus)}
              </Text>
              {role === 'FARMER' &&
                seasonDetails?.seasonStatus !== 'HARVESTED' && (
                  <IconAwesome
                    name="pencil"
                    size={12}
                    color={Colors.BLACK}
                    style={{marginLeft: 5, justifyContent: 'flex-end'}}
                  />
                )}
            </View>
          </TouchableOpacity>
          <View style={styles.row}>
            <Text style={styles.textKey}>{t('sowingDate')} :</Text>
            <Text style={styles.textValue}>
              {seasonDetails?.sowingDate
                ? new Date(
                    seasonDetails?.sowingDate.toString(),
                  ).toLocaleDateString('vi-VN')
                : '-'}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.textKey}>{t('expectedHarvestDate')} :</Text>
            <Text style={styles.textValue}>
              {seasonDetails?.harvestDate
                ? new Date(
                    seasonDetails?.harvestDate.toString(),
                  ).toLocaleDateString('vi-VN')
                : '-'}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.textKey}>{t('totalCultivatedArea')}:</Text>
            <Text style={styles.textValue}>{`${formatDecimal(
              seasonDetails?.grossArea?.value || 0,
            )} ${
              unitArea.find(f => f.value === seasonDetails?.grossArea.unitId)
                ?.label
            }`}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.textKey}>{t('harvesYield')} :</Text>
            <Text style={styles.textValue}>{`${formatDecimal(
              seasonDetails?.grossYield?.value || 0,
            )} ${
              unitMass.find(f => f.value === seasonDetails?.grossYield.unitId)
                ?.label
            }`}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.textKey}>{t('harvesYield_today')} :</Text>
            <Text style={styles.textValue}>{`${formatDecimal(
              seasonDetails?.grossYieldToday?.value || 0,
            )} ${
              unitMass.find(
                f => f.value === seasonDetails?.grossYieldToday?.unitId,
              )?.label
            }`}</Text>
          </View>
        </View>

        <View>
          <Hr />
          <View style={{flexDirection: 'row', marginBottom: 10}}>
            <IconFigma name="crops" />
            <Text
              style={{
                ...styles.title,
                color: Colors.SYS_BUTTON,
                marginLeft: 5.5,
              }}>
              {t('crops')}
            </Text>
          </View>
          <Text style={[styles.title, {fontSize: 13}]}>
            {seasonDetails?.productsOfFarm?.name}
          </Text>
          <View style={styles.row}>
            <Text style={styles.textKey}>{t('cultivatedArea')} :</Text>
            <Text style={styles.textValue}>
              {`${formatDecimal(seasonDetails?.grossArea?.value || 0)} ${
                unitArea.find(f => f.value === seasonDetails?.grossArea.unitId)
                  ?.label
              }`}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.textKey}>{t('certificateOfLands')} :</Text>
            <Text style={styles.textValue}>
              {(seasonDetails &&
                certificateOfLands.length &&
                certificateOfLands.find(
                  f => f.id === seasonDetails?.certifycateOfLandIds[0],
                )?.landLotNo) ||
                t('no_data')}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.textKey}>{t('expectedOutput')} :</Text>
            <Text style={styles.textValue}>{`${formatDecimal(
              seasonDetails?.grossYield?.value || 0,
            )} ${
              unitMass.find(f => f.value === seasonDetails?.grossYield.unitId)
                ?.label
            }`}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.textKey}>{t('farmMethod')} :</Text>
            <Text style={styles.textValue}>
              {seasonDetails?.businessType?.name || t('no_data')}
            </Text>
          </View>
        </View>
        {seasonDetails?.seasonProcesses &&
          seasonDetails?.seasonProcesses.length > 0 && (
            <View>
              <Hr />
              <View style={{flexDirection: 'row'}}>
                <IconFigma name="shovel" />
                <Text
                  style={{
                    ...styles.title,
                    color: Colors.SYS_BUTTON,
                    marginLeft: 5.5,
                  }}>
                  {t('process')}
                </Text>
              </View>
              {seasonDetails?.seasonProcesses.map((m, i) => {
                return (
                  <View key={i}>
                    <Text style={styles.title}>
                      {seasonDetails?.seasonProcesses[i].name}
                    </Text>
                    <View style={styles.row}>
                      <Text style={styles.textKey}>{t('started_date')} :</Text>
                      <Text style={styles.textValue}>
                        {seasonDetails?.sowingDate
                          ? new Date(
                              seasonDetails?.seasonProcesses[
                                i
                              ].startDate.toString(),
                            ).toLocaleDateString('vi-VN')
                          : '-'}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        {seasonDetails?.materials && seasonDetails?.materials.length > 0 && (
          <View>
            <Hr />
            <View style={{flexDirection: 'row', marginBottom: 10}}>
              <IconFigma name="supplies" />
              <Text
                style={{
                  ...styles.title,
                  color: Colors.SYS_BUTTON,
                  marginLeft: 5.5,
                }}>
                {t('supplies')}
              </Text>
            </View>
            {seasonDetails?.materials?.map((m, i) => {
              return (
                <View key={i}>
                  <Text style={[styles.title, {fontSize: 13}]}>
                    {m.materialText}
                  </Text>
                  <View style={styles.row}>
                    <Text style={styles.textKey}>{t('expectedNumber')} :</Text>
                    <Text style={styles.textValue}>
                      {formatDecimal(m.quantity)} {m.unitNameOther}
                    </Text>
                  </View>
                  <Hr />
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          paddingHorizontal: 20,
          justifyContent: 'space-between',
        }}>
        {role === 'FARMER' && seasonDetails?.seasonStatus !== 'HARVESTED' && (
          <View style={{flex: 1, marginRight: 5}}>
            <SpinButton
              isLoading={false}
              title={t('update_infor')}
              buttonProps={{
                onPress: () => {
                  if (seasonDetails) {
                    const season: SEASON.Request.Season =
                      convertSeason(seasonDetails);
                    RootNavigator.navigate(SCREEN_NAME.ADD_SEASON, {
                      data: season,
                      step: 1,
                    });
                  }
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
        )}

        {role === 'FARMER' && (
          <View style={{flex: 1, marginLeft: 5}}>
            <SpinButton
              isLoading={false}
              title={t('scanQR')}
              buttonProps={{
                onPress: () => {
                  RootNavigation.navigate(SCREEN_NAME.SHARE_SEASON, {
                    farmingSeasonId: seasonDetails?.id,
                    logo: logo,
                  });
                },
                style: {
                  ...styleSheet.buttonPrimaryStyle,
                  backgroundColor: Colors.WHITE,
                  borderColor: Colors.PRIMARY,
                  borderWidth: 1,
                },
              }}
              titleProps={{
                style: {
                  ...styleSheet.textStyleBasic,
                  color: Colors.PRIMARY,
                },
              }}
            />
          </View>
        )}
      </View>
    </>
  );
};

export default SeasonInFor;
