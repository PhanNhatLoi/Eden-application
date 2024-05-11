export type ChangePhoneBodyRequest = any;
export type ChangeEmailBodyRequest = any;

// Type AUTH
export declare namespace AUTH {
  // -------- LOGIN -------- //
  namespace LOGIN {
    //Request
    namespace Request {
      type Login = {
        username: string;
        password: string;
      };
    }

    //Response
    namespace Response {
      type Login = {
        id_token: string;
      };
    }
  }
  // -------- LOGIN -------- //

  // -------- PROFILE -------- //
  namespace PROFILE {
    //Basic type
    namespace Basic {
      type GenderType = 'MALE' | 'FEMALE' | 'OTHER';
      type MasterDataType = {
        id: number | null;
        name: string | null;
      };
    }

    //Request
    namespace Request {
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

      //create or update profile
      type Profile = {
        id?: number | null; // undefine when create profile
        name: string | null; // first name
        shortName: string | null; // last name
        phone: string | null;
        birthday?: string | null;
        email?: string | null;
        gender?: 'MALE' | 'FEMALE' | 'OTHER' | null; // 0: male | 1: female | 2: other
        avatar?: string | null;
        addresses?: Request.Address[];
        job: string | null;
        salary: number | null;
        dayWorks: number | null;
      };
    }

    //Response
    namespace Response {
      //address type
      type Address = {
        id: number;
        address1: string | null;
        address2: string | null;
        isDefault: boolean | null;
        lat: number | null;
        lng: number | null;
        zipCode: string | null;
        areaCode: string | null;
        fullName: string | null;
        phoneNumber: string | null;
        apartmentNumber: string | null;
        type: Basic.MasterDataType & {
          type: 'ADDRESS';
        };
        country: Basic.MasterDataType;
        province: Basic.MasterDataType;
        district: Basic.MasterDataType;
        wards: Basic.MasterDataType;
      };

