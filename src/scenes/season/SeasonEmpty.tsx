import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Colors} from 'src/styles';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import {IMAGE} from 'src/assets';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as RootNavigator from 'src/navigations/root-navigator';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import {SCREEN} from 'src/help';
import {Background} from 'src/components/molecules';
import {getFarmList} from 'src/api/farm/actions';
import {useSelector} from 'react-redux';
import {RootState} from 'src/state/store';
import SpinButton from 'src/components/organisms/buttons/SpinButton';

type Props = {
  title?: string;
  description?: string;
  buttonAdd?: boolean;
  loading: boolean;
  farmLength: number;
};
const SeasonEmpty = (props: Props) => {
  const {t} = useTranslation();
  const {
    title = '',
    description = '',
    buttonAdd = false,
    loading = false,
    farmLength = 0,
  } = props;
  // const sysAccountId = useSelector(
  //   (state: RootState) => state.authReducer.sysAccountIdOwer || null,
  // );
  // const [lengthList, setLengthList] = React.useState<number>(0);
  // const [loading, setLoading] = React.useState<boolean>(true);

  // React.useEffect(() => {
  //   setLoading(true);
  //   getFarmList({
  //     sysAccountId: sysAccountId,
  //   })
  //     .then(res => {
  //       setLengthList((res?.length && res.length) || 0);
  //     })
  //     .catch(err =>
  //       console.log('🚀 ~ file: index.tsx:86 ~ fetchFarmList ~ error:', err),
  //     )
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }, []);

  return (
    <Background>
      <View style={styles.container}>
        <Text style={styles.textTitle}>{t(title).toLocaleUpperCase()}</Text>
        <Image
          resizeMode="contain"
          source={IMAGE['SEASON_DEFAULT']}
          style={{width: '100%', height: SCREEN.height * 0.5}}
        />
        <Text style={styles.textNote}>{t(description)}</Text>

        {buttonAdd && (
          <SpinButton
            icon={
              <MaterialIcons name="east" color={Colors.SYS_BUTTON} size={20} />
            }
            isLoading={loading}
            colorSpiner={Colors.SYS_BUTTON}
            title={t('create_season')}
            buttonProps={{
              onPress: () => {
                if (farmLength === 0)
                  Alert.alert(
                    t('not_yet_have_farm'),
                    t('not_yet_have_farm_des').toString(),
                  );
                else RootNavigator.navigate(SCREEN_NAME.ADD_SEASON);
              },
              style: styles.button,
            }}
            titleProps={{
              style: styles.textButtonTitle,
            }}
          />
        )}
      </View>
    </Background>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  textTitle: {
    ...styleSheet.buttonPrimaryText,
    color: Colors.BLACK,
    marginTop: 30,
  },
  textNote: {
    ...styleSheet.textStyleBasic,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  button: {
    ...styleSheet.row,
    height: 50,
    width: '90%',
    borderWidth: 1,
    borderColor: Colors.SYS_BUTTON,
    borderRadius: 100,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 35,
    marginHorizontal: 20,
  },
  textButtonTitle: {
    ...styleSheet.textStyleBold,
    color: Colors.SYS_BUTTON,
    marginRight: 10,
  },
});

export default SeasonEmpty;
