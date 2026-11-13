import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const dirname = path.join(root, 'src/content/doa-komprehensif/parts');
const target = path.join(root, 'public/teduh/data.js');
const chapters = [];
const counts = new Map();

function block(type, text) { return { type, text: String(text || '') }; }
function evidenceBlocks(items) {
  return (items || []).flatMap(e => [
    block('label', e.type === 'quran' ? 'Dalil Al-Qur’an' : e.type === 'hadith' ? 'Dalil hadis' : 'Rujukan'),
    ...(e.arabic ? [block('arabic',e.arabic)] : []),
    ...(e.transliteration ? [block('latin',e.transliteration)] : []),
    ...(e.translationId ? [block('translation',e.translationId)] : []),
    block('source', e.reference || 'Rujukan belum dicantumkan'),
    ...(e.note ? [block('note', e.note)] : [])
  ]);
}
function duaBlocks(dua) {
  if (!dua) return [];
  return [
    ...(dua.arabic ? [block('arabic',dua.arabic)] : []),
    ...(dua.transliteration ? [block('latin',dua.transliteration)] : []),
    ...(dua.translationId ? [block('translation',dua.translationId)] : [])
  ];
}
function section(id, chapter, number, title, arabicTitle, subtitle, type, blocks) {
  return {id,chapter,number,title,arabicTitle,subtitle,type,blocks,
    readingWords: blocks.map(b => b.text || '').join(' ').split(/\s+/).length,
    sourceCount: blocks.filter(b => b.type === 'source').length,warnings:[]};
}

