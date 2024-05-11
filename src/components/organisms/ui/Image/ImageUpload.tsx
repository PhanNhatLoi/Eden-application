import {
  ImageURISource,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors} from 'src/styles';
import {boxShadow} from 'src/styles/mixins';
import CustomModal from '../modals/Modal';
import {styleSheet} from 'src/styles/styleSheet';
import {t} from 'i18next';
import {openCamera, openGallery} from 'src/help/OpenGallery';
import {MEDIA_API} from 'src/config';
import ImageUri from './ImageUri';
import ImageModal from '../modals/ImageModal';
import IconFigma from './IconFigma';
import * as RootNavigation from 'src/navigations/root-navigator';
import {SCREEN_NAME} from 'src/navigations/screen-name';

type Props = {
  defaultUri?: string;
  width?: number;
  height?: number;
  shape?: 'square' | 'circle';
  onChange?: Function; //
  disabled?: boolean;
  positionButton?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
};
const ImageUpload = (props: Props) => {
  const [source, setSource] = useState<ImageURISource>({
    uri: props.defaultUri || '',
  });
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const {
    disabled = false,
    width = 100,
    height = 100,
    shape = 'circle',
    positionButton = {
      bottom: 5,
      right: 5,
    },
  } = props;
  const [viewFullImage, setViewFullImage] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (source.uri) {
      props.onChange?.(source.uri?.replace(MEDIA_API, ''));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  const styles = StyleSheet.create({
    imageStyle: {
      width: (props.width && props.width * 0.95) || 95,
      height: (props.height && props.height * 0.95) || 95,
      borderRadius:
        props.shape === 'square' ? 0 : props.width ? props.width / 2 : 100,
      borderColor: Colors.WHITE,
      borderWidth: 1,
    },
    borderBox: {
      position: 'relative',
      borderRadius:
        props.shape === 'square' ? 0 : props.width ? props.width / 2 : 100,
      width: props.width || 100,
      height: props.height || 100,
      flexDirection: 'row',
      justifyContent: 'center',
      backgroundColor: Colors.WHITE,
      alignItems: 'center',
      ...boxShadow(Colors.BLACK),
    },
    editButton: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      flex: 1,
      borderRadius: 100,
      height: height * 0.2,
      width: height * 0.2,
      ...positionButton,
      backgroundColor: Colors.WHITE,
      position: 'absolute',
    },
    optionContainer: {
      backgroundColor: Colors.WHITE,
      justifyContent: 'center',
      borderRadius: 8,
    },
    actionContainer: {
      borderColor: Colors.GRAY_DARK,
      borderWidth: 0.5,
      alignItems: 'center',
      padding: 18,
    },

    cancelContainer: {
      backgroundColor: Colors.GRAY_LIGHT,
      marginTop: 20,
      alignItems: 'center',
      padding: 18,
      borderRadius: 8,
    },
  });

  const getImageOnDevice = async (action: 'CAMERA' | 'GALARY' | 'VIEW') => {
    setLoading(true);
    // setIsVisibleModal(false);
    // setTimeout(
    //   () => {
    //for the weird bug on ios (state change make galary and camera close) so just way for the modal change first
    switch (action) {
      case 'CAMERA':
        openCamera(setSource, setIsVisibleModal, true);
        break;
      case 'GALARY':
        openGallery(setSource, setIsVisibleModal, 'square');
        break;
      case 'VIEW':
        setIsVisibleModal(false);
        RootNavigation.navigate(SCREEN_NAME.PRE_IMAGE, {
          image: {uri: source.uri},
        });
        // setViewFullImage(true);
        break;
      default:
        break;
    }
    //   },
    //   Platform.OS === 'ios' ? 700 : 100,
    //   // 1,
    // );
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  return (
    <View>
      <TouchableOpacity
        style={styles.borderBox}
        disabled={disabled}
        onPress={() => setIsVisibleModal(true)}>
        <ImageUri uri={source.uri} style={styles.imageStyle} type="upload" />
        {source?.uri && (
          <View style={styles.editButton}>
            <IconFigma name="pencil" size={height * 0.11} />
          </View>
        )}
      </TouchableOpacity>
      <CustomModal
        animationTiming={300}
        isVisible={isVisibleModal}
        setIsVisible={setIsVisibleModal}
        justifyContent="flex-end">
        <View>
          <View style={styles.optionContainer}>
            {source.uri && (
              <TouchableOpacity
                disabled={loading}
                style={styles.actionContainer}
                onPress={() => getImageOnDevice('VIEW')}>
                <Text style={styleSheet.textStyleBasic}>
                  {t('view_image').toLocaleUpperCase()}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              disabled={loading}
              style={styles.actionContainer}
              onPress={() => getImageOnDevice('CAMERA')}>
              <Text style={styleSheet.textStyleBasic}>
                {t('camera').toLocaleUpperCase()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={loading}
              style={styles.actionContainer}
              onPress={() => getImageOnDevice('GALARY')}>
              <Text style={styleSheet.textStyleBasic}>
                {t('gallery').toLocaleUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.cancelContainer}
            onPress={() => setIsVisibleModal(false)}>
            <Text style={styleSheet.textStyleBasic}>{t('cancel')}</Text>
          </TouchableOpacity>
        </View>
      </CustomModal>
      {/* {
        <ImageModal
          isVisible={viewFullImage}
          setIsVisible={setViewFullImage}
          image={{uri: source.uri}}
        />
      } */}
    </View>
  );
};

export default ImageUpload;
