/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
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
import {
  openCamera,
  openGalleryMultipleImage,
  timingOpenLib,
} from 'src/help/OpenGallery';
import CustomModal from '../ui/modals/Modal';
import {FieldTitle} from 'src/components/molecules';
import {Colors} from 'src/styles';
import {useTranslation} from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {MEDIA_API} from 'src/config';
import ImageUri from '../ui/Image/ImageUri';
import Spiner from '../ui/Spiner';
type MultipeImagePickerProps = {
  isRequired?: boolean;
  maximumImages?: number;
  title: string;
  name: string;
  initValue?: string[];
  onPickNewImage: (images: ImageURISource[]) => void;
};

const MultipeImagePicker = (props: MultipeImagePickerProps) => {
  const {
    isRequired = false,
    name,
    title,
    onPickNewImage,
    initValue,
    maximumImages,
  } = props;
  const {t} = useTranslation();
  const [source, setSource] = useState<ImageURISource[]>(
    initValue ? initValue.map(obj => ({uri: obj})) : [],
  );
  const [disable, setDisable] = useState<boolean>(false);
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  React.useEffect(() => {
    onPickNewImage(
      source.map(m => {
        {
          return {
            ...m,
            uri: m.uri?.replace(MEDIA_API, ''),
          };
        }
      }),
    );
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [source]);

  React.useEffect(() => {
    if (maximumImages) {
      setDisable(maximumImages ? source.length >= maximumImages : false);
    }
  }, [source]);

  const getImageOnDevice = async (action: 'CAMERA' | 'GALARY') => {
    // setIsVisibleModal(false);
    setDisableButton(true);
    // setTimeout(() => {
    //for the weird bug on ios (state change make galary and camera close) so just way for the modal change first
    switch (action) {
      case 'CAMERA':
        openCamera(value => {
          setSource(pre => [...pre, value]);
        }, setIsVisibleModal);
        break;
      case 'GALARY':
        openGalleryMultipleImage(
          value => {
            setSource(pre => [...pre, ...value]);
          },
          setIsVisibleModal,
          maximumImages && maximumImages - source.length,
        );

        break;
      default:
        break;
    }

    setTimeout(() => {
      setDisableButton(false);
    }, 1000);
    // }, timingOpenLib);
  };
  return (
    <View style={styles.container}>
      <FieldTitle isRequired={isRequired} title={title} />
      <View style={styles.picker}>
        <FlatList
          horizontal
          style={{height: 100}}
          data={source}
          ListHeaderComponent={
            !disable ? (
              <TouchableOpacity
                disabled={disable}
                onPress={() => setIsVisibleModal(true)}>
                <ImageBackground
                  source={ICON.defaultImgBackground}
                  style={{...styles.imageSize, ...styleSheet.center}}>
                  <Image source={ICON.uploadIcon} />
                </ImageBackground>
              </TouchableOpacity>
            ) : undefined
          }
          renderItem={({item, index}) => {
            return (
              <>
                <ImageUri
                  supportViewFullSise
                  uri={item.uri}
                  style={{...styles.imageSize}}
                />
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => {
                    const newSource = source.filter((obj, id) => id !== index);
                    setLoading(true);
                    setSource(newSource);
                  }}>
                  <Ionicons
                    name="close-circle"
                    color={Colors.GRAY_MEDIUM}
                    size={20}
                  />
                </TouchableOpacity>
              </>
            );
          }}
        />
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
              disabled={disableButton}
              style={styles.actionContainer}
              onPress={() => getImageOnDevice('CAMERA')}>
              <Text style={styleSheet.textStyleBasic}>
                {t('camera').toLocaleUpperCase()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={disableButton}
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
    marginTop: 15,
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
  imageSize: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginHorizontal: 5,
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

export default MultipeImagePicker;
