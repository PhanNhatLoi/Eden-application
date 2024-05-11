import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  Keyboard,
} from 'react-native';
import React from 'react';
import {padding} from 'src/styles/mixins';
import {styleSheet} from 'src/styles/styleSheet';
import IconOcti from 'react-native-vector-icons/Octicons';
import * as RootNavigator from 'src/navigations/root-navigator';
import {useTranslation} from 'react-i18next';
import {StepButtonSingle, SwipeableView} from 'src/components/molecules';
import {Colors} from 'src/styles';
import {ICON} from 'src/assets';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import {DIARY} from 'src/api/diary/type.d';
import {useSelector} from 'react-redux';
import {RootState} from 'src/state/store';
import {useDispatch} from 'react-redux';
import {
  initialWork,
  pushWorks,
  removeWorks,
} from 'src/state/reducers/diary/diarySlice';
import {ErrorMessage, Field, Formik} from 'formik';
import * as Yup from 'yup';
import {OptionType} from 'src/api/appData/type';
import TextInput from 'src/components/molecules/TextInput';
import {ScrollViewKeyboardAvoidView} from 'src/components/organisms';
import IconFigma from 'src/components/organisms/ui/Image/IconFigma';
type Props = {
  onSubmit?: (value: {works: DIARY.Basic.WorkType[]}) => void;
  value?: DIARY.Request.Diary;
  viewForm?: boolean;
  seasonList: OptionType[];
};

const step1 = (props: Props) => {
  const {t} = useTranslation();
  const {value, onSubmit = _ => {}, viewForm = false, seasonList} = props;
  const dishpatch = useDispatch();
  const [defaultWork, setDefaultWork] =
    React.useState<DIARY.Basic.WorkType>(initialWork);
  const reduxWork = useSelector(
    (state: RootState) => state?.diary?.works || [],
  );

  const addItem = (item: DIARY.Basic.WorkType) => {
    return (
      <Field name="name">
        {({
          field, // { name, value, onChange, onBlur }
          form: {values}, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
          meta,
        }: any) => (
          <View style={styles.workItem}>
            <View style={styles.input}>
              <TextInput
                maxLength={30}
                autoFocus
                style={{justifyContent: 'center', height: '100%'}}
                placeholderTextColor={Colors.GRAY_02}
                placeholder={t('enter_category_work').toString()}
                onChangeText={value => {
                  setDefaultWork({
                    ...item,
                    name: value.trim(),
                  });
                }}
                defaultValue={item.name || ''}
              />
              <Text style={styleSheet.errorTextStyle}>
                <ErrorMessage name="name" />
              </Text>
            </View>
            <TouchableOpacity
              disabled={!item.name}
              onPress={() => {
                Keyboard.dismiss();
                setDefaultWork(initialWork);
                dishpatch(pushWorks(item));

                setTimeout(() => {
                  RootNavigator.navigate(SCREEN_NAME.DIARY_ADD_WORKS, {
                    work: item,
                    farmingSeasonId: value?.farmingSeasonId,
                    seasonList: seasonList,
                    index: reduxWork.length,
                    infor: value,
                  });
                }, 300);
              }}>
              <IconOcti
                name="check"
                size={20}
                color={defaultWork?.name ? Colors.SYS_BUTTON : Colors.GRAY_01}
              />
            </TouchableOpacity>
          </View>
        )}
      </Field>
    );
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: DIARY.Basic.WorkType;
    index: number;
  }) => {
    return (
      <SwipeableView
        key={index}
        onPressSwipeView={() => dishpatch(removeWorks(index))}
        swipeChildren={
          !viewForm && (
            <View style={styles.rightView}>
              <Image source={ICON['trash']} />
            </View>
          )
        }>
        <TouchableOpacity
          style={styles.workItem}
          onPress={() => {
            Keyboard.dismiss();
            RootNavigator.navigate(SCREEN_NAME.DIARY_ADD_WORKS, {
              work: item,
              farmingSeasonId: value?.farmingSeasonId,
              viewForm: viewForm,
              seasonList: seasonList,
              index: index,
              infor: value,
            });
          }}>
          <View style={styles.itemStyle}>
            <Text style={styleSheet.textStyleBold}>{item.name}</Text>
          </View>
          <IconFigma name="arrow_r" />
        </TouchableOpacity>
      </SwipeableView>
    );
  };

  const Schema = Yup.object().shape({
    // name: Yup.string().required(t('required_field').toString()),
  });
  return (
    <Formik
      initialValues={{
        work: [],
      }}
      validationSchema={Schema}
      onSubmit={values => {
        if (defaultWork.name) {
          Alert.alert(t('confirm_next'), t('confirm_next_des').toString(), [
            {
              text: t('cancel').toString(),
              onPress: () => {},
              style: 'destructive',
            },
            {
              text: t('confirm').toString(),
              onPress: () => {
                reduxWork.length && onSubmit({works: reduxWork});
              },
              style: 'default',
            },
          ]);
        } else reduxWork.length && onSubmit({works: reduxWork});
      }}>
      {({errors, touched, handleSubmit, handleChange}) => (
        <>
          <ScrollViewKeyboardAvoidView
            headerHeight={190}
            scrollViewProps={{
              style: styles.container,
            }}
            bottomButton={
              <StepButtonSingle
                subTitile={props.viewForm ? '' : t('addDiary1')}
                disableLeft={false}
                disableRight={!reduxWork.length}
                onPressRight={handleSubmit}
              />
            }>
            {reduxWork.map((m, i) => {
              return renderItem({item: m, index: i});
            })}
            {!viewForm && <View>{addItem(defaultWork)}</View>}
          </ScrollViewKeyboardAvoidView>
        </>
      )}
    </Formik>
  );
};

export default step1;

const styles = StyleSheet.create({
  workItem: {
    height: 60,
    backgroundColor: Colors.WHITE,
    borderWidth: 0.5,
    borderColor: Colors.GRAY_02,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...padding(10, 30, 10, 20),
  },
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    // marginTop: 10,
  },
  list: {
    marginTop: 0.5,
  },
  addButton: {
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: 22,
  },
  itemStyle: {
    height: 60,
    justifyContent: 'center',
    ...padding(0, 0, 0, 20),
  },
  rightView: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    borderWidth: 0.5,
    borderColor: Colors.GRAY_01,
  },
  input: {
    ...styleSheet.inputStyle,
    flex: 1,
    height: 40,
    marginRight: 20,
    backgroundColor: Colors.WHITE,
  },
});
