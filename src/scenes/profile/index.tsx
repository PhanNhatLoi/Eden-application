import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Colors} from 'src/styles';
import {useDispatch} from 'react-redux';
import {
  AppContainer,
  ScrollViewKeyboardAvoidView,
} from 'src/components/organisms';
import Icon from 'react-native-vector-icons/Fontisto';
import {useSelector} from 'react-redux';
import {AppDispatch, RootState} from 'src/state/store';
import {styleSheet} from 'src/styles/styleSheet';
import {ICON} from 'src/assets';
import {boxShadow, margin, padding} from 'src/styles/mixins';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import {formatPhoneNumner} from 'src/help/formatPhone';
import {pushNotify} from 'src/state/reducers/Notification/notify';
import ImageUri from 'src/components/organisms/ui/Image/ImageUri';
import {SCREEN} from 'src/help';
import IconFigma from 'src/components/organisms/ui/Image/IconFigma';

type itemsCardType = {
  title: string;
  icon: React.ReactElement;
  onPress: () => void;
};

type Props = {
  navigation: NavigationProp<ParamListBase>;
};

const Profile = (props: Props) => {
  const {t} = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector((state: RootState) => state.authReducer.user);
  const role = useSelector((state: RootState) => state.authReducer.role);
  const {navigation} = props;
  const handleClickFeatureDeveloping = () => {
    dispatch(
      pushNotify({message: 'feature_inprogess', title: 'feature_inprogess'}),
    );
  };

  const cardItem1: itemsCardType[] = [
    {
      title: 'weather',
      icon: <Image source={ICON['sun']} style={{height: 32, width: 34}} />,
      onPress: () => handleClickFeatureDeveloping(),
    },
    {
      title: 'humidity',
      icon: <Image source={ICON['rain']} style={{height: 32, width: 23.16}} />,
      onPress: () => handleClickFeatureDeveloping(),
    },
    {
      title: 'temperature',
      icon: (
        <Image source={ICON['temperature']} style={{height: 32, width: 18}} />
      ),
      onPress: () => handleClickFeatureDeveloping(),
    },
  ];

  const cardItem2: itemsCardType[] = [
    {
      title: 'video',
      icon: <Image source={ICON['video']} style={{height: 32, width: 32}} />,
      onPress: () => navigation.navigate(SCREEN_NAME.NEWS, {title: 'video'}),
    },
    {
      title: 'news',
      icon: <Image source={ICON['news']} style={{height: 32, width: 32}} />,
      onPress: () => navigation.navigate(SCREEN_NAME.NEWS, {title: 'news'}),
    },
  ];

  const CardContainer = (props: {title: string; items: itemsCardType[]}) => {
    const {title, items} = props;
    return (
      <View style={styles.content_2}>
        <View>
          <Text style={styleSheet.textStyleBold}> {t(title)}</Text>
        </View>
        <View style={styles.rowContent_2}>
          {items.map((m, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={styles.iconContent_2}
                onPress={m.onPress}>
                {m.icon}
                <Text style={styles.textContent_2}>{t(m.title)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <AppContainer
      showBackBtn={false}
      title={t('profile')}
      headerRight={
        <TouchableOpacity
          style={{
            alignItems: 'center',
            width: 30,
            justifyContent: 'center',
            marginTop: 10,
          }}
          onPress={() => navigation.navigate(SCREEN_NAME.SETTINGS_PROFILE)}>
          {<Icon name="player-settings" size={24.38} color={Colors.GRAY_04} />}
        </TouchableOpacity>
      }>
      <ScrollViewKeyboardAvoidView
        scrollViewProps={{
          style: styles.container,
          contentContainerStyle: {minHeight: 600},
        }}>
        <View
          style={[
            styles.row,
            {width: SCREEN.width - 40, marginHorizontal: 20},
          ]}>
          <View
            style={{
              backgroundColor: Colors.WHITE,
              borderColor: Colors.WHITE,
              borderWidth: 3,
              borderRadius: 100,
              ...boxShadow(Colors.BLACK),
            }}>
            <ImageUri
              onPress={() => {
                !profile?.avatar &&
                  navigation.navigate(SCREEN_NAME.SETTINGS_PROFILE);
              }}
              supportViewFullSise={Boolean(profile?.avatar)}
              style={{
                height: 100,
                width: 100,
                borderRadius: 100,
              }}
              uri={profile?.avatar || undefined}
            />
          </View>

          <View style={styles.infor}>
            <Text
              numberOfLines={2}
              style={{
                ...styleSheet.textStyleBold,
                fontSize: 17,
                lineHeight: 24,
              }}>
              {profile?.fullName || t('no_data')}
            </Text>
            <Text style={styleSheet.textStyleBasic}>
              {(profile?.phone && formatPhoneNumner(profile.phone).label) ||
                t('no_data')}
            </Text>
          </View>
        </View>
        <View style={styles.content_1}>
          {role === 'FARMER' && (
            <TouchableOpacity
              style={styles.iconContent_1}
              onPress={() => navigation.navigate(SCREEN_NAME.STAFF)}>
              {/* <Image source={ICON['users']} style={{height: 50, width: 50}} />
               */}
              <IconFigma name="users" size={50} />
              <Text style={styles.textContent_1}>{t('staff')}</Text>
            </TouchableOpacity>
          )}
          {/* to do dev notification settings */}
          {/* <TouchableOpacity
            style={styles.iconContent_1}
            onPress={() => navigation.navigate(SCREEN_NAME.NOTIFICATION)}>
            <Image
              source={ICON['notification']}
              style={{height: 50, width: 50}}
            />
            <Text style={styles.textContent_1}>{t('notification')}</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.iconContent_1}
            onPress={() => navigation.navigate(SCREEN_NAME.SHARE_FRIEND)}>
            <Image source={ICON['QRcode']} style={{height: 50, width: 50}} />
            <Text style={styles.textContent_1}>{t('invite_friends')}</Text>
          </TouchableOpacity>
        </View>
        {/* <View style={{marginTop: 15}}>
          <CardContainer title="environment" items={cardItem1} />
        </View>
        <View style={{marginTop: 15}}>
          <CardContainer title="news" items={cardItem2} />
        </View> */}
      </ScrollViewKeyboardAvoidView>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },

  container: {
    // marginTop: 20,
    paddingTop: 20,
    marginBottom: 20,
    width: '100%',
  },
  infor: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
  },
  content_1: {
    flexDirection: 'row',
    ...margin(30, 20, 20, 20),
    justifyContent: 'flex-start',
  },
  iconContent_1: {
    alignItems: 'center',
    width: '33%',
    // backgroundColor: 'red',
  },
  textContent_1: {
    marginTop: 13,
    ...styleSheet.textStyleBasic,
  },
  content_2: {
    height: 120,
    width: SCREEN.width - 40,
    marginHorizontal: 20,
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
    ...boxShadow(Colors.BLACK_02),
    ...padding(11, 15, 15, 15),
  },
  rowContent_2: {
    flexDirection: 'row',
    ...margin(20, 10, 0, 10),
  },
  iconContent_2: {
    alignItems: 'center',
    width: '33%',
  },
  textContent_2: {
    marginTop: 10,
    ...styleSheet.textStyleBasic,
  },
});

export default Profile;
