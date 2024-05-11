import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Colors} from 'src/styles';
import {styleSheet} from 'src/styles/styleSheet';
import Icon from 'react-native-vector-icons/AntDesign';
import {AUTH} from 'src/api/auth/type';
import {
  getDistrictList,
  getProvinceList,
  getWardList,
} from 'src/api/appData/actions';
import ReactNativeModal from 'react-native-modal';
import {ErrorMessage} from 'formik';
import TextInput from 'src/components/molecules/TextInput';
import SearchText from '../fields/searchText';
import ScrollViewKeyboardAvoidView from './ScrollViewKeyboardAvoidView';
import {removeVietnameseTones} from 'src/help/convertVi';
import {SCREEN} from 'src/help';

type Props = {
  defaultValue?: AUTH.PROFILE.Request.Address;
  onChange?: (name: string, value: number | string | undefined) => void;
};

type optionType = {
  value: number;
  label: string;
};
type DataSelectType = {
  name: 'provinceId' | 'districtId' | 'wardsId';
  items: optionType[];
};

type addressType = {
  provinceId: number | null;
  districtId: number | null;
  wardsId: number | null;
};

//init address default
const initAddress: addressType = {
  provinceId: null,
  districtId: null,
  wardsId: null,
};

// init value address customer
const initData: AUTH.PROFILE.Request.Address = {
  fullName: null,
  phoneNumber: null,
  address1: null,
  apartmentNumber: null,
  countryId: 1,
  provinceId: null,
  districtId: null,
  wardsId: null,
  areaCode: null,
  zipCode: null,
  isDefault: false,
};

