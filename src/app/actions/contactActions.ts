'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

function escapeHtml(str: string): string {
  if (typeof str !== 'string') return '';
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Ad çok kısa'),
  email: z.string().email('Geçersiz e-posta'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(5, 'Mesaj çok kısa'),
  type: z.enum(['contact', 'appointment', 'lead']).optional().default('contact'),
  formId: z.string().optional()
});

export async function submitContactForm(formData: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  type?: 'contact' | 'appointment' | 'lead';
  formId?: string;
}) {
  try {
    // 1. Validate Input
    const parseResult = contactSchema.safeParse(formData);
    if (!parseResult.success) {
      return { error: 'Lütfen zorunlu alanları eksiksiz ve doğru doldurun.' };
    }
    const validatedData = parseResult.data;

    const type = validatedData.type || 'contact';
    
    // 2. Insert into Inbox table securely
    const id = `msg-${Date.now()}`;
    const insertData = {
      id,
      type,
      name: escapeHtml(validatedData.name),
      email: validatedData.email,
      phone: validatedData.phone || '',
      subject: escapeHtml(validatedData.subject || 'Yeni İletişim Formu Mesajı'),
      message: escapeHtml(validatedData.message),
      date: new Date().toISOString(),
      is_read: false,
      is_resolved: false,
      is_archived: false,
    };

    const { error: dbError } = await supabaseAdmin.from('inbox').insert([insertData]);

    if (dbError) {
      console.error('Veritabanına mesaj kaydedilirken hata oluştu:', dbError);
      return { error: 'Mesaj kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.' };
    }

    // 3. (Optional) Send to Formspree securely from the server (Hiding the URL and IP from client)
    const formspreeUrl = `https://formspree.io/f/${formData.formId || process.env.FORMSPREE_PROJECT_ID}`;
    
    try {
      await fetch(formspreeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    } catch (formspreeErr) {
      // Sadece konsola yaz, ana akışı bozma çünkü mesaj veritabanına kaydedildi
      console.warn('Formspree gönderimi başarısız:', formspreeErr);
    }

    return { success: true };
  } catch (err: any) {
    console.error('İletişim formu işlenirken sunucu hatası:', err);
    return { error: 'Bir sunucu hatası oluştu.' };
  }
}
