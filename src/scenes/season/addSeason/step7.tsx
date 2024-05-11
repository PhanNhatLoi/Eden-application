import * as React from 'react';
import {
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import {Formik} from 'formik';
import {StepButtonSingle} from 'src/components/molecules';
import MaterialCard from '../addMaterials/MaterialCard';
import {ICON} from 'src/assets';
import {boxShadow, margin} from 'src/styles/mixins';
import {Colors} from 'src/styles';
import * as RootNavigator from 'src/navigations/root-navigator';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import {useSelector} from 'react-redux';
import {RootState} from 'src/state/store';
import {SEASON} from 'src/api/season/type.d';
import {createOrUpdateSeason} from 'src/api/season/actions';
import {useDispatch} from 'react-redux';
import {
  resetData,
  updateMaterials,
} from 'src/state/reducers/season/seasonSlice';
import {ScrollViewKeyboardAvoidView} from 'src/components/organisms';
import IconFigma from 'src/components/organisms/ui/Image/IconFigma';
import * as RootNavigation from 'src/navigations/root-navigator';
import {CommonActions} from '@react-navigation/native';

type Step7Props = {
  onSubmit?: (value: {materials: SEASON.Request.Material[]}) => void;
  value: SEASON.Request.Season;
  onSave: (value: {materials: SEASON.Request.Material[]}) => void;
};

const Step7 = (props: Step7Props) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const {value, onSave} = props;
  const reduxMaterials = useSelector(
    (state: RootState) => state.season.materials,
  );
  const [count, setCount] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(true);
  React.useEffect(() => {
    setCount(count + 1);
  }, [reduxMaterials]);

  React.useEffect(() => {
    dispatch(updateMaterials(value.materials));
    setLoading(false);
  }, []);

  const handleSubmit = (values: SEASON.Request.Season) => {
    setLoading(true);
    const newSeason: SEASON.Request.Season = {
      ...value,
      materials: reduxMaterials,
    };
    createOrUpdateSeason(newSeason)
      .then(res => {
        dispatch(resetData());
        const link = newSeason.id
          ? SCREEN_NAME.SEASON
          : SCREEN_NAME.SEASON_CREATE_COMPLETED;
        RootNavigator.navigate(link, {
          refresh: true,
          farmingSeasonId: res.id,
          farmId: newSeason.farmId,
        });
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <Formik initialValues={{}} onSubmit={() => handleSubmit(value)}>
      {({handleChange, handleBlur, values, handleSubmit, setFieldValue}) => (
        <>
          <ScrollViewKeyboardAvoidView
            scrollViewProps={{
              style: styles.container,
            }}
            bottomButton={
              <StepButtonSingle
                title="finish"
                loading={loading}
                subTitile={t('addSeason7Info')}
                onPressRight={() =>
                  value.id
                    ? onSave({materials: reduxMaterials})
                    : handleSubmit()
                }
              />
            }>
            <FlatList
              style={styles.container}
              scrollEnabled={false}
              data={reduxMaterials}
              renderItem={({item, index}) => (
                <MaterialCard data={item} index={index} />
              )}
              ListFooterComponent={
                <TouchableOpacity
                  // disabled
                  style={styles.addContent}
                  onPress={() =>
                    RootNavigator.navigate(SCREEN_NAME.ADD_MATERIAL, {
                      // id: count,
                    })
                  }>
                  <Text style={[styleSheet.textStyleBasic]}>
                    {t('Add_materials')}
                  </Text>
                  <IconFigma name="arrow_r" />
                </TouchableOpacity>
              }
            />
          </ScrollViewKeyboardAvoidView>
        </>
      )}
    </Formik>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    marginTop: 10,
  },
  addContent: {
    flexDirection: 'row',
    height: 50,
    padding: 15,
    ...margin(15, 20, 10, 20),
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderColor: Colors.GRAY_02,
    borderWidth: 0.5,
    borderRadius: 8,
    ...boxShadow(Colors.BLACK),
  },
  rightView: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    borderRadius: 8,
  },
});

export default Step7;
