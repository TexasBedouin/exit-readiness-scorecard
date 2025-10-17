import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles for the PDF - OPTIMIZED FOR SPACE EFFICIENCY
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Times-Roman',
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 12,
    borderBottom: 2,
    borderBottomColor: '#34296A',
    paddingBottom: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Times-Bold',
    color: '#34296A',
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 11,
    color: '#009DB9',
    marginBottom: 0,
  },
  scoreSection: {
    backgroundColor: '#E2EEF2',
    padding: 12,
    borderRadius: 5,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreLeft: {
    flex: 1,
  },
  scoreRight: {
    alignItems: 'center',
    paddingLeft: 20,
  },
  scoreLabel: {
    fontSize: 11,
    color: '#34296A',
    marginBottom: 3,
    fontFamily: 'Times-Bold',
  },
  scoreValue: {
    fontSize: 32,
    color: '#009DB9',
    fontFamily: 'Times-Bold',
    marginBottom: 0,
  },
  scoreMax: {
    fontSize: 12,
    color: '#666666',
  },
  scoreBadge: {
    fontSize: 10,
    color: '#34296A',
    marginTop: 4,
    fontFamily: 'Times-Bold',
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Times-Bold',
    color: '#34296A',
    marginBottom: 8,
    borderBottom: 1.5,
    borderBottomColor: '#009DB9',
    paddingBottom: 3,
  },
  heatmapContainer: {
    marginBottom: 0,
  },
  heatmapRow: {
    flexDirection: 'row',
    borderBottom: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 6,
  },
  heatmapHeader: {
    backgroundColor: '#34296A',
    paddingVertical: 7,
    paddingHorizontal: 6,
    flexDirection: 'row',
  },
  heatmapHeaderText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Times-Bold',
  },
  domainCell: {
    width: '40%',
    paddingRight: 8,
    fontSize: 9.5,
    color: '#333333',
    fontFamily: 'Times-Bold',
  },
  scoreCell: {
    width: '15%',
    textAlign: 'center',
    fontSize: 9.5,
    fontFamily: 'Times-Bold',
  },
  gapCell: {
    width: '15%',
    textAlign: 'center',
    fontSize: 9,
    color: '#666666',
  },
  signalCell: {
    width: '30%',
    fontSize: 8.5,
    color: '#333333',
  },
  analysisText: {
    fontSize: 9.5,
    lineHeight: 1.5,
    color: '#333333',
    marginBottom: 8,
  },
  domainSection: {
    marginBottom: 0,
  },
  domainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottom: 2,
    borderBottomColor: '#34296A',
    paddingBottom: 6,
  },
  domainTitle: {
    fontSize: 15,
    fontFamily: 'Times-Bold',
    color: '#34296A',
  },
  domainScore: {
    fontSize: 11,
    color: '#009DB9',
    fontFamily: 'Times-Bold',
  },
  subsectionTitle: {
    fontSize: 10.5,
    fontFamily: 'Times-Bold',
    color: '#111827',
    marginBottom: 5,
    marginTop: 0,
  },
  greyBox: {
    backgroundColor: '#E2EEF2',
    padding: 10,
    borderRadius: 4,
    marginTop: 10,
    marginBottom: 10,
  },
  lightGreyBox: {
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 4,
    marginTop: 10,
    marginBottom: 10,
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 10,
  },
  column: {
    flex: 1,
  },
  ctaSection: {
    backgroundColor: '#34296A',
    padding: 15,
    borderRadius: 6,
    marginTop: 15,
    marginBottom: 12,
  },
  ctaTitle: {
    fontSize: 12,
    fontFamily: 'Times-Bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  ctaText: {
    fontSize: 9.5,
    color: '#FFFFFF',
    lineHeight: 1.5,
    marginBottom: 10,
  },
  ctaButton: {
    backgroundColor: '#009DB9',
    padding: 8,
    borderRadius: 3,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontFamily: 'Times-Bold',
  },
  footer: {
    borderTop: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 8,
    marginTop: 15,
  },
  footerText: {
    fontSize: 8,
    color: '#666666',
    textAlign: 'center',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 15,
    right: 30,
    fontSize: 8,
    color: '#666666',
  },
});

