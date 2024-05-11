import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SEASON} from 'src/api/season/type.d';
import {getMasterData} from 'src/api/appData/actions';

import {styleSheet} from 'src/styles/styleSheet';
import {SCREEN} from 'src/help';

import ClassificationItem from './ClassificationItem';

type Props = {
  data: SEASON.Request.Classifications[];
  onChangeItem: (item: SEASON.Request.Classifications[]) => void;
  totalValue: number;
};

type OptionsType = {
  label: string;
  value: number;
};
const MultipeClassifications = (props: Props) => {
  const {data, onChangeItem, totalValue = 0} = props;
  const [classifications, setClassifications] = useState<OptionsType[]>([]);

  useEffect(() => {
    fetchSize();
  }, []);

  const fetchSize = async () => {
    try {
      const res = await getMasterData('PERCENT_SIZE');
      const format: OptionsType[] = res.map((obj: any) => ({
        label: obj.name,
        value: obj.id,
      }));
      setClassifications(format);
    } catch (error) {
      console.log('🚀 ~ file: step4.tsx:33 ~ fetchUnit ~ error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {data.map((m, i: number) => (
        <ClassificationItem
          disabledItem={data.map(m => m.typeId)}
          totalValue={totalValue}
          key={i}
          item={m}
          indexItem={i}
          options={classifications}
          onChange={(value, name: 'typeId' | 'value', index: number) => {
            const newItems = data.map((item, idItem) => {
              return idItem === index
                ? {
                    ...item,
                    [name]: value,
                  }
                : item;
            });
            onChangeItem(newItems);
          }}
        />
      ))}
    </View>
  );
};

export default MultipeClassifications;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  item: {flexDirection: 'row', justifyContent: 'space-between'},
  filedTextUnit: {
    ...styleSheet.filedText,
    width: (SCREEN.width - 40 - 10) * 0.5,
  },
});
