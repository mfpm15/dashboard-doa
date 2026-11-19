import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

const dir=process.argv[2]||join(process.cwd(),'public','teduh');
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
for(const script of ['manuscript-index.js','extras.js','doa-nabi.js','doa-quran.js','guide.js','salat.js','munajat99.js']){
  vm.runInNewContext(file(script),context,{timeout:1500,filename:script});
}
assert(context.window.DOA_EXTRAS?.items?.length===38,'38 curated prayers must be retained');
const personal=context.window.DOA_EXTRAS.items.find(x=>x.id==='pilihan-pribadi-ringkas');
assert(personal && personal.meaning?.length>400 && !personal.meaning.includes('Impor File Pribadi'),
  'Original personal munajat must be present, not a placeholder');
assert(context.window.DOA_SALAT?.short?.length===9,'9 short post-salat steps must be retained');
assert(context.window.DOA_SALAT?.full?.length===19,'19 full post-salat steps must be retained');
const nabi=context.window.DOA_NABI.items;
assert(nabi.length===38,'Expected the 38 researched hadith entries');
const quran=context.window.DOA_QURAN;
assert(quran.length===8&&quran.every(x=>x.kind==='Al-Qur’an'&&x.url.startsWith('https://quran.com/')),'The eight Quranic prayers must show their sources');
assert([...nabi,...quran].every(x=>x.arabic&&x.latin&&x.meaning&&x.when&&x.reference&&x.url.startsWith('https://')),'A new prayer is missing its text or source');
const ids=[...context.window.DOA_EXTRAS.items,...nabi,...quran].map(x=>x.id);
assert(new Set(ids).size===ids.length,'Duplicate curated prayer IDs detected');

for(const script of ['app.js','sw.js']){
  new vm.Script(file(script),{filename:script});
}
const html=file('index.html');
const order=['manuscript-index.js','extras.js','doa-nabi.js','doa-quran.js','guide.js','salat.js','app.js'];
assert(!html.includes('src="./data.js"')&&!html.includes('src="./munajat99.js"'),'The homepage eagerly loads the long manuscript');
let last=-1;
for(const name of order){
  const pos=html.indexOf('src="./'+name+'"');
  assert(pos>last,'Missing or out-of-order asset: '+name);
  last=pos;
}
for(const name of ['manifest.webmanifest','icon.svg','style.css','masjid-fajar.webp','masjid-fajar-mobile.webp','noto-naskh-arabic.woff2','OFL-noto-naskh-arabic.txt']){
  assert(existsSync(join(dir,name)),'Missing '+name);
}
const sw=file('sw.js');
for(const name of [...order,'index.html','manifest.webmanifest','icon.svg','style.css','masjid-fajar.webp','masjid-fajar-mobile.webp','noto-naskh-arabic.woff2','munajat99.js']){
  assert(sw.includes("'"+name+"'"),'Missing offline asset: '+name);
}
const phases=context.window.DOA_MANUSCRIPT_INDEX;
assert(phases.length===data.chapters.length,'The lightweight index lost phases');
for(const [index,chapter] of data.chapters.entries()){
  const phase=phases[index];
  assert(phase.number===chapter.number&&phase.sections.length===chapter.sections.length,'Phase index is incomplete');
  assert(JSON.stringify(JSON.parse(file('pustaka/fase-'+chapter.number+'.json')))===JSON.stringify(chapter.sections),'Splitting must preserve every original reading block');
  assert(phase.sections.every((section,i)=>section.id===chapter.sections[i].id&&section.blockCount===chapter.sections[i].blocks.length&&!section.blocks),'Missing lightweight metadata');
}
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
async function renderTest(hash,preferences=null,positions={},requests=[],fail=false){
  const root={innerHTML:'',textContent:'',addEventListener(){}};
  const { DOA_MUNAJAT_99: expansion, ...eager }=context.window;
  const win={...eager,addEventListener(){},scrollTo(){}};
  const doc={
    getElementById(id){return id==='app'?root:null},
    createElement(){return {remove(){}}},
    head:{appendChild(script){requests.push(script.src);win.DOA_MUNAJAT_99=expansion;script.onload()}},
    documentElement:{dataset:{}},body:{style:{setProperty(){}},classList:{toggle(){}}},title:'',
  };
  const fetch=async path=>{
    requests.push(path);
    return {ok:!fail,json:async()=>JSON.parse(file(path))};
  };
  await vm.runInNewContext(file('app.js'),{fetch,window:win,document:doc,localStorage:{getItem(key){return JSON.stringify(key==='doa-teduh-reader-panels-v1'?positions:preferences)},setItem(){}},navigator:{},location:{hash,protocol:'https:'}},{timeout:5000,filename:'app.js'});
  return root.innerHTML;
}
const homeRequests=[];
const homeOutput=await renderTest('',null,{},homeRequests);
assert(homeOutput.includes('data-id="doa-pribadi-99"')&&homeOutput.includes('Doa Pribadi'),'Home shortcut missing');
assert(!homeRequests.length,'Loading the homepage must make no requests for the manuscript');
const longRequests=[];
const longOutput=await renderTest('#baca/doa-pribadi-panjang',null,{},longRequests);
assert(longRequests.join()==='./pustaka/fase-13.json','The personal closing should fetch only phase 13');
const failed=await renderTest('#baca/doa-pribadi-panjang',null,{},[],true);
assert(failed.includes('data-action="reader-retry"'),'A failed prayer download must offer a retry');
assert(longOutput.includes('Doa Pribadi')&&longOutput.includes('9 hajat utama'),'Direct reader missing');
const escapeText=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
for(const b of expected)assert(longOutput.includes(escapeText(b.text)),'A source paragraph was lost from the long reader');
console.log('PASS: original long personal munajat, 92 source blocks, all Arabic/Latin/Indonesian text rendered; home shortcut and direct reading URL work');

