import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Generated at build by Netlify/GitHub; never put user data or secrets here.
const data = {
  app: 'Doa Teduh',
  version: '3.7.0',
  commit: process.env.COMMIT_REF || process.env.GITHUB_SHA || process.env.VERCEL_GIT_COMMIT_SHA || 'local',
  branch: process.env.BRANCH || process.env.GITHUB_REF_NAME || 'local',
  builtAt: new Date().toISOString(),
};
mkdirSync(join(process.cwd(), 'public'), { recursive: true });
writeFileSync(join(process.cwd(), 'public', 'deploy-meta.json'), JSON.stringify(data, null, 2) + '\n');
console.log('Build identity:', data.version, data.commit.slice(0, 12));
