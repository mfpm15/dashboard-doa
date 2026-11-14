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
assert(sw.includes('doa-teduh-v3-7-1'),'Worker cache must have current release version');
const deploy=JSON.parse(readFileSync(join(process.cwd(),'public','deploy-meta.json'),'utf8'));
assert(deploy.commit && deploy.app==='Doa Teduh','Missing deployment SHA metadata');
console.log('PASS: full personal library — 13 phases, 99 names/101 Asma, 126 sections, 7578 blocks, 38 curated prayers, and 9/19 salat steps');

/* Exercise the full reader without network or browser dependencies. */
const originalClosing=data.chapters.find(c=>c.number===13).sections.find(s=>s.id==='asma-99');
const start=originalClosing.blocks.findIndex(b=>b.text==='Paragraf Doa Penutup Fase 13 - Penyerahan Diri Sepenuhnya');
const end=originalClosing.blocks.findIndex((b,i)=>i>start&&b.text==="Aamiin, aamiin, aamiin, ya Rabbal 'Aalamiin.");
const expected=originalClosing.blocks.slice(start,end+1);
assert(start>=0&&end>start&&expected.length===92,'Original long munajat must retain all 92 blocks');
assert(expected.filter(b=>b.type==='arabic').length===27,'Original 27 Arabic blocks missing');
assert(expected.filter(b=>b.type==='latin').length===27,'Original 27 Latin blocks missing');
function renderTest(hash){
  const root={innerHTML:'',textContent:'',addEventListener(){}};
  const win={...context.window,DOA_DATA:data,addEventListener(){},scrollTo(){}};
  const doc={getElementById(id){return id==='app'?root:null},documentElement:{dataset:{}},body:{style:{setProperty(){}},classList:{toggle(){}}},title:''};
  vm.runInNewContext(file('app.js'),{window:win,document:doc,localStorage:{getItem(){return null},setItem(){}},navigator:{},location:{hash,protocol:'https:'}},{timeout:5000,filename:'app.js'});
  return root.innerHTML;
}
const homeOutput=renderTest('');
assert(homeOutput.includes('data-id="doa-pribadi-panjang"')&&homeOutput.includes('Doa pribadi lengkap'),'Home shortcut missing');
const longOutput=renderTest('#baca/doa-pribadi-panjang');
assert(longOutput.includes('Doa Pribadi Lengkap — Doa Penutup Agung'),'Direct reader missing');
const escapeText=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
for(const b of expected)assert(longOutput.includes(escapeText(b.text)),'A source paragraph was lost from the long reader');
console.log('PASS: original long personal munajat, 92 source blocks, all Arabic/Latin/Indonesian text rendered; home shortcut and direct reading URL work');
