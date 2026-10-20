#!/usr/bin/env python3
"""
FinTrack AI - Intelligent Personal Finance Assistant
Vercel Python Serverless Function & Standalone Chat Backend
"""

import json
import os
import sys
import re
from http.server import BaseHTTPRequestHandler
import urllib.request
import urllib.error
from typing import Dict, Any, List, Optional

def get_context_prompt(context: Optional[Dict[str, Any]]) -> str:
    if not context:
        return ""
    total_balance = context.get("totalBalance", 18978.45)
    monthly_income = context.get("monthlyIncome", 5900.0)
    monthly_expenses = context.get("monthlyExpenses", 2878.54)
    health_score = context.get("healthScore", 84)
    overdue_count = context.get("overdueBillsCount", 1)
    dining_spent = context.get("diningSpent", 270.85)
    dining_allocated = context.get("diningAllocated", 400.0)

    return f"""
Current User Financial Context:
- Net Worth / Liquid Balance: ${total_balance:,.2f}
- Monthly Income: ${monthly_income:,.2f}
- Monthly Expenses: ${monthly_expenses:,.2f}
- Health Score: {health_score}/100
- Overdue Bills: {overdueCount if 'overdueCount' in locals() else overdue_count} (Municipal Water: $45.20)
- Dining Spent this month: ${dining_spent:,.2f} / Allocated ${dining_allocated:,.2f}
- Key Accounts: Primary Checking ($4,328.45), High-Yield Emergency Fund ($14,650.00), Sapphire Credit Card (-$842.15)
- Active Bills: Apartment Rent ($1,650, paid), City Electric ($124.60, due Oct 22), Municipal Water ($45.20, overdue Oct 18), Fiber Internet ($79.99, due Oct 25), Netflix ($22.99, paid), Spotify ($16.99, due Oct 28)
"""