      // get api : /profiles/main-profile
      type Profile = {
        id?: number | null;
        code: string | null;
        name: string | null;
        shortName: string | null;
        birthday: string | null;
        phone: string;
        job: string | null;
        salary: number | null;
        dayWorks: number | null;
        email: string | null;
        gender: Basic.GenderType;
        avatar: string | null;
        logo: string | null;
        website: string | null;
        description: string | null;
        profession: Basic.MasterDataType;
        literacy: Basic.MasterDataType;
        addresses: Response.Address[];
        fullName: string | null;
        certifications: [];
        sysAccountId: number | null;
        createdById: number | null;
        familyRegisters: // {
        //     "id": 42801,
        //     "name": "Mai Tam",
        //     "birthday": "1975-05-23T15:34:31.254Z",
        //     "identityType": null,
        //     "identityNumber": "12345",
        //     "issuedDate": "2023-05-01T15:34:46.706Z",
        //     "relation": {
        //         "id": 700,
        //         "name": "Cha"
        //     },
        //     "type": {
        //         "id": 400,
        //         "name": "Chứng minh nhân dân",
        //         "type": "IDENTITY"
        //     },
        //     "issuedPlace": {
        //         "id": 37,
        //         "name": "Bến Tre"
        //     }
        // }
        [];
        identityPapers: // {
        //   id: 42901;
        //   number: '123456789';
        //   issuedDate: '2016-05-11T15:32:52.721Z';
        //   kyc: false;
        //   images: '2023-05-23/9a6286da-440d-4b39-8adf-a9027b4ec818.png';
        //   type: {
        //     id: 400;
        //     name: 'Chứng minh nhân dân';
        //     type: 'IDENTITY';
        //   };
        //   issuedPlace: {
        //     id: 25;
        //     name: 'Bình Định';
        //   };
        // },
        [];
        degrees: // {
        //   id: 42751;
        //   issuedPlace: 'TDT';
        //   startDate: '2020-05-23T15:34:00.095Z';
        //   endDate: '2023-05-23T15:34:03.179Z';
        //   specialized: null;
        //   type: {
        //     id: 301;
        //     name: 'Thạc sĩ';
        //   };
        //   ranking: {
        //     id: 600;
        //     name: 'Giỏi';
        //   };
        //   specialize: {
        //     id: 800;
        //     name: 'Công nghệ thông tin';
        //   };
        // },
        [];
        farmingExperiences: // {
        //   id: 42851;
        //   startDate: '2023-04-30T17:00:00Z';
        //   endDate: '2023-05-16T16:59:59.999Z';
        //   quantity: 123.0;
        //   description: 'oke';
        //   unit: {
        //     id: 1;
        //     name: 'Kilogram';
        //     shortName: 'Kg';
        //     type: 'MASS';
        //   };
        //   cultivationType: {
        //     id: 1400;
        //     name: 'Canh tác';
        //     type: 'CULTIVATION';
        //   };
        //   productType: {
        //     id: 1002;
        //     name: 'Dưa lưới';
        //     type: 'PRODUCT';
        //   };
        //   qualityType: {
        //     id: 1301;
        //     name: 'Tốt';
        //     type: 'QUALITY';
        //   };
        // },
        [];
        incomes: // {
        //   id: 42951;
        //   description: '123';
        //   incomeValue: 10000000000.0;
        //   type: {
        //     id: 500;
        //     name: 'Thu nhập năm';
        //   };
        // },
        [];
        bankAccounts: // {
        //   id: 42701;
        //   name: null;
        //   accountName: 'thang';
        //   accountNumber: '132131243432';
        //   status: 'ACTIVATED';
        //   bank: {
        //     id: 1;
        //     name: 'NH Chinh sach xa hoi (VBSP)';
        //     shortName: 'VBSP';
        //     type: 'Ngan hang thuong mai nha nuoc';
        //     note: '';
        //   };
        //   branch: {
        //     id: 5;
        //     name: 'NH CSXH Tinh Bac Ninh';
        //     shortName: 'NH CSXH Tinh Bac Ninh';
        //     province: 'Bac Ninh';
        //     note: '';
        //   };
        // },
        [];
      };
    }
  }
  // -------- PROFILE -------- //

  // -------- REGISTER -------- //
  namespace REGISTER {
    //Basic type
    namespace Basic {
      type expirationTime = number;
      type resetKey = string;
    }

    //Request
    namespace Request {
      type Register = AUTH.REGISTER.Request.UserInit &
        AUTH.PROFILE.Request.Profile;

      type UserInit = {
        login: string;
        password: string;
        lastName: string | null;
        firstName: string | null;
        activationKey: string;
      };
    }

    //Response
    namespace Response {
      type Otp = {
        id: number;
        login: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        activated: boolean;
        langKey: 'en' | 'vi';
        imageUrl?: string;
        activationKey?: string;
        resetKey: string;
        resetDate: Date;
        otp: string;
        numberSendOtp: number;
        lastResendOtp: Date;
        fullName?: string;
      };
    }
  }
  // -------- REGISTER -------- //

  // -------- PASSWORD -------- //
  namespace PASSWORD {
    //Basic type
    namespace Basic {}

    //Request
    namespace Request {
      type ValidateOtpResetPassword = {
        otp: string;
        resetKey?: string;
        phone?: string;
      };

      type ResetPassword = {
        resetKey: string;
        newPassword: string;
      };
    }

    //Response
    namespace Response {
      type ResetPassword = {
        id: number;
        login: string;
        firstName: string;
        lastName: string;
        email: string;
        activated: boolean;
        langKey: string;
        imageUrl: string;
        activationKey: string;
        resetKey: string;
        resetDate: string;
        otp: string;
        numberSendOtp: number;
        lastResendOtp: string;
        fullName: string;
      };
    }
  }
  // -------- PASSWORD -------- //
}
