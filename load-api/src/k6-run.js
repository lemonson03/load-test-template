import { spawn } from 'node:child_process';
import pidusage from 'pidusage';

const jobs = new Map(); // pid -> { pid, startedAt, args }

export function list() {
  return Array.from(jobs.values());
}

export async function stopAll() {
  let count = 0;
  for (const { pid } of jobs.values()) {
    try { process.kill(pid, 'SIGINT'); count++; } catch {}
  }
  jobs.clear();
  return count;
}

export async function runK6({ scenarioPath, vus, duration, targetUrl, influxUrl, influxDb }) {
  const args = [
    'run',
    '-o', `influxdb=${influxUrl}/${influxDb}`,
    scenarioPath
  ];

  const env = {
    ...process.env,
    TARGET_URL: targetUrl,
    K6_VUS: String(vus),
    K6_DURATION: String(duration)
  };

  const child = spawn('k6', args, { env, stdio: 'inherit' });

  const meta = { pid: child.pid, startedAt: Date.now(), args: { scenarioPath, vus, duration, targetUrl } };
  jobs.set(child.pid, meta);

  child.on('exit', () => jobs.delete(child.pid));

  // 간단한 사용량 로깅(옵션)
  (async () => {
    try {
      while (jobs.has(child.pid)) {
        const stat = await pidusage(child.pid);
        // console.log(`[k6 ${child.pid}] cpu=${stat.cpu.toFixed(1)} mem=${(stat.memory/1e6).toFixed(1)}MB`);
        await new Promise(r => setTimeout(r, 5000));
      }
    } catch {}
  })();

  return meta;
}
