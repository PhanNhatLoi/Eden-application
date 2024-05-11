import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {Formik} from 'formik';
import * as yup from 'yup';
import {StepButton, StepButtonSingle} from 'src/components/molecules';
import {getFarmList} from 'src/api/farm/actions';
import {FARM} from 'src/api/farm/type.d';
import {SEASON} from 'src/api/season/type.d';
import {
  FieldDropsDownModal,
  FieldSelect,
  ScrollViewKeyboardAvoidView,
} from 'src/components/organisms';
import {styles} from './styles';
import {useSelector} from 'react-redux';
import {RootState} from 'src/state/store';

type Step1Props = {
  onSubmit?: (value: {farmId: number | null}) => void;
  value: SEASON.Request.Season;
  onSave: (value: {farmId: number | null}) => void;
};

const Step1 = (props: Step1Props) => {
  const {onSubmit = _ => {}, value, onSave} = props;
  const {t} = useTranslation();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [farmList, setFarmlist] = React.useState<
    {
      value: number;
      label: string;
    }[]
  >([]);
  const sysAccountId = useSelector(
    (state: RootState) => state.authReducer.sysAccountIdOwer || null,
  );
  const schema = yup.object().shape({
    farmId: yup.string().required(() => t('required_field')),
  });

  React.useEffect(() => {
    setLoading(true);
    getFarmList({sysAccountId: sysAccountId})
      .then(res => {
        setFarmlist(() => {
          return (
            (res?.length &&
              res.map((m: FARM.Response.FarmGetList) => {
                return {
                  value: m.id,
                  label: m.name,
                };
              })) ||
            []
          );
        });
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return farmList.length ? (
    <Formik
      initialValues={{farmId: value.farmId || farmList[0].value}}
      onSubmit={onSubmit}
      validationSchema={schema}>
      {({handleChange, handleBlur, values, handleSubmit, setFieldValue}) => (
        <>
          <ScrollViewKeyboardAvoidView
            scrollViewProps={{
              style: styles.container,
            }}
            bottomButton={
              <>
                {value.id ? (
                  <StepButton
                    subTitile={t('addSeason1Info')}
                    disableLeft={false}
                    disableRight={false}
                    onPressRight={handleSubmit}
                    onPressLeft={() => onSave(values)}
                  />
                ) : (
                  <StepButtonSingle
                    subTitile={t('addSeason1Info')}
                    disableLeft={false}
                    disableRight={false}
                    onPressRight={handleSubmit}
                    // onPressLeft={() => onSave(values)}
                  />
                )}
              </>
            }>
            <FieldSelect
              minValueArray={1}
              loading={loading}
              options={farmList}
              placeholder={'select_farm'}
              title={t('farm_select')}
              name="farmId"
              require
              defaultValue={
                (values.farmId && [values.farmId]) ||
                (farmList.length && [farmList[0].value]) ||
                []
              }
              onChangeValue={items => {
                setFieldValue(
                  'farmId',
                  (items.length && items[0].value) || null,
                );
              }}
            />
          </ScrollViewKeyboardAvoidView>
        </>
      )}
    </Formik>
  ) : (
    <></>
  );
};

export default Step1;