for (let n=1;n<=13;n++) {
  const filename=path.join(dirname,'part-'+String(n).padStart(2,'0')+'.ts');
  // These 13 tracked TypeScript files contain plain object literals with only
  // an import, one top-level type annotation and an export; no TS runtime needed.
  const identifier='part'+String(n).padStart(2,'0');
  const original=fs.readFileSync(filename,'utf8');
  const importLine="import { CollectionPart } from '@/types/asmaulHusna';";
  if (!original.startsWith(importLine) || !original.includes('const '+identifier+': CollectionPart =')) {
    throw Error('Unexpected prayer data syntax in '+filename);
  }
  const plain=original.slice(importLine.length)
    .replace('const '+identifier+': CollectionPart =','const '+identifier+' =')
    .replace(new RegExp('export default '+identifier+';\s*),'');
  const part=vm.runInNewContext(plain+'\n'+identifier,Object.create(null),{timeout:2000});
  if (!part || part.partNumber !== n || !Array.isArray(part.items)) throw Error('Invalid phase '+n);
  const sections=[];
  sections.push(section('fase-'+n+'-pengantar',n,null,'Pengantar & landasan','','','intro',[
    block('subhead',part.title),block('text',part.introduction),
    ...evidenceBlocks(part.quranEvidence),...evidenceBlocks(part.hadithEvidence)]));
  for (const item of part.items) {
    const count=(counts.get(item.number)||0)+1;counts.set(item.number,count);
    const blocks=[
      block('subhead','Mengenal '+item.transliteration),
      block('text',item.explanation),block('label','Doa dengan '+item.transliteration),
      ...duaBlocks(item.dua),...evidenceBlocks(item.evidence)
    ];
    sections.push(section('asma-'+item.number+(count>1?'-v'+count:''),n,item.number,
      item.transliteration,item.nameArabic,item.meaningId,'asma',blocks));
  }
  for (const [idx,entry] of (part.matsurDuas||[]).entries()){
    sections.push(section('fase-'+n+'-matsur-'+idx,n,null,entry.title,'','','other',[
      ...duaBlocks(entry.dua),block('source',entry.source),
      ...(entry.virtue?[block('note',entry.virtue)]:[])
    ]));
  }
  if (part.closingDua || part.closingParagraph){
    sections.push(section('fase-'+n+'-penutup',n,null,'Penutup fase','','','closing',[
      ...duaBlocks(part.closingDua),
      ...(part.closingParagraph?[block('text',part.closingParagraph)]:[])
    ]));
  }
  chapters.push({
    id:'fase-'+n,number:n,title:part.phaseTitle,shortTitle:part.title,sourceDoc:'Public repository source',
    count:sections.length,sections
  });
}
const result={
  meta:{title:'Doa Teduh',date:'2026-11-13',chapters:13,uniqueAsma:counts.size,
    asmaSections:[...counts.values()].reduce((a,b)=>a+b,0),
    sourceDocs:['mfpm15/dashboard-doa (public dataset)'],paragraphBlocks:chapters.reduce((a,c)=>a+c.sections.reduce((x,s)=>x+s.blocks.length,0),0),
    duplicates:Object.fromEntries([...counts].filter(x=>x[1]>1)),
    note:'Versi publik bersumber dari data existing repository; impor file HTML v3.4 pribadi untuk membuka naskah asli lengkap di perangkat.'
  },chapters
};
fs.mkdirSync(path.dirname(target),{recursive:true});
fs.writeFileSync(target,'window.DOA_DATA='+JSON.stringify(result)+';\n','utf8');
console.log('Doa Teduh public data:',result.meta.chapters,'phases,',result.meta.uniqueAsma,'unique Asmaul Husna,',result.meta.paragraphBlocks,'content blocks');
),'');
  const part=vm.runInNewContext(plain+'\n'+identifier,Object.create(null),{timeout:2000});
  if (!part || part.partNumber !== n || !Array.isArray(part.items)) throw Error('Invalid phase '+n);
  const sections=[];
  sections.push(section('fase-'+n+'-pengantar',n,null,'Pengantar & landasan','','','intro',[
    block('subhead',part.title),block('text',part.introduction),
    ...evidenceBlocks(part.quranEvidence),...evidenceBlocks(part.hadithEvidence)]));
  for (const item of part.items) {
    const count=(counts.get(item.number)||0)+1;counts.set(item.number,count);
    const blocks=[
      block('subhead','Mengenal '+item.transliteration),
      block('text',item.explanation),block('label','Doa dengan '+item.transliteration),
      ...duaBlocks(item.dua),...evidenceBlocks(item.evidence)
    ];
    sections.push(section('asma-'+item.number+(count>1?'-v'+count:''),n,item.number,
      item.transliteration,item.nameArabic,item.meaningId,'asma',blocks));
  }
  for (const [idx,entry] of (part.matsurDuas||[]).entries()){
    sections.push(section('fase-'+n+'-matsur-'+idx,n,null,entry.title,'','','other',[
      ...duaBlocks(entry.dua),block('source',entry.source),
      ...(entry.virtue?[block('note',entry.virtue)]:[])
    ]));
  }
  if (part.closingDua || part.closingParagraph){
    sections.push(section('fase-'+n+'-penutup',n,null,'Penutup fase','','','closing',[
      ...duaBlocks(part.closingDua),
      ...(part.closingParagraph?[block('text',part.closingParagraph)]:[])
    ]));
  }
  chapters.push({
    id:'fase-'+n,number:n,title:part.phaseTitle,shortTitle:part.title,sourceDoc:'Public repository source',
    count:sections.length,sections
  });
}
const result={
  meta:{title:'Doa Teduh',date:'2026-11-13',chapters:13,uniqueAsma:counts.size,
    asmaSections:[...counts.values()].reduce((a,b)=>a+b,0),
    sourceDocs:['mfpm15/dashboard-doa (public dataset)'],paragraphBlocks:chapters.reduce((a,c)=>a+c.sections.reduce((x,s)=>x+s.blocks.length,0),0),
    duplicates:Object.fromEntries([...counts].filter(x=>x[1]>1)),
    note:'Versi publik bersumber dari data existing repository; impor file HTML v3.4 pribadi untuk membuka naskah asli lengkap di perangkat.'
  },chapters
};
fs.mkdirSync(path.dirname(target),{recursive:true});
fs.writeFileSync(target,'window.DOA_DATA='+JSON.stringify(result)+';\n','utf8');
console.log('Doa Teduh public data:',result.meta.chapters,'phases,',result.meta.uniqueAsma,'unique Asmaul Husna,',result.meta.paragraphBlocks,'content blocks');
