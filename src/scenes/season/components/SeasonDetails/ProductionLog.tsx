import {Image, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Background} from 'src/components/molecules';
import {Spiner} from 'src/components/organisms';
import {ICON} from 'src/assets';
import * as Styles from './styles';
import {Colors} from 'src/styles';
import {styleSheet} from 'src/styles/styleSheet';
import {useTranslation} from 'react-i18next';
import {DIARY} from 'src/api/diary/type.d';
import {getDiarys} from 'src/api/diary/actions';
import {RouteProp} from '@react-navigation/native';
import LogListView from 'src/scenes/diary/components/LogListView';
import {SEASON} from 'src/api/season/type.d';
import {getSeasons} from 'src/api/season/actions';
import {OptionType} from 'src/api/appData/type';
import * as RootNavigator from 'src/navigations/root-navigator';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import IconFigma from 'src/components/organisms/ui/Image/IconFigma';
import {useSelector} from 'react-redux';
import {RootState} from 'src/state/store';
import {SCREEN} from 'src/help';

const {styles} = Styles;

type Props = {
  route?: RouteProp<{params?: {id: number}}>;
};

const ProductionLog = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [logs, setLogs] = useState<DIARY.Response.Diary[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [seasonList, setSeasonList] = useState<OptionType[]>([]);
  const {t} = useTranslation();
  const sysAccountId = useSelector(
    (state: RootState) => state.authReducer.sysAccountIdOwer || null,
  );
  useEffect(() => {
    if (props.route?.params?.id) {
      fetchData();
    }
    getSeasons({sysAccountId: sysAccountId})
      .then((res: SEASON.Response.SeasonDetails[]) => {
        setSeasonList(
          res.map(m => {
            return {
              value: m.id,
              label: m.name,
            };
          }),
        );
      })
      .catch(err => console.log(err));
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    getDiarys({
      sysAccountId: sysAccountId,
      farmSeasonId: props.route?.params?.id,
      sort: 'createdDate,desc',
    })
      .then((res: DIARY.Response.Diary[]) => {
        setLogs(res); // hardcode sort createDate
      })
      .catch(err => console.log(err))
      .finally(() => {
        setRefreshing(false);
        setLoading(false);
      });
  };

  return (
    <>
      <View
        style={{
          position: 'absolute',
          top: 0,
          height: SCREEN.height,
          width: '100%',
        }}>
        <Background></Background>
      </View>
      <Spiner loading={loading} />
      <View style={{flex: 1}}>
        <LogListView
          logs={logs}
          refreshing={refreshing}
          onRefresh={onRefresh}
          farmingSeasonId={props.route?.params?.id || null}
          seasonList={seasonList || []}
        />
      </View>
      <TouchableOpacity
        style={{paddingHorizontal: 20}}
        onPress={() =>
          RootNavigator.navigate(SCREEN_NAME.DIARY_WORKS, {
            farmingSeasonId: props.route?.params?.id,
            seasonList: seasonList,
          })
        }>
        <View
          style={{
            ...styleSheet.buttonPrimaryStyle,
            backgroundColor: Colors.WHITE,
            borderColor: Colors.SYS_BUTTON,
            borderStyle: 'dashed',
            borderWidth: 1,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              ...styleSheet.textStyleBold,
              color: Colors.SYS_BUTTON,
            }}>
            {t('add_diary')}
          </Text>
          {/* <Image source={ICON['addFile']} /> */}
          <IconFigma name="addFile" size={20} />
        </View>
      </TouchableOpacity>
    </>
  );
};

export default ProductionLog;
