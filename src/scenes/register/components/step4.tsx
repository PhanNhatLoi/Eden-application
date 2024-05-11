import {Text, View} from 'react-native';
import React from 'react';
import {t} from 'i18next';
import {styles} from '../types';
import {styleSheet} from 'src/styles/styleSheet';
import {Formik} from 'formik';
import {SCREEN} from 'src/help';
import {Colors} from 'src/styles';
import {
  FieldTextInput,
  ScrollViewKeyboardAvoidView,
} from 'src/components/organisms';
import {StepButtonSingle} from 'src/components/molecules';
import * as Yup from 'yup';

type Props = {
  handleSubmit: (value: {name: string; shortName: string}) => void;
};
const FillFullName = (props: Props) => {
  const {handleSubmit = () => {}} = props;
  const onFinish = (value: {name: string; shortName: string}) => {
    handleSubmit({name: value.name, shortName: value.shortName});
  };
  const SignupSchema = Yup.object().shape({
    name: Yup.string().required(t('required_field').toString()),
    shortName: Yup.string().required(t('required_field').toString()),
  });

  return (
    <Formik
      initialValues={{name: '', shortName: ''}}
      onSubmit={onFinish}
      validationSchema={SignupSchema}>
      {({handleSubmit, handleChange}) => (
        <ScrollViewKeyboardAvoidView
          scrollViewProps={{
            style: styles.container,
          }}
          bottomButton={
            <StepButtonSingle title="next" onPressRight={handleSubmit} />
          }>
          <View style={{alignItems: 'center'}}>
            <Text
              style={{
                ...styleSheet.textStyleBold,
                fontSize: 30,
                color: Colors.BLACK,
                lineHeight: 100,
              }}>
              {t('register')}
            </Text>
          </View>
          <Text style={styles.description}>
            {t('please_fill_your_full_name')}
          </Text>
          <FieldTextInput
            autoFocus
            title={''}
            textInputProps={{
              placeholder: t('first_name').toString(),
              onChangeText: handleChange('name'),
              multiline: false,
              style: {
                ...styleSheet.filedText,
                width: SCREEN.width - 40,
              },
            }}
            name="name"
          />
          <FieldTextInput
            title={''}
            textInputProps={{
              placeholder: t('last_name').toString(),
              onChangeText: handleChange('shortName'),
              multiline: false,
              style: {
                ...styleSheet.filedText,
                width: SCREEN.width - 40,
              },
            }}
            name="shortName"
          />
        </ScrollViewKeyboardAvoidView>
      )}
    </Formik>
  );
};

export default FillFullName;
