export interface UserProfile {
  firstName: string;
  email?: string;
  phone?: string;
  city: string;
  state: string;
  area?: string;
  experienceLevel: string;
  startingCapital: string;
  sellerAccess: string[];
  itemCategories: string[];
  customCategory?: string;
  primaryGoal: string;
  availableTime: string;
}

export type LeadStatus = 'new' | 'contacted' | 'interested' | 'converted_ebook' | 'archived';

export interface LeadData extends UserProfile {
  id?: string;
  email: string;
  phone: string;
  consent: boolean;
  createdAt: string;
  starterKitGenerated: boolean;
  ebookCtaViewed: boolean;
  ebookCtaClicked: boolean;
  status?: LeadStatus;
  notes?: string;
  tags?: string[];
}

export interface BusinessIdentity {
  businessNames: { name: string; positioning: string }[];
  recommendedName: string;
  businessPositioning: string;
  whatsappBio: string;
}

export interface SellerOutreachKit {
  personalContact: string;
  communityGroup: string;
  referralMessage: string;
}

export interface CommissionGuide {
  recommendedModel: string;
  explanation: string;
  startingFramework: string;
  importantTerms: string[];
}

export interface ActionDay {
  day: number;
  title: string;
  objective: string;
  actions: string[];
}

export interface AIPromptItem {
  title: string;
  prompt: string;
  explanation: string;
}

export interface StarterKit {
  businessIdentity: BusinessIdentity;
  sellerOutreach: SellerOutreachKit;
  listingTemplate: string;
  exampleListing: string;
  commissionGuide: CommissionGuide;
  sevenDayPlan: ActionDay[];
  prospectIdeas: string[];
  firstSaleChecklist: {
    intake: string[];
    list: string[];
    negotiate: string[];
    handover: string[];
  };
  aiPrompts: AIPromptItem[];
  nextMove: {
    heading: string;
    description: string;
    actionMission: string;
  };
}

export interface DailyLeadCount {
  date: string;
  count: number;
}

export interface LeadStats {
  totalLeads: number;
  leadsToday: number;
  leadsThisWeek: number;
  kitsGenerated: number;
  ebookCtaClicks: number;
  topCategories: { name: string; count: number }[];
  topGoals: { name: string; count: number }[];
  experienceBreakdown: { name: string; count: number }[];
  locationDistribution: { city: string; count: number }[];
  stateDistribution?: { state: string; count: number }[];
  dailyTrend?: DailyLeadCount[];
  statusBreakdown?: { status: string; count: number }[];
  recentLeads?: LeadData[];
}

export type AnalyticsEventType =
  | 'landing_page_view'
  | 'starter_kit_started'
  | 'step_completed'
  | 'starter_kit_generated'
  | 'lead_form_viewed'
  | 'lead_submitted'
  | 'starter_kit_completed'
  | 'ebook_cta_viewed'
  | 'ebook_cta_clicked';

export interface AnalyticsEvent {
  event: AnalyticsEventType;
  params?: Record<string, unknown>;
  timestamp: string;
}
