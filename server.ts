import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory active admin tokens
const activeAdminTokens = new Set<string>();

// Persistent disk storage setup for leads
const DATA_DIR = path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {}
}

const initialSeedLeads: Array<any> = [
  {
    id: "lead_demo_01",
    firstName: "Chinedu",
    email: "chinedu.okafor@gmail.com",
    phone: "+2348031234567",
    city: "Ikeja",
    state: "Lagos",
    area: "Opebi / Allen",
    experienceLevel: "Complete Beginner",
    startingCapital: "₦0 (Zero Naira)",
    sellerAccess: ["Family & Close Friends", "Church / Religious Groups", "Estate / Residential WhatsApp"],
    itemCategories: ["Electronics & Gadgets", "Home Appliances (Fridges, ACs)"],
    primaryGoal: "Make my first ₦50,000–₦100,000 without capital risk",
    availableTime: "10-20 hours",
    consent: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    starterKitGenerated: true,
    ebookCtaViewed: true,
    ebookCtaClicked: true,
    status: "interested",
    notes: "Very eager to start with used electronics in Ikeja. Reached out via WhatsApp.",
    tags: ["High Intent", "Electronics", "Lagos"]
  },
  {
    id: "lead_demo_02",
    firstName: "Amina",
    email: "amina.bello@yahoo.com",
    phone: "+2348129876543",
    city: "Gwarinpa",
    state: "Abuja (FCT)",
    area: "3rd Avenue",
    experienceLevel: "Sold a few personal items before",
    startingCapital: "₦0 (Zero Naira)",
    sellerAccess: ["Estate / Residential WhatsApp", "Workplace / Colleagues"],
    itemCategories: ["Furniture & Home Decor", "Baby & Kids Items"],
    primaryGoal: "Build a reliable side income alongside my day job",
    availableTime: "5-10 hours",
    consent: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    starterKitGenerated: true,
    ebookCtaViewed: true,
    ebookCtaClicked: false,
    status: "contacted",
    notes: "Works 9-5 in Abuja. Wants weekend decluttering deals in Gwarinpa estate.",
    tags: ["Estate Specialist", "Abuja"]
  },
  {
    id: "lead_demo_03",
    firstName: "Tunde",
    email: "tunde.adeyemi@hotmail.com",
    phone: "+2347065554321",
    city: "Surulere",
    state: "Lagos",
    area: "Aguda / Bode Thomas",
    experienceLevel: "Experienced Hustler / Marketer",
    startingCapital: "Under ₦20,000",
    sellerAccess: ["Social Media Followers", "Alumni / School Groups", "Workplace / Colleagues"],
    itemCategories: ["Phones & Laptops", "Generators & Inverters"],
    primaryGoal: "Scale to a full-time middleman business",
    availableTime: "20+ hours (Full focus)",
    consent: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    starterKitGenerated: true,
    ebookCtaViewed: true,
    ebookCtaClicked: true,
    status: "converted_ebook",
    notes: "Clicked Selar link and purchased the full Ebook. Active hustler.",
    tags: ["Purchased Ebook", "High Priority"]
  },
  {
    id: "lead_demo_04",
    firstName: "Blessing",
    email: "blessing.nkem@gmail.com",
    phone: "+2349081122334",
    city: "Port Harcourt",
    state: "Rivers",
    area: "GRA Phase 2",
    experienceLevel: "Complete Beginner",
    startingCapital: "₦0 (Zero Naira)",
    sellerAccess: ["Family & Close Friends", "Church / Religious Groups"],
    itemCategories: ["Fashion, Shoes & Bags", "Baby & Kids Items"],
    primaryGoal: "Learn the step-by-step negotiation process",
    availableTime: "5-10 hours",
    consent: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    starterKitGenerated: true,
    ebookCtaViewed: false,
    ebookCtaClicked: false,
    status: "new",
    notes: "Needs help with first script to send to church members.",
    tags: ["Follow-up Needed", "Rivers"]
  },
  {
    id: "lead_demo_05",
    firstName: "Ibrahim",
    email: "ibrahim.lawal@gmail.com",
    phone: "+2348053344556",
    city: "Bodija",
    state: "Oyo",
    area: "Old Bodija",
    experienceLevel: "Sold a few personal items before",
    startingCapital: "₦0 (Zero Naira)",
    sellerAccess: ["Alumni / School Groups", "Estate / Residential WhatsApp"],
    itemCategories: ["Generators & Inverters", "Electronics & Gadgets"],
    primaryGoal: "Make my first ₦50,000–₦100,000 without capital risk",
    availableTime: "10-20 hours",
    consent: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 54).toISOString(),
    starterKitGenerated: true,
    ebookCtaViewed: true,
    ebookCtaClicked: false,
    status: "contacted",
    notes: "Focusing on university campus and Bodija estates.",
    tags: ["Oyo", "Ibadan"]
  }
];

