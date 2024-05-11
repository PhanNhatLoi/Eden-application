// screen
import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

import 'src/i18n/i18n.config';
import {useTranslation} from 'react-i18next';

function HomeDetails(): JSX.Element {
  const {t} = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text>{t('Welcome to React')}</Text>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeDetails;
