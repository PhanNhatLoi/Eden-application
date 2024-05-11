import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {styleSheet} from 'src/styles/styleSheet';
import {Colors} from 'src/styles';
import {SCREEN} from 'src/help';
import {SEASON} from 'src/api/season/type.d';
import {FieldDropsDownModal} from 'src/components/organisms';
import TextInput from 'src/components/molecules/TextInput';

type OptionsType = {
  label: string;
  value: number;
};

type Props = {
  item: SEASON.Request.Classifications;
  indexItem: number;
  options: OptionsType[];
  disabledItem?: (number | null)[];
  totalValue: number;
  onChange: (
    value: number | null,
    name: 'typeId' | 'value',
    indexSelect: number,
  ) => void;
};
const ClassificationItem = (props: Props) => {
  const {indexItem, options, onChange, disabledItem = [], item} = props;
  return (
    <View style={styles.item}>
      <View style={{flex: 1, marginRight: 10}}>
        <FieldDropsDownModal
          disabledItem={disabledItem}
          loading={false}
          options={options}
          placeholder={'allotment'}
          defaultValue={(item.typeId && [item.typeId]) || []}
          onSelectItem={value => {
            onChange(value.value, 'typeId', indexItem);
          }}
        />
      </View>

      <View
        style={{
          ...styleSheet.filedText,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: (SCREEN.width - 40 - 10) * 0.5,
        }}>
        <TextInput
          style={{flex: 1, height: 40}}
          defaultValue={item.value?.toString() || ''}
          placeholderTextColor={Colors.GRAY_DARK}
          onChangeText={e => {
            onChange((e && Number(e)) || null, 'value', indexItem);
          }}
          keyboardType="decimal-pad"
        />
        <Text style={styleSheet.textStyleBasic}>%</Text>
      </View>
    </View>
  );
};

export default ClassificationItem;

const styles = StyleSheet.create({
  item: {flexDirection: 'row', justifyContent: 'space-between'},
  filedTextUnit: {
    ...styleSheet.filedText,
    width: (SCREEN.width - 40 - 10) * 0.5,
  },
});
