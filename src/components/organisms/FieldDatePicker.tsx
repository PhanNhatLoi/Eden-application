import * as React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {styleSheet} from 'src/styles/styleSheet';
import {FieldTitle} from '../molecules';
import {ErrorMessage} from 'formik';
import DatePicker from 'react-native-date-picker';
import {useState} from 'react';
import {ICON} from 'src/assets';
import {useTranslation} from 'react-i18next';

type FieldDatePickerProps = {
  isRequired?: boolean;
  title: string;
  name: string;
  onSelectItem?: (item: any) => void;
  value: Date;
};

const FieldDatePicker = (props: FieldDatePickerProps) => {
  const {
    isRequired = false,
    name,
    title,
    onSelectItem = _ => {},
    value = new Date(),
  } = props;
  const {t} = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.container}>
      <FieldTitle isRequired={isRequired} title={title} />
      <View style={styles.picker}>
        <TouchableOpacity
          onPress={() => setOpen(true)}
          style={styles.fieldInput}>
          <Text>{value?.toLocaleDateString('vi-VN')} </Text>
          <Image
            source={ICON.calendar}
            style={styles.icon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <DatePicker
          locale="vi-VN"
          modal
          open={open}
          date={value}
          title={t('select_date')}
          confirmText={t('confirm') || ''}
          cancelText={t('cancel') || ''}
          mode="date"
          maximumDate={new Date()}
          onConfirm={(d: Date) => {
            setOpen(false);
            onSelectItem(d);
          }}
          onCancel={() => {
            setOpen(false);
          }}
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
  picker: {
    marginTop: 0,
  },
  fieldInput: {
    ...styleSheet.filedText,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  icon: {
    width: 22,
    height: 22,
  },
});

export default FieldDatePicker;
