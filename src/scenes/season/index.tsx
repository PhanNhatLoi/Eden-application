import * as React from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {Colors} from 'src/styles';
import {AppContainer, Spiner} from 'src/components/organisms';
import {useTranslation} from 'react-i18next';
import SeasonEmpty from './SeasonEmpty';
import SeasonCard from './components/SeasonCard';
import {ICON} from 'src/assets';
import {Badge} from 'react-native-elements';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import {getSeasons} from 'src/api/season/actions';
import {useSelector} from 'react-redux';
import {FARM} from 'src/api/farm/type.d';
import {RootState, store} from 'src/state/store';
import {paramsFilterSeasonType} from 'src/state/reducers/season/const';
import {SEASON} from 'src/api/season/type.d';
import {getFarmList} from 'src/api/farm/actions';
import {Background} from 'src/components/molecules';
import {clearCrops} from 'src/state/reducers/season/seasonSlice';

type SeasonProps = {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<{
    params: {refresh?: boolean};
  }>;
};
const SeasonScreen = (props: SeasonProps) => {
  const {t} = useTranslation();
  const [seasondata, setSeasonData] = React.useState<
    SEASON.Response.SeasonList[]
  >([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [loadingFarm, setLoadingFarm] = React.useState<boolean>(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [onScroll, setOnScroll] = React.useState<boolean>(false);
  const [farmList, setFarmList] = React.useState<FARM.Response.FarmGetList[]>(
    [],
  );
  const {navigation} = props;
  const filterParamsRedux = useSelector(
    (state: RootState) => state.season.filterParams,
  );
  const role = useSelector((state: RootState) => state.authReducer.role);
  const [refreshPage, setRefreshPage] = React.useState<boolean>(false);
  const internetInfor = useSelector(
    (state: RootState) => state.notify.internet,
  );
  const sysAccountId = useSelector(
    (state: RootState) => state.authReducer.sysAccountIdOwer || null,
  );

  // listener event focus navigator
  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', e => {
      setRefreshPage(true);
      store.dispatch(clearCrops());
    });
    return unsubscribe;
  }, [props.navigation]);

  //check refresh page to do fetch new data
  React.useEffect(() => {
    if (refreshPage) {
      fetchData(getParamsRedux());
      setLoadingFarm(true);
      getFarmList({sysAccountId: sysAccountId})
        .then(res => {
          setFarmList(res);
        })
        .catch(err => console.log('fetchFarmList , line 79', err))
        .finally(() => setLoadingFarm(false));
    }
  }, [refreshPage]);

  //change state internet
  React.useEffect(() => {
    if (internetInfor) {
      fetchData(getParamsRedux());
      getFarmList({sysAccountId: sysAccountId})
        .then(res => {
          setFarmList(res);
        })
        .catch(err => console.log('fetchFarmList , line 91', err));
    }
  }, [internetInfor]);

  // get Params filter
  const getParamsRedux = () => {
    let paramsNew: any = {};
    filterParamsRedux &&
      Object.keys(filterParamsRedux).forEach(key => {
        if (key === 'status') {
          if (filterParamsRedux.status?.length)
            paramsNew['seasonStatus'] = filterParamsRedux.status?.join(',');
        } else if (filterParamsRedux[key as keyof typeof filterParamsRedux])
          paramsNew[key] =
            filterParamsRedux[key as keyof typeof filterParamsRedux];
      });
    return paramsNew;
  };

  // scroll on refresh flat list
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setOnScroll(false);
    setRefreshPage(true);
  }, []);

  //fetch data season
  const fetchData = (params?: paramsFilterSeasonType) => {
    // setLoading(true);
    internetInfor &&
      getSeasons({
        ...params,
        sysAccountId: sysAccountId,
        sort: 'lastModifiedDate,desc',
      })
        .then((res: SEASON.Response.SeasonList[]) => {
          const refresh = res?.length !== seasondata?.length;
          refresh && setLoading(true);
          setTimeout(
            () => {
              setSeasonData((res?.length && res) || []);
              setLoading(false);
            },
            refresh ? 500 : 0,
          );
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          setRefreshing(false);
          setRefreshPage(false);
        });
  };

  return (
    <>
      <Spiner loading={loading} />
      {!seasondata?.length && !Object.keys(getParamsRedux()).length ? (
        <SeasonEmpty
          farmLength={farmList?.length || 0}
          loading={loadingFarm}
          title="empty_season_title"
          description={
            (role === 'FARMER' && 'empty_season_note') ||
            'empty_season_note_staff'
          }
          buttonAdd={role === 'FARMER'}
        />
      ) : (
        <AppContainer
          showBackBtn={false}
          title={t('season_list')}
          headerRight={
            <TouchableOpacity
              style={{
                alignItems: 'center',
                width: 30,
                justifyContent: 'center',
                marginTop: 10,
              }}
              onPress={() =>
                navigation.navigate(SCREEN_NAME.SETTING_FILTER_SEASON)
              }>
              <View>
                <Image
                  source={
                    ICON[
                      Object.keys(getParamsRedux()).length
                        ? 'filter_selected'
                        : 'filter'
                    ]
                  }
                  style={{height: 20, width: 17}}
                />
                {Object.keys(getParamsRedux()).length > 0 && (
                  <Badge
                    status="error"
                    badgeStyle={{width: 10, height: 10, borderRadius: 100}}
                    containerStyle={{
                      position: 'absolute',
                      top: -5,
                      right: -4,
                    }}
                  />
                )}
              </View>
            </TouchableOpacity>
          }>
          <>
            <FlatList
              style={styles.content}
              refreshing={refreshing}
              onRefresh={() => onRefresh()}
              data={seasondata}
              onScrollBeginDrag={() => setOnScroll(true)}
              onScrollEndDrag={() => setOnScroll(false)}
              ListEmptyComponent={
                <SeasonEmpty
                  loading={loadingFarm}
                  farmLength={farmList?.length || 0}
                  description="none_data"
                />
              }
              renderItem={({item, index}) => (
                <SeasonCard
                  index={index}
                  data={{
                    ...item,
                    farmName:
                      (farmList?.length &&
                        farmList.find(f => f.id === item.farmId)?.name) ||
                      t('no_data'),
                  }}
                  navigation={navigation}
                />
              )}
            />
            {role === 'FARMER' && (
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: 10,
                  bottom: 15,
                  opacity: onScroll ? 0 : 1,
                }}
                onPress={() => navigation.navigate(SCREEN_NAME.ADD_SEASON)}>
                <Image source={ICON['create']} />
              </TouchableOpacity>
            )}
          </>
        </AppContainer>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
  },
  content: {
    // paddingTop: 10,
  },
});

export default SeasonScreen;
