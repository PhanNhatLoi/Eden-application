import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Colors} from 'src/styles';
import {styleSheet} from 'src/styles/styleSheet';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  getDistrictList,
  getProvinceList,
  getWardList,
} from 'src/api/appData/actions';
import ReactNativeModal from 'react-native-modal';
import {ErrorMessage, Field} from 'formik';
import {FieldTitle} from 'src/components/molecules';
import {FARM} from 'src/api/farm/type.d';
import {SCREEN} from 'src/help';
import {ICON} from 'src/assets';
import MapPicker from './MapPicker';
import SearchText from '../fields/searchText';
import {removeVietnameseTones} from 'src/help/convertVi';
import TextInput from 'src/components/molecules/TextInput';
import ScrollViewKeyboardAvoidView from './ScrollViewKeyboardAvoidView';
import Geocoder from 'react-native-geocoding';
import {GOOGLE_MAP_API_KEY} from 'src/config';

type location = {
  latitude?: number;
  longitude?: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
};
type Props = {
  defaultValue?: FARM.Request.Address;
  onChange: (name: string, value: number | string | undefined) => void;
  locationTitle?: string;
  autoFocus?: boolean;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
};

type optionType = {
  value: number;
  label: string;
};
type DataSelectType = {
  name: 'provinceId' | 'districtId' | 'wardsId';
  title: 'province' | 'district' | 'ward';
  items: optionType[];
};
type AddressString = {
  address1: string | null;
  province: string | null;
  district: string | null;
  wards: string | null;
};
const initAddress = {
  countryId: null,
  address1: null,
  provinceId: null,
  districtId: null,
  wardsId: null,
};

const initAddressString: AddressString = {
  address1: null,
  province: null,
  district: null,
  wards: null,
};