const expansion=context.window.DOA_MUNAJAT_99;
assert(expansion.items.length===99&&expansion.groups.length===13,'Expected 99 individual prayers in 13 groups');
assert(expansion.items.every((x,i)=>x.number===i+1&&x.text.length>80),'Missing or invalid Asma meaning prayer');
assert(new Set(expansion.items.map(x=>x.text)).size===99,'Duplicate munajat paragraphs');
const expandedRequests=[];
const expandedOutput=await renderTest('#baca/doa-pribadi-99',null,{},expandedRequests);
assert(expandedRequests.join()==='./pustaka/fase-13.json,./munajat99.js','The expanded prayer should fetch only the closing and the 99 additions');
assert(expandedOutput.includes('Doa Pribadi')&&expandedOutput.includes('99 unsur Asmaul Husna'),'Expanded reader missing');
for(const item of expansion.items)assert(expandedOutput.includes(escapeText(item.text)),'An expanded prayer is not rendered: '+item.number);
for(const b of expected)assert(expandedOutput.includes(escapeText(b.text)),'Original closing was lost from extended reader');
assert(expandedOutput.includes('data-id="doa-pribadi-panjang"'),'Original reading shortcut missing');
console.log('PASS: 99 complete original Indonesian additions, 13 groups, all 92 original closing blocks, original reader link and extended reader route');

const shortOutput=await renderTest('#ringkas/pilihan-pribadi-ringkas');
for(const output of [shortOutput,longOutput,expandedOutput]){
 assert(output.includes('personal-mode-options'),'Shared personal selector missing');
 for(const id of ['pilihan-pribadi-ringkas','doa-pribadi-panjang','doa-pribadi-99'])assert(output.includes('data-id="'+id+'"'),'Missing mode '+id);
 assert(!output.includes('338 bagian')&&!output.includes('92 bagian'),'Technical block counts should not appear');
}
assert(shortOutput.includes(escapeText(personal.meaning)),'Short personal prayer missing');
const dailyPersonal=await renderTest('#doa-pilihan/pribadi');
assert((dailyPersonal.match(/class="quick-card card personal-library-card"/g)||[]).length===1,'Personal category must have one entry');
assert(!dailyPersonal.includes('data-id="doa-pribadi-panjang"')&&!dailyPersonal.includes('data-id="pilihan-pribadi-ringkas"'),'Duplicate personal cards in category');
console.log('PASS: single personal library entry and 3 shared reading modes; all texts preserved');

