import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {t} from 'i18next';
import DatePicker from 'react-native-date-picker';
import {ICON} from 'src/assets';
import {styleSheet} from 'src/styles/styleSheet';
import {Colors} from 'src/styles';

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  dateTime?: Date;
  setDateTime: React.Dispatch<React.SetStateAction<Date | undefined>>;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  minimumDate?: Date;
  mode?: 'date' | 'time' | 'datetime';
};

const CustomDatePicker = (props: Props) => {
  const {
    setOpen,
    open,
    dateTime,
    setDateTime,
    title = 'date',
    confirmText = 'confirm',
    cancelText = 'cancel',
    mode = 'date',
    minimumDate,
  } = props;
  return (
    <TouchableOpacity onPress={() => setOpen(true)}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image source={ICON['calendar']} />
        <View style={{marginLeft: 10}}>
          <Text style={styleSheet.textStyleBasic}>{t(title)}</Text>

          {dateTime ? (
            <Text style={styleSheet.textStyleBasic}>
              {dateTime.toLocaleDateString('vi-VN')}
            </Text>
          ) : (
            <Text style={{...styleSheet.textStyleBasic, color: Colors.GRAY_03}}>
              {t('select_date')}
            </Text>
          )}
        </View>
      </View>
      <DatePicker
        locale="vi-VN"
        modal
        minimumDate={minimumDate}
        confirmText={t(confirmText).toString()}
        cancelText={t(cancelText).toString()}
        mode={mode}
        title={t('select') + ' ' + t(title).toString().toLocaleLowerCase()}
        open={open}
        date={dateTime || minimumDate || new Date()}
        onConfirm={date => {
          setOpen(false);
          setDateTime(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </TouchableOpacity>
  );
};

export default CustomDatePicker;

const styles = StyleSheet.create({});
