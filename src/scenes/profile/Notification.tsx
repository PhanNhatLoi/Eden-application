import {FlatList, Platform, StyleSheet, Switch, Text, View} from 'react-native';
import React, {useState} from 'react';
import {AppContainer} from 'src/components/organisms';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import {Colors} from 'src/styles';
import requestPermission from 'src/help/requestPermission';
import {useDispatch} from 'react-redux';
import {pushNotify} from 'src/state/reducers/Notification/notify';

const Notification = () => {
  const {t} = useTranslation();
  const [allowNoti, setAllowNoti] = useState<'enable' | 'disabled'>('disabled');
  const dispatch = useDispatch();

  const handleClickFeatureDeveloping = () => {
    dispatch(
      pushNotify({message: 'feature_inprogess', title: 'feature_inprogess'}),
    );
  };

  requestPermission({key: 'POST_NOTIFICATIONS', title: 'notifications'})
    .then(async result => {
      if (result === 'granted') {
        setAllowNoti('enable');
      } else {
        setAllowNoti('disabled');
      }
    })
    .catch(error => {
      console.log(error);
    });

  const items = [
    {
      title: 'season',
      state: false,
    },
    {
      title: 'production_log',
      state: false,
    },
    {
      title: 'allow_email',
      state: false,
    },
    {
      title: 'app_update',
      state: false,
    },
  ];

  const renderItem = ({item}: {item: {title: string; state: boolean}}) => {
    return (
      <View style={styles.item}>
        <Text
          style={[styleSheet.textStyleBasic, {textAlignVertical: 'center'}]}>
          {t(item.title)}
        </Text>
        <Switch
          value={item.state}
          thumbColor={Colors.WHITE}
          trackColor={{true: Colors.SYS_BUTTON, false: Colors.GRAY_03}}
          onChange={() => handleClickFeatureDeveloping()}
        />
      </View>
    );
  };

  return (
    <AppContainer title={t('notification')}>
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styleSheet.textStyleBasic}>
            {t('allow_receive_notifications')}
          </Text>
          <Text style={styleSheet.textStyleBasic}>{t(allowNoti)}</Text>
        </View>
        <Text
          style={[
            styleSheet.textStyleBasic,
            {marginTop: 20, fontSize: 12, color: Colors.GRAY_DARK},
          ]}>
          {t('allow_receive_notifications_des')}
        </Text>
        <FlatList
          style={{marginTop: 10}}
          data={items}
          renderItem={renderItem}
        />
        <Text
          style={[
            styleSheet.textStyleBasic,
            {marginTop: 20, fontSize: 12, color: Colors.GRAY_DARK},
          ]}>
          {t('allow_receive_notifications_des')}
        </Text>
      </View>
    </AppContainer>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopColor: Colors.GRAY_03,
    borderTopWidth: 0.5,
    paddingVertical: 10,
  },
});
