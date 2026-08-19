import React from 'react';
import ProductDetailClient from './ProductDetailClient';
import { getStoredSKUs } from '@/lib/dataStore';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const activeSkus = getStoredSKUs();
  const initialIds = activeSkus.map(sku => ({ id: sku.id }));
  
  const fallbackIds = [
    { id: 'BB924' },
    { id: 'BB1106' },
    { id: 'BB12' },
    { id: 'BB155' },
    { id: 'default' },
  ];

  return [...initialIds, ...fallbackIds];
}

export default function ProductPage({ params }: ProductPageProps) {
  return <ProductDetailClient productId={params.id} />;
}
