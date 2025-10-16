import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, TrendingUp, Lock, Mail, Download, Clock, BarChart3, Target } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import ExitReadinessPDF from './ExitReadinessPDF';

const ExitReadinessScorecard = () => {
  const [screen, setScreen] = useState('welcome');
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    customerClarity1: 0,
    customerClarity2: 0,
    messagingStrength1: 0,
    messagingStrength2: 0,
    brandPositioning1: 0,
    brandPositioning2: 0,
    corporateStory1: 0,
    corporateStory2: 0,
    marketPresence1: 0,
    marketPresence2: 0
  });
  const [email, setEmail] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const analysis = getAnalysis();
      const blob = await pdf(
        <ExitReadinessPDF 
          domainData={analysis.domainData}
          overallScore={analysis.overallScore}
          userEmail={email}
          userName=""
        />
      ).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Exit-Readiness-Report-${Date.now()}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating your PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Updated function: Submit to ActiveCampaign with proper JSON format
  const handleSubmitToBackend = async () => {
    try {
      // Generate the analysis data
      const analysis = getAnalysis();
      
      // Get the current page URL as the survey URL
      const surveyUrl = window.location.origin || 'https://exit-readiness-scorecard.netlify.app';

      // Send to Netlify function with JSON payload
      const response = await fetch('/.netlify/functions/submit-scorecard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          overallScore: analysis.overallScore,
          surveyUrl: surveyUrl
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to submit scorecard:', errorData);
        throw new Error(errorData.details || 'Failed to submit scorecard');
      }

      const result = await response.json();
      console.log('Scorecard submitted successfully:', result);

    } catch (error) {
      console.error('Error submitting to backend:', error);
      // Don't block the user flow - they can still see results
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const questions = [
    // Domain 1: Customer Clarity
    {
      id: 'customerClarity1',
      domain: 'Customer Clarity',
      questionNumber: 1,
      title: 'Customer Segmentation Strategy',
      question: 'Can you name your top 3 customer segments and explain what drives each one\'s buying decision?',
      description: 'Buyers look for companies that know exactly who they serve and why those customers choose them. Vague targets like "healthcare systems" or "patients" signal risk. Specific segments with documented buying criteria signal market mastery.',
      options: [
        { value: 1, label: 'We serve "healthcare" broadly - no clear segments' },
        { value: 2, label: 'We have 2-3 general categories (e.g., hospitals, clinics)' },
        { value: 3, label: 'We have 3 defined segments with basic pain points' },
        { value: 4, label: 'We have 3 segments with validated buying criteria and decision-maker personas' },
        { value: 5, label: 'We know exactly who buys, why they buy, when they buy, and can predict their objections' }
      ]
    },
    {
      id: 'customerClarity2',
      domain: 'Customer Clarity',
      questionNumber: 2,
      title: 'Segment-Specific Go-to-Market',
      question: 'Does your sales and marketing approach differ by customer segment?',
      description: 'A CFO evaluating your solution cares about ROI and integration costs. A Chief Medical Officer cares about clinical outcomes and workflow. One-size-fits-all messaging tells buyers you don\'t understand your market deeply enough.',
      options: [
        { value: 1, label: 'Same pitch, deck, and message for everyone' },
        { value: 2, label: 'Sales reps customize conversations in the moment' },
        { value: 3, label: 'We have 2-3 versions of our deck for different audiences' },
        { value: 4, label: 'Each segment has tailored messaging, collateral, and outreach sequences' },
        { value: 5, label: 'Full account-based strategy with segment-specific campaigns, sales plays, and measurable conversion metrics' }
      ]
    },
    // Domain 2: Messaging Strength
    {
      id: 'messagingStrength1',
      domain: 'Messaging Strength',
      questionNumber: 3,
      title: 'Differentiation Clarity',
      question: 'When prospects ask "How are you different?", can your entire team give the same clear answer?',
      description: 'Buyers interview multiple stakeholders during diligence. If your CEO, VP of Sales, and Head of Product each describe your differentiation differently, it signals internal misalignment and weak positioning.',
      options: [
        { value: 1, label: 'Every conversation is different - no consistent answer' },
        { value: 2, label: 'We have talking points but people interpret them differently' },
        { value: 3, label: 'Leadership is aligned, but the broader team varies' },
        { value: 4, label: 'Company-wide alignment on 2-3 core differentiators with proof points' },
        { value: 5, label: 'Everyone - from reception to C-suite - delivers the same crisp, memorable differentiation backed by customer evidence' }
      ]
    },
    {
      id: 'messagingStrength2',
      domain: 'Messaging Strength',
      questionNumber: 4,
      title: 'Message Testing & Validation',
      question: 'Have you tested your core messaging with customers, prospects, or partners to see what resonates?',
      description: 'The best messaging isn\'t created in conference rooms - it\'s validated in the market. Companies that test their positioning with real buyers close deals 30-40% faster because they\'ve eliminated messaging that confuses or fails to land.',
      options: [
        { value: 1, label: 'We haven\'t tested - our messaging is internal opinion' },
        { value: 2, label: 'We\'ve gotten informal feedback from a few people' },
        { value: 3, label: 'We\'ve conducted some customer interviews but haven\'t adjusted messaging' },
        { value: 4, label: 'We\'ve tested with 10+ external stakeholders and refined based on feedback' },
        { value: 5, label: 'We continuously test messaging with prospects, track what drives conversions, and optimize quarterly' }
      ]
    },
    // Domain 3: Brand Positioning
    {
      id: 'brandPositioning1',
      domain: 'Brand Positioning',
      questionNumber: 5,
      title: 'Category Leadership Evidence',
      question: 'When someone searches for solutions in your category, do you appear in the top results, publications, or "best of" lists?',
      description: 'Buyers research before they reach out. If you\'re not visible in search results, industry articles, or analyst reports, you\'re losing deals before conversations even start. Category leaders get inbound inquiries - followers have to hunt.',
      options: [
        { value: 1, label: 'We rarely appear in searches or industry roundups' },
        { value: 2, label: 'We appear occasionally but inconsistently' },
        { value: 3, label: 'We show up in some industry content and local searches' },
        { value: 4, label: 'We rank well in organic search and appear in multiple industry publications' },
        { value: 5, label: 'We\'re consistently featured in top search results, "best of" lists, analyst reports, and industry media' }
      ]
    },
    {
      id: 'brandPositioning2',
      domain: 'Brand Positioning',
      questionNumber: 6,
      title: 'Competitive Win Documentation',
      question: 'Do you track why you win (or lose) competitive deals, and does that data inform your strategy?',
      description: 'Category leaders don\'t just win - they know why they win. If you can\'t point to data showing "we win on speed" or "we win on integration capabilities," you\'re guessing. Buyers want to acquire companies that dominate for documented, repeatable reasons.',
      options: [
        { value: 1, label: 'We don\'t track competitive wins/losses systematically' },
        { value: 2, label: 'Sales reps share anecdotes but nothing is documented' },
        { value: 3, label: 'We collect win/loss data but don\'t analyze it regularly' },
        { value: 4, label: 'We track win/loss reasons and review them quarterly' },
        { value: 5, label: 'We have a formal win/loss program that directly informs product, messaging, and sales strategy - and we can prove our win rate is improving' }
      ]
    },
    // Domain 4: Corporate Story
    {
      id: 'corporateStory1',
      domain: 'Corporate Story',
      questionNumber: 7,
      title: 'Growth Narrative Clarity',
      question: 'Can you articulate where your company is going (3-year targets) and show proof you\'ll get there?',
      description: 'Buyers don\'t acquire your current revenue - they acquire your growth trajectory. If you say "we\'re growing fast" but can\'t point to specific targets, retention rates, pipeline coverage, or competitive wins, buyers discount your valuation.',
      options: [
        { value: 1, label: 'We talk about vision but don\'t have concrete growth targets' },
        { value: 2, label: 'We have revenue goals but limited proof of execution' },
        { value: 3, label: 'We have 3-year targets and some supporting metrics (retention, pipeline)' },
        { value: 4, label: 'We have clear targets backed by strong unit economics, customer retention, and market expansion plans' },
        { value: 5, label: 'We have a compelling growth story with documented proof: XX% year-over-year growth, XX% net retention, $XXM qualified pipeline, and a track record of hitting or exceeding targets' }
      ]
    },
    {
      id: 'corporateStory2',
      domain: 'Corporate Story',
      questionNumber: 8,
      title: 'Founder/Leadership Story Credibility',
      question: 'Does your leadership team\'s background and track record reinforce why you\'ll succeed?',
      description: 'Buyers bet on people as much as products. Have your leaders built and scaled companies before? Do they have deep domain expertise? Can they articulate lessons learned from past challenges? A strong leadership narrative de-risks the acquisition.',
      options: [
        { value: 1, label: 'Leadership backgrounds aren\'t clearly communicated' },
        { value: 2, label: 'We mention credentials but don\'t connect them to our strategy' },
        { value: 3, label: 'Leadership has relevant experience but it\'s not woven into our story' },
        { value: 4, label: 'Our leadership story shows domain expertise and past scale experience' },
        { value: 5, label: 'Our team has a documented track record of building, scaling, or exiting companies - and we use that credibility as proof we\'ll execute our vision' }
      ]
    },
    // Domain 5: Market Presence
    {
      id: 'marketPresence1',
      domain: 'Market Presence',
      questionNumber: 9,
      title: 'Thought Leadership & PR',
      question: 'In the past 12 months, how often has your company or leadership been featured in industry media, podcasts, or conferences?',
      description: 'Buyers track who\'s shaping the conversation in your space. If you\'re not speaking at conferences, quoted in trade publications, or sharing insights that others reference, you\'re invisible - and invisible companies get lower valuations.',
      options: [
        { value: 1, label: 'Zero media mentions or speaking engagements in the past year' },
        { value: 2, label: '1-2 appearances or mentions' },
        { value: 3, label: '3-5 appearances in industry media or regional conferences' },
        { value: 4, label: '6-10 appearances including national conferences or tier-1 publications' },
        { value: 5, label: 'We\'re recognized thought leaders: 10+ media mentions, regular conference speaking slots, and prospects reference our content in sales conversations' }
      ]
    },
    {
      id: 'marketPresence2',
      domain: 'Market Presence',
      questionNumber: 10,
      title: 'Sales Enablement & Asset Quality',
      question: 'Do your sales and marketing materials make it easy for prospects to understand your value and say "yes"?',
      description: 'Buyers review your deck, website, case studies, and demo during diligence. If those assets are outdated, generic, or confusing, it signals operational weakness. Top-performing companies have crisp, compelling materials that accelerate deal cycles.',
      options: [
        { value: 1, label: 'Our materials are outdated or inconsistent across the team' },
        { value: 2, label: 'We have basic materials but they\'re not compelling' },
        { value: 3, label: 'Our materials are decent but don\'t differentiate us' },
        { value: 4, label: 'We have strong, up-to-date materials that sales reps consistently use' },
        { value: 5, label: 'Our materials are exceptional: compelling case studies, a high-converting website, award-winning creative, and tools that shorten sales cycles by 20%+' }
      ]
    }
  ];

  const calculateScore = () => {
    const total = Object.values(answers).reduce((sum, val) => sum + val, 0);
    return Math.round(((total - 10) / 40) * 90 + 10);
  };

  const getScoreCategory = (score) => {
    if (score >= 80) return 'Exit Ready';
    if (score >= 60) return 'Solid Foundation with Key Gaps';
    return 'Exit Vulnerable';
  };

  const getScoreInterpretation = (score) => {
    if (score >= 80) return 'Buyers will see you as a premium acquisition';
    if (score >= 60) return 'Significant gaps that could cost you 20-40% in valuation';
    return 'Major readiness work needed before going to market';
  };

  const getDomainData = () => {
    const domains = [
      {
        name: 'Customer Clarity',
        score: (answers.customerClarity1 + answers.customerClarity2) / 2,
        questions: ['customerClarity1', 'customerClarity2']
      },
      {
        name: 'Messaging Strength',
        score: (answers.messagingStrength1 + answers.messagingStrength2) / 2,
        questions: ['messagingStrength1', 'messagingStrength2']
      },
      {
        name: 'Brand Positioning',
        score: (answers.brandPositioning1 + answers.brandPositioning2) / 2,
        questions: ['brandPositioning1', 'brandPositioning2']
      },
      {
        name: 'Corporate Story',
        score: (answers.corporateStory1 + answers.corporateStory2) / 2,
        questions: ['corporateStory1', 'corporateStory2']
      },
      {
        name: 'Market Presence',
        score: (answers.marketPresence1 + answers.marketPresence2) / 2,
        questions: ['marketPresence1', 'marketPresence2']
      }
    ];

    return domains.map(domain => ({
      domain: domain.name,
      score: Math.round(domain.score * 2) / 2,
      displayScore: `${Math.round(domain.score * 2)}/10`,
      gap: 5 - domain.score,
      buyerSignal: getBuyerSignal(domain.name),
      risk: getRisk(domain.name)
    }));
  };

  const getBuyerSignal = (domainName) => {
    const signals = {
      'Customer Clarity': 'Clarity in adoption drivers',
      'Messaging Strength': 'Differentiation',
      'Brand Positioning': 'Category leadership',
      'Corporate Story': 'Vision + traction',
      'Market Presence': 'Credibility signals'
    };
    return signals[domainName];
  };

  const getRisk = (domainName) => {
    const risks = {
      'Customer Clarity': 'Missed traction',
      'Messaging Strength': 'Lower multiples',
      'Brand Positioning': '"Me too" valuation',
      'Corporate Story': 'Lost credibility',
      'Market Presence': 'Longer cycles'
    };
    return risks[domainName];
  };

  const getAnalysis = () => {
    const domainData = getDomainData();
    const strongest = domainData.reduce((max, d) => d.score > max.score ? d : max);
    const weakest = domainData.reduce((min, d) => d.score < min.score ? d : min);
    return { strongest, weakest, overallScore: calculateScore(), domainData };
  };

  const getDomainOpportunity = (domainName, score) => {
    const numScore = Math.round(score * 2);
    
    const opportunities = {
      'Customer Clarity': {
        high: "You're doing well here. Make sure your segment dominance is documented with metrics buyers can verify: win rates by segment, NPS by persona, customer acquisition cost by channel.",
        medium: "You have segments defined, but you may not be executing against them consistently. Consider: Are different segments seeing different outreach? Can your sales team articulate why each segment chooses you? Do you have proof points for each?",
        low: "This is likely costing you deals today and will definitely cost you valuation at exit. Start by documenting your top 3 customer types, interviewing 5-10 customers per segment to understand their buying criteria, and testing whether segment-specific messaging improves conversion rates."
      },
      'Messaging Strength': {
        high: "Strong messaging is a competitive moat. Now pressure-test it: Are you tracking which messages drive the fastest conversions? Are new hires able to articulate your differentiation within their first week?",
        medium: "You have messaging, but it may not be consistent or memorable enough. Ask 10 people across your company: \"How are we different?\" If you get 10 different answers, you have alignment work to do.",
        low: "This is a critical gap. Start by interviewing recent customers and lost deals. What did they think made you different? Why did they choose you (or not)? Use that feedback to craft 2-3 core differentiators, test them in sales conversations, and measure what moves deals forward."
      },
      'Brand Positioning': {
        high: "You're visible and credible. Now focus on maintaining momentum: regular thought leadership, award submissions, speaking opportunities, and PR that reinforces your category ownership.",
        medium: "You have some visibility but aren't yet seen as the category leader. Audit where you appear (or don't) when prospects research your space. Create a 6-month visibility plan: 1 speaking opportunity, 3 media placements, 1 award submission, and SEO improvements.",
        low: "You're invisible to buyers, which means you're leaving millions on the table. Start with the basics: optimize your website for search, get featured in one industry publication, and document 2-3 customer success stories. Visibility compounds - but you have to start."
      },
      'Corporate Story': {
        high: "Your story is compelling and backed by proof. Make sure it's consistently told across every touchpoint: investor decks, sales conversations, recruiting, and media appearances.",
        medium: "You have elements of a strong story but they may not be connected clearly. Map your narrative: Where did you start? What's your unique insight? Where are you going? What proof do you have? Practice telling it in 2 minutes and 10 minutes.",
        low: "This gap is costing you credibility with customers and investors today. Schedule a working session with your leadership team. Document: (1) Your founder insight, (2) Your 3-year targets, (3) Proof you're on track. Test it with advisors or friendly investors before using it externally."
      },
      'Market Presence': {
        high: "Your market presence is strong. Keep refining: A/B test your website messaging, update case studies quarterly, and track which materials correlate with faster deal cycles.",
        medium: "Your materials exist but may not be compelling enough. Audit your assets: Would you be impressed if you were evaluating your company? Get outside feedback and prioritize the 2-3 updates that would have the biggest impact.",
        low: "This is hurting you in every sales conversation and will devastate your valuation. Start with your pitch deck - make sure it's clear, compelling, and tells your story in 10 slides or less. Then tackle your website homepage. Buyers judge you in 10 seconds."
      }
    };

    if (numScore >= 8) return opportunities[domainName].high;
    if (numScore >= 5) return opportunities[domainName].medium;
    return opportunities[domainName].low;
  };

  const getBioPlus = (domainName) => {
    const stories = {
      'Customer Clarity': {
        challenge: "BioPlus Specialty Pharmacy faced exactly this challenge. They were serving \"patients\" - which meant competing with every pharmacy in America. Working with Legacy DNA, they identified three high-value segments: oncology patients needing rapid access, specialty providers requiring seamless integration, and pharma partners seeking distribution excellence.",
        results: "By tailoring their approach to each segment, BioPlus achieved: #1 ranking in oncology specialty pharmacy care (by both patients and prescribers), Named one of Money Magazine's 5 Best Online Pharmacies - the only specialty pharmacy ever chosen, and 78,000 â†' 325,000 dispenses in seven years (22.5% CAGR). They went from commodity player to category leader - and sold twice at premium multiples."
      },
      'Messaging Strength': {
        challenge: "BioPlus had a powerful service but couldn't articulate what made them different. Legacy DNA worked with their leadership to create The Power of 2â„¢: 2-Hour Patient Acceptance Guaranteeâ„¢, 2-Day Ready to Shipâ„¢, 2-Click Refillsâ„¢ - all anchored by a vision to \"heal the world 2gether.\" This wasn't just a tagline - it became the operational rallying cry. Every employee, every customer touchpoint, every sales conversation reinforced the same message.",
        results: "The result: 13 consecutive quarters of growth, Revenue doubled from $750M to $2B, and Multiple Gold Aster Awards for creative excellence (top 5% nationally for healthcare marketing). One clear message. Compounding impact."
      },
      'Brand Positioning': {
        challenge: "BioPlus wasn't just a great pharmacy - they systematically built evidence of category leadership: Award-winning digital presence (transformed their website and social strategy), Reputation engine (lifted Google ratings from 2.4 to 4.8 in under 12 months), Industry recognition (Gold Aster Awards multiple years, including two golds in 2025), and Media validation (featured as one of America's best online pharmacies by Money Magazine).",
        results: "This wasn't vanity - it was strategic. When buyers evaluated BioPlus, the evidence of category leadership was undeniable. Premium acquirers (Nautic Partners, Elevance Health) don't buy \"good companies.\" They buy market leaders."
      },
      'Corporate Story': {
        challenge: "BioPlus started with a powerful founder story: Dr. Stephen Vogt's belief that specialty medicine access should be fast, easy, and compassionate. But that alone wasn't enough. Working with Legacy DNA, they connected that mission to measurable traction: Clear vision (Become the 4th largest U.S. specialty pharmacy), Proof of execution (13 consecutive quarters of growth, 202% gross profit increase in 3 years), and Leadership credibility (Mark Montgomery had previously scaled and sold Axium Healthcare Pharmacy to Kroger).",
        results: "When Dr. Vogt retired, Mark completed the transformation and led BioPlus to acquisition. The story wasn't just inspiring - it was evidence of inevitable success. Result: Two premium exits within 3 years."
      },
      'Market Presence': {
        challenge: "BioPlus didn't just improve their operations - they made sure the market could see their excellence: Digital transformation (award-winning website rebuild), Sales enablement (new decks, case studies, and tools that equipped reps to win in disrupted markets), Customer experience innovation (co-creation programs with patients and providers that built advocacy), and New revenue channels (direct-to-consumer program that added millions in gross profit).",
        results: "These weren't \"nice to haves\" - they were the engine that delivered 13 consecutive quarters of growth and made BioPlus irresistible to premium acquirers."
      }
    };
    return stories[domainName];
  };

  if (screen === 'welcome') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #eff6ff, #f5f3ff, #ecfeff)', padding: isMobile ? '1.5rem' : '3rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '600', marginBottom: '1rem', backgroundColor: '#E2EEF2', color: '#34296A' }}>
              For PE-Backed & Mid-Market Healthtech CEOs
            </div>
            <h1 style={{ fontSize: isMobile ? '2.25rem' : '3.75rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#34296A' }}>
              Are You Exit Ready?
            </h1>
            <p style={{ fontSize: isMobile ? '1.125rem' : '1.5rem', color: '#374151', marginBottom: '2rem', maxWidth: '48rem', margin: '0 auto' }}>
              In 5-7 minutes, see how your company stacks up against what premium buyers look for - and what gaps might be costing you millions.
            </p>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: isMobile ? '1.5rem' : '3rem', marginBottom: '2rem' }}>
            <p style={{ fontSize: '1.125rem', color: '#374151', marginBottom: '2rem' }}>
              If you're planning to exit in the next 12-36 months, your brand clarity, market position, and growth story can make or break your valuation. The <strong>Exit Readiness Scorecardâ„¢</strong> reveals where you're strong, where you're vulnerable, and what to fix before you enter the deal room.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{ borderRadius: '0.5rem', padding: '0.75rem', marginRight: '1rem', backgroundColor: '#E2EEF2' }}>
                  <Clock style={{ width: '1.5rem', height: '1.5rem', color: '#009DB9' }} />
                </div>
                <div>
                  <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>Takes 5-7 minutes</h3>
                  <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>10 questions across 5 critical domains</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{ borderRadius: '0.5rem', padding: '0.75rem', marginRight: '1rem', backgroundColor: '#E2EEF2' }}>
                  <BarChart3 style={{ width: '1.5rem', height: '1.5rem', color: '#009DB9' }} />
                </div>
                <div>
                  <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>Instant score with detailed breakdown</h3>
                  <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>See your results immediately with clear visuals</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{ borderRadius: '0.5rem', padding: '0.75rem', marginRight: '1rem', backgroundColor: '#E2EEF2' }}>
                  <Target style={{ width: '1.5rem', height: '1.5rem', color: '#009DB9' }} />
                </div>
                <div>
                  <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>Benchmarked against buyer expectations</h3>
                  <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>Compare your readiness to real exits and acquisition standards</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{ borderRadius: '0.5rem', padding: '0.75rem', marginRight: '1rem', backgroundColor: '#E2EEF2' }}>
                  <CheckCircle style={{ width: '1.5rem', height: '1.5rem', color: '#009DB9' }} />
                </div>
                <div>
                  <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>Built for healthtech and pharmacy leaders</h3>
                  <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>Based on real exits and proven market strategies</p>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => setScreen('quiz')}
                style={{ 
                  backgroundColor: '#34296A',
                  color: 'white',
                  padding: isMobile ? '1rem 2rem' : '1.25rem 2.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '1rem' : '1.125rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              >
                Start My Exit Readiness Scorecard
                <ArrowRight style={{ marginLeft: '0.75rem', width: '1.5rem', height: '1.5rem' }} />
              </button>
              <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '1rem' }}>No credit card required \u2022 Results delivered instantly</p>
            </div>
          </div>

          <div style={{ textAlign: 'center', color: '#6B7280' }}>
            <p style={{ fontSize: '0.875rem' }}>
              Created by Legacy DNA - trusted by PE-backed healthtech companies preparing for successful exits
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'fullResults') {
    const analysis = getAnalysis();
    const getScoreColor = (score) => {
      if (score >= 4) return { color: '#059669', backgroundColor: '#f0fdf4' };
      if (score >= 2.5) return { color: '#d97706', backgroundColor: '#fefce8' };
      return { color: '#dc2626', backgroundColor: '#fef2f2' };
    };
    const getGapColor = (gap) => {
      if (gap <= 1) return '#10b981';
      if (gap <= 2.5) return '#eab308';
      return '#ef4444';
    };

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #eff6ff, #f5f3ff, #ecfeff)', padding: '1rem' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
          <div style={{ background: 'linear-gradient(to right, #14b8a6, #06b6d4)', color: 'white', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <Mail style={{ width: '1.5rem', height: '1.5rem', marginRight: '0.75rem', flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: '600' }}>Download Your PDF Report</p>
                  <p style={{ fontSize: '0.875rem', color: '#ccfbf1' }}>Get your complete Exit Readiness Report as a PDF</p>
                </div>
              </div>
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                style={{
                  backgroundColor: 'white',
                  color: '#0891b2',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  border: 'none',
                  cursor: isGeneratingPDF ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  opacity: isGeneratingPDF ? 0.7 : 1,
                  transition: 'opacity 0.2s',
                  whiteSpace: 'nowrap'
                }}
              >
                <Download style={{ width: '1.25rem', height: '1.25rem' }} />
                {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
              </button>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: isMobile ? '1.5rem' : '2rem', marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: isMobile ? '1.5rem' : '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>Your Complete Exit Readiness Report</h1>
            <p style={{ color: '#6B7280', marginBottom: '2rem' }}>Here's your detailed analysis of how your brand, story, and market presence stack up against what buyers look for at exit.</p>

            <div style={{ borderRadius: '0.75rem', padding: '2rem', color: 'white', marginBottom: '2rem', background: 'linear-gradient(135deg, #34296A 0%, #4E72B8 100%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <div>
                  <p style={{ color: '#ddd6fe', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Exit Readiness Score</p>
                  <p style={{ fontSize: '3.75rem', fontWeight: 'bold' }}>{analysis.overallScore}</p>
                  <p style={{ color: '#ddd6fe', marginTop: '0.5rem' }}>out of 100</p>
                  <p style={{ color: 'white', fontWeight: '600', marginTop: '0.75rem', fontSize: '1.25rem' }}>{getScoreCategory(analysis.overallScore)}</p>
                  <p style={{ color: '#ddd6fe', fontSize: '0.875rem', marginTop: '0.5rem' }}>{getScoreInterpretation(analysis.overallScore)}</p>
                </div>
                <TrendingUp style={{ width: '6rem', height: '6rem', opacity: 0.2 }} />
              </div>
            </div>

            <div style={{ borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2rem', backgroundColor: '#E2EEF2' }}>
              <p style={{ color: '#374151', marginBottom: '0.5rem' }}>
                <strong>Your strongest area is {analysis.strongest.domain} ({analysis.strongest.displayScore})</strong>, and your biggest opportunity is <strong>{analysis.weakest.domain} ({analysis.weakest.displayScore})</strong>.
              </p>
              <p style={{ color: '#374151' }}>
                Below, see how your company compares to top performers in each domain - and what you can do to close the gaps.
              </p>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>Exit Readiness Scorecardâ„¢</h2>
            <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: '600', color: '#374151' }}>Domain</th>
                    <th style={{ textAlign: 'center', padding: '0.75rem 1rem', fontWeight: '600', color: '#374151' }}>Your Score</th>
                    <th style={{ textAlign: 'center', padding: '0.75rem 1rem', fontWeight: '600', color: '#374151' }}>Gap to 5</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: '600', color: '#374151' }}>Buyer Signal</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: '600', color: '#374151' }}>Risk if Weak</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.domainData.map((domain, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '1rem', fontWeight: '500', color: '#111827' }}>{domain.domain}</td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span style={{ 
                          display: 'inline-block', 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '9999px', 
                          fontWeight: 'bold',
                          ...getScoreColor(domain.score)
                        }}>
                          {domain.displayScore}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ width: '6rem', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '0.5rem', marginRight: '0.5rem', position: 'relative' }}>
                            <div 
                              style={{ 
                                height: '0.5rem', 
                                borderRadius: '9999px',
                                width: `${(domain.gap / 5) * 100}%`,
                                backgroundColor: getGapColor(domain.gap)
                              }}
                            ></div>
                          </div>
                          <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>{domain.gap.toFixed(1)}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#6B7280' }}>{domain.buyerSignal}</td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#6B7280' }}>{domain.risk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {analysis.domainData.map((domain, idx) => {
              const bioPlus = getBioPlus(domain.domain);
              return (
                <div key={idx} style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: idx < analysis.domainData.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>{domain.domain}</h3>
                  <p style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#34296A' }}>Your Score: {domain.displayScore}</p>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>Why This Matters for Exit:</h4>
                    <p style={{ color: '#374151', marginBottom: '1rem' }}>
                      {domain.domain === 'Customer Clarity' && "Buyers pay premiums for companies that dominate specific segments, not those that serve \"everyone.\" When you can prove you own a segment - with documented personas, validated buying criteria, and segment-specific strategies - you eliminate buyer concerns about market risk."}
                      {domain.domain === 'Messaging Strength' && "When buyers conduct diligence, they interview your team, customers, and partners. If those conversations reveal inconsistent or unclear messaging, it signals weak leadership alignment and market confusion - both of which destroy valuation. Companies with crisp, validated messaging close deals 30% faster and command higher multiples."}
                      {domain.domain === 'Brand Positioning' && "Buyers research you long before they reach out. If you're not appearing in search results, industry publications, or analyst reports, you're losing deals before conversations start. Category leaders get inbound interest and premium multiples. Followers get commoditized offers."}
                      {domain.domain === 'Corporate Story' && "Buyers don't acquire your current revenue - they acquire your trajectory. If you can't articulate where you're going (specific 3-year targets) and prove you'll get there (retention rates, pipeline, competitive wins), buyers discount your valuation by 30-50%. A compelling corporate story turns \"interesting company\" into \"must-have acquisition.\""}
                      {domain.domain === 'Market Presence' && "Your market-facing assets - website, pitch deck, case studies, demo - are evaluated during diligence. If they're outdated, generic, or unconvincing, buyers assume the rest of your business is too. Top-performing companies have exceptional materials that shorten sales cycles and signal operational excellence."}
                    </p>
                  </div>

                  <div style={{ borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '1.5rem', backgroundColor: '#E2EEF2' }}>
                    <h4 style={{ fontWeight: 'bold', color: '#111827', marginBottom: '0.75rem' }}>What Top Performers Do: The BioPlus Story</h4>
                    <p style={{ color: '#374151', marginBottom: '0.75rem' }}>{bioPlus.challenge}</p>
                    <p style={{ color: '#374151' }}>{bioPlus.results}</p>
                  </div>

                  <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem' }}>
                    <h4 style={{ fontWeight: 'bold', color: '#111827', marginBottom: '0.75rem' }}>Your Opportunity:</h4>
                    <p style={{ color: '#374151' }}>{getDomainOpportunity(domain.domain, domain.score)}</p>
                  </div>
                </div>
              );
            })}

            <div style={{ marginTop: '3rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>Turn Insight Into Action</h3>
              <p style={{ color: '#374151', marginBottom: '1.5rem' }}>You now know where you stand - and where you're vulnerable. The next step is turning these insights into a roadmap that strengthens your position and increases what buyers will pay.</p>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ border: '2px solid #34296A', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '1rem' }}>
                  <h4 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.5rem', color: '#34296A' }}>Book My Exit Readiness Diagnosticâ„¢</h4>
                  <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '1rem' }}>Get 2 growth levers and 1 red flag personalized to your company - 30 minutes, zero obligation</p>
                  <a 
                    href="https://calendly.com/drroxietime/exit-readiness-diagnostic"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      color: 'white', 
                      padding: '0.75rem 1.5rem', 
                      borderRadius: '0.5rem', 
                      fontWeight: '600',
                      backgroundColor: '#34296A',
                      textDecoration: 'none'
                    }}
                  >
                    Book Diagnostic Session
                    <ArrowRight style={{ marginLeft: '0.5rem', width: '1.25rem', height: '1.25rem' }} />
                  </a>
                </div>

                <div style={{ border: '2px solid #009DB9', borderRadius: '0.75rem', padding: '1.5rem' }}>
                  <h4 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.5rem', color: '#009DB9' }}>Explore the Exit Readiness Sprintâ„¢</h4>
                  <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '1rem' }}>See how we help healthtech leaders close readiness gaps in 90 days</p>
                  <a 
                    href="https://www.legacy-dna.com/exit-readiness-sprint"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      backgroundColor: 'white',
                      border: '2px solid #009DB9',
                      padding: '0.75rem 1.5rem', 
                      borderRadius: '0.5rem', 
                      fontWeight: '600',
                      color: '#009DB9',
                      textDecoration: 'none'
                    }}
                  >
                    Learn About the Sprint
                    <ArrowRight style={{ marginLeft: '0.5rem', width: '1.25rem', height: '1.25rem' }} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'preview') {
    const score = calculateScore();
    const scoreCategory = getScoreCategory(score);
    const analysis = getAnalysis();

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #eff6ff, #f5f3ff, #ecfeff)', padding: '1rem' }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '2rem', marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>Your Exit Readiness Score</h1>
            <p style={{ color: '#6B7280', marginBottom: '2rem' }}>Here's your overall readiness assessment based on your responses.</p>

            <div style={{ borderRadius: '0.75rem', padding: '2rem', color: 'white', marginBottom: '2rem', background: 'linear-gradient(135deg, #34296A 0%, #4E72B8 100%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: '#ddd6fe', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Your Score</p>
                  <p style={{ fontSize: '4.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{score}</p>
                  <p style={{ color: '#ddd6fe', fontSize: '0.875rem', marginBottom: '0.75rem' }}>out of 100</p>
                  <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{scoreCategory}</p>
                  </div>
                </div>
                <TrendingUp style={{ width: '8rem', height: '8rem', opacity: 0.2 }} />
              </div>
            </div>

            <div style={{ borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2rem', backgroundColor: '#E2EEF2' }}>
              <p style={{ color: '#374151', fontSize: '1.125rem' }}>
                Based on your responses, you've built a <strong>{scoreCategory.toLowerCase()}</strong> foundation. Your strongest area is <strong>{analysis.strongest.domain}</strong>, while <strong>{analysis.weakest.domain}</strong> represents your biggest opportunity to increase how buyers perceive your value.
              </p>
            </div>

            <div style={{ background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)', borderRadius: '0.75rem', padding: '2rem', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '8rem', height: '8rem', opacity: 0.05 }}>
                <Lock style={{ width: '100%', height: '100%' }} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>Unlock Your Full Scorecard</h2>
              <p style={{ color: '#374151', marginBottom: '1.5rem' }}>See your complete breakdown across all 5 domains, learn what top performers are doing differently, and get specific recommendations to strengthen your position before your next funding or exit event.</p>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', color: '#374151', marginBottom: '0.75rem' }}>
                  <CheckCircle style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.75rem', marginTop: '0.125rem', flexShrink: 0, color: '#009DB9' }} />
                  <span><strong>Domain-by-domain scoring</strong> across all 5 critical areas</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', color: '#374151', marginBottom: '0.75rem' }}>
                  <CheckCircle style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.75rem', marginTop: '0.125rem', flexShrink: 0, color: '#009DB9' }} />
                  <span><strong>BioPlus case studies</strong> showing what worked for their $2B exit</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', color: '#374151', marginBottom: '0.75rem' }}>
                  <CheckCircle style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.75rem', marginTop: '0.125rem', flexShrink: 0, color: '#009DB9' }} />
                  <span><strong>Personalized recommendations</strong> for each domain based on your score</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', color: '#374151' }}>
                  <CheckCircle style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.75rem', marginTop: '0.125rem', flexShrink: 0, color: '#009DB9' }} />
                  <span><strong>Downloadable PDF report</strong> emailed to you for sharing with your team</span>
                </div>
              </div>

              <div style={{ position: 'relative' }}>
                <div style={{ filter: 'blur(4px)', opacity: 0.6, pointerEvents: 'none', userSelect: 'none' }}>
                  <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1rem', border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Exit Readiness Scorecardâ„¢ Preview</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f3f4f6', padding: '0.5rem', borderRadius: '0.25rem' }}>
                        <span style={{ fontSize: '0.75rem' }}>Customer Clarity</span>
                        <div style={{ width: '4rem', height: '0.5rem', backgroundColor: '#d1d5db', borderRadius: '0.25rem' }}></div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f3f4f6', padding: '0.5rem', borderRadius: '0.25rem' }}>
                        <span style={{ fontSize: '0.75rem' }}>Messaging Strength</span>
                        <div style={{ width: '4rem', height: '0.5rem', backgroundColor: '#d1d5db', borderRadius: '0.25rem' }}></div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f3f4f6', padding: '0.5rem', borderRadius: '0.25rem' }}>
                        <span style={{ fontSize: '0.75rem' }}>Brand Positioning</span>
                        <div style={{ width: '4rem', height: '0.5rem', backgroundColor: '#d1d5db', borderRadius: '0.25rem' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '0.75rem', color: '#34296A' }}>
                    <Lock style={{ width: '2rem', height: '2rem' }} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ borderRadius: '0.75rem', padding: '2rem', backgroundColor: '#E2EEF2' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <Mail style={{ width: '1.5rem', height: '1.5rem', marginRight: '0.75rem', color: '#009DB9' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>Get Your Complete Exit Readiness Report</h3>
              </div>
              <p style={{ color: '#374151', marginBottom: '1.5rem' }}>Enter your email and we'll send you the full scorecard, detailed gap analysis, and downloadable PDF report.</p>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '1rem', marginBottom: '1rem' }}
                  placeholder="your@email.com"
                />
                <button
                  onClick={async () => {
                    // Submit to backend (ActiveCampaign + R2)
                    await handleSubmitToBackend();
                    // Then show full results
                    setScreen('fullResults');
                  }}
                  disabled={!email || !email.includes('@')}
                  style={{ 
                    width: '100%',
                    backgroundColor: email && email.includes('@') ? '#34296A' : '#d1d5db',
                    color: 'white',
                    padding: '1rem 2rem',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    fontSize: '1.125rem',
                    border: 'none',
                    cursor: email && email.includes('@') ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  Show My Full Results
                  <ArrowRight style={{ marginLeft: '0.5rem', width: '1.5rem', height: '1.5rem' }} />
                </button>
                <p style={{ fontSize: '0.75rem', color: '#6B7280', textAlign: 'center', marginTop: '0.5rem' }}>We'll also send you a downloadable PDF version for your records.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];
  const currentAnswer = answers[currentQuestion.id];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #eff6ff, #f5f3ff, #ecfeff)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '1rem' 
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: isMobile ? '100%' : '48rem', 
        backgroundColor: 'white', 
        borderRadius: '1rem', 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', 
        padding: isMobile ? '1.5rem' : '2rem' 
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
            <span>Question {currentStep + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '0.5rem' }}>
            <div 
              style={{ 
                height: '0.5rem', 
                borderRadius: '9999px', 
                transition: 'width 0.3s',
                width: `${progress}%`,
                backgroundColor: '#009DB9'
              }}
            ></div>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ 
            fontSize: '0.875rem', 
            fontWeight: '600', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em', 
            marginBottom: '0.5rem',
            color: '#009DB9'
          }}>
            {currentQuestion.domain} • {currentQuestion.title}
          </h3>
          <h2 style={{ 
            fontSize: isMobile ? '1.25rem' : '1.5rem', 
            fontWeight: 'bold', 
            color: '#111827', 
            marginBottom: '1rem' 
          }}>
            {currentQuestion.question}
          </h2>
          <p style={{ 
            fontSize: isMobile ? '0.875rem' : '1rem', 
            color: '#6B7280' 
          }}>
            {currentQuestion.description}
          </p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          {currentQuestion.options.map((option) => (
            <button
              key={option.value}
              onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion.id]: option.value }))}
              style={{
                width: '100%',
                display: 'block',
                textAlign: 'left',
                padding: isMobile ? '1rem' : '1.5rem',
                borderRadius: '0.5rem',
                border: currentAnswer === option.value ? '2px solid #34296A' : '2px solid #e5e7eb',
                backgroundColor: currentAnswer === option.value ? '#faf5ff' : 'white',
                cursor: 'pointer',
                marginBottom: '0.75rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (currentAnswer !== option.value) {
                  e.currentTarget.style.borderColor = '#c4b5fd';
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }
              }}
              onMouseLeave={(e) => {
                if (currentAnswer !== option.value) {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{
                  width: isMobile ? '1.75rem' : '2rem',
                  height: isMobile ? '1.75rem' : '2rem',
                  borderRadius: '9999px',
                  border: '2px solid',
                  borderColor: currentAnswer === option.value ? '#34296A' : '#d1d5db',
                  backgroundColor: currentAnswer === option.value ? '#34296A' : 'white',
                  color: currentAnswer === option.value ? 'white' : '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: isMobile ? '0.75rem' : '1rem',
                  fontWeight: '600',
                  fontSize: isMobile ? '0.875rem' : '1rem',
                  flexShrink: 0
                }}>
                  {option.value}
                </span>
                <span style={{
                  fontWeight: '500',
                  fontSize: isMobile ? '0.875rem' : '1rem',
                  color: currentAnswer === option.value ? '#111827' : '#374151'
                }}>
                  {option.label}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              style={{
                padding: isMobile ? '0.5rem 1rem' : '0.75rem 1.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontWeight: '600',
                fontSize: isMobile ? '0.875rem' : '1rem',
                backgroundColor: 'white',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              Back
            </button>
          )}
          <button
            onClick={() => {
              if (currentStep < questions.length - 1) {
                setCurrentStep(currentStep + 1);
              } else {
                setScreen('preview');
              }
            }}
            disabled={!currentAnswer}
            style={{
              flex: 1,
              backgroundColor: currentAnswer ? '#34296A' : '#d1d5db',
              color: 'white',
              padding: isMobile ? '0.5rem 1.5rem' : '0.75rem 2rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              fontSize: isMobile ? '0.875rem' : '1rem',
              border: 'none',
              cursor: currentAnswer ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => {
              if (currentAnswer) e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              if (currentAnswer) e.currentTarget.style.opacity = '1';
            }}
          >
            {currentStep === questions.length - 1 ? 'See My Score' : 'Next Question'}
            <ArrowRight style={{ marginLeft: '0.5rem', width: isMobile ? '1rem' : '1.25rem', height: isMobile ? '1rem' : '1.25rem' }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExitReadinessScorecard;
