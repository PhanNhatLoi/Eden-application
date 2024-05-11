import * as React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  View,
} from 'react-native';
import {Colors} from 'src/styles';
import {useTranslation} from 'react-i18next';
import {Background} from 'src/components/molecules';
import {styleSheet} from 'src/styles/styleSheet';
import {IMAGE} from 'src/assets';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as RootNavigator from 'src/navigations/root-navigator';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import {SCREEN} from 'src/help';
import SpinButton from 'src/components/organisms/buttons/SpinButton';
const Step11 = () => {
  const {t} = useTranslation();
  const handleNavigate = () => {
    RootNavigator.navigate(SCREEN_NAME.SEASON);
  };
  return (
    <Background withoutHeader={true}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}>
        <Text style={[styles.textTitle, {color: Colors.SYS_BUTTON}]}>
          {t('addFarmComplete')}
        </Text>
        <Image
          style={styles.mainImage}
          source={IMAGE.FARM_DEFAULT_COMPLETED}
          resizeMode="contain"
        />
        <Text style={styles.textNote}>{t('completedFarmNote')}</Text>
        <TouchableOpacity style={styles.button} onPress={handleNavigate}>
          <Text style={styles.textButtonTitle}>{t('create_season')}</Text>
          <MaterialIcons name="east" color={Colors.SYS_BUTTON} size={20} />
        </TouchableOpacity>
      </ScrollView>
      <View style={{paddingHorizontal: 20}}>
        <SpinButton
          isLoading={false}
          title={t('close')}
          colorSpiner={Colors.SYS_BUTTON}
          buttonProps={{
            onPress: () => RootNavigator.navigate(SCREEN_NAME.FARM),
            style: {
              ...styleSheet.buttonPrimaryStyle,
              backgroundColor: Colors.BLACK_02,
            },
          }}
          titleProps={{
            style: {...styleSheet.buttonPrimaryText},
          }}
        />
      </View>
    </Background>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    ...styleSheet.center,
    paddingVertical: 30,
  },
  textTitle: {
    ...styleSheet.buttonPrimaryText,
    color: Colors.BLACK,
    marginBottom: 70,
  },
  textNote: {
    ...styleSheet.textStyleBasic,
    marginTop: 20,
    textAlign: 'center',
  },
  button: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.SYS_BUTTON,
    borderRadius: 20,
    backgroundColor: Colors.WHITE,
    ...styleSheet.row,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  textButtonTitle: {
    ...styleSheet.textStyleBold,
    color: Colors.SYS_BUTTON,
    marginRight: 10,
  },

  mainImage: {
    width: SCREEN.width - 100,
    height: SCREEN.width - 100,
  },
});

export default Step11;
