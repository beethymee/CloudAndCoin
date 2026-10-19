import {
  ActionProposal,
  AuditLogEntry,
  ChatMessage,
  PermissionTier,
} from '../types/finance';
import { scanUserPromptForInjections, createAuditLog } from './securityGuard';

export interface SendMessageParams {
  userMessage: string;
  history: ChatMessage[];
  financialContext: any;
  onAuditLog: (log: AuditLogEntry) => void;
}

export async function sendChatMessage({
  userMessage,
  history,
  financialContext,
  onAuditLog,
}: SendMessageParams): Promise<{
  reply: string;
  proposal?: ActionProposal;
  securityAlert?: ChatMessage['securityAlert'];
  toolInvocations?: ChatMessage['toolInvocations'];
}> {
  // 1. Scan for Prompt Injection & Jailbreak attempts (Security Guardrail)
  const scanResult = scanUserPromptForInjections(userMessage);

  if (!scanResult.isSafe) {
    const blockAudit = createAuditLog(
      'ADVERSARIAL_INJECTION_DETECTED',
      'SECURITY_BLOCK',
      1,
      `Blocked malicious pattern: "${scanResult.detectedPattern}" | Threat Type: ${scanResult.threatType}`,
      'SECURITY_GUARD',
      'BLOCKED'
    );
    onAuditLog(blockAudit);

    return {
      reply: `🛡️ **Security Guardrail Intervention (FinTechathon Compliance)**\n\nYour message was flagged and blocked by our security filter.\n\n- **Detected Pattern:** ${scanResult.detectedPattern}\n- **Policy Violation:** ${scanResult.defenseExplanation}\n\nUnder strict financial compliance regulations, the AI Financial Assistant operates with **non-bypassable Human-in-the-Loop constraints**. All write operations require Tier-2 user authorization, and system instructions cannot be overridden.`,
      securityAlert: {
        type: 'INJECTION_ATTEMPT',
        reason: scanResult.detectedPattern || 'Prompt Injection',
        level: 'CRITICAL',
      },
    };
  }

  // Log user inquiry
  onAuditLog(
    createAuditLog(
      'USER_FINANCIAL_INQUIRY',
      'READ',
      1,
      `User query received: "${userMessage.slice(0, 80)}${userMessage.length > 80 ? '...' : ''}"`,
      'AI_AGENT',
      'SUCCESS'
    )
  );

  // 2. Query server-side Gemini API
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        history: history.map((h) => ({ role: h.role, content: h.content })),
        context: financialContext,
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    const data = await res.json();

    if (data.proposal) {
      onAuditLog(
        createAuditLog(
          'PROPOSAL_GENERATED',
          'PROPOSAL',
          2,
          `AI proposed Tier-2 action: ${data.proposal.title}. Pending user authorization.`,
          'AI_AGENT',
          'PENDING_APPROVAL'
        )
      );
    }

    return {
      reply: data.reply,
      proposal: data.proposal,
      toolInvocations: data.toolInvocations,
    };
  } catch (err: any) {
    console.error('Error in sendChatMessage:', err);
    // Provide clean fallback
    return {
      reply: `I encountered a communication delay connecting to the server. Your financial data is secure. You can review your budgets and bills directly in the dashboard tabs.`,
    };
  }
}
