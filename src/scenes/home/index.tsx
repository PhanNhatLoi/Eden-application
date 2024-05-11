/* eslint-disable react-hooks/exhaustive-deps */
// import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
import React, {useEffect, useRef, useState} from 'react';
import {
  AppState,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import FarmLocationMarker from './components/farmLocationMarker';
import {getFarmLocationNear} from 'src/api/farm/actions';
import {FARM} from 'src/api/farm/type.d';
import requestPermission from 'src/help/requestPermission';
import {request, PERMISSIONS} from 'react-native-permissions';
import {SCREEN} from 'src/help';
import {Colors} from 'src/styles';
import {styleSheet} from 'src/styles/styleSheet';
import {boxShadow} from 'src/styles/mixins';
import ImageUri from 'src/components/organisms/ui/Image/ImageUri';
import * as RootNavigator from 'src/navigations/root-navigator';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {pushNotify} from 'src/state/reducers/Notification/notify';
import Icon from 'react-native-vector-icons/AntDesign';
import IconEntypo from 'react-native-vector-icons/Entypo';
import {RootState} from 'src/state/store';
import IconFigma from 'src/components/organisms/ui/Image/IconFigma';

// location in vietnam
const region = {
  latitude: 16.463713,
  longitude: 107.590866,
  latitudeDelta: 30,
  longitudeDelta: 30 * (SCREEN.width / SCREEN.height),
};

export type LocationFarmType = {
  id: number;
  sysAccountId: number | null;
  name: string | null;
  avatar: string | null;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  fulladdress: string | null;
};

type Props = {
  navigation: NavigationProp<ParamListBase>;
};

function Home(props: Props): JSX.Element {
  const [currentRegion, setcurrentRegion] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 0,
    longitude: 0,
  });
  const [locationList, setLocationList] = useState<
    (LocationFarmType | undefined)[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const appState = useRef(AppState.currentState);
  const [itemFocus, setItemFocus] = useState<LocationFarmType>();
  const [refreshPage, setRefreshPage] = useState<boolean>(false);
  const [mapRef, setMapRef] = useState<MapView | null>(null);
  const internetInfor = useSelector(
    (state: RootState) => state.notify.internet,
  );

  const sysAccountId = useSelector(
    (state: RootState) => state.authReducer.sysAccountIdOwer || null,
  );

  const dishpatch = useDispatch();

  //event focus home page
  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', e => {
      setRefreshPage(true);
    });

    return unsubscribe;
  }, [props.navigation]);

  //refresh page onfocus
  useEffect(() => {
    if (refreshPage) {
      fetchData(currentRegion.latitude, currentRegion.longitude);
      setRefreshPage(false);
      setItemFocus(undefined);
    }
  }, [refreshPage]);

  //change state internet
  useEffect(() => {
    if (internetInfor) {
      fetchData(currentRegion.latitude, currentRegion.longitude);
    }
  }, [internetInfor]);

  //fetch farm by location
  const fetchData = (lat: number, lng: number) => {
    //todo use lat,lng get list farm location
    if (!internetInfor) return;
    const params = {
      lat: lat,
      lng: lng,
      type: 'FARM_PROFILE',
      size: 100,
      page: 0,
    };

    let locationFinish: (LocationFarmType | undefined)[] = [];
    getFarmLocationNear(params)
      .then(
        (res: (FARM.Response.FarmGetList & {fulladdress: string | null})[]) => {
          //format list farm location
          const farmLocationList: LocationFarmType[] = res.map(
            (m: FARM.Response.FarmGetList & {fulladdress: string | null}) => {
              return {
                id: m.id,
                name: m.name,
                avatar: m.avatar,
                fulladdress: m.fulladdress,
                sysAccountId: m.sysid,
                coordinate: {
                  latitude: Number(m.lat),
                  longitude: Number(m.lng),
                },
              };
            },
          );

          // location dupplicate
          const oldMarkers = locationList.map(
            (m: LocationFarmType | undefined) => {
              return res.some(s => s.id === m?.id) ? m : undefined;
            },
          );
          // remove farm old
          setLocationList(oldMarkers);

          //list location new add
          let newMarkers = farmLocationList.filter(item => {
            return !locationList.some(s => s?.id === item.id);
          });

          // finish list location
          const MarkersList = oldMarkers.map(m => {
            return m?.id ? m : newMarkers.pop();
          });
          locationFinish = [...MarkersList, ...newMarkers];
        },
      )
      .catch(err => console.log(err))
      .finally(() => {
        //set list location
        setLocationList(locationFinish);
      });
  };

  // event inactive and background app
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        checkPermission();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  //check perrmission location
  const checkPermission = async () => {
    const checkPermission =
      Platform.OS === 'android'
        ? await PermissionsAndroid.check(
            'android.permission.ACCESS_FINE_LOCATION',
          )
        : await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    if (checkPermission) {
      await getCurrentPosistion();
    }
  };

  // request permission for app
  const getPermission = async () => {
    setTimeout(
      () => {
        requestPermission({
          key: 'ACCESS_FINE_LOCATION',
          title: 'location',
          onClose: () => {
            setLoading(false);
          },
        })
          .then(result => {
            if (result === 'granted') {
              getCurrentPosistion();
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      Platform.OS === 'ios' ? 2000 : 1000,
    );
  };

  useEffect(() => {
    mapRef && getPermission();
  }, [mapRef]);

  //get currentposion in first open app
  const getCurrentPosistion = (timing?: number) => {
    setLoading(true);
    Geolocation.getCurrentPosition(
      async position => {
        const newRegion = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.05,
        };
        mapRef && mapRef.animateToRegion(newRegion, timing || 2000); // animation focus 2s
        setLoading(false);
      },
      error => {
        console.log('🚀 ~ file: ~ line 74 ~ getLocation ~ error', error);
        setLoading(false);
      },
      {timeout: 15000, maximumAge: 2000, enableHighAccuracy: true},
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={ref => setMapRef(ref)}
        showsTraffic={false}
        showsIndoors={false}
        showsCompass={false}
        style={styles.map}
        showsUserLocation={true}
        showsMyLocationButton={false}
        // followsUserLocation={true}
        onPanDrag={() => {
          setItemFocus(undefined);
        }}
        onRegionChangeComplete={region => {
          fetchData(region.latitude, region.longitude);
          setcurrentRegion({
            latitude: region.latitude,
            longitude: region.longitude,
          });
        }}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}>
        {!loading &&
          locationList.length > 0 &&
          locationList.map((m, i) => {
            return (
              <FarmLocationMarker
                key={i}
                value={m}
                setItemFocus={setItemFocus}
              />
            );
          })}
      </MapView>
      <View style={styles.item}>
        <TouchableOpacity
          onPress={() => getCurrentPosistion(1000)}
          style={{alignSelf: 'flex-end'}}>
          <IconFigma name="userMyLocation" size={55} />
        </TouchableOpacity>
        {itemFocus && (
          <View style={styles.button}>
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => {
                itemFocus.sysAccountId &&
                sysAccountId &&
                itemFocus.sysAccountId === sysAccountId
                  ? RootNavigator.navigate(SCREEN_NAME.FARM_DETAILS, {
                      farmId: itemFocus && itemFocus.id,
                    })
                  : dishpatch(
                      pushNotify({
                        message: 'can_not_view_details_farm',
                        title: 'can_not_view_details_farm',
                      }),
                    );
              }}>
              <View style={styles.title}>
                <ImageUri
                  uri={itemFocus?.avatar || undefined}
                  style={{height: '100%', width: 90, borderRadius: 8}}
                />
                <View style={styles.content}>
                  <Text
                    numberOfLines={1}
                    style={[
                      styleSheet.textStyleBold,
                      {
                        color: Colors.ORANGE,
                        paddingRight: 20,
                      },
                    ]}>
                    {itemFocus?.name}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      marginTop: 8,
                    }}>
                    <IconEntypo
                      style={{marginRight: 3}}
                      name="address"
                      color={Colors.SYS_BUTTON}
                      size={20}
                    />
                    <Text
                      numberOfLines={3}
                      style={[styleSheet.textStyleBasic, {flex: 1}]}>
                      {itemFocus.fulladdress}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={{position: 'absolute', top: 0, right: 0}}
                  onPress={() => setItemFocus(undefined)}>
                  <Icon name="closecircle" color={Colors.GRAY_03} size={20} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    width: SCREEN.width - 30,
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
    marginHorizontal: 5,
    padding: 5,
    ...boxShadow(Colors.BLACK),
  },
  title: {
    height: '100%',
    width: '100%',
    marginBottom: 10,
    flexDirection: 'row',
  },
  content: {
    // justifyContent: 'space-between',
    // paddingVertical: 10,
    marginHorizontal: 10,
    flex: 1,
    height: 80,
  },
  item: {
    width: SCREEN.width - 20,
    position: 'absolute',
    bottom: 10,
    marginHorizontal: 10,
    alignItems: 'flex-start',
  },
});

export default Home;
