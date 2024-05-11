import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Colors} from 'src/styles';
import {styleSheet} from 'src/styles/styleSheet';
import {ICON} from 'src/assets';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {
  require?: boolean;
  icon: React.ReactNode;
  title: string;
  data: any[];
  handlePress?: () => void;
};

const ItemBox = (props: Props) => {
  const {
    require = false,
    icon,
    title = '',
    data = [],
    handlePress = () => {},
  } = props;
  const {t} = useTranslation();
  const CircleBox = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          handlePress();
        }}>
        {data && data.length ? (
          <View style={styles.circleBox}>
            <Text
              style={{
                ...styleSheet.textStyleBasic,
                color: Colors.WHITE,
                fontSize: 12,
              }}>
              {t('view/edit')}
            </Text>
          </View>
        ) : (
          <View style={styles.circleBoxEmpty}>
            <Icon name="add" size={12} color={Colors.GRAY_03} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.box, {borderWidth: require && !data.length ? 1 : 0}]}>
      <View style={{alignItems: 'flex-end', height: 10, width: '100%'}}>
        {require && (
          <Image source={ICON['exclamation']} style={{height: 15, width: 15}} />
        )}
      </View>
      <CircleBox />
      <View style={styles.title}>
        {icon}
        <Text
          style={{...styleSheet.textStyleBasic, marginLeft: 5, fontSize: 12}}>
          {title}
        </Text>
      </View>
    </View>
  );
};

export default ItemBox;
const styles = StyleSheet.create({
  box: {
    height: 168,
    width: 168,
    backgroundColor: Colors.WHITE,
    ...styleSheet.listSpace,
    marginHorizontal: 7,
    borderRadius: 8,
    padding: 8,
    paddingBottom: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: Colors.CANCLE_BUTTON,
    ...styleSheet.shadown,
  },
  circleBox: {
    borderRadius: 100,
    backgroundColor: Colors.SYS_BUTTON,
    height: 70,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  circleBoxEmpty: {
    borderRadius: 100,
    borderWidth: 0.5,
    borderColor: Colors.GRAY_03,
    borderStyle: 'dashed',
    height: 70,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