def generate_local_finance_response(message: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    q = message.lower()

    # 1. Pay Overdue Bill
    if "pay" in q and ("water" in q or "overdue" in q or "bill" in q):
        return {
            "reply": """I have identified the overdue **Municipal Water & Waste bill** for **$45.20** (due date was Oct 18, 2026). 

**Payment Analysis:**
- Source Account: **Primary Checking** ($4,328.45 available)
- Penalty Avoidance: Saves **$15.00** late penalty fee
- Projected Post-Payment Checking Balance: **$4,283.25**

Under **Tier 2 Security Compliance**, autonomous execution is prohibited. I have prepared a formal payment proposal for your authorization:""",
            "proposal": {
                "id": f"prop_py_{int(os.times()[4] * 1000) if hasattr(os, 'times') else 179241}",
                "type": "PAY_BILL",
                "title": "Authorize Municipal Water Bill Payment",
                "description": "Pay overdue water & waste invoice of $45.20 via Primary Checking account.",
                "tier": 2,
                "diff": [
                    {"field": "Bill Status", "before": "Overdue (Oct 18)", "after": "Paid (Oct 19)"},
                    {"field": "Primary Checking", "before": "$4,328.45", "after": "$4,283.25"},
                    {"field": "Late Penalty Averted", "before": "$15.00", "after": "$0.00"},
                ],
                "impactSummary": "Eliminates delinquency notice and preserves 100% bill punctuality score.",
                "status": "PENDING",
                "createdAt": "2026-10-19T17:00:00.000Z",
                "payload": {"billId": "bill_water", "amount": 45.2, "accountId": "acc_chk_01"},
            },
        }

    # 2. Dining Out / Food Budget Adjustment
    if "dining" in q or "restaurant" in q or ("food" in q and "budget" in q):
        return {
            "reply": """**Dining & Food Spending Audit:**
- Monthly Allocated: **$400.00**
- Spent to Date (Oct 1–19): **$270.85** (67.7% of budget consumed with 12 days remaining)
- Current Daily Burn: **$14.25/day** vs Target **$12.90/day**
- Key Outliers:
  - Oct 17: *The Copper Tavern* — $115.80 (dinner & craft cocktails)
  - Oct 10: *Doordash Sushi Zen* — $62.30

**Actionable Recommendation:**
To prevent an overrun at month-end, we can either reallocate **$60.00** from your surplus **Transportation budget** ($85 spent of $320) into Dining, or cap remaining dining to **$10.75/day**.

Would you like me to prepare a Tier-2 budget adjustment proposal to reallocate $60 from Transport to Dining?""",
            "proposal": {
                "id": f"prop_py_{int(os.times()[4] * 1000) if hasattr(os, 'times') else 179242}",
                "type": "UPDATE_BUDGET",
                "title": "Reallocate $60 Surplus to Dining & Food",
                "description": "Shift $60.00 unused allowance from Transportation to Dining & Food to prevent month-end breach.",
                "tier": 2,
                "diff": [
                    {"field": "Dining Budget", "before": "$400.00", "after": "$460.00"},
                    {"field": "Transportation Budget", "before": "$320.00", "after": "$260.00"},
                    {"field": "Projected Net Impact", "before": "$0.00 deficit", "after": "Balanced envelopes"},
                ],
                "impactSummary": "Keeps total discretionary envelopes within 50/30/20 guidelines without cutting lifestyle.",
                "status": "PENDING",
                "createdAt": "2026-10-19T17:00:00.000Z",
                "payload": {"sourceCategory": "Transportation", "targetCategory": "Dining & Food", "amount": 60},
            },
        }

    # 3. Subscription Creep & Recurring Commitments
    if "subscription" in q or "recurring" in q or "audit bills" in q:
        return {
            "reply": """**Recurring Commitments & Subscription Audit:**
We analyzed your automated charges for October 2026:
1. **Netflix 4K Premium**: $22.99/mo (Paid Oct 15)
2. **Spotify Family Plan**: $16.99/mo (Due Oct 28)
3. **Google One 2TB Cloud**: $12.00/mo (Paid Oct 12)
4. **Equinox Gym**: $49.00/mo (Due Oct 27)

**Total Monthly Subscriptions:** **$100.98/mo** ($1,211.76 annually).

**Optimization Opportunities:**
- **Spotify**: If only 1 or 2 users utilize the family plan, switching to Duo or Individual saves **$6.00 to $9.00/mo**.
- **Equinox Gym**: Consistently logged on Sapphire Card. Ensure attendance exceeds 8 visits/month for cost-efficiency."""
        }

    # 4. Savings / Idle Cash / Investments
    if any(k in q for k in ["save", "invest", "idle", "interest", "emergency"]):
        return {
            "reply": """**Liquid Capital & Yield Optimization:**
- **Primary Checking**: $4,328.45 (yielding ~0.05% APY)
- **High-Yield Emergency Fund**: $14,650.00 (yielding **4.85% APY**)
- **Baseline Monthly Living Expenses**: ~$2,850.00

**Financial Analysis:**
Your checking account has **$1,478.45** in excess liquid float beyond your recommended 30-day operational buffer ($2,850.00).

Moving **$1,000.00** to your High-Yield Emergency Fund will:
1. Boost annual interest generation by **$48.50/year**.
2. Elevate your emergency reserves to **5.5 months of living expenses**.
3. Keep $3,328.45 in checking for all pending bills and everyday expenses.""",
            "proposal": {
                "id": f"prop_py_{int(os.times()[4] * 1000) if hasattr(os, 'times') else 179243}",
                "type": "TRANSFER_FUNDS",
                "title": "Transfer $1,000 Float to High-Yield Savings",
                "description": "Optimize idle liquidity by moving $1,000 from Primary Checking to 4.85% APY Emergency Fund.",
                "tier": 2,
                "diff": [
                    {"field": "Primary Checking", "before": "$4,328.45", "after": "$3,328.45"},
                    {"field": "High-Yield Savings", "before": "$14,650.00", "after": "$15,650.00"},
                    {"field": "Annual Yield Generated", "before": "$710.52", "after": "$759.02"},
                ],
                "impactSummary": "Increases risk-free annual return while maintaining full liquidity for monthly obligations.",
                "status": "PENDING",
                "createdAt": "2026-10-19T17:00:00.000Z",
                "payload": {"fromAccount": "acc_chk_01", "toAccount": "acc_sav_01", "amount": 1000},
            },
        }

    # Default General Assistant Response
    return {
        "reply": """**FinTrack AI Financial Overview:**
I'm monitoring your financial position for October 2026:

- **Net Liquid Assets**: $18,978.45 (Checking + High-Yield Emergency Fund)
- **Monthly Income Received**: $5,900.00 across 2 payroll deposits
- **Monthly Living Expenses**: $2,878.54
- **Financial Health Score**: **84/100 (Grade: A)**

**Priority Alerts:**
1. **Urgent**: Municipal Water bill ($45.20) is **overdue** since Oct 18.
2. **Pacing Alert**: Dining & Food has used 67.7% of its monthly allowance.
3. **Surplus Float**: You have ~$1,400 in surplus cash in checking that could be earning 4.85% APY.

Ask me to *"Pay the water bill"*, *"Analyze my dining expenses"*, or *"How can I save $200 this month?"*"""
    }

def process_chat_request(body: Dict[str, Any]) -> Dict[str, Any]:
    api_key = os.environ.get("GEMINI_API_KEY", "").strip() or os.environ.get("API_KEY", "").strip()
    message = body.get("message", "")
    history = body.get("history", [])
    context = body.get("context")

    system_instruction = f"""
You are FinTrack AI, an intelligent Personal Finance Assistant and active financial participant built for FinTechathon 2026 (Topic A: Personal Finance Assistant).
Your core capabilities include:
1. Smart Budgeting (envelope budgeting, 50/30/20 rule analysis, proactive reallocation recommendations)
2. Bill Analysis (upcoming bills calendar, subscription creep identification, overdue alerts, payment sequencing)
3. Spending Insights (category velocity, merchant breakdown, anomaly detection, cash flow optimization)
4. Actionable Financial Advice (emergency reserve sizing, savings rate acceleration)

SECURITY & COMPLIANCE RULES:
- Tier 1 (Read-Only): You can freely query, summarize, compute metrics, and explain financial situations.
- Tier 2 (State Changes / Money / Budgets): If the user asks to change a budget, pay a bill, transfer funds, or cancel a subscription, YOU MUST NEVER claim you already made the change. Instead, propose the action with a structured dry-run comparison.
If proposing an action, append a structured JSON block at the end of your response wrapped in ```proposal ... ``` with this exact schema:
```proposal
{{
  "type": "UPDATE_BUDGET" | "PAY_BILL" | "TRANSFER_FUNDS" | "CANCEL_SUBSCRIPTION",
  "title": "Short title",
  "description": "Clear explanation",
  "tier": 2,
  "diff": [
    {{"field": "Dining Budget", "before": "$400.00", "after": "$350.00"}}
  ],
  "impactSummary": "Impact on monthly cash flow and savings"
}}
```

Tone: Professional, empowering, highly analytical, mathematically precise, compliant with banking security standards.
Keep responses concise, scannable with bullet points, and directly actionable.
{get_context_prompt(context)}
"""

    if api_key:
        try:
            # Build payload for Gemini REST API
            contents = []
            if history:
                for h in history[-6:]:
                    contents.append({
                        "role": "model" if h.get("role") == "assistant" else "user",
                        "parts": [{"text": h.get("content", "")}]
                    })
            contents.append({
                "role": "user",
                "parts": [{"text": message}]
            })

            payload = {
                "systemInstruction": {
                    "parts": [{"text": system_instruction}]
                },
                "contents": contents,
                "generationConfig": {
                    "temperature": 0.6
                }
            }

            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key={api_key}"
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={
                    "Content-Type": "application/json",
                    "User-Agent": "aistudio-build-python"
                },
                method="POST"
            )

            with urllib.request.urlopen(req, timeout=12) as response:
                res_data = json.loads(response.read().decode("utf-8"))
                
                reply_text = ""
                candidates = res_data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    reply_text = "".join(part.get("text", "") for part in parts)
                
                if not reply_text:
                    reply_text = "I've reviewed your financial data. How else can I assist with your budgets or bills?"

                proposal = None
                proposal_match = re.search(r"```proposal\s*([\s\S]*?)\s*```", reply_text)
                if proposal_match:
                    try:
                        proposal = json.loads(proposal_match.group(1))
                        proposal["id"] = f"prop_py_{int(os.times()[4] * 1000) if hasattr(os, 'times') else 179244}"
                        proposal["status"] = "PENDING"
                        proposal["createdAt"] = "2026-10-19T17:00:00.000Z"
                    except Exception:
                        pass

                cleaned_reply = re.sub(r"```proposal[\s\S]*?```", "", reply_text).strip()
                return {
                    "reply": cleaned_reply or reply_text,
                    "proposal": proposal
                }

        except Exception as e:
            # Fall back to local finance reasoning engine
            print(f"[FinTrack AI Python] Gemini API call failed: {e}", file=sys.stderr)

    return generate_local_finance_response(message, context)

