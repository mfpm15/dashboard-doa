import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

const dir=join(process.cwd(),'public','teduh');
const file=name=>readFileSync(join(dir,name),'utf8');
const assert=(condition,message)=>{if(!condition)throw Error(message)};

const raw=file('data.js').trim();
assert(raw.startsWith('window.DOA_DATA=') && raw.endsWith(';'),'Missing/invalid prayer data');
const data=JSON.parse(raw.slice('window.DOA_DATA='.length,-1));
assert(data.chapters?.length===13,'13 phases must be retained');
assert(data.meta?.uniqueAsma===99,'99 unique Asmaul Husna must be retained');
assert(data.meta?.asmaSections===101,'Original 101 Asmaul Husna reading sections must be retained');
assert(data.meta?.paragraphBlocks===7578,'Original 7578 content blocks must be retained');
assert(data.chapters.reduce((sum,c)=>sum+(c.sections?.length||0),0)===126,'Original 126 reading sections must be retained');
assert(data.chapters.every(x=>x.sections?.length>0),'An empty phase was generated');

const context={window:{}};
for(const script of ['extras.js','guide.js','salat.js']){
  vm.runInNewContext(file(script),context,{timeout:1500,filename:script});
}
assert(context.window.DOA_EXTRAS?.items?.length===38,'38 curated prayers must be retained');
const personal=context.window.DOA_EXTRAS.items.find(x=>x.id==='pilihan-pribadi-ringkas');
assert(personal && personal.meaning?.length>400 && !personal.meaning.includes('Impor File Pribadi'),
  'Original personal munajat must be present, not a placeholder');
assert(context.window.DOA_SALAT?.short?.length===9,'9 short post-salat steps must be retained');
assert(context.window.DOA_SALAT?.full?.length===19,'19 full post-salat steps must be retained');
const ids=context.window.DOA_EXTRAS.items.map(x=>x.id);
assert(new Set(ids).size===ids.length,'Duplicate curated prayer IDs detected');

for(const script of ['app.js','sw.js']){
  new vm.Script(file(script),{filename:script});
}
const html=file('index.html');
const order=['data.js','extras.js','guide.js','salat.js','app.js'];
let last=-1;
for(const name of order){
  const pos=html.indexOf('src="./'+name+'"');
  assert(pos>last,'Missing or out-of-order asset: '+name);
  last=pos;
}
for(const name of ['manifest.webmanifest','icon.svg','style.css']){
  assert(existsSync(join(dir,name)),'Missing '+name);
}
const sw=file('sw.js');
assert(sw.includes('doa-teduh-v3-7'),'Worker cache must have current release version');
const deploy=JSON.parse(readFileSync(join(process.cwd(),'public','deploy-meta.json'),'utf8'));
assert(deploy.commit && deploy.app==='Doa Teduh','Missing deployment SHA metadata');
console.log('PASS: full personal library — 13 phases, 99 names/101 Asma, 126 sections, 7578 blocks, 38 curated prayers, and 9/19 salat steps');
