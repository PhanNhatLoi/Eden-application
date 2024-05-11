/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInputKeyPressEventData,
  TextInputProps,
  View,
} from 'react-native';
import {Colors} from 'src/styles';
import {styleSheet} from 'src/styles/styleSheet';
import {FieldTitle} from '../../molecules';
import {ErrorMessage, Field} from 'formik';
import {SCREEN} from 'src/help';
import {getUnit} from 'src/api/appData/actions';
import {optionsType} from './FieldDropDown';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/AntDesign';
import TextInput from 'src/components/molecules/TextInput';
import {formatDecimal} from 'src/help/formatDecimal';
import {first, last} from 'lodash';
import {useTranslation} from 'react-i18next';

type FieldTextInputWithUnitProps = {
  isRequired?: boolean;
  textInputProps?: TextInputProps;
  name: string;
  title: string;
  onChangeUnit?: (unit: any) => void;
  onChangeUnitName?: (unitName: string) => void;
  unit?: 'ACREAGE' | 'MASS' | 'TIME' | 'DENSITY';
  unitKey?: 'name' | 'id';
  unitName?: string;
  defaultUnitValue?: number | string;
  disabled?: boolean;
  autoFocus?: boolean;
  unitWidth?: number;
  options?: optionsType[];
  supportOtherUnit?: boolean;
};

