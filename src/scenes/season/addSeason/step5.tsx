import * as React from 'react';
import {StyleSheet, Text, View, Image, ScrollView, Alert} from 'react-native';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import {Formik} from 'formik';
import {StepButton, StepButtonSingle} from 'src/components/molecules';
import {ICON} from 'src/assets';
import {Colors} from 'src/styles';
import {TouchableOpacity} from 'react-native-gesture-handler';
import CropsCard from '../addCrops/CropsCard';
import {boxShadow, padding} from 'src/styles/mixins';
import * as RootNavigator from 'src/navigations/root-navigator';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import {SEASON} from 'src/api/season/type.d';
import {useSelector} from 'react-redux';
import {RootState} from 'src/state/store';
import {ScrollViewKeyboardAvoidView} from 'src/components/organisms';
import * as Yup from 'yup';
import {ErrorMessage} from 'formik';
import {optionsType} from 'src/components/organisms/appForm/FieldDropDown';
import {getCertificateOfLands, getUnits} from 'src/api/season/actions';
import {getMasterData} from 'src/api/appData/actions';
import IconFigma from 'src/components/organisms/ui/Image/IconFigma';

type Step5Props = {
  onSubmit: (value: SEASON.Basic.Crops | undefined) => void;
  value: SEASON.Request.Season;
  onSave: (value: SEASON.Basic.Crops | undefined) => void;
  setValue: React.Dispatch<React.SetStateAction<SEASON.Request.Season>>;
};

const Step5 = (props: Step5Props) => {
  const {onSubmit = _ => {}, value, onSave, setValue} = props;
  const {t} = useTranslation();
  const crops = useSelector((state: RootState) => state?.season?.crops);
  const Schema = Yup.object().shape({
    // cropsName: Yup.string().required(t('required_field').toString()),
  });
  const [loading, setLoading] = React.useState<boolean>(true);
  const [unitsMass, setUnitsMass] = React.useState<optionsType[]>([]);
  const [unitsArea, setUnitsArea] = React.useState<optionsType[]>([]);
  const [businessTypeOfFarm, setBusinessTypeOfFarm] = React.useState<
    optionsType[]
  >([]);
  const [certificateOfLand, setCertificateOfLand] = React.useState<
    optionsType[]
  >([]);
  const [loadingsArea, setloadingsArea] = React.useState<boolean>(false);
  const [loadingMass, setloadingMass] = React.useState<boolean>(false);
  const [loadingLand, setloadingLand] = React.useState<boolean>(false);

  const fetchUnit = () => {
    setloadingsArea(true);
    setloadingMass(true);
    setloadingLand(true);
    getUnits({type: 'ACREAGE'})
      .then(res => {
        setUnitsArea(
          res.map((m: any) => {
            return {
              label: m.shortName,
              value: m.id,
            };
          }),
        );
      })
      .catch(err => console.log(err))
      .finally(() => {
        setloadingsArea(false);
      });
    getUnits({type: 'MASS'})
      .then(res => {
        setUnitsMass(
          res.map((m: any) => {
            return {
              label: m.shortName,
              value: m.id,
            };
          }),
        );
      })
      .catch(err => console.log(err))
      .finally(() => {
        setloadingMass(false);
      });

    value.farmId &&
      getCertificateOfLands(value.farmId)
        .then(res => {
          setCertificateOfLand(() =>
            res.map((m: SEASON.Response.CertificateOfLands) => {
              return {
                label: m.landLotNo,
                value: m.id,
              };
            }),
          );
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => setloadingLand(false));
  };

  React.useEffect(() => {
    fetchUnit();
  }, []);

  React.useEffect(() => {
    if (loadingMass && loadingsArea && loadingLand) {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [loadingMass, loadingsArea, loadingLand]);

  return (
    <Formik
      initialValues={{
        cropsName: crops?.productsOfFarm.name,
      }}
      validationSchema={Schema}
      onSubmit={() => {
        if (crops) onSubmit(crops);
        else {
          Alert.alert(t('add_crops'), t('min_value_crops').toString());
        }
      }}>
      {({handleChange, handleBlur, values, handleSubmit, setFieldValue}) => (
        <>
          <ScrollViewKeyboardAvoidView
            scrollViewProps={{
              style: styles.container,
            }}
            loading={loading}
            bottomButton={
              <>
                {value.id ? (
                  <StepButton
                    subTitile={t('addSeason5Info')}
                    disableLeft={false}
                    disableRight={false}
                    onPressRight={handleSubmit}
                    onPressLeft={() => onSave(crops)}
                  />
                ) : (
                  <StepButtonSingle
                    subTitile={t('addSeason5Info')}
                    disableLeft={false}
                    disableRight={false}
                    onPressRight={handleSubmit}
                    // onPressLeft={() => onSave(valueCrops)}
                  />
                )}
              </>
            }>
            {crops ? (
              <CropsCard
                data={crops}
                farmId={value.farmId}
                unitsMass={unitsMass}
                unitsArea={unitsArea}
                certificateOfLand={certificateOfLand}
              />
            ) : (
              <TouchableOpacity
                style={styles.buttonAdd}
                onPress={() =>
                  RootNavigator.navigate(SCREEN_NAME.ADD_CROPS, {
                    farmId: value.farmId,
                    data: value,
                  })
                }>
                <Text style={[styleSheet.textStyleBasic, {lineHeight: 20}]}>
                  {t('add_crops')}
                </Text>
                <IconFigma name="arrow_r" />
              </TouchableOpacity>
            )}
            {/* <Text style={styleSheet.errorTextStyle}>
              <ErrorMessage name={'cropsName'} />
            </Text> */}
          </ScrollViewKeyboardAvoidView>
        </>
      )}
    </Formik>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  buttonAdd: {
    height: 50,
    width: '100%',
    backgroundColor: Colors.WHITE,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    borderColor: '#F0F2F1',
    borderWidth: 0.5,
    alignItems: 'center',
    paddingHorizontal: 17,
  },
});

export default Step5;
