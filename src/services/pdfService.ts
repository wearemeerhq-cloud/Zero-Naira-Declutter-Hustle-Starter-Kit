import { jsPDF } from 'jspdf';
import { StarterKit, UserProfile } from '../types';

export const downloadStarterKitPDF = (profile: UserProfile, kit: StarterKit, ebookUrl: string) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const name = profile.firstName || 'Entrepreneur';
  const margin = 15;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  // Primary palette: Deep Slate (#0F172A), Teal (#0D9488), Gold (#D97706), Dark Grey (#334155)
  const setPrimaryColor = () => doc.setTextColor(15, 23, 42);
  const setTealColor = () => doc.setTextColor(13, 148, 136);
  const setGoldColor = () => doc.setTextColor(217, 119, 6);
  const setSecondaryColor = () => doc.setTextColor(51, 65, 85);

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > 280) {
      doc.addPage();
      y = 20;
    }
  };

  const addHeader = (title: string) => {
    checkPageBreak(15);
    doc.setFillColor(248, 250, 252); // soft off-white background block
    doc.rect(margin, y, contentWidth, 9, 'F');
    setTealColor();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(title.toUpperCase(), margin + 3, y + 6.5);
    y += 13;
  };

  // --- COVER / HEADER BANNER ---
  doc.setFillColor(15, 23, 42); // Deep charcoal
  doc.rect(0, 0, pageWidth, 42, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(`${name.toUpperCase()}'S ZERO-NAIRA HUSTLE STARTER KIT`, margin, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(251, 191, 36); // Warm gold text
  doc.text(`Personalized Launch Playbook | Location: ${profile.city}, ${profile.state}`, margin, 27);

  doc.setTextColor(203, 213, 225);
  doc.setFontSize(8);
  doc.text(`Based on "The Zero-Naira Declutter Hustle" Methodology | Generated for ${name}`, margin, 35);

  y = 50;

  // --- SECTION 1: HUSTLE IDENTITY ---
  addHeader('1. Your Hustle Identity & WhatsApp Profile');
  setPrimaryColor();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`Recommended Brand Name: ${kit.businessIdentity.recommendedName}`, margin, y);
  y += 6;

  setSecondaryColor();
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.text(`Positioning: "${kit.businessIdentity.businessPositioning}"`, margin, y);
  y += 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('WhatsApp Business Bio:', margin, y);
  y += 5;

  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 12, 'F');
  setPrimaryColor();
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const splitBio = doc.splitTextToSize(kit.businessIdentity.whatsappBio, contentWidth - 6);
  doc.text(splitBio, margin + 3, y + 5);
  y += 18;

  // --- SECTION 2: SELLER OUTREACH SCRIPTS ---
  addHeader('2. Seller Outreach Copy-Paste Messages');
  
  const scripts = [
    { label: 'A. Personal Contacts (Friends/Family)', text: kit.sellerOutreach.personalContact },
    { label: 'B. Estate / Community WhatsApp Groups', text: kit.sellerOutreach.communityGroup },
    { label: 'C. Referral Request Message', text: kit.sellerOutreach.referralMessage },
  ];

  scripts.forEach((s) => {
    checkPageBreak(22);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    setPrimaryColor();
    doc.text(s.label, margin, y);
    y += 5;

    const lines = doc.splitTextToSize(s.text, contentWidth - 6);
    const boxHeight = Math.max(12, lines.length * 4.5 + 4);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, boxHeight, 1.5, 1.5, 'FD');

    setSecondaryColor();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(lines, margin + 3, y + 4.5);
    y += boxHeight + 5;
  });

  // --- SECTION 3: LISTING TEMPLATE ---
  addHeader('3. Reusable Listing Framework & Example');
  checkPageBreak(30);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Your Custom Category Listing Example:', margin, y);
  y += 5;

  const listingLines = doc.splitTextToSize(kit.exampleListing, contentWidth - 6);
  const listHeight = listingLines.length * 4.5 + 4;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, listHeight, 1.5, 1.5, 'FD');

  setSecondaryColor();
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(listingLines, margin + 3, y + 4.5);
  y += listHeight + 8;

  // --- SECTION 4: COMMISSION GUIDE ---
  addHeader('4. Commission Model & Terms Framework');
  checkPageBreak(25);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  setPrimaryColor();
  doc.text(`Recommended Structure: ${kit.commissionGuide.recommendedModel}`, margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  setSecondaryColor();
  const commLines = doc.splitTextToSize(kit.commissionGuide.explanation, contentWidth);
  doc.text(commLines, margin, y);
  y += commLines.length * 4.5 + 4;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  setGoldColor();
  doc.text('Mandatory 5 Terms to Agree in Writing Before Listing:', margin, y);
  y += 5;

  kit.commissionGuide.importantTerms.forEach((term) => {
    checkPageBreak(6);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    setSecondaryColor();
    const termLines = doc.splitTextToSize(`• ${term}`, contentWidth - 5);
    doc.text(termLines, margin + 3, y);
    y += termLines.length * 4;
  });
  y += 4;

  // --- SECTION 5: 7-DAY ACTION PLAN ---
  addHeader('5. Personalized 7-Day Action Plan');
  kit.sevenDayPlan.forEach((plan) => {
    checkPageBreak(20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    setPrimaryColor();
    doc.text(`Day ${plan.day}: ${plan.title}`, margin, y);
    y += 4.5;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    setGoldColor();
    doc.text(`Objective: ${plan.objective}`, margin + 3, y);
    y += 4.5;

    plan.actions.forEach((act) => {
      checkPageBreak(5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      setSecondaryColor();
      const actLines = doc.splitTextToSize(`[ ] ${act}`, contentWidth - 8);
      doc.text(actLines, margin + 5, y);
      y += actLines.length * 4;
    });
    y += 3;
  });

  // --- SECTION 6: FIRST 10 PROSPECT TARGETS ---
  addHeader('6. First 10 Prospecting Target Categories');
  kit.prospectIdeas.forEach((idea, idx) => {
    checkPageBreak(5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    setSecondaryColor();
    const ideaLines = doc.splitTextToSize(`[ ] Prospect #${idx + 1}: ${idea}`, contentWidth - 5);
    doc.text(ideaLines, margin + 3, y);
    y += ideaLines.length * 4;
  });
  y += 4;

  // --- SECTION 7: FIRST-SALE CHECKLIST ---
  addHeader('7. Four-Step First Sale Checklist');
  const stages = [
    { name: 'STEP 1: INTAKE', items: kit.firstSaleChecklist.intake },
    { name: 'STEP 2: LIST', items: kit.firstSaleChecklist.list },
    { name: 'STEP 3: NEGOTIATE', items: kit.firstSaleChecklist.negotiate },
    { name: 'STEP 4: HANDOVER', items: kit.firstSaleChecklist.handover },
  ];

  stages.forEach((stg) => {
    checkPageBreak(12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    setPrimaryColor();
    doc.text(stg.name, margin, y);
    y += 4.5;

    stg.items.forEach((item) => {
      checkPageBreak(5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      setSecondaryColor();
      const itemLines = doc.splitTextToSize(`□ ${item}`, contentWidth - 6);
      doc.text(itemLines, margin + 3, y);
      y += itemLines.length * 4;
    });
    y += 2;
  });
  y += 4;

  // --- SECTION 8: AI ASSISTANT PROMPTS ---
  addHeader('8. Free AI Assistant Prompts (Gemini/Claude)');
  kit.aiPrompts.forEach((p) => {
    checkPageBreak(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    setGoldColor();
    doc.text(p.title, margin, y);
    y += 4;

    const pLines = doc.splitTextToSize(p.prompt, contentWidth - 6);
    const pHeight = pLines.length * 4 + 4;

    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, contentWidth, pHeight, 'F');
    setSecondaryColor();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(pLines, margin + 3, y + 4);
    y += pHeight + 4;
  });

  // --- SECTION 9 & 10: NEXT MOVE & FINAL EBOOK CALL TO ACTION PAGE ---
  doc.addPage();
  y = 25;

  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentWidth, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(kit.nextMove.heading, margin + 8, y + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(226, 232, 240);
  const nextLines = doc.splitTextToSize(kit.nextMove.description, contentWidth - 16);
  doc.text(nextLines, margin + 8, y + 21);

  y += 50;

  // EBOOK CTA PROMO BOX
  doc.setFillColor(254, 243, 199); // Light gold highlight box
  doc.setDrawColor(217, 119, 6);
  doc.roundedRect(margin, y, contentWidth, 80, 3, 3, 'FD');

  setPrimaryColor();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('READY TO BUILD THE FULL HUSTLE?', margin + 8, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  setSecondaryColor();
  doc.text('The Starter Kit gives you the initial spark. Get the complete system inside:', margin + 8, y + 22);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  setGoldColor();
  doc.text('"THE ZERO-NAIRA DECLUTTER HUSTLE EBOOK"', margin + 8, y + 30);

  const ebookFeatures = [
    '✓ Full 4-step sale cycle & complete buyer request board',
    '✓ Exact pricing formulas for commission, flat fee & full clearance',
    '✓ Trust, payment safety & avoiding common Middleman traps',
    '✓ Turning 1 sale into 10 recurring referrals',
    '✓ Complete 30-Day Launch Blueprint & Master Copy-Paste Toolkit'
  ];

  let featY = y + 38;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  setSecondaryColor();
  ebookFeatures.forEach((f) => {
    doc.text(f, margin + 8, featY);
    featY += 5.5;
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  setGoldColor();
  doc.text(`Get the Full Ebook here: ${ebookUrl}`, margin + 8, y + 72);

  // Save the PDF
  const filename = `${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_zero_naira_starter_kit.pdf`;
  doc.save(filename);
};
