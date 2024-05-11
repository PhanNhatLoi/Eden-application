import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Colors} from 'src/styles';
import {ICON} from 'src/assets';
import {styleSheet} from 'src/styles/styleSheet';
import {padding} from 'src/styles/mixins';
import {useTranslation} from 'react-i18next';
import * as RootNavigator from 'src/navigations/root-navigator';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import {SEASON} from 'src/api/season/type.d';
import {SwipeableView} from 'src/components/molecules';
import {optionsType} from 'src/components/organisms/appForm/FieldDropDown';
import {useDispatch, useSelector} from 'react-redux';
import {clearCrops} from 'src/state/reducers/season/seasonSlice';
import {RootState} from 'src/state/store';
import {formatDecimal} from 'src/help/formatDecimal';
import IconFigma from 'src/components/organisms/ui/Image/IconFigma';

const height = 150;

type Props = {
  data?: SEASON.Basic.Crops;
  farmId: number | null;
  unitsMass: optionsType[];
  unitsArea: optionsType[];
  certificateOfLand: optionsType[];
};

const CropsCard = (props: Props) => {
  const {
    data,
    farmId,
    unitsMass = [],
    unitsArea = [],
    certificateOfLand = [],
  } = props;
  const {t} = useTranslation();
  const crops = useSelector((state: RootState) => state?.season?.crops);
  const dispatch = useDispatch();

  return (
    <SwipeableView
      swipeViewStyle={{height: height}}
      onPressSwipeView={() => {
        dispatch(clearCrops());
      }}
      swipeChildren={
        <View style={styles.rightView}>
          <Image source={ICON['trash']} />
        </View>
      }>
      <TouchableOpacity
        style={styles.CardContainer}
        onPress={() =>
          RootNavigator.navigate(SCREEN_NAME.ADD_CROPS, {
            data: data,
            farmId: farmId,
          })
        }>
        <View style={styles.content}>
          <View style={styles.leftContnet}>
            <Text style={{...styleSheet.textStyleBold, marginBottom: 10.5}}>
              {crops?.productsOfFarm?.name || ''}
            </Text>
            <View style={styles.row}>
              <Text style={styles.title}>{t('cultivatedArea')} :</Text>
              <Text style={styles.text}>{`${formatDecimal(
                data?.grossArea?.value || 0,
              )} ${
                unitsArea.find((f: any) => f.value === data?.grossArea?.unitId)
                  ?.label
              }`}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.title}>{t('certificateOfLands')}:</Text>
              <Text style={styles.text}>
                {certificateOfLand.find(
                  f => f.value === data?.certifycateOfLandIds[0],
                )?.label || t('no_data')}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.title}>{t('expectedOutput')} :</Text>
              <Text style={styles.text}>{`${formatDecimal(
                data?.grossYield.value || 0,
              )} ${
                unitsMass.find((f: any) => f.value === data?.grossYield?.unitId)
                  ?.label
              }`}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.title}>{t('farmMethod')}:</Text>
              <Text style={styles.text}>
                {data?.businessType?.name || t('no_data')}
              </Text>
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

export default CropsCard;

const styles = StyleSheet.create({
  CardContainer: {
    ...styleSheet.listSpace,
    height: height,
    flexDirection: 'row',
    // margin: 20,
  },
  content: {
    flexDirection: 'row',

    backgroundColor: Colors.WHITE,
    height: '100%',
    width: '100%',
    borderColor: '#F0F2F1',
    borderWidth: 0.5,
    // ...boxShadow(Colors.BLACK),
  },
  leftContnet: {
    ...padding(8, 0, 8, 37),
    width: '90%',
  },
  arrow: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: '100%',
    width: '10%',
    paddingRight: 17.5,
  },
  row: {flexDirection: 'row', marginVertical: 3.5},
  title: {
    ...styleSheet.textStyleBasic,
    fontSize: 10,
    color: Colors.GRAY_04,
    width: '40%',
  },
  text: {
    ...styleSheet.textStyleBold,
    fontSize: 10,
    width: '60%',
  },
  rightView: {
    marginTop: 20,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    borderRadius: 8,
  },
});
