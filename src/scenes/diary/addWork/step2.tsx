import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Formik} from 'formik';
import {StepButtonSingle} from 'src/components/molecules';
import {styleSheet} from 'src/styles/styleSheet';
import {DIARY} from 'src/api/diary/type.d';
import MultipeMediaPicker from 'src/components/organisms/appForm/MultipeImageOrVideoPicker';
import {Colors} from 'src/styles';
import {ScrollViewKeyboardAvoidView} from 'src/components/organisms';
import {IMAGE} from 'src/assets';

type Step2Props = {
  onSubmit?: (value: {media: string}) => void;
  value?: DIARY.Basic.WorkType;
  viewForm: boolean;
  infor: DIARY.Response.Diary;
};

const Step2 = (props: Step2Props) => {
  const {onSubmit = _ => {}, value, viewForm, infor} = props;
  const {t} = useTranslation();
  const fullAddress = infor.fullAddress;

  const bottomContent = () => {
    return (
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
          <Text style={styles.text}>{fullAddress}</Text>
        </View>
      </View>
    );
  };

  return (
    <Formik initialValues={{media: value?.media || ''}} onSubmit={onSubmit}>
      {({handleChange, handleBlur, values, handleSubmit, setFieldValue}) => (
        <>
          <ScrollViewKeyboardAvoidView
            headerHeight={190}
            scrollViewProps={{
              style: styles.container,
              contentContainerStyle: {height: '100%'},
            }}
            bottomButton={
              <StepButtonSingle onPressRight={handleSubmit} title="save_work" />
            }>
            <MultipeMediaPicker
              supportUploadVideo
              isView={viewForm}
              maximumImages={10}
              title={t('media_culture')}
              name="images"
              initValue={(values?.media && values?.media?.split('|')) || []}
              onPickNewImage={images => {
                setFieldValue(
                  'media',
                  images.map(image => image.uri).join('|'),
                );
              }}
              ImagePropsTextContent={infor.id && bottomContent()}
            />
          </ScrollViewKeyboardAvoidView>
        </>
      )}
    </Formik>
  );
};

export default Step2;

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
