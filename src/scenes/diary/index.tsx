import react, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {AppContainer, FieldSelect} from 'src/components/organisms';
import {Colors} from 'src/styles';
import {useTranslation} from 'react-i18next';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {styleSheet} from 'src/styles/styleSheet';
import {getSeasons} from 'src/api/season/actions';
import LogListView from './components/LogListView';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import Icon from 'react-native-vector-icons/Octicons';
import {getDiarys} from 'src/api/diary/actions';
import {DIARY} from 'src/api/diary/type.d';
import {SEASON} from 'src/api/season/type.d';
import {useSelector} from 'react-redux';
import {RootState} from 'src/state/store';
import {optionsType} from 'src/components/organisms/appForm/FieldDropDown';
import IconFigma from 'src/components/organisms/ui/Image/IconFigma';
import {getFarmList} from 'src/api/farm/actions';
import {FARM} from 'src/api/farm/type.d';
import {SCREEN} from 'src/help';

type Props = {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<{
    params: {farmingSeasonId?: number};
  }>;
};

const DiaryScreen = (props: Props) => {
  const {navigation} = props;
  const {params} = props.route;
  const [farmSeasonId, setFarmSeasonId] = useState<number | null>(
    params?.farmingSeasonId || null,
  );
  const [loadingListLog, setLoadingLisLog] = useState<boolean>(true);
  const [log, setLog] = useState<DIARY.Response.Diary[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [seasonList, setSeasonList] = useState<optionsType[]>([]);
  const [loadingSeason, setLoadingSeason] = useState<boolean>(true);
  const [refreshPage, setRefreshPage] = useState<boolean>(false);
  const {t} = useTranslation();
  const internetInfor = useSelector(
    (state: RootState) => state.notify.internet,
  );
  const sysAccountId = useSelector(
    (state: RootState) => state.authReducer.sysAccountIdOwer || null,
  );
  //event focus page
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', e => {
      setRefreshPage(true);
    });

    return unsubscribe;
  }, [props.navigation]);

  useEffect(() => {
    if (refreshPage) {
      fetchDataSeason();
    }
  }, [refreshPage]);

  //fetch Data list season
  const fetchDataSeason = () => {
    setLoadingSeason(true);
    if (internetInfor) {
      getFarmList({sysAccountId: sysAccountId})
        .then((farmRes: FARM.Response.FarmGetList[]) => {
          getSeasons({
            sysAccountId: sysAccountId,
            sort: 'lastModifiedDate,desc',
          })
            .then((res: SEASON.Response.SeasonDetails[]) => {
              setSeasonList(
                res.map((m: SEASON.Response.SeasonDetails) => {
                  const farmName = farmRes.find(f => f.id === m.farmId)?.name;
                  return {
                    value: m.id,
                    label: m.name,
                    subTitle:
                      farmName && t('farm').toString() + ': ' + farmName,
                  };
                }),
              );
              if (res.length) {
                if (!farmSeasonId || !res.some(s => s.id === farmSeasonId)) {
                  setFarmSeasonId(res[0].id);
                  fetchData(res[0].id);
                } else fetchData(farmSeasonId);
              } else {
                setFarmSeasonId(null);
                setLog([]);
              }
            })
            .catch(err => console.log(err))
            .finally(() => {
              setLoadingSeason(false);
              setRefreshPage(false);
            });
        })
        .catch(err => console.log(err));
    }
  };

  useEffect(() => {
    if (farmSeasonId) {
      fetchData(farmSeasonId);
    }
  }, [farmSeasonId]);

  useEffect(() => {
    if (params?.farmingSeasonId) {
      setFarmSeasonId(params.farmingSeasonId);
    }
  }, [params]);

  const onRefresh = useCallback((farmSeasonId: number | null) => {
    if (farmSeasonId) {
      setRefreshing(true);
      fetchData(farmSeasonId);
    }
  }, []);

  const fetchData = (farmSeasonId: number) => {
    // setLoadingLisLog(true);
    getDiarys({
      sysAccountId: sysAccountId,
      farmSeasonId: farmSeasonId,
      sort: 'createdDate,desc',
    })
      .then((res: DIARY.Response.Diary[]) => {
        const refresh = res.length !== log.length;
        refresh && setLoadingLisLog(true);
        setTimeout(
          () => {
            setLog(res);
            setLoadingLisLog(false);
          },
          refresh ? 500 : 0,
        );
      })
      .catch(err => console.log(err))
      .finally(() => {
        setRefreshing(false);
      });
  };

  return (
    <AppContainer
      borderBottom={false}
      showBackBtn={false}
      title={t('production_diary')}
      headerRight={
        <TouchableOpacity
          style={{
            alignItems: 'center',
            width: 30,
          }}
          onPress={() =>
            navigation.navigate(SCREEN_NAME.DIARY_WORKS, {
              farmingSeasonId: farmSeasonId,
              seasonList: seasonList,
            })
          }>
          {farmSeasonId && <IconFigma name="add_ICON" size={30} />}
        </TouchableOpacity>
      }>
      <View style={styles.container}>
        <View style={{...styles.headerSelect}}>
          <FieldSelect
            marginBottom={0}
            loading={loadingSeason}
            options={seasonList}
            placeholder={'select_season'}
            title={'select_season_for_view_diary'}
            defaultValue={
              (farmSeasonId
                ? [farmSeasonId]
                : seasonList.length &&
                  seasonList[0].value && [seasonList[0].value]) || []
            }
            onChangeValue={items => {
              setFarmSeasonId((items.length && items[0].value) || null);
            }}
          />
        </View>
        {!farmSeasonId ? (
          <View
            style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <Text style={styleSheet.textStyleBasic}>
              {t('select_season_for_view_diary')}
            </Text>
          </View>
        ) : (
          <>
            {!loadingListLog ? (
              <LogListView
                logs={log}
                seasonList={seasonList}
                farmingSeasonId={farmSeasonId || null}
                onRefresh={onRefresh}
                refreshing={refreshing}
              />
            ) : (
              <View
                style={{
                  width: SCREEN.width,
                  height: '80%',
                  justifyContent: 'center',
                }}>
                <ActivityIndicator size={25} color={Colors.SYS_BUTTON} />
              </View>
            )}
          </>
        )}
      </View>
    </AppContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  headerSelect: {
    width: '100%',
    paddingHorizontal: 20,
    borderColor: Colors.GRAY_LIGHT,
    borderBottomWidth: 1,
  },
  bodyContent: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 100,
  },
});

export default DiaryScreen;
