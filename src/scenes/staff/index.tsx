import {
  ActivityIndicator,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {
  AppContainer,
  ScrollViewKeyboardAvoidView,
} from 'src/components/organisms';
import {useTranslation} from 'react-i18next';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import {ICON, IMAGE} from 'src/assets';
import {SCREEN} from 'src/help';
import {boxShadow} from 'src/styles/mixins';
import SpinButton from 'src/components/organisms/buttons/SpinButton';
import {styleSheet} from 'src/styles/styleSheet';
import {useDispatch, useSelector} from 'react-redux';
import {clearFilterStaff} from 'src/state/reducers/staff/staffSlice';
import {getStaffList} from 'src/api/staff/actions';
import {STAFF} from 'src/api/staff/type.d';
import {Colors} from 'src/styles';
import StaffList from './components/staffList';
import {removeVietnameseTones} from 'src/help/convertVi';
import {RootState} from 'src/state/store';
import {Badge} from 'react-native-elements';
type Props = {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<{
    params: {refesh: boolean};
  }>;
};

const Staff = (props: Props) => {
  const {navigation} = props;
  const {params} = props.route;
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [staffs, setStaffs] = useState<STAFF.Response.StaffList[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchKey, setSearchKey] = useState<string>('');
  const filterRedux = useSelector((state: RootState) => state.staff);
  const [paramsFilter, setParamsFilter] = useState<STAFF.Request.ParamsFilter>({
    sort: 'lastModifiedDate,desc',
  });

  React.useEffect(() => {
    dispatch(clearFilterStaff());
    setLoading(true);
    fetchData();
  }, []);

  React.useEffect(() => {
    setLoading(true);
    fetchData();
  }, [params, paramsFilter]);

  React.useEffect(() => {
    fetchData();
  }, [refreshing]);

  React.useEffect(() => {
    let paramsFilter: any = {};
    Object.keys(filterRedux).forEach(m => {
      if (filterRedux[m as keyof typeof filterRedux])
        paramsFilter[m] = filterRedux[m as keyof typeof filterRedux];
    });
    setParamsFilter({...paramsFilter});
  }, [filterRedux]);

  const fetchData = () => {
    getStaffList({...paramsFilter, sort: 'lastModifiedDate,desc'})
      .then((res: STAFF.Response.StaffList[]) => {
        setStaffs(res);
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  const EmptyList = () => {
    return (
      <>
        <Image
          source={IMAGE['STAFF_BACKGROUND']}
          style={{
            width: SCREEN.width,
            height: SCREEN.height * 0.7,
          }}
          resizeMode="contain"
        />
        <View style={styles.bottomContent}>
          <Text style={styleSheet.textStyleBasic}>
            {t(
              Object.keys(paramsFilter).filter(s => s !== 'sort').length
                ? 'none_data'
                : 'you_not_have_staff',
            )}
          </Text>
          {!Object.keys(paramsFilter).filter(s => s !== 'sort').length && (
            <SpinButton
              isLoading={false}
              title={t('add_staff')}
              icon={
                <Image
                  source={ICON['add_staff']}
                  style={{height: 20, width: 25, marginLeft: 10}}
                />
              }
              buttonProps={{
                onPress: () => navigation.navigate(SCREEN_NAME.ADD_STAFF),
                style: {
                  ...styleSheet.buttonDefaultStyle,
                  marginTop: 25,
                },
              }}
              titleProps={{
                style: {...styleSheet.buttonDefaultText},
              }}
            />
          )}
        </View>
      </>
    );
  };

  return (
    <AppContainer
      title={t('staff_list')}
      headerRight={
        <TouchableOpacity
          style={{
            alignItems: 'center',
            width: 30,
            justifyContent: 'center',
            marginTop: 10,
          }}
          onPress={() => navigation.navigate(SCREEN_NAME.FILTER_STAFF)}>
          <Image
            source={
              ICON[
                Object.keys(paramsFilter).length ? 'filter_selected' : 'filter'
              ]
            }
            style={{height: 20, width: 17}}
          />

          {Object.keys(paramsFilter).length > 0 && (
            <Badge
              status="error"
              badgeStyle={{width: 10, height: 10, borderRadius: 100}}
              containerStyle={{
                position: 'absolute',
                top: -5,
                right: -0,
              }}
            />
          )}
        </TouchableOpacity>
      }>
      {loading ? (
        <View style={{justifyContent: 'center', flex: 1}}>
          <ActivityIndicator size={30} color={Colors.SYS_BUTTON} />
        </View>
      ) : staffs?.length ? (
        <ScrollViewKeyboardAvoidView
          searchButton={{
            onChangeText: val => setSearchKey(val),
            placehoder: 'search_staff',
          }}
          scrollViewProps={{
            style: styles.container,
            refreshControl: (
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            ),
          }}
          fixedButton={{
            button: (
              <TouchableOpacity
                onPress={() => navigation.navigate(SCREEN_NAME.ADD_STAFF)}>
                <Image source={ICON['create']} />
              </TouchableOpacity>
            ),
            bottom: 50,
            rigth: 20,
          }}>
          <StaffList
            onRefresh={onRefresh}
            loading={loading}
            setLoading={setLoading}
            staffs={staffs.filter(f =>
              removeVietnameseTones(
                f.fullName?.toLocaleLowerCase() || '',
              ).includes(removeVietnameseTones(searchKey.toLowerCase())),
            )}
          />
        </ScrollViewKeyboardAvoidView>
      ) : (
        <EmptyList />
      )}
    </AppContainer>
  );
};

export default Staff;

const styles = StyleSheet.create({
  bottomContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    height: '100%',
    width: '100%',
  },
  staffCard: {
    marginHorizontal: 20,
    paddingHorizontal: 12,
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
    ...boxShadow(Colors.BLACK),
    ...styleSheet.listSpace,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightView: {
    width: 80,
    height: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});
