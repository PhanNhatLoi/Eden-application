import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import Octicons from 'react-native-vector-icons/Octicons';
import FieldDropDown from 'src/components/organisms/appForm/FieldDropDown';
import {useTranslation} from 'react-i18next';
import {Colors} from 'src/styles';
import {getMasterData} from 'src/api/appData/actions';
import {styleSheet} from 'src/styles/styleSheet';
import TextInput from 'src/components/molecules/TextInput';

type classificationsType = {
  value: number;
  typeId: number | null;
};

const initValue: classificationsType = {
  value: 0,
  typeId: null,
};

type optionsType = {
  label: string;
  value: number;
  disabled: boolean;
};

type Props = {
  setData: React.Dispatch<React.SetStateAction<classificationsType[]>>;
  data: classificationsType[];
};

const MultipleValue = (props: Props) => {
  const {setData, data} = props;
  const {t} = useTranslation();
  const [value, setValue] = useState<classificationsType[]>(
    (data.length && data) || [initValue],
  );

  const [sizes, setSizes] = useState<optionsType[]>([]);
  const [showAddButton, setShowAddButton] = useState<boolean>(false);

  const UpdateSizeItems = (newValue: classificationsType[]) => {
    const temp = sizes.map(m => {
      return {
        ...m,
        disabled: newValue.some(s => s.typeId === m.value),
      };
    });
    setSizes(temp);
  };

  const fetchSize = async () => {
    try {
      const res = await getMasterData('PERCENT_SIZE');
      const format: optionsType[] = res.map((obj: any) => ({
        label: obj.name,
        value: obj.id,
        disabled: value.some(f => f.typeId === obj.id),
      }));
      setSizes(format);
    } catch (error) {
      console.log('🚀 ~ file: step4.tsx:33 ~ fetchUnit ~ error:', error);
    }
  };

  useEffect(() => {
    fetchSize();
  }, [data]);

  useEffect(() => {
    UpdateSizeItems(value);
  }, [value]);

  const handleChangeValue = (
    key: string,
    indexValue: number,
    index: number,
  ) => {
    let count = 0;
    let newValue = indexValue;
    if (key === 'value' && isNaN(newValue)) newValue = value[index].value; // key pressed should be the number
    const temp = value.map((m, i) => {
      if (i < value.length - 1) count += m.value; //count sum percent
      if (i === value.length - 1) {
        if (key === 'value' && count + newValue >= 100) {
          newValue = 100 - count;
        }
      }
      return i < value.length - 1
        ? m
        : {
            ...m,
            [key]: newValue,
          };
    });

    //disabled item selected
    //if last item have typeId and sum percent not enough 100%
    if (
      temp[temp.length - 1].typeId &&
      temp[temp.length - 1].value !== 0 &&
      count + newValue !== 100
    )
      setShowAddButton(true);
    else setShowAddButton(false); // enough 100%
    setValue(temp); // save value
    setData(temp); //return data
  };

  const editable = (index: number): boolean => {
    if (index === value.length - 1) return true;
    return false;
  };

  return (
    <View>
      {value.map((m, index) => {
        return (
          <View style={{zIndex: -index}} key={index}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 2, paddingRight: 10}}>
                <FieldDropDown
                  width={'100%'}
                  disabled={!editable(index)}
                  placeholder={t('allotment').toString()}
                  dropDownPickerProps={{
                    items: sizes,
                    searchPlaceholder: t('allotment').toString(),
                  }}
                  title=""
                  isRequired
                  defaultValue={m.typeId || undefined}
                  name={index.toString()}
                  onSelectItem={(v: {value: number; label: string}) => {
                    handleChangeValue('typeId', v.value, index);
                  }}
                />
              </View>
              <View style={{flex: 2, paddingLeft: 10}}>
                <View
                  style={{
                    ...styleSheet.filedText,
                    backgroundColor: editable(index)
                      ? Colors.WHITE
                      : Colors.GRAY_02,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <TextInput
                    style={{height: 50, width: '90%'}}
                    editable={editable(index)}
                    placeholderTextColor={Colors.GRAY_DARK}
                    onChangeText={e =>
                      handleChangeValue('value', Number(e), index)
                    }
                    value={
                      (value[index].value && value[index].value.toString()) ||
                      ''
                    }
                    keyboardType="decimal-pad"
                  />
                  <Text style={styleSheet.textStyleBasic}>%</Text>
                </View>
              </View>
            </View>
          </View>
        );
      })}
      {showAddButton ? (
        <View style={{alignItems: 'flex-end'}}>
          <TouchableOpacity
            onPress={() => {
              setValue([...value, {...initValue}]);
              setShowAddButton(false);
            }}>
            <Octicons name="diff-added" size={25} color={Colors.GRAY_DARK} />
          </TouchableOpacity>
        </View>
      ) : (
        value.length !== 1 && (
          <View style={{alignItems: 'flex-end'}}>
            <TouchableOpacity
              onPress={() => {
                setValue(value.filter(f => f !== value[value.length - 1]));
                setShowAddButton(true);
              }}>
              <Octicons name="diff-removed" size={25} />
            </TouchableOpacity>
          </View>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default MultipleValue;
