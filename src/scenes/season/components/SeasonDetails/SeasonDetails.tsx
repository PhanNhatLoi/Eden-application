import * as React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import {Text, StyleSheet, View, TouchableOpacity, Alert} from 'react-native';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import {Colors} from 'src/styles';
import {SeasonInFor, ProductionLog} from 'src/scenes';
import {AppContainer} from 'src/components/organisms';
import {margin} from 'src/styles/mixins';
import {RouteProp} from '@react-navigation/native';
import * as RootNavigation from 'src/navigations/root-navigator';
import {useSelector} from 'react-redux';
import {RootState} from 'src/state/store';
import {SCREEN} from 'src/help';
import IconFigma from 'src/components/organisms/ui/Image/IconFigma';
import {DeleteSeason} from 'src/api/season/actions';

const Tab = createMaterialTopTabNavigator();

const tabLabel = (focused: boolean, label: string) => {
  return (
    <Text
      style={{
        ...styleSheet.textStyleBold,
        fontSize: 16,
        lineHeight: 20,
        color: focused ? Colors.SYS_BUTTON : Colors.GRAY_03,
      }}>
      {label}
    </Text>
  );
};

type Props = {
  route?: RouteProp<{params: {id: number; farmId: number}}>;
};

export default function SeasonDetails(props: Props) {
  const {t} = useTranslation();
  const role = useSelector((state: RootState) => state.authReducer.role);
  const {params} = props.route || {};
  const [loading, setLoading] = React.useState<boolean>(false);

  return (
    <AppContainer
      title={t('season_info')}
      borderBottom={false}
      headerRight={
        role === 'FARMER' && (
          <TouchableOpacity
            disabled={loading}
            onPress={() => {
              Alert.alert(
                t('confirm_delete_season'),
                t('confirm_delete_season_des').toString(),
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
                      //todo delete season API
                      params?.id &&
                        DeleteSeason(params.id)
                          .then(res => {
                            RootNavigation.navigate(SCREEN_NAME.SEASON);
                          })
                          .catch(err => console.log(err))
                          .finally(() => {
                            setLoading(false);
                          });
                    },
                  },
                ],
              );
            }}>
            <Text
              style={[
                styleSheet.textStyleBasic,
                {color: Colors.CANCLE_BUTTON, fontSize: 16},
              ]}>
              {t('delete')}
            </Text>
          </TouchableOpacity>
        )
        // <TouchableOpacity
        //   onPress={() => {
        //     RootNavigation.navigate(SCREEN_NAME.SHARE_SEASON, {
        //       farmingSeasonId: params?.id,
        //     });
        //   }}>
        //   <IconFigma name="QR_code_Square" />
        // </TouchableOpacity>
      }>
      <View
        style={{
          height: SCREEN.height,
          paddingBottom: 40,
        }}>
        <Tab.Navigator
          screenOptions={{
            lazy: false,
            tabBarActiveTintColor: Colors.SYS_BUTTON,
            tabBarPressColor: Colors.GRAY_01,
            tabBarIndicatorStyle: styles.tabBarIndicatorStyle,
            tabBarStyle: styles.tabBarStyle,
          }}>
          <Tab.Screen
            options={() => ({
              tabBarLabel: ({focused}) => tabLabel(focused, t('season_info')),
            })}
            name={SCREEN_NAME.SEASON_INFOR}
            initialParams={{
              id: props.route?.params.id,
              farmId: props.route?.params.farmId,
            }}
            component={SeasonInFor}
          />
          <Tab.Screen
            options={() => ({
              tabBarLabel: ({focused}) =>
                tabLabel(focused, t('production_log')),
            })}
            name={SCREEN_NAME.PRODUCTION_LOG}
            component={ProductionLog}
            initialParams={{
              id: props.route?.params.id,
            }}
          />
        </Tab.Navigator>
      </View>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  tabBarIndicatorStyle: {
    height: '100%',
    borderRadius: 100,
    backgroundColor: Colors.WHITE,
    borderColor: Colors.GRAY_02,
    borderWidth: 1,
  },
  tabBarStyle: {
    backgroundColor: Colors.GRAY_01,
    borderRadius: 100,
    ...margin(5, 20, 17, 20),
    borderWidth: 1,
    borderColor: Colors.GRAY_02,
  },
  buttonModal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    // borderColor: Colors.GRAY_03,
    borderRadius: 8,
    height: '100%',
  },
});
