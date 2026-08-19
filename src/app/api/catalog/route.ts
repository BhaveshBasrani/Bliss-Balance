import { NextResponse } from 'next/server';
import { fetchSupabaseSKUs } from '@/lib/supabaseClient';

export const dynamic = 'force-static';
export const revalidate = false;

export async function GET() {
  try {
    const skus = await fetchSupabaseSKUs();
    return NextResponse.json(skus, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}