function loadLeads(): Array<any> {
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const raw = fs.readFileSync(LEADS_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading leads file:", e);
  }
  return [...initialSeedLeads];
}

function saveLeads(leads: Array<any>) {
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing leads file:", e);
  }
}

let leadsDatabase: Array<any> = loadLeads();
if (!fs.existsSync(LEADS_FILE)) {
  saveLeads(leadsDatabase);
}
const analyticsLogs: Array<any> = [];

// Helper to initialize Gemini Client safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback high-quality Starter Kit generator in case Gemini API key is missing or fails
function generateFallbackKit(profile: any) {
  const name = profile.firstName || "Entrepreneur";
  const city = profile.city || "Lagos";
  const state = profile.state || "Lagos";
  const items = profile.itemCategories?.length
    ? profile.itemCategories.join(", ")
    : "Used Household Goods";
  const primaryCategory = profile.itemCategories?.[0] || "Household Items";

  return {
    businessIdentity: {
      businessNames: [
        { name: `${name}'s Resale Connect`, positioning: "Connecting quick sellers with verified buyers in " + city + "." },
        { name: `${city} Declutter Hub`, positioning: "Turning unused household items into instant cash without hassle." },
        { name: "Zero-Capital Resale Agent", positioning: "Middleman service for quality pre-owned goods." },
        { name: `${state} Home Clearance`, positioning: "Helping households clear space and monetize gently used items." },
        { name: "Smart Value Deals", positioning: "Curated pre-owned electronics, furniture, and home appliances." }
      ],
      recommendedName: `${name}'s Resale Connect`,
      businessPositioning: "Helping busy families and professionals sell unused household items quickly to verified local buyers.",
      whatsappBio: `📦 Verified Declutter Agent in ${city} | Helping you turn unused ${items} into cash. DM to sell or browse deals!`
    },
    sellerOutreach: {
      personalContact: `Hi! 👋 I'm starting a declutter assist service in ${city}. If you or anyone you know has unused furniture, appliances, or gadgets sitting around that you'd like to turn into cash without stress, let me know! I handle the listing, buyer messages, and negotiations for a small commission.`,
      communityGroup: `Good day everyone! 🌟 If you have gently used household items (${items}) taking up space at home and you'd like to sell them safely, I can help you list and connect with ready buyers. You set your minimum price, and I handle the rest. DM me if interested!`,
      referralMessage: `Hey! I help people sell unused quality household goods around ${city} hassle-free. If you know anyone relocating, upgrading, or clearing out space who needs help getting buyers quickly, please introduce us! I'll take good care of them.`
    },
    listingTemplate: `📌 [ITEM NAME] - EXCELLENT CONDITION\n\n• Condition: Gently used / [1-10 rating]\n• Reason for Selling: [Relocating / Upgrade / Extra item]\n• Location: ${city}, ${state}\n• Price: ₦[Asking Price] (Negotiable)\n• Pickup/Delivery: Pickup at ${city} or local dispatch delivery\n• Key Features: Clean, fully functional, well maintained.\n• Flaws: Minor cosmetic wear (see photos).\n\n💬 DM now or WhatsApp [YOUR PHONE] for quick inspection/video proof!`,
    exampleListing: `📌 LG 250L DOUBLE DOOR REFRIGERATOR - VERY CLEAN\n\n• Condition: 8.5/10 (Cooling perfectly)\n• Age: 1.5 years\n• Location: ${city}, ${state}\n• Price: ₦145,000 (Slightly negotiable)\n• Pickup: Self pickup or arranged rider delivery at buyer's cost\n• Flaws: Tiny scratch on left side panel, does not affect performance.\n\n💬 Send DM to reserve or request live video proof!`,
    commissionGuide: {
      recommendedModel: "Percentage Commission (10% - 20%)",
      explanation: "Best for individual items like electronics, generators, or furniture. For high-value items (over ₦100,000), 10–15% is standard. For smaller items under ₦30,000, 15–20% or a flat fee (e.g. ₦3,000–₦5,000) compensates your effort best.",
      startingFramework: "Example: If a seller wants ₦80,000 for a TV and you agree on a 15% commission (₦12,000), you list at ₦95,000. When sold at ₦95,000, the seller gets ₦80,000, you keep your ₦12,000 commission, and leftover buffer covers negotiation room.",
      importantTerms: [
        "Your agreed commission percentage or flat fee in writing (WhatsApp chat)",
        "Seller's absolute price floor (minimum acceptable payout)",
        "Who covers transport or delivery (usually the buyer or seller-paid dispatch)",
        "Exact condition inspection / confirmation of defects before posting",
        "Payout rule: You receive buyer funds or deduct commission immediately upon successful deal handover"
      ]
    },
    sevenDayPlan: [
      {
        day: 1,
        title: "Brand & WhatsApp Business Setup",
        objective: "Establish a trustworthy digital storefront in 30 minutes.",
        actions: [
          `Set your WhatsApp Business name to "${name}'s Resale Connect".`,
          `Paste your custom WhatsApp bio into your profile settings.`,
          "Create a catalog label: 'Available Items' and 'Recently Sold'."
        ]
      },
      {
        day: 2,
        title: "Warm Network Outreach",
        objective: "Identify your first 3 potential sellers from existing contacts.",
        actions: [
          "Send the Personal Contact Message to 5 close friends or family members.",
          "Post a simple WhatsApp status asking: 'Who has unused electronics or furniture taking up space at home?'",
          "Note down interested responses in your Prospect List."
        ]
      },
      {
        day: 3,
        title: "Community Group Entry",
        objective: "Tap into local community, estate, or alumni networks.",
        actions: [
          "Post the Community Group Message in 2 estate/church/alumni WhatsApp or Facebook groups.",
          "Politely message group admins if required to gain approval.",
          "Follow up individually with anyone who likes or comments."
        ]
      },
      {
        day: 4,
        title: "First Item Intake",
        objective: "Secure your first item and execute the Intake Checklist.",
        actions: [
          "Ask seller for 5 clear photos (front, back, tags, and any flaws) or record a 15-second video.",
          "Agree on seller's price floor and your commission in writing on WhatsApp.",
          "Confirm exact item location and pickup inspection arrangements."
        ]
      },
      {
        day: 5,
        title: "Marketplace Listing & Broadcast",
        objective: "Publish your first item across high-traffic buyer channels.",
        actions: [
          "Fill out your First Listing Template with the item details.",
          "Post on Jiji.ng, Facebook Marketplace, and local Facebook buy-sell groups.",
          "Post 3 clear photos to your WhatsApp Status with price and location."
        ]
      },
      {
        day: 6,
        title: "Buyer Communication & Negotiation",
        objective: "Handle buyer inquiries promptly and filter serious buyers.",
        actions: [
          "Reply to buyer messages within 15 minutes.",
          "Use the price floor agreement: never accept offers below seller's minimum.",
          "Confirm buyer's location and inspection timeframe before locking the deal."
        ]
      },
      {
        day: 7,
        title: "Handover, Payout & Referral Request",
        objective: "Complete the transaction safely and secure testimonials.",
        actions: [
          "Verify payment before releasing item or instruct buyer to pay upon physical inspection.",
          "Deduct your agreed commission and transfer the seller's share immediately.",
          "Ask the seller for a 1-sentence WhatsApp review and 1 referral."
        ]
      }
    ],
    prospectIdeas: [
      "Friend who upgraded their smartphone or TV recently",
      "Family member with extra chairs, tables, or home decor taking up space",
      "Neighbour or estate member who is relocating or changing apartments",
      "Colleague who bought a new generator or inverter system",
      "Church/Mosque member who runs a household or shop makeover",
      "School/Alumni group contact clearing out appliances before moving",
      "Local artisan/technician who knows people selling used gadgets",
      "Social media friend posting about decluttering or spring cleaning",
      "Compound/building caretaker who knows tenants moving out",
      "Previous buyer asking if you have other quality used household items"
    ],
    firstSaleChecklist: {
      intake: [
        "Confirm item details, brand, model & approximate age",
        "Inspect photos/videos for defects, scratches, or missing parts",
        "Agree on seller's price floor (minimum acceptable payout)",
        "Agree on commission percentage/fee in WhatsApp writing",
        "Confirm pickup location & seller availability for inspection"
      ],
      list: [
        "Draft honest listing using the First Listing Template",
        "Upload high-brightness, unedited real photos",
        "Post to Jiji.ng, Facebook Marketplace, and WhatsApp Status",
        "Include location, delivery terms, and clear call-to-action"
      ],
      negotiate: [
        "Respond to buyer inquiries within 15 minutes",
        "Answer questions honestly regarding item condition and flaws",
        "Stay above agreed seller price floor + commission",
        "Lock in buyer's inspection or delivery commitment time"
      ],
      handover: [
        "Verify full payment in account or confirm cash on physical inspection",
        "Ensure buyer inspects item before departure",
        "Deduct your agreed commission immediately",
        "Transfer net proceeds to seller without delay",
        "Request a review and ask for referral contacts"
      ]
    },
    aiPrompts: [
      {
        title: "Listing Writer Prompt",
        prompt: `Act as a professional copywriter for used items in Nigeria. Write a short, persuasive, and honest marketplace listing for a used [INSERT ITEM NAME, e.g., 32-inch Samsung TV] located in [INSERT CITY]. The item is [INSERT CONDITION, e.g., 2 years old, perfect working condition, minor base scratch]. Include price ₦[INSERT PRICE], pickup/delivery options, and a clear WhatsApp CTA.`,
        explanation: "Use this prompt with Gemini or Claude whenever a seller gives you an item to list."
      },
      {
        title: "Photo Enhancement Prompt",
        prompt: `Describe step-by-step how I can clean up and improve the lighting/background of a photo of a used [INSERT ITEM] using free tools like Canva or phone settings, without altering or hiding actual item defects.`,
        explanation: "Better lit photos get 3x more buyer clicks on Jiji and Facebook Marketplace."
      },
      {
        title: "Market Price Research Prompt",
        prompt: `Give me a realistic resale price range for a used [INSERT ITEM NAME & MODEL, e.g., Thermocool 3.5kVA Generator] in Nigeria, considering brand, condition, and age. Treat this only as a starting estimate and tell me what factors I should verify against live Jiji/Facebook Marketplace listings.`,
        explanation: "Always cross-check AI estimates against active live listings before setting prices with your seller."
      }
    ],
    nextMove: {
      heading: "YOUR NEXT MOVE",
      description: `${name}, don't spend the next week over-analysing this. Your first objective is simple: Find ONE person with ONE item they want to sell. Send the seller message above right now.`,
      actionMission: "Contact 3 potential sellers today."
    }
  };
}

