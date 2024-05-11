import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {Formik} from 'formik';
import * as yup from 'yup';
import {StepButton, StepButtonSingle} from 'src/components/molecules';
import FieldTextInput from 'src/components/organisms/appForm/FieldTextInput';
import {SEASON} from 'src/api/season/type.d';
import {styles} from './styles';
import {ScrollViewKeyboardAvoidView} from 'src/components/organisms';

type Step2Props = {
  onSubmit?: (value: {name: string}) => void;
  value: SEASON.Request.Season;
  onSave: (value: {name: string}) => void;
};

const Step2 = (props: Step2Props) => {
  const {onSubmit = _ => {}, value, onSave} = props;
  const {t} = useTranslation();
  const schema = yup.object().shape({
    name: yup.string().required(() => t('required_field')),
  });

  return (
    <Formik
      initialValues={{name: value.name || ''}}
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
                    subTitile={t('addSeason2Info')}
                    disableLeft={false}
                    disableRight={false}
                    onPressRight={handleSubmit}
                    onPressLeft={() => onSave(values)}
                  />
                ) : (
                  <StepButtonSingle
                    subTitile={t('addSeason2Info')}
                    disableLeft={false}
                    disableRight={false}
                    onPressRight={handleSubmit}
                    // onPressLeft={() => onSave(values)}
                  />
                )}
              </>
            }>
            <FieldTextInput
              autoFocus={!values.name}
              title={t('season_name') + ':'}
              defaultValue={values.name}
              // type="multiline"
              textInputProps={{
                placeholder: t('season_name').toString(),
                onChangeText: handleChange('name'),
                onBlur: handleBlur('name'),
                value: values.name,
              }}
              name="name"
              isRequired={true}
            />
          </ScrollViewKeyboardAvoidView>
        </>
      )}
    </Formik>
  );
};

export default Step2;
