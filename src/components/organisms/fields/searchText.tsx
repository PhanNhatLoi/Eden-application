import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
// import {TextInput} from 'react-native-gesture-handler';
import {Colors} from 'src/styles';
import Icon from 'react-native-vector-icons/Fontisto';
import {useTranslation} from 'react-i18next';
import TextInput from 'src/components/molecules/TextInput';

type Props = {
  placeholder?: string;
  onChangeText: (value: string) => void;
  defaultValue?: string;
  autoFocus?: boolean;
};
const SearchText = (props: Props) => {
  const {
    placeholder = 'search',
    onChangeText = _ => {},
    defaultValue = '',
    autoFocus = false,
  } = props;
  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <TextInput
        autoFocus={autoFocus}
        placeholderTextColor={Colors.GRAY_03}
        style={{flex: 1, color: Colors.BLACK}}
        placeholder={t(placeholder).toString() + '...'}
        onChangeText={val => onChangeText(val)}
        defaultValue={defaultValue}
      />
      <Icon name="search" size={20.7} color={Colors.GRAY_03} />
    </View>
  );
};

export default SearchText;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.GRAY_02,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
