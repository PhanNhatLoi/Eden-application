import {AUTH} from './type';

export const convertProfileRequest = (
  profileResponse: AUTH.PROFILE.Response.Profile,
): AUTH.PROFILE.Request.Profile => {
  const profileReturn: AUTH.PROFILE.Request.Profile = {
    id: profileResponse.id || undefined,
    name: profileResponse.name || null,
    shortName: profileResponse.shortName || null,
    birthday: profileResponse.birthday || null,
    phone: profileResponse.phone || null,

    email: profileResponse.email || null,
    gender: profileResponse.gender || null,
    avatar: profileResponse.avatar || null,
    job: profileResponse.job || null,
    salary: profileResponse.salary || null,
    dayWorks: profileResponse.dayWorks || null,
    addresses: profileResponse.addresses.map(address =>
      convertProfileAddress(address),
    ),
  };
  return profileReturn;
};

export const convertProfileAddress = (
  profileAddressResponse: AUTH.PROFILE.Response.Address,
): AUTH.PROFILE.Request.Address => {
  const addressReturn = {
    fullName: profileAddressResponse.fullName || null,
    phoneNumber: profileAddressResponse.phoneNumber || null,
    address1: profileAddressResponse.address1 || null,
    apartmentNumber: profileAddressResponse.apartmentNumber || null,
    countryId: profileAddressResponse.country?.id || null,
    provinceId: profileAddressResponse.province?.id || null,
    districtId: profileAddressResponse.district?.id || null,
    wardsId: profileAddressResponse.wards?.id || null,
    areaCode: profileAddressResponse.areaCode || null,
    zipCode: profileAddressResponse.zipCode || null,
    isDefault: profileAddressResponse.isDefault || false,
  };
  return addressReturn;
};
