import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { fetchSupabaseSKUs } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

const getCachedCatalog = unstable_cache(
  async () => {
    return await fetchSupabaseSKUs();
  },
  ['catalog-skus-cache'],
  {
    revalidate: 3600, // 1 hour shared cache across all users
    tags: ['catalog', 'skus'],
  }
);

export async function GET() {
  try {
    const skus = await getCachedCatalog();
    return NextResponse.json(skus, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}
