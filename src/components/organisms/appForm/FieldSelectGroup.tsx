import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {optionsType} from './FieldDropDown';
import {styleSheet} from 'src/styles/styleSheet';
import {Colors} from 'src/styles';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconIon from 'react-native-vector-icons/Ionicons';
import {FieldTitle} from 'src/components/molecules';
import {useTranslation} from 'react-i18next';
import CustomModal from '../ui/modals/Modal';
import ScrollViewKeyboardAvoidView from './ScrollViewKeyboardAvoidView';
import SearchText from '../fields/searchText';
import {removeVietnameseTones} from 'src/help/convertVi';
import {ErrorMessage} from 'formik';
import {OptionType} from 'src/api/appData/type';
import {ColorBadge} from 'src/styles/colors';

type Props = {
  loading?: boolean;
  options: optionsType[];
  placeholder?: string;
  title: string;
  name?: string;
  require?: boolean;
  defaultValue: (number | null)[];
  multi?: boolean;
  onChangeValue: (item: OptionType[]) => void;
};
const FieldSelectGroup = (props: Props) => {
  const {
    loading = false,
    options = [],
    placeholder = 'search',
    title = '',
    require = false,
    defaultValue = [],
    name,
    multi = false,
    onChangeValue = val => {},
  } = props;

  //constans
  const {t} = useTranslation();
  //constans

  //state
  const [visiable, setVisiable] = useState<boolean>(false); // show modals
  const [filterValue, setFilterValue] = useState<string>(''); // search text
  const [value, setValue] = useState<OptionType[]>([]);
  const [currentValue, setCurrentValue] = useState<OptionType[]>([]);
  //state

  //set value default
  useEffect(() => {
    defaultValue &&
      options &&
      setValue(() => {
        let temp: OptionType[] = [];
        defaultValue.map(m => {
          const item = options.find(f => f.value === m);
          if (item) temp.push(item);
        });
        return temp;
      });
  }, [options]);

  //styles for view
  const styles = StyleSheet.create({
    //input style
    input: {
      backgroundColor: Colors.WHITE,
      justifyContent: 'center',
      marginVertical: 10,
      borderRadius: 8,
      borderColor: Colors.GRAY_03,
      borderWidth: 0.8,
      padding: 10,
    },
    //button style
    button: {
      height: 60,
      backgroundColor: Colors.WHITE,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },

    //container modals
    container: {
      height: '100%',
      width: '100%',
      backgroundColor: Colors.WHITE,
      paddingBottom: 10,
    },

    //content center
    center: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    //border bottom
    borderBottom: {
      borderBottomColor: Colors.GRAY_02,
      borderBottomWidth: 0.5,
    },

    //item select modals style
    item: {
      flexDirection: 'row',
      height: 50,
      borderBottomColor: Colors.GRAY_02,
      borderBottomWidth: 0.5,
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
    },

    //item selected input style
    itemSelected: {
      backgroundColor: Colors.WHITE,
      height: 40,
      padding: 10,
      borderRadius: 8,
      borderWidth: 0.8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 4,
    },
  });

  //   handle change value select
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  //render item on select modals
  const renderItem = ({item, index}: {item: OptionType; index: number}) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.item}
        onPress={() => {
          if (currentValue.some(s => s.value === item.value)) {
            if (multi) {
              setCurrentValue(currentValue.filter(f => f.value !== item.value));
            } else setCurrentValue([]);
          } else {
            if (multi) {
              setCurrentValue([...currentValue, item]);
            } else setCurrentValue([item]);
          }
        }}>
        <Text style={styleSheet.textStyleBasic}>{item.label}</Text>
        {currentValue.some(s => s.value === item.value) ? (
          <IconIon name={'checkbox'} color={Colors.SYS_BUTTON} size={25} />
        ) : (
          <IconIon name={'square'} color={Colors.GRAY_02} size={25} />
        )}
      </TouchableOpacity>
    );
  };

  //render item selected on input
  const renderItemSelect = ({
    item,
    index,
  }: {
    item: OptionType;
    index: number;
  }) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          setValue(value.filter(f => f.value !== item.value));
          onChangeValue(value.filter(f => f.value !== item.value));
        }}
        style={[styles.itemSelected, {borderColor: ColorBadge[index]}]}>
        <Text style={styleSheet.textStyleBasic}> {item.label}</Text>
        <IconAnt name="close" size={15} style={{marginLeft: 10}} />
      </TouchableOpacity>
    );
  };

  return (
    <>
      {/* Input select view */}
      {title && <FieldTitle isRequired={require} title={t(title)} />}
      <TouchableOpacity
        disabled={loading}
        onPress={() => setVisiable(true)}
        style={[styles.input, {flexDirection: 'row', minHeight: 50}]}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
          {!value.length ? (
            <View style={{justifyContent: 'center'}}>
              <Text
                style={[
                  styleSheet.textStyleBasic,
                  {
                    color: Colors.GRAY_03,
                  },
                ]}>
                {t(placeholder)}
              </Text>
            </View>
          ) : multi ? (
            value.map((m, i) => {
              return renderItemSelect({item: m, index: i});
            })
          ) : (
            <View style={{justifyContent: 'center'}}>
              <Text
                style={[
                  styleSheet.textStyleBasic,
                  {
                    color: Colors.BLACK,
                  },
                ]}>
                {value[0].label}
              </Text>
            </View>
          )}
        </View>
        <View>
          <View style={{justifyContent: 'center', flex: 1}}>
            {loading ? (
              <ActivityIndicator color={Colors.SYS_BUTTON} />
            ) : (
              <IconAnt
                name="down"
                color={Colors.GRAY_DARK}
                size={25}
                style={{alignSelf: 'flex-end', justifyContent: 'center'}}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
      <Text style={styleSheet.errorTextStyle}>
        {name && <ErrorMessage name={name} />}
      </Text>
      {/* Input select view */}

      {/* modals select view */}
      <CustomModal
        isVisible={visiable}
        setIsVisible={setVisiable}
        justifyContent="flex-start">
        <SafeAreaView>
          <View
            style={{
              backgroundColor: Colors.WHITE,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}>
            <View style={[styles.center, styles.borderBottom, {height: 60}]}>
              <Text
                style={[
                  styleSheet.textStyleBold,
                  {color: Colors.SYS_BUTTON, fontSize: 16},
                ]}>
                {t(placeholder)}
              </Text>
            </View>
            <View
              style={[
                styles.center,
                {height: 60, paddingHorizontal: 20, marginVertical: 10},
              ]}>
              <SearchText onChangeText={val => setFilterValue(val)} />
            </View>
          </View>
          <ScrollViewKeyboardAvoidView
            scrollViewProps={{
              style: styles.container,
              contentContainerStyle: {
                justifyContent: 'space-between',
                height: '100%',
              },
            }}
            headerHeight={Platform.OS === 'android' ? 170 : 145}
            bottomButton={
              <>
                <View
                  style={[
                    styles.button,
                    {
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      borderTopColor: Colors.GRAY_02,
                      borderTopWidth: 0.5,
                    },
                  ]}>
                  <TouchableOpacity
                    style={{
                      height: '100%',
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      setValue(currentValue);
                      onChangeValue(currentValue);
                      setVisiable(false);
                    }}>
                    <Text
                      style={{...styleSheet.buttonDefaultText, fontSize: 16}}>
                      {t('confirm')}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    styles.button,
                    {
                      borderTopColor: Colors.GRAY_02,
                      borderTopWidth: 0.5,
                      marginTop: 10,
                    },
                  ]}>
                  <TouchableOpacity
                    style={{
                      height: '100%',
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      setCurrentValue(value);
                      setVisiable(false);
                    }}>
                    <Text
                      style={{...styleSheet.buttonDefaultText, fontSize: 16}}>
                      {t('cancel')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            }>
            <ScrollView>
              {options
                .filter(f =>
                  removeVietnameseTones(f.label.toLowerCase()).includes(
                    removeVietnameseTones(filterValue.toLowerCase()),
                  ),
                )
                .map((m, i) => {
                  return renderItem({item: m, index: i});
                })}
            </ScrollView>
          </ScrollViewKeyboardAvoidView>
        </SafeAreaView>
      </CustomModal>
      {/* modals select view */}
    </>
  );
};

export default FieldSelectGroup;
