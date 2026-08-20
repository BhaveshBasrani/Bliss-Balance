import { NextResponse } from 'next/server';
import { fetchSupabaseSettings } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const settings = await fetchSupabaseSettings();
    return NextResponse.json(settings || {}, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      },
    });
  } catch (error) {
    return NextResponse.json({}, { status: 500 });
  }
}