// API Endpoint: Generate Starter Kit with Gemini
app.post("/api/generate-starter-kit", async (req, res) => {
  try {
    const profile = req.body;
    if (!profile || !profile.firstName) {
      return res.status(400).json({ error: "Missing required user profile information." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      console.log("No GEMINI_API_KEY found or default placeholder used. Returning high-quality personalized fallback kit.");
      return res.json(generateFallbackKit(profile));
    }

    const systemInstruction = `You are a practical, highly encouraging Nigerian side-hustle launch strategist.
Generate a beginner-friendly, realistic Zero-Naira Declutter Hustle Starter Kit based on the user's profile.
Follow the methodology of "The Zero-Naira Declutter Hustle":
- The user is a zero-inventory middleman connecting sellers of used household items with buyers.
- Core sale cycle: Intake -> List -> Negotiate -> Handover.
- Language style: Practical, encouraging, direct, trustworthy, beginner-friendly, authentic Nigerian context (e.g. Lagos, Abuja, Port Harcourt, Jiji, WhatsApp Status, Facebook Marketplace).
- NO unrealistic claims or guaranteed income promises. Use realistic, cautious, empowering terminology.
- Output strictly valid JSON matching the specified schema.`;

    const prompt = `User Profile:
- First Name: ${profile.firstName}
- Location: ${profile.city}, ${profile.state} ${profile.area ? `(${profile.area})` : ''}
- Experience Level: ${profile.experienceLevel}
- Starting Capital Comfort: ${profile.startingCapital}
- Seller Access Networks: ${profile.sellerAccess?.join(', ') || 'General contacts'}
- Preferred Item Categories: ${profile.itemCategories?.join(', ') || 'General household items'} ${profile.customCategory ? `(${profile.customCategory})` : ''}
- Primary Goal: ${profile.primaryGoal}
- Time Commitment: ${profile.availableTime} per week

Generate the complete Starter Kit JSON for ${profile.firstName}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            businessIdentity: {
              type: Type.OBJECT,
              properties: {
                businessNames: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      positioning: { type: Type.STRING }
                    },
                    required: ["name", "positioning"]
                  }
                },
                recommendedName: { type: Type.STRING },
                businessPositioning: { type: Type.STRING },
                whatsappBio: { type: Type.STRING }
              },
              required: ["businessNames", "recommendedName", "businessPositioning", "whatsappBio"]
            },
            sellerOutreach: {
              type: Type.OBJECT,
              properties: {
                personalContact: { type: Type.STRING },
                communityGroup: { type: Type.STRING },
                referralMessage: { type: Type.STRING }
              },
              required: ["personalContact", "communityGroup", "referralMessage"]
            },
            listingTemplate: { type: Type.STRING },
            exampleListing: { type: Type.STRING },
            commissionGuide: {
              type: Type.OBJECT,
              properties: {
                recommendedModel: { type: Type.STRING },
                explanation: { type: Type.STRING },
                startingFramework: { type: Type.STRING },
                importantTerms: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["recommendedModel", "explanation", "startingFramework", "importantTerms"]
            },
            sevenDayPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  objective: { type: Type.STRING },
                  actions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["day", "title", "objective", "actions"]
              }
            },
            prospectIdeas: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            firstSaleChecklist: {
              type: Type.OBJECT,
              properties: {
                intake: { type: Type.ARRAY, items: { type: Type.STRING } },
                list: { type: Type.ARRAY, items: { type: Type.STRING } },
                negotiate: { type: Type.ARRAY, items: { type: Type.STRING } },
                handover: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["intake", "list", "negotiate", "handover"]
            },
            aiPrompts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  prompt: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ["title", "prompt", "explanation"]
              }
            },
            nextMove: {
              type: Type.OBJECT,
              properties: {
                heading: { type: Type.STRING },
                description: { type: Type.STRING },
                actionMission: { type: Type.STRING }
              },
              required: ["heading", "description", "actionMission"]
            }
          },
          required: [
            "businessIdentity",
            "sellerOutreach",
            "listingTemplate",
            "exampleListing",
            "commissionGuide",
            "sevenDayPlan",
            "prospectIdeas",
            "firstSaleChecklist",
            "aiPrompts",
            "nextMove"
          ]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response received from Gemini model.");
    }

    const starterKit = JSON.parse(responseText.trim());
    return res.json(starterKit);
  } catch (err: any) {
    console.error("Gemini Starter Kit Generation Error:", err?.message || err);
    // Graceful fallback so user experience is never broken
    return res.json(generateFallbackKit(req.body || {}));
  }
});

// API Endpoint: Secure Admin PIN Verification (Server-Side Only)
app.post("/api/admin/verify-pin", (req, res) => {
  try {
    const { pin } = req.body || {};
    const configuredPin = (process.env.ADMIN_PIN || "0810").trim();
    
    if (typeof pin === "string" && pin.trim() === configuredPin) {
      const token = crypto.randomBytes(32).toString("hex");
      activeAdminTokens.add(token);
      return res.json({ success: true, token });
    }
    
    return res.status(401).json({ success: false, error: "Incorrect 4-digit PIN code." });
  } catch (err: any) {
    console.error("Admin verify-pin error:", err);
    return res.status(500).json({ success: false, error: "Verification server error." });
  }
});

// API Endpoint: Check Active Admin Session Token
app.get("/api/admin/check-session", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.replace(/^Bearer\s+/i, "") : "";
    if (token && activeAdminTokens.has(token)) {
      return res.json({ valid: true });
    }
    return res.status(401).json({ valid: false });
  } catch (err: any) {
    return res.status(401).json({ valid: false });
  }
});

// API Endpoint: Revoke Admin Session Token (Logout / Lock)
app.post("/api/admin/logout", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.replace(/^Bearer\s+/i, "") : "";
    if (token) {
      activeAdminTokens.delete(token);
    }
    return res.json({ success: true });
  } catch (err: any) {
    return res.json({ success: true });
  }
});

// API Endpoint: Get All Leads (with optional search, filter & sort)
app.get("/api/leads", (req, res) => {
  try {
    const { search, status, category, state } = req.query;
    let filtered = [...leadsDatabase];

    if (search && typeof search === "string" && search.trim()) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (l) =>
          (l?.firstName && l.firstName.toLowerCase().includes(q)) ||
          (l?.email && l.email.toLowerCase().includes(q)) ||
          (l?.phone && l.phone.toLowerCase().includes(q)) ||
          (l?.city && l.city.toLowerCase().includes(q)) ||
          (l?.state && l.state.toLowerCase().includes(q)) ||
          (l?.notes && l.notes.toLowerCase().includes(q))
      );
    }

    if (status && typeof status === "string" && status !== "all") {
      filtered = filtered.filter((l) => (l?.status || "new") === status);
    }

    if (category && typeof category === "string" && category !== "all") {
      filtered = filtered.filter((l) => {
        const cats = Array.isArray(l?.itemCategories) ? l.itemCategories : [];
        return cats.includes(category);
      });
    }

    if (state && typeof state === "string" && state !== "all") {
      filtered = filtered.filter((l) => l?.state && l.state.toLowerCase() === state.toLowerCase());
    }

    return res.json({
      total: filtered.length,
      leads: filtered
    });
  } catch (err: any) {
    console.error("GET /api/leads error:", err);
    return res.status(200).json({ total: leadsDatabase.length, leads: leadsDatabase });
  }
});

// API Endpoint: Get Single Lead Details
app.get("/api/leads/:id", (req, res) => {
  try {
    const { id } = req.params;
    const lead = leadsDatabase.find((l) => l.id === id);
    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }
    return res.json({ lead });
  } catch (err: any) {
    return res.status(500).json({ error: "Error fetching lead" });
  }
});

// API Endpoint: Submit Lead Data
app.post("/api/leads", (req, res) => {
  try {
    const lead = req.body;
    if (!lead || !lead.firstName) {
      return res.status(400).json({ error: "Missing required lead fields (firstName)." });
    }

    const leadEmail = lead.email || "pending@contact.com";
    const leadPhone = lead.phone || "";

    // Check if lead with this email or ID already exists
    const existingIndex = leadsDatabase.findIndex(
      (l) => (lead.id && l.id === lead.id) || (lead.email && l.email && l.email.toLowerCase() === leadEmail.toLowerCase())
    );

    let leadRecord: any;
    if (existingIndex !== -1) {
      leadRecord = {
        ...leadsDatabase[existingIndex],
        ...lead,
        starterKitGenerated: true,
        updatedAt: new Date().toISOString()
      };
      leadsDatabase[existingIndex] = leadRecord;
    } else {
      leadRecord = {
        id: lead.id || `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        createdAt: lead.createdAt || new Date().toISOString(),
        starterKitGenerated: true,
        ebookCtaViewed: Boolean(lead.ebookCtaViewed),
        ebookCtaClicked: Boolean(lead.ebookCtaClicked),
        status: lead.status || "new",
        notes: lead.notes || "",
        tags: [lead.city, lead.experienceLevel || "New"].filter(Boolean),
        ...lead,
        email: leadEmail,
        phone: leadPhone,
      };
      leadsDatabase.unshift(leadRecord);
    }

    saveLeads(leadsDatabase);
    return res.status(201).json({ success: true, lead: leadRecord });
  } catch (err: any) {
    console.error("Save Lead Error:", err);
    return res.status(500).json({ error: "Failed to save lead record." });
  }
});

