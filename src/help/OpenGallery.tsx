import requestPermission from './requestPermission';
import {optionsUploadImage, optionsUploadMultileImage} from 'src/styles/image';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import {API_UPLOAD_URL} from 'src/config';
import _ from 'lodash';
import {ImageURISource, Platform} from 'react-native';
import {store} from 'src/state/store';
import {pushNotify} from 'src/state/reducers/Notification/notify';
export type uploadResponseImageType = {
  imageName: string;
  filePath: string;
};
export const timingOpenLib = Platform.OS === 'ios' ? 1000 : 100;

const getFilename = function (str: string) {
  return str.replace(/^.*[\\\/]/, '');
};
const UploadImage = async (files: ImageOrVideo | ImageOrVideo[]) => {
  function createFormData(files: ImageOrVideo | ImageOrVideo[]) {
    const formData = new FormData();
    if (_.isArray(files) && files.length > 0) {
      files.forEach(file => {
        const filename = getFilename(file.path);
        formData.append('files', {
          name: filename,
          type: file.mime || 'image/jpeg',
          uri: file.path,
        });
      });
    }
    return formData;
  }
  let httpResponseCode = 200;
  const Fetch = await fetch(API_UPLOAD_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: createFormData(files),
  })
    .then(res => {
      httpResponseCode = res.status;
      return res.json();
    })
    .then(res => {
      return res;
    })
    .catch(err => {
      badResponst(httpResponseCode);
      console.log('Error code:', httpResponseCode);
    });
  return Fetch || [];
};

function badResponst(httpResponseCode: number) {
  console.log(httpResponseCode);
  switch (httpResponseCode) {
    case 413:
      store.dispatch(
        pushNotify({
          title: 'Request_Entity_Too_Large',
          message: 'Request_Entity_Too_Large',
        }),
      );
    case 400:
      store.dispatch(
        pushNotify({
          title: 'Request_Entity_Too_Large',
          message: 'Request_Entity_Too_Large',
        }),
      );
      break;
  }
}

type funcType = (
  value: ImageURISource,
) => void | React.Dispatch<React.SetStateAction<ImageURISource | undefined>>;

type funcMultipleType = (
  value: ImageURISource[],
) => void | React.Dispatch<React.SetStateAction<ImageURISource[] | undefined>>;

export const openCamera = async (
  setState: funcType,
  setIsVisibleModal: React.Dispatch<React.SetStateAction<boolean>>,
  crops?: boolean,
) => {
  //check permission camera

  const optionCrops = crops
    ? {
        cropping: crops,
        height: 1000,
        width: 1000,
      }
    : {};
  requestPermission({key: 'CAMERA', title: 'camera'})
    .then(async result => {
      if (result === 'granted') {
        const source: uploadResponseImageType[] = await ImagePicker.openCamera({
          ...optionsUploadImage,
          ...optionCrops,
        })
          .then(async (image: ImageOrVideo) => {
            setTimeout(() => {
              setIsVisibleModal(false);
            }, 300);
            return await UploadImage([image]);
          })
          .catch(err => console.log(err));
        if (source) {
          setState({uri: `${API_UPLOAD_URL}/${source[0].filePath}`});
        }
        return source;
      }
    })
    .catch(error => {
      console.log(error);
    });
  //open camera
};

export const openRecord = async (
  setState: funcType,
  setIsVisibleModal: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  //check permission camera
  requestPermission({key: 'CAMERA', title: 'camera'})
    .then(async result => {
      if (result === 'granted') {
        const source = await ImagePicker.openCamera({
          mediaType: 'video',
          // compressVideoPreset: 'HighestQuality',
        })
          .then(async image => {
            setTimeout(() => {
              setIsVisibleModal(false);
            }, 300);
            return await UploadImage([image]);
          })
          .catch(err => console.log(err.code));
        if (source) {
          setState({uri: `${API_UPLOAD_URL}/${source[0].filePath}`});
        }
        return source;
      }
    })
    .catch(error => {
      console.log(error);
    });
  //open camera
};

