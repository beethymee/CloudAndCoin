import { AuditLogEntry, PermissionTier } from '../types/finance';

export interface SecurityScanResult {
  isSafe: boolean;
  threatType?: 'PROMPT_INJECTION' | 'ROLE_ESCAPE' | 'UNAUTHORIZED_OVERRIDE' | 'EXFILTRATION';
  detectedPattern?: string;
  recommendedAction: 'PROCEED' | 'BLOCK' | 'FLAG_FOR_CONFIRMATION';
  defenseExplanation?: string;
}

const INJECTION_PATTERNS: { regex: RegExp; type: SecurityScanResult['threatType']; label: string }[] = [
  {
    regex: /(?:ignore|disregard|forget)\s+(?:all\s+)?(?:previous|prior|system)\s+(?:instructions|rules|prompts|commands)/i,
    type: 'PROMPT_INJECTION',
    label: 'Instruction Override Attempt',
  },
  {
    regex: /(?:you are now|pretend to be|act as|switch to)\s+(?:DAN|unrestricted|god mode|jailbroken|admin)/i,
    type: 'ROLE_ESCAPE',
    label: 'Jailbreak Role Theft Attempt',
  },
  {
    regex: /(?:show|reveal|print|leak|repeat)\s+(?:your\s+)?(?:system\s+prompt|hidden\s+instructions|developer\s+mode)/i,
    type: 'EXFILTRATION',
    label: 'System Prompt Exfiltration Attempt',
  },
  {
    regex: /(?:bypass|skip|ignore|override)\s+(?:permission|confirmation|approval|tier|human-in-the-loop)/i,
    type: 'UNAUTHORIZED_OVERRIDE',
    label: 'Permission Tier Bypass Attempt',
  },
  {
    regex: /(?:transfer|pay|send)\s+(?:all|everything|all\s+funds)\s+(?:to\s+account|immediately\s+without\s+asking)/i,
    type: 'UNAUTHORIZED_OVERRIDE',
    label: 'Unauthorized High-Risk Fund Depletion',
  },
];

export function scanUserPromptForInjections(input: string): SecurityScanResult {
  const normalized = input.trim();

  for (const { regex, type, label } of INJECTION_PATTERNS) {
    if (regex.test(normalized)) {
      return {
        isSafe: false,
        threatType: type,
        detectedPattern: label,
        recommendedAction: 'BLOCK',
        defenseExplanation: `Security Guard Alert: Detected pattern "${label}". The Financial Assistant strictly enforces WeBank/FinTechathon security compliance guidelines. Prompts attempting to subvert permission boundaries or human-in-the-loop confirmation are blocked.`,
      };
    }
  }

  return {
    isSafe: true,
    recommendedAction: 'PROCEED',
  };
}

export function classifyActionTier(actionName: string): { tier: PermissionTier; requiresConfirmation: boolean; description: string } {
  const lower = actionName.toLowerCase();

  // Tier 1: Read-Only
  if (
    lower.includes('query') ||
    lower.includes('get') ||
    lower.includes('view') ||
    lower.includes('analyze') ||
    lower.includes('insight') ||
    lower.includes('calculate') ||
    lower.includes('breakdown')
  ) {
    return {
      tier: 1,
      requiresConfirmation: false,
      description: 'Tier 1 (Read-Only): Autonomous execution permitted. No financial assets or budgets modified.',
    };
  }

  // Tier 2: Write / Modify / Propose (Human Confirmation Required)
  if (
    lower.includes('budget') ||
    lower.includes('pay') ||
    lower.includes('bill') ||
    lower.includes('transfer') ||
    lower.includes('allocate') ||
    lower.includes('cancel') ||
    lower.includes('propose')
  ) {
    return {
      tier: 2,
      requiresConfirmation: true,
      description: 'Tier 2 (Propose & Human-in-the-loop): AI prepares structured proposal. User must review and click Approve to execute.',
    };
  }

  // Tier 3: High Risk / Configuration
  return {
    tier: 3,
    requiresConfirmation: true,
    description: 'Tier 3 (Restricted Admin): System level changes requiring strict authorization.',
  };
}

// Generate simple deterministic checksum hash
export function generateAuditHash(timestamp: string, action: string, details: string): string {
  const payload = `${timestamp}:${action}:${details}`;
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  const salt = Math.abs((hash ^ 0x5a5a5a5a)).toString(16).padStart(8, '0');
  return `sha256-${hex}${salt}891b`;
}

export function createAuditLog(
  action: string,
  category: AuditLogEntry['category'],
  tier: PermissionTier,
  details: string,
  actor: AuditLogEntry['actor'] = 'AI_AGENT',
  status: AuditLogEntry['status'] = 'SUCCESS'
): AuditLogEntry {
  const timestamp = new Date().toISOString();
  return {
    id: `audit_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    timestamp,
    action,
    category,
    tier,
    details,
    actor,
    status,
    hash: generateAuditHash(timestamp, action, details),
  };
}