const FieldAddressAndLocation = (props: Props) => {
  const {t} = useTranslation();
  const {
    defaultValue,
    onChange = () => {},
    locationTitle = 'location',
    autoFocus = false,
    setLoading,
  } = props;
  const [provinceList, setProvinceList] = useState<optionType[]>([]);
  const [districtList, setDistrictList] = useState<optionType[]>([]);
  const [wardList, setWardList] = useState<optionType[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isOpenMap, setOpenMap] = useState(false);
  const [viewMap, setViewMap] = useState(false);
  const [paramsFilter, setParamsFilter] = useState<string>('');
  const [loadingProvince, setLoadingProvince] = useState<boolean>(false);
  const [loadingDitrict, setLoadingDitrict] = useState<boolean>(false);
  const [loadingWards, setLoadingWards] = useState<boolean>(false);
  const [coordinates, setCoordinates] = useState<location>({
    latitude: defaultValue?.lat || undefined,
    longitude: defaultValue?.lng || undefined,
    // latitudeDelta: undefined,
    // longitudeDelta: undefined,
  });
  const [dataSelect, setDataSelect] = useState<DataSelectType>({
    name: 'provinceId',
    items: provinceList,
    title: 'province',
  });
  const [address, setAddress] = useState<FARM.Request.Address>(initAddress);
  const [addressString, setAddressString] =
    useState<AddressString>(initAddressString);
  const [fieldUpdate, setFieldUpdate] = useState<{
    key: 'provinceId' | 'districtId' | 'wardsId';
    item: optionType;
  }>();

  useEffect(() => {
    if (viewMap) {
      setTimeout(() => {
        setOpenMap(true);
      }, 100);
    }
  }, [viewMap]);

  useEffect(() => {
    if (!isOpenMap && viewMap)
      setTimeout(() => {
        setViewMap(false);
      }, 1000);
  }, [isOpenMap]);

  useEffect(() => {
    GOOGLE_MAP_API_KEY && Geocoder.init(GOOGLE_MAP_API_KEY);
  }, []);

  const addressTostring = (address: AddressString): string => {
    let value = Object.values(address).filter(f => f);
    return value.join(', ');
  };

  useEffect(() => {
    Geocoder.from(addressTostring(addressString))
      .then(res => {
        res.results.length &&
          setCoordinates({
            latitude: res.results[0].geometry.location.lat,
            longitude: res.results[0].geometry.location.lng,
            latitudeDelta: undefined,
            longitudeDelta: undefined,
          });
        onChange('lat', res.results[0].geometry.location.lat);
        onChange('lng', res.results[0].geometry.location.lng);
      })
      .catch(err => {});
  }, [addressString]);

  useEffect(() => {
    setLoadingProvince(true);
    getProvince();
    if (defaultValue) {
      if (defaultValue.provinceId) {
        getDistrict(defaultValue.provinceId);
        if (defaultValue.districtId) {
          getWard(defaultValue.districtId);
        }
      }
      setAddress(defaultValue);
    }
  }, []);

  const getProvince = () => {
    setParamsFilter('');

    getProvinceList()
      .then(res => {
        setProvinceList(
          res.map((m: any) => {
            return {label: m.name, value: m.id};
          }),
        );
      })
      .catch(err => console.log(err))
      .finally(() => setLoadingProvince(false));
  };

  const getDistrict = (provinceId: string | number) => {
    setParamsFilter('');
    getDistrictList(provinceId)
      .then(res => {
        setDistrictList(
          res.map((m: any) => {
            return {label: m.name, value: m.id};
          }),
        );
      })
      .catch(err => console.log(err))
      .finally(() => setLoadingDitrict(false));
  };

  useEffect(() => {
    setLoading && setLoading(false);
    if (fieldUpdate) {
      switch (fieldUpdate.key) {
        case 'provinceId':
          setAddressString({
            ...initAddressString,
            province: fieldUpdate.item.label,
          });
          onChange('provinceId', fieldUpdate.item.value);
          onChange('districtId', '');
          onChange('wardsId', '');
          getDistrict(fieldUpdate.item.value);
          break;
        case 'districtId':
          onChange('districtId', fieldUpdate.item.value);
          onChange('wardsId', '');
          setAddressString({
            ...initAddressString,
            province: addressString.province,
            district: fieldUpdate.item.label,
          });
          getWard(fieldUpdate.item.value);
          break;
        case 'wardsId':
          onChange('wardsId', fieldUpdate.item.value);
          setAddressString({...addressString, wards: fieldUpdate.item.label});
          break;
        default:
          break;
      }
    }
  }, [fieldUpdate]);

  const getWard = (districtId: string | number) => {
    setParamsFilter('');
    getWardList(districtId)
      .then(res => {
        setWardList(
          res.map((m: any) => {
            return {label: m.name, value: m.id};
          }),
        );
      })
      .catch(err => console.log(err))
      .finally(() => setLoadingWards(false));
  };

  const renderItem = ({item}: {item: optionType}) => {
    return (
      <TouchableOpacity
        key={item.value}
        style={styles.item}
        disabled={!isVisible}
        onPress={() => {
          setIsVisible(false);
          setLoading && setLoading(true);
          setTimeout(() => {
            setFieldUpdate({key: dataSelect.name, item: item});
          }, 1500);
          if (dataSelect.name === 'provinceId') {
            setAddress({...initAddress, provinceId: item.value});
            setLoadingDitrict(true);
          }
          if (dataSelect.name === 'districtId') {
            setAddress({
              ...initAddress,
              provinceId: address.provinceId,
              districtId: item.value,
            });
            setLoadingWards(true);
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
        disabled = !Boolean(address.provinceId && !loadingDitrict);
        break;
      case 'wardsId':
        disabled = !Boolean(address.districtId && !loadingWards);
        break;
      default:
        break;
    }
    return (
      <TouchableOpacity
        disabled={disabled}
        style={{
          ...styles.row,
        }}
        onPress={() => {
          setDataSelect(item);
          setIsVisible(true);
          Keyboard.dismiss();
        }}>
        <View
          style={{
            ...styles.inputItem,
            backgroundColor: disabled ? Colors.GRAY_01 : Colors.WHITE,
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
              {item.name === 'provinceId' &&
                provinceList.find(f => f.value === address[item.name])?.label}
              {item.name === 'districtId' &&
                districtList.find(f => f.value === address[item.name])?.label}
              {item.name === 'wardsId' &&
                wardList.find(f => f.value === address[item.name])?.label}
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
          {(
            item.name === 'provinceId'
              ? loadingProvince
              : item.name === 'districtId'
              ? loadingDitrict
              : loadingWards
          ) ? (
            <ActivityIndicator color={Colors.SYS_BUTTON} size={25} />
          ) : (
            <Icon name="down" size={20} color={Colors.BLACK} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FieldTitle isRequired title={t('address') + ':'} />
      <TextInput
        autoFocus={autoFocus && !defaultValue?.address1}
        style={styles.inputItem}
        placeholder={t('fill_address').toString()}
        placeholderTextColor={Colors.GRAY_03}
        defaultValue={defaultValue?.address1 || ''}
        onChangeText={v => {
          onChange && onChange('address1', v);
          setAddressString({...addressString, address1: v});
        }}
      />

      <Text style={styleSheet.errorTextStyle}>
        <ErrorMessage name="address1" />
      </Text>

      <FieldTitle isRequired title={t('province') + ':'} />
      <SelectOptionField
        item={{
          name: 'provinceId',
          title: 'province',
          items: provinceList,
        }}
        placeholder="province"
      />

      <Text style={styleSheet.errorTextStyle}>
        <ErrorMessage name="provinceId" />
      </Text>

      <FieldTitle isRequired title={t('district') + ':'} />
      <SelectOptionField
        item={{
          name: 'districtId',
          title: 'district',
          items: districtList,
        }}
        placeholder="district"
      />

      <Text style={styleSheet.errorTextStyle}>
        <ErrorMessage name="districtId" />
      </Text>

      <FieldTitle isRequired title={t('ward') + ':'} />
      <SelectOptionField
        item={{name: 'wardsId', title: 'ward', items: wardList}}
        placeholder="ward"
      />
      <Text style={styleSheet.errorTextStyle}>
        <ErrorMessage name="wardsId" />
      </Text>
      <ReactNativeModal
        isVisible={isVisible}
        animationInTiming={500}
        style={{justifyContent: 'flex-start'}}
        animationOutTiming={1000}>
        <SafeAreaView>
          <View style={styles.select}>
            <View style={{backgroundColor: Colors.GRAY_02}}>
              <Text
                style={{
                  ...styleSheet.textStyleBold,
                  textAlign: 'center',
                  marginBottom: 10,
                }}>
                {t(dataSelect.title)}
              </Text>
              <SearchText onChangeText={value => setParamsFilter(value)} />
            </View>
          </View>
          <ScrollViewKeyboardAvoidView
            scrollViewProps={{
              style: {
                width: '100%',
                height: '100%',
                marginBottom: 20,
                backgroundColor: Colors.GRAY_02,
              },
            }}
            headerHeight={120}
            bottomButton={
              <View style={styles.button}>
                <TouchableOpacity
                  style={{
                    height: '100%',
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    setIsVisible(false);
                    setParamsFilter('');
                  }}>
                  <Text
                    style={{
                      ...styleSheet.buttonDefaultText,
                      fontSize: 16,
                    }}>
                    {t('cancel')}
                  </Text>
                </TouchableOpacity>
              </View>
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
      <View>
        <TouchableOpacity
          onPress={() => {
            setViewMap(true);
          }}
          style={styles.locationButton}>
          <Text style={styles.textButton}>{t(locationTitle)}</Text>
          <Image source={ICON.pin} style={styles.icon} resizeMode="contain" />
        </TouchableOpacity>
        <View style={styles.row}>
          <View>
            <Text style={styles.latlng}>Lat: </Text>
            <Text style={styles.latlng}>Long: </Text>
          </View>
          <View>
            <Text style={styleSheet.textStyleBasic}>
              {coordinates?.latitude}
            </Text>
            <Text style={styleSheet.textStyleBasic}>
              {coordinates?.longitude}
            </Text>
          </View>
        </View>
        {viewMap && (
          <MapPicker
            isOpen={isOpenMap}
            setOpen={setOpenMap}
            onConfirm={(value: location) => {
              onChange('lat', value.latitude);
              onChange('lng', value.longitude);
              setCoordinates({
                latitude: value.latitude,
                longitude: value.longitude,
              });
            }}
            defaultRegion={coordinates}
          />
        )}
      </View>
    </View>
  );
};

export default FieldAddressAndLocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputItem: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.GRAY_03,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 8,
    backgroundColor: Colors.WHITE,
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

  subtitle: {
    ...styleSheet.textStyleBasic,
    marginTop: 15,
    textAlign: 'center',
  },
  dropdownStyle: {
    width: SCREEN.width - 40,
    borderColor: Colors.GRAY_MEDIUM,
  },
  locationButton: {
    ...styleSheet.buttonDefaultStyle,
    ...styleSheet.listSpace,
    width: 150,
  },
  latlng: {
    ...styleSheet.textStyleSub,
    fontSize: 14,
  },
  icon: {
    width: 20,
    height: 20,
  },

  textButton: {
    ...styleSheet.textStyleBold,
    color: Colors.SYS_BUTTON,
    fontSize: 13,
  },
});
