'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductDetailClient from './[id]/ProductDetailClient';

function ProductPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || 'sku-1';

  return <ProductDetailClient productId={id} />;
}

export default function ProductPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center font-mono text-xs text-neutral-500">
        LOADING PRODUCT DETAILS...
      </div>
    }>
      <ProductPageContent />
    </Suspense>
  );
}