// Helper function to get color for score
const getScoreColor = (score) => {
  if (score < 2.5) return '#E74C3C';
  if (score < 4) return '#F39C12';
  return '#27AE60';
};

const getScoreCategory = (score) => {
  if (score >= 80) return 'Exit Ready';
  if (score >= 60) return 'Solid Foundation with Key Gaps';
  return 'Exit Vulnerable';
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

const getBioPlusStory = (domainName) => {
  const stories = {
    'Customer Clarity': {
      challenge: "BioPlus Specialty Pharmacy faced exactly this challenge. They were serving \"patients\" - which meant competing with every pharmacy in America. Working with Legacy DNA, they identified three high-value segments: oncology patients needing rapid access, specialty providers requiring seamless integration, and pharma partners seeking distribution excellence.",
      results: "By tailoring their approach to each segment, BioPlus achieved: #1 ranking in oncology specialty pharmacy care (by both patients and prescribers), Named one of Money Magazine's 5 Best Online Pharmacies - the only specialty pharmacy ever chosen, and 78,000 to 325,000 dispenses in seven years (22.5% CAGR). They went from commodity player to category leader - and sold twice at premium multiples."
    },
    'Messaging Strength': {
      challenge: "BioPlus had a powerful service but couldn't articulate what made them different. Legacy DNA worked with their leadership to create The Power of 2: 2-Hour Patient Acceptance Guarantee, 2-Day Ready to Ship, 2-Click Refills - all anchored by a vision to \"heal the world 2gether.\" This wasn't just a tagline - it became the operational rallying cry. Every employee, every customer touchpoint, every sales conversation reinforced the same message.",
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

const getWhyItMatters = (domainName) => {
  const matters = {
    'Customer Clarity': "Buyers pay premiums for companies that dominate specific segments, not those that serve \"everyone.\" When you can prove you own a segment - with documented personas, validated buying criteria, and segment-specific strategies - you eliminate buyer concerns about market risk.",
    'Messaging Strength': "When buyers conduct diligence, they interview your team, customers, and partners. If those conversations reveal inconsistent or unclear messaging, it signals weak leadership alignment and market confusion - both of which destroy valuation. Companies with crisp, validated messaging close deals 30% faster and command higher multiples.",
    'Brand Positioning': "Buyers research you long before they reach out. If you're not appearing in search results, industry publications, or analyst reports, you're losing deals before conversations start. Category leaders get inbound interest and premium multiples. Followers get commoditized offers.",
    'Corporate Story': "Buyers don't acquire your current revenue - they acquire your trajectory. If you can't articulate where you're going (specific 3-year targets) and prove you'll get there (retention rates, pipeline, competitive wins), buyers discount your valuation by 30-50%. A compelling corporate story turns \"interesting company\" into \"must-have acquisition.\"",
    'Market Presence': "Your market-facing assets - website, pitch deck, case studies, demo - are evaluated during diligence. If they're outdated, generic, or unconvincing, buyers assume the rest of your business is too. Top-performing companies have exceptional materials that shorten sales cycles and signal operational excellence."
  };
  return matters[domainName];
};

const ExitReadinessPDF = ({ domainData, overallScore, userEmail, userName }) => {
  return (
    <Document>
      {/* Page 1: Header, Overall Score, Scorecard Table, Summary */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Exit Readiness Scorecard™</Text>
          <Text style={styles.subtitle}>Comprehensive Assessment Report</Text>
          {userName && <Text style={{ fontSize: 10, color: '#666666', marginTop: 2 }}>Prepared for: {userName}</Text>}
        </View>

        {/* Overall Score Section - More Compact Layout */}
        <View style={styles.scoreSection}>
          <View style={styles.scoreLeft}>
            <Text style={styles.scoreLabel}>Your Exit Readiness Score</Text>
            <Text style={{ fontSize: 9, color: '#666666', lineHeight: 1.4 }}>
              Based on your responses across 5 critical domains, here's how your company compares to what premium buyers look for.
            </Text>
          </View>
          <View style={styles.scoreRight}>
            <Text style={styles.scoreValue}>{overallScore}</Text>
            <Text style={styles.scoreMax}>out of 100</Text>
            <Text style={styles.scoreBadge}>
              {getScoreCategory(overallScore)}
            </Text>
          </View>
        </View>

        {/* Heatmap Section - Tighter Layout */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Domain Scores</Text>
          <View style={styles.heatmapContainer}>
            {/* Header Row */}
            <View style={styles.heatmapHeader}>
              <Text style={[styles.heatmapHeaderText, { width: '40%' }]}>Domain</Text>
              <Text style={[styles.heatmapHeaderText, { width: '15%', textAlign: 'center' }]}>Score</Text>
              <Text style={[styles.heatmapHeaderText, { width: '15%', textAlign: 'center' }]}>Gap</Text>
              <Text style={[styles.heatmapHeaderText, { width: '30%' }]}>Buyer Signal</Text>
            </View>
            
            {/* Data Rows */}
            {domainData.map((domain, index) => (
              <View key={index} style={styles.heatmapRow}>
                <Text style={styles.domainCell}>{domain.domain}</Text>
                <Text style={[styles.scoreCell, { color: getScoreColor(domain.score) }]}>
                  {domain.displayScore}
                </Text>
                <Text style={styles.gapCell}>
                  {domain.gap.toFixed(1)}
                </Text>
                <Text style={styles.signalCell}>{domain.buyerSignal}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Summary Analysis - More Concise */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Insights</Text>
          <Text style={styles.analysisText}>
            <Text style={{ fontFamily: 'Times-Bold' }}>Strongest Area: </Text>
            {domainData.reduce((max, d) => d.score > max.score ? d : max).domain} ({domainData.reduce((max, d) => d.score > max.score ? d : max).displayScore})
          </Text>
          <Text style={styles.analysisText}>
            <Text style={{ fontFamily: 'Times-Bold' }}>Biggest Opportunity: </Text>
            {domainData.reduce((min, d) => d.score < min.score ? d : min).domain} ({domainData.reduce((min, d) => d.score < min.score ? d : min).displayScore})
          </Text>
        </View>

        {/* Overall Analysis - Condensed */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Exit Readiness Analysis</Text>
          
          {overallScore >= 80 ? (
            <Text style={styles.analysisText}>
              Congratulations! Your company demonstrates strong exit readiness across multiple domains. You're well-positioned for a premium acquisition when the time is right. Your strong positioning indicates a company that buyers will see as a strategic asset, and your messaging strength creates confidence that you can execute on your vision. Focus on maintaining momentum and documenting your successes.
            </Text>
          ) : overallScore >= 60 ? (
            <Text style={styles.analysisText}>
              Your company shows solid foundations with key gaps that could cost you 20-40% in valuation. With focused improvements in the identified areas, you can significantly increase your attractiveness to buyers. Prioritize domains scoring below 4/10 - these gaps are visible to buyers during diligence and represent your highest-impact opportunities.
            </Text>
          ) : (
            <Text style={styles.analysisText}>
              Your assessment reveals significant opportunities to enhance your exit readiness. Critical gaps exist that could reduce your valuation by 40-60% or prevent a deal from closing entirely. Immediate focus should be on domains scoring below 3/10 - these are potential deal breakers. A 12-24 month improvement plan with expert guidance is strongly recommended before pursuing an exit.
            </Text>
          )}
        </View>

        <Text style={styles.pageNumber}>Page 1 of {domainData.length + 2}</Text>
      </Page>

      {/* Pages 2+: Detailed Domain Analysis - More Compact */}
      {domainData.map((domain, idx) => {
        const bioPlus = getBioPlusStory(domain.domain);
        const whyMatters = getWhyItMatters(domain.domain);
        
        return (
          <Page key={idx} size="A4" style={styles.page}>
            {/* Domain Header - Single Line */}
            <View style={styles.domainHeader}>
              <Text style={styles.domainTitle}>{domain.domain}</Text>
              <Text style={styles.domainScore}>Score: {domain.displayScore}</Text>
            </View>
            
            <View style={styles.domainSection}>
              {/* Why This Matters */}
              <Text style={styles.subsectionTitle}>Why This Matters for Exit:</Text>
              <Text style={styles.analysisText}>{whyMatters}</Text>
              
              {/* BioPlus Story - Condensed */}
              <View style={styles.greyBox}>
                <Text style={[styles.subsectionTitle, { marginBottom: 4 }]}>What Top Performers Do: The BioPlus Story</Text>
                <Text style={[styles.analysisText, { marginBottom: 5, fontSize: 9 }]}>{bioPlus.challenge}</Text>
                <Text style={[styles.analysisText, { marginBottom: 0, fontSize: 9 }]}>{bioPlus.results}</Text>
              </View>
              
              {/* Your Opportunity */}
              <View style={styles.lightGreyBox}>
                <Text style={[styles.subsectionTitle, { marginBottom: 4 }]}>Your Opportunity:</Text>
                <Text style={[styles.analysisText, { marginBottom: 0 }]}>{getDomainOpportunity(domain.domain, domain.score)}</Text>
              </View>
            </View>

            <Text style={styles.pageNumber}>Page {idx + 2} of {domainData.length + 2}</Text>
          </Page>
        );
      })}

      {/* Final Page: CTA - More Compact */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Turn Insight Into Action</Text>
          <Text style={styles.analysisText}>
            You now know where you stand and where you're vulnerable. The next step is turning these insights into a roadmap that strengthens your position and increases what buyers will pay.
          </Text>
        </View>

        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Book Your Exit Readiness Diagnostic™</Text>
          <Text style={styles.ctaText}>
            Get 2 growth levers and 1 red flag personalized to your company - 30 minutes, zero obligation. Schedule your complimentary diagnostic to dive deeper into your results and create a customized action plan.
          </Text>
          <View style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>
              calendly.com/drroxietime/exit-readiness-diagnostic
            </Text>
          </View>
        </View>

        <View style={[styles.ctaSection, { backgroundColor: '#009DB9', marginTop: 12 }]}>
          <Text style={styles.ctaTitle}>Explore the Exit Readiness Sprint™</Text>
          <Text style={styles.ctaText}>
            See how we help healthtech leaders close readiness gaps in 90 days and maximize their exit value.
          </Text>
          <View style={[styles.ctaButton, { backgroundColor: '#FFFFFF' }]}>
            <Text style={[styles.ctaButtonText, { color: '#009DB9' }]}>
              www.legacy-dna.com/exit-readiness-sprint
            </Text>
          </View>
        </View>

        {/* Additional Resources Section */}
        <View style={[styles.section, { marginTop: 15 }]}>
          <Text style={styles.sectionTitle}>About Legacy DNA</Text>
          <Text style={styles.analysisText}>
            Legacy DNA specializes in helping PE-backed healthtech CEOs maximize exit value. We've helped pharmacy, specialty care, and health tech companies increase valuations by 20-60% through strategic positioning, messaging clarity, and market presence optimization. Our clients have achieved multiple premium exits, including BioPlus Specialty Pharmacy's successful sale to both Nautic Partners and Elevance Health.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2025 Legacy DNA | Growth for Health Innovators | www.legacy-dna.com
          </Text>
          {userEmail && (
            <Text style={[styles.footerText, { marginTop: 3 }]}>
              Report generated for: {userEmail}
            </Text>
          )}
        </View>

        <Text style={styles.pageNumber}>Page {domainData.length + 2} of {domainData.length + 2}</Text>
      </Page>
    </Document>
  );
};

export default ExitReadinessPDF;
