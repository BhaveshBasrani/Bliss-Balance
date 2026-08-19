import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const tag = body.tag || 'catalog';

    if (tag === 'catalog' || tag === 'skus') {
      revalidateTag('catalog');
      revalidateTag('skus');
      revalidatePath('/');
      revalidatePath('/men');
      revalidatePath('/women');
      revalidatePath('/collections');
      revalidatePath('/api/catalog');
    } else if (tag === 'settings') {
      revalidateTag('settings');
      revalidatePath('/');
      revalidatePath('/api/settings');
    } else {
      revalidateTag(tag);
      revalidatePath('/');
    }

    return NextResponse.json({ revalidated: true, tag, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ revalidated: false, error: 'Revalidation failed' }, { status: 500 });
  }
}
