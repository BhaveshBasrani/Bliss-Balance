import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json({ revalidated: true, now: Date.now() });
}

export async function POST() {
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
