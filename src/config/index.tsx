import {Platform} from 'react-native';
import Config from 'react-native-config';

export const API_URL = Config.API_URL;
export const SERVICES_SYS = Config.SERVICES_SYS;
export const SERVICES_SYS_AUTH = Config.SERVICES_SYS_AUTH;
export const SERVICES_GODI = Config.SERVICES_GODI;
export const VERSION = Config.VERSION;
export const VERSION_APP = Config.VERSION_APP;
export const GOOGLE_MAP_API_KEY = Config.GOOGLE_MAP_API_KEY;
export const API_UPLOAD_URL = API_URL + '/services/vslfiles/api/files';
export const API_UPLOAD_MEDIA_URL = API_URL + '/services/vslfiles/api/files';
export const MEDIA_API = API_URL + '/services/vslfiles/api/files/';

export const JWT = 'jwt_agrisys';
export const utcTimeString = 'DD/MM/YYYY';

export const unitPrice = 'VND';

export const APP_INSTALL_LINK =
  Platform.OS === 'android'
    ? 'https://play.google.com/store/apps/details?id=com.edenhub.farm&pli=1'
    : 'https://apps.apple.com/vn/app/eden-hub/id6451351715';
