import { UserProfile, StarterKit } from '../types';

export function generateClientStarterKit(profile: UserProfile): StarterKit {
  const name = profile.firstName?.trim() || 'Entrepreneur';
  const city = profile.city?.trim() || 'Lagos';
  const state = profile.state?.trim() || 'Lagos';
  const area = profile.area?.trim() ? ` (${profile.area.trim()})` : '';
  const items = profile.itemCategories?.length
    ? profile.itemCategories.join(', ')
    : 'Used Household Goods';
  const primaryCategory = profile.itemCategories?.[0] || 'Household Items';

  return {
    businessIdentity: {
      businessNames: [
        { name: `${name}'s Resale Connect`, positioning: `Connecting quick sellers with verified buyers in ${city}.` },
        { name: `${city} Declutter Hub`, positioning: 'Turning unused household items into instant cash without hassle.' },
        { name: `${name} Resale Concierge`, positioning: 'Middleman service for quality pre-owned goods.' },
        { name: `${state} Home Clearance`, positioning: 'Helping households clear space and monetize gently used items.' },
        { name: 'Smart Value Deals', positioning: 'Curated pre-owned electronics, furniture, and home appliances.' }
      ],
      recommendedName: `${name}'s Resale Connect`,
      businessPositioning: `Helping busy families and professionals in ${city}${area} sell unused household items quickly to verified local buyers.`,
      whatsappBio: `📦 Verified Declutter Agent in ${city} | Helping you turn unused ${items} into cash without stress. DM to sell or browse deals!`
    },
    sellerOutreach: {
      personalContact: `Hi! 👋 I'm starting a declutter assist service in ${city}. If you or anyone you know has unused furniture, appliances, or gadgets sitting around that you'd like to turn into cash without stress, let me know! I handle the listing, buyer messages, and negotiations for a small commission.`,
      communityGroup: `Good day everyone! 🌟 If you have gently used household items (${items}) taking up space at home and you'd like to sell them safely, I can help you list and connect with ready buyers. You set your minimum price, and I handle the rest. DM me if interested!`,
      referralMessage: `Hey! I help people sell unused quality household goods around ${city} hassle-free. If you know anyone relocating, upgrading, or clearing out space who needs help getting buyers quickly, please introduce us! I'll take good care of them.`
    },
    listingTemplate: `📌 [ITEM NAME] - EXCELLENT CONDITION\n\n• Condition: Gently used / [1-10 rating]\n• Reason for Selling: [Relocating / Upgrade / Extra item]\n• Location: ${city}, ${state}${area}\n• Price: ₦[Asking Price] (Negotiable)\n• Pickup/Delivery: Pickup at ${city} or local dispatch delivery\n• Key Features: Clean, fully functional, well maintained.\n• Flaws: Minor cosmetic wear (see photos).\n\n💬 DM now or WhatsApp [YOUR PHONE] for quick inspection/video proof!`,
    exampleListing: `📌 LG 250L DOUBLE DOOR REFRIGERATOR - VERY CLEAN\n\n• Condition: 8.5/10 (Cooling perfectly)\n• Age: 1.5 years\n• Location: ${city}, ${state}${area}\n• Price: ₦145,000 (Slightly negotiable)\n• Pickup: Self pickup or arranged rider delivery at buyer's cost\n• Flaws: Tiny scratch on left side panel, does not affect performance.\n\n💬 Send DM to reserve or request live video proof!`,
    commissionGuide: {
      recommendedModel: 'Percentage Commission (10% - 20%)',
      explanation: `Best for individual items like ${primaryCategory}. For high-value items (over ₦100,000), 10–15% is standard. For items under ₦30,000, 15–20% or a flat fee (e.g. ₦3,000–₦5,000) compensates your effort best.`,
      startingFramework: 'Example: If a seller wants ₦80,000 for a TV and you agree on a 15% commission (₦12,000), you list at ₦95,000. When sold at ₦95,000, the seller gets ₦80,000, you keep your ₦12,000 commission, and leftover buffer covers negotiation room.',
      importantTerms: [
        'Your agreed commission percentage or flat fee in writing (WhatsApp chat)',
        "Seller's absolute price floor (minimum acceptable payout)",
        'Who covers transport or delivery (usually the buyer or seller-paid dispatch)',
        'Exact condition inspection / confirmation of defects before posting',
        'Payout rule: You receive buyer funds or deduct commission immediately upon successful deal handover'
      ]
    },
    sevenDayPlan: [
      {
        day: 1,
        title: 'Brand & WhatsApp Business Setup',
        objective: 'Establish a trustworthy digital storefront in 30 minutes.',
        actions: [
          `Set your WhatsApp Business name to "${name}'s Resale Connect".`,
          'Paste your custom WhatsApp bio into your profile settings.',
          "Create a catalog label: 'Available Items' and 'Recently Sold'."
        ]
      },
      {
        day: 2,
        title: 'Warm Network Outreach',
        objective: 'Identify your first 3 potential sellers from existing contacts.',
        actions: [
          'Send the Personal Contact Message to 5 close friends or family members.',
          `Post a simple WhatsApp status asking: "Who has unused ${primaryCategory.toLowerCase()} taking up space at home?"`,
          'Note down interested responses in your Prospect List.'
        ]
      },
      {
        day: 3,
        title: 'Community Group Entry',
        objective: 'Tap into local community, estate, or alumni networks.',
        actions: [
          'Post the Community Group Message in 2 estate/church/alumni WhatsApp or Facebook groups.',
          'Politely message group admins if required to gain approval.',
          'Follow up individually with anyone who likes or comments.'
        ]
      },
      {
        day: 4,
        title: 'First Item Intake',
        objective: 'Secure your first item and execute the Intake Checklist.',
        actions: [
          'Ask seller for 5 clear photos (front, back, tags, and any flaws) or record a 15-second video.',
          "Agree on seller's price floor and your commission in writing on WhatsApp.",
          'Confirm exact item location and pickup inspection arrangements.'
        ]
      },
      {
        day: 5,
        title: 'Marketplace Listing & Broadcast',
        objective: 'Publish your first item across high-traffic buyer channels.',
        actions: [
          'Fill out your First Listing Template with the item details.',
          'Post on Jiji.ng, Facebook Marketplace, and local Facebook buy-sell groups.',
          'Post 3 clear photos to your WhatsApp Status with price and location.'
        ]
      },
      {
        day: 6,
        title: 'Buyer Communication & Negotiation',
        objective: 'Handle buyer inquiries promptly and filter serious buyers.',
        actions: [
          'Reply to buyer messages within 15 minutes.',
          "Use the price floor agreement: never accept offers below seller's minimum.",
          "Confirm buyer's location and inspection timeframe before locking the deal."
        ]
      },
      {
        day: 7,
        title: 'Handover, Payout & Referral Request',
        objective: 'Complete the transaction safely and secure testimonials.',
        actions: [
          'Verify payment before releasing item or instruct buyer to pay upon physical inspection.',
          "Deduct your agreed commission and transfer the seller's share immediately.",
          'Ask the seller for a 1-sentence WhatsApp review and 1 referral.'
        ]
      }
    ],
    prospectIdeas: [
      'Friend who upgraded their smartphone, laptop, or TV recently',
      'Family member with extra chairs, tables, or home decor taking up space',
      `Neighbour or estate member in ${city} who is relocating or changing apartments`,
      'Colleague who bought a new generator or inverter system',
      'Church/Mosque member who runs a household or shop makeover',
      'School/Alumni group contact clearing out appliances before moving',
      'Local artisan/technician who knows people selling used gadgets',
      'Social media friend posting about decluttering or spring cleaning',
      'Compound/building caretaker who knows tenants moving out',
      'Previous buyer asking if you have other quality used household items'
    ],
    firstSaleChecklist: {
      intake: [
        'Confirm item details, brand, model & approximate age',
        'Inspect photos/videos for defects, scratches, or missing parts',
        "Agree on seller's price floor (minimum acceptable payout)",
        'Agree on commission percentage/fee in WhatsApp writing',
        'Confirm pickup location & seller availability for inspection'
      ],
      list: [
        'Draft honest listing using the First Listing Template',
        'Upload high-brightness, unedited real photos',
        'Post to Jiji.ng, Facebook Marketplace, and WhatsApp Status',
        'Include location, delivery terms, and clear call-to-action'
      ],
      negotiate: [
        'Respond to buyer inquiries within 15 minutes',
        'Answer questions honestly regarding item condition and flaws',
        'Stay above agreed seller price floor + commission',
        "Lock in buyer's inspection or delivery commitment time"
      ],
      handover: [
        'Verify full payment in account or confirm cash on physical inspection',
        'Ensure buyer inspects item before departure',
        'Deduct your agreed commission immediately',
        'Transfer net proceeds to seller without delay',
        'Request a review and ask for referral contacts'
      ]
    },
    aiPrompts: [
      {
        title: 'Listing Writer Prompt',
        prompt: `Act as a professional copywriter for used items in Nigeria. Write a short, persuasive, and honest marketplace listing for a used [INSERT ITEM NAME, e.g., 32-inch Samsung TV] located in ${city}, ${state}. The item is [INSERT CONDITION, e.g., 2 years old, perfect working condition, minor base scratch]. Include price ₦[INSERT PRICE], pickup/delivery options, and a clear WhatsApp CTA.`,
        explanation: 'Use this prompt with Gemini or ChatGPT whenever a seller gives you an item to list.'
      },
      {
        title: 'Photo Enhancement Prompt',
        prompt: 'Describe step-by-step how I can clean up and improve the lighting/background of a photo of a used [INSERT ITEM] using free tools like Canva or phone settings, without altering or hiding actual item defects.',
        explanation: 'Better lit photos get 3x more buyer clicks on Jiji and Facebook Marketplace.'
      },
      {
        title: 'Market Price Research Prompt',
        prompt: `Give me a realistic resale price range for a used [INSERT ITEM NAME & MODEL, e.g., Thermocool 3.5kVA Generator] in ${city}, Nigeria, considering brand, condition, and age. Treat this only as a starting estimate and tell me what factors I should verify against live Jiji/Facebook Marketplace listings.`,
        explanation: 'Always cross-check estimates against active live listings before setting prices with your seller.'
      }
    ],
    nextMove: {
      heading: 'YOUR NEXT MOVE',
      description: `${name}, don't spend the next week over-analysing this. Your first objective is simple: Find ONE person with ONE item they want to sell. Send the seller outreach message above right now.`,
      actionMission: 'Contact 3 potential sellers today.'
    }
  };
}

export const generateStarterKitApi = async (profile: UserProfile): Promise<StarterKit> => {
  try {
    const response = await fetch('/api/generate-starter-kit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.businessIdentity) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Backend generator endpoint unreachable, generating personalized kit client-side:', err);
  }

  // Gracefully fallback to high-quality tailored client generation
  return generateClientStarterKit(profile);
};
