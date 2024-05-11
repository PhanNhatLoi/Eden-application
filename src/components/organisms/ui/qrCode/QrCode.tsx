import React, {useEffect, useRef, useState} from 'react';
import {Image, ImageSourcePropType, View} from 'react-native';
import QRCode, {QRCodeProps} from 'react-native-qrcode-svg';
import RNFS from 'react-native-fs';
import IconFigma from '../Image/IconFigma';
import ImgToBase64 from 'react-native-image-base64-png';

type Props = {
  value: string;
  logoUrl?: ImageSourcePropType;
  size?: number;
  setQRImage?: React.Dispatch<React.SetStateAction<string | undefined>>;
  QRCodeProps?: QRCodeProps;
  logoSize?: number;
  logoBackgroundColor?: string;
  logoBorderRadius?: number;
  logoMargin?: number;
  name?: string;
};
function QrCodeCT(props: Props) {
  const {
    value,
    logoUrl,
    QRCodeProps = {},
    size = 140,
    logoSize,
    logoBackgroundColor,
    logoBorderRadius,
    logoMargin,
    name = 'EDENHUB',
    setQRImage = () => {},
  } = props;

  const [refQrCode, setRefQrCode] = useState<any>();

  useEffect(() => {
    if (refQrCode?.toDataURL) {
      refQrCode?.toDataURL((base64Image: string) => {
        let filePath = RNFS.CachesDirectoryPath + `/${name}.png`;
        RNFS.writeFile(filePath, base64Image, 'base64')
          .then(success => {
            setQRImage('file://' + filePath);
          })
          .catch(err => console.log(err));
      });
    }
  }, [refQrCode]);

  return (
    <View>
      <IconFigma name="borderQrCode" size={size + 25} />
      <View
        style={{
          position: 'absolute',
          height: size + 25,
          width: size + 25,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <QRCode
          ecl="H"
          value={value}
          logo={logoUrl}
          size={size}
          logoSize={logoSize}
          logoBackgroundColor={logoBackgroundColor}
          logoBorderRadius={logoBorderRadius}
          logoMargin={logoMargin}
          {...QRCodeProps}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          top: size * -10000,
        }}>
        <QRCode
          {...QRCodeProps}
          ecl="H"
          quietZone={100}
          value={value}
          logo={logoUrl}
          size={1000}
          logoSize={300}
          logoBackgroundColor={logoBackgroundColor}
          logoBorderRadius={logoBorderRadius && logoBorderRadius * 100}
          // logoMargin={20}
          getRef={c => {
            setRefQrCode(c);
          }}
        />
      </View>
    </View>
  );
}

export default QrCodeCT;
