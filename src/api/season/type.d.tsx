/* eslint-disable eslint-comments/no-unlimited-disable */
// @ts-ignore
/* eslint-disable */

export declare namespace SEASON {
  //unit basic
  namespace Basic {
    type SeasonStatus = 'UNCULTIVATED' | 'CULTIVATED' | 'HARVESTED';
    type Object = {
      id: number;
      name: string;
      type?: string;
    };

    type Gross = {
      id?: number;
      value: number | null;
      unitName?: string | null;
      unitId: number | null;
    };
    type UnitResponse = {
      unit: {
        id: number | null;
        name: string | null;
        shortName: string | null;
        type: string | null;
      };
    };

    type Crops = {
      grossArea: {
        value: number | null;
        unitId: number | null;
      };
      grossYield: {
        value: number | null;
        unitId: number | null;
      };
      productsOfFarm: ProductOfFarm;
      certifycateOfLandIds: number[];
      businessType: {
        id: number | null;
        masterDataTypeId: number | null;
        name: string | null;
      };
    };

    type ProductOfFarm = {
      id?: number | null;
      farmProductId: number | null;
      name: string | null;
      masterDataTypeId: number | null;
    };

    type Product = {
      id?: number;
      code: string | null;
      name: string | null;
      shortName: string | null;
      tags: string | null;
      avatar: string | null;
      status: string | null;
      shortDescription: string | null;
      description: string | null;
      images: string | null;
      categoryId: number | null;
      categoryName: string | null;
    };
  }

  // response type
  namespace Response {
    type Classifications = {
      id: number;
      value: number;
      typeId: number;
      typeName: string;
      farmingSeasonId: number;
    };

    type ShareAppLink = {
      linkApp: string;
      message: string;
    };

    type StepSeasonProcesses = {
      id: number;
      name: string;
      startDate: string;
      interval: null;
      afterDays: null;
      startHour: number;
      endDate: string;
      description: string;
      status: string;
      note: null;
      type: null;
      nextStepId: number | null;
      cultivationProcessId: number;
      seasonProcessId: number;
      seasonProcessName: string | null;
      farmingSeasonName: string | null;
      farmingSeasonId: number | null;
    };

    type SeasonProcesses = {
      id: number;
      name: string;
      description: string;
      note: string | null;
      stepsNumber: number;
      interval: number;
      status: string;
      startDate: string;
      endDate: string;
      ratings: null;
      processId: number;
      processName: string;
      currentStep: null;
      steps: SEASON.Response.StepSeasonProcesses[];
    };

    type Materials = {
      id: number;
      quantity: number;
      orderDate: string;
      receiveDate: string;
      status: string;
      materialText: string | null;
      productId: number;
      productName?: string;
      price: {
        value: number;
        unit: string;
      };
      amount: {
        value: number;
        unit: string;
      };
      categoryId: number;
      categoryName?: string;
      unitId: number;
      unitName?: string;
      unitNameOther: string | null;
      typeId: number;
      typeName: string;
      supplierId: number;
      supplierName?: string;
      farmingSeasonId: number;
      materialId: number;
      materialName?: string;
      inventoryId: number;
      inventoryName: string;
      quantityPlan: number;
    };

    type SeasonDetails = {
      id: number;
      name: string;
      code: string;
      sowingDate: string;
      harvestDate: string;
      actualHarvestDate: string | null;
      note: string;
      solutions: string;
      status: string;
      seasonStatus: SEASON.Basic.SeasonStatus;
      grossArea: SEASON.Basic.Gross & SEASON.Basic.UnitResponse;
      grossYield: SEASON.Basic.Gross & SEASON.Basic.UnitResponse;
      grossYieldToday: SEASON.Basic.Gross & SEASON.Basic.UnitResponse;
      seedDensity: SEASON.Basic.Gross & SEASON.Basic.UnitResponse;
      seedDensityDetail: SEASON.Basic.Gross & SEASON.Basic.UnitResponse;
      farmId: number;
      farmCode: string;
      productId: number;
      product: SEASON.Basic.Product;
      certifycateOfLandIds: number[];
      seasonProcessIds: [];
      materials: SEASON.Response.Materials[];
      seasonProcesses: SEASON.Response.StepSeasonProcesses[];
      classifications: SEASON.Response.Classifications[];
      laborCosts: [];
      otherCosts: [];
      productsOfFarm: SEASON.Basic.ProductOfFarm;
      businessType: {
        id: number | null;
        name: string | null;
        masterDataTypeId: number | null;
      };
    };
    type CertificateOfLands = {
      id: number;
      landLotNo: string;
      address: {
        id: number;
        address1: string;
        address2: string | null;
        isDefault: string | null;
        lat: string;
        lng: string;
        zipCode: string | null;
        areaCode: string | null;
        type: string | null;
        country: SEASON.Basic.Object;
        province: SEASON.Basic.Object;
        district: SEASON.Basic.Object;
        wards: SEASON.Basic.Object;
      };
      images: string;
      kyc: string | null;
      status: string | null;
      ownerId: number;
      ownerName: string;
      areage: SEASON.Basic.Gross;
      formOfUses: SEASON.Basic.Object[];
    };

    type LaborCost = {
      id: number;
      code: string | null;
      name: string | null;
      job: string | null;
      workingPerMonth: number | null;
      workingPerSeason: number | null;
      salaryPerMonth: number | null;
      salaryPerSeason: number | null;
      note: string | null;
      farmingSeasonId: number | null;
    };

    type SeasonList = {
      id: number;
      name: string | null;
      sowingDate: string | null;
      startDate: string | null;
      harvestDate: string | null;
      note: string | null;
      grossArea: {
        id: number;
        value: number | null;
        unitName: string | null;
        unit: {
          id: number;
          name: string | null;
          shortName: string | null;
          type: 'ACREAGE';
        };
      };
      grossYield: {
        id: number;
        value: number | null;
        unitName: string | null;
        unit: {
          id: number;
          name: string | null;
          shortName: string | null;
          type: 'MASS';
        };
      };
      productId: number | null;
      farmId: number | null;
      productName: string | null;
      actualHarvestDate: string | null;
      expectedHarvest: [];
      actualHarvest: [];
      seasonStatus: SEASON.Basic.SeasonStatus;
    };
  }

  // request type
  namespace Request {
    type Material = {
      supplierId: number | null;
      supplierName?: string;
      quantity: number;
      unitId: number | null;
      unitName?: string;
      unitNameOther?: string | null;
      categoryId: number | null;
      categoryName?: string;
      materialText: string | null;
    };

    type Classifications = {
      typeId: number | null;
      value: number | null;
    };

    type Season = {
      id?: number | null;
      farmId: number | null;
      name: string | null;
      sowingDate: string | null;
      harvestDate: string | null;
      businessType: {
        id: number | null;
        name: string | null;
        masterDataTypeId: number | null;
      };
      // seedDensity: SEASON.Basic.Gross;
      // classifications: SEASON.Request.Classifications[];
      productsOfFarm: SEASON.Basic.ProductOfFarm;
      grossArea: {
        value: number | null;
        unitId: number | null;
      };
      certifycateOfLandIds: number[];
      grossYield: {
        value: number | null;
        unitId: number | null;
      };
      materials: SEASON.Request.Material[];
      seasonStatus?: SEASON.Basic.SeasonStatus;
    };
  }
}
