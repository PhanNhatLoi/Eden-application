import {View, Text, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {styleSheet} from 'src/styles/styleSheet';
import {IMAGE} from 'src/assets';
import {t} from 'i18next';
import {Colors} from 'src/styles';
import SpinButton from 'src/components/organisms/buttons/SpinButton';
import {useDispatch} from 'react-redux';
import {loginUser} from 'src/state/reducers/authUser/authThunk';
import {AppDispatch} from 'src/state/store';
import * as Types from '../types';
import {initProfile, loginApi} from 'src/api/auth/actions';
import {SCREEN} from 'src/help';
import {AUTH} from 'src/api/auth/type';

type Props = {
  data: AUTH.REGISTER.Request.Register;
};

function CompeletedScreen(props: Props): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const {data} = props;

  useEffect(() => {
    loginApi({username: data.login, password: data.password})
      .then((res: {id_token: string}) => {
        const profileInit = {
          name: data.name?.trim(),
          shortName: data.shortName?.trim(),
          phone: data.login,
          avatar: data.avatar,
        };
        initProfile(res.id_token, profileInit)
          .then(res => {})
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    dispatch(loginUser({username: data.login, password: data.password}))
      .unwrap()
      .catch(error => {
        setLoading(false);
        console.log('🚀 ~ file: index.tsx:41 ~ onFinish ~ error:', error);
      });
  };

  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: Colors.WHITE,
        height: SCREEN.height,
        justifyContent: 'center',
        paddingHorizontal: 20,
      }}>
      <Image source={IMAGE.COMPELETED_BACKGROUND} />
      <Text style={{...styleSheet.linkTextStyle, marginTop: 30}}>
        {t('successful_registration')}
      </Text>
      <SpinButton
        isLoading={loading}
        title={t('login')}
        buttonProps={{
          onPress: () => handleSubmit(),
          style: {
            ...styleSheet.buttonPrimaryStyle,
          },
        }}
        titleProps={{
          style: {...styleSheet.buttonPrimaryText},
        }}
      />
    </View>
  );
}

export default CompeletedScreen;
