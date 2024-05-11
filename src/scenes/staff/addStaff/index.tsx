import * as React from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from 'src/styles';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import {StepWrapperL} from 'src/components/organisms';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import Step1 from './step1';
import Step2 from './step2';
import {STAFF} from 'src/api/staff/type.d';
import {getDetailsStaff} from 'src/api/staff/actions';
import {convertStaffProfile} from 'src/api/staff/convert';

type AddFarmProps = {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<{
    params: {staff?: STAFF.Request.StaffProfile};
  }>;
};

const AddStaff = (props: AddFarmProps) => {
  //props
  const {navigation} = props;
  //props

  //const
  const {params} = props.route;
  const {t} = useTranslation();
  const typeForm = params?.staff ? 'UPDATE' : 'CREATE';
  //const

  //state
  const [dirty, setDirty] = React.useState<boolean>(false);
  const [profile, setProfle] = React.useState<STAFF.Request.StaffProfile>(
    params?.staff || convertStaffProfile(),
  );
  const [user, setUser] = React.useState<STAFF.Request.StaffUser>({
    login: null,
    password: null,
  });
  const [step, setStep] = React.useState(0);
  //state

  //handle save value for step
  const handleSetValue = (newValue: any, id: number) => {
    switch (id) {
      case 0:
        setProfle({...profile, ...newValue});
        setStep(1);
        break;
      case 1:
        setUser({...newValue});
        setProfle({...profile, phone: newValue.login});
        setStep(0);
        break;
    }
  };

  //step list for register or update
  const stepList = [
    //register and update
    {
      id: 0,
      title: t(params?.staff ? 'staff_infor' : 'add_staff'),
      content: (
        <Step1
          onSubmit={v => handleSetValue(v, 0)}
          profile={profile}
          user={user}
          type={typeForm}
          setDirty={setDirty}
        />
      ),
    },
    //only register
    {
      id: 1,
      title: t(params?.staff ? 'staff_infor' : 'add_staff'),
      content: (
        <Step2
          onSubmit={v => handleSetValue(v, 1)}
          user={user}
          setDirty={setDirty}
        />
      ),
    },
  ];

  //handle go back
  const onGoBack = () => {
    if (step > 0) {
      setStep(pre => pre - 1);
    } else {
      navigation.goBack();
    }
  };

  //render
  return (
    <StepWrapperL
      stepList={stepList}
      step={step}
      onGoBack={onGoBack}
      headerRight={
        params?.staff?.id ? null : (
          <TouchableOpacity
            onPress={() => {
              if (dirty) {
                Alert.alert(
                  t('confirm_cancel'),
                  t('confirm_cancel_des').toString(),
                  [
                    {
                      text: t('confirm').toString(),
                      style: 'default',
                      onPress: () => navigation.goBack(),
                    },
                    {
                      text: t('cancel').toString(),
                      style: 'destructive',
                      onPress: () => {},
                    },
                  ],
                );
              } else {
                navigation.goBack();
              }
            }}>
            <Text style={styles.textCancle}>{t('cancel')}</Text>
          </TouchableOpacity>
        )
      }
    />
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  textCancle: {
    ...styleSheet.textStyleBold,
    color: Colors.CANCLE_BUTTON,
  },
});

export default AddStaff;
