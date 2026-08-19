import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { CollectionsClient } from './CollectionsClient';

export const metadata: Metadata = {
  title: 'All Footwear Collection | Bliss Balance®',
  description: 'Explore the complete catalog of Bliss Balance orthopedic slippers, slides, comfort doctor sandals, waterproof clogs, and sneakers built for everyday balance in India.',
};

export default function CollectionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <CollectionsClient />
    </Suspense>
  );
}
