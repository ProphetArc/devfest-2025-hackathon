import pavlodarDataJson from './pavlodar-data.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export type LocalizedContent = {
  name: string;
  tags: string[];
  description: string;
  knowledge: string;
};

export type DataItem = {
  id: string;
  type: 'street' | 'figure' | 'phenomenon';
  ru: LocalizedContent;
  en: LocalizedContent;
  images: ImagePlaceholder[];
};

export const pavlodarData: DataItem[] = pavlodarDataJson as DataItem[];
