import {Alert, Image, ImageBase, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  AppContainer,
  ScrollViewKeyboardAvoidView,
} from 'src/components/organisms';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import {SCREEN} from 'src/help';
import {Colors} from 'src/styles';
import {inviteSeason} from 'src/api/appData/actions';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {SEASON} from 'src/api/season/type.d';
import SpinButton from 'src/components/organisms/buttons/SpinButton';
import Share from 'react-native-share';
import IconFigma from 'src/components/organisms/ui/Image/IconFigma';
import ImgToBase64 from 'react-native-image-base64-png';
import {MEDIA_API} from 'src/config';
import QrCodeCT from 'src/components/organisms/ui/qrCode/QrCode';

type Props = {
  navigation: NavigationProp<ParamListBase>;
  route?: RouteProp<{
    params: {farmingSeasonId: number; logo: string};
  }>;
};
const ShareSeason = (props: Props) => {
  const {t} = useTranslation();
  const params = props.route?.params || {farmingSeasonId: null, logo: ''};
  const {navigation} = props;

  const [appLink, setApplink] = useState<string>('');
  const [messageLink, setMessageLink] = useState<string>('');
  const [qrCodeImg, setqrCodeImg] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingButton, setLoadingButton] = useState<boolean>(true);
  const [logoBase64, setLogoBase64] = useState<string>('');

  useEffect(() => {
    if (appLink) {
      fetchImageQR();
    }
  }, [appLink]);

  const fetchImageQR = async () => {
    if (params.logo) {
      ImgToBase64.getBase64String(MEDIA_API + params.logo)
        .then(base64String => {
          setLogoBase64('data:image/png;base64,' + base64String);
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        })
        .catch(err => console.log(err));
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (qrCodeImg) {
      setTimeout(() => {
        setLoadingButton(false);
      }, 500);
    }
  }, [qrCodeImg]);

  useEffect(() => {
    inviteSeason({farmingSeasonId: params.farmingSeasonId})
      .then((res: SEASON.Response.ShareAppLink) => {
        setApplink(res.linkApp);
        setMessageLink(res.message);
        setTimeout(() => {
          setLoadingButton(false);
        }, 1000);
      })
      .catch(err => {
        console.log(err);
        navigation.goBack();
      });
  }, []);

  const onShare = async () => {
    const options = {
      message: messageLink,
      title: t('share_code_season').toString(),
      url: qrCodeImg,
    };
    setTimeout(() => {
      setLoadingButton(false);
    }, 1000);
    Share.open(options)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  };
  return (
    <AppContainer title={t('season_info')}>
      <ScrollViewKeyboardAvoidView
        loading={loading}
        scrollViewProps={{
          style: {paddingTop: 20},
          contentContainerStyle: styles.content,
        }}
        bottomButton={
          <SpinButton
            icon={<IconFigma name="share" />}
            colorSpiner={Colors.SYS_BUTTON}
            isLoading={loadingButton}
            title={t('share_code_season')}
            buttonProps={{
              onPress: () => {
                setLoadingButton(true);
                setTimeout(() => {
                  onShare();
                }, 500);
              },
              style: [
                styleSheet.buttonDefaultStyle,
                {width: SCREEN.width - 40},
              ],
            }}
            titleProps={{
              style: styleSheet.buttonDefaultText,
            }}
          />
        }>
        <QrCodeCT
          logoUrl={(logoBase64 && {uri: logoBase64}) || undefined}
          value={appLink}
          size={140}
          setQRImage={setqrCodeImg}
          logoSize={40}
          logoBackgroundColor={Colors.WHITE}
          logoBorderRadius={100}
          logoMargin={3}
        />

        <Text
          style={[
            styleSheet.textStyleBasic,
            {
              lineHeight: 20,
              color: Colors.SYS_BUTTON,
              marginTop: 34,
              width: 235,
              textAlign: 'center',
            },
          ]}>
          {t('scan_qr_des_season')}
        </Text>
      </ScrollViewKeyboardAvoidView>
    </AppContainer>
  );
};

export default ShareSeason;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 10,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {
    height: SCREEN.height - 300,
    width: SCREEN.width,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
