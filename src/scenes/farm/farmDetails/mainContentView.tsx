import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {SCREEN} from 'src/help';
import {Colors} from 'src/styles';
import {styleSheet} from 'src/styles/styleSheet';
import {FARM} from 'src/api/farm/type.d';
import {useTranslation} from 'react-i18next';
import {formatDecimal} from 'src/help/formatDecimal';
import CustomModal from 'src/components/organisms/ui/modals/Modal';
import IconAnt from 'react-native-vector-icons/AntDesign';
import * as RootNavigation from 'src/navigations/root-navigator';
import {SCREEN_NAME} from 'src/navigations/screen-name';

type Props = {
  farmDetails: FARM.Response.FarmDetails | FARM.Request.Farm | undefined;
  units: {id: number; shortName: string}[];
  units2: {id: number; shortName: string}[];
  formType: 'VIEW' | 'UPDATE';
};
const MainContentView = (props: Props) => {
  //const
  const {t} = useTranslation();
  const {farmDetails, units, units2} = props;
  //const

  //state
  const [isVisible, setIsVisible] = useState(false);
  //state

  //render Item
  const renderItem = ({
    item,
    index,
  }: {
    item: FARM.Basic.FarmProductType;
    index: number;
  }) => {
    return (
      <View
        style={{
          borderTopColor: Colors.GRAY_02,
          borderTopWidth: index === 0 ? 0 : 0.5,
          paddingVertical: 20,
        }}>
        <View style={[styleSheet.row]}>
          <Text
            style={[
              styleSheet.textStyleBold,
              {color: Colors.BLACK, fontSize: 14},
            ]}>
            {item?.productType?.name || ''}
          </Text>
        </View>
        <View
          style={[
            styleSheet.row,
            {
              marginTop: 10,
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            },
          ]}>
          <Text
            style={[
              styleSheet.textStyleBasic,
              {width: '50%', color: Colors.GRAY_DARK},
            ]}>
            {t('grossAreas')}:
          </Text>
          {item?.grossAreas?.value ? (
            <Text style={styleSheet.textStyleBasic}>
              {formatDecimal(item?.grossAreas?.value) +
                ' ' +
                units.find(f => f.id === Number(item?.grossAreas?.unitId))
                  ?.shortName}
            </Text>
          ) : (
            <Text
              style={[
                styleSheet.textStyleBasic,
                {color: Colors.GRAY_04, fontStyle: 'italic'},
              ]}>
              {t('no_data')}
            </Text>
          )}
        </View>
        <View
          style={[
            styleSheet.row,
            {
              marginTop: 10,
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            },
          ]}>
          <Text
            style={[
              styleSheet.textStyleBasic,
              {width: '50%', color: Colors.GRAY_DARK},
            ]}>
            {t('grossProductivities')}:
          </Text>
          {item?.grossProductivities?.value ? (
            <Text
              style={[
                styleSheet.textStyleBasic,
                {flexWrap: 'wrap', width: '50%', textAlign: 'right'},
              ]}>
              {formatDecimal(item?.grossProductivities?.value) +
                ' ' +
                units2.find(
                  f => f.id === Number(item.grossProductivities.unitId),
                )?.shortName +
                '/' +
                t('YEAR')}
            </Text>
          ) : (
            <Text
              style={[
                styleSheet.textStyleBasic,
                {color: Colors.GRAY_04, fontStyle: 'italic'},
              ]}>
              {t('no_data')}
            </Text>
          )}
        </View>

        <View
          style={[
            styleSheet.row,
            {
              marginTop: 10,
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            },
          ]}>
          <Text
            style={[
              styleSheet.textStyleBasic,
              {width: '50%', color: Colors.GRAY_DARK},
            ]}>
            {t('farmingSeasonNumber')}:
          </Text>
          {item?.farmingSeasonNumber ? (
            <Text style={styleSheet.textStyleBasic}>
              {item?.farmingSeasonNumber}
            </Text>
          ) : (
            <Text
              style={[
                styleSheet.textStyleBasic,
                {color: Colors.GRAY_04, fontStyle: 'italic'},
              ]}>
              {t('no_data')}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.mainInfoView}>
      <TouchableOpacity
        disabled={props.formType === 'VIEW'}
        onPress={() => {
          RootNavigation.navigate(SCREEN_NAME.ADD_FARM, {step: 0});
        }}>
        <Text
          style={{
            ...styleSheet.textStyleBold,
            textAlign: 'center',
            fontSize: 16,
          }}>
          {farmDetails?.name || t('emptyName')}
        </Text>
      </TouchableOpacity>
      <View style={{...styleSheet.row, marginTop: 18}}>
        <View>
          <Text style={styles.fontSizeInfo}>{t('totalArea')}:</Text>
          {farmDetails?.products && farmDetails?.products.length === 1 && (
            <>
              <Text style={[styles.fontSizeInfo, {marginTop: 5}]}>
                {t('crops')}:
              </Text>
              <Text style={[styles.fontSizeInfo, {marginTop: 5}]}>
                {t('grossAreas')}:
              </Text>
              <Text style={[styles.fontSizeInfo, {marginTop: 5}]}>
                {t('farmingSeasonNumber')}:
              </Text>
            </>
          )}
          <Text style={[styles.fontSizeInfo, {marginTop: 5}]}>
            {t('productionCapacity')}:
          </Text>
        </View>
        <View style={{marginLeft: 30}}>
          <TouchableOpacity
            disabled={props.formType === 'VIEW'}
            onPress={() => {
              RootNavigation.navigate(SCREEN_NAME.ADD_FARM, {step: 2});
            }}>
            <Text style={[styleSheet.textStyleBold, {fontSize: 12}]}>
              {farmDetails?.grossArea.value &&
                `${formatDecimal(farmDetails?.grossArea?.value)} ${
                  units.find(
                    f => f.id === Number(farmDetails?.grossArea?.unitId),
                  )?.shortName
                }`}
            </Text>
          </TouchableOpacity>

          {farmDetails?.products && farmDetails?.products.length > 1 ? (
            <TouchableOpacity onPress={() => setIsVisible(true)}>
              <Text
                style={[
                  styleSheet.textStyleBasic,
                  {color: Colors.SYS_DETAILS, fontSize: 12, marginTop: 5},
                ]}>
                {t('view_details')}
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <View>
                {farmDetails?.products[0] &&
                farmDetails?.products[0].productType.name ? (
                  <Text
                    style={[
                      styleSheet.textStyleBold,
                      {color: Colors.BLACK, fontSize: 12, marginTop: 5},
                    ]}>
                    {farmDetails?.products[0].productType.name}
                  </Text>
                ) : (
                  <Text
                    style={[
                      styleSheet.textStyleBold,
                      {
                        color: Colors.GRAY_03,
                        fontSize: 12,
                        marginTop: 5,
                        fontStyle: 'italic',
                      },
                    ]}>
                    {t('no_data')}
                  </Text>
                )}
              </View>
              <View>
                {farmDetails?.products[0] &&
                farmDetails?.products[0].grossAreas.value ? (
                  <Text
                    style={[
                      styleSheet.textStyleBold,
                      {color: Colors.BLACK, fontSize: 12, marginTop: 5},
                    ]}>
                    {formatDecimal(farmDetails?.products[0].grossAreas.value)}{' '}
                    {
                      units.find(
                        f => f.id === farmDetails.products[0].grossAreas.unitId,
                      )?.shortName
                    }
                  </Text>
                ) : (
                  <Text
                    style={[
                      styleSheet.textStyleBold,
                      {
                        color: Colors.GRAY_03,
                        fontSize: 12,
                        marginTop: 5,
                        fontStyle: 'italic',
                      },
                    ]}>
                    {t('no_data')}
                  </Text>
                )}
              </View>
              <View>
                {farmDetails?.products[0] &&
                farmDetails?.products[0].farmingSeasonNumber ? (
                  <Text
                    style={[
                      styleSheet.textStyleBold,
                      {color: Colors.BLACK, fontSize: 12, marginTop: 5},
                    ]}>
                    {formatDecimal(
                      farmDetails?.products[0].farmingSeasonNumber,
                    )}
                  </Text>
                ) : (
                  <Text
                    style={[
                      styleSheet.textStyleBold,
                      {
                        color: Colors.GRAY_03,
                        fontSize: 12,
                        marginTop: 5,
                        fontStyle: 'italic',
                      },
                    ]}>
                    {t('no_data')}
                  </Text>
                )}
              </View>
              <View>
                {farmDetails?.products[0] &&
                farmDetails?.products[0].grossProductivities.value ? (
                  <Text
                    style={[
                      styleSheet.textStyleBold,

                      {
                        color: Colors.BLACK,
                        fontSize: 12,
                        marginTop: 5,
                      },
                    ]}>
                    {formatDecimal(
                      farmDetails?.products[0].grossProductivities.value,
                    )}{' '}
                    {units2.find(
                      f =>
                        f.id ===
                        farmDetails.products[0].grossProductivities.unitId,
                    )?.shortName +
                      '/' +
                      t('YEAR')}
                  </Text>
                ) : (
                  <Text
                    style={[
                      styleSheet.textStyleBold,
                      {
                        color: Colors.GRAY_03,
                        fontSize: 12,
                        marginTop: 5,
                        fontStyle: 'italic',
                      },
                    ]}>
                    {t('no_data')}
                  </Text>
                )}
              </View>
            </>
          )}
        </View>
      </View>

      <CustomModal isVisible={isVisible} setIsVisible={setIsVisible}>
        <View style={styles.modal}>
          <View style={styles.containerModal}>
            <View
              style={{
                height: 60,
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                paddingHorizontal: 20,
                borderBottomColor: Colors.GRAY_LINE,
                borderBottomWidth: 1,
              }}>
              <IconAnt name="close" size={17} color={Colors.WHITE} />
              <Text style={[styleSheet.textStyleBold, {fontSize: 16}]}>
                {t('productionCapacity')}
              </Text>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <IconAnt name="close" size={20} color={Colors.BLACK_03} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={farmDetails?.products || []}
              renderItem={renderItem}
              contentContainerStyle={{paddingHorizontal: 20}}
            />
          </View>
        </View>
      </CustomModal>
    </View>
  );
};

export default MainContentView;

const styles = StyleSheet.create({
  mainInfoView: {
    width: SCREEN.width - 60,
    borderRadius: 8,
    backgroundColor: Colors.WHITE,
    ...styleSheet.shadown,
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: -50,
  },
  fontSizeInfo: {
    ...styleSheet.textStyleBasic,
    fontSize: 12,
  },
  modal: {
    height: '100%',
    width: '100%',
    justifyContent: 'space-between',
  },
  containerModal: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
    // paddingHorizontal: 20,
    // paddingVertical: 10,
  },
});
