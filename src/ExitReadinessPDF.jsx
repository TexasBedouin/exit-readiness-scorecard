import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles for the PDF
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottom: '3 solid #34296A',
    paddingBottom: 20,
  },
  logo: {
    width: 200,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'right',
  },
  titleSection: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#E2EEF2',
    borderRadius: 8,
  },
  mainTitle: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#34296A',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 1.5,
  },
  scoreSection: {
    marginBottom: 30,
    padding: 25,
    backgroundColor: '#34296A',
    borderRadius: 8,
  },
  scoreLabel: {
    fontSize: 10,
    color: '#E2EEF2',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  scoreNumber: {
    fontSize: 48,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  scoreOutOf: {
    fontSize: 12,
    color: '#E2EEF2',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#34296A',
    marginBottom: 15,
    marginTop: 20,
  },
  table: {
    marginBottom: 25,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '2 solid #34296A',
    paddingBottom: 8,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #E2EEF2',
    paddingVertical: 10,
  },
  tableColDomain: {
    width: '25%',
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
  },
  tableColScore: {
    width: '15%',
    fontSize: 10,
    textAlign: 'center',
  },
  tableColGap: {
    width: '15%',
    fontSize: 10,
    textAlign: 'center',
  },
  tableColSignal: {
    width: '22.5%',
    fontSize: 9,
    color: '#6b7280',
  },
  tableColRisk: {
    width: '22.5%',
    fontSize: 9,
    color: '#6b7280',
  },
  tableHeaderText: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#34296A',
  },
  scoreBox: {
    padding: 5,
    borderRadius: 4,
    textAlign: 'center',
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  scoreGreen: {
    backgroundColor: '#f0fdf4',
    color: '#059669',
  },
  scoreYellow: {
    backgroundColor: '#fefce8',
    color: '#d97706',
  },
  scoreRed: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
  },
  analysisBox: {
    backgroundColor: '#E2EEF2',
    padding: 20,
    borderRadius: 8,
    marginBottom: 25,
  },
  analysisTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#34296A',
    marginBottom: 12,
  },
  analysisText: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.6,
    marginBottom: 8,
  },
  ctaSection: {
    marginTop: 25,
  },
  ctaBox: {
    border: '2 solid #34296A',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  ctaTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#34296A',
    marginBottom: 5,
  },
  ctaText: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 1.4,
  },
  ctaLink: {
    fontSize: 9,
    color: '#009DB9',
    fontFamily: 'Helvetica-Bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: '1 solid #E2EEF2',
    paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 8,
    color: '#6b7280',
  },
  footerBold: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#34296A',
  },
});

