import * as React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
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
import {useSelector} from 'react-redux';
import {RootState} from 'src/state/store';
const FarmEmpty = () => {
  const {t} = useTranslation();
  const role = useSelector((state: RootState) => state.authReducer.role);

  return (
    <Background withoutHeader={true}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.textTitle}>
          {t((role === 'FARMER' && 'emptyFarmTitle') || 'emptyFarmTitle_staff')}
        </Text>
        <Image
          style={styles.mainImage}
          source={IMAGE.FARM_DEFAULT}
          resizeMode="contain"
        />
        <Text style={styles.textNote}>
          {t((role === 'FARMER' && 'emptyFarmNote') || 'emptyFarmNote_staff')}
        </Text>
        {role === 'FARMER' && (
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              RootNavigator.navigate(SCREEN_NAME.ADD_FARM, {
                type: 'CREATE',
                step: 0,
              })
            }>
            <Text style={styles.textButtonTitle}>{t('createFarm')}</Text>
            <MaterialIcons name="east" color={Colors.SYS_BUTTON} size={20} />
          </TouchableOpacity>
        )}
      </ScrollView>
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
    borderRadius: 100,
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

export default FarmEmpty;
