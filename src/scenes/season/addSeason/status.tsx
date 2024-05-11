import * as React from 'react';
import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import {Formik} from 'formik';
import {SCREEN} from 'src/help';
import {StepButton, StepButtonSingle} from 'src/components/molecules';
import {
  FieldDropsDownModal,
  FieldSelect,
  ScrollViewKeyboardAvoidView,
} from 'src/components/organisms';
import * as yup from 'yup';
import {SEASON} from 'src/api/season/type.d';
import {statusSeason} from 'src/state/reducers/season/const';
import {createOrUpdateSeason} from 'src/api/season/actions';
import * as RootNavigator from 'src/navigations/root-navigator';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import {useDispatch} from 'react-redux';
import {resetData} from 'src/state/reducers/season/seasonSlice';

type StatusProps = {
  value: SEASON.Request.Season;
};

const StatusUpdate = (props: StatusProps) => {
  const {value} = props;
  const {t} = useTranslation();
  const schema = yup.object().shape({
    seasonStatus: yup.string().required(() => t('required_field')),
  });
  const statusList = Object.keys(statusSeason);
  const [loading, setLoading] = React.useState<boolean>(false);
  const dispatch = useDispatch();
  const statusOptions = statusList.map((m, i) => {
    return {
      label: t(m),
      value: i,
    };
  });

  return (
    <Formik
      initialValues={{
        seasonStatus: value.seasonStatus,
      }}
      onSubmit={values => {
        if (values.seasonStatus === 'HARVESTED') {
          Alert.alert(
            t('confirm_update'),
            t('confirm_status_season_update').toString(),
            [
              {
                text: t('cancel').toString(),
                style: 'destructive',
                onPress: () => {},
              },
              {
                text: t('confirm').toString(),
                onPress: () => {
                  createOrUpdateSeason({
                    ...value,
                    seasonStatus: values.seasonStatus,
                  })
                    .then(res => {
                      RootNavigator.navigate(SCREEN_NAME.SEASON, {
                        refresh: true,
                      });
                      dispatch(resetData());
                    })
                    .catch(err => {
                      setLoading(false);
                      console.log(err);
                    });
                },
              },
            ],
          );
        } else
          createOrUpdateSeason({...value, seasonStatus: values.seasonStatus})
            .then(res => {
              RootNavigator.navigate(SCREEN_NAME.SEASON, {
                refresh: true,
              });
              dispatch(resetData());
            })
            .catch(err => {
              setLoading(false);
              console.log(err);
            });
      }}
      validationSchema={schema}>
      {({handleChange, handleBlur, handleSubmit, values, setFieldValue}) => (
        <>
          <ScrollViewKeyboardAvoidView
            scrollViewProps={{
              style: styles.container,
            }}
            bottomButton={
              <StepButtonSingle
                title={t('save').toString()}
                subTitile={t('')}
                onPressRight={handleSubmit}
                buttonStyle={styleSheet.buttonDefaultStyle}
                textButtonStyle={styleSheet.buttonDefaultText}
              />
            }>
            <FieldSelect
              minValueArray={1}
              loading={loading}
              options={statusOptions}
              placeholder={'status_season'}
              title={'status_season'}
              name="farmId"
              require
              defaultValue={
                ((statusList.findIndex(f => f === values.seasonStatus) ||
                  statusList.findIndex(f => f === values.seasonStatus) ===
                    0) && [
                  statusList.findIndex(f => f === values.seasonStatus),
                ]) ||
                []
              }
              onChangeValue={items => {
                setFieldValue(
                  'seasonStatus',
                  statusList.find((f, i) => i === items[0].value),
                );
              }}
            />
          </ScrollViewKeyboardAvoidView>
        </>
      )}
    </Formik>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 15,
    width: '100%',
  },
  filedText: {
    ...styleSheet.filedText,
    width: SCREEN.width - 40 - 100 - 10,
    marginRight: 10,
  },
  filedTextUnit: {
    ...styleSheet.filedText,
    width: 100,
  },
  dropDownContainerStyle: {
    ...styleSheet.filedText,
    width: 100,
    height: 150,
  },
  bottomTab: {
    width: SCREEN.width,
    alignItems: 'center',
  },
});

export default StatusUpdate;
