import { spawn } from 'child_process';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

export interface ChatRequestBody {
  message: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
  context?: any;
}

export interface ChatResponseBody {
  reply: string;
  toolInvocations?: any[];
  proposal?: any;
}

function callPythonBackend(body: ChatRequestBody): Promise<ChatResponseBody> {
  return new Promise((resolve, reject) => {
    const pythonScriptPath = path.resolve(process.cwd(), 'api/chat.py');
    const py = spawn('python3', [pythonScriptPath], {
      env: { ...process.env },
    });

    let stdoutData = '';
    let stderrData = '';

    py.stdout.on('data', (chunk) => {
      stdoutData += chunk.toString();
    });

    py.stderr.on('data', (chunk) => {
      stderrData += chunk.toString();
    });

    py.on('error', (err) => {
      reject(err);
    });

    py.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}: ${stderrData}`));
        return;
      }
      try {
        const parsed = JSON.parse(stdoutData.trim());
        resolve(parsed);
      } catch (err) {
        reject(new Error(`Failed to parse Python response: ${stderrData || stdoutData}`));
      }
    });

    py.stdin.write(JSON.stringify(body));
    py.stdin.end();
  });
}

function getContextPrompt(context?: any): string {
  if (!context) return '';
  const totalBalance = typeof context.totalBalance === 'number' ? context.totalBalance : 18978.45;
  const monthlyIncome = typeof context.monthlyIncome === 'number' ? context.monthlyIncome : 5900.0;
  const monthlyExpenses = typeof context.monthlyExpenses === 'number' ? context.monthlyExpenses : 2878.54;
  const healthScore = typeof context.healthScore === 'number' ? context.healthScore : 84;
  const overdueCount = typeof context.overdueBillsCount === 'number' ? context.overdueBillsCount : 1;
  const diningSpent = typeof context.diningSpent === 'number' ? context.diningSpent : 270.85;
  const diningAllocated = typeof context.diningAllocated === 'number' ? context.diningAllocated : 400.0;

  return `
Current User Financial Context:
- Net Worth / Liquid Balance: $${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
- Monthly Income: $${monthlyIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
- Monthly Expenses: $${monthlyExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
- Health Score: ${healthScore}/100
- Overdue Bills: ${overdueCount} (Municipal Water: $45.20)
- Dining Spent this month: $${diningSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / Allocated $${diningAllocated.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
- Key Accounts: Primary Checking ($4,328.45), High-Yield Emergency Fund ($14,650.00), Sapphire Credit Card (-$842.15)
- Active Bills: Apartment Rent ($1,650, paid), City Electric ($124.60, due Oct 22), Municipal Water ($45.20, overdue Oct 18), Fiber Internet ($79.99, due Oct 25), Netflix ($22.99, paid), Spotify ($16.99, due Oct 28)
`;
}

function generateLocalFinanceResponse(message: string, context?: any): ChatResponseBody {
  const q = message.toLowerCase();

  // 1. Pay Overdue Bill
  if (q.includes('pay') && (q.includes('water') || q.includes('overdue') || q.includes('bill'))) {
    return {
      reply: `I have identified the overdue **Municipal Water & Waste bill** for **$45.20** (due date was Oct 18, 2026).\n\n**Payment Analysis:**\n- Source Account: **Primary Checking** ($4,328.45 available)\n- Penalty Avoidance: Saves **$15.00** late penalty fee\n- Projected Post-Payment Checking Balance: **$4,283.25**\n\nUnder **Tier 2 Security Compliance**, autonomous execution is prohibited. I have prepared a formal payment proposal for your authorization:`,
      proposal: {
        id: `prop_${Date.now()}_water`,
        type: 'PAY_BILL',
        title: 'Authorize Municipal Water Bill Payment',
        description: 'Pay overdue water & waste invoice of $45.20 via Primary Checking account.',
        tier: 2,
        diff: [
          { field: 'Bill Status', before: 'Overdue (Oct 18)', after: 'Paid (Oct 19)' },
          { field: 'Primary Checking', before: '$4,328.45', after: '$4,283.25' },
          { field: 'Late Penalty Averted', before: '$15.00', after: '$0.00' },
        ],
        impactSummary: 'Eliminates delinquency notice and preserves 100% bill punctuality score.',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        payload: { billId: 'bill_water', amount: 45.2, accountId: 'acc_chk_01' },
      },
    };
  }

  // 2. Dining Out / Food Budget Adjustment
  if (q.includes('dining') || q.includes('restaurant') || (q.includes('food') && q.includes('budget'))) {
    return {
      reply: `**Dining & Food Spending Audit:**\n- Monthly Allocated: **$400.00**\n- Spent to Date (Oct 1–19): **$270.85** (67.7% of budget consumed with 12 days remaining)\n- Current Daily Burn: **$14.25/day** vs Target **$12.90/day**\n- Key Outliers:\n  - Oct 17: *The Copper Tavern* — $115.80 (dinner & craft cocktails)\n  - Oct 10: *Doordash Sushi Zen* — $62.30\n\n**Actionable Recommendation:**\nTo prevent an overrun at month-end, we can either reallocate **$60.00** from your surplus **Transportation budget** ($85 spent of $320) into Dining, or cap remaining dining to **$10.75/day**.\n\nWould you like me to prepare a Tier-2 budget adjustment proposal to reallocate $60 from Transport to Dining?`,
      proposal: {
        id: `prop_${Date.now()}_dining`,
        type: 'UPDATE_BUDGET',
        title: 'Reallocate $60 Surplus to Dining & Food',
        description: 'Shift $60.00 unused allowance from Transportation to Dining & Food to prevent month-end breach.',
        tier: 2,
        diff: [
          { field: 'Dining Budget', before: '$400.00', after: '$460.00' },
          { field: 'Transportation Budget', before: '$320.00', after: '$260.00' },
          { field: 'Projected Net Impact', before: '$0.00 deficit', after: 'Balanced envelopes' },
        ],
        impactSummary: 'Keeps total discretionary envelopes within 50/30/20 guidelines without cutting lifestyle.',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        payload: { sourceCategory: 'Transportation', targetCategory: 'Dining & Food', amount: 60 },
      },
    };
  }

  // 3. Subscription Creep & Recurring Commitments
  if (q.includes('subscription') || q.includes('recurring') || q.includes('audit bills')) {
    return {
      reply: `**Recurring Commitments & Subscription Audit:**\nWe analyzed your automated charges for October 2026:\n1. **Netflix 4K Premium**: $22.99/mo (Paid Oct 15)\n2. **Spotify Family Plan**: $16.99/mo (Due Oct 28)\n3. **Google One 2TB Cloud**: $12.00/mo (Paid Oct 12)\n4. **Equinox Gym**: $49.00/mo (Due Oct 27)\n\n**Total Monthly Subscriptions:** **$100.98/mo** ($1,211.76 annually).\n\n**Optimization Opportunities:**\n- **Spotify**: If only 1 or 2 users utilize the family plan, switching to Duo or Individual saves **$6.00 to $9.00/mo**.\n- **Equinox Gym**: Consistently logged on Sapphire Card. Ensure attendance exceeds 8 visits/month for cost-efficiency.`,
    };
  }

  // 4. Savings / Idle Cash / Investments
  if (['save', 'invest', 'idle', 'interest', 'emergency'].some((k) => q.includes(k))) {
    return {
      reply: `**Liquid Capital & Yield Optimization:**\n- **Primary Checking**: $4,328.45 (yielding ~0.05% APY)\n- **High-Yield Emergency Fund**: $14,650.00 (yielding **4.85% APY**)\n- **Baseline Monthly Living Expenses**: ~$2,850.00\n\n**Financial Analysis:**\nYour checking account has **$1,478.45** in excess liquid float beyond your recommended 30-day operational buffer ($2,850.00).\n\nMoving **$1,000.00** to your High-Yield Emergency Fund will:\n1. Boost annual interest generation by **$48.50/year**.\n2. Elevate your emergency reserves to **5.5 months of living expenses**.\n3. Keep $3,328.45 in checking for all pending bills and everyday expenses.`,
      proposal: {
        id: `prop_${Date.now()}_transfer`,
        type: 'TRANSFER_FUNDS',
        title: 'Transfer $1,000 Float to High-Yield Savings',
        description: 'Optimize idle liquidity by moving $1,000 from Primary Checking to 4.85% APY Emergency Fund.',
        tier: 2,
        diff: [
          { field: 'Primary Checking', before: '$4,328.45', after: '$3,328.45' },
          { field: 'High-Yield Savings', before: '$14,650.00', after: '$15,650.00' },
          { field: 'Annual Yield Generated', before: '$710.52', after: '$759.02' },
        ],
        impactSummary: 'Increases risk-free annual return while maintaining full liquidity for monthly obligations.',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        payload: { fromAccount: 'acc_chk_01', toAccount: 'acc_sav_01', amount: 1000 },
      },
    };
  }

  // Default General Assistant Response
  return {
    reply: `**FinTrack AI Financial Overview:**\nI'm monitoring your financial position for October 2026:\n\n- **Net Liquid Assets**: $18,978.45 (Checking + High-Yield Emergency Fund)\n- **Monthly Income Received**: $5,900.00 across 2 payroll deposits\n- **Monthly Living Expenses**: $2,878.54\n- **Financial Health Score**: **84/100 (Grade: A)**\n\n**Priority Alerts:**\n1. **Urgent**: Municipal Water bill ($45.20) is **overdue** since Oct 18.\n2. **Pacing Alert**: Dining & Food has used 67.7% of its monthly allowance.\n3. **Surplus Float**: You have ~$1,400 in surplus cash in checking that could be earning 4.85% APY.\n\nAsk me to *"Pay the water bill"*, *"Analyze my dining expenses"*, or *"How can I save $200 this month?"*`,
  };
}

export async function handleGeminiChat(body: ChatRequestBody): Promise<ChatResponseBody> {
  // First, attempt execution via the Python backend in api/chat.py
  try {
    const pythonResult = await callPythonBackend(body);
    if (pythonResult && pythonResult.reply) {
      return pythonResult;
    }
  } catch (pyErr: any) {
    console.warn('[FinTrack AI] Python backend invocation error, using fallback handler:', pyErr.message);
  }

  // Direct TypeScript fallback
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  const message = body.message || '';
  const history = body.history || [];
  const context = body.context;

  const systemInstruction = `
You are FinTrack AI, an intelligent Personal Finance Assistant and active financial participant built for FinTechathon 2026 (Topic A: Personal Finance Assistant).
Your core capabilities include:
1. Smart Budgeting (envelope budgeting, 50/30/20 rule analysis, proactive reallocation recommendations)
2. Bill Analysis (upcoming bills calendar, subscription creep identification, overdue alerts, payment sequencing)
3. Spending Insights (category velocity, merchant breakdown, anomaly detection, cash flow optimization)
4. Actionable Financial Advice (emergency reserve sizing, savings rate acceleration)

SECURITY & COMPLIANCE RULES:
- Tier 1 (Read-Only): You can freely query, summarize, compute metrics, and explain financial situations.
- Tier 2 (State Changes / Money / Budgets): If the user asks to change a budget, pay a bill, transfer funds, or cancel a subscription, YOU MUST NEVER claim you already made the change. Instead, propose the action with a structured dry-run comparison.
If proposing an action, append a structured JSON block at the end of your response wrapped in \`\`\`proposal ... \`\`\` with this exact schema:
\`\`\`proposal
{
  "type": "UPDATE_BUDGET" | "PAY_BILL" | "TRANSFER_FUNDS" | "CANCEL_SUBSCRIPTION",
  "title": "Short title",
  "description": "Clear explanation",
  "tier": 2,
  "diff": [
    {"field": "Dining Budget", "before": "$400.00", "after": "$350.00"}
  ],
  "impactSummary": "Impact on monthly cash flow and savings",
  "payload": {}
}
\`\`\`

Tone: Professional, empowering, highly analytical, mathematically precise, compliant with banking security standards.
Keep responses concise, scannable with bullet points, and directly actionable.
${getContextPrompt(context)}
`;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

      if (history.length > 0) {
        for (const h of history.slice(-6)) {
          contents.push({
            role: h.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: h.content }],
          });
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.6,
        },
      });

      const replyText = response.text || '';
      let proposal: any = null;

      const proposalMatch = replyText.match(/```proposal\s*([\s\S]*?)\s*```/);
      if (proposalMatch) {
        try {
          proposal = JSON.parse(proposalMatch[1]);
          proposal.id = `prop_${Date.now()}`;
          proposal.status = 'PENDING';
          proposal.createdAt = new Date().toISOString();
          if (!proposal.payload) {
            proposal.payload = {};
          }
        } catch {
          // ignore JSON parse error in proposal block
        }
      }

      const cleanedReply = replyText.replace(/```proposal[\s\S]*?```/g, '').trim();

      return {
        reply: cleanedReply || replyText || "I've reviewed your financial data. How else can I assist with your budgets or bills?",
        proposal: proposal || undefined,
      };
    } catch (err: any) {
      console.warn('[FinTrack AI] Gemini API call error:', err.message);
    }
  }

  return generateLocalFinanceResponse(message, context);
}
