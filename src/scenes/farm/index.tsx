import * as React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from 'src/styles';
import {AppContainer, Spiner} from 'src/components/organisms';
import {useTranslation} from 'react-i18next';
import FarmEmpty from './FarmEmpty';
import {getFarmList} from 'src/api/farm/actions';
import {useState, useEffect} from 'react';
import {FARM} from 'src/api/farm/type.d';
import {SCREEN} from 'src/help';
import {styleSheet} from 'src/styles/styleSheet';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as RootNavigator from 'src/navigations/root-navigator';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import ImageUri from 'src/components/organisms/ui/Image/ImageUri';
import {ICON} from 'src/assets';
import {useSelector} from 'react-redux';
import {RootState, store} from 'src/state/store';
import {GRAY_LINE} from 'src/styles/colors';
import {formatPhoneNumner} from 'src/help/formatPhone';
import {formatDecimal} from 'src/help/formatDecimal';
import {
  clearDeleteCertificationLand,
  clearFarmFlow,
} from 'src/state/reducers/farm/farmSlice';
import {useDispatch} from 'react-redux';

type AddFarmProps = {
  navigation: NavigationProp<ParamListBase>;
};
const FarmScreen = (props: AddFarmProps) => {
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [farmList, setFarmList] = useState<FARM.Response.FarmGetList[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [refreshPage, setRefreshPage] = useState<boolean>(false);
  const [onScroll, setOnScroll] = useState<boolean>(false);
  const role = useSelector((state: RootState) => state.authReducer.role);
  const dispatch = useDispatch();
  const sysAccountId = useSelector(
    (state: RootState) => state.authReducer.sysAccountIdOwer || null,
  );
  const internetInfor = useSelector(
    (state: RootState) => state.notify.internet,
  );

  // listener event focus navigator
  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', e => {
      const farmReducer = store.getState().farmReducer;
      if (farmReducer.farmBody.id) {
        store.dispatch(clearFarmFlow());
      }
      setRefreshPage(true);
    });
    return unsubscribe;
  }, [props.navigation]);

  // change state internet
  useEffect(() => {
    if (internetInfor) {
      setRefreshPage(false);
      fetchFarmList();
      dispatch(clearDeleteCertificationLand());
    }
  }, [internetInfor, refreshPage]);

  //refresh page
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchFarmList();
  }, []);

  //function fetch farm
  const fetchFarmList = async () => {
    if (internetInfor)
      try {
        getFarmList({
          sysAccountId: sysAccountId,
        })
          .then(res => {
            const refresh = res.length !== farmList.length;
            refresh && setIsLoading(true);
            setTimeout(
              () => {
                setFarmList(res);
                setIsLoading(false);
              },
              refresh ? 500 : 0,
            );
          })
          .catch(err =>
            console.log(
              '🚀 ~ file: index.tsx:86 ~ fetchFarmList ~ error:',
              err,
            ),
          );
      } finally {
        setRefreshing(false);
        // setTimeout(() => {
        //   setIsLoading(false);
        // }, 500);
      }
  };

  // render item farm card
  const renderItem = ({
    item,
    index,
  }: {
    item: FARM.Response.FarmGetList;
    index: number;
  }) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.items, {marginTop: !index ? 10 : 0}]}
        onPress={() =>
          props.navigation.navigate(SCREEN_NAME.FARM_DETAILS, {
            farmId: item.id,
          })
        }>
        <View
          style={{
            width: '30%',
            // backgroundColor: 'red',
            justifyContent: 'center',
          }}>
          <ImageUri
            uri={item.avatar || undefined}
            style={styles.avatar}
            resizeMode="contain"
          />
        </View>
        <View style={styles.infoGr}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {item.name || t('emptyName')}
          </Text>
          <View style={[styleSheet.row]}>
            <Text style={styles.itemInfoTitle}>{t('SĐT')}:</Text>
            <View style={styles.margin}>
              {item.phone ? (
                <Text style={styles.itemInfo}>
                  {formatPhoneNumner(item.phone).label}
                </Text>
              ) : (
                <Text
                  style={[
                    styleSheet.textStyleBasic,
                    {color: Colors.GRAY_04, fontStyle: 'italic', fontSize: 10},
                  ]}>
                  {t('emptyPhone')}
                </Text>
              )}
            </View>
          </View>
          <View style={[styleSheet.row]}>
            <Text style={styles.itemInfoTitle}>{t('address')}:</Text>

            <View style={styles.margin}>
              <Text style={[styles.itemInfo]} numberOfLines={3}>
                {item.fullAddress || t('emptyAddress')}
              </Text>
            </View>
          </View>
          <View style={[styleSheet.row]}>
            <Text style={styles.itemInfoTitle}>{t('totalArea')}:</Text>
            <View style={styles.margin}>
              <Text style={styles.itemInfo}>{`${formatDecimal(
                item.grossAreaValue,
              )} ${item.grossAreaUnit}`}</Text>
            </View>
          </View>
        </View>
        <View style={[styleSheet.center, {flex: 1}]}>
          <AntDesign name="right" size={20} color={Colors.BLACK} />
        </View>
      </TouchableOpacity>
    );
  };
  // if (isLoading) {
  //   return (
  //     // <AppContainer showBackBtn={false} title={t('farmList')}>
  //     <View style={styles.container}>
  //       <ActivityIndicator size={25} color={Colors.SYS_BUTTON} />
  //     </View>
  //     // </AppContainer>
  //   );
  // }
  // if (farmList?.length === 0 || isLoading) {
  //   return <FarmEmpty />;
  // }
  return (
    <>
      <Spiner loading={isLoading} />

      {farmList?.length === 0 ? (
        <FarmEmpty />
      ) : (
        <AppContainer showBackBtn={false} title={t('farmList')}>
          <View style={styles.container}>
            <FlatList
              ListEmptyComponent={<FarmEmpty />}
              style={styles.content}
              data={farmList}
              renderItem={renderItem}
              refreshing={refreshing}
              onRefresh={onRefresh}
              onScrollBeginDrag={() => setOnScroll(true)}
              onScrollEndDrag={() => setOnScroll(false)}
            />
            {role === 'FARMER' && (
              <TouchableOpacity
                style={[styles.floatButton, {opacity: onScroll ? 0 : 1}]}
                onPress={() => {
                  RootNavigator.navigate(SCREEN_NAME.ADD_FARM, {
                    type: 'CREATE',
                    step: 0,
                  });
                }}>
                <Image source={ICON['create']} />
              </TouchableOpacity>
            )}
          </View>
        </AppContainer>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 15,
  },
  items: {
    ...styleSheet.shadown,
    borderWidth: 0.5,
    borderColor: GRAY_LINE,
    width: SCREEN.width - 40,
    marginHorizontal: 20,
    paddingRight: 5,
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    ...styleSheet.listSpace,
  },
  avatar: {
    margin: 5,
    width: SCREEN.width * 0.25,
    height: SCREEN.width * 0.25,
    borderRadius: 8,
  },
  infoGr: {
    width: '65%',
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  itemTitle: {
    ...styleSheet.textStyleBold,
    color: Colors.BLACK_ARROW,
    marginBottom: 5,
  },
  margin: {
    width: '65%',
    alignItems: 'flex-start',
    paddingHorizontal: 5,
  },
  itemInfo: {
    ...styleSheet.textStyleBold,
    color: Colors.BLACK_ARROW,
    fontSize: 10,
  },
  itemInfoTitle: {
    ...styleSheet.textStyleBasic,
    fontSize: 10,
    color: Colors.GRAY_04,
    width: '35%',
    justifyContent: 'flex-start',
    height: '100%',
  },
  widthConfig: {
    width: SCREEN.width - 255,
  },
  floatButton: {
    position: 'absolute',
    bottom: 15,
    right: 10,
  },
  content: {
    // paddingTop: 10,
  },
  rightView: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    borderRadius: 8,
  },
});

export default FarmScreen;
