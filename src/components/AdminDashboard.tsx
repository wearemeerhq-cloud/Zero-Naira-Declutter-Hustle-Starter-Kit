import React, { useEffect, useState, useMemo } from 'react';
import { LeadData, LeadStats, LeadStatus } from '../types';
import { AdminPinLock } from './AdminPinLock';
import { 
  ArrowLeft, 
  Users, 
  TrendingUp, 
  Calendar, 
  BookOpen, 
  RefreshCw, 
  MapPin, 
  Tag, 
  Target, 
  Download, 
  Search, 
  Filter, 
  MessageCircle, 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Edit3, 
  Eye, 
  PlusCircle, 
  Database,
  BarChart3,
  Check,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Lock
} from 'lucide-react';

interface AdminDashboardProps {
  onBack: () => void;
}

// Helper to calculate analytics stats directly from leads array
const computeClientStats = (leadList: LeadData[]): LeadStats => {
  const totalLeads = leadList.length;
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfWeek = startOfDay - now.getDay() * 24 * 60 * 60 * 1000;

  const leadsToday = leadList.filter((l) => {
    if (!l?.createdAt) return false;
    const t = new Date(l.createdAt).getTime();
    return !isNaN(t) && t >= startOfDay;
  }).length;

  const leadsThisWeek = leadList.filter((l) => {
    if (!l?.createdAt) return false;
    const t = new Date(l.createdAt).getTime();
    return !isNaN(t) && t >= startOfWeek;
  }).length;

  const kitsGenerated = leadList.filter((l) => Boolean(l?.starterKitGenerated)).length;
  const ebookCtaClicks = leadList.filter((l) => Boolean(l?.ebookCtaClicked)).length;

  const catMap: Record<string, number> = {};
  leadList.forEach((l) => {
    const cats = Array.isArray(l?.itemCategories) ? l.itemCategories : (typeof l?.itemCategories === 'string' ? [l.itemCategories] : []);
    cats.forEach((cat: string) => {
      if (cat && typeof cat === 'string') {
        catMap[cat] = (catMap[cat] || 0) + 1;
      }
    });
  });
  const topCategories = Object.entries(catMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const goalMap: Record<string, number> = {};
  leadList.forEach((l) => {
    if (l?.primaryGoal && typeof l.primaryGoal === 'string') {
      goalMap[l.primaryGoal] = (goalMap[l.primaryGoal] || 0) + 1;
    }
  });
  const topGoals = Object.entries(goalMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const expMap: Record<string, number> = {};
  leadList.forEach((l) => {
    if (l?.experienceLevel && typeof l.experienceLevel === 'string') {
      expMap[l.experienceLevel] = (expMap[l.experienceLevel] || 0) + 1;
    }
  });
  const experienceBreakdown = Object.entries(expMap).map(([name, count]) => ({ name, count }));

  const locMap: Record<string, number> = {};
  leadList.forEach((l) => {
    if (l?.city && typeof l.city === 'string') {
      locMap[l.city] = (locMap[l.city] || 0) + 1;
    }
  });
  const locationDistribution = Object.entries(locMap)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count);

  const stateMap: Record<string, number> = {};
  leadList.forEach((l) => {
    if (l?.state && typeof l.state === 'string') {
      stateMap[l.state] = (stateMap[l.state] || 0) + 1;
    }
  });
  const stateDistribution = Object.entries(stateMap)
    .map(([state, count]) => ({ state, count }))
    .sort((a, b) => b.count - a.count);

  const statusMap: Record<string, number> = {
    new: 0,
    contacted: 0,
    interested: 0,
    converted_ebook: 0,
    archived: 0
  };
  leadList.forEach((l) => {
    const s = l?.status || "new";
    statusMap[s] = (statusMap[s] || 0) + 1;
  });
  const statusBreakdown = Object.entries(statusMap).map(([status, count]) => ({ status, count }));

  const dailyTrend: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
    const count = leadList.filter((l) => {
      if (!l?.createdAt) return false;
      const t = new Date(l.createdAt).getTime();
      return !isNaN(t) && t >= dayStart && t < dayEnd;
    }).length;
    dailyTrend.push({ date: dateStr, count });
  }

  return {
    totalLeads,
    leadsToday,
    leadsThisWeek,
    kitsGenerated,
    ebookCtaClicks,
    topCategories,
    topGoals,
    experienceBreakdown,
    locationDistribution,
    stateDistribution,
    statusBreakdown,
    dailyTrend,
    recentLeads: leadList.slice(0, 100)
  };
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('zero_naira_admin_unlocked') === 'true';
  });
  const [activeTab, setActiveTab] = useState<'leads' | 'analytics' | 'add_lead'>('leads');
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Selected Lead Modal
  const [selectedLead, setSelectedLead] = useState<LeadData | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Manual Add Lead Form State
  const [newLead, setNewLead] = useState({
    firstName: '',
    email: '',
    phone: '',
    city: 'Lagos',
    state: 'Lagos',
    area: '',
    experienceLevel: 'Complete Beginner',
    startingCapital: '₦0 (Zero Naira)',
    primaryGoal: 'Make my first ₦50,000–₦100,000 without capital risk',
    availableTime: '5-10 hours',
    itemCategories: ['Electronics & Gadgets'],
    sellerAccess: ['Family & Close Friends', 'Estate / Residential WhatsApp'],
    notes: ''
  });

  const fetchData = async () => {
    setLoading(true);
    setError('');

    // Preload from localStorage so the table is never completely empty
    let fallbackLeads: LeadData[] = [];
    try {
      const storedHistory = localStorage.getItem('zero_naira_leads_history');
      const currentLead = localStorage.getItem('zero_naira_lead_data');
      if (storedHistory) {
        fallbackLeads = JSON.parse(storedHistory);
      }
      if (currentLead) {
        const parsed = JSON.parse(currentLead);
        if (!fallbackLeads.some(l => (l.id && l.id === parsed.id) || (l.email && l.email === parsed.email))) {
          fallbackLeads.unshift(parsed);
        }
      }
    } catch (e) {}

    try {
      // 1. Sync any local leads to the server first
      if (fallbackLeads.length > 0) {
        try {
          await fetch('/api/leads/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ leads: fallbackLeads })
          });
        } catch (e) {
          console.warn('Sync failed:', e);
        }
      }

      // 2. Fetch server leads
      let finalLeads = fallbackLeads;
      try {
        const leadsRes = await fetch('/api/leads');
        if (leadsRes.ok) {
          const leadsData = await leadsRes.json();
          if (Array.isArray(leadsData.leads) && leadsData.leads.length > 0) {
            finalLeads = leadsData.leads;
          }
        }
      } catch (e) {
        console.warn('Failed to fetch from /api/leads:', e);
      }

      setLeads(finalLeads);

      // 3. Fetch or compute stats
      try {
        const statsRes = await fetch('/api/leads/stats');
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        } else {
          setStats(computeClientStats(finalLeads));
        }
      } catch (e) {
        setStats(computeClientStats(finalLeads));
      }

    } catch (err: any) {
      console.error('Fetch leads error:', err);
      if (fallbackLeads.length > 0) {
        setLeads(fallbackLeads);
        setStats(computeClientStats(fallbackLeads));
      } else {
        setError(err?.message || 'Failed to load data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update lead status
  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
        }
        showNotification('Lead status updated');
        // Refresh stats silently
        fetch('/api/leads/stats').then(r => r.json()).then(setStats).catch(() => {});
      }
    } catch (err) {
      setError('Failed to update status');
    }
  };

  // Save notes for selected lead
  const handleSaveNotes = async () => {
    if (!selectedLead?.id) return;
    setIsSavingNotes(true);
    try {
      const res = await fetch(`/api/leads/${selectedLead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: editingNotes })
      });
      if (res.ok) {
        setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, notes: editingNotes } : l));
        setSelectedLead(prev => prev ? { ...prev, notes: editingNotes } : null);
        showNotification('Notes saved successfully');
      }
    } catch (err) {
      setError('Failed to save notes');
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Delete lead
  const handleDeleteLead = async (leadId: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      const res = await fetch(`/api/leads/${leadId}`, { method: 'DELETE' });
      if (res.ok) {
        setLeads(prev => prev.filter(l => l.id !== leadId));
        if (selectedLead?.id === leadId) setSelectedLead(null);
        showNotification('Lead deleted');
        fetch('/api/leads/stats').then(r => r.json()).then(setStats).catch(() => {});
      }
    } catch (err) {
      setError('Failed to delete lead');
    }
  };

  // Seed sample demo leads
  const handleSeedLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leads/seed', { method: 'POST' });
      if (res.ok) {
        await fetchData();
        showNotification('Demo leads reset & populated!');
      }
    } catch (err) {
      setError('Failed to seed leads');
    } finally {
      setLoading(false);
    }
  };

  // Handle manual lead addition
  const handleAddManualLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.firstName || !newLead.email || !newLead.phone) {
      setError('Name, Email, and Phone are required.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newLead,
          consent: true,
          starterKitGenerated: true,
          ebookCtaViewed: false,
          ebookCtaClicked: false
        })
      });
      if (res.ok) {
        await fetchData();
        setActiveTab('leads');
        showNotification('New lead successfully added!');
        setNewLead({
          firstName: '',
          email: '',
          phone: '',
          city: 'Lagos',
          state: 'Lagos',
          area: '',
          experienceLevel: 'Complete Beginner',
          startingCapital: '₦0 (Zero Naira)',
          primaryGoal: 'Make my first ₦50,000–₦100,000 without capital risk',
          availableTime: '5-10 hours',
          itemCategories: ['Electronics & Gadgets'],
          sellerAccess: ['Family & Close Friends'],
          notes: ''
        });
      }
    } catch (err) {
      setError('Failed to create lead');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Direct WhatsApp Link Generator with Pre-filled Message
  const getWhatsAppLink = (lead: LeadData) => {
    const rawPhone = lead.phone.replace(/[^0-9]/g, '');
    let formattedPhone = rawPhone;
    if (formattedPhone.startsWith('0') && formattedPhone.length === 11) {
      formattedPhone = '234' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('234') && formattedPhone.length === 10) {
      formattedPhone = '234' + formattedPhone;
    }
    const message = encodeURIComponent(
      `Hello ${lead.firstName}! 👋 I saw you generated your Zero-Naira Declutter Hustle Starter Kit for ${lead.city}. How is your first seller outreach going, and do you have any questions on setting up your business?`
    );
    return `https://wa.me/${formattedPhone}?text=${message}`;
  };

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        !searchQuery ||
        lead.firstName?.toLowerCase().includes(q) ||
        lead.email?.toLowerCase().includes(q) ||
        lead.phone?.toLowerCase().includes(q) ||
        lead.city?.toLowerCase().includes(q) ||
        lead.state?.toLowerCase().includes(q) ||
        lead.notes?.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'all' || (lead.status || 'new') === statusFilter;
      const matchesState = stateFilter === 'all' || lead.state?.toLowerCase() === stateFilter.toLowerCase();
      const matchesCat = categoryFilter === 'all' || (lead.itemCategories || []).includes(categoryFilter);

      return matchesSearch && matchesStatus && matchesState && matchesCat;
    });
  }, [leads, searchQuery, statusFilter, stateFilter, categoryFilter]);

  // Unique states for filter dropdown
  const uniqueStates = useMemo(() => {
    const set = new Set<string>();
    leads.forEach(l => { if (l?.state) set.add(l.state); });
    return Array.from(set);
  }, [leads]);

  // Guaranteed active stats (either from server or computed from current leads)
  const activeStats = useMemo(() => {
    return stats || computeClientStats(leads);
  }, [stats, leads]);

  // Status Badge Colors & Labels
  const getStatusBadge = (status?: LeadStatus) => {
    switch (status) {
      case 'interested':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Interested</span>;
      case 'contacted':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">Contacted</span>;
      case 'converted_ebook':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Ebook Converted</span>;
      case 'archived':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">Archived</span>;
      case 'new':
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">New Lead</span>;
    }
  };

  if (!isUnlocked) {
    return (
      <AdminPinLock
        onSuccess={() => setIsUnlocked(true)}
        onBack={onBack}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      
      {/* TOP OWNER HEADER */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                title="Back to User View"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                    Owner Lead Portal & CRM
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE INGESTION
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Real-time database of entrepreneurs who built starter kits and requested information
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <a
                href="/api/leads/export/csv"
                download="zero-naira-leads.csv"
                className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </a>

              <button
                onClick={handleSeedLeads}
                title="Reset with Nigerian Sample Leads"
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Database className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Demo Leads</span>
              </button>

              <button
                onClick={fetchData}
                disabled={loading}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                title="Refresh Data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-teal-600' : ''}`} />
              </button>

              <button
                onClick={async () => {
                  try {
                    const token = sessionStorage.getItem('zero_naira_admin_token');
                    if (token) {
                      fetch('/api/admin/logout', {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}` }
                      }).catch(() => {});
                    }
                  } catch (e) {}
                  sessionStorage.removeItem('zero_naira_admin_unlocked');
                  sessionStorage.removeItem('zero_naira_admin_token');
                  setIsUnlocked(false);
                }}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 hover:border-red-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Lock Admin Dashboard"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500 hover:text-red-600" />
                <span className="hidden sm:inline">Lock Portal</span>
              </button>
            </div>

          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-4 border-t border-slate-100 pt-3">
            <button
              onClick={() => setActiveTab('leads')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'leads'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>All Captured Leads ({leads.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics & Demand Trends</span>
            </button>

            <button
              onClick={() => setActiveTab('add_lead')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'add_lead'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Manual Lead</span>
            </button>
          </div>

        </div>
      </div>

      {/* NOTIFICATIONS */}
      {successMsg && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        
        {/* KPI OVERVIEW CARDS */}
        {activeStats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Total Leads</span>
                <Users className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">{activeStats.totalLeads}</div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-1">
                <span>+{activeStats.leadsToday} captured today</span>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Kits Built</span>
                <TrendingUp className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">{activeStats.kitsGenerated}</div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">
                100% personalized starter plans
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Ebook CTA CTR</span>
                <BookOpen className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">{activeStats.ebookCtaClicks}</div>
              <div className="text-[11px] text-amber-700 font-semibold mt-1">
                {activeStats.totalLeads > 0 ? ((activeStats.ebookCtaClicks / activeStats.totalLeads) * 100).toFixed(1) : 0}% lead conversion rate
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Top Region</span>
                <MapPin className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-slate-900 truncate">
                {activeStats.locationDistribution?.[0]?.city || 'Lagos'}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-1 truncate">
                {activeStats.stateDistribution?.[0]?.state || 'Lagos State'} ({activeStats.stateDistribution?.[0]?.count || 0} leads)
              </div>
            </div>

          </div>
        )}

        {/* TAB 1: ALL LEADS TABLE & CRM */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            
            {/* Search and Filters Bar */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3 justify-between">
              
              {/* Search Box */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone, city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-teal-600"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Filter Dropdowns */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-teal-600 cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New Lead</option>
                  <option value="contacted">Contacted</option>
                  <option value="interested">Interested</option>
                  <option value="converted_ebook">Converted Ebook</option>
                  <option value="archived">Archived</option>
                </select>

                {/* State Filter */}
                <select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="text-xs py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-teal-600 cursor-pointer"
                >
                  <option value="all">All States</option>
                  {uniqueStates.map((st, i) => (
                    <option key={i} value={st}>{st}</option>
                  ))}
                </select>

                {/* Clear filters */}
                {(searchQuery || statusFilter !== 'all' || stateFilter !== 'all') && (
                  <button
                    onClick={() => { setSearchQuery(''); setStatusFilter('all'); setStateFilter('all'); }}
                    className="text-xs text-teal-700 font-semibold px-2 py-1 hover:underline cursor-pointer"
                  >
                    Reset
                  </button>
                )}

              </div>

            </div>

            {/* Leads Table Card */}
            <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
              
              <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Lead Roster ({filteredLeads.length} of {leads.length})
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Click any lead row to view full survey answers & write notes
                </div>
              </div>

              {filteredLeads.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <Users className="w-8 h-8 text-slate-300 mx-auto" />
                  <div className="text-sm font-bold text-slate-700">No matching leads found</div>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try adjusting your search criteria or click Demo Leads above to populate sample records.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-4">Lead Name</th>
                        <th className="py-3 px-4">Contact (WhatsApp / Email)</th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4">Focus Category</th>
                        <th className="py-3 px-4">Experience</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Captured</th>
                        <th className="py-3 px-4 text-right">Quick Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredLeads.map((lead) => {
                        const waLink = getWhatsAppLink(lead);
                        return (
                          <tr 
                            key={lead.id} 
                            className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                            onClick={() => {
                              setSelectedLead(lead);
                              setEditingNotes(lead.notes || '');
                            }}
                          >
                            
                            {/* Lead Name */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-black flex items-center justify-center text-xs shrink-0">
                                  {lead.firstName?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900">{lead.firstName}</div>
                                  {lead.area && <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{lead.area}</div>}
                                </div>
                              </div>
                            </td>

                            {/* Contact Links */}
                            <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center gap-2">
                                <a
                                  href={waLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold flex items-center gap-1 transition-colors"
                                  title="Send WhatsApp Message"
                                >
                                  <MessageCircle className="w-3 h-3 text-emerald-600" />
                                  <span>WhatsApp</span>
                                </a>
                                <a
                                  href={`mailto:${lead.email}`}
                                  className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                                  title={`Email ${lead.email}`}
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                </a>
                                <span className="font-mono text-[11px] text-slate-500 hidden sm:inline">
                                  {lead.phone}
                                </span>
                              </div>
                            </td>

                            {/* Location */}
                            <td className="py-3.5 px-4">
                              <div className="font-medium text-slate-800">{lead.city}</div>
                              <div className="text-[10px] text-slate-400">{lead.state}</div>
                            </td>

                            {/* Focus Category */}
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200 inline-block max-w-[140px] truncate">
                                {lead.itemCategories?.[0] || 'General'}
                              </span>
                            </td>

                            {/* Experience */}
                            <td className="py-3.5 px-4">
                              <span className="text-[11px] text-slate-600">
                                {lead.experienceLevel || 'Beginner'}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                              <select
                                value={lead.status || 'new'}
                                onChange={(e) => handleStatusChange(lead.id!, e.target.value as LeadStatus)}
                                className="text-[11px] font-bold py-1 px-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 cursor-pointer focus:outline-teal-600"
                              >
                                <option value="new">🟢 New Lead</option>
                                <option value="contacted">🔵 Contacted</option>
                                <option value="interested">🟡 Interested</option>
                                <option value="converted_ebook">⭐ Ebook Converted</option>
                                <option value="archived">⚪ Archived</option>
                              </select>
                            </td>

                            {/* Date */}
                            <td className="py-3.5 px-4 text-[11px] text-slate-500 whitespace-nowrap">
                              {new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setSelectedLead(lead);
                                    setEditingNotes(lead.notes || '');
                                  }}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                                  title="View Full Profile & Notes"
                                >
                                  <Eye className="w-3.5 h-3.5 text-teal-700" />
                                </button>
                                <button
                                  onClick={() => handleDeleteLead(lead.id!)}
                                  className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                                  title="Delete Lead"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>

                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

            </div>

          </div>
        )}

        {/* TAB 2: ANALYTICS & DEMAND TRENDS */}
        {activeTab === 'analytics' && activeStats && (
          <div className="space-y-6">
            
            {/* Daily Acquisition Trend */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-800 uppercase tracking-wider">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span>Lead Ingestion Timeline (Last 7 Days)</span>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Total 7-day intake: {activeStats.leadsThisWeek} leads
                </div>
              </div>

              {activeStats.dailyTrend && activeStats.dailyTrend.length > 0 ? (
                <div className="pt-4 flex items-end justify-between gap-2 h-40 border-b border-slate-200 pb-2">
                  {activeStats.dailyTrend.map((d, idx) => {
                    const maxCount = Math.max(...activeStats.dailyTrend!.map(item => item.count), 1);
                    const heightPercent = Math.max((d.count / maxCount) * 100, 8);
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                        <span className="text-[10px] font-bold text-teal-800 group-hover:scale-110 transition-transform">
                          {d.count}
                        </span>
                        <div 
                          className="w-full max-w-[36px] bg-teal-600 rounded-t-lg transition-all hover:bg-teal-700"
                          style={{ height: `${heightPercent}%` }}
                        />
                        <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">
                          {d.date}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-6 text-center">No trend data available yet.</p>
              )}
            </div>

            {/* Category Demand & State Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Product Categories */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-800 uppercase tracking-wider">
                  <Tag className="w-4 h-4 text-amber-600" />
                  <span>Most Selected Product Categories</span>
                </div>
                <div className="space-y-3">
                  {(activeStats.topCategories || []).length > 0 ? (
                    activeStats.topCategories.map((cat, idx) => {
                      const maxCat = activeStats.topCategories[0]?.count || 1;
                      const widthPercent = (cat.count / maxCat) * 100;
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-medium">
                            <span className="text-slate-800">{cat.name}</span>
                            <span className="text-teal-800 font-bold">{cat.count} selections</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div 
                              className="h-full bg-teal-500 rounded-full"
                              style={{ width: `${widthPercent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-slate-400 py-4 text-center">No category data recorded yet.</p>
                  )}
                </div>
              </div>

              {/* Geographic Distribution */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-800 uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span>Geographic Distribution (States & Cities)</span>
                </div>
                <div className="space-y-3">
                  {(activeStats.stateDistribution || []).length > 0 ? (
                    activeStats.stateDistribution.map((st, idx) => {
                      const maxState = activeStats.stateDistribution[0]?.count || 1;
                      const widthPercent = (st.count / maxState) * 100;
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-medium">
                            <span className="text-slate-800">{st.state}</span>
                            <span className="text-amber-800 font-bold">{st.count} entrepreneurs</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div 
                              className="h-full bg-amber-500 rounded-full"
                              style={{ width: `${widthPercent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-slate-400 py-4 text-center">No location data recorded yet.</p>
                  )}
                </div>
              </div>

            </div>

            {/* Experience Level & Goals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Experience */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-800 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>User Experience Breakdown</span>
                </div>
                <div className="space-y-2">
                  {(activeStats.experienceBreakdown || []).length > 0 ? (
                    activeStats.experienceBreakdown.map((exp, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                        <span className="text-slate-800 font-medium">{exp.name}</span>
                        <span className="font-bold text-teal-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {exp.count}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 py-4 text-center">No experience data recorded yet.</p>
                  )}
                </div>
              </div>

              {/* Primary Goals */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-800 uppercase tracking-wider">
                  <Target className="w-4 h-4 text-teal-600" />
                  <span>Primary Stated Goals</span>
                </div>
                <div className="space-y-2">
                  {(activeStats.topGoals || []).length > 0 ? (
                    activeStats.topGoals.map((goal, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                        <span className="text-slate-800 font-medium truncate pr-2">{goal.name}</span>
                        <span className="font-bold text-teal-800 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                          {goal.count}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 py-4 text-center">No goal data recorded yet.</p>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: MANUAL LEAD CREATOR */}
        {activeTab === 'add_lead' && (
          <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Manually Capture / Insert Lead</h2>
              <p className="text-xs text-slate-500">Record a prospect you met through WhatsApp, offline networking, or direct call</p>
            </div>

            <form onSubmit={handleAddManualLead} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={newLead.firstName}
                    onChange={(e) => setNewLead({ ...newLead, firstName: e.target.value })}
                    placeholder="e.g. Nkechi"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-teal-600 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    placeholder="e.g. nkechi@example.com"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-teal-600 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    placeholder="e.g. 08012345678"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-teal-600 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={newLead.city}
                    onChange={(e) => setNewLead({ ...newLead, city: e.target.value })}
                    placeholder="e.g. Ikeja"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-teal-600 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={newLead.state}
                    onChange={(e) => setNewLead({ ...newLead, state: e.target.value })}
                    placeholder="e.g. Lagos"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-teal-600 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Experience Level</label>
                  <select
                    value={newLead.experienceLevel}
                    onChange={(e) => setNewLead({ ...newLead, experienceLevel: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-teal-600 text-slate-900"
                  >
                    <option value="Complete Beginner">Complete Beginner</option>
                    <option value="Sold a few personal items before">Sold personal items before</option>
                    <option value="Experienced Hustler / Marketer">Experienced Marketer</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Weekly Time Commitment</label>
                  <select
                    value={newLead.availableTime}
                    onChange={(e) => setNewLead({ ...newLead, availableTime: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-teal-600 text-slate-900"
                  >
                    <option value="Under 5 hours">Under 5 hours</option>
                    <option value="5-10 hours">5-10 hours</option>
                    <option value="10-20 hours">10-20 hours</option>
                    <option value="20+ hours (Full focus)">20+ hours (Full focus)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Admin Notes</label>
                <textarea
                  rows={3}
                  value={newLead.notes}
                  onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                  placeholder="Notes on where you met this prospect, their specific questions, or follow-up deadline..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-teal-600 text-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                {loading ? 'Saving Lead...' : 'Save Lead To Database'}
              </button>

            </form>
          </div>
        )}

      </div>

      {/* LEAD DETAILS & CRM MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 my-8">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 font-black flex items-center justify-center text-base">
                  {selectedLead.firstName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">{selectedLead.firstName}</h3>
                    {getStatusBadge(selectedLead.status)}
                  </div>
                  <p className="text-xs text-slate-500">
                    Captured on {new Date(selectedLead.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Direct Outreach Bar */}
            <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-teal-900">Direct WhatsApp Outreach</div>
                <div className="text-[11px] text-teal-700">Phone: {selectedLead.phone} • Email: {selectedLead.email}</div>
              </div>
              <a
                href={getWhatsAppLink(selectedLead)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open WhatsApp Chat</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Full Questionnaire Responses */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-teal-600" />
                <span>Complete Questionnaire Answers</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-500 font-medium block">Location:</span>
                  <span className="font-bold text-slate-900">{selectedLead.city}, {selectedLead.state} {selectedLead.area ? `(${selectedLead.area})` : ''}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Experience Level:</span>
                  <span className="font-bold text-slate-900">{selectedLead.experienceLevel}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Starting Capital:</span>
                  <span className="font-bold text-slate-900">{selectedLead.startingCapital}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Time Commitment:</span>
                  <span className="font-bold text-slate-900">{selectedLead.availableTime}/week</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 font-medium block">Target Product Categories:</span>
                  <span className="font-bold text-slate-900">{selectedLead.itemCategories?.join(', ') || 'Household Goods'}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 font-medium block">Seller Network Access:</span>
                  <span className="font-bold text-slate-900">{selectedLead.sellerAccess?.join(', ') || 'General contacts'}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 font-medium block">Primary Motivation / Goal:</span>
                  <span className="font-bold text-teal-800">{selectedLead.primaryGoal}</span>
                </div>
              </div>
            </div>

            {/* CRM Status & Notes Editor */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Private Owner Notes</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium">Status:</span>
                  <select
                    value={selectedLead.status || 'new'}
                    onChange={(e) => handleStatusChange(selectedLead.id!, e.target.value as LeadStatus)}
                    className="py-1 px-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                  >
                    <option value="new">New Lead</option>
                    <option value="contacted">Contacted</option>
                    <option value="interested">Interested</option>
                    <option value="converted_ebook">Converted Ebook</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <textarea
                rows={3}
                value={editingNotes}
                onChange={(e) => setEditingNotes(e.target.value)}
                placeholder="Add follow-up notes, call summaries, or deal updates here..."
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-teal-600 text-slate-900 text-xs"
              />

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => handleDeleteLead(selectedLead.id!)}
                  className="text-red-600 hover:text-red-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Record</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isSavingNotes ? 'Saving...' : 'Save Notes'}</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