export const openGallery = async (
  setState: funcType,
  setIsVisibleModal: React.Dispatch<React.SetStateAction<boolean>>,
  crops?: 'square' | 'fullSize',
) => {
  //check permission photo
  requestPermission({
    key:
      Platform.OS === 'android' && Platform.Version < 33
        ? 'READ_EXTERNAL_STORAGE'
        : 'READ_MEDIA_IMAGES',
    title: 'gallery',
  })
    .then(async result => {
      //open gallery
      if (result === 'granted' || 'limited') {
        const source: uploadResponseImageType[] = await ImagePicker.openPicker({
          ...optionsUploadImage,
          mediaType: 'photo',
          width: crops === 'fullSize' ? undefined : 400,
          height: crops === 'fullSize' ? undefined : 400,
          cropping:
            crops === 'square' ? true : Platform.OS === 'ios' ? false : true,
        })
          .then(async (image: ImageOrVideo) => {
            setTimeout(() => {
              setIsVisibleModal(false);
            }, 300);
            return await UploadImage([image]);
          })
          .catch(err => console.log(err));
        if (source) {
          setState({uri: `${API_UPLOAD_URL}/${source[0].filePath}`});
        }
        return source;
      }
    })
    .catch(error => {
      console.log(error);
    });
};

export const openGalleryMultipleImage = async (
  setState: funcMultipleType,
  setIsVisibleModal: React.Dispatch<React.SetStateAction<boolean>>,
  maximumUpload?: number,
) => {
  //check permission photo
  requestPermission({
    key:
      Platform.OS === 'android' && Platform.Version < 33
        ? 'READ_EXTERNAL_STORAGE'
        : 'READ_MEDIA_IMAGES',
    title: 'gallery',
  })
    .then(async result => {
      //open gallery
      if (result === 'granted' || result === 'limited') {
        const source: uploadResponseImageType[] = await ImagePicker.openPicker({
          ...optionsUploadMultileImage,
          multiple: true,
          mediaType: 'photo',
        })
          .then(async (image: ImageOrVideo[]) => {
            setTimeout(() => {
              setIsVisibleModal(false);
            }, 300);
            if (maximumUpload) {
              return await UploadImage(image.slice(0, maximumUpload));
            }
            return await UploadImage(image);
          })
          .catch(err => console.log(err));
        if (source) {
          const multipleImage = source.map(m => {
            return {
              uri: `${API_UPLOAD_URL}/${m.filePath}`,
            };
          });
          setState(multipleImage);
        }
        return source;
      }
    })
    .catch(error => {
      console.log(error);
    });
};

export const openGalleryMultipleMedia = async (
  setState: funcMultipleType,
  setIsVisibleModal: React.Dispatch<React.SetStateAction<boolean>>,
  maximumUpload?: number,
) => {
  //check permission photo
  requestPermission({
    key:
      Platform.OS === 'android' && Platform.Version < 33
        ? 'READ_EXTERNAL_STORAGE'
        : 'READ_MEDIA_IMAGES',
    title: 'gallery',
  })
    .then(async result => {
      //open gallery
      if (result === 'granted' || result === 'limited') {
        const source: uploadResponseImageType[] = await ImagePicker.openPicker({
          ...optionsUploadMultileImage,
          multiple: true,
          mediaType: 'any',
        })
          .then(async (image: ImageOrVideo[]) => {
            if (maximumUpload) {
              return await UploadImage(image.slice(0, maximumUpload));
            }
            return await UploadImage(image);
          })
          .catch(err => console.log(err));
        if (source) {
          const multipleMedia = source.map(m => {
            return {
              uri: `${API_UPLOAD_URL}/${m.filePath}`,
            };
          });
          setState(multipleMedia);
        }
        setTimeout(() => {
          setIsVisibleModal(false);
        }, 300);
        return source;
      }
    })
    .catch(error => {
      console.log(error);
    });
};