# Vercel BaseHTTPRequestHandler serverless function handler
class handler(BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def do_POST(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            body = json.loads(post_data.decode("utf-8")) if post_data else {}
            
            result = process_chat_request(body)
            response_json = json.dumps(result).encode("utf-8")

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self._send_cors_headers()
            self.send_header("Content-Length", str(len(response_json)))
            self.end_headers()
            self.wfile.write(response_json)
        except Exception as e:
            err_json = json.dumps({"error": str(e)}).encode("utf-8")
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self._send_cors_headers()
            self.send_header("Content-Length", str(len(err_json)))
            self.end_headers()
            self.wfile.write(err_json)

    def do_GET(self):
        result = {"status": "ok", "service": "FinTrack AI Python Service", "version": "1.0.0"}
        response_json = json.dumps(result).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self._send_cors_headers()
        self.end_headers()
        self.wfile.write(response_json)

# WSGI Application for Vercel WSGI mode
def app(environ, start_response):
    method = environ.get("REQUEST_METHOD", "GET")
    if method == "OPTIONS":
        headers = [
            ("Access-Control-Allow-Origin", "*"),
            ("Access-Control-Allow-Methods", "POST, GET, OPTIONS"),
            ("Access-Control-Allow-Headers", "Content-Type, Authorization"),
        ]
        start_response("200 OK", headers)
        return [b""]
    
    if method == "POST":
        try:
            content_length = int(environ.get("CONTENT_LENGTH", 0))
            request_body = environ["wsgi.input"].read(content_length)
            body = json.loads(request_body.decode("utf-8")) if request_body else {}
            result = process_chat_request(body)
            response_data = json.dumps(result).encode("utf-8")
            status = "200 OK"
        except Exception as e:
            response_data = json.dumps({"error": str(e)}).encode("utf-8")
            status = "500 Internal Server Error"
        
        headers = [
            ("Content-Type", "application/json"),
            ("Access-Control-Allow-Origin", "*"),
            ("Content-Length", str(len(response_data)))
        ]
        start_response(status, headers)
        return [response_data]

    headers = [("Content-Type", "application/json"), ("Access-Control-Allow-Origin", "*")]
    start_response("200 OK", headers)
    return [json.dumps({"status": "ok", "service": "FinTrack AI Python Backend"}).encode("utf-8")]

# CLI execution mode (for stdin/stdout invocation by local server or child process)
if __name__ == "__main__":
    try:
        raw_input = sys.stdin.read()
        body = json.loads(raw_input) if raw_input.strip() else {}
        output = process_chat_request(body)
        print(json.dumps(output))
    except Exception as exc:
        print(json.dumps({"error": str(exc)}))
