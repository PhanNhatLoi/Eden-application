// @ts-ignore

export declare namespace STAFF {
  namespace BASIC {
    type Unit = {
      id: number | null;
      name: string | null;
    };
  }
  namespace Request {
    type ParamsFilter = {
      job?: string;
      salaryFrom?: number;
      salaryTo?: number;
      sort?: string;
    };

    type Staff = STAFF.Request.StaffUser & STAFF.Request.StaffProfile;

    type StaffUser = {
      login: string | null;
      password: string | null;
    };

    type Address = {
      fullName: string | null;
      phoneNumber: string | null;
      address1: string | null;
      apartmentNumber: string | null;
      countryId: number | null;
      provinceId: number | null;
      districtId: number | null;
      wardsId: number | null;
      areaCode: string | null;
      zipCode: string | null;
      isDefault: boolean;
    };

    type StaffProfile = {
      id?: number | null;
      // fullName: string | null;
      name: string | null;
      shortName: string | null;
      job: string | null;
      salary: number | null;
      dayWorks: number | string | null;
      phone: string | null;
      gender: 'MALE' | 'FEMALE' | 'OTHER' | null;
      avatar: string | null;
      birthday: string | null;
      addresses: Address[];
    };
  }

  namespace Response {
    type StaffList = {
      id: number;
      login: string;
      phone: string;
      firstName: string | null;
      lastName: string | null;
      email: string | null;
      activated: boolean;
      langKey: string | null;
      imageUrl: string | null;
      activationKey: string | null;
      resetKey: string | null;
      resetDate: string | null;
      otp: string | null;
      numberSendOtp: number | null;
      lastResendOtp: string | null;
      fullName: string | null;
      job: string | null;
      salary: number | null;
      dayWorks: number | null;
    };

    type Address = {
      id: number | null;
      address1: string | null;
      address2: string | null;
      isDefault: boolean | null;
      lat: number | null;
      lng: number | null;
      zipCode: string | null;
      areaCode: string | null;
      type: string | null;
      country: STAFF.BASIC.Unit;
      province: STAFF.BASIC.Unit;
      district: STAFF.BASIC.Unit;
      wards: STAFF.BASIC.Unit;
      fullName: string | null;
      phoneNumber: string | null;
      apartmentNumber: string | null;
    };

    type StaffDetails = {
      id: number | null;
      name: string | null;
      shortName: string | null;
      birthday: string | null;
      phone: string | null;
      email: string | null;
      gender: 'MALE' | 'FEMALE' | 'OTHER';
      avatar: string | null;
      addresses: Address[];
      fullName: string | null;
      job: string | null;
      salary: number | null;
      dayWorks: number | null;
      code: string | null;
      lastModifiedDate: string | null;
      sysAccountId: number | null;
      createdById: number | null;
    };
  }
}
