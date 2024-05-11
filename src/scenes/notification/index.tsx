import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {
  AppContainer,
  ScrollViewKeyboardAvoidView,
} from 'src/components/organisms';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import {SCREEN} from 'src/help';

const Notification = () => {
  const {t} = useTranslation();
  const [notification, setNotification] = useState([]);

  const renderItem = ({item}: {item: any}) => {
    return <View>{/* to do design */}</View>;
  };

  return (
    <AppContainer title={t('notification')} showBackBtn={false}>
      <FlatList
        data={notification}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.containerEmpty}>
            <Text style={styleSheet.textStyleBasic}>
              {t('no_notification')}
            </Text>
          </View>
        }
      />
    </AppContainer>
  );
};

export default Notification;

const styles = StyleSheet.create({
  containerEmpty: {
    height: SCREEN.height - 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
