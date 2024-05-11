import * as React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {Colors} from 'src/styles';
import {useTranslation} from 'react-i18next';
import {Background} from 'src/components/molecules';
import {styleSheet} from 'src/styles/styleSheet';
import {IMAGE} from 'src/assets';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as RootNavigator from 'src/navigations/root-navigator';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import {padding} from 'src/styles/mixins';
import {CommonActions, RouteProp} from '@react-navigation/native';
import {getFarmDetails} from 'src/api/farm/actions';
import {useSelector} from 'react-redux';
import {RootState} from 'src/state/store';
import {Spiner} from 'src/components/organisms';

type Props = {
  route?: RouteProp<{
    params: {
      farmingSeasonId: number;
      farmId: number | null;
    };
  }>;
};
const SeasonCompletedCreate = (props: Props) => {
  const {t} = useTranslation();
  const [farmName, setFarmName] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(true);
  const sysAccountId = useSelector(
    (state: RootState) => state.authReducer.sysAccountIdOwer || null,
  );
  React.useEffect(() => {
    if (props.route?.params.farmId) {
      getFarmDetails(props.route.params.farmId, sysAccountId)
        .then(res => {
          setFarmName(res.name);
        })
        .catch(err => console.log(err))
        .finally(() => setLoading(false));
    }
  }, [props.route?.params]);

  return (
    <Background withoutHeader={true}>
      <Spiner loading={loading} opacity={1} />
      <View style={styles.viewPage}>
        <View style={styles.container}>
          <Text style={styles.textTitle}>
            {t('completed_create_season_title').toLocaleUpperCase()}
          </Text>
          <Image
            resizeMode="contain"
            source={IMAGE.SEASON_CREATE_FINISH_BACKGROUND}
            style={{width: '100%'}}
          />
          <Text style={styles.textNote}>
            <Text>{t('completed_create_season_description_1')}</Text>
            <Text
              style={{
                ...styleSheet.textStyleBold,
                color: '#2D7169',
                fontSize: 15,
              }}>
              {farmName || ' '}
            </Text>
            <Text>{t('completed_create_season_description_2')}</Text>
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              RootNavigator.navigate(SCREEN_NAME.DIARY, {
                farmingSeasonId: props.route?.params.farmingSeasonId,
              });
            }}>
            <Text style={styles.textButtonTitle}>
              {t('enter_production_log')}
            </Text>
            <MaterialIcons name="east" color={Colors.SYS_BUTTON} size={20} />
          </TouchableOpacity>
        </View>
        <View style={{alignItems: 'center', paddingHorizontal: 20}}>
          <TouchableOpacity
            style={{
              ...styleSheet.buttonPrimaryStyle,
              backgroundColor: '#333333',
            }}
            onPress={() =>
              RootNavigator.navigate(SCREEN_NAME.SEASON, {refresh: true})
            }>
            <Text style={{...styles.textButtonTitle, color: Colors.WHITE}}>
              {t('close')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Background>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  textTitle: {
    ...styleSheet.buttonPrimaryText,
    color: Colors.SYS_BUTTON,
    marginBottom: 70,
  },
  textNote: {
    ...styleSheet.textStyleBasic,
    marginTop: 35,
    textAlign: 'center',
    paddingHorizontal: 20,
    fontSize: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    height: 50,
    width: '90%',
    borderWidth: 1,
    borderColor: Colors.SYS_BUTTON,
    borderRadius: 100,
    backgroundColor: Colors.WHITE,
    ...styleSheet.row,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 35,
  },
  textButtonTitle: {
    ...styleSheet.textStyleBold,
    color: Colors.SYS_BUTTON,
    marginRight: 10,
  },
  viewPage: {
    height: '100%',
    justifyContent: 'space-between',
    ...padding(30, 0, 20, 0),
  },
});

export default SeasonCompletedCreate;
