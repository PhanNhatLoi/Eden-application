import {ActivityIndicator, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {WebView} from 'react-native-webview';
import {AppContainer} from 'src/components/organisms';
import {useTranslation} from 'react-i18next';
import {Colors} from 'src/styles';
import {SCREEN} from 'src/help';

const TermsOfService = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const {t} = useTranslation();
  return (
    <AppContainer title={t('terms_of_use')}>
      {loading && (
        <View style={styles.container}>
          <ActivityIndicator color={Colors.SYS_BUTTON} size={50} />
        </View>
      )}
      <View
        style={{
          height: SCREEN.height,
          backgroundColor: Colors.WHITE,
          paddingBottom: 60,
          paddingHorizontal: 10,
        }}>
        <WebView
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          source={{uri: 'https://edenfarm.com.vn/terms-of-service/'}}
        />
      </View>
    </AppContainer>
  );
};

export default TermsOfService;

const styles = StyleSheet.create({
  container: {height: SCREEN.height, justifyContent: 'center'},
});
