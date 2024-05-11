import * as React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {styleSheet} from 'src/styles/styleSheet';
import FieldDropDown from './appForm/FieldDropDown';
import {useTranslation} from 'react-i18next';
import {DropDownPickerProps, ValueType} from 'react-native-dropdown-picker';
import {SCREEN} from 'src/help';
import {Colors} from 'src/styles';
import {
  getDistrictList,
  getProvinceList,
  getWardList,
} from 'src/api/appData/actions';
import {useEffect, useState} from 'react';
import {ICON} from 'src/assets';
import MapPicker, {location} from './appForm/MapPicker';
type AddressFormProps = {
  onChangeProvince: (_: any) => void;
  onChangeDistrict: (_: any) => void;
  onChangeWard: (_: any) => void;
  onChangeCoordinates: (_: location) => void;
  locationTitle?: string;
  coordinates?: location;
  initValue?: {
    provinceId?: number | null;
    districtId?: number | null;
    wardsId?: number | null;
  };
  provinceIdKey?: string;
  districtIdKey?: string;
  wardsIdKey?: string;
};
type dropdownType = Omit<
  DropDownPickerProps<ValueType>,
  'open' | 'setOpen' | 'value' | 'setValue' | 'multiple'
>;
const AddressForm = (props: AddressFormProps) => {
  const {
    onChangeProvince = _ => {},
    onChangeDistrict = _ => {},
    onChangeWard = _ => {},
    onChangeCoordinates = _ => {},
    coordinates,
    initValue,
    locationTitle = 'location',
    provinceIdKey = 'province',
    districtIdKey = 'district',
    wardsIdKey = 'ward',
  } = props;
  const {t} = useTranslation();
  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [isOpenMap, setOpenMap] = useState(false);

  useEffect(() => {
    getProvince();
    if (initValue) {
      if (initValue.provinceId) {
        getDistrict(initValue.provinceId);
        if (initValue.districtId) {
          getWard(initValue.districtId);
        }
      }
    }
  }, []);

  const getProvince = async () => {
    try {
      const res = await getProvinceList();
      const format = res.map((obj: any) => ({label: obj.name, value: obj.id}));
      setProvinceList(format);
    } catch (error) {
      console.error(error);
    }
  };
  const getDistrict = async (provinceId: string | number) => {
    try {
      const res = await getDistrictList(provinceId);
      const format = res.map((obj: any) => ({label: obj.name, value: obj.id}));
      setDistrictList(format);
    } catch (error) {
      console.error(error);
    }
  };
  const getWard = async (districtId: string | number) => {
    try {
      const res = await getWardList(districtId);
      const format = res.map((obj: any) => ({label: obj.name, value: obj.id}));
      setWardList(format);
    } catch (error) {
      console.error(error);
    }
  };
  const dropDownPickerPropsProvince: dropdownType = {
    items: provinceList,
    searchPlaceholder: t('province') || undefined,
  };
  const dropDownPickerPropsDistrict: dropdownType = {
    items: districtList,
    searchPlaceholder: t('district') || undefined,
  };
  const dropDownPickerPropsWard: dropdownType = {
    items: wardList,
    searchPlaceholder: t('ward') || undefined,
  };
  return (
    <>
      <View style={styles.container}>
        <FieldDropDown
          defaultValue={initValue?.wardsId}
          dropDownPickerProps={dropDownPickerPropsWard}
          title={t('ward')}
          name={wardsIdKey}
          isRequired
          onSelectItem={v => {
            onChangeWard(v.value);
          }}
        />
        <FieldDropDown
          defaultValue={initValue?.districtId}
          dropDownPickerProps={dropDownPickerPropsDistrict}
          title={t('district')}
          name={districtIdKey}
          isRequired
          onSelectItem={v => {
            getWard(v.value);
            onChangeDistrict(v.value);
          }}
        />
        <FieldDropDown
          defaultValue={initValue?.provinceId}
          dropDownPickerProps={dropDownPickerPropsProvince}
          title={t('province')}
          name={provinceIdKey}
          isRequired
          onSelectItem={v => {
            getDistrict(v.value);
            setWardList([]);
            onChangeProvince(v.value);
          }}
        />
      </View>
      <TouchableOpacity
        onPress={() => setOpenMap(true)}
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
          <Text style={styleSheet.textStyleBasic}>{coordinates?.latitude}</Text>
          <Text style={styleSheet.textStyleBasic}>
            {coordinates?.longitude}
          </Text>
        </View>
      </View>
      <MapPicker
        isOpen={isOpenMap}
        setOpen={setOpenMap}
        onConfirm={onChangeCoordinates}
        defaultRegion={coordinates}
      />
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column-reverse',
    zIndex: 100,
    // marginBottom: 20,
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
  row: {
    ...styleSheet.row,
    marginTop: 10,
  },
  textButton: {
    ...styleSheet.textStyleBold,
    color: Colors.SYS_BUTTON,
    fontSize: 13,
  },
});

export default AddressForm;
