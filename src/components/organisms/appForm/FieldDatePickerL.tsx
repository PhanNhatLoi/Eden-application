import * as React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from 'src/styles';
import {styleSheet} from 'src/styles/styleSheet';
import {FieldTitle} from '../../molecules';
import {ErrorMessage, Field} from 'formik';
import {SCREEN} from 'src/help';
import DatePicker from 'react-native-date-picker';
import {t} from 'i18next';
import {ICON} from 'src/assets';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconFigma from '../ui/Image/IconFigma';

type FieldDateTimeInputProps = {
  isRequired?: boolean;
  name: string;
  title?: string;
  mode?: 'date' | 'time' | 'datetime';
  confirmText?: string;
  cancelText?: string;
  disablePreviousDate?: boolean;
  minimumDate?: Date;
  maximumDate?: string;
  value: string;
  onChange: (_: string) => void;
};

const FieldDatePickerL = (props: FieldDateTimeInputProps) => {
  const {
    isRequired = false,
    name,
    title,
    mode = 'date',
    confirmText = 'confirm',
    cancelText = 'cancel',
    onChange,
    maximumDate,
    value,
    disablePreviousDate = false,
  } = props;
  const [open, setOpen] = React.useState(false);
  const minimumDate =
    (props.minimumDate && new Date(props.minimumDate)) ||
    (disablePreviousDate && new Date(Date.now())) ||
    undefined;

  return (
    <Field name={name}>
      {({
        field, // { name, value, onChange, onBlur }
        form: {touched, errors}, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
        meta,
      }: any) => {
        return (
          <>
            <FieldTitle isRequired={isRequired} title={title} />
            <TouchableOpacity onPress={() => setOpen(true)}>
              <View style={styles.filedText}>
                {value ? (
                  <Text style={styleSheet.textStyleBasic}>
                    {new Date(value).toLocaleDateString('vi-VN')}
                  </Text>
                ) : (
                  <Text style={styles.placeholder}>{t('select_date')}</Text>
                )}

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {value && (
                    <TouchableOpacity
                      onPress={() => {
                        onChange('');
                      }}>
                      <IconAnt
                        name="closecircle"
                        color={Colors.GRAY_03}
                        size={17}
                        style={{marginRight: 5}}
                      />
                    </TouchableOpacity>
                  )}
                  {/* <Image source={ICON['calendar']} /> */}
                  <IconFigma name="calendar" size={30} />
                </View>
              </View>
              <DatePicker
                locale="vi-VN"
                modal
                confirmText={t(confirmText).toString()}
                cancelText={t(cancelText).toString()}
                mode={mode}
                title={t('select_date')}
                open={open}
                date={new Date(value || minimumDate || Date.now())}
                minimumDate={minimumDate}
                maximumDate={maximumDate ? new Date(maximumDate) : undefined}
                onConfirm={date => {
                  setOpen(false);
                  onChange(date.toISOString());
                }}
                onCancel={() => {
                  // onChange('');
                  setOpen(false);
                }}
              />
            </TouchableOpacity>

            <Text style={styleSheet.errorTextStyle}>
              <ErrorMessage name={name} />
            </Text>
          </>
        );
      }}
    </Field>
  );
};
const styles = StyleSheet.create({
  placeholder: {
    ...styleSheet.textStyleBasic,
    color: Colors.GRAY_03,
  },
  filedText: {
    ...styleSheet.textStyleBasic,
    padding: 10,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderRadius: 8,
    width: SCREEN.width - 40,
    marginTop: 10,
    borderColor: Colors.GRAY_MEDIUM,
    textAlignVertical: 'top',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default FieldDatePickerL;
