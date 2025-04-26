import { ReactNode } from 'react';

export type Size = 'small' | 'medium' | 'large';

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Ingredient {
  id: string;
  name: string;
  category: 'rice' | 'beans' | 'meat' | 'sides' | 'salads';
  active: boolean;
}

export interface ExtraItem {
  id: string;
  name: string;
  price: number;
  active: boolean;
}

export interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
  neighborhoods: string[];
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
}

export type PaymentMethod = 'pix' | 'credit' | 'debit' | 'cash';
export type DeliveryMethod = 'delivery' | 'pickup';

export interface MarmitaItem {
  id: string;
  size: Size;
  ingredients: string[];
  extras?: string[];
}

export interface OrderDetails {
  marmitas: MarmitaItem[];
  extras?: ExtraItem[];
  deliveryMethod: DeliveryMethod;
  address?: Address;
  paymentMethod: PaymentMethod;
  customerName: string;
  phone: string;
  observation?: string;
  totalPrice: number;
  deliveryFee?: number;
  changeFor?: number;
  estimatedTime?: {
    min: number;
    max: number;
  };
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}