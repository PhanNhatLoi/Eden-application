import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {AppContainer, FieldTextInput} from 'src/components/organisms';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import {Formik} from 'formik';
import {Hr} from 'src/scenes/diary/styles';
import {FieldTitle} from 'src/components/molecules';
import {ScrollView} from 'react-native-gesture-handler';
import {ICON} from 'src/assets';
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';
import {saveFilter} from 'src/state/reducers/staff/staffSlice';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from 'src/state/store';
import {unitPrice} from 'src/config';

type Props = {
  navigation: NavigationProp<ParamListBase>;
};
const FilterStaff = (props: Props) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {navigation} = props;
  const filterRedux = useSelector((state: RootState) => state.staff);
  const Schema = Yup.object().shape({
    // from: Yup.number().min(0, 'min_0'),
  });
  return (
    <Formik
      initialValues={{
        job: filterRedux.job || '',
        salaryFrom: filterRedux.salaryFrom?.toString() || '',
        salaryTo: filterRedux.salaryTo?.toString() || '',
      }}
      onSubmit={values => {
        const filter = {
          job: values.job || undefined,
          salaryFrom: Number(values.salaryFrom) || undefined,
          salaryTo: Number(values.salaryTo) || undefined,
        };
        dispatch(saveFilter(filter));
        navigation.goBack();
      }}
      validationSchema={Schema}>
      {({handleSubmit, handleChange, values, setFieldValue}) => (
        <AppContainer
          title={t('setting_filter')}
          headerRight={
            <TouchableOpacity onPress={handleSubmit}>
              <Text style={styleSheet.linkTextStyle}>{t('save')}</Text>
            </TouchableOpacity>
          }>
          <ScrollView contentContainerStyle={styles.container}>
            <View style={{zIndex: 1}}>
              <FieldTextInput
                title={t('job')}
                textInputProps={{
                  onChangeText: handleChange('job'),
                  placeholder: t('job').toString(),
                  style: styles.field,
                }}
                defaultValue={values.job || ''}
                name="job"
              />
            </View>
            <Hr />
            <FieldTitle title={t('salary')} />
            <View style={styles.row}>
              <View style={styles.input}>
                <FieldTextInput
                  title=""
                  type="integer"
                  textInputProps={{
                    onChangeText: handleChange('salaryFrom'),
                    // keyboardType: 'decimal-pad',
                    style: styles.field,
                    placeholder: t('fill_number').toString(),
                    maxLength: 11,
                  }}
                  defaultValue={values.salaryFrom}
                  name="salaryFrom"
                  isRequired={false}
                />
                <Text style={styles.dong}>{unitPrice}</Text>
              </View>
              <View
                style={{
                  height: 60,
                  justifyContent: 'center',
                }}>
                <Image
                  source={ICON['line']}
                  style={{
                    width: 16,
                    height: 1,
                    marginTop: 10,
                  }}
                />
              </View>

              <View style={styles.input}>
                <FieldTextInput
                  title=""
                  type="integer"
                  textInputProps={{
                    onChangeText: handleChange('salaryTo'),
                    // keyboardType: 'decimal-pad',
                    style: styles.field,
                    placeholder: t('fill_number').toString(),
                    maxLength: 11,
                  }}
                  defaultValue={values.salaryTo}
                  name="salaryTo"
                  isRequired={false}
                />
                <Text style={styles.dong}>{unitPrice}</Text>
              </View>
            </View>
          </ScrollView>
        </AppContainer>
      )}
    </Formik>
  );
};

export default FilterStaff;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 25,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    width: '45%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  field: {
    ...styleSheet.filedText,
    flex: 1,
    marginRight: 10,
    width: '100%',
  },

  dong: {
    ...styleSheet.textStyleBasic,
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});
