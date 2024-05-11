import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  Home,
  ProfileScreen,
  FarmScreen,
  DiaryScreen,
  SeasonScreen,
  Notification,
} from 'src/scenes';
import {SCREEN_NAME} from './screen-name';
import {Text, Image, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {ICON} from 'src/assets';
import {styleSheet} from 'src/styles/styleSheet';
import {Colors} from 'src/styles';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import IconFigma from 'src/components/organisms/ui/Image/IconFigma';

const Tab = createBottomTabNavigator();

const tabLabel = (focused: boolean, label: string) => {
  return (
    <Text style={focused ? styles.seletedText : styles.text}>{label}</Text>
  );
};
const tabImage = (focused: boolean, image: string) => {
  return (
    // <Image
    //   source={focused ? ICON[image + 'Selected'] : ICON[image]}
    //   style={styles.icon}
    //   resizeMode="contain"
    // />
    <IconFigma name={image + (focused ? 'Selected' : '')} />
  );
};
type Props = {
  navigation: NavigationProp<ParamListBase>;
  route?: RouteProp<{
    params: {
      routerName: keyof typeof SCREEN_NAME;
    };
  }>;
};
export default function TabBar(props: Props) {
  const {t} = useTranslation();
  const {params} = props.route || {routerName: SCREEN_NAME.HOME};
  return (
    <Tab.Navigator
      initialRouteName={params?.routerName}
      screenOptions={{headerShown: false}}>
      <Tab.Screen
        options={() => ({
          tabBarStyle: styles.tabBarStyle,
          tabBarLabel: ({focused}) => tabLabel(focused, t('home')),
          tabBarIcon: ({focused}) => tabImage(focused, 'home'),
        })}
        name={SCREEN_NAME.HOME}
        component={Home}
      />
      <Tab.Screen
        options={() => ({
          tabBarStyle: styles.tabBarStyle,
          tabBarLabel: ({focused}) => tabLabel(focused, t('farm')),
          tabBarIcon: ({focused}) => tabImage(focused, 'farm'),
        })}
        name={SCREEN_NAME.FARM}
        component={FarmScreen}
      />
      <Tab.Screen
        options={() => ({
          tabBarStyle: styles.tabBarStyle,
          tabBarLabel: ({focused}) => tabLabel(focused, t('season')),
          tabBarIcon: ({focused}) => tabImage(focused, 'season'),
        })}
        name={SCREEN_NAME.SEASON}
        component={SeasonScreen}
      />
      <Tab.Screen
        options={() => ({
          tabBarStyle: styles.tabBarStyle,
          tabBarLabel: ({focused}) => tabLabel(focused, t('diary')),
          tabBarIcon: ({focused}) => tabImage(focused, 'diary'),
        })}
        name={SCREEN_NAME.DIARY}
        component={DiaryScreen}
      />
      {/* <Tab.Screen
        options={() => ({
          tabBarStyle: styles.tabBarStyle,
          tabBarLabel: ({focused}) => tabLabel(focused, t('notification')),
          tabBarIcon: ({focused}) => tabImage(focused, 'bell'),
        })}
        name={SCREEN_NAME.NOTIFICATION}
        component={Notification}
      /> */}
      <Tab.Screen
        options={() => ({
          tabBarStyle: styles.tabBarStyle,
          tabBarLabel: ({focused}) => tabLabel(focused, t('profile')),
          tabBarIcon: ({focused}) => tabImage(focused, 'profile'),
        })}
        name={SCREEN_NAME.PROFILE}
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  text: {
    ...styleSheet.textStyleBasic,
    color: Colors.GRAY_DARK,
    fontSize: 12,
  },
  seletedText: {
    ...styleSheet.textStyleBold,
    color: Colors.SYS_BUTTON,
    fontSize: 12,
  },
  icon: {
    width: 22,
    height: 22,
  },
  tabBarStyle: {
    paddingBottom: 15,
    paddingTop: 15,
    height: 80,
  },
});
