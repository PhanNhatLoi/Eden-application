import {
  ActivityIndicator,
  FlatList,
  GestureResponderEvent,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {styleSheet} from 'src/styles/styleSheet';
import {Colors} from 'src/styles';
import {useTranslation} from 'react-i18next';
import {Background, FieldTitle} from 'src/components/molecules';
import ReactNativeModal from 'react-native-modal';
import Icon from 'react-native-vector-icons/AntDesign';
import IconFontAweSome from 'react-native-vector-icons/FontAwesome';
import {ErrorMessage} from 'formik';
import {ColorBadge} from 'src/styles/colors';

export type OptionType = {value: number | null; label: string | null};
type Props = {
  title?: string;
  require?: boolean;
  options: OptionType[];
  placeholder?: string;
  onSelectItem?: (item: OptionType) => void;
  name?: string;
  defaultValue?: (number | null | undefined)[];
  multiple?: {
    multiple: boolean;
    onSelectItem: (item: OptionType[]) => void;
  };
  disabled?: boolean;
  loading?: boolean;
  disabledItem?: (number | null)[]; // disabled by value of item
};

const FieldDropsDownModal = (props: Props) => {
  const {t} = useTranslation();
  const {
    title = '',
    require = false,
    placeholder = '',
    options = [],
    onSelectItem = _ => {},
    name,
    defaultValue,
    disabled = false,
    loading = false,
    disabledItem = [],
    multiple = {
      multiple: false,
      onSelectItem: _ => {},
    },
  } = props;
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [value, setValue] = useState<OptionType[]>([]);

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
  const styles = StyleSheet.create({
    container: {
      width: '100%',
    },
    input: {
      backgroundColor: disabled ? Colors.GRAY_01 : Colors.WHITE,
      height: 50,
      marginTop: 10,
      borderRadius: 8,
      borderColor: Colors.GRAY_03,
      borderWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 10,
    },

    content: {
      flex: 1,
    },
    button: {
      height: 60,
      backgroundColor: Colors.WHITE,
      marginTop: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
    },
    item: {
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: 1,
    },
    title: {
      height: 60,
      borderBottomColor: Colors.GRAY_03,
      borderBottomWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
      ...styleSheet.textStyleBasic,
    },
  });
  const renderItem = ({item}: {item: OptionType}) => {
    return (
      <TouchableOpacity
        disabled={disabledItem.some(s => s === item.value)}
        style={[
          styles.item,
          {
            backgroundColor: disabledItem.some(s => s === item.value)
              ? Colors.GRAY_02
              : '',
            borderBottomColor: disabledItem.some(s => s === item.value)
              ? Colors.WHITE
              : Colors.GRAY_02,
          },
        ]}
        onPress={() => {
          onSelectItem(item);
          if (multiple.multiple) {
            setValue(pre => {
              let temp = pre;
              temp = pre.some(s => s.value === item.value)
                ? temp.filter(f => f.value !== item.value)
                : [...pre, item];
              return temp;
            });
          } else {
            setValue([item]);
            !multiple.multiple && setIsVisible(false);
          }
        }}>
        <Text style={styleSheet.textStyleBasic}>{item.label}</Text>
        {value.some(s => s.value === item.value) && (
          <Icon
            name="check"
            size={20}
            style={{position: 'absolute', right: 0}}
            color={Colors.BLACK}
          />
        )}
      </TouchableOpacity>
    );
  };

  const renderValueItem = ({
    item,
    index,
  }: {
    item: OptionType;
    index: number;
  }) => {
    return multiple.multiple ? (
      <View
        style={{
          height: 30,
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 5,
          paddingHorizontal: 5,
          flexDirection: 'row',
          borderRadius: 5,
          borderColor: ColorBadge[index],
          borderWidth: 0.5,
        }}>
        <IconFontAweSome
          name="circle"
          color={ColorBadge[index]}
          style={{marginRight: 2}}
        />
        <Text style={styleSheet.textStyleBasic}>{item.label}</Text>
      </View>
    ) : (
      <Text style={styleSheet.textStyleBasic}>{item.label}</Text>
    );
  };
  return (
    <View style={styles.container}>
      {<FieldTitle isRequired={require} title={t(title)} />}
      <View style={styles.input}>
        <FlatList
          onTouchEndCapture={(e: GestureResponderEvent) => {
            !disabled && !loading && setIsVisible(true);
          }}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={!!value.length && value.length >= 4}
          horizontal
          data={value}
          renderItem={renderValueItem}
          ListEmptyComponent={
            <Text
              style={{
                ...styleSheet.textStyleBasic,
                color: Colors.GRAY_03,
              }}>
              {t(placeholder)}
            </Text>
          }
        />
        <TouchableOpacity
          onPress={() => {
            !disabled && !loading && setIsVisible(true);
          }}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Icon name="down" size={25} color={Colors.BLACK} />
          )}
        </TouchableOpacity>
      </View>
      <Text style={styleSheet.errorTextStyle}>
        {name && <ErrorMessage name={name} />}
      </Text>
      <ReactNativeModal
        isVisible={isVisible}
        animationInTiming={500}
        animationOutTiming={500}>
        <SafeAreaView style={styles.content}>
          <Background>
            <View style={styles.title}>
              <Text style={styleSheet.textStyleBold}>{t(placeholder)}</Text>
              {multiple.multiple && (
                <Text
                  style={{...styleSheet.textStyleBasic, color: Colors.GRAY_03}}>
                  {t('can_select_multipe')}
                </Text>
              )}
            </View>
            <FlatList
              data={options}
              renderItem={renderItem}
              ListEmptyComponent={
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    height: '100%',
                    marginTop: '50%',
                  }}>
                  <Text style={styleSheet.textStyleBasic}>{t('no_data')}</Text>
                </View>
              }
            />
          </Background>
        </SafeAreaView>
        {multiple.multiple && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              multiple.onSelectItem(value);
              setIsVisible(false);
            }}>
            <Text style={{...styleSheet.buttonDefaultText, fontSize: 16}}>
              {t('confirm')}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setValue([]);
            onSelectItem({label: null, value: null});
            setIsVisible(false);
          }}>
          <Text
            style={{
              ...styleSheet.buttonDefaultText,
              fontSize: 16,
              color: Colors.CANCLE_BUTTON,
            }}>
            {t('cancel')}
          </Text>
        </TouchableOpacity>
      </ReactNativeModal>
    </View>
  );
};

export default FieldDropsDownModal;
