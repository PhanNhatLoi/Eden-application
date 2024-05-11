import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {Formik} from 'formik';
import * as yup from 'yup';
import {StepButton, StepButtonSingle} from 'src/components/molecules';
import FieldDatePickerL from 'src/components/organisms/appForm/FieldDatePickerL';
import {SEASON} from 'src/api/season/type.d';
import {styles} from './styles';
import {ScrollViewKeyboardAvoidView} from 'src/components/organisms';

type Step3Props = {
  onSubmit?: (value: {sowingDate: string; harvestDate: string}) => void;
  value: SEASON.Request.Season;
  onSave: (value: {sowingDate: string; harvestDate: string}) => void;
};

const Step3 = (props: Step3Props) => {
  const {onSubmit = _ => {}, value, onSave} = props;
  const {t} = useTranslation();
  const schema = yup.object().shape({
    sowingDate: yup.string().required(() => t('required_field')),
    harvestDate: yup.string().required(() => t('required_field')),
  });

  //function change Day + 1
  function addOneDay(date = new Date()) {
    date.setDate(date.getDate() + 1);

    return date;
  }

  return (
    <Formik
      initialValues={{
        sowingDate: value.sowingDate || '',
        harvestDate: value.harvestDate || '',
      }}
      onSubmit={onSubmit}
      validationSchema={schema}>
      {({handleChange, handleSubmit, values}) => (
        <>
          <ScrollViewKeyboardAvoidView
            scrollViewProps={{
              style: styles.container,
            }}
            bottomButton={
              <>
                {value.id ? (
                  <StepButton
                    subTitile={t('addSeason3Info')}
                    disableLeft={false}
                    disableRight={false}
                    onPressRight={handleSubmit}
                    onPressLeft={() => onSave(values)}
                  />
                ) : (
                  <StepButtonSingle
                    subTitile={t('addSeason3Info')}
                    disableLeft={false}
                    disableRight={false}
                    onPressRight={handleSubmit}
                    // onPressLeft={() => onSave(values)}
                  />
                )}
              </>
            }>
            <FieldDatePickerL
              title={t('sowingDate').toString() + ':'}
              name="sowingDate"
              onChange={(date: string) => {
                handleChange('sowingDate')(date);
                handleChange('harvestDate')('');
              }}
              isRequired
              value={values.sowingDate}
            />
            <FieldDatePickerL
              title={t('expectedHarvestDate').toString() + ':'}
              name="harvestDate"
              isRequired
              onChange={handleChange('harvestDate')}
              value={values.harvestDate}
              minimumDate={
                (values.sowingDate && addOneDay(new Date(values.sowingDate))) ||
                undefined
              }
            />
          </ScrollViewKeyboardAvoidView>
        </>
      )}
    </Formik>
  );
};

export default Step3;
