'use server';

import { supabaseAdmin, verifyAdminSession } from './utils';

export async function fetchVisitorLogsPaginatedAction(page: number, limit: number = 50) {
  try {
    await verifyAdminSession();
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error, count } = await supabaseAdmin.from('visitor_logs').select('*', { count: 'exact' }).range(from, to).order('timestamp', { ascending: false });
    if (error) return { error: error.message, data: [], count: 0 };
    return { data: data || [], count: count || 0 };
  } catch (err: any) {
    return { error: err.message, data: [], count: 0 };
  }
}

export async function fetchInboxPaginatedAction(page: number, limit: number = 50) {
  try {
    await verifyAdminSession();
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error, count } = await supabaseAdmin.from('inbox').select('*', { count: 'exact' }).range(from, to).order('date', { ascending: false });
    if (error) return { error: error.message, data: [], count: 0 };
    return { data: data || [], count: count || 0 };
  } catch (err: any) {
    return { error: err.message, data: [], count: 0 };
  }
}

export async function fetchSearchLogsPaginatedAction(page: number, limit: number = 50) {
  try {
    await verifyAdminSession();
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error, count } = await supabaseAdmin.from('search_logs').select('*', { count: 'exact' }).range(from, to).order('count', { ascending: false });
    if (error) return { error: error.message, data: [], count: 0 };
    return { data: data || [], count: count || 0 };
  } catch (err: any) {
    return { error: err.message, data: [], count: 0 };
  }
}
