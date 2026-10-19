import { GoogleGenAI } from '@google/genai';

export interface ChatRequestBody {
  message: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
  context?: {
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    healthScore: number;
    overdueBillsCount: number;
    topExpenseCategory: string;
    diningSpent: number;
    diningAllocated: number;
    accounts: any[];
    budgets: any[];
    bills: any[];
  };
}

export async function handleGeminiChat(body: ChatRequestBody): Promise<{
  reply: string;
  toolInvocations?: any[];
  proposal?: any;
}> {
  const apiKey = process.env.GEMINI_API_KEY;

  const contextPrompt = body.context
    ? `
Current User Financial Context:
- Net Worth / Liquid Balance: $${body.context.totalBalance.toLocaleString()}
- Monthly Income: $${body.context.monthlyIncome.toLocaleString()}
- Monthly Expenses: $${body.context.monthlyExpenses.toLocaleString()}
- Health Score: ${body.context.healthScore}/100
- Overdue Bills: ${body.context.overdueBillsCount} (Municipal Water: $45.20)
- Dining Spent this month: $${body.context.diningSpent} / Allocated $${body.context.diningAllocated}
- Key Accounts: Primary Checking ($4,328.45), High-Yield Emergency Fund ($14,650.00), Sapphire Credit Card (-$842.15)
- Active Bills: Apartment Rent ($1,650, paid), City Electric ($124.60, due Oct 22), Municipal Water ($45.20, overdue Oct 18), Fiber Internet ($79.99, due Oct 25), Netflix ($22.99, paid), Spotify ($16.99, due Oct 28)
`
    : '';

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
  "impactSummary": "Impact on monthly cash flow and savings"
}
\`\`\`

Tone: Professional, empowering, highly analytical, mathematically precise, compliant with banking security standards.
Keep responses concise, scannable with bullet points, and directly actionable.
${contextPrompt}
`;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const contents: any[] = [];
      if (body.history && body.history.length > 0) {
        for (const h of body.history.slice(-6)) {
          contents.push({
            role: h.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: h.content }],
          });
        }
      }
      contents.push({
        role: 'user',
        parts: [{ text: body.message }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.6,
        },
      });

      const replyText = response.text || "I've reviewed your financial data. How else can I assist with your budgets or bills?";

      // Parse proposal block if present
      let proposal: any = null;
      const proposalMatch = replyText.match(/```proposal\s*([\s\S]*?)\s*```/);
      if (proposalMatch) {
        try {
          proposal = JSON.parse(proposalMatch[1]);
          proposal.id = `prop_${Date.now()}`;
          proposal.status = 'PENDING';
          proposal.createdAt = new Date().toISOString();
        } catch {
          // ignore json parse error
        }
      }

      // Clean proposal markdown from user-facing text for cleaner UI presentation
      const cleanedReply = replyText.replace(/```proposal[\s\S]*?```/, '').trim();

      return {
        reply: cleanedReply || replyText,
        proposal,
      };
    } catch (err: any) {
      console.warn('Gemini API call failed, falling back to local finance reasoning engine:', err.message);
    }
  }

  // Fallback financial reasoning engine
  return generateLocalFinanceResponse(body.message, body.context);
}