const FieldTextInputWithUnit = (props: FieldTextInputWithUnitProps) => {
  const {
    isRequired = false,
    textInputProps,
    name,
    title,
    unit,
    unitKey = 'id',
    unitName = '',
    defaultUnitValue,
    disabled = false,
    autoFocus = false,
    unitWidth = 130,
    supportOtherUnit = false,
    options = [],
    onChangeUnit,
    onChangeUnitName,
  } = props;
  const [items, setItems] = React.useState<optionsType[]>(
    (options.length && options) || [],
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  const [keyValidate, setKeyValidate] = React.useState<boolean>(true);
  const [value, setValue] = React.useState<string>('');
  const [tempValue, setTempValue] = React.useState<string>(
    textInputProps?.defaultValue?.replace('.', ',') || '',
  );
  const [valueUnit, setValueUnit] = React.useState<number>(
    Number(defaultUnitValue),
  );
  const {t} = useTranslation();

  //check press key value
  //if validate set new value, onchange text for form
  React.useEffect(() => {
    const valueReturn = tempValue.split('.').join('');
    if (keyValidate) {
      setValue(
        formatDecimal(valueReturn.replace(',', '.')) +
          (last(valueReturn) === ',' ? ',' : ''),
      );
      textInputProps?.onChangeText &&
        textInputProps?.onChangeText(
          Number(valueReturn.replace(',', '.')).toString(),
        );
    }
  }, [tempValue]);

  //fetch data by unit key
  React.useEffect(() => {
    setLoading(true);
    fetchUnit();
  }, [unit]);

  // fetch data by options
  React.useEffect(() => {
    if (items.length) {
      onChangeUnit &&
        onChangeUnit(
          (defaultUnitValue && Number(defaultUnitValue)) || items[0].value,
        );
      onChangeUnitName &&
        onChangeUnitName((unitName && unitName) || items[0].label);
    }
  }, [items]);

  //function fetchUnit
  const fetchUnit = async () => {
    try {
      if (unit) {
        // fetch value by api get unit masterData
        if (unit === 'TIME') {
          // hard code option
          setItems([{label: '/Năm', value: 0}]);
          setValue('');
        } else {
          const res = await getUnit(unit);
          const format = res.map((obj: any) => ({
            label: obj.shortName,
            value: obj[unitKey],
          }));
          setItems(format);
          onChangeUnit?.(
            defaultUnitValue
              ? format.find(
                  (f: {label: string; value: string | number}) =>
                    f.value === defaultUnitValue,
                ).value
              : format[0].value,
          );
        }
      }
    } catch (error) {
      console.log(
        '🚀 ~ file: FieldTextInputWithUnit ~ fetchUnit ~ error:',
        error,
      );
    }
    setLoading(false);
  };

  const styles = StyleSheet.create({
    filedMultipeLineText: {
      ...styleSheet.textStyleBasic,
      padding: 10,
      backgroundColor: Colors.WHITE,
      borderWidth: 1,
      borderRadius: 8,
      width: SCREEN.width - 40,
      height: 100,
      marginTop: 10,
      borderColor: Colors.GRAY_MEDIUM,
      textAlignVertical: 'top',
    },
    filedText: {
      ...styleSheet.filedText,
      width: SCREEN.width - 40 - unitWidth - 10,
      marginRight: 10,
    },
    filedTextUnit: {
      ...styleSheet.filedText,
      width: unitWidth,
      backgroundColor: disabled ? Colors.GRAY_01 : Colors.WHITE,
    },
    dropDownContainerStyle: {
      ...styleSheet.filedText,
      width: unitWidth,
      height: 150,
    },
  });

  const itemDropDown = ({
    selectedItem,
    isSelected,
  }: {
    selectedItem: optionsType;
    index: number;
    isSelected?: boolean | undefined;
  }) => {
    return (
      <View
        style={{
          paddingHorizontal: 10,
          height: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: isSelected ? Colors.SYS_BUTTON : Colors.WHITE,
        }}>
        <Text
          style={{
            ...styleSheet.textStyleBasic,
            textAlign: 'center',
            color: isSelected ? Colors.WHITE : Colors.BLACK,
            flex: 1,
          }}>
          {selectedItem.label}
        </Text>
        {/* {isSelected && <Icon name="check" size={20} color={Colors.BLACK} />} */}
      </View>
    );
  };
  return (
    <>
      <FieldTitle isRequired={isRequired} title={title} />
      <View style={styleSheet.row}>
        <TextInput
          editable={!disabled}
          autoFocus={autoFocus}
          maxLength={13}
          placeholderTextColor={Colors.GRAY_DARK}
          style={{
            ...styles.filedText,
            backgroundColor: disabled
              ? Colors.GRAY_01
              : styleSheet.filedText.backgroundColor,
          }}
          keyboardType="numeric"
          value={value}
          {...textInputProps}
          onKeyPress={e => {
            if (value.includes(',') && e.nativeEvent.key === ',') {
              setKeyValidate(false);
            } else setKeyValidate(true);
          }}
          onChangeText={v => {
            setTempValue(v);
          }}
          placeholder={textInputProps?.placeholder || title}
        />

        <SelectDropdown
          disabled={disabled}
          buttonStyle={styles.filedTextUnit}
          defaultButtonText=" "
          defaultValue={
            items.find(f => f.value === defaultUnitValue) || items[0]
          }
          renderDropdownIcon={() => (
            <Icon name="down" size={20} color={Colors.BLACK} />
          )}
          renderCustomizedRowChild={(selectedItem, index, isSelected) =>
            itemDropDown({selectedItem, index, isSelected})
          }
          buttonTextStyle={styleSheet.textStyleBasic}
          rowTextStyle={styleSheet.textStyleBasic}
          data={items}
          onSelect={(selectedItem: optionsType, index) => {
            onChangeUnit && onChangeUnit(selectedItem.value);
            onChangeUnitName && onChangeUnitName(selectedItem.label);
            setValueUnit(selectedItem.value);
            if (selectedItem.value === 5 && selectedItem.label === 'Khác') {
              onChangeUnitName && onChangeUnitName('');
            }
          }}
          buttonTextAfterSelection={(selectedItem: optionsType, index) => {
            return selectedItem.label;
          }}
          rowTextForSelection={(item: optionsType, index) => {
            return item.label;
          }}
        />
      </View>
      {valueUnit === 5 && supportOtherUnit && (
        <TextInput
          editable={!disabled}
          placeholderTextColor={Colors.GRAY_DARK}
          style={{
            ...styles.filedText,
            alignSelf: 'flex-end',
            width: unitWidth,
            marginRight: 0,
            backgroundColor: disabled
              ? Colors.GRAY_02
              : styleSheet.filedText.backgroundColor,
          }}
          defaultValue={unitName}
          onChangeText={v => {
            onChangeUnitName && onChangeUnitName(v);
          }}
          placeholder={t('unit').toString()}
        />
      )}

      <Text style={styleSheet.errorTextStyle}>
        <ErrorMessage name={name} />
      </Text>
    </>
  );
};

export default FieldTextInputWithUnit;
