import React, { useState } from 'react';
import { ArrowRight, CheckCircle, AlertCircle, TrendingUp, Lock, Mail, Clock, BarChart3, Target, Download } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ExitReadinessPDF from './ExitReadinessPDF';

const ExitReadinessScorecard = () => {
  const [screen, setScreen] = useState('welcome');
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    customerClarity: 0,
    messagingStrength: 0,
    brandPositioning: 0,
    corporateStory: 0,
    marketPresence: 0
  });
  const [email, setEmail] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const questions = [
    {
      id: 'customerClarity',
      title: 'Customer Clarity',
      question: 'How clear and validated are your top 3 customer personas?',
      description: 'Do you really know your customers? The clearer you are about their needs, motivations, and barriers, the easier it is to win and grow.',
      options: [
        { value: 1, label: 'None' },
        { value: 2, label: 'Rough, not validated' },
        { value: 3, label: 'Not aligned' },
        { value: 4, label: 'Clear, validated' },
        { value: 5, label: 'Validated and guides GTM' }
      ]
    },
    {
      id: 'messagingStrength',
      title: 'Messaging Strength',
      question: 'Do you have a message map that resonates with customers, investors, and partners?',
      description: 'Can your customers, partners, and investors quickly understand why you are different and why you win? Strong messaging builds instant confidence.',
      options: [
        { value: 1, label: 'Inconsistent' },
        { value: 2, label: 'Loose points' },
        { value: 3, label: 'Exists but weak' },
        { value: 4, label: 'Strong framework' },
        { value: 5, label: 'Differentiated and buyer-aligned' }
      ]
    },
    {
      id: 'brandPositioning',
      title: 'Brand Positioning',
      question: 'How well is your brand positioned as a category leader in your space?',
      description: 'When people think about your space, do they see you as the leader or just another option? Positioning defines your value in the market.',
      options: [
        { value: 1, label: 'Me too' },
        { value: 2, label: 'Some differentiation' },
        { value: 3, label: 'Recognized but not dominant' },
        { value: 4, label: 'Strong contender' },
        { value: 5, label: 'Clear category leader' }
      ]
    },
    {
      id: 'corporateStory',
      title: 'Corporate Story',
      question: 'Does your story connect mission, vision, and traction to enterprise value?',
      description: 'Does your story connect the dots between your vision, your traction, and the value you are building? A clear story inspires confidence and trust.',
      options: [
        { value: 1, label: 'Fragmented' },
        { value: 2, label: 'Doesn\'t land' },
        { value: 3, label: 'Internal only' },
        { value: 4, label: 'Cohesive and resonates externally' },
        { value: 5, label: 'Inspiring and valuation-aligned' }
      ]
    },
    {
      id: 'marketPresence',
      title: 'Market Presence',
      question: 'How strong are your market-facing assets (deck, PR, thought leadership, GTM orchestration)?',
      description: 'When buyers and investors look at you from the outside your deck, your PR, your visibility do you look like a market leader they cannot ignore?',
      options: [
        { value: 1, label: 'Weak' },
        { value: 2, label: 'Inconsistent' },
        { value: 3, label: 'Decent but not compelling' },
        { value: 4, label: 'Strong sometimes' },
        { value: 5, label: 'Consistently accelerates deals' }
      ]
    }
  ];

  const calculateScore = () => {
    const total = Object.values(answers).reduce((sum, val) => sum + val, 0);
    return Math.round((total / 25) * 100);
  };

  const getDomainData = () => [
    {
      domain: 'Customer Clarity',
      score: answers.customerClarity,
      gap: 5 - answers.customerClarity,
      buyerSignal: 'Clarity in adoption drivers',
      risk: 'Missed traction'
    },
    {
      domain: 'Messaging Strength',
      score: answers.messagingStrength,
      gap: 5 - answers.messagingStrength,
      buyerSignal: 'Differentiation',
      risk: 'Lower multiples'
    },
    {
      domain: 'Brand Positioning',
      score: answers.brandPositioning,
      gap: 5 - answers.brandPositioning,
      buyerSignal: 'Category leadership',
      risk: 'Me too valuation'
    },
    {
      domain: 'Corporate Story',
      score: answers.corporateStory,
      gap: 5 - answers.corporateStory,
      buyerSignal: 'Vision + traction',
      risk: 'Lost credibility'
    },
    {
      domain: 'Market Presence',
      score: answers.marketPresence,
      gap: 5 - answers.marketPresence,
      buyerSignal: 'Credibility signals',
      risk: 'Longer cycles'
    }
  ];

  const getAnalysis = () => {
    const domainData = getDomainData();
    const scores = domainData.map(d => d.score);
    const uniqueScores = [...new Set(scores)];
    
    if (uniqueScores.length === 1) {
      return {
        allEqual: true,
        overallScore: calculateScore(),
        equalScore: uniqueScores[0]
      };
    }
    
    const strongest = domainData.reduce((max, d) => d.score > max.score ? d : max);
    const weakest = domainData.reduce((min, d) => d.score < min.score ? d : min);
    
    return {
      allEqual: false,
      strongest,
      weakest,
      overallScore: calculateScore()
    };
  };

  const getScoreColor = (score) => {
    if (score >= 4) return { color: '#059669', backgroundColor: '#f0fdf4' };
    if (score === 3) return { color: '#d97706', backgroundColor: '#fefce8' };
    return { color: '#dc2626', backgroundColor: '#fef2f2' };
  };

  const getGapColor = (gap) => {
    if (gap <= 1) return '#10b981';
    if (gap === 2) return '#eab308';
    return '#ef4444';
  };

  if (screen === 'welcome') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #eff6ff, #f3e8ff, #ecfeff)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '24px 16px' : '48px 16px' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '48px' }}>
            <div style={{
              display: 'inline-block',
              padding: '8px 16px',
              borderRadius: '9999px',
              fontSize: isMobile ? '12px' : '14px',
              fontWeight: '600',
              marginBottom: '16px',
              backgroundColor: '#E2EEF2',
              color: '#34296A'
            }}>
              For PE-Backed & Mid-Market Healthtech CEOs
            </div>
            <h1 style={{
              fontSize: isMobile ? '32px' : '56px',
              fontWeight: '700',
              marginBottom: '24px',
              color: '#34296A',
              lineHeight: '1.1'
            }}>
              Are You Exit Ready?
            </h1>
            <p style={{
              fontSize: isMobile ? '16px' : '24px',
              color: '#374151',
              marginBottom: '32px',
              maxWidth: '768px',
              margin: '0 auto 32px',
              lineHeight: '1.5'
            }}>
              In 5 minutes, see how your brand, story, and market presence measure up against what buyers look for at exit.
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            padding: isMobile ? '24px 20px' : '64px 48px',
            marginBottom: '32px'
          }}>
            <p style={{
              fontSize: isMobile ? '16px' : '18px',
              color: '#374151',
              marginBottom: '32px',
              lineHeight: '1.75'
            }}>
              If you plan to exit within the next 12–36 months, your company's story and market signals can make or break your valuation. The <strong>Exit Readiness Scorecard™</strong> reveals your strengths, gaps, and opportunities to accelerate enterprise value.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: '24px',
              marginBottom: '40px'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{
                  borderRadius: '8px',
                  padding: '12px',
                  marginRight: '16px',
                  backgroundColor: '#E2EEF2'
                }}>
                  <Clock style={{ width: '24px', height: '24px', color: '#009DB9' }} />
                </div>
                <div>
                  <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>Takes less than 7 minutes</h3>
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>Quick assessment designed for busy executives</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{
                  borderRadius: '8px',
                  padding: '12px',
                  marginRight: '16px',
                  backgroundColor: '#E2EEF2'
                }}>
                  <BarChart3 style={{ width: '24px', height: '24px', color: '#009DB9' }} />
                </div>
                <div>
                  <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>Instant score and visual heatmap</h3>
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>See your results immediately with clear visuals</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{
                  borderRadius: '8px',
                  padding: '12px',
                  marginRight: '16px',
                  backgroundColor: '#E2EEF2'
                }}>
                  <Target style={{ width: '24px', height: '24px', color: '#009DB9' }} />
                </div>
                <div>
                  <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>Benchmarked against buyer expectations</h3>
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>Compare your readiness to acquisition standards</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{
                  borderRadius: '8px',
                  padding: '12px',
                  marginRight: '16px',
                  backgroundColor: '#E2EEF2'
                }}>
                  <CheckCircle style={{ width: '24px', height: '24px', color: '#009DB9' }} />
                </div>
                <div>
                  <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>Tailored for healthtech and pharmacy founders</h3>
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>Built specifically for your industry context</p>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => setScreen('quiz')}
                style={{
                  color: 'white',
                  padding: isMobile ? '16px 24px' : '20px 40px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: isMobile ? '16px' : '18px',
                  backgroundColor: '#34296A',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  transition: 'opacity 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
              >
                Start My Exit Readiness Scorecard
                <ArrowRight style={{ marginLeft: '12px', width: '24px', height: '24px' }} />
              </button>
              <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '16px' }}>No credit card required • Results delivered instantly</p>
            </div>
          </div>

          <div style={{ textAlign: 'center', color: '#6b7280' }}>
            <p style={{ fontSize: '14px' }}>
              Created by Legacy DNA — trusted by PE-backed healthtech companies preparing for successful exits
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'fullResults') {
    const analysis = getAnalysis();
    const domainData = getDomainData();

    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #eff6ff, #f3e8ff, #ecfeff)',
        padding: '16px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
          <div style={{
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            background: 'linear-gradient(135deg, #009DB9 0%, #4E72B8 100%)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Mail style={{ width: '24px', height: '24px', marginRight: '12px', flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: '600', fontSize: '18px', margin: 0 }}>Your PDF report is ready!</p>
                  <p style={{ fontSize: '14px', opacity: 0.9, margin: '4px 0 0 0' }}>Download your Exit Readiness Report below or check your inbox at <strong>{email}</strong></p>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            padding: '32px',
            marginBottom: '24px'
          }}>
            {/* Download PDF Button */}
            <div style={{ 
              marginBottom: '32px', 
              textAlign: 'center',
              padding: '20px',
              backgroundColor: '#E2EEF2',
              borderRadius: '12px'
            }}>
              <PDFDownloadLink
                document={
                  <ExitReadinessPDF 
                    email={email}
                    score={analysis.overallScore}
                    domainData={domainData}
                    analysis={analysis}
                  />
                }
                fileName={`Exit-Readiness-Report-${email.split('@')[0]}.pdf`}
                style={{
                  color: 'white',
                  padding: '16px 32px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '18px',
                  backgroundColor: '#34296A',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              >
                {({ loading }) => (
                  loading ? 'Preparing your report...' : (
                    <>
                      <Download style={{ marginRight: '12px', width: '24px', height: '24px' }} />
                      Download Your Exit Readiness Report (PDF)
                    </>
                  )
                )}
              </PDFDownloadLink>
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '12px' }}>
                Professional PDF report with your complete scorecard results
              </p>
            </div>

            <h1 style={{ fontSize: '30px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
              Your Full Exit Readiness Score: {analysis.overallScore}/100
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '32px' }}>
              Here is your detailed analysis of how your brand, story, and market presence stack up against what buyers look for at exit.
            </p>

            <div style={{
              borderRadius: '12px',
              padding: '32px',
              color: 'white',
              marginBottom: '32px',
              background: 'linear-gradient(135deg, #34296A 0%, #4E72B8 100%)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: '#e9d5ff', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                    Exit Readiness Score
                  </p>
                  <p style={{ fontSize: '60px', fontWeight: '700', margin: 0 }}>{analysis.overallScore}</p>
                  <p style={{ color: '#e9d5ff', marginTop: '8px' }}>out of 100</p>
                </div>
                <TrendingUp style={{ width: '96px', height: '96px', opacity: 0.2 }} />
              </div>
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
              Exit Readiness Heatmap™
            </h2>
            <div style={{ overflowX: 'auto', marginBottom: '32px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '600', color: '#374151' }}>Domain</th>
                    <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: '600', color: '#374151' }}>Your Score</th>
                    <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: '600', color: '#374151' }}>Gap to 5</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '600', color: '#374151' }}>Buyer Signal</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '600', color: '#374151' }}>Risk if Weak</th>
                  </tr>
                </thead>
                <tbody>
                  {domainData.map((domain, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '16px', fontWeight: '500', color: '#111827' }}>{domain.domain}</td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '9999px',
                          fontWeight: '700',
                          ...getScoreColor(domain.score)
                        }}>
                          {domain.score}/5
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ width: '96px', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '8px', marginRight: '8px' }}>
                            <div style={{
                              height: '8px',
                              borderRadius: '9999px',
                              width: `${(domain.gap / 5) * 100}%`,
                              backgroundColor: getGapColor(domain.gap)
                            }}></div>
                          </div>
                          <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>{domain.gap}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>{domain.buyerSignal}</td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>{domain.risk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '32px',
              backgroundColor: '#E2EEF2'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
                Your Personalized Analysis
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {!analysis.allEqual ? (
                  <>
                    <p style={{ color: '#374151', display: 'flex', alignItems: 'flex-start', margin: 0 }}>
                      <CheckCircle style={{ width: '20px', height: '20px', color: '#059669', marginRight: '8px', marginTop: '2px', flexShrink: 0 }} />
                      <span><strong>Your strongest area is {analysis.strongest.domain} ({analysis.strongest.score}/5)</strong>, signaling solid buyer alignment in this area.</span>
                    </p>
                    <p style={{ color: '#374151', display: 'flex', alignItems: 'flex-start', margin: 0 }}>
                      <AlertCircle style={{ width: '20px', height: '20px', color: '#dc2626', marginRight: '8px', marginTop: '2px', flexShrink: 0 }} />
                      <span><strong>Your biggest gap is {analysis.weakest.domain} ({analysis.weakest.score}/5).</strong> Companies that strengthen this area typically improve valuation multiples by 20–40%.</span>
                    </p>
                  </>
                ) : (
                  <p style={{ color: '#374151', display: 'flex', alignItems: 'flex-start', margin: 0 }}>
                    <CheckCircle style={{ width: '20px', height: '20px', color: '#3b82f6', marginRight: '8px', marginTop: '2px', flexShrink: 0 }} />
                    <span>Your readiness is consistent across all areas at {analysis.equalScore}/5. {analysis.equalScore === 5 ? 'Excellent work maintaining strong alignment across all domains.' : 'Focus on elevating all areas together to strengthen your overall exit position.'}</span>
                  </p>
                )}
                <p style={{ color: '#374151', margin: 0 }}>
                  Closing these gaps will move you closer to exit-ready status and position you as a clear market leader.
                </p>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
                Turn Insight Into Action
              </h3>
              <p style={{ color: '#374151', marginBottom: '24px' }}>
                You have identified where you stand today and what is holding you back. Take the next step to translate your results into a roadmap for valuation lift.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  border: '2px solid #34296A',
                  borderRadius: '12px',
                  padding: '24px'
                }}>
                  <h4 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '8px', color: '#34296A' }}>
                    Book My Exit Readiness Diagnostic™
                  </h4>
                  <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
                    Get 2 growth levers and 1 red flag personalized to your company in a 30-minute session.
                  </p>
                  <a 
                    href="https://calendly.com/legacydna/discoverycall" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      backgroundColor: '#34296A',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      textDecoration: 'none',
                      transition: 'opacity 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    Book Diagnostic Session
                    <ArrowRight style={{ marginLeft: '8px', width: '20px', height: '20px' }} />
                  </a>
                </div>

                <div style={{
                  border: '2px solid #009DB9',
                  borderRadius: '12px',
                  padding: '24px'
                }}>
                  <h4 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '8px', color: '#009DB9' }}>
                    Explore the Exit Readiness Sprint™
                  </h4>
                  <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
                    See if it is the right fit to accelerate your growth and close your readiness gap.
                  </p>
                  <a 
                    href="https://www.legacy-dna.com/exit-readiness-sprint" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: 'white',
                      border: '2px solid #009DB9',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      color: '#009DB9',
                      textDecoration: 'none',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    Learn About the Sprint
                    <ArrowRight style={{ marginLeft: '8px', width: '20px', height: '20px' }} />
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
    const analysis = getAnalysis();

    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #eff6ff, #f3e8ff, #ecfeff)',
        padding: '16px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        <div style={{ maxWidth: '768px', margin: '0 auto' }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            padding: '32px',
            marginBottom: '24px'
          }}>
            <h1 style={{ fontSize: '30px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
              Your Exit Readiness Score: {score}/100
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '32px' }}>
              You have made real progress toward exit readiness.
            </p>

            <div style={{
              borderRadius: '12px',
              padding: '32px',
              color: 'white',
              marginBottom: '32px',
              background: 'linear-gradient(135deg, #34296A 0%, #4E72B8 100%)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: '#e9d5ff', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                    Preliminary Results
                  </p>
                  <p style={{ fontSize: '72px', fontWeight: '700', marginBottom: '8px' }}>{score}</p>
                  <p style={{ color: '#e9d5ff', fontSize: '14px', marginBottom: '12px' }}>out of 100</p>
                </div>
                <TrendingUp style={{ width: '128px', height: '128px', opacity: 0.2 }} />
              </div>
            </div>

            {!analysis.allEqual && (
              <p style={{ color: '#374151', marginBottom: '32px', lineHeight: '1.75' }}>
                Your strongest area is <strong>{analysis.strongest.domain}</strong>, while <strong>{analysis.weakest.domain}</strong> may be limiting how buyers perceive your value.
              </p>
            )}

            <div style={{
              background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)',
              borderRadius: '12px',
              padding: '32px',
              marginBottom: '32px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '128px', height: '128px', opacity: 0.05 }}>
                <Lock style={{ width: '100%', height: '100%' }} />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
                See Your Full Exit Readiness Heatmap™
              </h2>
              <p style={{ color: '#374151', marginBottom: '24px' }}>
                Unlock your complete score breakdown, buyer-aligned insights, and recommendations delivered instantly.
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', listStyle: 'none', padding: 0 }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', color: '#374151' }}>
                  <CheckCircle style={{ width: '20px', height: '20px', color: '#009DB9', marginRight: '12px', marginTop: '2px', flexShrink: 0 }} />
                  <span><strong>Domain-by-domain scoring</strong> across all 5 critical areas</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', color: '#374151' }}>
                  <CheckCircle style={{ width: '20px', height: '20px', color: '#009DB9', marginRight: '12px', marginTop: '2px', flexShrink: 0 }} />
                  <span><strong>Gap analysis</strong> showing exactly where you need improvement</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', color: '#374151' }}>
                  <CheckCircle style={{ width: '20px', height: '20px', color: '#009DB9', marginRight: '12px', marginTop: '2px', flexShrink: 0 }} />
                  <span><strong>Risk assessment</strong> explaining what each gap costs you at exit</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', color: '#374151' }}>
                  <CheckCircle style={{ width: '20px', height: '20px', color: '#009DB9', marginRight: '12px', marginTop: '2px', flexShrink: 0 }} />
                  <span><strong>Downloadable PDF report</strong> to share with your team</span>
                </li>
              </ul>

              <div style={{ position: 'relative' }}>
                <div style={{ filter: 'blur(4px)', opacity: 0.6, pointerEvents: 'none', userSelect: 'none' }}>
                  <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '16px', border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Exit Readiness Heatmap™ Preview</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f3f4f6', padding: '8px', borderRadius: '4px' }}>
                        <span style={{ fontSize: '12px' }}>Customer Clarity</span>
                        <div style={{ width: '64px', height: '8px', backgroundColor: '#d1d5db', borderRadius: '4px' }}></div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f3f4f6', padding: '8px', borderRadius: '4px' }}>
                        <span style={{ fontSize: '12px' }}>Messaging Strength</span>
                        <div style={{ width: '64px', height: '8px', backgroundColor: '#d1d5db', borderRadius: '4px' }}></div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f3f4f6', padding: '8px', borderRadius: '4px' }}>
                        <span style={{ fontSize: '12px' }}>Brand Positioning</span>
                        <div style={{ width: '64px', height: '8px', backgroundColor: '#d1d5db', borderRadius: '4px' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '12px', color: '#34296A' }}>
                    <Lock style={{ width: '32px', height: '32px' }} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              borderRadius: '12px',
              padding: '32px',
              backgroundColor: '#E2EEF2'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <Mail style={{ width: '24px', height: '24px', marginRight: '12px', color: '#009DB9' }} />
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', margin: 0 }}>Get Your Complete Exit Readiness Report</h3>
              </div>
              <p style={{ color: '#374151', marginBottom: '24px' }}>
                Get your complete score breakdown, buyer-aligned insights, and downloadable PDF report delivered instantly.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="your@email.com"
                  />
                </div>
                <button
                  onClick={() => setScreen('fullResults')}
                  disabled={!email || !email.includes('@')}
                  style={{
                    width: '100%',
                    color: 'white',
                    padding: '16px 32px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    backgroundColor: !email || !email.includes('@') ? '#d1d5db' : '#34296A',
                    border: 'none',
                    cursor: !email || !email.includes('@') ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseOver={(e) => {
                    if (email && email.includes('@')) e.currentTarget.style.opacity = '0.9';
                  }}
                  onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                >
                  Show My Full Results & Download PDF
                  <ArrowRight style={{ marginLeft: '8px', width: '24px', height: '24px' }} />
                </button>
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
      background: 'linear-gradient(to bottom right, #eff6ff, #f3e8ff, #ecfeff)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '768px',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        padding: '32px'
      }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
            <span>Question {currentStep + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '8px' }}>
            <div style={{
              height: '8px',
              borderRadius: '9999px',
              width: `${progress}%`,
              backgroundColor: '#009DB9',
              transition: 'width 0.3s'
            }}></div>
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '8px',
            color: '#009DB9'
          }}>
            {currentQuestion.title}
          </h3>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '16px'
          }}>
            {currentQuestion.question}
          </h2>
          <p style={{ color: '#6b7280', lineHeight: '1.75' }}>
            {currentQuestion.description}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          {currentQuestion.options.map((option) => (
            <button
              key={option.value}
              onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion.id]: option.value }))}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '16px 24px',
                borderRadius: '8px',
                border: currentAnswer === option.value ? '2px solid #34296A' : '2px solid #e5e7eb',
                backgroundColor: currentAnswer === option.value ? '#faf5ff' : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                if (currentAnswer !== option.value) {
                  e.currentTarget.style.borderColor = '#c4b5fd';
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }
              }}
              onMouseOut={(e) => {
                if (currentAnswer !== option.value) {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '9999px',
                  border: currentAnswer === option.value ? 'none' : '2px solid #d1d5db',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '16px',
                  color: 'white',
                  fontWeight: '600',
                  backgroundColor: currentAnswer === option.value ? '#34296A' : 'transparent',
                  borderColor: currentAnswer === option.value ? '#34296A' : '#d1d5db'
                }}>
                  <span style={{ color: currentAnswer === option.value ? 'white' : '#9ca3af' }}>
                    {option.value}
                  </span>
                </span>
                <span style={{
                  fontWeight: '500',
                  color: currentAnswer === option.value ? '#111827' : '#374151'
                }}>
                  {option.label}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              style={{
                padding: '12px 24px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontWeight: '600',
                backgroundColor: 'white',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
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
              color: 'white',
              padding: '12px 32px',
              borderRadius: '8px',
              fontWeight: '600',
              backgroundColor: !currentAnswer ? '#d1d5db' : '#34296A',
              border: 'none',
              cursor: !currentAnswer ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => {
              if (currentAnswer) e.currentTarget.style.opacity = '0.9';
            }}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            {currentStep === questions.length - 1 ? 'See My Score' : 'Next Question'}
            <ArrowRight style={{ marginLeft: '8px', width: '20px', height: '20px' }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExitReadinessScorecard;
