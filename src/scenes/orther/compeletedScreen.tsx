import {View, Text, Image} from 'react-native';
import React, {useState} from 'react';
import {styleSheet} from 'src/styles/styleSheet';
import {IMAGE} from 'src/assets';
import {t} from 'i18next';
import {Colors} from 'src/styles';
import SpinButton from 'src/components/organisms/buttons/SpinButton';
import {useDispatch} from 'react-redux';
import {loginUser} from 'src/state/reducers/authUser/authThunk';
import {RouteProp} from '@react-navigation/native';
import {AppDispatch} from 'src/state/store';
import {AUTH} from 'src/api/auth/type';

type Props = {
  route?: RouteProp<{
    params: {
      description: string;
      user: AUTH.LOGIN.Request.Login;
    };
  }>;
};

function CompeletedScreen(props: Props): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async () => {
    setLoading(true);
    props?.route?.params &&
      dispatch(loginUser(props?.route?.params.user))
        .unwrap()
        .catch(error => {
          console.log('🚀 ~ file: index.tsx:41 ~ onFinish ~ error:', error);
        })
        .finally(() => {
          setLoading(false);
        });
  };

  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: Colors.WHITE,
        height: '100%',
        justifyContent: 'center',
        paddingHorizontal: 20,
      }}>
      <Image source={IMAGE.COMPELETED_BACKGROUND} />
      <Text style={{...styleSheet.linkTextStyle, marginTop: 30}}>
        {props.route && t(props.route?.params.description)}
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
