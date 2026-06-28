import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const getSecretKey = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("FATAL: JWT_SECRET ortam değişkeni eksik!");
  }
  return new TextEncoder().encode(process.env.JWT_SECRET);
};

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: Request) {
  try {
    // 1. Verify Authentication
    if (!process.env.JWT_SECRET) {
      throw new Error("FATAL: JWT_SECRET ortam değişkeni eksik!");
    }
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      await jwtVerify(token, getSecretKey());
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // 2. Parse request as FormData
    const formData = await request.formData();
    const image = formData.get('image') as File | null;
    const folder = (formData.get('folder') as string) || 'uploads';

    if (!image) {
      return NextResponse.json({ error: 'Geçersiz veya eksik resim' }, { status: 400 });
    }

    const mimeType = image.type || 'image/webp';
    const extension = mimeType.split('/')[1] || 'webp';
    
    // Create unique filename
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${extension}`;
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('lale-perde-images')
      .upload(fileName, buffer, {
        contentType: mimeType,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      return NextResponse.json({ error: 'Resim yüklenemedi. Lütfen tekrar deneyin.' }, { status: 500 });
    }

    // 5. Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('lale-perde-images')
      .getPublicUrl(fileName);

    return NextResponse.json({ success: true, url: publicUrlData.publicUrl });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'İşlem sırasında bir hata oluştu. Lütfen tekrar deneyin.' }, { status: 500 });
  }
}
