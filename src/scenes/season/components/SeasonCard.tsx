import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {RenderStatusSeaSon} from 'src/api/appData/type';
import {Colors} from 'src/styles';
import {boxShadow} from 'src/styles/mixins';
import {styleSheet} from 'src/styles/styleSheet';
import {ICON} from 'src/assets';
import {useTranslation} from 'react-i18next';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import {SEASON} from 'src/api/season/type.d';
import {SwipeableView} from 'src/components/molecules';
import {formatDecimal} from 'src/help/formatDecimal';
import IconFigma from 'src/components/organisms/ui/Image/IconFigma';

type Props = {
  data: SEASON.Response.SeasonList & {farmName: string};
  navigation: NavigationProp<ParamListBase>;
  index: number;
};

const SeasonCard = (props: Props) => {
  const {data, navigation, index} = props;
  const {t} = useTranslation();
  return (
    <View style={[styles.cardContainer, {marginTop: !index ? 10 : 0}]}>
      <TouchableOpacity
        style={{width: '100%', height: '100%', flexDirection: 'row'}}
        onPress={() =>
          navigation.navigate(SCREEN_NAME.SEASON_DETAILS, {
            id: data.id,
            farmId: data.farmId,
          })
        }>
        <View style={styles.bodyContent}>
          <Text numberOfLines={1} style={[styleSheet.textStyleBold]}>
            {data.name}
          </Text>
          <View style={{height: '100%', paddingVertical: 14}}>
            <View style={styles.row}>
              <Text numberOfLines={1} style={styles.textKey}>
                {t('farm') + ':'}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  ...styles.textValue,
                  ...styleSheet.linkTextStyle,
                  fontSize: 11,
                }}>
                {data.farmName}
              </Text>
            </View>
            <View style={styles.row}>
              <Text numberOfLines={1} style={styles.textKey}>
                {t('sowingDate') + ':'}
              </Text>
              <Text numberOfLines={1} style={styles.textValue}>
                {(data.sowingDate &&
                  new Date(data.sowingDate).toLocaleDateString('vi-VN')) ||
                  '-'}
              </Text>
            </View>
            <View style={styles.row}>
              <Text numberOfLines={1} style={styles.textKey}>
                {t('harvestDate') + ':'}
              </Text>
              <Text numberOfLines={1} style={styles.textValue}>
                {(data.harvestDate &&
                  new Date(data.harvestDate).toLocaleDateString('vi-VN')) ||
                  '-'}
              </Text>
            </View>
            <View style={styles.row}>
              <Text numberOfLines={1} style={styles.textKey}>
                {t('harvesYield') + ':'}
              </Text>
              <Text numberOfLines={1} style={styles.textValue}>
                {formatDecimal(data.grossYield.value || 0)}{' '}
                {data.grossYield.unit?.shortName}
              </Text>
            </View>
            <View style={styles.row}>
              <Text numberOfLines={1} style={styles.textKey}>
                {t('status') + ':'}
              </Text>
              <View style={{...styles.textValue, ...styleSheet.linkTextStyle}}>
                {RenderStatusSeaSon(data.seasonStatus)}
              </View>
            </View>
          </View>
        </View>
        <View style={styles.arrowButton}>
          <IconFigma name="arrow_r" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    ...styleSheet.listSpace,
    backgroundColor: Colors.WHITE,
    height: 180,
    borderRadius: 8,
    borderColor: Colors.GRAY_LIGHT,
    borderWidth: 0.5,
    ...styleSheet.shadown,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  bodyContent: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  textKey: {
    ...styleSheet.textStyleBasic,
    color: Colors.GRAY_04,
    fontSize: 10,
    flex: 2,
  },
  textValue: {
    ...styleSheet.textStyleBold,
    color: Colors.BLACK,
    fontSize: 10,
    flex: 1,
  },
  arrowButton: {
    justifyContent: 'center',
  },
  rightView: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    borderRadius: 8,
  },
});
export default SeasonCard;
