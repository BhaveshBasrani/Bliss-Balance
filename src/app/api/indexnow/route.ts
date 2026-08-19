import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request) {
  try {
    const { urls } = await req.json();

    const host = 'blissbalance.co';
    const key = 'c89a01f782e541b0b2e8d91c2b5d4e10';
    const keyLocation = `https://${host}/indexnow_key.txt`;

    const urlList = Array.isArray(urls) && urls.length > 0
      ? urls
      : [
          `https://${host}/`,
          `https://${host}/men`,
          `https://${host}/women`,
          `https://${host}/collections`,
          `https://${host}/about`,
          `https://${host}/faq`,
        ];

    const payload = {
      host,
      key,
      keyLocation,
      urlList,
    };

    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });

    return NextResponse.json({ success: res.ok, status: res.status });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'IndexNow submission failed' }, { status: 500 });
  }
}
