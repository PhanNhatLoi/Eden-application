import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Formik} from 'formik';
import * as RootNavigation from 'src/navigations/root-navigator';
import {
  FieldTextInput,
  ScrollViewKeyboardAvoidView,
} from 'src/components/organisms';
import {StepButtonSingle} from 'src/components/molecules';
import {DIARY} from 'src/api/diary/type.d';
import MultipeMediaPicker from 'src/components/organisms/appForm/MultipeImageOrVideoPicker';
import {styleSheet} from 'src/styles/styleSheet';
import {Colors} from 'src/styles';
type Step1Props = {
  onSubmit?: (value: {description: string}) => void;
  value?: DIARY.Basic.WorkType;
  viewForm: boolean;
  infor?: DIARY.Response.Diary;
};

const Step1 = (props: Step1Props) => {
  const {onSubmit = _ => {}, value, viewForm, infor} = props;
  const {t} = useTranslation();
  const [loading, setloading] = useState<boolean>(true);
  useEffect(() => {
    setTimeout(() => {
      setloading(false);
    }, 500);
  }, []);

  const bottomContent = () => {
    return (
      infor && (
        <View style={styles.bottomContent}>
          <View style={{width: '50%'}}>
            <Text style={{...styles.text, textAlign: 'left'}}>
              {(infor.createdDate &&
                new Date(infor.createdDate).toLocaleString('vi-VN')) ||
                ''}
            </Text>
          </View>
          <View style={{width: '55%'}}>
            <Text style={styles.text}>
              {t('perfomer')}: {infor.sysAccountName}
            </Text>
            <Text style={styles.text}>
              {t('farm')}: {infor.farmName}
            </Text>
            <Text style={styles.text}>
              {t('season')}: {infor.farmingSeasonName}
            </Text>
            <Text style={styles.text}>{infor.fullAddress}</Text>
          </View>
        </View>
      )
    );
  };
  return (
    <Formik
      initialValues={{description: value?.description || ''}}
      onSubmit={onSubmit}>
      {({handleChange, handleBlur, values, handleSubmit, setFieldValue}) => (
        <>
          <ScrollViewKeyboardAvoidView
            loading={loading}
            headerHeight={190}
            scrollViewProps={{
              style: styles.container,
            }}
            bottomButton={
              <StepButtonSingle
                onPressRight={() =>
                  viewForm ? RootNavigation.goBack() : handleSubmit()
                }
                title={viewForm ? 'close' : 'next'}
              />
            }>
            <FieldTextInput
              autoFocus={!values.description}
              title={t('work_description')}
              disabled={viewForm}
              defaultValue={values.description}
              type="multiline"
              textInputProps={{
                onChangeText: handleChange('description'),
                onBlur: handleBlur('description'),
                multiline: true,
                placeholder: t('work_description').toString(),
              }}
              name="description"
            />
            {viewForm && (
              <MultipeMediaPicker
                supportUploadVideo
                isView={viewForm}
                // axis="horizontal"
                maximumImages={10}
                title={t('media_culture')}
                name="images"
                initValue={(value?.media && value?.media?.split('|')) || []}
                onPickNewImage={images => {
                  setFieldValue(
                    'media',
                    images.map(image => image.uri).join('|'),
                  );
                }}
                ImagePropsTextContent={(infor && bottomContent()) || undefined}
              />
            )}
          </ScrollViewKeyboardAvoidView>
        </>
      )}
    </Formik>
  );
};

export default Step1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  bottomContent: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  text: {
    textAlign: 'right',
    ...styleSheet.textStyleBasic,
    color: Colors.WHITE,
    fontSize: 12,
  },
});
