import {StyleSheet, Text, View, FlatList, Image} from 'react-native';
import React from 'react';
import LogComponent from './LogComponent';
import {DIARY} from 'src/api/diary/type.d';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import {OptionType} from 'src/api/appData/type';
import {IMAGE} from 'src/assets';

type Props = {
  logs: DIARY.Response.Diary[];
  farmingSeasonId: number | null;
  onRefresh: (seasonId: number | null) => void;
  refreshing: boolean;
  seasonList: OptionType[];
};

const LogListView = (props: Props) => {
  const {logs, onRefresh, refreshing, farmingSeasonId, seasonList = []} = props;
  const {t} = useTranslation();

  return (
    <FlatList
      contentContainerStyle={{paddingBottom: 20, padding: 20}}
      style={{width: '100%', height: '100%'}}
      data={logs}
      onRefresh={() => onRefresh(farmingSeasonId)}
      refreshing={refreshing}
      ListEmptyComponent={
        <View
          style={{
            alignItems: 'center',
            maxHeight: 400,
          }}>
          <Image
            style={styles.mainImage}
            resizeMode="contain"
            source={IMAGE.DIARY_BACKGROUND}
          />
          <Text style={styleSheet.textStyleBasic}>{t('not_yet_diary')}</Text>
        </View>
      }
      renderItem={({item, index}) => (
        <LogComponent
          data={item}
          index={index}
          farmingSeasonId={props.farmingSeasonId}
          countTimeLine={logs.length}
          seasonList={seasonList}
        />
      )}
    />
  );
};
const styles = StyleSheet.create({
  mainImage: {
    height: '80%',
    marginVertical: 15,
    opacity: 0.5,
  },
});

export default LogListView;
