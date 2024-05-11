import {SEASON} from './type.d';

export const convertSeason = (
  seasonDetails: SEASON.Response.SeasonDetails,
): SEASON.Request.Season => {
  const seasonReturn: SEASON.Request.Season = {
    id: seasonDetails.id || undefined,
    farmId: seasonDetails.farmId || null,
    name: seasonDetails.name || null,
    sowingDate: seasonDetails.sowingDate || null,
    harvestDate: seasonDetails.harvestDate || null,
    seasonStatus: seasonDetails.seasonStatus || 'UNCULTIVATED',
    productsOfFarm: seasonDetails.productsOfFarm,
    grossArea: {
      value: seasonDetails.grossArea?.value || null,
      unitId: seasonDetails.grossArea?.unitId || null,
    },
    grossYield: {
      value: seasonDetails.grossYield?.value || null,
      unitId: seasonDetails.grossYield?.unitId || null,
    },
    businessType: seasonDetails.businessType || null,
    certifycateOfLandIds: seasonDetails.certifycateOfLandIds || [],
    materials: seasonDetails.materials?.map(m => {
      return {
        supplierId: m.supplierId,
        quantity: m.quantity || 0,
        unitId: m.unitId,
        unitName: m.unitName,
        categoryId: m.categoryId,
        materialText: m.materialText,
        unitNameOther: m.unitNameOther,
      };
    }),
  };
  return seasonReturn;
};
