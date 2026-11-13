import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const site = join(root, 'public', 'teduh');
for (const script of ['scripts/generate-teduh-data.mjs', 'scripts/write-deploy-meta.mjs']) {
  execFileSync(process.execPath, [join(root, script)], { cwd: root, stdio: 'inherit' });
}

// Validate the public collection before publishing; do not silently deploy an
// empty or truncated prayer library.
const dataPath = join(site, 'data.js');
const raw = readFileSync(dataPath, 'utf8').trim();
if (!raw.startsWith('window.DOA_DATA=') || !raw.endsWith(';')) throw Error('Invalid data.js wrapper');
const data = JSON.parse(raw.slice('window.DOA_DATA='.length, -1));
if (data.chapters?.length !== 13 || data.meta?.uniqueAsma !== 99) {
  throw Error('Prayer library integrity mismatch (expected 13 phases and 99 Asmaul Husna)');
}
const extras = readFileSync(join(site, 'extras.js'), 'utf8');
if (!extras.includes('window.DOA_EXTRAS=') || (extras.match(/"id":/g) || []).length < 38) {
  throw Error('Curated prayers missing: expected at least 38 entries');
}
const required = [
  'index.html', 'app.js', 'style.css', 'guide.js', 'salat.js', 'extras.js',
  'data.js', 'private-loader.js', 'import.html', 'import.js',
  'sw.js', 'manifest.webmanifest', 'icon.svg', 'deploy-meta.json',
];
for (const file of required) if (!existsSync(join(site, file))) throw Error('Missing '+file);

// Every deploy gets a fresh worker cache key. Do not cache user-imported
// private content; that remains only in local browser storage.
const sha = process.env.COMMIT_REF || process.env.GITHUB_SHA || 'local';
const swPath = join(site, 'sw.js');
const sw = readFileSync(swPath, 'utf8').replace('__BUILD_SHA__', sha.slice(0, 12));
writeFileSync(swPath, sw, 'utf8');
execFileSync(process.execPath, [join(root, 'scripts/verify-static.mjs')], { cwd: root, stdio: 'inherit' });
console.log('Static Doa Teduh validated: 13 phases, 99 Asmaul Husna, 38 curated prayers; no Next.js dependencies.');
