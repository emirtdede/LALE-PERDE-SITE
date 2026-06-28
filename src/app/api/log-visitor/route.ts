import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request: Request) {
  // Get IP
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
  const rawIp = ip.split(',')[0].trim();

  const salt = process.env.IP_HASH_SALT || 'lale-perde-default-static-salt-2024';
  const ipHash = crypto.createHash('sha256').update(rawIp + salt).digest('hex');

  // Geolocation
  let city = 'TR / Unknown';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const ipRes = await fetch(`https://ipapi.co/${rawIp}/json/`, {
      headers: { 'User-Agent': 'nodejs-ipapi' },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (ipRes.ok) {
      const ipData = await ipRes.json();
      if (ipData.city && ipData.country_code) {
        city = `${ipData.country_code} / ${ipData.city}`;
      }
    }
  } catch (e) {
    // fallback silently if fetch fails or times out
  }

  return NextResponse.json({ ipHash, city });
}
