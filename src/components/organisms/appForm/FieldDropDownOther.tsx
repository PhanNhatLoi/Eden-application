/* eslint-disable react-native/no-inline-styles */

import * as React from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {styleSheet} from 'src/styles/styleSheet';
import {SCREEN} from 'src/help';
import {FieldTextInput} from 'src/components/organisms';
import {Colors} from 'src/styles';
import IconFigma from '../ui/Image/IconFigma';
import {FieldTitle} from 'src/components/molecules';
import prompt from 'react-native-prompt-android';
import {useTranslation} from 'react-i18next';

type FieldDropDownOtherProps = {
  title: string;
  disabled?: boolean;
  defaultValue?: string;
  placeholder?: string;
  autoFocus?: boolean;
  onChange?: (val: string) => void;
  onRemove?: () => void;
};
const FieldDropDownOther = (props: FieldDropDownOtherProps) => {
  const {
    title,
    disabled,
    defaultValue,
    autoFocus = false,
    placeholder = '',
    onRemove = () => {},
    onChange = () => {},
  } = props;

  const {t} = useTranslation();
  return (
    <View style={[styleSheet.row, {alignItems: 'flex-end'}]}>
      <View style={{width: '90%'}}>
        <FieldTitle isRequired={false} title={title} />
        <TouchableOpacity
          onPress={() => {
            prompt(
              title,
              '',
              [
                {
                  text: t('cancel').toString(),
                  onPress: () => {},
                  style: 'destructive',
                },
                {
                  text: t('confirm').toString(),
                  onPress: onChange,
                },
              ],
              {
                defaultValue: defaultValue || '',
                placeholder: placeholder,
              },
            );
          }}
          style={{
            ...styleSheet.filedText,
            width: '100%',
            justifyContent: 'center',
          }}>
          {defaultValue ? (
            <Text style={styleSheet.textStyleBasic}>{defaultValue}</Text>
          ) : (
            <Text
              style={[
                styleSheet.textStyleBasic,
                {fontStyle: 'italic', color: Colors.GRAY_03},
              ]}>
              {placeholder}
            </Text>
          )}
        </TouchableOpacity>
      </View>
      {
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'flex-end',
            width: '10%',
            height: 50,
          }}>
          <TouchableOpacity disabled={disabled} onPress={() => onRemove()}>
            <IconFigma
              name={disabled ? 'remove_ICON_DISABLED' : 'remove_ICON'}
              size={30}
            />
          </TouchableOpacity>
        </View>
      }
    </View>
  );
};
export default FieldDropDownOther;
