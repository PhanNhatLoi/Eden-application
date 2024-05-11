import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {styleSheet} from 'src/styles/styleSheet';
import {FieldTitle} from '../../molecules';
import {ErrorMessage} from 'formik';
import DropDownPicker, {
  DropDownPickerProps,
  ValueType,
} from 'react-native-dropdown-picker';
import {Colors} from 'src/styles';
import {SCREEN} from 'src/help';
export type optionsType = {
  label: string;
  value: number;
  subTitle?: string;
};

type FieldDropDownProps = {
  isRequired?: boolean;
  dropDownPickerProps: Omit<
    DropDownPickerProps<ValueType>,
    'open' | 'setOpen' | 'value' | 'setValue' | 'multiple'
  >;
  title: string;
  name: string;
  width?: number | string;
  disabled?: boolean;
  defaultValue?: number | (number | undefined)[] | null | undefined | undefined;
  onSelectItem?: (item: any) => void;
  placeholder?: string;
};
const Empty = () => {
  return <Text>Empty</Text>;
};
const FieldDropDown = (props: FieldDropDownProps) => {
  const {
    isRequired = false,
    dropDownPickerProps,
    name,
    title,
    width = SCREEN.width - 40,
    disabled = false,
    placeholder = '',
    onSelectItem = _ => {},
  } = props;
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(props.defaultValue || null);
  const myProps: any = {
    searchTextInputStyle: {borderColor: Colors.GRAY_MEDIUM},
    searchContainerStyle: {borderColor: Colors.GRAY_MEDIUM},
    ListEmptyComponent: Empty,
    searchable: false,
    style: {...styles.dropdownStyle, width: width},
    dropDownContainerStyle: {...styles.dropdownStyle, width: width},
    open: open,
    setOpen: setOpen,
    multiple: false,
    value: value,
    setValue: setValue,
    ...dropDownPickerProps,
  };
  return (
    <View style={styles.container}>
      <FieldTitle isRequired={isRequired} title={title} />
      <View style={styles.dropdown}>
        <DropDownPicker
          {...myProps}
          disabled={disabled}
          listMode="SCROLLVIEW"
          scrollViewProps={{
            nestedScrollEnabled: true,
          }}
          disabledStyle={{
            backgroundColor: disabled ? Colors.GRAY_02 : Colors.WHITE,
          }}
          // closeOnBackPressed={true}
          disabledItemContainerStyle={{backgroundColor: Colors.GRAY_02}}
          placeholder={placeholder}
          placeholderStyle={{color: Colors.GRAY_03}}
          onSelectItem={onSelectItem}
        />
      </View>
      <Text style={styleSheet.errorTextStyle}>
        <ErrorMessage name={name} />
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    // marginTop: 15,
  },
  dropdown: {
    ...styleSheet.center,
    marginTop: 10,
  },
  dropdownStyle: {
    borderColor: Colors.GRAY_MEDIUM,
  },
});

export default FieldDropDown;
