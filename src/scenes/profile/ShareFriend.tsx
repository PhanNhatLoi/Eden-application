import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  AppContainer,
  ScrollViewKeyboardAvoidView,
} from 'src/components/organisms';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import {ICON} from 'src/assets';
import {SCREEN} from 'src/help';
import {Colors} from 'src/styles';
import {useSelector} from 'react-redux';
import {RootState} from 'src/state/store';
import {inviteInstall} from 'src/api/appData/actions';
import * as RootNavigation from 'src/navigations/root-navigator';
import QrCodeCT from 'src/components/organisms/ui/qrCode/QrCode';
import Share from 'react-native-share';
import SpinButton from 'src/components/organisms/buttons/SpinButton';
import IconFigma from 'src/components/organisms/ui/Image/IconFigma';

const ShareFriend = () => {
  const {t} = useTranslation();
  const profile = useSelector((state: RootState) => state.authReducer.user);
  const [appLink, setApplink] = useState<string>('');
  const [qrCodeImage, setQrCodeImage] = useState<string>();
  const [messageApp, setMessageApp] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingButton, setLoadingButton] = useState<boolean>(true);

  useEffect(() => {
    inviteInstall()
      .then(res => {
        setApplink(res.linkApp);
        setMessageApp(res.message);
      })
      .catch(err => {
        console.log(err);
        RootNavigation.goBack();
      })
      .finally(() => {
        setTimeout(() => {
          setLoadingButton(false);
        }, 1000);
      });
  }, []);

  useEffect(() => {
    if (appLink) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [appLink]);

  const onShare = async () => {
    const options = {
      message: messageApp,
      title: t('share_code_invite').toString(),
      url: qrCodeImage,
    };
    setTimeout(() => {
      setLoadingButton(false);
    }, 1000);
    Share.open(options)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };
  return (
    <AppContainer title={t('invite_friends')}>
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
            title={t('share_code_invite')}
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
          name="EDENHUB"
          value={appLink}
          size={140}
          logoUrl={ICON['app_icon']}
          logoSize={40}
          logoBackgroundColor={Colors.WHITE}
          logoBorderRadius={8}
          logoMargin={3}
          setQRImage={setQrCodeImage}
        />

        <Text
          style={[
            styleSheet.textStyleBold,
            {
              lineHeight: 20,
              color: Colors.SYS_BUTTON,
              marginTop: 34,
              width: 235,
              textAlign: 'center',
            },
          ]}>
          {t('scan_qr_des')} {profile?.id}
        </Text>
      </ScrollViewKeyboardAvoidView>
    </AppContainer>
  );
};

export default ShareFriend;

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