// API Endpoint: Sync Leads from client storage
app.post("/api/leads/sync", (req, res) => {
  try {
    const clientLeads: Array<any> = req.body?.leads || [];
    let addedCount = 0;

    for (const cLead of clientLeads) {
      if (!cLead || !cLead.firstName) continue;
      const exists = leadsDatabase.some(
        (l) => (l.id && l.id === cLead.id) || (l.email && cLead.email && l.email.toLowerCase() === cLead.email.toLowerCase())
      );
      if (!exists) {
        const newLead = {
          id: cLead.id || `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          createdAt: cLead.createdAt || new Date().toISOString(),
          starterKitGenerated: true,
          ebookCtaViewed: Boolean(cLead.ebookCtaViewed),
          ebookCtaClicked: Boolean(cLead.ebookCtaClicked),
          status: cLead.status || "new",
          notes: cLead.notes || "",
          tags: [cLead.city, cLead.experienceLevel || "New"].filter(Boolean),
          ...cLead
        };
        leadsDatabase.unshift(newLead);
        addedCount++;
      }
    }

    if (addedCount > 0) {
      saveLeads(leadsDatabase);
    }

    return res.json({ success: true, added: addedCount, total: leadsDatabase.length });
  } catch (err: any) {
    return res.status(500).json({ error: "Sync failed" });
  }
});

// API Endpoint: Update Lead Record (status, notes, tags, details)
app.patch("/api/leads/:id", (req, res) => {
  try {
    const { id } = req.params;
    const lead = leadsDatabase.find((l) => l.id === id);
    if (lead) {
      Object.assign(lead, req.body);
      saveLeads(leadsDatabase);
      return res.json({ success: true, lead });
    }
    return res.status(404).json({ error: "Lead not found" });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to update lead" });
  }
});

// API Endpoint: Delete Lead Record
app.delete("/api/leads/:id", (req, res) => {
  try {
    const { id } = req.params;
    const index = leadsDatabase.findIndex((l) => l.id === id);
    if (index !== -1) {
      leadsDatabase.splice(index, 1);
      saveLeads(leadsDatabase);
      return res.json({ success: true, message: "Lead deleted successfully" });
    }
    return res.status(404).json({ error: "Lead not found" });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to delete lead" });
  }
});

// API Endpoint: Seed / Reset Demo Leads
app.post("/api/leads/seed", (req, res) => {
  try {
    leadsDatabase.length = 0;
    leadsDatabase.push(...initialSeedLeads);
    saveLeads(leadsDatabase);
    return res.json({ success: true, total: leadsDatabase.length, message: "Sample leads seeded successfully." });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to seed leads" });
  }
});

// API Endpoint: Export Leads as CSV
app.get("/api/leads/export/csv", (req, res) => {
  try {
    const headers = [
      "ID",
      "Date",
      "First Name",
      "Email",
      "Phone",
      "City",
      "State",
      "Area",
      "Experience Level",
      "Starting Capital",
      "Categories",
      "Seller Networks",
      "Primary Goal",
      "Available Time",
      "Status",
      "Ebook Clicked",
      "Notes"
    ];

    const rows = leadsDatabase.map((l) => {
      const cats = Array.isArray(l?.itemCategories) ? l.itemCategories.join("; ") : (l?.itemCategories || "");
      const sellers = Array.isArray(l?.sellerAccess) ? l.sellerAccess.join("; ") : (l?.sellerAccess || "");
      let dateStr = "";
      try {
        dateStr = l?.createdAt ? `${new Date(l.createdAt).toLocaleDateString()} ${new Date(l.createdAt).toLocaleTimeString()}` : "";
      } catch (e) {
        dateStr = l?.createdAt || "";
      }

      return [
        `"${l?.id || ""}"`,
        `"${dateStr}"`,
        `"${(l?.firstName || "").replace(/"/g, '""')}"`,
        `"${(l?.email || "").replace(/"/g, '""')}"`,
        `"${(l?.phone || "").replace(/"/g, '""')}"`,
        `"${(l?.city || "").replace(/"/g, '""')}"`,
        `"${(l?.state || "").replace(/"/g, '""')}"`,
        `"${(l?.area || "").replace(/"/g, '""')}"`,
        `"${(l?.experienceLevel || "").replace(/"/g, '""')}"`,
        `"${(l?.startingCapital || "").replace(/"/g, '""')}"`,
        `"${cats.replace(/"/g, '""')}"`,
        `"${sellers.replace(/"/g, '""')}"`,
        `"${(l?.primaryGoal || "").replace(/"/g, '""')}"`,
        `"${(l?.availableTime || "").replace(/"/g, '""')}"`,
        `"${(l?.status || "new").replace(/"/g, '""')}"`,
        `"${l?.ebookCtaClicked ? "Yes" : "No"}"`,
        `"${(l?.notes || "").replace(/"/g, '""')}"`
      ];
    });

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="zero-naira-leads.csv"');
    return res.status(200).send(csvContent);
  } catch (err: any) {
    console.error("CSV error:", err);
    return res.status(500).json({ error: "Failed to generate CSV export" });
  }
});

