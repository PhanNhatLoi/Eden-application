import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {t} from 'i18next';
import DatePicker from 'react-native-date-picker';
import {ICON} from 'src/assets';
import {styleSheet} from 'src/styles/styleSheet';
import {Colors} from 'src/styles';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconFigma from '../ui/Image/IconFigma';

type Props = {
  defaultDate?: Date[];
  title?: string;
  confirmText?: string;
  cancelText?: string;
  minimumDate?: Date;
  mode?: 'date' | 'time' | 'datetime';
  onChange: (_: (Date | undefined)[]) => void;
  name: string;
};

const FieldRangeDatePicker = (props: Props) => {
  const {
    defaultDate = [undefined, undefined],
    name,
    title = 'date',
    confirmText = 'confirm',
    cancelText = 'cancel',
    mode = 'date',
    minimumDate,
    onChange,
  } = props;

  const [openFrom, setOpenFrom] = useState<boolean>(false);
  const [openTo, setOpenTo] = useState<boolean>(false);
  const [dateTime, setDateTime] = useState<(Date | undefined)[]>(defaultDate);

  const handleChangeDate = (date: Date, key: 'from' | 'to') => {
    let temp = dateTime;
    switch (key) {
      case 'from':
        temp[0] = date;
        if (
          (dateTime[1] && temp[0]?.getTime() > dateTime[1].getTime()) ||
          !dateTime[1]
        ) {
          temp[1] = date;
          setOpenTo(true);
        }
        setOpenFrom(false);
        break;

      case 'to':
        temp[1] = date;
        setOpenTo(false);
        break;
    }

    setDateTime(temp);
    temp[0] && temp[1] && onChange([temp[0], temp[1]]);
  };

  return (
    <>
      <View>
        <Text style={styleSheet.textStyleBold}>{t(title)}</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setOpenFrom(true)}>
            <Text
              style={{
                flex: 1,
                ...styleSheet.textStyleBasic,
                color: dateTime[0] ? Colors.BLACK : Colors.GRAY_03,
              }}>
              {(dateTime[0] && dateTime[0].toLocaleDateString('Vi-vn')) ||
                t('select_date')}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {dateTime[0] && (
                <TouchableOpacity
                  onPress={() => {
                    setDateTime([undefined, dateTime[1]]);
                    onChange([undefined, dateTime[1]]);
                  }}>
                  <IconAnt
                    name="closecircle"
                    color={Colors.GRAY_03}
                    size={17}
                    style={{marginRight: 5}}
                  />
                </TouchableOpacity>
              )}
              <IconFigma name="calendar" size={30} />

              {/* <Image source={ICON['calendar']} /> */}
            </View>
          </TouchableOpacity>
          <Image source={ICON['line']} style={{height: 0.5, width: 12}} />
          <TouchableOpacity
            style={styles.input}
            onPress={() => setOpenTo(true)}>
            <Text
              style={{
                flex: 1,
                ...styleSheet.textStyleBasic,
                color: dateTime[1] ? Colors.BLACK : Colors.GRAY_03,
              }}>
              {(dateTime[1] && dateTime[1].toLocaleDateString('Vi-vn')) ||
                t('select_date')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {dateTime[1] && (
                <TouchableOpacity
                  onPress={() => {
                    setDateTime([dateTime[0], undefined]);
                    onChange([dateTime[0], undefined]);
                  }}>
                  <IconAnt
                    name="closecircle"
                    color={Colors.GRAY_03}
                    size={17}
                    style={{marginRight: 5}}
                  />
                </TouchableOpacity>
              )}
              <IconFigma name="calendar" size={30} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <DatePicker
        locale="vi-VN"
        modal
        minimumDate={minimumDate}
        confirmText={t(confirmText).toString()}
        cancelText={t(cancelText).toString()}
        mode={mode}
        title={t('start_date')}
        open={openFrom}
        date={dateTime[0] || new Date()}
        onConfirm={date => {
          handleChangeDate(new Date(date.setHours(7, 0, 0)), 'from'); // time zone +7
        }}
        onCancel={() => {
          // setDateTime([undefined, undefined]);
          // onChange([undefined, undefined]);
          setOpenFrom(false);
        }}
      />
      <DatePicker
        locale="vi-VN"
        modal
        minimumDate={dateTime[0] || undefined}
        confirmText={t(confirmText).toString()}
        cancelText={t(cancelText).toString()}
        mode={mode}
        title={t('end_date')}
        open={openTo}
        date={dateTime[1] || new Date()}
        onConfirm={date => {
          const returnDate = new Date(date.setHours(23, 59, 59));
          handleChangeDate(returnDate, 'to');
        }}
        onCancel={() => {
          // setDateTime([undefined, undefined]);
          // onChange([undefined, undefined]);
          setOpenTo(false);
        }}
      />
    </>
  );
};

export default FieldRangeDatePicker;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 13,
    marginBottom: 20,
  },
  input: {
    width: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
    borderColor: Colors.GRAY_03,
    borderWidth: 1,
    paddingHorizontal: 10,
    height: 50,
  },
});
