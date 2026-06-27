
// We implement an in-memory rate limiter per email to prevent global DoS
const emailRateLimitMap = new Map<string, number[]>();
const MAX_EMAILS_PER_HOUR = 5;
const HOUR_MS = 60 * 60 * 1000;

function isEmailRateLimited(email: string): boolean {
  const now = Date.now();
  const timestamps = emailRateLimitMap.get(email) || [];
  const recentTimestamps = timestamps.filter(ts => now - ts < HOUR_MS);
  
  if (recentTimestamps.length >= MAX_EMAILS_PER_HOUR) {
    emailRateLimitMap.set(email, recentTimestamps);
    return true;
  }
  
  recentTimestamps.push(now);
  emailRateLimitMap.set(email, recentTimestamps);
  
  // Basic cleanup
  if (emailRateLimitMap.size > 100) {
    const cutoff = now - HOUR_MS;
    for (const [key, times] of emailRateLimitMap.entries()) {
      const validTimes = times.filter(t => t > cutoff);
      if (validTimes.length === 0) {
        emailRateLimitMap.delete(key);
      } else {
        emailRateLimitMap.set(key, validTimes);
      }
    }
  }
  return false;
}

export async function sendOTPEmail(email: string, code: string, type: '2fa' | 'change' | 'reset') {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return;
  }

  // Use localized in-memory rate limiting per email instead of a global limit
  if (isEmailRateLimited(email)) {
    throw new Error('Çok fazla kod talep ettiniz. Lütfen bir süre bekleyin.');
  }

  const emailSubject = type === 'change' 
    ? 'Lale Perde Yönetim Paneli - Güvenlik Bilgisi Değişikliği' 
    : type === 'reset' 
    ? 'Lale Perde Yönetim Paneli - Şifre Sıfırlama Kodu' 
    : 'Lale Perde Yönetim Paneli - 2FA Giriş Kodu';
    
  const emailIntro = type === 'change' 
    ? 'Yönetici güvenlik bilgilerinizi (2FA E-Posta / Telefon) güncellemek veya silmek için talep ettiğiniz tek seferlik güvenlik doğrulama kodu aşağıdadır:' 
    : type === 'reset'
    ? 'Şifrenizi sıfırlamak için talep ettiğiniz tek seferlik doğrulama kodu aşağıdadır:'
    : 'Giriş yapmak için talep ettiğiniz tek seferlik iki adımlı doğrulama (2FA) kodunuz aşağıdadır:';

  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${resendApiKey}` },
    body: JSON.stringify({
      from: 'Lale Perde Güvenlik <onboarding@resend.dev>',
      to: email,
      subject: emailSubject,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 25px; border: 1px solid #1a2e40; border-radius: 12px; background-color: #0a1118; color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px; border-bottom: 1px solid rgba(189, 149, 75, 0.15); padding-bottom: 15px;">
            <h2 style="color: #d4af37; margin: 0; font-family: Georgia, serif; letter-spacing: 0.1em;">LALE PERDE</h2>
            <p style="color: #a3b3c2; font-size: 11px; text-transform: uppercase; margin: 5px 0 0 0; letter-spacing: 0.15em;">Yönetim Paneli Güvenlik Sistemi</p>
          </div>
          <p style="font-size: 14px; line-height: 1.6; color: #e0e6ed;">${emailIntro}</p>
          <div style="font-size: 28px; font-weight: 700; letter-spacing: 6px; text-align: center; padding: 20px; background-color: #0f1820; border: 1px solid rgba(189,149,75,0.3); border-radius: 6px; color: #d4af37; margin: 25px 0; font-family: monospace;">
            ${code}
          </div>
          <p style="font-size: 12px; color: #a3b3c2; line-height: 1.5;">Bu kod 5 dakika boyunca geçerlidir. Bu işlemi siz yapmadıysanız lütfen hemen bizimle iletişime geçin.</p>
        </div>
      `
    })
  });

  if (!resendRes.ok) {
    throw new Error('E-posta servisi gönderim hatası verdi.');
  }
}
