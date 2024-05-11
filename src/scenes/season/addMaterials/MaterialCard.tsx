import {StyleSheet, Image, Text, View} from 'react-native';
import React from 'react';
import {boxShadow, padding} from 'src/styles/mixins';
import {Colors} from 'src/styles';
import {ICON} from 'src/assets';
import {SEASON} from 'src/api/season/type.d';
import {styleSheet} from 'src/styles/styleSheet';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {removeOneMaterial} from 'src/state/reducers/season/seasonSlice';
import * as RootNavigator from 'src/navigations/root-navigator';
import {SwipeableView} from 'src/components/molecules';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import {formatDecimal} from 'src/help/formatDecimal';
import IconFigma from 'src/components/organisms/ui/Image/IconFigma';

type Props = {
  data: SEASON.Request.Material;
  index: number;
};

const MaterialCard = (props: Props) => {
  const {t} = useTranslation();
  const {data, index} = props;
  const dispatch = useDispatch();

  return (
    <SwipeableView
      swipeViewStyle={{paddingBottom: 15, height: '100%'}}
      onPressSwipeView={() => dispatch(removeOneMaterial(index))}
      swipeChildren={
        <View style={styles.rightView}>
          <Image source={ICON['trash']} />
        </View>
      }>
      <TouchableOpacity
        style={styles.CardContainer}
        onPress={() => {
          RootNavigator.navigate(SCREEN_NAME.ADD_MATERIAL, {
            value: data,
            index: index,
          });
        }}>
        <View style={styles.content}>
          <View style={styles.leftContnet}>
            <Text style={styles.title}>{data.materialText}</Text>
            <View style={styles.row}>
              <Text style={{...styles.text, marginRight: 20, fontSize: 10}}>
                {t('expectedNumber')} :
              </Text>
              <Text
                style={[
                  styleSheet.textStyleBold,
                  {fontSize: 10},
                ]}>{`${formatDecimal(data.quantity)} ${
                data.unitNameOther
              }`}</Text>
            </View>
          </View>
          <View style={styles.arrow}>
            <IconFigma name="arrow_r" />
          </View>
        </View>
      </TouchableOpacity>
    </SwipeableView>
  );
};

export default MaterialCard;

const styles = StyleSheet.create({
  CardContainer: {
    ...styleSheet.listSpace,
    marginHorizontal: 20,
    height: 65,
    flexDirection: 'row',
    position: 'relative',
    borderRadius: 8,
    ...boxShadow(Colors.BLACK),
  },
  content: {
    position: 'absolute',
    flexDirection: 'row',
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
    height: '100%',
    width: '100%',
    borderColor: Colors.GRAY_02,
    borderWidth: 1,
  },
  leftContnet: {
    ...padding(12, 18, 15, 18),
    width: '90%',
    height: '100%',
    justifyContent: 'space-between',
  },
  arrow: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: '100%',
    width: '10%',
    paddingRight: 17.5,
  },
  row: {
    flexDirection: 'row',
  },
  title: {
    ...styleSheet.textStyleBold,
    fontSize: 14,
  },
  text: {
    ...styleSheet.textStyleBasic,
    fontSize: 14,
  },
  rightView: {
    width: 80,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    borderRadius: 8,
  },
});
