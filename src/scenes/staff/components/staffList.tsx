import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {STAFF} from 'src/api/staff/type.d';
import {SwipeableView} from 'src/components/molecules';
import {Colors} from 'src/styles';
import {boxShadow, margin} from 'src/styles/mixins';
import {styleSheet} from 'src/styles/styleSheet';
import {ICON} from 'src/assets';
import {useTranslation} from 'react-i18next';
import * as RootNavigation from 'src/navigations/root-navigator';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import {
  DeleteAccount,
  DeleteProfileStaff,
  getDetailsStaff,
} from 'src/api/staff/actions';
import {convertStaffProfile} from 'src/api/staff/convert';
import {useDispatch} from 'react-redux';
import {AppDispatch} from 'src/state/store';
import {deleteAccount} from 'src/state/reducers/authUser/authThunk';
import IconFigma from 'src/components/organisms/ui/Image/IconFigma';
('');

type Props = {
  staffs: STAFF.Response.StaffList[];
  onRefresh: () => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
const unitPrice = 'đ';
const StaffList = (props: Props) => {
  const {staffs = [], onRefresh} = props;
  const {t} = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState<boolean>(false);
  const renderItem = ({
    item,
    index,
  }: {
    item: STAFF.Response.StaffList;
    index: number;
  }) => {
    return (
      // <SwipeableView
      //   key={item.id}
      //   onPressSwipeView={() => {
      //     if (!props.loading) {
      //       props.setLoading(true);
      //       DeleteProfileStaff({phone: item.phone})
      //         .then(res => {
      //           DeleteAccount({login: item.phone})
      //             .then(res => {})
      //             .finally(() => props.setLoading(false));
      //         })
      //         .catch(err => console.log(err));
      //     }
      //   }}
      //   swipeChildren={
      //     <View style={styles.rightView}>
      //       <Image source={ICON['trash']} />
      //     </View>
      //   }>
      <TouchableOpacity
        key={item.id}
        disabled={loading && props.loading}
        style={[styles.staffCard, {marginTop: !index ? 10 : 1}]}
        onPress={() =>
          !props.loading &&
          getDetailsStaff(item.phone)
            .then((res: STAFF.Response.StaffDetails) => {
              RootNavigation.navigate(SCREEN_NAME.ADD_STAFF, {
                staff: convertStaffProfile(res),
              });
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false))
        }>
        <View style={styles.contentCard}>
          <Image
            source={ICON['staff_avatar']}
            style={{height: 40, width: 40}}
          />
          <View
            style={{
              ...margin(10, 0, 0, 12),
              flex: 1,
            }}>
            <Text
              numberOfLines={1}
              style={[styleSheet.textStyleBold, {flex: 1, fontSize: 14}]}>
              {item.fullName}
            </Text>
            <View>
              <View style={[styleSheet.row, {marginTop: 9}]}>
                <Text style={[styles.text, {width: '45%'}]}>{t('work')}:</Text>
                {item.job ? (
                  <Text
                    numberOfLines={1}
                    style={[styles.text, {flex: 1, color: Colors.PRIMARY}]}>
                    {item.job}
                  </Text>
                ) : (
                  <Text
                    numberOfLines={1}
                    style={[styles.text, {flex: 1, fontStyle: 'italic'}]}>
                    {t('no_data')}
                  </Text>
                )}
              </View>
              <View style={[styleSheet.row, {marginTop: 7}]}>
                <Text style={[styles.text, {width: '45%'}]}>
                  {t('salary_month')}:
                </Text>
                <Text style={[styles.text, {flex: 1}]}>
                  <Text
                    style={{
                      color: Colors.CANCLE_BUTTON,
                    }}>
                    {Number(item.salary).toLocaleString('US-en')}{' '}
                  </Text>
                  <Text
                    style={{
                      textDecorationLine: 'underline',
                      color: Colors.CANCLE_BUTTON,
                    }}>
                    {unitPrice}
                  </Text>
                </Text>
              </View>
            </View>
            <Text style={styleSheet.textStyleBasic}></Text>
          </View>
        </View>

        <IconFigma name="arrow_r" />
      </TouchableOpacity>
      // </SwipeableView>
    );
  };
  return staffs.length ? (
    <View>
      {staffs.map((m, i) => {
        return renderItem({item: m, index: i});
      })}
    </View>
  ) : (
    <View
      style={{justifyContent: 'center', alignItems: 'center', height: '100%'}}>
      <Text>{t('none_data')}</Text>
    </View>
  );
};

export default StaffList;

const styles = StyleSheet.create({
  bottomContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    height: '100%',
    width: '100%',
  },
  staffCard: {
    marginHorizontal: 20,
    paddingHorizontal: 12,
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
    borderColor: Colors.GRAY_03,
    ...boxShadow(Colors.BLACK),
    ...styleSheet.listSpace,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  rightView: {
    width: 80,
    height: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  text: {
    ...styleSheet.textStyleBasic,
    // marginTop: 8,
    fontSize: 12,
    color: Colors.GRAY_04,
  },
});
