import foodGroups from '../../../data/food-groups.json';
import foods from '../../../data/foods.json';
import nutrientCategories from '../../../data/nutrient-categories.json';
import nutrients from '../../../data/nutrients.json';
import { NutritionCatalog } from './catalog';
import type { Food, NutritionDataset } from './types';

export const DATA_SOURCE = {
  name: 'Bảng thành phần thực phẩm Việt Nam (VTN_FCT_2007)',
  publisher: 'Viện Dinh dưỡng Quốc gia',
  basis: 'Giá trị trên 100 g phần ăn được',
} as const;

export const nutritionDataset: NutritionDataset = {
  groups: foodGroups,
  categories: nutrientCategories,
  nutrients,
  foods: foods as Food[],
};

/** Catalog over the bundled master data in `/data`. */
export const nutritionCatalog = new NutritionCatalog(nutritionDataset);
