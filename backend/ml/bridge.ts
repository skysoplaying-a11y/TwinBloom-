import { spawn } from 'child_process';
import path from 'path';

/**
 * Invokes a Python script located under backend/ml/ by piping input as JSON via stdin
 * and parsing stdout as JSON.
 */
export async function runPythonScript<T>(scriptName: string, payload: any): Promise<T> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), 'backend', 'ml', scriptName);
    const py = spawn('python3', [scriptPath]);

    let stdout = '';
    let stderr = '';

    py.stdout.on('data', chunk => {
      stdout += chunk.toString();
    });

    py.stderr.on('data', chunk => {
      stderr += chunk.toString();
    });

    py.on('error', err => {
      reject(err);
    });

    py.on('close', code => {
      if (code !== 0) {
        console.error(`Python script ${scriptName} exited with code ${code}:`, stderr);
        return reject(new Error(`Python script error: ${stderr || `Exit code ${code}`}`));
      }
      try {
        const parsed = JSON.parse(stdout);
        resolve(parsed);
      } catch (err) {
        console.error('Failed to parse Python JSON output:', stdout);
        reject(err);
      }
    });

    py.stdin.write(JSON.stringify(payload));
    py.stdin.end();
  });
}
