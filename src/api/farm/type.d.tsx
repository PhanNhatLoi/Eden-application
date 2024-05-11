// @ts-ignore

export declare namespace FARM {
  ///Nhatloi_dev

  // -------- Basic -------- //
  namespace Basic {
    type ProfileType =
      | 'PERSONAL_PROFILE'
      | 'FARM_PROFILE'
      | 'ENTERPRISE'
      | 'COOPERATIVE'
      | 'COOPERATIVE_VENTURE'
      | 'ORGANIZATION';

    //status farm type
    type StatusType = 'ACTIVATED';

    type UnitPriceType = 'VND';

    // interval type
    type IntervalType = 'YEAR';

    type UnitBaseType = {
      id: number | null;
      name: string | null;
    };

    type MasterDataTypes = UnitBaseType & {
      type: 'PRODUCT' | 'MARKET' | 'CULTIVATION' | 'FORM_OF_USES';
    };

    type GrossType = {
      id: number | null;
      masterDataTypeId: number | null;
      value: number;
      interval?: string;
      unitId: number | null;
      unitName: string;
    };

    type FarmProductType = {
      // new api
      id?: number | null;
      productType: {
        id: number | null;
        name: string;
      };
      grossProductivities: {
        value: number | null | undefined;
        interval: IntervalType;
        unitId: number | null;
      };
      grossYields: {
        value: number | null;
        interval?: IntervalType;
        unitId?: number | null;
      };
      grossAreas: {
        value: number | null | undefined;
        unitId: number | null;
      };
      farmingSeasonNumber: number | null;
    };

    //market type
    type ConsumptionMarketType = {
      id: number | null;
      name: string | null;
    };

    type MoneyObj = {
      id: number;
      value: number;
      unit: string;
      textValue: string;
    };

    type BankAccountsType = {
      id: number;
      name: string | null;
      accountName: number;
      accountNumber: number;
      status: null;
      bank: {
        id: number;
        name: string;
        shortName: string;
        type: string;
        note: string;
      };
      branch: {
        id: number;
        name: string;
        shortName: string;
        province: string;
        note: string;
      };
    };
  }
  // -------- Basic -------- //

  // -------- Request -------- //
  namespace Request {
    type Address = {
      fullName?: string | null;
      phoneNumber?: string | null;
      address1: string | null;
      apartmentNumber?: string | null;
      countryId: number | null;
      provinceId: number | null;
      districtId: number | null;
      wardsId: number | null;
      areaCode?: string | null;
      zipCode?: string | null;
      isDefault?: boolean;
      lat?: number | null;
      lng?: number | null;
      fullAddress?: string | null;
    };
    type Cetification = {
      id?: number | null;
      issuedDate: string | null;
      expirationDate: string | null;
      images: string | null;
      reassessmentDate: string | null;
      issuedBy: string | null;
      typeId: number | null | undefined;
      evaluationDate: string | null;
    };
    type LandCetification = {
      id: number | null;
      typeId: number | null;
      landLotNo: string | null;
      status: FARM.Basic.StatusType;
      areage: {
        id: number | null;
        unitId: number | null;
        value: number | null;
      };
      formOfUsesIds: number[];
      images: string | null;
      ownerId: number | null;
      ownerNameOther: string | null;
    };
    type Farm = {
      id?: number | null;
      address: FARM.Request.Address;
      avatar: string | null;
      businessTypesIds: number[];
      farmingSeasonNumber: number;
      grossArea: {
        unitId: number | null;
        value: number;
      };
      grossProductivity?: {
        interval: FARM.Basic.IntervalType;
        unitId: number | null;
        value: number;
      };
      grossYield: {
        interval: FARM.Basic.IntervalType;
        unitId: number | null;
        value: number;
      };
      marketsIds: number[];
      consumptionMarket: FARM.Basic.ConsumptionMarketType[];
      name: string;
      phone: string | null;
      productionTypesIds: number[];
      products: FARM.Basic.FarmProductType[];
      status: FARM.Basic.StatusType;
      certifications: FARM.Request.Cetification[];
      certifycateOfLands: FARM.Request.LandCetification[];
    };
  }
  // -------- Request -------- //

  // -------- Response -------- //
  namespace Response {
    type ParamsFilterList = {
      sysAccountId?: number | null;
      type?: FARM.Basic.ProfileType;
      sort?: string;
    };

    type FarmGetList = {
      phone: string;
      lat: string;
      lng: string;
      avatar: string | null;
      sysid: number;
      grossAreaValue: number;
      fullAddress: string;
      name: string;
      id: number;
      type: string;
      grossAreaUnit: string;
    };
    type FarmDetails = {
      id: number;
      name: string;
      avatar: string;
      images: string | null;
      surrogate: string;
      phone: string;
      email: string;
      code: number;
      status: FARM.Basic.StatusType;
      employee: number;
      address: FARM.Response.Address;
      grossArea: Basic.GrossType;
      grossProductivity: Basic.GrossType;
      grossYield: Basic.GrossType;
      revenueYear: Basic.MoneyObj;
      costYear: Basic.MoneyObj;
      vat: Basic.MoneyObj;
      profitYear: Basic.MoneyObj;
      personalIncomeTax: Basic.MoneyObj;
      farmingSeasonNumber: number;
      businessTypes: Basic.MasterDataTypes[];
      productionTypes: Basic.MasterDataTypes[];
      products: FARM.Basic.FarmProductType[]; // new API
      markets: Basic.MasterDataTypes[];
      consumptionMarket: FARM.Basic.ConsumptionMarketType[];
      bankAccounts: Basic.BankAccountsType[];
      certifications: FARM.Response.Certifications[];
      certifycateOfLands: FARM.Response.CertifycateOfLands[];
    };

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
      type: Basic.UnitBaseType & {
        type: 'ADDRESS';
      };
      country: Basic.UnitBaseType;
      province: Basic.UnitBaseType;
      district: Basic.UnitBaseType;
      wards: Basic.UnitBaseType;
    };
    type Certifications = {
      id: number | null;
      issuedPlace: string | null;
      issuedBy: string | null;
      issuedDate: string;
      expirationDate: string;
      images: string;
      kyc: string | null;
      status: string | null;
      note: string | null;
      reassessmentDate: string;
      evaluationDate: string;
      type: {
        id: number;
        name: string;
      };
    };
    type CertifycateOfLands = {
      id: number;
      landLotNo: string;
      address: Response.Address;
      images: string;
      kyc: string | null;
      status: string | null;
      ownerId: number;
      ownerName: string;
      ownerNameOther: string;
      areage: Basic.GrossType;
      formOfUses: Basic.MasterDataTypes[];
      type: {
        id: number;
        name: string;
        type: 'CERTIFICATION_LAND';
      };
    };
  }

  // -------- Response -------- //
}
