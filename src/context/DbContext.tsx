'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  SystemSettings,
  Campaign,
  VisitorLog,
  CommentItem
} from './dbTypes';
import {
  mapSettingsFromDb,
  mapCampaignFromDb,
  mapCommentFromDb,
  mapVisitorLogToDb,
  mapVisitorLogFromDb
} from './dbMappers';

export interface InitialDbData {
  settings?: SystemSettings | null;
  campaigns?: Campaign[];
  comments?: CommentItem[];
}

export interface GlobalDbContextType {
  settings: SystemSettings | null;
  campaigns: Campaign[];
  comments: CommentItem[];
  loading: boolean;
  
  incrementSearchLog: (query: string) => Promise<boolean>;
  addVisitorLog: (log: VisitorLog) => Promise<boolean>;
  updateVisitorLogDwellTime: (id: string, duration: number) => Promise<boolean>;
  
  fetchCampaignsLazy: () => Promise<void>;
  fetchCommentsLazy: () => Promise<void>;
}

export const DbContext = createContext<GlobalDbContextType | undefined>(undefined);

export const DbProvider: React.FC<{ children: React.ReactNode; initialData?: InitialDbData | null }> = ({ children, initialData }) => {
  const [settings, setSettings] = useState<SystemSettings | null>(initialData?.settings || null);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialData?.campaigns || []);
  const [comments, setComments] = useState<CommentItem[]>(initialData?.comments || []);
  const [loading, setLoading] = useState(false);
  
  const [campaignsFetched, setCampaignsFetched] = useState(false);
  const [commentsFetched, setCommentsFetched] = useState(false);

  const fetchCampaignsLazy = useCallback(async () => {
    if (campaignsFetched) return;
    const { data } = await supabase.from('campaigns').select('*').order('display_order', { ascending: true });
    if (data) setCampaigns(data.map(mapCampaignFromDb));
    setCampaignsFetched(true);
  }, [campaignsFetched]);

  const fetchCommentsLazy = useCallback(async () => {
    if (commentsFetched) return;
    const { data } = await supabase.from('comments').select('*').order('display_order', { ascending: true });
    if (data) setComments(data.map(mapCommentFromDb));
    setCommentsFetched(true);
  }, [commentsFetched]);

  const incrementSearchLog = async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return false;
    try {
      const response = await fetch('/api/public/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'search', data: { query: trimmed } })
      });
      return response.ok;
    } catch (e) {
      console.warn('Error logging search', e);
    }
    return false;
  };

  const addVisitorLog = useCallback(async (log: VisitorLog) => {
    const insertData = mapVisitorLogToDb(log);
    try {
      const response = await fetch('/api/public/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'visitor', data: insertData })
      });
      const result = await response.json();
      if (response.ok && result.data && result.data[0]) {
        return true;
      }
    } catch (e) {
      console.warn('Error inserting visitor log', e);
    }
    return false;
  }, []);

  const updateVisitorLogDwellTime = useCallback(async (id: string, duration: number) => {
    try {
      const response = await fetch('/api/public/logs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'visitor_duration', id, data: { duration } })
      });
      if (response.ok) {
        return true;
      }
    } catch (e) {
      console.warn('Error updating visitor log duration', e);
    }
    return false;
  }, []);

  const contextValue = useMemo(() => ({
    settings,
    campaigns,
    comments,
    loading,
    incrementSearchLog,
    addVisitorLog,
    updateVisitorLogDwellTime,
    fetchCampaignsLazy,
    fetchCommentsLazy
  }), [
    settings, campaigns, comments, loading,
    fetchCampaignsLazy, fetchCommentsLazy, addVisitorLog, updateVisitorLogDwellTime
  ]);

  return (
    <DbContext.Provider value={contextValue}>
      {children}
    </DbContext.Provider>
  );
};

export const useDb = () => {
  const context = useContext(DbContext);
  if (context === undefined) {
    throw new Error('useDb must be used within a DbProvider');
  }
  return context;
};