const ExitReadinessPDF = ({ email, score, domainData, analysis }) => {
  const getScoreStyle = (score) => {
    if (score >= 4) return styles.scoreGreen;
    if (score === 3) return styles.scoreYellow;
    return styles.scoreRed;
  };

  const getScoreRange = (score) => {
    if (score >= 80) return 'Strong Exit Readiness';
    if (score >= 60) return 'Solid Foundation with Key Gaps';
    if (score >= 40) return 'Significant Work Needed';
    return 'Critical Gaps Requiring Immediate Action';
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Exit Readiness Scorecard™ Report</Text>
          <Text style={styles.headerText}>Legacy DNA - Growth for Health Innovators</Text>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Your Complete Exit Readiness Report</Text>
          <Text style={styles.subtitle}>
            Detailed analysis of how your brand, story, and market presence stack up against what buyers look for at exit.
          </Text>
          <Text style={[styles.subtitle, { marginTop: 10 }]}>
            Prepared for: {email}
          </Text>
        </View>

        {/* Score Section */}
        <View style={styles.scoreSection}>
          <Text style={styles.scoreLabel}>Exit Readiness Score</Text>
          <Text style={styles.scoreNumber}>{score}</Text>
          <Text style={styles.scoreOutOf}>out of 100</Text>
          <Text style={[styles.scoreOutOf, { marginTop: 10, fontSize: 14, fontFamily: 'Helvetica-Bold' }]}>
            {getScoreRange(score)}
          </Text>
        </View>

        {/* Heatmap Table */}
        <Text style={styles.sectionTitle}>Exit Readiness Heatmap™</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableColDomain, styles.tableHeaderText]}>Domain</Text>
            <Text style={[styles.tableColScore, styles.tableHeaderText]}>Your Score</Text>
            <Text style={[styles.tableColGap, styles.tableHeaderText]}>Gap to 5</Text>
            <Text style={[styles.tableColSignal, styles.tableHeaderText]}>Buyer Signal</Text>
            <Text style={[styles.tableColRisk, styles.tableHeaderText]}>Risk if Weak</Text>
          </View>
          
          {domainData.map((domain, idx) => (
            <View style={styles.tableRow} key={idx}>
              <Text style={styles.tableColDomain}>{domain.domain}</Text>
              <View style={styles.tableColScore}>
                <Text style={[styles.scoreBox, getScoreStyle(domain.score)]}>
                  {domain.score}/5
                </Text>
              </View>
              <Text style={styles.tableColGap}>{domain.gap}</Text>
              <Text style={styles.tableColSignal}>{domain.buyerSignal}</Text>
              <Text style={styles.tableColRisk}>{domain.risk}</Text>
            </View>
          ))}
        </View>

        {/* Analysis Section */}
        <View style={styles.analysisBox}>
          <Text style={styles.analysisTitle}>Your Personalized Analysis</Text>
          
          {!analysis.allEqual ? (
            <>
              <Text style={styles.analysisText}>
                ✓ Your strongest area is {analysis.strongest.domain} ({analysis.strongest.score}/5), signaling solid buyer alignment in this area.
              </Text>
              <Text style={styles.analysisText}>
                ✗ Your biggest gap is {analysis.weakest.domain} ({analysis.weakest.score}/5). Companies that strengthen this area typically improve valuation multiples by 20-40%.
              </Text>
            </>
          ) : (
            <Text style={styles.analysisText}>
              ✓ Your readiness is consistent across all areas at {analysis.equalScore}/5. {analysis.equalScore === 5 ? 'Excellent work maintaining strong alignment across all domains.' : 'Focus on elevating all areas together to strengthen your overall exit position.'}
            </Text>
          )}
          
          <Text style={[styles.analysisText, { marginTop: 10 }]}>
            Closing these gaps will move you closer to exit-ready status and position you as a clear market leader.
          </Text>
        </View>

        {/* CTA Section */}
        <Text style={styles.sectionTitle}>Turn Insight Into Action</Text>
        
        <View style={styles.ctaBox}>
          <Text style={styles.ctaTitle}>Book My Exit Readiness Diagnostic™</Text>
          <Text style={styles.ctaText}>
            Get 2 growth levers and 1 red flag personalized to your company in a 30-minute session.
          </Text>
          <Text style={styles.ctaLink}>
            https://calendly.com/legacydna/discoverycall
          </Text>
        </View>

        <View style={[styles.ctaBox, { borderColor: '#009DB9' }]}>
          <Text style={[styles.ctaTitle, { color: '#009DB9' }]}>Explore the Exit Readiness Sprint™</Text>
          <Text style={styles.ctaText}>
            See if it is the right fit to accelerate your growth and close your readiness gap.
          </Text>
          <Text style={styles.ctaLink}>
            https://www.legacy-dna.com/exit-readiness-sprint
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.footerBold}>Legacy DNA</Text>
            <Text style={styles.footerText}>Growth for Health Innovators</Text>
          </View>
          <View>
            <Text style={styles.footerText}>www.legacy-dna.com</Text>
            <Text style={styles.footerText}>(c) 2025 Legacy DNA. All rights reserved.</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ExitReadinessPDF;