const FieldAddress = (props: Props) => {
  const {t} = useTranslation();
  const {defaultValue = initData, onChange = () => {}} = props;
  const [provinceList, setProvinceList] = useState<optionType[]>([]);
  const [districtList, setDistrictList] = useState<optionType[]>([]);
  const [wardList, setWardList] = useState<optionType[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [paramsFilter, setParamsFilter] = useState<string>('');
  const [dataSelect, setDataSelect] = useState<DataSelectType>({
    name: 'provinceId',
    items: provinceList,
  });
  const [address, setAddress] = useState<addressType>(initAddress);

  // set value default
  useEffect(() => {
    getProvince();
    if (defaultValue) {
      if (defaultValue.provinceId) {
        getDistrict(defaultValue.provinceId);
        if (defaultValue?.districtId) {
          getWard(defaultValue.districtId);
        }
      }
    }
    setAddress({
      provinceId: defaultValue.provinceId,
      districtId: defaultValue.districtId,
      wardsId: defaultValue.wardsId,
    });
  }, []);

  //function get list procince
  const getProvince = async () => {
    try {
      const res = await getProvinceList();
      const format = res.map((obj: any) => ({label: obj.name, value: obj.id}));
      setProvinceList(format);
    } catch (error) {
      // console.error(error);
    }
  };

  //function get list district
  const getDistrict = async (provinceId: string | number) => {
    try {
      const res = await getDistrictList(provinceId);
      const format = res.map((obj: any) => ({label: obj.name, value: obj.id}));
      setDistrictList(format);
    } catch (error) {
      // console.error(error);
    }
  };

  //function get list wards
  const getWard = async (districtId: string | number) => {
    try {
      const res = await getWardList(districtId);
      const format = res.map((obj: any) => ({label: obj.name, value: obj.id}));
      setWardList(format);
    } catch (error) {
      // console.error(error);
    }
  };

  // render item address selection (item in modal)
  const renderItem = ({item}: {item: optionType}) => {
    return (
      <TouchableOpacity
        style={styles.item}
        key={item.value}
        onPress={() => {
          if (onChange) {
            onChange(dataSelect.name, item.value);
            // onChange(dataSelect.name + 'Name', item.label);
          }
          setIsVisible(false);
          if (dataSelect.name === 'provinceId') {
            getDistrict(item.value);
            setAddress({...initAddress, provinceId: item.value});
          }
          if (dataSelect.name === 'districtId') {
            getWard(item.value);
            setAddress({
              ...initAddress,
              provinceId: address.provinceId,
              districtId: item.value,
            });
          }
          if (dataSelect.name === 'wardsId') {
            setAddress({...address, wardsId: item.value});
          }
        }}>
        <Text style={{...styleSheet.textStyleBasic, textAlign: 'center'}}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  //item input selection
  const SelectOptionField = (props: {
    item: DataSelectType;
    placeholder: string;
  }) => {
    const {item, placeholder} = props;
    let disabled = true;
    switch (item.name) {
      case 'provinceId':
        disabled = false;
        break;
      case 'districtId':
        disabled = !Boolean(address['provinceId']);
        break;
      case 'wardsId':
        disabled = !Boolean(address['districtId']);
        break;
      default:
        break;
    }
    return (
      <TouchableOpacity
        disabled={disabled}
        style={styles.row}
        onPress={() => {
          Keyboard.dismiss();
          setDataSelect(item);
          setIsVisible(true);
        }}>
        <View
          style={{
            ...styles.inputItem,
            paddingBottom: 15,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'flex-end',
          }}>
          {address[item.name] ? (
            <Text
              style={{
                ...styleSheet.textStyleBasic,
                flex: 1,
              }}>
              {item.name === 'provinceId'
                ? provinceList.find(f => f.value === address[item.name])?.label
                : item.name === 'districtId'
                ? districtList.find(f => f.value === address[item.name])?.label
                : item.name === 'wardsId'
                ? wardList.find(f => f.value === address[item.name])?.label
                : ''}
            </Text>
          ) : (
            <Text
              style={{
                ...styleSheet.textStyleBasic,
                color: Colors.GRAY_03,
                flex: 1,
              }}>
              {t(placeholder)}
            </Text>
          )}
          <Icon name="down" size={20} color={Colors.BLACK} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* input fullname */}
      <TextInput
        style={[styles.inputItem]}
        defaultValue={defaultValue.fullName || undefined}
        placeholder={t('placeholderAddress1').toString()}
        placeholderTextColor={Colors.GRAY_03}
        numberOfLines={1}
        onChangeText={v => {
          onChange && onChange('fullName', v);
        }}
      />
      <Text style={styleSheet.errorTextStyle}>
        <ErrorMessage name="fullName" />
      </Text>
      {/* input fullname */}

      {/* input phone number (+84) */}
      <View style={styles.row}>
        {/* <View style={{...styles.inputItem, paddingBottom: 5, width: '15%'}}> */}
        {/* <Text style={styleSheet.textStyleBasic}>+84</Text> */}
        <TextInput
          editable={false}
          style={{...styles.inputItem, paddingBottom: 5, width: '15%'}}
          placeholder={t('phone_number').toString()}
          placeholderTextColor={Colors.GRAY_03}
          value="+84"
        />
        {/* </View> */}
        <TextInput
          style={{...styles.inputItem, flex: 1, marginLeft: 24}}
          placeholder={t('phone_number').toString()}
          placeholderTextColor={Colors.GRAY_03}
          defaultValue={defaultValue.phoneNumber || undefined}
          keyboardType="number-pad"
          onChangeText={v => {
            onChange && onChange('phoneNumber', Number(v).toString());
          }}
        />
      </View>
      <Text style={styleSheet.errorTextStyle}>
        <ErrorMessage name="phoneNumber" />
      </Text>
      {/* input phone number (+84) */}

      {/* input address1 */}
      <TextInput
        style={styles.inputItem}
        placeholder={t('placeholderAddress2').toString()}
        defaultValue={defaultValue.address1 || undefined}
        placeholderTextColor={Colors.GRAY_03}
        onChangeText={v => {
          onChange && onChange('address1', v);
        }}
      />
      <Text style={styleSheet.errorTextStyle}>
        <ErrorMessage name="address1" />
      </Text>
      {/* input address1 */}

      {/* input apartment number home */}
      <TextInput
        maxLength={20}
        style={styles.inputItem}
        placeholder={t('placeholderAddress3').toString()}
        placeholderTextColor={Colors.GRAY_03}
        defaultValue={defaultValue.apartmentNumber || ''}
        onChangeText={v => {
          onChange && onChange('apartmentNumber', v);
        }}
      />
      <Text style={styleSheet.errorTextStyle}>
        <ErrorMessage name="apartmentNumber" />
      </Text>
      {/* input apartment number home */}

      {/* selection address */}
      <View style={{...styles.inputItem, paddingBottom: 15, marginBottom: 15}}>
        <Text style={styleSheet.textStyleBasic}>Vietnam</Text>
      </View>
      {/* selection province */}
      <SelectOptionField
        item={{name: 'provinceId', items: provinceList}}
        placeholder="province"
      />
      <Text style={styleSheet.errorTextStyle}>
        <ErrorMessage name="provinceId" />
      </Text>
      {/* selection province */}

      {/* selection ditrict */}
      <SelectOptionField
        item={{name: 'districtId', items: districtList}}
        placeholder="district"
      />
      <Text style={styleSheet.errorTextStyle}>
        <ErrorMessage name="districtId" />
      </Text>
      {/* selection ditrict */}

      {/* selection wards */}
      <SelectOptionField
        item={{name: 'wardsId', items: wardList}}
        placeholder="ward"
      />
      <Text style={styleSheet.errorTextStyle}>
        <ErrorMessage name="wardsId" />
      </Text>
      {/* selection wards */}
      {/* selection address */}

      {/* input zipcode */}
      <TextInput
        maxLength={5}
        style={[styles.inputItem, {marginBottom: 20}]}
        placeholder={t('zipcode').toString()}
        placeholderTextColor={Colors.GRAY_03}
        defaultValue={defaultValue.zipCode || undefined}
        keyboardType="number-pad"
        onChangeText={v => {
          onChange && onChange('zipCode', v);
        }}
      />
      {/* input zipcode */}

      {/* component modal view address (provice,ditrict, ward) */}
      <ReactNativeModal
        isVisible={isVisible}
        animationInTiming={500}
        style={{justifyContent: 'flex-start'}}
        animationOutTiming={500}>
        <SafeAreaView>
          <View style={styles.select}>
            <Text
              style={{
                ...styleSheet.textStyleBold,
                textAlign: 'center',
                marginBottom: 10,
              }}>
              {t(dataSelect.name.replace('Id', ''))}
            </Text>
            <SearchText onChangeText={val => setParamsFilter(val)} />
          </View>
          <ScrollViewKeyboardAvoidView
            headerHeight={120}
            scrollViewProps={{
              style: {
                width: '100%',
                height: '100%',
                marginBottom: 20,
                backgroundColor: Colors.GRAY_02,
              },
            }}
            bottomButton={
              <TouchableOpacity
                style={styles.button}
                onPress={() => setIsVisible(false)}>
                <Text style={{...styleSheet.buttonDefaultText, fontSize: 16}}>
                  {t('cancel')}
                </Text>
              </TouchableOpacity>
            }>
            {dataSelect.items
              .filter(f =>
                removeVietnameseTones(f.label.toLowerCase()).includes(
                  removeVietnameseTones(paramsFilter.toLowerCase()),
                ),
              )
              .map(m => {
                return renderItem({item: m});
              })}
          </ScrollViewKeyboardAvoidView>
        </SafeAreaView>
      </ReactNativeModal>
      {/* component modal view address (provice,ditrict, ward) */}
    </View>
  );
};

export default FieldAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  inputItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_03,
    paddingBottom: 0,
    justifyContent: 'flex-end',
    height: 40,
    paddingHorizontal: 5,
  },
  inputContent: {
    padding: 0,
    justifyContent: 'flex-end',
  },

  row: {
    flexDirection: 'row',
  },
  select: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.GRAY_02,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  item: {
    height: 40,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.GRAY_03,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: Colors.WHITE,
    height: 60,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: SCREEN.width - 40,
  },
});
