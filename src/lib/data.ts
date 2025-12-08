import pavlodarDataJson from './pavlodar-data.json';
import { PlaceHolderImages, type ImagePlaceholder } from './placeholder-images';

export type LocalizedContent = {
  name: string;
  tags: string[];
  description: string;
};

export type DataItem = {
  id: string;
  type: 'street' | 'figure' | 'phenomenon';
  ru: LocalizedContent;
  en: LocalizedContent;
  images: ImagePlaceholder[];
};

// The data is now a combination of the JSON data and the images,
// which are still managed separately for now.
export const pavlodarData: DataItem[] = pavlodarDataJson.map(item => ({
  ...item,
  images: PlaceHolderImages.filter(img => img.id.startsWith(item.id))
})) as DataItem[];
