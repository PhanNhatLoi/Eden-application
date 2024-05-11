import * as React from 'react';
import {
  Image,
  ImageBackground,
  ImageStyle,
  ImageURISource,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {styleSheet} from 'src/styles/styleSheet';
import {ErrorMessage} from 'formik';
import {ICON} from 'src/assets';
import {useState} from 'react';
import {openCamera, openGallery, timingOpenLib} from 'src/help/OpenGallery';
import CustomModal from '../ui/modals/Modal';
import {FieldTitle} from 'src/components/molecules';
import {Colors} from 'src/styles';
import {useTranslation} from 'react-i18next';
import {MEDIA_API} from 'src/config';
import ImageUri from '../ui/Image/ImageUri';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconFigma from '../ui/Image/IconFigma';
type SingleImagePickerProps = {
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  isRequired?: boolean;
  title?: string;
  subTitle?: string | null;
  name: string;
  imageStyle?: ImageStyle;
  onSelectImage?: (image: ImageURISource) => void;
  value?: string;
};

const SingleImagePicker = (props: SingleImagePickerProps) => {
  const {
    isRequired = false,
    name,
    title,
    subTitle,
    imageStyle = {},
    onSelectImage = _ => {},
    value,
    setLoading,
  } = props;
  const {t} = useTranslation();
  // const [source, setSource] = useState<ImageURISource>();
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [disabledButton, setDisabledButton] = useState(false);
  const getImageOnDevice = async (action: 'CAMERA' | 'GALARY') => {
    setDisabledButton(true);
    // setIsVisibleModal(false);
    // setTimeout(() => {
    //for the weird bug on ios (state change make galary and camera close) so just way for the modal change first
    switch (action) {
      case 'CAMERA':
        openCamera(
          image =>
            onSelectImage({...image, uri: image.uri?.replace(MEDIA_API, '')}),
          setIsVisibleModal,
        );
        break;
      case 'GALARY':
        openGallery(
          image =>
            onSelectImage({
              ...image,
              uri: image.uri?.replace(MEDIA_API, ''),
            }),
          setIsVisibleModal,
          'fullSize',
        );
        break;
      default:
        break;
    }
    // }, timingOpenLib);
    setTimeout(() => {
      setDisabledButton(false);
    }, 1000);
  };
  return (
    <View style={styles.container}>
      {title ? <FieldTitle isRequired={isRequired} title={title} /> : null}
      <View style={styles.picker}>
        <TouchableOpacity
          onPress={() => (value ? {} : setIsVisibleModal(true))}>
          {value ? (
            <>
              <ImageUri
                supportViewFullSise
                uri={value}
                style={{
                  ...imageStyle,
                  borderColor: Colors.GRAY_03,
                  borderWidth: 1,
                  borderRadius: 8,
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  onSelectImage({uri: undefined});
                }}
                style={{position: 'absolute', top: 5, right: 5}}>
                <IconAnt name="closecircle" color={Colors.GRAY_03} size={20} />
              </TouchableOpacity>
            </>
          ) : (
            // <ImageBackground
            //   source={ICON.defaultImgBackground}
            //   style={{...imageStyle, ...styleSheet.center}}>
            <View
              style={[
                imageStyle,
                styleSheet.center,
                {
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: Colors.GRAY_03,
                  borderStyle: 'dashed',
                },
              ]}>
              <IconFigma name="uploadIcon" size={30} />
              {subTitle ? (
                <Text style={{...styleSheet.textStyleSub, ...styles.subTitle}}>
                  {subTitle}
                </Text>
              ) : null}
            </View>
            // </ImageBackground>
          )}
        </TouchableOpacity>
        <View />
      </View>
      <Text style={styleSheet.errorTextStyle}>
        <ErrorMessage name={name} />
      </Text>
      <CustomModal
        isVisible={isVisibleModal}
        setIsVisible={setIsVisibleModal}
        justifyContent="flex-end">
        <View>
          <View style={styles.optionContainer}>
            <TouchableOpacity
              disabled={disabledButton}
              style={styles.actionContainer}
              onPress={() => getImageOnDevice('CAMERA')}>
              <Text style={styleSheet.textStyleBasic}>
                {t('camera').toLocaleUpperCase()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={disabledButton}
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
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    // marginTop: 15,
  },
  picker: {
    // marginTop: 15,
  },
  fieldInput: {
    ...styleSheet.filedText,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  icon: {
    width: 22,
    height: 22,
  },
  subTitle: {
    marginHorizontal: 20,
    textAlign: 'center',
    marginTop: 10,
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
  deleteBtn: {
    position: 'absolute',
    top: 0,
    right: 4,
  },
});

export default SingleImagePicker;
