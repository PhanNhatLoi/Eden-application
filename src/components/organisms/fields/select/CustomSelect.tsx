import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {Colors} from 'src/styles';
import {useTranslation} from 'react-i18next';

type Props = {
  value: string | number | null;
  setValue: React.Dispatch<React.SetStateAction<string | number>>;
  options?: optionsType[];
  placeholder?: string;
  disabled?: boolean;
  fetchData?: {
    apiAction: any;
    labelKey?: string;
    valueKey?: string;
    defaultValue?: number;
    defaultSelectFirstItem?: boolean;
  };
};
type optionsType = {
  label: string;
  value: string | number;
};

const CustomSelect = (props: Props) => {
  const {
    value,
    setValue,
    placeholder = '',
    fetchData,
    disabled = false,
  } = props;
  const [openSelect, setOpenSelect] = React.useState<boolean>(false);
  const [options, setOptions] = useState<optionsType[]>(props.options || []);

  useEffect(() => {
    if (fetchData) {
      fetchData
        .apiAction()
        .then((res: any) => {
          const resOptions = res.map((m: any) => {
            return {
              label: m[fetchData.labelKey || 'name'],
              value: m[fetchData.valueKey || 'id'],
            };
          });
          setOptions(resOptions);
          if (fetchData.defaultSelectFirstItem) setValue(resOptions[0].value);
        })
        .catch((err: any) => console.log(err));
    }
  }, []);

  const {t} = useTranslation();
  return (
    <DropDownPicker
      dropDownDirection="BOTTOM"
      listMode="SCROLLVIEW"
      style={styles.dropDown}
      open={openSelect}
      value={value}
      items={options}
      scrollViewProps={{
        nestedScrollEnabled: true,
      }}
      disabled={disabled}
      disabledStyle={{backgroundColor: Colors.GRAY_01}}
      setOpen={setOpenSelect}
      setValue={setValue}
      placeholder={t(placeholder).toString()}
      placeholderStyle={{color: Colors.GRAY_03}}
      dropDownContainerStyle={styles.dropDown}
      modalAnimationType="slide"
      //   searchable={true}
    />
  );
};

export default CustomSelect;

const styles = StyleSheet.create({
  dropDown: {
    backgroundColor: Colors.WHITE,
    borderColor: Colors.GRAY_02,
    borderWidth: 1,
  },
});