const nabiLibrary=await renderTest('#doa-nabi');
assert(nabiLibrary.includes('Doa Nabi ﷺ')&&nabiLibrary.includes('name="nabi-topics"'),'Prophetic prayer library is missing');
assert(nabiLibrary.includes('id="nabi-query"')&&nabiLibrary.includes('id="nabi-search-status"'),'In-library search must be accessible');
assert(!nabiLibrary.includes('data-id="doa-pribadi-99"'),'Personal prayer should remain outside the prophetic prayer library');
assert(!nabiLibrary.includes('data-accordion open'),'Topic panels must start collapsed');
const debtLibrary=await renderTest('#doa-nabi/utang');
assert(debtLibrary.includes('id="nabi-topics-utang" class="accordion card" data-accordion open'),'Direct debt topic must open');
const debtIds=['nabi-utang-uhud','kur-rezeki-halal','nabi-utang-sebelum-tidur','nabi-utang-kecemasan','nabi-utang-dosa'];
assert(debtIds.every(id=>debtLibrary.includes('data-id="'+id+'"')),'Debt topic is incomplete');
const uhud=await renderTest('#ringkas/nabi-utang-uhud');
assert(uhud.includes('مَالِكَ الْمُلْكِ')&&uhud.includes('hasan menurut Al-Albani')&&uhud.includes('Shahih At-Targhib 1821'),'The Uhud narration must preserve its text and grading');
const sir=await renderTest('#ringkas/kur-rezeki-halal');
assert(sir.includes('Gunung Ṣīr')&&sir.includes('tirmidhi:3563'),'The distinct Tirmidhi narration must remain accessible');
assert((expandedOutput.match(/name="reader-sections"/g)||[]).length>=13,'The long personal prayer needs collapsible sections');
for(const [mode,count] of [['short',9],['full',19]]){
  const salat=await renderTest('#setelah-salat',{salatMode:mode});
  assert((salat.match(new RegExp('name="salat-'+mode+'"','g'))||[]).length===count,'Post-salat disclosures missing for '+mode);
}
const asmaLibrary=await renderTest('#jelajah',{explore:'asma'});
assert((asmaLibrary.match(/class="name-card"/g)||[]).length===101,'The Asmaul Husna library lost a card');
assert((asmaLibrary.match(/name="asma-ranges"/g)||[]).length===13,'Asmaul Husna should be grouped by phase');
console.log('PASS: 38 added hadith entries, 5 debt prayers, and compact personal, Asmaul Husna and post-salat reading.');

const resume=await renderTest('',{last:'doa-pribadi-panjang'},{'doa-pribadi-panjang':'reader-part-7'});
assert(resume.includes('data-action="resume-read"')&&resume.includes('Lanjutkan bagian'),'Saved reader section must be reachable from home');
assert(longOutput.includes('data-action="reader-next-part"')&&longOutput.includes('data-action="reader-index"'),'Navigation between long reader sections is missing');
console.log('PASS: in-library search and navigation to saved reading sections.');

const quranLibrary=await renderTest('#doa-quran');
assert(quranLibrary.includes('Doa Al-Qur’an')&&quranLibrary.includes('id="quran-query"'),'Quran collection search is missing');
assert(quranLibrary.includes('data-id="quran-syukur-keturunan"')&&!quranLibrary.includes('data-id="nabi-utang-uhud"'),'Quran library should contain Quranic prayers');
assert(nabiLibrary.includes('data-id="nabi-ibadah-qunut-witir"')&&!nabiLibrary.includes('data-id="quran-syukur-keturunan"'),'Hadith and Quran library membership is inconsistent');
assert(homeOutput.includes('id="home-search"')&&homeOutput.includes('src="./masjid-fajar.webp"')&&homeOutput.includes('srcset="./masjid-fajar-mobile.webp"'),'Home search or responsive artwork is missing');
const family=await renderTest('#doa-pilihan/keluarga');
assert(family.includes('data-id="quran-zakariya-keturunan"')&&!family.includes('data-id="nabi-utang-uhud"'),'Family topic is missing or shows unrelated results');
const musa=await renderTest('#ringkas/quran-musa-rezeki');
assert(musa.includes('https://quran.com/28/24')&&musa.includes('data-action="reading-context"'),'Direct reading and reference shortcut are missing');
console.log('PASS: 84 selected readings, Quran collection, home search and source shortcuts.');