// API Endpoint: Get Admin Lead Stats & Analytics
app.get("/api/leads/stats", (req, res) => {
  try {
    const totalLeads = leadsDatabase.length;
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfWeek = startOfDay - now.getDay() * 24 * 60 * 60 * 1000;

    const leadsToday = leadsDatabase.filter((l) => {
      if (!l?.createdAt) return false;
      const t = new Date(l.createdAt).getTime();
      return !isNaN(t) && t >= startOfDay;
    }).length;

    const leadsThisWeek = leadsDatabase.filter((l) => {
      if (!l?.createdAt) return false;
      const t = new Date(l.createdAt).getTime();
      return !isNaN(t) && t >= startOfWeek;
    }).length;

    const kitsGenerated = leadsDatabase.filter((l) => Boolean(l?.starterKitGenerated)).length;
    const ebookCtaClicks = leadsDatabase.filter((l) => Boolean(l?.ebookCtaClicked)).length;

    // Aggregate item categories safely
    const catMap: Record<string, number> = {};
    leadsDatabase.forEach((l) => {
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

    // Aggregate goals safely
    const goalMap: Record<string, number> = {};
    leadsDatabase.forEach((l) => {
      if (l?.primaryGoal && typeof l.primaryGoal === 'string') {
        goalMap[l.primaryGoal] = (goalMap[l.primaryGoal] || 0) + 1;
      }
    });
    const topGoals = Object.entries(goalMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Experience level breakdown safely
    const expMap: Record<string, number> = {};
    leadsDatabase.forEach((l) => {
      if (l?.experienceLevel && typeof l.experienceLevel === 'string') {
        expMap[l.experienceLevel] = (expMap[l.experienceLevel] || 0) + 1;
      }
    });
    const experienceBreakdown = Object.entries(expMap).map(([name, count]) => ({ name, count }));

    // Location distribution (Cities) safely
    const locMap: Record<string, number> = {};
    leadsDatabase.forEach((l) => {
      if (l?.city && typeof l.city === 'string') {
        locMap[l.city] = (locMap[l.city] || 0) + 1;
      }
    });
    const locationDistribution = Object.entries(locMap)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count);

    // State distribution safely
    const stateMap: Record<string, number> = {};
    leadsDatabase.forEach((l) => {
      if (l?.state && typeof l.state === 'string') {
        stateMap[l.state] = (stateMap[l.state] || 0) + 1;
      }
    });
    const stateDistribution = Object.entries(stateMap)
      .map(([state, count]) => ({ state, count }))
      .sort((a, b) => b.count - a.count);

    // Status breakdown safely
    const statusMap: Record<string, number> = {
      new: 0,
      contacted: 0,
      interested: 0,
      converted_ebook: 0,
      archived: 0
    };
    leadsDatabase.forEach((l) => {
      const s = l?.status || "new";
      statusMap[s] = (statusMap[s] || 0) + 1;
    });
    const statusBreakdown = Object.entries(statusMap).map(([status, count]) => ({ status, count }));

    // Daily Trend for past 7 days safely
    const dailyTrend: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;
      const count = leadsDatabase.filter((l) => {
        if (!l?.createdAt) return false;
        const t = new Date(l.createdAt).getTime();
        return !isNaN(t) && t >= dayStart && t < dayEnd;
      }).length;
      dailyTrend.push({ date: dateStr, count });
    }

    return res.json({
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
      recentLeads: leadsDatabase.slice(0, 100)
    });
  } catch (err: any) {
    console.error("Stats calculation error:", err);
    return res.status(200).json({
      totalLeads: leadsDatabase.length,
      leadsToday: 0,
      leadsThisWeek: 0,
      kitsGenerated: 0,
      ebookCtaClicks: 0,
      topCategories: [],
      topGoals: [],
      experienceBreakdown: [],
      locationDistribution: [],
      stateDistribution: [],
      statusBreakdown: [],
      dailyTrend: [],
      recentLeads: leadsDatabase.slice(0, 100)
    });
  }
});

// API Endpoint: Track Analytics Event
app.post("/api/analytics", (req, res) => {
  const event = req.body;
  if (event && event.event) {
    analyticsLogs.push({ ...event, timestamp: new Date().toISOString() });
  }
  return res.json({ success: true });
});

// API Endpoint: Config
app.get("/api/config", (req, res) => {
  return res.json({
    ebookPurchaseUrl: process.env.EBOOK_PURCHASE_URL || "https://selar.co/zero-naira-declutter-hustle",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY")
  });
});

// Vite / Static setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
