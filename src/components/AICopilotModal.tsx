import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, Bot, User, Key, Check } from 'lucide-react';

interface AICopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

// Function to strictly strip all asterisks and markdown asterisks from text
const cleanAsterisks = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/\*\*/g, '') // remove double asterisks
    .replace(/\*/g, '')   // remove single asterisks
    .trim();
};

export const AICopilotModal: React.FC<AICopilotModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: "Welcome to FingTaj Financial Assistant. I am here to help you learn about compound interest, loan prepayment calculations, tax planning concepts, and personal budgeting rules. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [apiKey, setApiKey] = useState(localStorage.getItem('fingtaj_gemini_key') || '');
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const saveApiKey = () => {
    localStorage.setItem('fingtaj_gemini_key', apiKey.trim());
    setShowKeyConfig(false);
    alert('Google Gemini API key saved! Co-Pilot will now query live Google Gemini 1.5 Flash.');
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: 'u-' + Date.now(),
      sender: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setLoading(true);

    // Route 1: Google Gemini 1.5 Flash API
    if (apiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `You are FingTaj Educational Financial Assistant. Provide educational explanations strictly for financial literacy and illustrative purposes.
CRITICAL FORMATTING INSTRUCTION: Do NOT use any asterisks (*) or markdown asterisks (**) anywhere in your response. Never use bold asterisks. Use plain text and simple numbered points or dashes for lists.
Do not provide personalized investment advice or stock tips.

User Question: ${textToSend}`
                }]
              }]
            })
          }
        );
        const data = await response.json();
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
          const rawReply = data.candidates[0].content.parts[0].text;
          const cleanedReply = cleanAsterisks(rawReply);
          const aiReply: Message = {
            id: 'a-' + Date.now(),
            sender: 'ai',
            text: cleanedReply
          };
          setMessages(prev => [...prev, aiReply]);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.warn('Gemini API error, falling back to educational assistant engine', e);
      }
    }

    // Route 2: Local Educational Financial Assistant (Zero asterisks guaranteed)
    setTimeout(() => {
      const reply = generateLocalIntelligence(textToSend);
      const aiReply: Message = {
        id: 'a-' + Date.now(),
        sender: 'ai',
        text: cleanAsterisks(reply)
      };
      setMessages(prev => [...prev, aiReply]);
      setLoading(false);
    }, 500);
  };

  // Educational answers with strictly NO asterisks
  const generateLocalIntelligence = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('prepay') || q.includes('loan') || q.includes('emi')) {
      return `Loan Amortization Economics:

1. The Front-Loaded Interest Effect: In the first 5 years of a 20-year home loan at 8.5%, roughly 75% of your monthly EMI payment goes towards interest, and only 25% reduces the principal.

2. The 1 Extra EMI Rule: By paying just 1 additional EMI every calendar year directly towards the principal, you can reduce a 20-year loan tenure down to roughly 15 years and 4 months, saving up to 40% in total interest.

3. Actionable Tip: Try out your exact loan numbers in our free Home Loan EMI & Prepayment Calculator!`;
    }

    if (q.includes('tax') || q.includes('regime') || q.includes('old vs new')) {
      return `2026 Income Tax Comparison Guide:

1. Mathematical Breakeven: For salaried individuals earning up to 15 Lakhs, the New Tax Regime is mathematically beneficial unless your total eligible deductions (Section 80C, 80D, HRA, and Home Loan Interest) exceed 3,75,000.

2. Section 80CCD(2) Corporate NPS: Employer contributions up to 14% of Basic salary to the National Pension System are eligible for deduction under the New Tax Regime.

3. Long Term Capital Gains: Take advantage of the annual 1.25 Lakh tax-exempt threshold for listed equities each financial year to rebalance cost basis legally.`;
    }

    if (q.includes('dcf') || q.includes('valuation') || q.includes('stock')) {
      return `Educational Equity Valuation Overview (DCF):

1. Core Concept: Discounted Cash Flow models estimate fair value by forecasting future Free Cash Flows and discounting them back to today using the Weighted Average Cost of Capital (WACC).

2. Cash Flow Over Accounting Profit: Free Cash Flow represents actual operational surplus left after necessary capital expenditures and working capital needs.

3. Margin of Safety: Educational valuation principles recommend maintaining a 25% to 35% margin of safety below estimated intrinsic worth to absorb unforeseen forecasting errors.`;
    }

    if (q.includes('invest') || q.includes('portfolio') || q.includes('sip') || q.includes('allocate')) {
      return `General Asset Allocation Learning Framework:

1. Emergency Fund Buffer: Maintain 3 to 6 months of non-negotiable living expenses in liquid savings accounts or liquid funds.

2. Core Broad Market Equities: Low-cost broad market index funds (such as Nifty 50 or S&P 500) provide diversified exposure across the economy with minimal expense ratios.

3. Fixed Income and Debt: High-grade sovereign debt or fixed income allocations help cushion volatility and provide funds for systematic rebalancing during market downturns.`;
    }

    return `Educational Financial Perspective on "${query}":

Three fundamental principles govern long-term wealth planning:

1. Savings Consistency: Automating 20% to 30% of monthly income into investments helps avoid discretionary overspending.

2. Compounding Time Horizon: Compounding operates on an exponential curve. Time in the market generally outpaces market timing.

3. Cost and Expense Control: Low expense ratio index funds protect capital from ongoing management fee erosion.

All calculations and guidance are provided strictly for educational purposes. Feel free to ask about any specific financial simulator or concept!`;
  };

  const quickChips = [
    "How to cut 7 years off home loan?",
    "Old vs New Tax Regime in 2026?",
    "DCF Valuation vs P/E Multiple?",
    "How to allocate ₹50,000 monthly?"
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '680px', height: '80vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(0, 245, 255, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)'
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800 }}>FingTaj Financial Learning Assistant</div>
              <div style={{ fontSize: '11px', color: apiKey ? 'var(--accent-emerald)' : 'var(--accent-cyan)' }}>
                {apiKey ? 'Connected to Google Gemini 1.5 Flash' : 'Educational Financial Literacy Guide'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              className="btn-icon" 
              onClick={() => setShowKeyConfig(!showKeyConfig)}
              title="Configure Optional Gemini API Key"
              style={{ color: apiKey ? 'var(--accent-emerald)' : 'var(--text-secondary)' }}
            >
              <Key size={16} />
            </button>
            <button className="btn-icon" onClick={onClose} title="Close Assistant">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* API Key Drawer */}
        {showKeyConfig && (
          <div style={{
            background: 'rgba(0, 245, 255, 0.05)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Enter your optional Google Gemini API Key for live AI responses. Keys are saved locally in your browser.
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                className="input-field"
                style={{ fontSize: '12px', padding: '8px 12px' }}
              />
              <button className="btn btn-primary" onClick={saveApiKey} style={{ padding: '8px 16px', fontSize: '12px' }}>
                Save Key
              </button>
            </div>
          </div>
        )}

        {/* Chat History */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map(m => (
            <div
              key={m.id}
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '88%'
              }}
            >
              {m.sender === 'ai' && (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(0, 245, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-cyan)',
                  flexShrink: 0
                }}>
                  <Bot size={16} />
                </div>
              )}

              <div style={{
                background: m.sender === 'user' ? 'var(--gradient-brand)' : 'rgba(255, 255, 255, 0.04)',
                color: m.sender === 'user' ? '#03080f' : 'var(--text-primary)',
                fontWeight: m.sender === 'user' ? 600 : 400,
                border: m.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '14px 18px',
                fontSize: '14px',
                lineHeight: 1.65,
                whiteSpace: 'pre-wrap'
              }}>
                {cleanAsterisks(m.text)}
              </div>

              {m.sender === 'user' && (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-primary)',
                  flexShrink: 0
                }}>
                  <User size={16} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(0, 245, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-cyan)'
              }}>
                <Bot size={16} />
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Preparing educational breakdown...
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div style={{
          padding: '10px 24px',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="btn btn-secondary"
              style={{
                fontSize: '11px',
                padding: '6px 12px',
                whiteSpace: 'nowrap',
                borderRadius: 'var(--radius-full)'
              }}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          <input
            type="text"
            className="input-field"
            placeholder="Ask about SIP math, loan prepayments, 2026 tax, or personal budgeting..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button 
            className="btn btn-primary" 
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            style={{ padding: '12px 18px', flexShrink: 0 }}
          >
            <Send size={16} />
          </button>
        </div>

        {/* Fiduciary educational footnote */}
        <div style={{ padding: '8px 24px', background: 'rgba(0,0,0,0.3)', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
          Educational Notice: FingTaj Assistant provides mathematical simulations for learning only. Not financial or investment advice.
        </div>

      </div>
    </div>
  );
};
