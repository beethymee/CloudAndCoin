import { spawn } from 'child_process';
import path from 'path';

export interface ChatRequestBody {
  message: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
  context?: any;
}

export function handleGeminiChat(body: ChatRequestBody): Promise<{
  reply: string;
  toolInvocations?: any[];
  proposal?: any;
}> {
  return new Promise((resolve, reject) => {
    const pythonScriptPath = path.resolve(process.cwd(), 'api/chat.py');
    const py = spawn('python3', [pythonScriptPath], {
      env: {
        ...process.env,
      },
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
      console.error('[FinTrack AI] Failed to spawn python3:', err);
      reject(err);
    });

    py.on('close', (code) => {
      if (code !== 0) {
        console.warn(`[FinTrack AI] Python process exited with code ${code}. Stderr: ${stderrData}`);
      }

      try {
        const parsed = JSON.parse(stdoutData.trim());
        resolve(parsed);
      } catch (err) {
        console.error('[FinTrack AI] Could not parse Python JSON output:', stdoutData);
        reject(new Error(`Failed to parse Python response: ${stderrData || stdoutData}`));
      }
    });

    py.stdin.write(JSON.stringify(body));
    py.stdin.end();
  });
}
