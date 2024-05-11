import {FARM} from './type.d';

export const convertFarmRequest = (
  farmDetails: FARM.Response.FarmDetails,
): FARM.Request.Farm => {
  const businessTypesIds = farmDetails.businessTypes
    .filter(f => f.id)
    .map(m => m.id) as number[];
  const marketsIds = farmDetails.markets
    .filter(f => f.id)
    .map(m => m.id) as number[];
  const productionTypesIds = farmDetails.productionTypes
    .filter(f => f.id)
    .map(m => m.id) as number[];
  const farmReturn: FARM.Request.Farm = {
    id: farmDetails.id || null,
    avatar: farmDetails.avatar || null,
    businessTypesIds: businessTypesIds,
    farmingSeasonNumber: farmDetails.farmingSeasonNumber || 0,
    grossArea: farmDetails.grossArea,
    grossProductivity: farmDetails.grossProductivity
      ? {
          interval: 'YEAR',
          unitId: farmDetails.grossProductivity.unitId,
          value: farmDetails.grossProductivity.value,
        }
      : undefined,
    grossYield: {
      interval: 'YEAR',
      unitId: farmDetails.grossArea.unitId,
      value: farmDetails.grossYield.value,
    },
    marketsIds: marketsIds,
    consumptionMarket: farmDetails.consumptionMarket,
    name: farmDetails.name,
    phone: farmDetails.phone,
    productionTypesIds: productionTypesIds,
    products: farmDetails.products,
    status: farmDetails.status,
    certifications: farmDetails.certifications.map(m => {
      return {
        issuedDate: m.issuedDate,
        expirationDate: m.expirationDate,
        images: m.images,
        reassessmentDate: m.reassessmentDate,
        issuedBy: m.issuedBy,
        typeId: m.type?.id || null,
        evaluationDate: m.evaluationDate,
      };
    }),
    certifycateOfLands:
      farmDetails.certifycateOfLands?.length >= 0
        ? farmDetails.certifycateOfLands.map(m => {
            const formOfUsesIds = m.formOfUses
              .filter(f => f.id)
              .map(m => m.id) as number[];
            return {
              id: m.id,
              landLotNo: m.landLotNo,
              typeId: m.type.id || null,
              areage: {
                id: m.areage.id || null,
                unitId: m.areage.unitId,
                value: m.areage.value,
              },
              status: 'ACTIVATED',
              formOfUsesIds: formOfUsesIds,
              images: m.images,
              ownerId: m.ownerId,
              ownerNameOther: m.ownerNameOther,
            };
          })
        : [],
    address: {
      address1: farmDetails.address.address1,
      countryId: farmDetails.address.country.id,
      provinceId: farmDetails.address.province.id,
      districtId: farmDetails.address.district.id,
      wardsId: farmDetails.address.wards.id,
      lat:
        (farmDetails.address?.lat && Number(farmDetails.address.lat)) ||
        undefined,
      lng:
        (farmDetails.address?.lng && Number(farmDetails.address.lng)) ||
        undefined,
      fullAddress: [
        farmDetails.address.address1,
        farmDetails.address.wards.name,
        farmDetails.address.district.name,
        farmDetails.address.province.name,
        farmDetails.address.country.name,
      ]
        .filter(f => f)
        .join(', '),
    },
  };

  return farmReturn;
};
