import { NextResponse } from 'next/server';
import { fetchSupabaseSettings } from '@/lib/supabaseClient';

export const dynamic = 'force-static';
export const revalidate = false;

export async function GET() {
  try {
    const settings = await fetchSupabaseSettings();
    return NextResponse.json(settings || {}, {
      headers: {
        'Cache-Control': 'public, s-maxage=7200, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    return NextResponse.json({}, { status: 500 });
  }
}
