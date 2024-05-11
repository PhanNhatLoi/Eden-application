import * as React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import {ErrorMessage, Formik} from 'formik';
import * as yup from 'yup';
import {StepButton, StepButtonSingle} from 'src/components/molecules';
import {useState, useEffect} from 'react';
import {getMasterData} from 'src/api/appData/actions';
import {FARM} from 'src/api/farm/type.d';
import {styles} from './styles';
import {
  AppContainer,
  FieldSelect,
  ScrollViewKeyboardAvoidView,
} from 'src/components/organisms';
import {useSelector} from 'react-redux';
import {RootState} from 'src/state/store';
import {UpdateValue, alertPopup, saveValue} from '.';

const Step4 = () => {
  const value = useSelector((state: RootState) => state.farmReducer.farmBody);
  const {t} = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const schema = yup.object().shape({
    businessTypesIds: yup.array().min(1, () => t('required_field')),
  });
  const formType = value.id ? 'UPDATE' : 'CREATE';
  const [items, setItems] = useState([]);
  useEffect(() => {
    setLoading(true);
    fetchItem();
  }, []);

  const fetchItem = () => {
    getMasterData('CULTIVATION')
      .then(res => {
        setItems(
          res.map((m: any) => {
            return {
              label: m.name,
              value: m.id,
            };
          }),
        );
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  return (
    <Formik
      initialValues={{businessTypesIds: value.businessTypesIds || []}}
      onSubmit={values => {
        saveValue(values, 4);
      }}
      validationSchema={schema}>
      {({handleSubmit, setFieldValue, values, errors}) => (
        <AppContainer
          title={t('farmMethod')}
          headerRight={
            !value.id ? (
              <TouchableOpacity
                onPress={() => {
                  alertPopup(formType, values, true, 3, t);
                }}>
                <Text style={styles.textCancle}>{t('cancel')}</Text>
              </TouchableOpacity>
            ) : (
              <View style={{width: 20}}></View>
            )
          }>
          <ScrollViewKeyboardAvoidView
            scrollViewProps={{
              style: styles.container,
              contentContainerStyle: styles.content,
            }}
            bottomButton={
              <>
                {value.id ? (
                  <StepButtonSingle
                    subTitile={t('addFarm4Info')}
                    title="save"
                    buttonStyle={styleSheet.buttonDefaultStyle}
                    textButtonStyle={styleSheet.buttonDefaultText}
                    onPressRight={() =>
                      Object.keys(errors).length === 0 && UpdateValue(values)
                    }
                  />
                ) : (
                  <StepButtonSingle
                    subTitile={t('addFarm4Info')}
                    disableLeft={false}
                    disableRight={false}
                    onPressRight={handleSubmit}
                  />
                )}
              </>
            }>
            <FieldSelect
              multi
              loading={loading}
              options={items}
              placeholder={'farmMethod'}
              title={'farmMethod2'}
              name="businessTypesIds"
              require
              defaultValue={value.businessTypesIds || []}
              onChangeValue={items =>
                setFieldValue(
                  'businessTypesIds',
                  items.map(m => m.value),
                )
              }
            />
          </ScrollViewKeyboardAvoidView>
        </AppContainer>
      )}
    </Formik>
  );
};

export default Step4;
