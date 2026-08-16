import React from 'react';
import ProductDetailClient from './ProductDetailClient';
import { INITIAL_SKUS } from '@/lib/dataStore';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const initialIds = INITIAL_SKUS.map(sku => ({ id: sku.id }));
  
  // Include common SKU ID placeholders for static export compatibility
  const fallbackIds = [
    { id: 'sku-1' },
    { id: 'sku-2' },
    { id: 'sku-3' },
    { id: 'sku-bb-46176' },
    { id: 'default' },
  ];

  return [...initialIds, ...fallbackIds];
}

export default function ProductPage({ params }: ProductPageProps) {
  return <ProductDetailClient productId={params.id} />;
}
