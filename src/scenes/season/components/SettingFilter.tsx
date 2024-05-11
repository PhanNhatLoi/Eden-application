import * as React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from 'src/styles';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import {AppContainer, FieldSelect} from 'src/components/organisms';
import {ICON} from 'src/assets';
import {getFarmList} from 'src/api/farm/actions';
import {
  paramsFilterSeasonType,
  statusSeason,
  statusSeasonType,
} from 'src/state/reducers/season/const';
import {useDispatch} from 'react-redux';
import {saveFilterSeason} from 'src/state/reducers/season/seasonSlice';
import {useSelector} from 'react-redux';
import {RootState} from 'src/state/store';
import * as RootNavigator from 'src/navigations/root-navigator';
import FieldRangeDatePicker from 'src/components/organisms/appForm/FieldRangeDatePicker';
import {Hr} from './SeasonDetails/styles';
import {optionsType} from 'src/components/organisms/appForm/FieldDropDown';
import {FARM} from 'src/api/farm/type.d';
import {Formik} from 'formik';
import IconFigma from 'src/components/organisms/ui/Image/IconFigma';

type Props = {};

const SettingFilterSeason = (props: Props) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const filterParamsRedux = useSelector(
    (state: RootState) => state.season.filterParams,
  );
  const sysAccountId = useSelector(
    (state: RootState) => state.authReducer.sysAccountIdOwer || null,
  );
  const [seasonStatusFilter, setSeasonStatusFilter] =
    React.useState<statusSeasonType>(filterParamsRedux?.status || []);
  const [sowingDate, setSowingDate] = React.useState<(string | undefined)[]>(
    (filterParamsRedux?.sowingDateFrom &&
      filterParamsRedux?.sowingDateTo && [
        filterParamsRedux.sowingDateFrom,
        filterParamsRedux.sowingDateTo,
      ]) ||
      [],
  );
  const [harvestDate, setHarvestDate] = React.useState<(string | undefined)[]>(
    (filterParamsRedux?.harvestDateFrom &&
      filterParamsRedux?.harvestDateTo && [
        filterParamsRedux?.harvestDateFrom,
        filterParamsRedux?.harvestDateTo,
      ]) ||
      [],
  );
  const [farm, setFarm] = React.useState<number | null>(
    filterParamsRedux?.farmId || null,
  );

  const [farmList, setFarmList] = React.useState<optionsType[]>([]);

  React.useEffect(() => {
    getFarmList({sysAccountId: sysAccountId})
      .then(res => {
        setFarmList(
          res.map((m: FARM.Response.FarmGetList) => {
            return {
              value: m.id,
              label: m.name,
            };
          }),
        );
      })
      .catch(err => console.log(err));
  }, []);

  const handleSubmit = () => {
    const paramsFilter: paramsFilterSeasonType = {
      status: seasonStatusFilter, // to do setting status
      harvestDateFrom: (harvestDate[0] && harvestDate[0]) || undefined,
      harvestDateTo: (harvestDate[1] && harvestDate[1]) || undefined,
      sowingDateFrom: (sowingDate[0] && sowingDate[0]) || undefined,
      sowingDateTo: (sowingDate[1] && sowingDate[1]) || undefined,
      farmId: farm ? Number(farm) : undefined,
    };
    dispatch(saveFilterSeason(paramsFilter));
    RootNavigator.goBack();
  };

  return (
    <AppContainer
      showBackBtn
      title={t('setting_filter')}
      headerRight={
        <TouchableOpacity onPress={() => handleSubmit()}>
          <Text style={styleSheet.linkTextStyle}>{t('save')}</Text>
        </TouchableOpacity>
      }>
      <Formik
        initialValues={{}}
        onSubmit={(values, actions) => {
          {
          }
        }}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.contentTop}>
            <Text style={{...styleSheet.textStyleBold, marginBottom: 20}}>
              {t('status_season')}
            </Text>

            {Object.keys(statusSeason).map(m => {
              return (
                <TouchableOpacity
                  style={styles.row}
                  key={m}
                  onPress={() => {
                    setSeasonStatusFilter(() => {
                      let temp = seasonStatusFilter.filter(f => f !== m);

                      if (!seasonStatusFilter.some(s => s === m)) {
                        switch (m) {
                          case 'CULTIVATED':
                            temp = [...temp, 'CULTIVATED'];
                            break;
                          case 'UNCULTIVATED':
                            temp = [...temp, 'UNCULTIVATED'];
                            break;
                          case 'HARVESTED':
                            temp = [...temp, 'HARVESTED'];
                            break;
                        }
                      }
                      return temp;
                    });
                  }}>
                  <Text style={styles.rowContentKey}>{t(m)}</Text>
                  {/* <Image
                    source={
                      ICON[
                        seasonStatusFilter.some(s => s === m)
                          ? 'checkbox_active'
                          : 'checkbox'
                      ]
                    }
                  /> */}
                  <IconFigma
                    name={
                      seasonStatusFilter.some(s => s === m)
                        ? 'checkbox_active'
                        : 'checkbox'
                    }
                    size={16}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.contentCenter}>
            <FieldRangeDatePicker
              title="sowingDate"
              name="sowingDate"
              defaultDate={
                sowingDate[0] && sowingDate[1]
                  ? [new Date(sowingDate[0]), new Date(sowingDate[1])]
                  : undefined
              }
              onChange={dateRange => {
                setSowingDate([
                  dateRange[0] && dateRange[0].toISOString(),
                  dateRange[1] && dateRange[1].toISOString(),
                ]);
              }}
            />
            <Hr />
            <FieldRangeDatePicker
              title="harvestDate"
              name="harvestDate"
              defaultDate={
                harvestDate[0] && harvestDate[1]
                  ? [new Date(harvestDate[0]), new Date(harvestDate[1])]
                  : undefined
              }
              onChange={dateRange => {
                setHarvestDate([
                  dateRange[0] && dateRange[0].toISOString(),
                  dateRange[1] && dateRange[1].toISOString(),
                ]);
              }}
            />
            <Hr />
          </View>

          <Text style={{...styleSheet.textStyleBold, marginBottom: 15}}>
            {t('farm')}
          </Text>
          <FieldSelect
            options={farmList}
            placeholder={'select_farm'}
            title={''}
            name="farm"
            defaultValue={(farm && [farm]) || []}
            onChangeValue={items => {
              setFarm((items.length && items[0].value) || null);
            }}
          />
        </ScrollView>
      </Formik>
    </AppContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    // padding: 25,
    marginTop: 25,
    paddingHorizontal: 20,
    minHeight: 700,
  },
  textCancle: {
    ...styleSheet.textStyleBold,
    color: Colors.CANCLE_BUTTON,
  },
  contentTop: {},
  contentCenter: {
    borderTopWidth: 1,
    borderColor: Colors.GRAY_02,
    marginTop: 20,
    paddingVertical: 10,
  },
  contentEnd: {
    justifyContent: 'space-between',
    flex: 1,
  },
  row: {flexDirection: 'row', marginVertical: 10},
  rowContentKey: {
    flex: 1,
    ...styleSheet.textStyleBasic,
  },
  calendar: {
    flex: 1,
    borderColor: Colors.GRAY_02,
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
});

export default SettingFilterSeason;
