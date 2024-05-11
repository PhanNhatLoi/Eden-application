import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {optionsType} from './FieldDropDown';
import {Colors} from 'src/styles';
import IconFigma from '../ui/Image/IconFigma';
import IconIon from 'react-native-vector-icons/Ionicons';
import {styleSheet} from 'src/styles/styleSheet';

type Props = {
  item: optionsType;
  multi?: boolean;
  setCurrentValue: React.Dispatch<React.SetStateAction<optionsType[]>>;
  defaultCheck: boolean;
  disabled?: boolean;
};
export const ArrayListSelect = (props: Props) => {
  const {
    item,
    multi = false,
    setCurrentValue,
    defaultCheck,
    disabled = false,
  } = props;
  const [checked, setChecked] = useState<boolean>(defaultCheck);

  useEffect(() => {
    if (!multi) {
      setChecked(defaultCheck);
    }
  }, [defaultCheck]);

  const styles = StyleSheet.create({
    //input style
    input: {
      backgroundColor: Colors.WHITE,
      justifyContent: 'center',
      marginTop: 10,
      marginBottom: 10,
      borderRadius: 8,
      borderColor: Colors.GRAY_02,
      borderWidth: 0.8,
      padding: 10,
    },
    //button style
    button: {
      height: 60,
      backgroundColor: Colors.WHITE,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      width: '48%',
    },

    //container modals
    container: {
      height: '100%',
      width: '100%',
      backgroundColor: Colors.WHITE,
      paddingBottom: 10,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
    },

    //content center
    center: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    //border bottom
    borderBottom: {
      borderBottomColor: Colors.GRAY_02,
      borderBottomWidth: 0.5,
    },

    //item select modals style
    item: {
      flexDirection: 'row',
      minHeight: 50,
      borderBottomColor: Colors.GRAY_02,
      borderBottomWidth: 0.5,
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginBottom: 0.5,
      backgroundColor: disabled ? Colors.GRAY_01 : Colors.WHITE,
    },

    //item selected input style
    itemSelected: {
      backgroundColor: Colors.WHITE,
      height: 40,
      padding: 10,
      borderRadius: 8,
      borderWidth: 0.8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 4,
    },
  });

  return (
    <TouchableOpacity
      disabled={disabled}
      style={styles.item}
      onPress={() => {
        multi && setChecked(!checked);
        setCurrentValue((pre: optionsType[]) => {
          if (pre.some(s => s.value === item.value)) {
            if (multi) {
              return pre.filter(f => f.value !== item.value);
            } else return [];
          } else {
            if (multi) {
              return [...pre, item];
            } else return [item];
          }
        });
      }}>
      <View style={{flex: 1}}>
        <Text
          style={
            item.subTitle ? styleSheet.textStyleBold : styleSheet.textStyleBasic
          }>
          {item.label}
        </Text>
        {item.subTitle && (
          <Text
            style={[
              styleSheet.textStyleBasic,
              {fontSize: 12, color: Colors.GRAY_04},
            ]}>
            {item.subTitle}
          </Text>
        )}
      </View>
      <View>
        {multi ? (
          checked ? (
            <IconIon name={'checkbox'} color={Colors.SYS_BUTTON} size={25} />
          ) : (
            <IconIon name={'square'} color={Colors.GRAY_02} size={25} />
          )
        ) : checked ? (
          <IconFigma name={'checkCircle'} />
        ) : (
          <IconFigma name={'circle'} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default connect(null, {})(ArrayListSelect);
