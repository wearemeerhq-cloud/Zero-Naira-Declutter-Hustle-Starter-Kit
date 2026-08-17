import { LeadData, UserProfile } from '../types';

const LEAD_KEY = 'zero_naira_lead_data';
const LEADS_HISTORY_KEY = 'zero_naira_leads_history';
const KIT_KEY = 'zero_naira_starter_kit';
const PROFILE_KEY = 'zero_naira_profile';

export const getStoredLeadsHistory = (): LeadData[] => {
  try {
    const raw = localStorage.getItem(LEADS_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const syncLeadsWithServer = async (): Promise<void> => {
  try {
    const history = getStoredLeadsHistory();
    const currentLead = localStorage.getItem(LEAD_KEY);
    const toSync: LeadData[] = [...history];
    if (currentLead) {
      try {
        const parsed = JSON.parse(currentLead);
        if (!toSync.some(l => l.email === parsed.email || l.id === parsed.id)) {
          toSync.push(parsed);
        }
      } catch (e) {}
    }

    if (toSync.length > 0) {
      await fetch('/api/leads/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads: toSync }),
      });
    }
  } catch (err) {
    // Silent fail
  }
};

export const submitLead = async (leadData: LeadData): Promise<{ success: boolean; leadId?: string }> => {
  try {
    // Save locally immediately to single lead slot and history
    localStorage.setItem(LEAD_KEY, JSON.stringify(leadData));

    const history = getStoredLeadsHistory();
    const exists = history.findIndex(l => (l.id && l.id === leadData.id) || (l.email && l.email === leadData.email));
    if (exists !== -1) {
      history[exists] = { ...history[exists], ...leadData };
    } else {
      history.unshift(leadData);
    }
    localStorage.setItem(LEADS_HISTORY_KEY, JSON.stringify(history));

    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData),
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, leadId: data.lead?.id };
    }
    return { success: true };
  } catch (err) {
    console.warn('Lead submission network error, saved to local cache:', err);
    return { success: true };
  }
};

export const patchLead = async (leadId: string, updates: Partial<LeadData>) => {
  try {
    const cached = localStorage.getItem(LEAD_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      localStorage.setItem(LEAD_KEY, JSON.stringify({ ...parsed, ...updates }));
    }
    const history = getStoredLeadsHistory();
    const idx = history.findIndex(l => l.id === leadId);
    if (idx !== -1) {
      history[idx] = { ...history[idx], ...updates };
      localStorage.setItem(LEADS_HISTORY_KEY, JSON.stringify(history));
    }
    await fetch(`/api/leads/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
  } catch (err) {
    // Silent catch
  }
};

export const saveLocalProfileAndKit = (profile: UserProfile, kit: any) => {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    localStorage.setItem(KIT_KEY, JSON.stringify(kit));
  } catch (e) {
    // LocalStorage fallback error catch
  }
};

export const getSavedSession = () => {
  try {
    const profile = localStorage.getItem(PROFILE_KEY);
    const kit = localStorage.getItem(KIT_KEY);
    const lead = localStorage.getItem(LEAD_KEY);
    return {
      profile: profile ? JSON.parse(profile) : null,
      kit: kit ? JSON.parse(kit) : null,
      lead: lead ? JSON.parse(lead) : null,
    };
  } catch (e) {
    return { profile: null, kit: null, lead: null };
  }
};

export const clearSession = () => {
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(KIT_KEY);
  localStorage.removeItem(LEAD_KEY);
};
