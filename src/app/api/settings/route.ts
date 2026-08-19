import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { fetchSupabaseSettings } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

const getCachedSettings = unstable_cache(
  async () => {
    return await fetchSupabaseSettings();
  },
  ['site-settings-cache'],
  {
    revalidate: 7200, // 2 hours shared cache across all users
    tags: ['settings'],
  }
);

export async function GET() {
  try {
    const settings = await getCachedSettings();
    return NextResponse.json(settings || {}, {
      headers: {
        'Cache-Control': 'public, s-maxage=7200, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    return NextResponse.json({}, { status: 500 });
  }
}
