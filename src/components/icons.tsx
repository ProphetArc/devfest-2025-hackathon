import { Landmark, MapPin, User, Factory } from 'lucide-react';
import type { DataItem } from '@/lib/data';
import { type Language } from '@/lib/i18n';

export const IconForItemType = ({ type, ...props }: { type: DataItem['type']; className?: string }) => {
  switch (type) {
    case 'street': return <MapPin {...props} />;
    case 'figure': return <User {...props} />;
    case 'phenomenon': return <Landmark {...props} />;
    case 'industrial': return <Factory {...props} />;
    default: return null;
  }
};

const translations = {
    ru: {
        'street': 'Улица',
        'figure': 'Личность',
        'phenomenon': 'Культурный феномен',
        'industrial': 'Промышленный объект'
    },
    en: {
        'street': 'Street',
        'figure': 'Figure',
        'phenomenon': 'Cultural Phenomenon',
        'industrial': 'Industrial Site'
    }
}

export const translateType = (type: DataItem['type'], lang: Language) => {
    return translations[lang][type] || '';
}
