import { Landmark, MapPin, User } from 'lucide-react';
import type { DataItem } from '@/lib/data';

export const IconForItemType = ({ type, ...props }: { type: DataItem['type']; className?: string }) => {
  switch (type) {
    case 'street': return <MapPin {...props} />;
    case 'figure': return <User {...props} />;
    case 'phenomenon': return <Landmark {...props} />;
    default: return null;
  }
};

export const translateType = (type: DataItem['type']) => {
    switch (type) {
        case 'street': return 'Улица';
        case 'figure': return 'Личность';
        case 'phenomenon': return 'Культурный феномен';
        default: return '';
    }
}
