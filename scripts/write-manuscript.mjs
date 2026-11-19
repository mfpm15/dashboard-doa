import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function writeManuscript(directory) {
  const source = readFileSync(join(directory, 'data.js'), 'utf8').trim();
  const prefix = 'window.DOA_DATA=';
  if (!source.startsWith(prefix) || !source.endsWith(';')) {
    throw new Error('Unexpected manuscript source format');
  }
  const { chapters } = JSON.parse(source.slice(prefix.length, -1));
  const library = join(directory, 'pustaka');
  mkdirSync(library, { recursive: true });
  const index = chapters.map(({ number, shortTitle, sections }) => {
    writeFileSync(join(library, 'fase-' + number + '.json'), JSON.stringify(sections));
    return {
      number,
      shortTitle,
      sections: sections.map(({ id, chapter, type, number, variant, title, arabicTitle, subtitle, blocks }) => ({
        id, chapter, type, number, variant, title, arabicTitle, subtitle, blockCount: blocks.length,
      })),
    };
  });
  writeFileSync(join(directory, 'manuscript-index.js'), 'window.DOA_MANUSCRIPT_INDEX=' + JSON.stringify(index) + ';\n');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  writeManuscript(process.argv[2] || 'public/teduh');
}
