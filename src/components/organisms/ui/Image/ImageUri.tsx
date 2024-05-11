import {
  StyleSheet,
  Image,
  ImageResizeMode,
  StyleProp,
  ImageStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {IMAGE} from 'src/assets';
import {MEDIA_API} from 'src/config';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {createThumbnail} from 'react-native-create-thumbnail';
import IconFigma from './IconFigma';
import * as RootNavigation from 'src/navigations/root-navigator';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import {SCREEN} from 'src/help';
import {Colors} from 'src/styles';

type Props = {
  uri: string | undefined;
  resizeMode?: ImageResizeMode;
  style?: StyleProp<ImageStyle>;
  type?: 'view' | 'upload';
  supportViewFullSise?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  ImagePropsTextContent?: React.ReactNode;
};
type MediaType = 'image' | 'video' | undefined;

const ImageUri = (props: Props) => {
  const {
    uri = '',
    style,
    resizeMode,
    type = 'view',
    disabled = false,
    supportViewFullSise = false,
    onPress = () => {},
    ImagePropsTextContent,
  } = props;
  const [loading, setLoading] = useState<boolean>(true);
  const [configUri, setConfigUri] = useState<string>(
    uri?.includes('https://') ? uri : MEDIA_API + uri,
  );
  const [finishUri, setFinishUri] = useState<string>('');
  const [mediaType, setMediaType] = useState<MediaType>();
  const [sizeImage, setSizeImage] = useState<{
    width: number;
    height: number;
  }>({
    width: SCREEN.width - 10,
    height: SCREEN.height - 10,
  });

  useEffect(() => {
    if (configUri) {
      const mediatype = checkTypeMedia(configUri);
      setMediaType(mediatype);
      if (supportViewFullSise) {
        switch (mediatype) {
          case 'image':
            setFinishUri(configUri);
            Image.getSize(configUri, (width, height) => {
              //image size full screen
              setSizeImage({
                width: width * (SCREEN.width / width) - 2,
                height: height * (SCREEN.height / height) - 2,
              });
            });
            break;
          case 'video':
            createThumbnail({
              url: configUri || '',
              timeStamp: 0,
            })
              .then(response => {
                setFinishUri(response.path);
              })
              .catch(err => console.log({err}));
            break;
          default:
            break;
        }
      } else {
        setFinishUri(uri ? configUri : '');
      }
    }
  }, [configUri]);

  useEffect(() => {
    setConfigUri(uri?.includes('https://') ? uri : MEDIA_API + uri);
  }, [uri]);

  const checkTypeMedia = (uri: string): MediaType => {
    const testImage = /\.(jpg|jpeg|png|webp|avif|gif|svg|HEIF)$/.test(uri);
    const testVideo = /\.(HEVC|mp4)$/.test(uri);
    return testImage ? 'image' : testVideo ? 'video' : undefined;
  };

  return (
    <>
      <TouchableOpacity
        disabled={disabled}
        onPress={() => {
          if (mediaType === 'image') {
            supportViewFullSise &&
              RootNavigation.navigate(SCREEN_NAME.PRE_IMAGE, {
                image: {uri: finishUri, ...sizeImage},
                ImagePropsTextContent: ImagePropsTextContent,
              });
          }
          // supportViewFullSise && setViewFullSize(true);
          if (mediaType === 'video')
            RootNavigation.navigate(SCREEN_NAME.PLAY_VIDEO, {uri: configUri});
          onPress();
        }}>
        <Image
          source={
            finishUri
              ? {uri: finishUri}
              : type === 'view'
              ? IMAGE.DEFAULT_IMAGE
              : IMAGE.UPLOAD_IMAGE
          }
          style={style}
          resizeMode={resizeMode}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />
        {mediaType === 'video' && (
          <View
            style={{
              height: '100%',
              width: '100%',
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <IconFigma name="play" size={30} />
          </View>
        )}
      </TouchableOpacity>

      {loading && (
        <View
          style={[
            style,
            {
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              backgroundColor: Colors.WHITE,
            },
          ]}>
          <ActivityIndicator size={25} />
        </View>
      )}
    </>
  );
};

export default ImageUri;

const styles = StyleSheet.create({});
