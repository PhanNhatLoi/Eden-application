import {STAFF} from './type.d';

export const convertStaffProfile = (
  staffDetails?: STAFF.Response.StaffDetails,
): STAFF.Request.StaffProfile => {
  const staffReturn: STAFF.Request.StaffProfile = {
    id: staffDetails?.id || undefined,
    name: staffDetails?.name || null,
    shortName: staffDetails?.shortName || null,
    job: staffDetails?.job || null,
    salary: staffDetails?.salary || null,
    dayWorks: staffDetails?.dayWorks || null,
    phone: staffDetails?.phone || null,
    gender: staffDetails?.gender || 'OTHER',
    avatar: staffDetails?.avatar || null,
    birthday: staffDetails?.birthday || null,
    addresses:
      (staffDetails?.addresses.length &&
        staffDetails.addresses.map(m => {
          return {
            fullName: m.fullName || null,
            phoneNumber: m.phoneNumber || null,
            address1: m.address1 || null,
            apartmentNumber: m.apartmentNumber || null,
            countryId: m.country.id || null,
            provinceId: m.province.id || null,
            districtId: m.district.id || null,
            wardsId: m.wards.id || null,
            areaCode: m.areaCode || null,
            zipCode: m.zipCode || null,
            isDefault: m.isDefault || false,
          };
        })) ||
      [],
  };
  return staffReturn;
};