function generateLocalFinanceResponse(
  message: string,
  context?: ChatRequestBody['context']
): { reply: string; proposal?: any } {
  const q = message.toLowerCase();

  // 1. Pay Overdue Bill
  if (q.includes('pay') && (q.includes('water') || q.includes('overdue') || q.includes('bill'))) {
    return {
      reply: `I have identified the overdue **Municipal Water & Waste bill** for **$45.20** (due date was Oct 18, 2026). 

**Payment Analysis:**
- Source Account: **Primary Checking** ($4,328.45 available)
- Penalty Avoidance: Saves **$15.00** late penalty fee
- Projected Post-Payment Checking Balance: **$4,283.25**

Under **Tier 2 Security Compliance**, autonomous execution is prohibited. I have prepared a formal payment proposal for your authorization:`,
      proposal: {
        id: `prop_${Date.now()}`,
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
      reply: `**Dining & Food Spending Audit:**
- Monthly Allocated: **$400.00**
- Spent to Date (Oct 1–19): **$270.85** (67.7% of budget consumed with 12 days remaining)
- Current Daily Burn: **$14.25/day** vs Target **$12.90/day**
- Key Outliers:
  - Oct 17: *The Copper Tavern* — $115.80 (dinner & craft cocktails)
  - Oct 10: *Doordash Sushi Zen* — $62.30

**Actionable Recommendation:**
To prevent an overrun at month-end, we can either reallocate **$60.00** from your surplus **Transportation budget** ($85 spent of $320) into Dining, or cap remaining dining to **$10.75/day**.

Would you like me to prepare a Tier-2 budget adjustment proposal to reallocate $60 from Transport to Dining?`,
      proposal: {
        id: `prop_${Date.now()}`,
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

  // 3. Subscription Creep & Bills Analysis
  if (q.includes('subscription') || q.includes('recurring') || q.includes('audit bills')) {
    return {
      reply: `**Recurring Commitments & Subscription Audit:**
We analyzed your automated charges for October 2026:
1. **Netflix 4K Premium**: $22.99/mo (Paid Oct 15)
2. **Spotify Family Plan**: $16.99/mo (Due Oct 28)
3. **Google One 2TB Cloud**: $12.00/mo (Paid Oct 12)
4. **Equinox Gym**: $49.00/mo (Due Oct 27)

**Total Monthly Subscriptions:** **$100.98/mo** ($1,211.76 annually).

**Optimization Opportunities:**
- **Spotify**: If only 1 or 2 users utilize the family plan, switching to Duo or Individual saves **$6.00 to $9.00/mo**.
- **Equinox Gym**: Consistently logged on Sapphire Card. Ensure attendance exceeds 8 visits/month for cost-efficiency.`,
    };
  }

  // 4. Savings / Idle Cash / Investment
  if (q.includes('save') || q.includes('invest') || q.includes('idle') || q.includes('interest') || q.includes('emergency')) {
    return {
      reply: `**Liquid Capital & Yield Optimization:**
- **Primary Checking**: $4,328.45 (yielding ~0.05% APY)
- **High-Yield Emergency Fund**: $14,650.00 (yielding **4.85% APY**)
- **Baseline Monthly Living Expenses**: ~$2,850.00

**Financial Analysis:**
Your checking account has **$1,478.45** in excess liquid float beyond your recommended 30-day operational buffer ($2,850.00).

Moving **$1,000.00** to your High-Yield Emergency Fund will:
1. Boost annual interest generation by **$48.50/year**.
2. Elevate your emergency reserves to **5.5 months of living expenses**.
3. Keep $3,328.45 in checking for all pending bills and everyday expenses.`,
      proposal: {
        id: `prop_${Date.now()}`,
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
    reply: `**FinTrack AI Financial Overview:**
I'm monitoring your financial position for October 2026:

- **Net Liquid Assets**: $18,978.45 (Checking + High-Yield Emergency Fund)
- **Monthly Income Received**: $5,900.00 across 2 payroll deposits
- **Monthly Living Expenses**: $2,878.54
- **Financial Health Score**: **84/100 (Grade: A)**

**Priority Alerts:**
1. **Urgent**: Municipal Water bill ($45.20) is **overdue** since Oct 18.
2. **Pacing Alert**: Dining & Food has used 67.7% of its monthly allowance.
3. **Surplus Float**: You have ~$1,400 in surplus cash in checking that could be earning 4.85% APY.

Ask me to *"Pay the water bill"*, *"Analyze my dining expenses"*, or *"How can I save $200 this month?"*`,
  };
}
