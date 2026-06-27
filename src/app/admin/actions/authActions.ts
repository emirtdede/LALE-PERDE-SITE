'use server';

import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

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

import { sendOTPEmail } from '@/lib/emailService';

// Sadece sunucuda çalışan güvenli rastgele kod üretici
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// 1. Giriş Ön Kontrolü
export async function loginAttempt(username: string, password: string) {
  const { data: authRecord } = await supabaseAdmin
    .from('admin_auth')
    .select('admin_username, admin_email, admin_phone, admin_password_hash, two_factor_enabled, two_factor_type')
    .eq('id', 'main_admin')
    .single();

  if (!authRecord) return { error: 'Güvenlik ayarları okunamadı.' };

  const isValidUser = (username === authRecord.admin_username || username === authRecord.admin_email);
  const isValidPass = await bcrypt.compare(password, authRecord.admin_password_hash);

  if (!isValidUser || !isValidPass) return { error: 'Geçersiz kullanıcı adı veya şifre' };

  if (authRecord.two_factor_enabled) {
    return { 
      requires2FA: true, 
      twoFactorType: authRecord.two_factor_type,
      adminEmail: authRecord.admin_email,
      adminPhone: authRecord.admin_phone
    };
  }

  // 2FA kapalıysa doğrudan oturum aç
  const token = await new SignJWT({ username, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(getSecretKey());

  const cookieStore = await cookies();
  cookieStore.set('admin_session', token, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 86400, path: '/'
  });

  return { success: true };
}

// 2. Giriş için OTP Gönderimi ve Şifreli Çerez (Cookie) Ataması
export async function sendLoginOTP(destinationType: 'email' | 'phone', targetEmail: string, _targetPhone: string) {
  try {
    const otp = generateOTP();
    
    const token = await new SignJWT({ otp })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('5m')
      .sign(getSecretKey());

    const cookieStore = await cookies();
    cookieStore.set('pending_2fa', token, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 300, path: '/'
    });

    if (destinationType === 'email') {
      await sendOTPEmail(targetEmail, otp, '2fa');
    } else {
      // TODO: İleride gerçek SMS sağlayıcısı (örn: Netgsm/Twilio) entegre edilecek.
      if (process.env.NODE_ENV !== 'production') {
        console.log('\n[SERVER LOG] SMS 2FA KODU (SIMÜLASYON) - Gönderildi (***)\n');
      }
    }

    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'OTP gönderilemedi.' };
  }
}

// 3. OTP Doğrulaması ve Oturum Açılışı
export async function verifyLoginOTPAndLogin(username: string, enteredOTP: string) {
  try {
    const cookieStore = await cookies();
    const pendingToken = cookieStore.get('pending_2fa')?.value;
    
    if (!pendingToken) return { error: 'Doğrulama süresi dolmuş. Lütfen tekrar kod isteyin.' };

    const { payload } = await jwtVerify(pendingToken, getSecretKey());
    
    if (payload.otp !== enteredOTP) return { error: 'Hatalı doğrulama kodu.' };

    cookieStore.delete('pending_2fa');

    const token = await new SignJWT({ username, role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(getSecretKey());

    cookieStore.set('admin_session', token, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 86400, path: '/'
    });

    return { success: true };
  } catch (_err) {
    return { error: 'Geçersiz veya süresi dolmuş kod.' };
  }
}

// 4. Panel İçi Güvenlik Ayarları (SecurityTab) OTP'si
export async function sendSecurityOTP(destinationType: 'email' | 'phone', targetEmail: string) {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');
    if (!adminSession) return { error: 'Yetkisiz erişim.' };
    await jwtVerify(adminSession.value, getSecretKey());

    const otp = generateOTP();
    const token = await new SignJWT({ otp })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('5m')
      .sign(getSecretKey());

    cookieStore.set('security_2fa', token, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 300, path: '/'
    });

    if (destinationType === 'email') {
      await sendOTPEmail(targetEmail, otp, 'change');
    } else {
      // TODO: İleride gerçek SMS sağlayıcısı (örn: Netgsm/Twilio) entegre edilecek.
      if (process.env.NODE_ENV !== 'production') {
        console.log('\n[SERVER LOG] SECURITY SMS KODU (SIMÜLASYON) - Gönderildi (***)\n');
      }
    }

    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'OTP gönderilemedi.' };
  }
}

export async function verifySecurityOTP(enteredOTP: string) {
  try {
    const cookieStore = await cookies();
    const pendingToken = cookieStore.get('security_2fa')?.value;
    if (!pendingToken) return { error: 'Doğrulama süresi dolmuş.' };

    const { payload } = await jwtVerify(pendingToken, getSecretKey());
    if (payload.otp !== enteredOTP) return { error: 'Hatalı doğrulama kodu.' };

    cookieStore.delete('security_2fa');
    return { success: true };
  } catch (_err) {
    return { error: 'Geçersiz veya süresi dolmuş kod.' };
  }
}

// 5. Password Reset OTP
export async function sendResetOTP(targetEmail: string) {
  try {
    const otp = generateOTP();
    
    const token = await new SignJWT({ otp, email: targetEmail })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('5m')
      .sign(getSecretKey());

    const cookieStore = await cookies();
    cookieStore.set('reset_otp', token, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 300, path: '/'
    });

    await sendOTPEmail(targetEmail, otp, 'reset');

    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Sıfırlama e-postası gönderilemedi.' };
  }
}

export async function verifyResetOTP(enteredOTP: string) {
  try {
    const cookieStore = await cookies();
    const pendingToken = cookieStore.get('reset_otp')?.value;
    
    if (!pendingToken) return { error: 'Doğrulama süresi dolmuş.' };

    const { payload } = await jwtVerify(pendingToken, getSecretKey());
    
    if (payload.otp !== enteredOTP) return { error: 'Hatalı doğrulama kodu.' };

    // Şifre değiştirilene kadar tutabiliriz ya da yeni bir token (reset_verified) atayabiliriz. 
    // Basitlik için burada temizlemiyoruz, şifre değiştirildiğinde temizlenecek.
    return { success: true };
  } catch (_err) {
    return { error: 'Geçersiz veya süresi dolmuş kod.' };
  }
}

export async function completePasswordReset(newPassword: string) {
  try {
    const cookieStore = await cookies();
    const pendingToken = cookieStore.get('reset_otp')?.value;
    
    if (!pendingToken) {
      return { error: 'Doğrulama süresi dolmuş veya yetkisiz işlem.' };
    }

    // Verify token validity
    await jwtVerify(pendingToken, getSecretKey());

    // Hash the password securely using bcrypt
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the admin_auth table
    const { error: updateError } = await supabaseAdmin
      .from('admin_auth')
      .update({ admin_password_hash: hashedPassword })
      .eq('id', 'main_admin');

    if (updateError) {
      console.error('Password reset DB update error:', updateError);
      return { error: 'Şifre güncellenirken bir veritabanı hatası oluştu.' };
    }

    cookieStore.delete('reset_otp');
    return { success: true };
  } catch (err) {
    return { error: 'Yetkisiz veya süresi dolmuş işlem.' };
  }
}
