/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageURISource,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {styleSheet} from 'src/styles/styleSheet';
import {ErrorMessage} from 'formik';
import {useState} from 'react';
import {
  openCamera,
  openGalleryMultipleImage,
  openGalleryMultipleMedia,
  openRecord,
  timingOpenLib,
} from 'src/help/OpenGallery';
import CustomModal from '../ui/modals/Modal';
import {FieldTitle} from 'src/components/molecules';
import {Colors} from 'src/styles';
import {useTranslation} from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SCREEN} from 'src/help';
import ImageUri from '../ui/Image/ImageUri';
import {MEDIA_API} from 'src/config';
import IconFigma from '../ui/Image/IconFigma';
import {IMAGE} from 'src/assets';

type MultipeMediaPickerProps = {
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  isRequired?: boolean;
  maximumImages?: number;
  title: string;
  name: string;
  initValue?: string[];
  onPickNewImage: (images: ImageURISource[]) => void;
  axis?: 'horizontal' | 'vertical';
  supportUploadVideo?: boolean;
  isView?: boolean;
  ImagePropsTextContent?: React.ReactNode;
  imageBackground?: string;
};

const MultipeMediaPicker = (props: MultipeMediaPickerProps) => {
  const {
    isRequired = false,
    name,
    title,
    onPickNewImage,
    initValue,
    maximumImages,
    supportUploadVideo = false,
    axis = 'vertical',
    isView = false,
    imageBackground,
    ImagePropsTextContent,
  } = props;
  const {t} = useTranslation();
  const [source, setSource] = useState<ImageURISource[]>(
    initValue ? initValue.map(obj => ({uri: obj})) : [],
  );
  const [disable, setDisable] = useState<boolean>(false);
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  React.useEffect(() => {
    onPickNewImage(
      source.map(m => {
        return {
          ...m,
          uri: m.uri?.replace(MEDIA_API, ''),
        };
      }),
    );
  }, [source]);

  React.useEffect(() => {
    if (maximumImages) {
      setDisable(maximumImages ? source.length >= maximumImages : false);
    }
  }, [source]);

  const getImageOnDevice = async (
    action: 'CAMERA' | 'GALARY' | 'RECORD_VIDEO',
  ) => {
    setDisableButton(true);
    // setIsVisibleModal(false);
    // setTimeout(() => {
    //for the weird bug on ios (state change make galary and camera close) so just way for the modal change first
    switch (action) {
      case 'CAMERA':
        openCamera(value => {
          setSource(pre => [...pre, value]);
        }, setIsVisibleModal);
        break;
      case 'RECORD_VIDEO':
        openRecord(value => {
          setSource(pre => [...pre, value]);
        }, setIsVisibleModal);
        break;
      case 'GALARY':
        (supportUploadVideo &&
          openGalleryMultipleMedia(
            value => {
              setSource(pre => [...pre, ...value]);
            },
            setIsVisibleModal,
            maximumImages && maximumImages - source.length,
          )) ||
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

  const EmptyData = () => {
    return (
      <View
        style={{
          width: '100%',
          height: 300,
          alignItems: 'center',
          marginTop: 15,
        }}>
        {imageBackground && isView && (
          <Image
            style={{height: '100%', marginVertical: 10}}
            source={IMAGE[imageBackground]}
            resizeMode="contain"
          />
        )}
        {isView && (
          <Text style={styleSheet.textStyleBasic}>{t('no_') + t(title)}</Text>
        )}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <FieldTitle isRequired={isRequired} title={title} />
      <View style={styles.picker}>
        {axis === 'vertical' ? (
          <>
            {!isView && (
              <>
                <TouchableOpacity
                  style={{marginTop: 21}}
                  disabled={disable}
                  onPress={() => setIsVisibleModal(true)}>
                  <View
                    style={{
                      ...styles.imageSize,
                      ...styleSheet.center,

                      backgroundColor: disable ? Colors.GRAY_02 : Colors.WHITE,
                    }}>
                    <IconFigma name="camera" size={32} />
                  </View>
                </TouchableOpacity>
                <Text style={styles.maximumImagesText}>{`${t(
                  'maximum_upload_allowed',
                )} ${maximumImages} ${t('images/video')}`}</Text>
              </>
            )}

            {source.length ? (
              <View style={styles.listData}>
                {source.map((m, index) => {
                  return (
                    <View key={m.uri} style={styles.item}>
                      <TouchableOpacity onPress={() => {}}>
                        <ImageUri
                          supportViewFullSise
                          ImagePropsTextContent={ImagePropsTextContent}
                          uri={m.uri}
                          style={{
                            height: '100%',
                            width: '100%',
                            borderRadius: 8,
                            borderWidth: 0.5,
                            borderColor: Colors.GRAY_03,
                          }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => {
                          const newSource = source.filter(
                            (obj, id) => id !== index,
                          );
                          setSource(newSource);
                        }}>
                        {!isView && (
                          <Ionicons
                            name="close-circle"
                            color={Colors.GRAY_MEDIUM}
                            size={20}
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                })}
                <View style={styles.item}>
                  {loading && (
                    <View
                      style={{
                        height: '100%',
                        width: '100%',
                        borderRadius: 8,
                        borderWidth: 0.5,
                        borderColor: Colors.GRAY_03,
                        backgroundColor: Colors.GRAY_02,
                        justifyContent: 'center',
                      }}>
                      <ActivityIndicator color={Colors.SYS_BUTTON} />
                    </View>
                  )}
                </View>
              </View>
            ) : (
              <EmptyData />
            )}
          </>
        ) : (
          <FlatList
            keyboardShouldPersistTaps="handled"
            horizontal
            data={source}
            style={{width: '100%', marginTop: 10}}
            ListEmptyComponent={isView ? <EmptyData /> : undefined}
            ListHeaderComponent={
              !disable && !isView ? (
                <TouchableOpacity
                  disabled={disable}
                  onPress={() => setIsVisibleModal(true)}>
                  <View
                    style={{
                      ...styles.imageSize,
                      ...styleSheet.center,
                      backgroundColor: disable ? Colors.GRAY_02 : Colors.WHITE,
                    }}>
                    <IconFigma name="uploadIcon" />
                  </View>
                </TouchableOpacity>
              ) : undefined
            }
            renderItem={({item, index}) => {
              return (
                <View>
                  <ImageUri uri={item.uri} style={{...styles.imageSize}} />
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => {
                      const newSource = source.filter(
                        (obj, id) => id !== index,
                      );
                      setSource(newSource);
                    }}>
                    {!isView && (
                      <Ionicons
                        name="close-circle"
                        color={Colors.GRAY_MEDIUM}
                        size={20}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        )}
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
            {supportUploadVideo && (
              <TouchableOpacity
                disabled={disableButton}
                style={styles.actionContainer}
                onPress={() => getImageOnDevice('RECORD_VIDEO')}>
                <Text style={styleSheet.textStyleBasic}>
                  {t('record_video').toLocaleUpperCase()}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              disabled={disableButton}
              style={styles.actionContainer}
              onPress={() => {
                getImageOnDevice('GALARY');
              }}>
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
    // marginTop: 20,
    alignItems: 'center',
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
    borderWidth: 1,
    borderColor: Colors.GRAY_03,
    borderStyle: 'dashed',
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
    top: 4,
    right: 4,
  },
  maximumImagesText: {
    ...styleSheet.textStyleBasic,
    marginTop: 21,
    color: Colors.GRAY_03,
  },
  listData: {
    marginTop: 25,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    width: (SCREEN.width - 40) * 0.25,
    padding: 5,
    height: (SCREEN.width - 40) * 0.25,
  },
});

export default MultipeMediaPicker;
