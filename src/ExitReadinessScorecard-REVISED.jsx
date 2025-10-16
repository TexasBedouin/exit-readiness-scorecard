import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, AlertCircle, TrendingUp, Lock, Mail, Download, Clock, BarChart3, Target } from 'lucide-react';

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
        { value: 1, label: 'We serve "healthcare" broadly — no clear segments' },
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
        { value: 1, label: 'Every conversation is different — no consistent answer' },
        { value: 2, label: 'We have talking points but people interpret them differently' },
        { value: 3, label: 'Leadership is aligned, but the broader team varies' },
        { value: 4, label: 'Company-wide alignment on 2-3 core differentiators with proof points' },
        { value: 5, label: 'Everyone — from reception to C-suite — delivers the same crisp, memorable differentiation backed by customer evidence' }
      ]
    },
    {
      id: 'messagingStrength2',
      domain: 'Messaging Strength',
      questionNumber: 4,
      title: 'Message Testing & Validation',
      question: 'Have you tested your core messaging with customers, prospects, or partners to see what resonates?',
      description: 'The best messaging isn\'t created in conference rooms — it\'s validated in the market. Companies that test their positioning with real buyers close deals 30-40% faster because they\'ve eliminated messaging that confuses or fails to land.',
      options: [
        { value: 1, label: 'We haven\'t tested — our messaging is internal opinion' },
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
      description: 'Buyers research before they reach out. If you\'re not visible in search results, industry articles, or analyst reports, you\'re losing deals before conversations even start. Category leaders get inbound inquiries — followers have to hunt.',
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
      description: 'Category leaders don\'t just win — they know why they win. If you can\'t point to data showing "we win on speed" or "we win on integration capabilities," you\'re guessing. Buyers want to acquire companies that dominate for documented, repeatable reasons.',
      options: [
        { value: 1, label: 'We don\'t track competitive wins/losses systematically' },
        { value: 2, label: 'Sales reps share anecdotes but nothing is documented' },
        { value: 3, label: 'We collect win/loss data but don\'t analyze it regularly' },
        { value: 4, label: 'We track win/loss reasons and review them quarterly' },
        { value: 5, label: 'We have a formal win/loss program that directly informs product, messaging, and sales strategy — and we can prove our win rate is improving' }
      ]
    },
    // Domain 4: Corporate Story
    {
      id: 'corporateStory1',
      domain: 'Corporate Story',
      questionNumber: 7,
      title: 'Growth Narrative Clarity',
      question: 'Can you articulate where your company is going (3-year targets) and show proof you\'ll get there?',
      description: 'Buyers don\'t acquire your current revenue — they acquire your growth trajectory. If you say "we\'re growing fast" but can\'t point to specific targets, retention rates, pipeline coverage, or competitive wins, buyers discount your valuation.',
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
        { value: 5, label: 'Our team has a documented track record of building, scaling, or exiting companies — and we use that credibility as proof we\'ll execute our vision' }
      ]
    },
    // Domain 5: Market Presence
    {
      id: 'marketPresence1',
      domain: 'Market Presence',
      questionNumber: 9,
      title: 'Thought Leadership & PR',
      question: 'In the past 12 months, how often has your company or leadership been featured in industry media, podcasts, or conferences?',
      description: 'Buyers track who\'s shaping the conversation in your space. If you\'re not speaking at conferences, quoted in trade publications, or sharing insights that others reference, you\'re invisible — and invisible companies get lower valuations.',
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
    const domainScores = [
      (answers.customerClarity1 + answers.customerClarity2) / 2,
      (answers.messagingStrength1 + answers.messagingStrength2) / 2,
      (answers.brandPositioning1 + answers.brandPositioning2) / 2,
      (answers.corporateStory1 + answers.corporateStory2) / 2,
      (answers.marketPresence1 + answers.marketPresence2) / 2
    ];
    const total = domainScores.reduce((sum, score) => sum + score, 0);
    return Math.round(total * 10);
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
      score: Math.round(domain.score * 2) / 2, // Round to nearest 0.5
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
    const numScore = Math.round(score * 2); // Convert to 10-point scale
    
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
        low: "You're invisible to buyers, which means you're leaving millions on the table. Start with the basics: optimize your website for search, get featured in one industry publication, and document 2-3 customer success stories. Visibility compounds — but you have to start."
      },
      'Corporate Story': {
        high: "Your story is compelling and backed by proof. Make sure it's consistently told across every touchpoint: investor decks, sales conversations, recruiting, and media appearances.",
        medium: "You have elements of a strong story but they may not be connected clearly. Map your narrative: Where did you start? What's your unique insight? Where are you going? What proof do you have? Practice telling it in 2 minutes and 10 minutes.",
        low: "This gap is costing you credibility with customers and investors today. Schedule a working session with your leadership team. Document: (1) Your founder insight, (2) Your 3-year targets, (3) Proof you're on track. Test it with advisors or friendly investors before using it externally."
      },
      'Market Presence': {
        high: "Your market presence is strong. Keep refining: A/B test your website messaging, update case studies quarterly, and track which materials correlate with faster deal cycles.",
        medium: "Your materials exist but may not be compelling enough. Audit your assets: Would you be impressed if you were evaluating your company? Get outside feedback and prioritize the 2-3 updates that would have the biggest impact.",
        low: "This is hurting you in every sales conversation and will devastate your valuation. Start with your pitch deck — make sure it's clear, compelling, and tells your story in 10 slides or less. Then tackle your website homepage. Buyers judge you in 10 seconds."
      }
    };

    if (numScore >= 8) return opportunities[domainName].high;
    if (numScore >= 5) return opportunities[domainName].medium;
    return opportunities[domainName].low;
  };

  const getBioPlus = (domainName) => {
    const stories = {
      'Customer Clarity': {
        challenge: "BioPlus Specialty Pharmacy faced exactly this challenge. They were serving \"patients\" — which meant competing with every pharmacy in America. Working with Legacy DNA, they identified three high-value segments: oncology patients needing rapid access, specialty providers requiring seamless integration, and pharma partners seeking distribution excellence.",
        results: "By tailoring their approach to each segment, BioPlus achieved: #1 ranking in oncology specialty pharmacy care (by both patients and prescribers), Named one of Money Magazine's 5 Best Online Pharmacies — the only specialty pharmacy ever chosen, and 78,000 → 325,000 dispenses in seven years (22.5% CAGR). They went from commodity player to category leader — and sold twice at premium multiples."
      },
      'Messaging Strength': {
        challenge: "BioPlus had a powerful service but couldn't articulate what made them different. Legacy DNA worked with their leadership to create The Power of 2™: 2-Hour Patient Acceptance Guarantee™, 2-Day Ready to Ship™, 2-Click Refills™ — all anchored by a vision to \"heal the world 2gether.\" This wasn't just a tagline — it became the operational rallying cry. Every employee, every customer touchpoint, every sales conversation reinforced the same message.",
        results: "The result: 13 consecutive quarters of growth, Revenue doubled from $750M to $2B, and Multiple Gold Aster Awards for creative excellence (top 5% nationally for healthcare marketing). One clear message. Compounding impact."
      },
      'Brand Positioning': {
        challenge: "BioPlus wasn't just a great pharmacy — they systematically built evidence of category leadership: Award-winning digital presence (transformed their website and social strategy), Reputation engine (lifted Google ratings from 2.4 to 4.8 in under 12 months), Industry recognition (Gold Aster Awards multiple years, including two golds in 2025), and Media validation (featured as one of America's best online pharmacies by Money Magazine).",
        results: "This wasn't vanity — it was strategic. When buyers evaluated BioPlus, the evidence of category leadership was undeniable. Premium acquirers (Nautic Partners, Elevance Health) don't buy \"good companies.\" They buy market leaders."
      },
      'Corporate Story': {
        challenge: "BioPlus started with a powerful founder story: Dr. Stephen Vogt's belief that specialty medicine access should be fast, easy, and compassionate. But that alone wasn't enough. Working with Legacy DNA, they connected that mission to measurable traction: Clear vision (Become the 4th largest U.S. specialty pharmacy), Proof of execution (13 consecutive quarters of growth, 202% gross profit increase in 3 years), and Leadership credibility (Mark Montgomery had previously scaled and sold Axium Healthcare Pharmacy to Kroger).",
        results: "When Dr. Vogt retired, Mark completed the transformation and led BioPlus to acquisition. The story wasn't just inspiring — it was evidence of inevitable success. Result: Two premium exits within 3 years."
      },
      'Market Presence': {
        challenge: "BioPlus didn't just improve their operations — they made sure the market could see their excellence: Digital transformation (award-winning website rebuild), Sales enablement (new decks, case studies, and tools that equipped reps to win in disrupted markets), Customer experience innovation (co-creation programs with patients and providers that built advocacy), and New revenue channels (direct-to-consumer program that added millions in gross profit).",
        results: "These weren't \"nice to haves\" — they were the engine that delivered 13 consecutive quarters of growth and made BioPlus irresistible to premium acquirers."
      }
    };
    return stories[domainName];
  };

  if (screen === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50">
        <div className={`max-w-5xl mx-auto px-4 ${isMobile ? 'py-6' : 'py-12'}`}>
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4" style={{ backgroundColor: '#E2EEF2', color: '#34296A' }}>
              For PE-Backed & Mid-Market Healthtech CEOs
            </div>
            <h1 className={`${isMobile ? 'text-4xl' : 'text-5xl md:text-6xl'} font-bold mb-6`} style={{ color: '#34296A' }}>
              Are You Exit Ready?
            </h1>
            <p className={`${isMobile ? 'text-lg' : 'text-xl md:text-2xl'} text-gray-700 mb-8 max-w-3xl mx-auto`}>
              In 5-7 minutes, see how your company stacks up against what premium buyers look for — and what gaps might be costing you millions.
            </p>
          </div>

          <div className={`bg-white rounded-2xl shadow-xl ${isMobile ? 'p-6' : 'p-8 md:p-12'} mb-8`}>
            <p className="text-lg text-gray-700 mb-8">
              If you're planning to exit in the next 12–36 months, your brand clarity, market position, and growth story can make or break your valuation. The <strong>Exit Readiness Scorecard™</strong> reveals where you're strong, where you're vulnerable, and what to fix before you enter the deal room.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div className="flex items-start">
                <div className="rounded-lg p-3 mr-4" style={{ backgroundColor: '#E2EEF2' }}>
                  <Clock className="w-6 h-6" style={{ color: '#009DB9' }} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Takes 5-7 minutes</h3>
                  <p className="text-gray-600 text-sm">10 questions across 5 critical domains</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="rounded-lg p-3 mr-4" style={{ backgroundColor: '#E2EEF2' }}>
                  <BarChart3 className="w-6 h-6" style={{ color: '#009DB9' }} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Instant score with detailed breakdown</h3>
                  <p className="text-gray-600 text-sm">See your results immediately with clear visuals</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="rounded-lg p-3 mr-4" style={{ backgroundColor: '#E2EEF2' }}>
                  <Target className="w-6 h-6" style={{ color: '#009DB9' }} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Benchmarked against buyer expectations</h3>
                  <p className="text-gray-600 text-sm">Compare your readiness to real exits and acquisition standards</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="rounded-lg p-3 mr-4" style={{ backgroundColor: '#E2EEF2' }}>
                  <CheckCircle className="w-6 h-6" style={{ color: '#009DB9' }} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Built for healthtech and pharmacy leaders</h3>
                  <p className="text-gray-600 text-sm">Based on real exits and proven market strategies</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setScreen('quiz')}
                className={`text-white ${isMobile ? 'px-8 py-4' : 'px-10 py-5'} rounded-lg font-bold ${isMobile ? 'text-base' : 'text-lg'} hover:opacity-90 transition inline-flex items-center shadow-lg`}
                style={{ backgroundColor: '#34296A' }}
              >
                Start My Exit Readiness Scorecard
                <ArrowRight className="ml-3 w-6 h-6" />
              </button>
              <p className="text-sm text-gray-500 mt-4">No credit card required • Results delivered instantly</p>
            </div>
          </div>

          <div className="text-center text-gray-600">
            <p className="text-sm">
              Created by Legacy DNA — trusted by PE-backed healthtech companies preparing for successful exits
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'fullResults') {
    const analysis = getAnalysis();
    const getScoreColor = (score) => {
      if (score >= 4) return 'text-green-600 bg-green-50';
      if (score >= 2.5) return 'text-yellow-600 bg-yellow-50';
      return 'text-red-600 bg-red-50';
    };
    const getGapColor = (gap) => {
      if (gap <= 1) return 'bg-green-500';
      if (gap <= 2.5) return 'bg-yellow-500';
      return 'bg-red-500';
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl p-4 mb-6 flex items-center justify-between shadow-lg">
            <div className="flex items-center">
              <Mail className="w-6 h-6 mr-3" />
              <div>
                <p className="font-semibold">Your PDF report is on its way!</p>
                <p className="text-sm text-teal-50">Check your inbox at {email} for your downloadable Exit Readiness Report.</p>
              </div>
            </div>
            <Download className="w-6 h-6" />
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Complete Exit Readiness Report</h1>
            <p className="text-gray-600 mb-8">Here's your detailed analysis of how your brand, story, and market presence stack up against what buyers look for at exit.</p>

            <div className="rounded-xl p-8 text-white mb-8" style={{ background: 'linear-gradient(135deg, #34296A 0%, #4E72B8 100%)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm uppercase tracking-wide mb-2">Exit Readiness Score</p>
                  <p className="text-6xl font-bold">{analysis.overallScore}</p>
                  <p className="text-purple-100 mt-2">out of 100</p>
                  <p className="text-white font-semibold mt-3 text-xl">{getScoreCategory(analysis.overallScore)}</p>
                  <p className="text-purple-100 text-sm mt-2">{getScoreInterpretation(analysis.overallScore)}</p>
                </div>
                <TrendingUp className="w-24 h-24 opacity-20" />
              </div>
            </div>

            <div className="rounded-xl p-6 mb-8" style={{ backgroundColor: '#E2EEF2' }}>
              <p className="text-gray-700 mb-2">
                <strong>Your strongest area is {analysis.strongest.domain} ({analysis.strongest.displayScore})</strong>, and your biggest opportunity is <strong>{analysis.weakest.domain} ({analysis.weakest.displayScore})</strong>.
              </p>
              <p className="text-gray-700">
                Below, see how your company compares to top performers in each domain — and what you can do to close the gaps.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Exit Readiness Scorecard™</h2>
            <div className="overflow-x-auto mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Domain</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Your Score</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Gap to 5</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Buyer Signal</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Risk if Weak</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.domainData.map((domain, idx) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="py-4 px-4 font-medium text-gray-900">{domain.domain}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full font-bold ${getScoreColor(domain.score)}`}>
                          {domain.displayScore}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className={`h-2 rounded-full ${getGapColor(domain.gap)}`}
                              style={{ width: `${(domain.gap / 5) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-700">{domain.gap.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{domain.buyerSignal}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{domain.risk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Domain Breakdowns */}
            {analysis.domainData.map((domain, idx) => {
              const bioPlus = getBioPlus(domain.domain);
              return (
                <div key={idx} className="mb-8 pb-8 border-b border-gray-200 last:border-0">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{domain.domain}</h3>
                  <p className="text-lg font-semibold mb-4" style={{ color: '#34296A' }}>Your Score: {domain.displayScore}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-2">Why This Matters for Exit:</h4>
                    <p className="text-gray-700 mb-4">
                      {domain.domain === 'Customer Clarity' && "Buyers pay premiums for companies that dominate specific segments, not those that serve \"everyone.\" When you can prove you own a segment — with documented personas, validated buying criteria, and segment-specific strategies — you eliminate buyer concerns about market risk."}
                      {domain.domain === 'Messaging Strength' && "When buyers conduct diligence, they interview your team, customers, and partners. If those conversations reveal inconsistent or unclear messaging, it signals weak leadership alignment and market confusion — both of which destroy valuation. Companies with crisp, validated messaging close deals 30% faster and command higher multiples."}
                      {domain.domain === 'Brand Positioning' && "Buyers research you long before they reach out. If you're not appearing in search results, industry publications, or analyst reports, you're losing deals before conversations start. Category leaders get inbound interest and premium multiples. Followers get commoditized offers."}
                      {domain.domain === 'Corporate Story' && "Buyers don't acquire your current revenue — they acquire your trajectory. If you can't articulate where you're going (specific 3-year targets) and prove you'll get there (retention rates, pipeline, competitive wins), buyers discount your valuation by 30-50%. A compelling corporate story turns \"interesting company\" into \"must-have acquisition.\""}
                      {domain.domain === 'Market Presence' && "Your market-facing assets — website, pitch deck, case studies, demo — are evaluated during diligence. If they're outdated, generic, or unconvincing, buyers assume the rest of your business is too. Top-performing companies have exceptional materials that shorten sales cycles and signal operational excellence."}
                    </p>
                  </div>

                  <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: '#E2EEF2' }}>
                    <h4 className="font-bold text-gray-900 mb-3">What Top Performers Do: The BioPlus Story</h4>
                    <p className="text-gray-700 mb-3">{bioPlus.challenge}</p>
                    <p className="text-gray-700">{bioPlus.results}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-3">Your Opportunity:</h4>
                    <p className="text-gray-700">{getDomainOpportunity(domain.domain, domain.score)}</p>
                  </div>
                </div>
              );
            })}

            <div className="space-y-4 mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Turn Insight Into Action</h3>
              <p className="text-gray-700 mb-6">You now know where you stand — and where you're vulnerable. The next step is turning these insights into a roadmap that strengthens your position and increases what buyers will pay.</p>
              
              <div className="space-y-4">
                <div className="border-2 rounded-xl p-6" style={{ borderColor: '#34296A' }}>
                  <h4 className="font-bold text-lg mb-2" style={{ color: '#34296A' }}>Book My Exit Readiness Diagnostic™</h4>
                  <p className="text-gray-600 text-sm mb-4">Get 2 growth levers and 1 red flag personalized to your company — 30 minutes, zero obligation</p>
                  <a 
                    href="https://calendly.com/drroxietime/exit-readiness-diagnostic"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
                    style={{ backgroundColor: '#34296A' }}
                  >
                    Book Diagnostic Session
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                </div>

                <div className="border-2 rounded-xl p-6" style={{ borderColor: '#009DB9' }}>
                  <h4 className="font-bold text-lg mb-2" style={{ color: '#009DB9' }}>Explore the Exit Readiness Sprint™</h4>
                  <p className="text-gray-600 text-sm mb-4">See how we help healthtech leaders close readiness gaps in 90 days</p>
                  <a 
                    href="https://www.legacy-dna.com/exit-readiness-sprint"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-white border-2 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                    style={{ borderColor: '#009DB9', color: '#009DB9' }}
                  >
                    Learn About the Sprint
                    <ArrowRight className="ml-2 w-5 h-5" />
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Exit Readiness Score</h1>
            <p className="text-gray-600 mb-8">Here's your overall readiness assessment based on your responses.</p>

            <div className="rounded-xl p-8 text-white mb-8" style={{ background: 'linear-gradient(135deg, #34296A 0%, #4E72B8 100%)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm uppercase tracking-wide mb-2">Your Score</p>
                  <p className="text-7xl font-bold mb-2">{score}</p>
                  <p className="text-purple-100 text-sm mb-3">out of 100</p>
                  <div className="bg-white bg-opacity-20 inline-block px-4 py-2 rounded-lg">
                    <p className="text-2xl font-bold text-white">{scoreCategory}</p>
                  </div>
                </div>
                <TrendingUp className="w-32 h-32 opacity-20" />
              </div>
            </div>

            <div className="rounded-xl p-6 mb-8" style={{ backgroundColor: '#E2EEF2' }}>
              <p className="text-gray-700 text-lg">
                Based on your responses, you've built a <strong>{scoreCategory.toLowerCase()}</strong> foundation. Your strongest area is <strong>{analysis.strongest.domain}</strong>, while <strong>{analysis.weakest.domain}</strong> represents your biggest opportunity to increase how buyers perceive your value.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                <Lock className="w-full h-full" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Unlock Your Full Scorecard</h2>
              <p className="text-gray-700 mb-6">See your complete breakdown across all 5 domains, learn what top performers are doing differently, and get specific recommendations to strengthen your position before your next funding or exit event.</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start text-gray-700">
                  <CheckCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" style={{ color: '#009DB9' }} />
                  <span><strong>Domain-by-domain scoring</strong> across all 5 critical areas</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <CheckCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" style={{ color: '#009DB9' }} />
                  <span><strong>BioPlus case studies</strong> showing what worked for their $2B exit</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <CheckCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" style={{ color: '#009DB9' }} />
                  <span><strong>Personalized recommendations</strong> for each domain based on your score</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <CheckCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" style={{ color: '#009DB9' }} />
                  <span><strong>Downloadable PDF report</strong> emailed to you for sharing with your team</span>
                </li>
              </ul>

              <div className="relative">
                <div className="filter blur-sm opacity-60 pointer-events-none select-none">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-sm font-semibold text-gray-700 mb-2">Exit Readiness Scorecard™ Preview</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                        <span className="text-xs">Customer Clarity</span>
                        <div className="w-16 h-2 bg-gray-300 rounded"></div>
                      </div>
                      <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                        <span className="text-xs">Messaging Strength</span>
                        <div className="w-16 h-2 bg-gray-300 rounded"></div>
                      </div>
                      <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                        <span className="text-xs">Brand Positioning</span>
                        <div className="w-16 h-2 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white rounded-lg shadow-lg p-3" style={{ color: '#34296A' }}>
                    <Lock className="w-8 h-8" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl p-8" style={{ backgroundColor: '#E2EEF2' }}>
              <div className="flex items-center mb-4">
                <Mail className="w-6 h-6 mr-3" style={{ color: '#009DB9' }} />
                <h3 className="text-xl font-bold text-gray-900">Get Your Complete Exit Readiness Report</h3>
              </div>
              <p className="text-gray-700 mb-6">Enter your email and we'll send you the full scorecard, detailed gap analysis, and downloadable PDF report.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: '#009DB9' }}
                    placeholder="your@email.com"
                  />
                </div>
                <button
                  onClick={() => setScreen('fullResults')}
                  disabled={!email || !email.includes('@')}
                  className="w-full text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center text-lg"
                  style={{ backgroundColor: '#34296A' }}
                >
                  Show My Full Results
                  <ArrowRight className="ml-2 w-6 h-6" />
                </button>
                <p className="text-xs text-gray-500 text-center">We'll also send you a downloadable PDF version for your records.</p>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 flex items-center justify-center p-4">
      <div className={`${isMobile ? 'w-full' : 'max-w-3xl w-full'} bg-white rounded-2xl shadow-xl ${isMobile ? 'p-6' : 'p-8'}`}>
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentStep + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, backgroundColor: '#009DB9' }}
            ></div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-semibold uppercase tracking-wide mb-2" style={{ color: '#009DB9' }}>
            {currentQuestion.domain} • {currentQuestion.title}
          </h3>
          <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900 mb-4`}>
            {currentQuestion.question}
          </h2>
          <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-600`}>
            {currentQuestion.description}
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {currentQuestion.options.map((option) => (
            <button
              key={option.value}
              onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion.id]: option.value }))}
              className={`w-full text-left ${isMobile ? 'px-4 py-3' : 'px-6 py-4'} rounded-lg border-2 transition ${
                currentAnswer === option.value ? 'bg-purple-50' : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
              }`}
              style={currentAnswer === option.value ? { borderColor: '#34296A' } : {}}
            >
              <div className="flex items-center">
                <span className={`${isMobile ? 'w-7 h-7 text-sm' : 'w-8 h-8'} rounded-full border-2 flex items-center justify-center ${isMobile ? 'mr-3' : 'mr-4'} text-white font-semibold ${
                  currentAnswer === option.value ? '' : 'border-gray-300 text-gray-400'
                }`}
                style={currentAnswer === option.value ? { borderColor: '#34296A', backgroundColor: '#34296A' } : {}}
                >
                  {option.value}
                </span>
                <span className={`font-medium ${isMobile ? 'text-sm' : 'text-base'} ${currentAnswer === option.value ? 'text-gray-900' : 'text-gray-700'}`}>
                  {option.label}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className={`${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3'} border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition`}
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
            className={`flex-1 text-white ${isMobile ? 'px-6 py-2 text-sm' : 'px-8 py-3'} rounded-lg font-semibold hover:opacity-90 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center`}
            style={{ backgroundColor: '#34296A' }}
          >
            {currentStep === questions.length - 1 ? 'See My Score' : 'Next Question'}
            <ArrowRight className={`ml-2 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExitReadinessScorecard;
