window.startDoaTeduh=function(){'use strict';
const chs=window.DOA_MANUSCRIPT_INDEX, root=document.getElementById('app');
if(!chs){root.textContent='Pustaka doa gagal dimuat. Muat ulang halaman untuk mencoba lagi.';return}
const S={view:'home',phase:1,explore:'phase',filter:'semua',query:'',reader:'',quickId:'',dailyCategory:'semua',guideContext:'general',guideMode:'short',guideStep:0,salatMode:'full',salatDone:[],salatCounts:{},palette:'sage',font:31,baseFont:16,latin:true,translation:true,sources:true,dark:false,focus:false,saved:[],done:[],last:'',searchLimit:40,quickSearchLimit:12,nabiTopic:'',collectionSearch:{nabi:{query:'',limit:12},quran:{query:'',limit:12}},prefsOpen:false};
const PREF='doa-teduh-state-v2';
const READER_POSITIONS='doa-teduh-reader-panels-v1';
const preferenceKeys=['font','baseFont','latin','translation','sources','dark','saved','done','last','phase','explore','palette','guideContext','guideMode','salatMode','salatDone','salatCounts'];
function readStoredObject(key){
 try{
  const value=JSON.parse(localStorage.getItem(key)||'{}');
  return value&&typeof value==='object'&&!Array.isArray(value)?value:{};
 }catch{return {}}
}
const readPreferences=()=>readStoredObject(PREF);
function rememberPanel(panel){
 if(S.view!=='read'||panel.getAttribute('name')!=='reader-sections')return;
 const positions=readStoredObject(READER_POSITIONS);
 if(positions[S.reader]===panel.id)return;
 delete positions[S.reader];
 positions[S.reader]=panel.id;
 try{localStorage.setItem(READER_POSITIONS,JSON.stringify(Object.fromEntries(Object.entries(positions).slice(-24))))}catch{}
}
function savedPanel(id){
 const panel=readStoredObject(READER_POSITIONS)[id];
 return typeof panel==='string'&&/^reader-part-[0-9]+$/.test(panel)?panel:'';
}
function applyPreferences(values){
 for(const key of preferenceKeys)if(Object.hasOwn(values,key))S[key]=values[key];
 for(const key of ['saved','done','salatDone'])if(!Array.isArray(S[key]))S[key]=[];
 if(!S.salatCounts||typeof S.salatCounts!=='object'||Array.isArray(S.salatCounts))S.salatCounts={};
}
const preferenceSnapshot=()=>Object.fromEntries(preferenceKeys.map(key=>[key,JSON.stringify(S[key])]));
applyPreferences(readPreferences());
let lastPreferences=preferenceSnapshot();
const extras=window.DOA_EXTRAS||{items:[],moments:[]};
const nabiData=window.DOA_NABI||{items:[],updates:{}};
const quick=[...extras.items.map(item=>({...item,...nabiData.updates[item.id]})),...nabiData.items,...(window.DOA_QURAN||[])];
const moments=extras.moments, quickMap=new Map(quick.map(item=>[item.id,item]));
const collections={
 nabi:{title:'Doa Nabi ﷺ',description:'Bacaan yang diajarkan, diamalkan, atau disetujui Nabi Muhammad ﷺ.',items:quick.filter(item=>item.kind.startsWith('Hadis')||item.id==='pilihan-dunia-akhirat')},
 quran:{title:'Doa Al-Qur’an',description:'Doa para nabi dan permohonan dalam Al-Qur’an, lengkap dengan konteks ayat.',items:quick.filter(item=>item.kind==='Al-Qur’an')},
};
const guideData=window.DOA_GUIDE||{flows:{}}, guideFlows=guideData.flows;const salatData=window.DOA_SALAT||{short:[],full:[],custom:[]};const salatMap=new Map([...quick,...salatData.custom].map(x=>[x.id,x]));
const secs=chs.flatMap(chapter=>chapter.sections.map(section=>({...section,phaseTitle:chapter.shortTitle})));
const byId=new Map(secs.map(section=>[section.id,section]));
const closing=byId.get('asma-99');
const personalLong={
 id:'doa-pribadi-panjang',type:'personal',chapter:closing.chapter,phaseTitle:closing.phaseTitle,
 title:'Doa Pribadi Lengkap — Doa Penutup Agung',subtitle:'Munajat lengkap dengan sembilan hajat utama · dari Fase 13',
 warnings:['Ini munajat susunan pribadi dari naskah asli, bukan satu hadis Nabi ﷺ. Lafal pembuka merujuk pada perjalanan 99 Asmaul Husna; tahun dan target tertentu dipertahankan persis seperti naskah. Sesuaikan hajat saat berdoa bila perlu.'],
};
const personalExpanded={
 ...personalLong,id:'doa-pribadi-99',title:'Munajat Pribadi — 99 Unsur Asmaul Husna',
 subtitle:'99 permohonan pribadi · 13 bagian · sembilan hajat asli tetap lengkap',
 warnings:['Tambahan munajat ditulis dalam bahasa Indonesia. Teks Arab dan Latin pada bacaan bersumber serta penutup asli tetap dipertahankan. Ini susunan doa pribadi, bukan hadis atau amalan dengan jumlah khusus.','QS Al-A’raf 7:180 menganjurkan berdoa dengan nama Allah yang indah. Hadis Bukhari 2736 tentang 99 nama sahih, tetapi rincian daftar populer diperselisihkan; beberapa judul hanya menjadi indeks tema, bukan penetapan nama. Nama Allah tidak terbatas pada 99.'],
};
byId.set(personalLong.id,personalLong);
byId.set(personalExpanded.id,personalExpanded);

const phaseLoads=new Map();
function loadPhase(number){
 if(!phaseLoads.has(number)){
  const phase=chapter(number);
  const pending=fetch('./pustaka/fase-'+number+'.json').then(async response=>{
   if(!response.ok||response.redirected)throw Error('Unable to load phase');
   const sections=await response.json();
   if(!Array.isArray(sections)||sections.length!==phase.sections.length||sections.some((section,index)=>
    section?.id!==phase.sections[index].id||section.blocks?.length!==phase.sections[index].blockCount)){
    throw Error('Incomplete manuscript phase');
   }
   sections.forEach(section=>Object.assign(byId.get(section.id),section));
  }).catch(error=>{
   phaseLoads.delete(number);
   throw error;
  });
  phaseLoads.set(number,pending);
 }
 return phaseLoads.get(number);
}

let munajatLoad;
function loadMunajat(){
 return munajatLoad??=new Promise((resolve,reject)=>{
  const script=document.createElement('script');
  const fail=()=>{script.remove();reject(Error('Unable to load personal prayers'))};
  script.src='./munajat99.js';
  script.onload=()=>{
   if(window.DOA_MUNAJAT_99?.items?.length===99)resolve(window.DOA_MUNAJAT_99);
   else fail();
  };
  script.onerror=fail;
  document.head.appendChild(script);
 }).catch(error=>{munajatLoad=null;throw error});
}

function originalClosing(){
 const start=closing.blocks.findIndex(b=>b.text==='Paragraf Doa Penutup Fase 13 - Penyerahan Diri Sepenuhnya');
 const end=closing.blocks.findIndex((b,i)=>i>start&&b.text==="Aamiin, aamiin, aamiin, ya Rabbal 'Aalamiin.");
 if(start<0||end<=start)throw Error('Doa Penutup Agung missing from original source');
 const blocks=closing.blocks.slice(start,end+1);
 const translationStart=blocks.findIndex(b=>b.type==='label'&&b.text==='Terjemahan Indonesia Lengkap');
 // Preserve the original wording and keep the Indonesian passages under the translation control.
 return blocks.map((b,i)=>i>translationStart&&translationStart>=0&&b.type==='text'?{...b,type:'translation'}:b);
}

function expandClosing(munajat){
 const nameLookup=new Map(asma.map(section=>[section.number,section.title]));
 const block=(type,text)=>({type,text});
 const sourcedPrayer=id=>{
  const q=quickMap.get(id);
  return q?[block('subhead',q.title),block('arabic',q.arabic),block('latin',q.latin),block('translation',q.meaning),block('source',q.reference)]:[];
 };
 return [
  block('subhead','Pembukaan — taubat, pujian, shalawat dan Ismul A’zham'),
  ...['adab-istighfar','adab-hamdalah','adab-shalawat','adab-asma-agung'].flatMap(sourcedPrayer),
  block('subhead','Munajat berdasarkan 99 unsur makna Asmaul Husna'),
  block('note','Bacaan Indonesia berikut adalah susunan pribadi, bukan terjemahan suatu hadis. Nama dalam judul adalah indeks dari daftar dalam naskah; perincian daftar tersebut diperselisihkan. Tidak ada bilangan atau urutan wajib.'),
  ...munajat.items.flatMap((item,i)=>[
   ...(i%8===0?[block('subhead',String(Math.floor(i/8)+1).padStart(2,'0')+' · '+munajat.groups[Math.floor(i/8)])]:[]),
   block('label',String(item.number).padStart(2,'0')+' · '+nameLookup.get(item.number)),
   block('text',item.text)
  ]),
  block('subhead','Doa menyeluruh dari Al-Qur’an dan Sunnah'),
  ...['kur-jawami','pilihan-dunia-akhirat'].flatMap(sourcedPrayer),
  block('subhead','Lanjutkan dengan sembilan hajat dan penutup asli'),
  ...personalLong.blocks
 ];
}

async function prepareReading(section){
 if(section.blocks)return;
 const [,munajat]=await Promise.all([
  loadPhase(section.chapter),
  section===personalExpanded?loadMunajat():null,
 ]);
 if(section.type==='personal')personalLong.blocks??=originalClosing();
 if(section===personalExpanded)personalExpanded.blocks??=expandClosing(munajat);
}
const asma=secs.filter(s=>s.type==='asma');const nUnique=new Set(asma.map(s=>s.number)).size;
function persist(){
 const current=preferenceSnapshot();
 const changes=preferenceKeys.filter(key=>current[key]!==lastPreferences[key]);
 if(!changes.length)return;
 try{
  const latest=readPreferences();
  for(const key of changes)latest[key]=S[key];
  localStorage.setItem(PREF,JSON.stringify(latest));
 }catch{}
 lastPreferences=preferenceSnapshot();
}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function ico(id){const d={heart:'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z',quran:'M4 4h4a4 4 0 0 1 4 4v12a5 5 0 0 0-4-2H4zm16 0h-4a4 4 0 0 0-4 4v12a5 5 0 0 1 4-2h4z',spark:'M12 2l2.3 6.7L21 11l-6.7 2.3L12 20l-2.3-6.7L3 11l6.7-2.3ZM20 15v5m-2.5-2.5h5',compass:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z M15.8 8.2l-2.1 5.5-5.5 2.1 2.1-5.5z',home:'M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z',book:'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14A2.5 2.5 0 0 0 6.5 22H20',search:'m21 21-4.34-4.34M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16',bookmark:'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z',check:'M20 6 9 17l-5-5',chevron:'m9 18 6-6-6-6',back:'m15 18-6-6 6-6',moon:'M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13z',sun:'M12 3v2m0 14v2M4.2 4.2l1.4 1.4m12.8 12.8 1.4 1.4M3 12h2m14 0h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M16.4 12a4.4 4.4 0 1 1-8.8 0 4.4 4.4 0 0 1 8.8 0',shield:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',file:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6',close:'M18 6 6 18M6 6l12 12',settings:'M3 12h18M7 6v12M17 6v12',maximize:'M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3',copy:'M8 8h12v12H8zM4 16H3V4h12v1',share:'M12 16V2m-5 5 5-5 5 5M5 13v8h14v-8',info:'M12 17v-5m0-4h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',list:'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01'};return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d[id]||d.info}"/></svg>`}
function btn(action,label,cls='',attrs=''){return `<button class="${cls}" type="button" data-action="${action}" ${attrs}>${label}</button>`}
function announce(t){document.querySelector('.toast')?.remove();let x=document.createElement('div');x.className='toast';x.role='status';x.textContent=t;document.body.appendChild(x);setTimeout(()=>x.remove(),2400)}
function normalize(text){
 return String(text??'').normalize('NFKD').toLowerCase()
  .replace(/\p{M}/gu,'').replace(/[‘’ʼ'ʻʿ]/g,'').replace(/ـ/g,'')
  .replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه')
  .replace(/[^\p{L}\p{N}]+/gu,' ').trim().replace(/\bhutang\b/g,'utang');
}
function searchTerms(phrase){return [...new Set(phrase.split(' ').filter(Boolean))]}
function rankedMatches(entries,phrase){
 if(!phrase)return entries;
 const terms=searchTerms(phrase);
 return entries.map(entry=>{
  if(!terms.every(term=>entry.text.includes(term)))return {entry,score:0};
  const score=entry.title===phrase?5:entry.title.includes(phrase)?4:
   terms.every(term=>entry.title.includes(term))?3:
   terms.every(term=>entry.priority.includes(term))?2:1;
  return {entry,score};
 }).filter(match=>match.score).sort((a,b)=>b.score-a.score).map(match=>match.entry);
}
const indexEntry=(item,title,keywords,text)=>({
 item,title:normalize(title),priority:normalize([title,keywords].join(' ')),
 text:normalize([title,keywords,text].join(' '))
});
let quickIndex;
const quickEntries=()=>quickIndex??=quick.map(item=>indexEntry(item,item.title,item.keywords,
 [item.meaning,item.arabic,item.latin,item.reference].join(' ')));
let indexes,fullSearchState='idle';
const searchIndexes=()=>indexes??=[personalExpanded,personalLong,...secs].map(section=>
 indexEntry(section,section.title,[section.subtitle,section.phaseTitle,section.arabicTitle].join(' '),
  fullSearchState==='ready'?section.blocks.map(block=>block.text||block.rows?.map(row=>row.join(' ')).join(' ')||'').join(' '):''));
async function loadFullSearch(){
 if(fullSearchState==='loading'||fullSearchState==='ready')return;
 fullSearchState='loading';
 updateSearchDepth();
 try{
  await Promise.all([...chs.map(phase=>loadPhase(phase.number)),prepareReading(personalExpanded)]);
  fullSearchState='ready';
  indexes=null;
 }catch{fullSearchState='error'}
 if(S.view!=='search')return;
 updateSearchDepth();
 refreshSearchResults();
}
function chapter(n){return chs.find(c=>c.number===Number(n))||chs[0]}
function numAsma(ch){return ch.sections.filter(s=>s.type==='asma').length}
function label(s){return s.type==='asma'?`${s.title}${s.variant>1?' · versi 2':''}`:s.title}
function itemLabel(id){return quickMap.get(id)?.title||byId.get(id)?.title||'Doa'}
function secondary(s){return s.type==='personal'?s.id===personalExpanded.id?'Mendalam · 99 unsur Asmaul Husna':'Lengkap · 9 hajat utama':s.type==='asma'?s.subtitle:`Fase ${s.chapter} • ${s.phaseTitle}`}
function nav(){
 const links=[['home','Beranda','home'],['guide','Alur Doa','list'],['daily','Doa Pilihan','book'],['explore','Jelajah','compass'],['saved','Tersimpan','bookmark']];
 return `<nav class="nav-dock" aria-label="Navigasi utama">${links.map(([view,label,icon])=>
  btn('nav',`${ico(icon)}<span>${label}</span>`,`nav-btn ${(S.view===view||(view==='daily'&&Object.hasOwn(collections,S.view)))?'active':''}`,
   `data-target="${view}"${(S.view===view||(view==='daily'&&Object.hasOwn(collections,S.view)))?' aria-current="page"':''}`)
 ).join('')}</nav>`;
}
const readingViews=new Set(['read','quickread','salatbundle']);
function shell(inner){
 const reading=readingViews.has(S.view);
 const id=S.view==='read'?S.reader:S.quickId;
 const title=S.view==='salatbundle'?'Rangkaian setelah salat':isPersonal(id)?'Doa Pribadi':itemLabel(id);
 const brand=`<button type="button" class="brand" data-action="nav" data-target="home"><img class="brand-icon" src="./icon.svg" alt="" width="40" height="40"><span class="brand-name">Doa Teduh</span></button>`;
 const context=reading?`${btn('return',`${ico('back')}<span>Kembali</span>`,'sticky-back','aria-label="Kembali ke daftar bacaan"')}<span class="top-reader-label">${esc(title)}</span>`:brand;
 return `<a class="skip-link" href="#konten" data-action="skip">Lewati ke isi</a><header class="topbar ${reading?'is-reading':''}"><div class="shell toprow"><div class="header-context">${context}</div>${nav()}<div class="actions">${btn('theme',ico(S.dark?'sun':'moon'),'icon-btn',`aria-label="${S.dark?'Mode terang':'Mode gelap'}" title="Ganti tema"`)}${btn('nav',`${ico('search')}<span>Cari doa</span>`,'icon-btn header-search','data-target="search" aria-label="Cari doa"')}</div></div></header>${reading?'<div class="reading-progress" aria-hidden="true"><span id="prog"></span></div>':''}<main id="konten" class="shell page" tabindex="-1">${inner}</main>${S.focus&&reading?btn('focus',`${ico('close')} Keluar fokus`,'focus-exit','aria-label="Keluar dari mode fokus"'):''}`;
}

function sectionCard(s){return `<button class="result" data-action="read" data-id="${esc(s.id)}"><div class="index-n">${s.type==='asma'?s.number:(s.type==='intro'?'✦':'•')}</div><div class="txt"><strong>${esc(label(s))}</strong><small>${esc(secondary(s))}${s.type==='personal'?'':` • ${s.blocks?.length??s.blockCount} bagian bacaan`}</small></div>${S.done.includes(s.id)?`<span class="badgetiny">Selesai</span>`:''}${ico('chevron')}</button>`}
function chapterCard(c){return `<button class="chapter-card" data-action="phase" data-n="${c.number}"><span class="index-n">${String(c.number).padStart(2,'0')}</span><span class="chapter-info"><strong>${esc(c.shortTitle)}</strong><small>${c.number===13?'3 nama':`${Math.max(0,(c.number-1)*8+1)}–${Math.min(99,c.number*8)} Asmaul Husna`} · ${c.sections.length} bacaan</small></span><span class="chevron">${ico('chevron')}</span></button>`}
function homePath(action, icon, title, description, attrs='', cls=''){
 return btn(action,`<span class="home-path-icon" aria-hidden="true">${ico(icon)}</span><span class="home-path-copy"><strong>${title}</strong><small>${description}</small></span>`,`home-path card ${cls}`,attrs);
}
function home(){
 const last=S.last&&(byId.get(S.last)||quickMap.get(S.last));
 const resume=last?savedPanel(last.id):'';
 const resumeTitle=last&&(isPersonal(last.id)?`Doa Pribadi · ${last.id===personalShortId?'Ringkas':last.id===personalLong.id?'Lengkap':'Mendalam'}`:label(last));
 const featured=quickMap.get('quran-musa-rezeki');
 const topics=[
  ['rezeki','Rezeki & pertolongan'],['utang','Pelunasan utang'],['keluarga','Keluarga & anak'],
  ['ampun','Ampunan'],['utama','Saat sulit'],['sakit','Kesembuhan'],['pagi','Pagi & petang'],
 ];
 return `<div class="home-page">
  <section class="home-welcome card">
   <div class="home-welcome-content">
    <h1>Berdoa dengan<br class="desktop-break"> hati yang tenang.</h1>
    <p>Doa dari Al-Qur’an dan hadis, zikir setelah salat, serta munajat keluarga.</p>
    <div class="home-hero-actions">
     ${btn('nabi-open','Doa Nabi ﷺ','btn home-main-cta')}
     ${btn('nav','Alur berdoa','btn hero-secondary','data-target="guide"')}
    </div>
   </div>
   <div class="home-hero-image"><picture><source media="(max-width: 670px)" srcset="./masjid-fajar-mobile.webp"><img src="./masjid-fajar.webp" width="1120" height="840" alt="" fetchpriority="high"></picture></div>
  </section>
  <form class="home-find card" id="home-search" role="search">
   <label for="home-query">Cari doa</label>
   <div class="searchbar">${ico('search')}<input type="search" id="home-query" placeholder="Utang, rezeki, ampunan…" autocomplete="off"></div>
   <button class="btn" type="submit">Cari</button>
  </form>
  ${last?btn(resume?'resume-read':quickMap.has(last.id)?'quickread':'read',`
   <span class="home-resume-icon" aria-hidden="true">${ico('book')}</span>
   <span><small>${resume?'Lanjutkan bagian':'Lanjutkan membaca'}</small><strong>${esc(resumeTitle)}</strong></span>${ico('chevron')}
  `,'card home-resume',`data-id="${esc(last.id)}"`):''}
  <section aria-labelledby="home-reading">
   <div class="section-head home-library-title"><h2 id="home-reading">Pilih bacaan</h2>${btn('daily-topic','Semua doa pilihan','inline-link','data-topic="semua"')}</div>
   <div class="home-paths">
    ${homePath('read','heart','Doa Pribadi','Ringkas, Lengkap, dan Mendalam',`data-id="${esc(personalExpanded.id)}"`,'personal-home-path')}
    ${homePath('salat-open','list','Setelah salat','Zikir dan penghitung 33 kali','','salat-home-path')}
    ${homePath('nabi-open','spark','Doa Nabi ﷺ','Hadis dan konteks pengamalan','','nabi-home-path')}
    ${homePath('quran-open','quran','Doa Al-Qur’an','Lafaz ayat, arti, dan konteks','','quran-home-path')}
   </div>
  </section>
  <section class="home-topics" aria-labelledby="home-topics-heading">
   <div class="section-head"><h2 id="home-topics-heading">Doa menurut hajat</h2></div>
   <div class="home-topic-list">${topics.map(([id,title])=>btn(id==='utang'?'nabi-open':'daily-topic',title,'home-topic',`data-topic="${id}"`)).join('')}</div>
  </section>
  ${featured?`<section class="home-featured card" aria-labelledby="home-featured-title">
   <div class="home-featured-copy">
    <p class="home-featured-reference">${esc(featured.reference)}</p>
    <h2 id="home-featured-title">${esc(featured.title)}</h2>
    <p>${esc(featured.meaning)}</p>
    ${btn('quickread','Baca doa dan konteks','btn outline',`data-id="${esc(featured.id)}"`)}
   </div>
   <p class="home-featured-arabic" lang="ar" dir="rtl">${esc(featured.arabic)}</p>
  </section>`:''}
  <section aria-labelledby="home-phases"><div class="section-head home-phase-heading"><h2 id="home-phases">Perjalanan doa</h2>${btn('nav','Jelajahi naskah','inline-link','data-target="explore"')}</div>
   ${panel('home-phases','home-phases-list','Daftar 13 fase','Dari taubat hingga penyerahan diri',`<div class="chapter-grid">${chs.map(chapterCard).join('')}</div>`)}
  </section>
  <div class="footer home-footer">${btn('nav','Catatan verifikasi dan sumber','text-link','data-target="review"')}${offlineAvailable?`<div id="offline-controls">${offlineControls()}</div>`:''}</div>
 </div>`;
}
function explore(){
 if(S.explore==='asma'){
  const ranges=chs.map(ch=>{
   const entries=asma.filter(item=>item.chapter===ch.number);
   const first=entries[0].number,last=entries.at(-1).number;
   const names=entries.map(item=>`<button class="name-card" data-action="read" data-id="${esc(item.id)}"><span class="num">${String(item.number).padStart(2,'0')}${item.variant>1?' · V2':''}</span><span class="ar" lang="ar" dir="rtl">${esc(item.arabicTitle)}</span><span class="latin">${esc(item.title)}</span><span class="meaning">${esc(item.subtitle)}</span></button>`).join('');
   return panel('asma-ranges',`asma-range-${ch.number}`,`${first}–${last} · ${ch.shortTitle}`,'',`<div class="names">${names}</div>`);
  }).join('');
  return `<h1 class="heading">99 Asmaul Husna</h1><p class="fineprint">Pilih kelompok nama. Nomor 34 dan 35 masing-masing memiliki dua versi bacaan dalam naskah.</p>${exploreTabs()}<div class="accordion-stack">${ranges}</div>`;
 }
 const c=chapter(S.phase);return `<div class="eyebrow">JELAJAH PUSTAKA</div><h2 class="heading">Baca menurut fase</h2>${exploreTabs()}<div class="filter-row" aria-label="Pilih fase">${chs.map(x=>btn('phasechip',`Fase ${x.number}`,x.number===c.number?'active':'',`data-n="${x.number}"`)).join('')}</div><div class="phase-head card"><div class="eyebrow">FASE ${String(c.number).padStart(2,'0')} DARI 13</div><h2>${esc(c.shortTitle)}</h2><p>${numAsma(c)} bacaan Asmaul Husna dan materi pendukung. Pilih bacaan di bawah.</p><div class="progress-track"><span style="width:${Math.round(c.sections.filter(s=>S.done.includes(s.id)).length/c.sections.length*100)}%"></span></div></div><div class="detail-list">${c.sections.map(sectionCard).join('')}</div>`}
function exploreTabs(){return `<div class="segmented">${btn('explore-tab','Berdasarkan fase',S.explore==='phase'?'active':'','data-tab="phase"')}${btn('explore-tab','99 Asmaul Husna',S.explore==='asma'?'active':'','data-tab="asma"')}</div>`}
// One library entry, with three reading lengths inside a shared reader.
const personalShortId='pilihan-pribadi-ringkas';
function isPersonal(id){return id===personalShortId||id===personalLong.id||id===personalExpanded.id}
function personalCard(){return `<button class="quick-card card personal-library-card" data-action="read" data-id="${esc(personalExpanded.id)}"><span class="quick-glyph" aria-hidden="true">✦</span><span class="quick-card-body"><strong>Doa Pribadi</strong><small>Munajat keluarga, dunia dan akhirat · 3 pilihan bacaan</small></span>${ico('chevron')}</button>`}
function personalModes(id){
 const choices=[{id:personalShortId,label:'Ringkas',desc:'Seluruh hajat keluarga',action:'quickread'},{id:personalLong.id,label:'Lengkap',desc:'9 hajat utama',action:'read'},{id:personalExpanded.id,label:'Mendalam',desc:'99 unsur Asmaul Husna',action:'read'}];
 return `<section class="personal-modes" aria-label="Pilih panjang doa pribadi"><div class="personal-mode-caption">Panjang bacaan</div><div class="personal-mode-options" role="group" aria-label="Panjang bacaan">${choices.map(m=>btn(m.action,`<strong>${esc(m.label)}</strong><small>${esc(m.desc)}</small>`,`personal-mode ${id===m.id?'active':''}`,`data-id="${esc(m.id)}" aria-pressed="${id===m.id}"`)).join('')}</div><p class="personal-mode-note">Pilih satu sesuai waktu dan kemampuan. Tidak perlu membaca ketiganya.</p></section>`
}
function quickCard(x){return `<button class="quick-card card" data-action="quickread" data-id="${esc(x.id)}"><span class="quick-glyph" aria-hidden="true">${x.kind==='Al-Qur’an'?'۞':x.kind==='Doa susunan pribadi'?'✦':'☾'}</span><span class="quick-card-body"><strong>${esc(x.title)}</strong><small>${esc(x.reference)} · ${esc(x.when)}</small></span>${ico('chevron')}</button>`}
const topicGroups=[
 ['hajat','Hajat & ujian',[
  ['rezeki','Rezeki, pertolongan & ilmu','Doa Nabi Musa, rezeki yang baik, dan ilmu bermanfaat'],
  ['utang','Pelunasan utang','Doa Gunung Uhud, Allāhummakfinī, dan doa saat terbebani utang'],
  ['utama','Kebaikan dunia–akhirat & saat sulit','Doa menyeluruh, istikharah, dan doa saat menghadapi musibah'],
  ['sakit','Sakit & kesembuhan','Saat merasakan nyeri, sakit, atau menjenguk'],
  ['perlindungan','Perlindungan dari bahaya','Berlindung dari fitnah, azab, dan gangguan setan'],
 ]],
 ['ibadah','Ibadah & zikir',[
  ['adab','Pembuka & penutup doa','Pujian, shalawat, dan kafaratul majelis'],
  ['ampun','Ampunan & taubat','Sayyidul Istighfar, doa Nabi Adam, dan doa Lailatulqadar'],
  ['iman','Iman & keteguhan hati','Hidayah, kesabaran, dan jiwa yang bertakwa'],
  ['ibadah','Wudu, salat & puasa','Wudu, masjid, azan, witir, dan berbuka puasa'],
  ['salat','Setelah salat','Zikir dan doa sesudah salam'],
  ['pagi','Pagi & petang','Zikir harian dan permohonan perlindungan'],
 ]],
 ['keseharian','Keluarga & keseharian',[
  ['keluarga','Keluarga & anak','Doa untuk orang tua, pasangan, dan keturunan'],
  ['harian','Rutinitas harian','Dari bangun tidur hingga beristirahat kembali'],
  ['musafir','Perjalanan','Saat berangkat, singgah, dan pulang'],
  ['hujan','Saat hujan','Saat mulai turun, setelah reda, atau ketika terlalu deras'],
 ]],
 ['pribadi','Munajat pribadi',[
  ['pribadi','Doa Pribadi','Munajat keluarga dalam tiga pilihan bacaan'],
 ]],
];
const prayerTopics=new Map(topicGroups.flatMap(([, ,topics])=>topics.map(([id,title,description])=>[id,{title,description}])));
const debtOrder=['nabi-utang-uhud','kur-rezeki-halal','nabi-utang-sebelum-tidur','nabi-utang-kecemasan','nabi-utang-dosa'];
const topicOverrides={
 'kur-rezeki-halal':'utang',
 'pilihan-ilmu':'rezeki',
 'pilihan-teguh-iman':'iman',
 'pilihan-hidayah-cukup':'iman',
 'adab-sayyidul-istighfar':'ampun',
};
const topicOrder={
 utang:debtOrder,
 rezeki:['quran-musa-rezeki','pilihan-ilmu','kur-ilmu-fajar'],
 harian:['nabi-harian-bangun','nabi-harian-masuk-toilet','nabi-harian-keluar-toilet','nabi-harian-keluar-rumah','nabi-harian-makan','nabi-harian-tidur'],
 ibadah:['nabi-ibadah-wudu','nabi-ibadah-masjid','nabi-ibadah-azan','nabi-ibadah-iftitah','nabi-ibadah-dua-sujud','nabi-ibadah-surga','nabi-ibadah-qunut-witir','nabi-ibadah-berbuka'],
};
function panel(group,id,title,subtitle,body,open=false){
 return `<details name="${esc(group)}" id="${esc(id)}" class="accordion card" data-accordion${open?' open':''}>
  <summary class="accordion-summary"><span class="accordion-label"><strong>${esc(title)}</strong>${subtitle?`<small>${esc(subtitle)}</small>`:''}</span>${ico('chevron')}</summary>
  <div class="accordion-body">${body}</div>
 </details>`;
}
function prayerCard(item){
 return item.id===personalShortId?personalCard():quickCard(item);
}
function prayersFor(list,topic){
 const items=list.filter(item=>(topicOverrides[item.id]??item.category)===topic);
 const order=topicOrder[topic];
 if(!order)return items;
 return [...order.map(id=>items.find(item=>item.id===id)).filter(Boolean),
  ...items.filter(item=>!order.includes(item.id))];
}
function topicBrowser(name,list,openTopic=''){
 const groups=topicGroups.map(([id,title,topics])=>({
  anchor:`${name}-group-${id}`,
  title,
  panels:topics.map(([topic,label])=>{
   const items=prayersFor(list,topic);
   if(!items.length)return '';
   if(topic==='pribadi')return items.map(prayerCard).join('');
   return panel(name,`${name}-${topic}`,label,`${items.length} bacaan`,
    `<div class="detail-list">${items.map(prayerCard).join('')}</div>`,topic===openTopic);
  }).join(''),
 })).filter(group=>group.panels);
 return `<nav class="topic-index" aria-label="Langsung ke kelompok doa">${groups.map(({anchor,title})=>
  btn('topic-jump',esc(title),'home-topic',`data-anchor="${anchor}"`)).join('')}</nav>
 <div class="topic-groups">${groups.map(({anchor,title,panels})=>`<section aria-labelledby="${anchor}">
  <h3 class="topic-heading" id="${anchor}" tabindex="-1">${esc(title)}</h3>
  <div class="accordion-stack">${panels}</div>
 </section>`).join('')}</div>`;
}
function collectionResults(key){
 const state=S.collectionSearch[key];
 const matching=rankedMatches(quickEntries().filter(entry=>collections[key].items.includes(entry.item)),normalize(state.query));
 return `<p id="${key}-search-count" class="fineprint">${matching.length} bacaan ditemukan</p>
  ${matching.length?`<div class="detail-list collection-matches ${key}-matches">${matching.slice(0,state.limit).map(entry=>quickCard(entry.item)).join('')}</div>`:
   '<p class="nabi-empty">Tidak ada hasil. Coba kata lain atau ejaan yang lebih pendek.</p>'}
  ${matching.length>state.limit?btn('collection-more','Tampilkan bacaan lainnya','btn outline search-more'):''}`;
}
function collectionPage(key){
 const {title,description,items}=collections[key],state=S.collectionSearch[key];
 const filtering=Boolean(normalize(state.query));
 const isNabi=key==='nabi';
 return `<div class="library-page">
  <header class="library-banner card collection-banner">
   <div><p class="collection-count">${items.length} bacaan</p><h1>${title}</h1><p>${description}</p></div>
   <span class="collection-mark" aria-hidden="true">${ico(isNabi?'spark':'quran')}</span>
  </header>
  <div class="collection-switch" aria-label="Koleksi bacaan">
   ${btn('nabi-open','Doa Nabi ﷺ',isNabi?'active':'',`aria-pressed="${isNabi}"`)}
   ${btn('quran-open','Doa Al-Qur’an',isNabi?'':'active',`aria-pressed="${!isNabi}"`)}
  </div>
  <div class="nabi-search">
   <label for="${key}-query">Cari dalam ${title}</label>
   <div class="searchbar">${ico('search')}<input id="${key}-query" data-collection-query="${key}" type="search" value="${esc(state.query)}" placeholder="${isNabi?'Contoh: utang atau kesembuhan':'Contoh: Musa atau syukur'}" autocomplete="off">
    ${btn('collection-clear',ico('close'),'icon-btn',`aria-label="Hapus pencarian ${title}"${state.query?'':' hidden'}`)}
   </div>
   <p id="${key}-search-status" class="sr-only" role="status"></p>
  </div>
  <div id="${key}-topics"${filtering?' hidden':''}>
   <div class="section-head library-heading"><h2>Doa menurut kebutuhan</h2>${isNabi?btn('nabi-open','Doa pelunasan utang','inline-link','data-topic="utang"'):''}</div>
   ${topicBrowser(`${key}-topics`,items,isNabi?S.nabiTopic:'')}
  </div>
  <div id="${key}-results"${filtering?'':' hidden'}>${filtering?collectionResults(key):''}</div>
 </div>`;
}
const nabi=()=>collectionPage('nabi'), quran=()=>collectionPage('quran');
function updateCollectionSearch(key){
 const state=S.collectionSearch[key];
 const active=Boolean(normalize(state.query));
 const results=document.getElementById(`${key}-results`);
 document.getElementById(`${key}-topics`).hidden=active;
 results.hidden=!active;
 root.querySelector('[data-action=collection-clear]').hidden=!state.query;
 results.innerHTML=active?collectionResults(key):'';
 document.getElementById(`${key}-search-status`).textContent=active?document.getElementById(`${key}-search-count`).textContent:'';
}
function daily(){
 const topic=prayerTopics.get(S.dailyCategory);
 const chosen=topic?prayersFor(quick,S.dailyCategory):[];
 const momentCards=moments.map(item=>`<article class="moment card"><strong>${esc(item.title)}</strong><p>${esc(item.description)}</p><a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${esc(item.source)}</a>${btn('quickread','Baca doa yang cocok','moment-go',`data-id="${esc(item.quick[0])}"`)}</article>`).join('');
 return `<div class="library-page">
  <header class="library-banner card">
   <div><h1>Doa Pilihan</h1><p>${quick.length} bacaan dari Al-Qur’an, hadis, dan munajat pribadi.</p></div>
   <div class="library-banner-actions">${btn('nabi-open','Doa Nabi ﷺ','btn')}${btn('quran-open','Doa Al-Qur’an','btn outline')}</div>
  </header>
  <div class="section-head library-heading"><h2>${topic?esc(topic.title):'Topik doa'}</h2>${topic?
   btn('daily-topic','Semua topik','inline-link','data-topic="semua"'):
   btn('nav','Catatan dalil','inline-link','data-target="review"')}</div>
  ${topic?`<p class="topic-description">${esc(topic.description)}</p>`:''}
  ${S.dailyCategory==='salat'?`<div class="salat-daily-cta card"><strong>Rangkaian setelah salat</strong><p>Ikuti zikir dan doa secara berurutan.</p>${btn('salat-open','Buka rangkaian','btn')}</div>`:''}
  ${topic?`<div class="detail-list">${chosen.map(prayerCard).join('')}</div>`:topicBrowser('daily-topics',quick)}
  ${S.dailyCategory==='rezeki'?btn('daily-topic','Lihat doa pelunasan utang','inline-link topic-related','data-topic="utang"'):''}
  ${S.dailyCategory==='pribadi'?'':`<div class="daily-moments">${panel('daily-topics','daily-moments','Waktu utama untuk berdoa','Hujan, sujud, akhir malam, dan waktu lain sesuai dalil',`<div class="moments-grid">${momentCards}</div><p class="fineprint">Waktu yang dianjurkan untuk berdoa tidak selalu memiliki satu lafal khusus.</p>`)}</div>`}
 </div>`;
}
function guide(){const conf=guideFlows[S.guideContext]||guideFlows.general;const steps=(S.guideMode==='full'?conf.full:conf.short).map(id=>quickMap.get(id)).filter(Boolean);S.guideStep=Math.min(Math.max(0,S.guideStep),steps.length-1);const ix=S.guideStep;const x=steps[ix];const how=S.guideContext==='salat'?'Mulai dengan zikir pascasalam.':S.guideContext==='rain'?'Mulai dengan doa saat hujan.':'Siapkan hati sebelum memohon.';const note=ix===0?'Jangan tergesa-gesa. Hadirkan hati dan pahami maknanya.':x?.id==='adab-asma-agung'?'Bacaan ini memiliki hadis sahih tentang nama Allah yang agung; bukan rumus wajib pengabulan.':x?.id==='adab-penutup'?'Ayat ini dibaca sebagai pujian pilihan, bukan penutup baku setiap doa.':'Baca perlahan, dan hayati artinya sebelum melanjutkan.';
return `<div class="guide-page"><div class="eyebrow">PANDUAN BERDOA • TIDAK TERGESA</div><h2 class="heading">Dari awal hingga penutup</h2><p class="fineprint">Ikuti secara bertahap, tidak perlu terburu-buru. Setiap bacaan bersumber sendiri-sendiri; <b>rangkaian keseluruhannya adalah susunan editorial, bukan satu amalan dengan bilangan atau urutan wajib.</b></p><div class="guide-contexts" aria-label="Pilih keadaan">${[['general','Doa umum'],['rain','Saat hujan']].map(([id,lab])=>btn('guide-context',lab,S.guideContext===id?'active':'',`data-context="${id}"`)).join('')}${btn('salat-open','Sesudah salat · paket berurutan ↗','guide-salat-entry')}</div><div class="guide-context-intro card"><strong>${esc(conf.title)}</strong><p>${esc(conf.hint)}</p><div class="guide-modes">${btn('guide-mode','Ringkas',S.guideMode==='short'?'active':'','data-mode="short"')}${btn('guide-mode','Lebih lengkap',S.guideMode==='full'?'active':'','data-mode="full"')}</div></div><div class="guide-progress-head"><span>TAHAP ${ix+1} DARI ${steps.length}</span><span>${Math.round((ix+1)/steps.length*100)}%</span></div><div class="guide-progress"><span style="width:${((ix+1)/steps.length*100).toFixed(1)}%"></span></div><article id="guide-reader" class="guide-reader card"><div class="guide-step-header"><span class="step-circle">${String(ix+1).padStart(2,'0')}</span><div><span class="eyebrow">${esc(x.kind)} · ${esc(x.category)}</span><h3>${esc(x.title)}</h3></div></div><p class="guide-coach">${esc(ix===0?how:note)}</p><div class="guide-appearance">${btn('settings',`${ico('settings')} ${S.prefsOpen?'Tutup pengaturan':'Atur teks & warna'}`,'mini-btn')}${S.prefsOpen?prefsOptions():''}</div>${x.arabic?`<div class="entry arabic guide-arabic" lang="ar" dir="rtl">${esc(x.arabic)}</div>`:''}${x.latin?`<div class="entry latin guide-latin"><strong>Latin</strong><p>${esc(x.latin)}</p></div>`:''}<div class="guide-meaning"><span>MAKNA / TERJEMAHAN</span><p>${esc(x.meaning)}</p></div><div class="guide-reference"><strong>${esc(x.reference)}</strong>${x.url?`<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">Periksa sumber asli ↗</a>`:''}<p>${esc(x.note||'')}</p></div><div class="guide-nav">${ix>0?btn('guide-step',`${ico('back')} Sebelumnya`,'btn outline',`data-step="${ix-1}"`):'<span></span>'}${ix<steps.length-1?btn('guide-step',`Selesai, lanjut ${ico('chevron')}`,'btn',`data-step="${ix+1}"`):btn('guide-restart',`Ulangi dari awal ${ico('chevron')}`,'btn')}</div></article>${panel('guide-details','guide-overview',`Urutan bacaan ${S.guideMode==='short'?'ringkas':'lengkap'}`,'Pilih tahap yang ingin dibaca',`<div class="guide-steps">${steps.map((it,i)=>btn('guide-step',`<span class="guide-num">${String(i+1).padStart(2,'0')}</span><span>${esc(it.title)}</span>${ico('chevron')}`,`guide-step-btn ${i===ix?'active':''}`,`data-step="${i}"`)).join('')}</div>`)}<section class="guide-caution card"><strong>Adab yang perlu dijaga</strong><ul><li><b>Ikhlas dan penuh harap</b> kepada Allah, bukan mengejar bacaan seolah mekanisme yang menjamin hasil.</li><li><b>Memuji Allah, kemudian bershalawat, lalu berdoa.</b> Ini memiliki landasan hadis Abu Dawud 1481. Istighfar ditempatkan sebagai persiapan yang dianjurkan, bukan syarat mutlak.</li><li><b>Jangan terburu-buru berputus asa.</b> Tidak mengeluh bahwa doa tak pernah dijawab (Muslim 2735).</li><li><b>Jangan mendoakan dosa dan pemutusan silaturahmi.</b> (Muslim 2735).</li><li><b>Perhatikan konteks.</b> Zikir setelah salam, doa saat sujud, dan doa ketika hujan masing-masing mempunyai tuntunan tersendiri.</li></ul><div class="guide-links"><a href="https://sunnah.com/abudawud:1481" target="_blank" rel="noopener noreferrer">Landasan pembukaan doa ↗</a><a href="https://sunnah.com/muslim:2735c" target="_blank" rel="noopener noreferrer">Larangan tergesa-gesa ↗</a></div></section><section class="guide-optional card"><div class="eyebrow">BACAAN PELENGKAP · BUKAN TAHAP WAJIB</div><h3>Ketika mengakhiri suatu majelis</h3><p>Kafaratul majelis adalah bacaan ketika hendak meninggalkan pertemuan, <b>bukan penutup khusus yang diwajibkan bagi setiap doa pribadi</b>.</p><div class="guide-option-actions">${btn('quickread',`Kafaratul majelis ${ico('chevron')}`,'btn outline','data-id="adab-kafarat-majelis"')}${btn('quickread',`Sayyidul Istighfar ${ico('chevron')}`,'btn outline','data-id="adab-sayyidul-istighfar"')}</div></section><div class="footer">Doa Teduh · sumber Al-Qur’an dan hadis ditandai pada tiap bacaan.</div></div>`}

function salatBundle(){
 const mode=S.salatMode==='short'?'short':'full';const ids=salatData[mode]||[], steps=ids.map((id,index)=>({x:salatMap.get(id),key:`${mode}-${index}`})).filter(v=>v.x);const completed=steps.filter(({key})=>S.salatDone.includes(key)).length;const firstPrayer=steps.findIndex(z=>['adab-hamdalah','pilihan-dunia-akhirat'].includes(z.x.id));const divideAt=firstPrayer<0?steps.length:firstPrayer;
 const total=steps.length;let cards='';
 steps.forEach(({x,key},i)=>{
  if(i===0)cards+=`<section class="salat-group-head" id="salat-zikir"><span>01 · ZIKIR SETELAH SALAM</span><h3>Awali dengan zikir yang diriwayatkan.</h3><p>Setiap bacaan memiliki dalilnya sendiri; susunan lengkap di halaman ini adalah panduan, bukan satu hadis tentang urutan tetap.</p></section>`;
  if(i===divideAt)cards+=`<section class="salat-group-head optional" id="salat-doa"><span>02 · DOA PILIHAN</span><h3>Lanjutkan dengan munajat.</h3><p>Bagian berikut berisi doa dan pujian pilihan. Boleh dibaca setelah zikir atau pada waktu doa lainnya; bukan rangkaian wajib khusus setelah salat.</p></section>`;
  const count=Number(S.salatCounts[key]||0);const marked=S.salatDone.includes(key);const isPersonal=x.kind==='Doa susunan pribadi';const doneClass=marked?'complete':'';
  cards+=`<details class="salat-item accordion card ${doneClass}" id="salat-step-${i+1}" name="salat-${mode}" data-accordion><summary class="accordion-summary salat-item-heading"><span class="salat-step-num">${String(i+1).padStart(2,'0')}</span><span class="salat-summary-label accordion-label"><small>${esc(x.kind)}</small><strong>${esc(x.title)}</strong></span><span class="salat-done-indicator" aria-label="${marked?'Sudah dibaca':'Belum ditandai'}">${marked?'✓':''}</span>${ico('chevron')}</summary><div class="salat-item-content accordion-body">${x.arabic?`<div class="salat-arabic entry arabic" dir="rtl" lang="ar">${esc(x.arabic)}</div>`:''}${x.latin?`<div class="salat-latin entry latin"><span>LATIN</span><p>${esc(x.latin)}</p></div>`:''}<div class="salat-meaning entry translation"><span>${isPersonal?'DOA PRIBADI':'ARTI / MAKNA'}</span><p>${esc(x.meaning)}</p></div><div class="salat-source"><span>${esc(x.reference||'Rujukan bacaan')}</span>${x.url?`<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">Cek dalil ↗</a>`:''}</div>${x.note?`<p class="salat-note">${esc(x.note)}</p>`:''}${x.id==='pilihan-mengingat-syukur'?'<p class="salat-note salat-priority">Catatan: “dubur salat” pada hadis ini dipahami sebagian ulama sebagai sebelum salam. Jangan menganggap penempatannya di sini sebagai ketetapan tunggal.</p>':''}${x.counter?`<div class="salat-counter"><div><span>Penghitung zikir (opsional)</span><strong aria-live="polite" aria-atomic="true" id="salat-count-${i}">${Math.min(x.counter,Math.max(0,count))} / ${x.counter}</strong></div><div class="salat-counter-actions"><button type="button" class="salat-count-tap" data-action="salat-count" data-key="${esc(key)}" data-n="${i}" data-limit="${x.counter}" aria-label="Tambah hitungan ${esc(x.title)}" ${count>=x.counter?'disabled':''}>${count>=x.counter?'Selesai ✓':'+ 1'}</button><button type="button" class="salat-count-reset" data-action="salat-count-reset" data-key="${esc(key)}" data-n="${i}" aria-label="Ulangi hitungan ${esc(x.title)}">↺</button></div></div>`:''}<div class="salat-item-foot">${btn('salat-mark',marked?'✓ Sudah dibaca':'Tandai dibaca',`salat-mark ${marked?'marked':''}`,`data-key="${esc(key)}" data-n="${i}" aria-pressed="${marked}"`)}${i<total-1?btn('salat-next','Lanjut bacaan','salat-next',`data-n="${i+2}"`):''}</div></div></details>`;
 });
 return `<div class="salat-page"><div class="salat-page-title"><div class="eyebrow">IBADAH HARIAN · DOA TEDUH</div><h2 class="heading">Rangkaian setelah salat</h2><p class="fineprint">Buka satu bacaan untuk melihat teks dan penghitungnya.</p></div><section class="salat-intro card"><div class="salat-intro-top"><span>SESUDAH SALAM</span></div><div class="salat-intro-body"><div><h3>Berzikir dengan khusyuk.</h3><p>Zikir pascasalam berdalil. Doa sesudahnya adalah <strong>pilihan</strong>, bukan paket wajib dengan urutan tetap.</p></div><div class="salat-modes" role="group" aria-label="Pilih panjang rangkaian">${btn('salat-mode','Ringkas',mode==='short'?'active':'',`data-mode="short" aria-pressed="${mode==='short'}"`)}${btn('salat-mode','Lengkap',mode==='full'?'active':'',`data-mode="full" aria-pressed="${mode==='full'}"`)}</div></div><details class="salat-tools-details"><summary>Atur tampilan Arab, Latin & arti</summary><div class="salat-reading-tools" role="group" aria-label="Pengaturan tampilan bacaan"><span class="salat-reading-tools-label">Tampilan</span>${btn('toggle-latin',`Latin ${S.latin?'✓':'○'}`,`salat-appearance-btn ${S.latin?'active':''}`,`aria-pressed="${S.latin}"`)}${btn('toggle-translation',`Arti ${S.translation?'✓':'○'}`,`salat-appearance-btn ${S.translation?'active':''}`,`aria-pressed="${S.translation}"`)}<span class="salat-size-label" aria-label="Ukuran huruf Arab">Arab</span>${btn('salat-font-down','A−','salat-appearance-btn salat-font-btn','aria-label="Perkecil tulisan Arab"')}${btn('salat-font-up','A+','salat-appearance-btn salat-font-btn','aria-label="Perbesar tulisan Arab"')}</div></details><details class="salat-about"><summary>Panduan dan status sumber</summary><p>Bacaan zikir memiliki dalilnya masing-masing. Tidak ada tuntunan bahwa semua bacaan di halaman ini wajib ditamatkan sebagai satu rangkaian. Doa tambahan boleh dipilih sesuai kebutuhan dan tidak menggantikan zikir yang disyariatkan.</p></details></section><div class="salat-toolbar" aria-label="Kemajuan rangkaian"><div><strong id="salat-progress-text" aria-live="polite">${completed}/${total} bacaan ditandai</strong><div class="salat-progress" role="progressbar" aria-label="Kemajuan bacaan" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${completed}" id="salat-progress-track"><span id="salat-progress-bar" style="width:${total?completed/total*100:0}%"></span></div></div><div class="salat-toolbar-actions">${btn('salat-resume',`Lanjut ${ico('chevron')}`,'salat-resume',`aria-label="Lanjutkan ke bacaan yang belum selesai"`)}${btn('salat-reset','Ulangi','salat-reset','aria-label="Mulai ulang seluruh rangkaian"')}</div></div><div class="salat-jump" aria-label="Lompat bagian">${btn('salat-jump','01 Zikir','', 'data-anchor="salat-zikir"')}${mode==='full'?btn('salat-jump','02 Doa pilihan','', 'data-anchor="salat-doa"'):''}</div>${cards}<section class="salat-finish card"><div class="salat-finish-mark" aria-hidden="true">۞</div><h3>Semoga Allah menerima amal dan doa kita.</h3><p>Anda dapat mengakhiri setelah zikir atau memilih sebagian doa sesuai kebutuhan. Tidak wajib menamatkan semua bacaan dalam halaman ini.</p>${btn('salat-reset','Mulai rangkaian baru ↺','btn')} ${btn('nav','Doa pilihan','btn outline','data-target="daily"')}</section><p class="fineprint salat-bottom-note">Setiap rujukan dapat dibuka melalui tautan “Cek dalil”. Terdapat perbedaan pandangan mengenai penempatan sebagian doa sebelum atau sesudah salam.</p></div>`;
}
function salatProgressRefresh(){const mode=S.salatMode==='short'?'short':'full';const count=(salatData[mode]||[]).length;const done=(salatData[mode]||[]).filter((_,i)=>S.salatDone.includes(`${mode}-${i}`)).length;const e=document.getElementById('salat-progress-text'),b=document.getElementById('salat-progress-bar');if(e)e.textContent=`${done}/${count} bacaan ditandai`;if(b)b.style.width=`${count?done/count*100:0}%`;const p=document.getElementById('salat-progress-track');if(p)p.setAttribute('aria-valuenow',done)}

function quickRead(){const x=quickMap.get(S.quickId)||quick[0];if(!x)return daily();const saved=S.saved.includes(x.id);const isDone=S.done.includes(x.id);const ix=quick.findIndex(d=>d.id===x.id);return `<div class="content-width quickreader"><section class="reader-head card"><div class="eyebrow">${x.id===personalShortId?'MUNAJAT PRIBADI':x.kind.startsWith('Hadis')?'DOA NABI ﷺ':x.kind==='Al-Qur’an'?'DOA AL-QUR’AN':'DOA PILIHAN'}</div><h1 class="reader-title">${x.id===personalShortId?'Doa Pribadi':esc(x.title)}</h1>${x.id===personalShortId?personalModes(x.id):''}<div class="reader-meta"><span class="badgetiny ${x.kind==='Doa susunan pribadi'?'warn':''}">${esc(x.kind)}</span><span class="badgetiny">${esc(x.reference.split(' — ')[0])}</span></div><div class="reader-tools">${btn('save',`${ico('bookmark')} ${saved?'Disimpan':'Simpan'}`,`mini-btn ${saved?'on':''}`,`aria-pressed="${saved}"`)}${btn('done',`${ico('check')} ${isDone?'Selesai':'Tandai selesai'}`,`mini-btn ${isDone?'on':''}`,`aria-pressed="${isDone}"`)}${btn('focus',`${ico('maximize')} ${S.focus?'Akhiri fokus':'Fokus'}`,'mini-btn')}${btn('copytext',`${ico('copy')} Salin doa`,'mini-btn')}${btn('reading-context',`${ico('file')} Rujukan`,'mini-btn')}</div></section>${readerPreferences()}<section class="reader-body card">${x.arabic?`<div class="entry label">LAFAL ARAB</div><div class="entry arabic curated-ar" lang="ar" dir="rtl">${esc(x.arabic)}</div>`:''}${x.latin?`<div class="entry label">BACAAN LATIN</div><div class="entry latin">${esc(x.latin)}</div>`:''}<div class="entry label">${x.kind==='Doa susunan pribadi'?'MUNAJAT DALAM BAHASA INDONESIA':'ARTI DAN MAKNANYA'}</div><div class="entry ${x.id===personalShortId?'text':'translation'}">${esc(x.meaning)}</div>${panel('quick-context',`quick-context-${x.id}`,'Rujukan & waktu membaca',x.reference,`<div class="source-sheet"><div class="source-label">${ico('shield')} ${x.kind==='Doa susunan pribadi'?'Keterangan asal teks':'Sumber rujukan'}</div><strong>${esc(x.reference)}</strong>${x.url?`<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">Buka sumber asli ↗</a>`:''}</div><div class="when-sheet"><strong>Waktu dan konteks</strong><p>${esc(x.when)}</p></div>${x.note?`<div class="when-sheet subtle"><strong>Catatan pengamalan</strong><p>${esc(x.note)}</p></div>`:''}`)}</section><div class="reading-nav">${x.id!==personalShortId&&ix>0?btn('quickread',`${ico('back')} Sebelumnya`,'btn outline',`data-id="${quick[ix-1].id}"`):'<span></span>'}${x.id!==personalShortId&&ix<quick.length-1?btn('quickread',`Selanjutnya ${ico('chevron')}`,'btn',`data-id="${quick[ix+1].id}"`):''}</div></div>`}
function prefsOptions(){return `<div class="pref-expanded"><label>Ukuran huruf Arab: <strong id="fontNumber">${S.font}px</strong></label><div class="range-row"><span>ع</span><input id="fontSlider" type="range" min="23" max="49" step="2" value="${S.font}" aria-label="Ukuran huruf Arab"><span class="feature-ar">ع</span></div><div class="reader-tools">${btn('toggle-latin',`Latin ${S.latin?'✓':'○'}`,'mini-btn')}${btn('toggle-translation',`Arti ${S.translation?'✓':'○'}`,'mini-btn')}${btn('fontsize','Teks A+/−','mini-btn')}</div><div class="palette-setting"><span>Warna suasana</span><div class="palette-row">${[['sage','Hijau teduh'],['ocean','Biru laut'],['clay','Cokelat hangat']].map(([key,lab])=>btn('palette',`<i class="swatch ${key}"></i>${lab}`,`palette-opt ${S.palette===key?'active':''}`,`data-palette="${key}" aria-label="Tema ${lab}"`)).join('')}</div></div></div>`}
function search(){return `<div class="eyebrow">TEMUKAN YANG DIBUTUHKAN</div><h2 class="heading">Cari ayat, doa, atau makna</h2><div class="searchbar">${ico('search')}<input id="query" type="search" value="${esc(S.query)}" placeholder="Contoh: ampunan, rezeki, الرَّحْمَٰنِ" autocomplete="off" aria-label="Kata kunci pencarian">${btn('clear-search',ico('close'),'icon-btn',`aria-label="Hapus pencarian"${S.query?'':' hidden'}`)}</div><div id="search-depth" class="search-help">${searchDepth()}</div><div class="filter-row">${[['semua','Semua'],['ringkas','Doa pilihan'],['asma','Asmaul Husna'],['intro','Pembukaan'],['outro','Penutup']].map(([k,l])=>btn('filter',l,S.filter===k?'active':'',`data-filter="${k}" aria-pressed="${S.filter===k}"`)).join('')}</div><p id="search-status" class="fineprint" role="status"></p><div id="results">${resultsHtml()}</div>`}
function searchDepth(){
 if(fullSearchState==='ready')return 'Pencarian mencakup Arab, Latin, terjemahan dan sumber dalam seluruh naskah.';
 const label=fullSearchState==='error'?'Coba muat isi lagi':fullSearchState==='loading'?'Memuat isi naskah…':'Cari di isi 13 fase';
 const detail=fullSearchState==='error'?'Isi naskah belum bisa dimuat. Periksa koneksi lalu coba lagi.':'Cari teks doa pilihan dan judul naskah.';
 return `<p>${detail}</p>${S.filter==='ringkas'?'':btn('search-full',label,'text-link',fullSearchState==='loading'?'aria-disabled="true"':'')}`;
}
function updateSearchDepth(){
 const depth=document.getElementById('search-depth');
 if(depth)depth.innerHTML=searchDepth();
}
function refreshSearchResults(){
 const results=document.getElementById('results');
 if(!results)return;
 results.innerHTML=resultsHtml();
 document.getElementById('search-status').textContent=results.querySelector('.search-total').textContent;
}
function resultsHtml(){
 const phrase=normalize(S.query),terms=searchTerms(phrase);
 const manuscript=phrase?searchIndexes():secs.map(section=>({item:section}));
 const sections=S.filter==='ringkas'?[]:rankedMatches(manuscript.filter(({item})=>S.filter==='semua'||item.type===S.filter),phrase);
 const selection=sections.slice(0,S.searchLimit).map(({item:section})=>{
  const block=phrase&&fullSearchState==='ready'&&section.blocks.find(entry=>{
   const text=normalize(entry.text);
   return terms.every(term=>text.includes(term));
  });
  const snippet=block?.text?.length>180?block.text.slice(0,177)+'…':block?.text;
  return `<button class="result" data-action="read" data-id="${esc(section.id)}"><span class="index-n" aria-hidden="true">${section.type==='asma'?section.number:'✦'}</span><span class="txt"><strong>${esc(label(section))}</strong><small>${esc(snippet||secondary(section))}</small></span>${ico('chevron')}</button>`;
 }).join('');
 const matches=S.filter==='semua'||S.filter==='ringkas'?rankedMatches(quickEntries(),phrase):[];
 const cards=matches.slice(0,S.quickSearchLimit).map(({item})=>quickCard(item.id===personalShortId?{...item,title:'Doa Pribadi · Ringkas'}:item)).join('');
 return `<p class="fineprint search-total">${sections.length+matches.length} bacaan ditemukan</p>
 ${matches.length?`<div class="search-label">DOA PILIHAN</div><div class="detail-list search-quick">${cards}</div>${matches.length>S.quickSearchLimit?btn('more-quick','Tampilkan doa pilihan lainnya','btn outline search-more'):''}`:''}
 ${sections.length?`<div class="search-label">${fullSearchState==='ready'?'NASKAH LENGKAP':'JUDUL NASKAH'}</div><div class="detail-list search-manuscript">${selection}</div>${sections.length>S.searchLimit?btn('more','Tampilkan lagi','btn outline search-more'):''}`:''}
 ${!sections.length&&!matches.length?empty('Tidak ditemukan','Coba kata lain, atau cari dengan Latin.'):''}`;
}
function empty(a,b){return `<div class="empty"><div class="emo">☾</div><h3>${esc(a)}</h3><p>${esc(b)}</p>${btn('nav','Jelajahi doa','btn soft','data-target="explore"')}</div>`}
function saved(){const a=S.saved.map(id=>quickMap.get(id)||byId.get(id)).filter(Boolean);return `<div class="eyebrow">PERPUSTAKAAN PRIBADI</div><h2 class="heading">Bacaan tersimpan</h2><p class="fineprint">Bookmark disimpan di browser pada perangkat ini.</p>${a.length?`<div class="detail-list">${a.map(x=>quickMap.has(x.id)?quickCard(x):sectionCard(x)).join('')}</div>`:empty('Belum ada yang disimpan','Saat membaca, ketuk ikon bookmark agar mudah dibuka kembali.')}`}
const reviews=[
 {tag:'Perlu dibedakan',title:'Jumlah 99 nama sahih, susunan daftar tidak otomatis sahih',body:'Hadis Bukhari 2736 dan Muslim 2677 menetapkan keutamaan 99 nama Allah. Namun, versi riwayat yang merinci satu per satu nama di Tirmidzi 3507 dinilai dhaif oleh sebagian pengkaji; sebagian ulama menjelaskan rincian daftar sebagai sisipan perawi (idrāj). Karena itu, susunan nomor dalam dokumen ditampilkan sebagai urutan editorial, bukan daftar baku yang disepakati.',source:[['Bukhari 2736','https://sunnah.com/bukhari:2736'],['Muslim 2677','https://sunnah.com/muslim:2677a'],['Tirmidzi 3507','https://sunnah.com/tirmidhi:3507'],['Bulugh al-Maram 1382','https://sunnah.com/bulugh:1382']]},
 {tag:'Koreksi pengelompokan',title:'QS Yunus 10:29 bukan hadis',body:'Pada Fase 7 terdapat subjudul “Hadis 2: Allah Saksi yang Cukup”, tetapi sumber di bawahnya justru QS Yunus [10]:29. Lafalnya adalah kutipan Al-Qur’an, sehingga kategori teks tersebut seharusnya ayat, bukan hadis. Teks asli dipertahankan dengan pemberitahuan koreksi ini.',source:[['QS Yunus 10:29','https://quran.com/10/29']]},
 {tag:'Teks ganda',title:'Nomor 34 dan 35 tertulis masing-masing dua kali',body:'Dokumen pertama mencantumkan dua versi Al-Ghafūr (34) dan dua versi Asy-Syakūr (35), masing-masing memiliki variasi doa. Agar tidak menghilangkan apa pun, kedua versi tetap dimuat dan diberi penanda V2. Jumlah nama unik tetap 99.',source:[]},
 {tag:'Atribusi ibadah',title:'Doa pribadi bukan otomatis doa ma’tsur',body:'Banyak doa yang panjang dan spesifik (tentang pekerjaan, nominal rezeki, anggota keluarga, dan sebagainya) merupakan susunan penulis. Jangan menyebutnya lafaz Nabi ﷺ atau menetapkan bilangan, waktu, dan keutamaan khusus tanpa dalil. Makna serta gramatika Arab panjang masih membutuhkan telaah ahli.',source:[['QS Al-A’raf 7:180','https://quran.com/7/180']]},
 {tag:'Konteks berubah',title:'Beberapa hajat menyebut tahun dan target spesifik',body:'Dalam dokumen ada target yang menyebut tahun 2026 dan nominal tertentu. Ini dipertahankan sebagai arsip orisinal, tetapi silakan sesuaikan ketika berdoa secara pribadi. Website ini tidak mengubah teks asli secara diam-diam.',source:[]},
 {tag:'Perbedaan waktu doa',title:'Doa umum bukan rangkaian baku setelah salat',body:'Zikir sesudah salam dibuktikan oleh HR Muslim 591 dan 597a. Doa singkat dari Al-Qur’an atau hadis lain tetap dapat dimohonkan sebagai doa umum, tetapi jangan menetapkan satu paket dan bilangan tertentu seolah Nabi ﷺ mewajibkannya setiap selesai salat. Sebagian doa yang disebut “dubur salat” juga dipahami ulama sebagai sebelum salam.',source:[['Muslim 591','https://sunnah.com/muslim:591'],['Abu Dawud 1522','https://sunnah.com/abudawud:1522']]},
 {tag:'Waktu utama',title:'Hujan, sujud, azan–ikamah, Jumat, dan akhir malam',body:'Kami menambahkan waktu utama dengan rujukan spesifik. Doa ketika turun hujan yang sahih: “Allahumma sayyiban nafi‘an” (Bukhari 1032). Keutamaan memperbanyak doa saat sujud (Muslim 482), di antara azan dan ikamah (Abu Dawud 521), saat Jumat (Bukhari 935), dan pada akhir malam (Bukhari 1145).',source:[['Bukhari 1032','https://sunnah.com/bukhari:1032'],['Muslim 482','https://sunnah.com/muslim:482'],['Bukhari 1145','https://sunnah.com/bukhari:1145']]},
 {tag:'Batas verifikasi',title:'Ratusan kutipan belum diaudit satu per satu',body:'Pencantuman nomor hadis atau frasa “Shahih” pada dokumen belum berarti sudah kami verifikasi seluruh sanad, matan, takhrij, maupun kesesuaian lafal. Label dalil di halaman bacaan merupakan referensi dari dokumen, bukan sertifikasi kesahihan. Jangan menggunakan perpustakaan ini sebagai fatwa otomatis.',source:[]}
];
function review(){return `<div class="eyebrow">TRANSPARANSI SUMBER</div><h2 class="heading">Catatan & pemeriksaan</h2><p class="fineprint">Peninjauan terarah atas dokumen. Bukan pengesahan menyeluruh atas seluruh teks Arab, tafsir, atau hadis.</p>${reviews.map((r,i)=>`<article class="card review"><span class="review-number">${String(i+1).padStart(2,'0')}</span><div class="category">${esc(r.tag)}</div><h3>${esc(r.title)}</h3><p>${esc(r.body)}</p>${r.source.length?`<p>${r.source.map(([label,url])=>`<a href="${url}" rel="noopener noreferrer" target="_blank">${esc(label)} ↗</a>`).join(' · ')}</p>`:''}</article>`).join('')}<div class="notice warning">${ico('shield')}<div><strong>Privasi dokumen</strong>Dokumen asli memuat doa dan permohonan pribadi. Jika situs ini diunggah ke hosting publik, seluruh kontennya dapat diakses orang yang mengetahui alamatnya. Gunakan lokal atau hosting yang benar-benar terlindungi.</div></div>`}
function qLink(txt){const m=txt.match(/QS\s+[^\[]*\[(\d+)\]\s*:\s*(\d+)/i);return m?`https://quran.com/${m[1]}/${m[2]}`:null}
function readerPreferences(){
 return `<section class="reader-preferences"><div class="pref-top"><div><strong>Pengaturan bacaan</strong><small>Ukuran teks, Latin, arti, dan warna</small></div>${btn('settings',`${ico('settings')} ${S.prefsOpen?'Tutup':'Atur'}`,'mini-btn',`aria-expanded="${S.prefsOpen}"`)}</div>${S.prefsOpen?prefsOptions():''}</section>`;
}
function contentsHeading(b){
 return b.type==='subhead'||(b.type==='label'&&/^(Transliterasi Latin|Terjemahan Indonesia) Lengkap$/i.test(b.text));
}
function readerContents(section){
 if(section.blocks.length<50)return '';
 const headings=section.blocks.map((block,index)=>({block,index})).filter(({block})=>contentsHeading(block));
 if(!headings.length)return '';
 return `<details class="reader-contents card" id="reader-contents"><summary>Daftar isi bacaan</summary><ul>${headings.map(({block,index})=>
  `<li>${btn('reader-jump',esc(block.text),'contents-link',`data-anchor="bacaan-${index}"`)}</li>`
 ).join('')}</ul></details>`;
}
function readerBody(section){
 const long=section.blocks.length>=50;
 const renderBlock=(block,index)=>readerEntry(block,index,long);
 if(!long)return `<article class="card reader-body" id="reader-body" aria-label="Isi bacaan">${section.blocks.map(renderBlock).join('')}</article>`;

 const groups=[];
 let current;
 section.blocks.forEach((block,index)=>{
  const isHeading=contentsHeading(block);
  if(!current||isHeading){
   current={index,title:isHeading?block.text:'Pengantar bacaan',entries:[]};
   groups.push(current);
  }
  current.entries.push(renderBlock(block,index));
 });
 const panels=groups.map((group,index)=>{
  const title=group.title.replace(/^[║█\s]+|[║█\s]+$/g,'');
  const next=groups[index+1];
  const controls=groups.length>1?`<div class="reader-part-actions">
   ${btn('reader-index','Daftar isi','btn outline')}
   ${next?btn('reader-next-part','Bagian berikutnya','btn',`data-anchor="reader-part-${next.index}"`):''}
  </div>`:'';
  return panel('reader-sections',`reader-part-${group.index}`,title,'',`<article class="reader-body">${group.entries.join('')}</article>${controls}`);
 }).join('');
 return `<div id="reader-body" class="accordion-stack reader-panels" aria-label="Isi bacaan">${panels}</div>`;
}
function readerEntry(b,i,withContents){if(b.type==='table'){return `<div class="table-wrap"><table><tbody>${b.rows.map(row=>`<tr>${row.map(cell=>`<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`}
 let cl=b.type==='label'?(b.text.startsWith('Transliterasi')?' latinlabel':b.text.startsWith('Terjemahan')?' translabel':''):'';
 let p=b.type==='source'?qLink(b.text):null;
 const tag=b.type==='subhead'?'h3':'div';
 const anchor=withContents&&contentsHeading(b)?` id="bacaan-${i}" tabindex="-1"`:'';
 return `<${tag} class="entry ${b.type}${cl}"${anchor}${b.type==='arabic'?' dir="rtl" lang="ar"':''}>${esc(b.text)}${p?` <a href="${p}" target="_blank" rel="noopener noreferrer" title="Buka ayat untuk membandingkan lafal">↗ Periksa ayat</a>`:''}</${tag}>`
}
function read(){
 const s=byId.get(S.reader)||secs[0];
 if(!s.blocks){
  const status=readerFailed?'Bacaan belum bisa dimuat. Periksa koneksi lalu coba lagi.':'Memuat bacaan…';
  return `<div class="content-width"><div class="reader-head card"><h2 class="reader-title">${s.type==='personal'?'Doa Pribadi':esc(label(s))}</h2>${s.type==='personal'?personalModes(s.id):''}<div class="load-state" role="status">${status}</div>${readerFailed?btn('reader-retry','Muat ulang bacaan','btn outline'):''}</div></div>`;
 }
 const index=secs.findIndex(x=>x.id===s.id);const previous=index>=0?secs[index-1]:null,next=index>=0?secs[index+1]:null;const favor=S.saved.includes(s.id);const complete=S.done.includes(s.id);return `<div class="content-width"><div class="reader-head card"><div class="eyebrow">${s.type==='personal'?'MUNAJAT PRIBADI':'FASE '+String(s.chapter).padStart(2,'0')+' · '+esc(chapter(s.chapter).shortTitle)}</div><h2 class="reader-title">${s.type==='personal'?'Doa Pribadi':esc(label(s))}</h2>${s.type==='personal'?personalModes(s.id):''}${s.arabicTitle?`<div class="large-ar" lang="ar" dir="rtl">${esc(s.arabicTitle)}</div>`:''}${s.subtitle&&s.type!=='personal'?`<p class="subtitle">${esc(s.subtitle)}</p>`:''}<div class="reader-meta"><span class="badgetiny">${s.type==='personal'?'Doa pribadi':s.type==='asma'?'Doa & Asmaul Husna':s.type==='intro'?'Pengantar':'Penutup'}</span>${s.type==='personal'?'':`<span class="badgetiny">${s.blocks.length} bagian</span>`}${(s.type==='asma'||s.type==='personal')?'<span class="badgetiny warn">Doa susunan penulis</span>':''}<span class="badgetiny warn">Audit naskah belum menyeluruh</span></div><div class="reader-tools">${btn('save',`${ico('bookmark')} ${favor?'Disimpan':'Simpan'}`,`mini-btn ${favor?'on':''}`,`aria-pressed="${favor}"`)}${btn('done',`${ico('check')} ${complete?'Selesai ✓':'Tandai selesai'}`,`mini-btn ${complete?'on':''}`,`aria-pressed="${complete}"`)}${btn('focus',`${ico('maximize')} ${S.focus?'Keluar fokus':'Fokus'}`,'mini-btn')}${btn('copy',`${ico('share')} Bagikan`,'mini-btn')}</div></div>${s.type==='personal'? `<details class="personal-about card"><summary>Catatan sumber dan pengamalan</summary><div>${(s.warnings||[]).map(w=>`<p>${esc(w)}</p>`).join('')}</div></details>`: `${s.warnings?.map(w=>`<div class="notice warning" style="margin-bottom:11px">${ico('info')}<div><strong>Catatan naskah</strong>${esc(w)}</div></div>`).join('')||''}`}${readerPreferences()}${readerContents(s)}${readerBody(s)}<div class="reading-nav">${previous?btn('read',`${ico('back')} Sebelumnya`,'btn outline',`data-id="${previous.id}"`):'<div></div>'}${next?btn('read',`Selanjutnya ${ico('chevron')}`,'btn',`data-id="${next.id}"`):''}</div><p class="fineprint" style="text-align:center">Dikutip dari naskah asli tanpa perbaikan diam-diam. Periksa tab Catatan untuk koreksi yang telah diketahui.</p></div>`}
function updateTheme(){document.documentElement.dataset.theme=S.dark?'dark':'light';document.documentElement.dataset.palette=S.palette;document.body.style.setProperty('--ar-size',S.font+'px');document.body.style.setProperty('--read-size',S.baseFont+'px');document.body.classList.toggle('hide-latin',!S.latin);document.body.classList.toggle('hide-translation',!S.translation);document.body.classList.toggle('hide-sources',!S.sources);document.body.classList.toggle('focus',S.focus&&(S.view==='read'||S.view==='quickread'))}
function openAccordionIds(){
 return [...(root.querySelectorAll?.('details[data-accordion][open]')||[])].map(entry=>entry.id);
}
function restoreAccordions(ids){
 if(!ids)return;
 root.querySelectorAll?.('details[data-accordion]').forEach(entry=>entry.open=ids.includes(entry.id));
}
function keepOnlyOpen(panel){
 const group=panel.getAttribute('name');
 if(!group)return;
 root.querySelectorAll('details[data-accordion][open]').forEach(other=>{
  if(other!==panel&&other.getAttribute('name')===group)other.open=false;
 });
}
function focusPanel(panel){
 if(!panel)return;
 panel.open=true;
 keepOnlyOpen(panel);
 rememberPanel(panel);
 panel.querySelector('summary')?.focus({preventScroll:true});
 panel.scrollIntoView({block:'start'});
}
function render(scroll=true,accordionState=scroll?null:openAccordionIds()){
 const active=document.activeElement;
 const activeButton=!scroll&&active?.dataset?.action?{...active.dataset}:null;
 const filterScroll=!scroll?root.querySelector?.('.filter-row')?.scrollLeft:0;
 updateTheme();
 const views={home,guide,daily,nabi,quran,salatbundle:salatBundle,quickread:quickRead,explore,search,saved,review,read};
 root.innerHTML=shell(views[S.view]?.()||home());
 restoreAccordions(accordionState);
 const title=S.view==='read'?label(byId.get(S.reader)||secs[0]):S.view==='quickread'?itemLabel(S.quickId):collections[S.view]?.title||'';
 document.title=title?`${title} — Doa Teduh`:'Dashboard Doa — Doa Teduh';
 const filters=root.querySelector?.('.filter-row');
 if(filters){
  if(filterScroll)filters.scrollLeft=filterScroll;
  const selected=filters.querySelector('.active');
  if(selected&&selected.offsetLeft+selected.offsetWidth>filters.scrollLeft+filters.offsetWidth){
   filters.scrollLeft=selected.offsetLeft+selected.offsetWidth-filters.offsetWidth+8;
  }
 }
 if(scroll)window.scrollTo({top:0,behavior:'instant'});
 if(activeButton){
  const next=[...root.querySelectorAll('[data-action]')].find(button=>Object.entries(activeButton).every(([key,value])=>button.dataset[key]===value));
  next?.focus({preventScroll:true});
 }
 refreshReadingProgress();
}
const pageHashes={home:'',guide:'#alur-doa',daily:'#doa-pilihan',nabi:'#doa-nabi',quran:'#doa-quran',explore:'#jelajah',saved:'#tersimpan',search:'#cari',review:'#catatan',salatbundle:'#setelah-salat'};
let viewEpoch=0,readerFailed=false;
async function finishReading(epoch,restore){
 const section=byId.get(S.reader);
 if(section.blocks)return true;
 try{
  await prepareReading(section);
 }catch{
  if(epoch===viewEpoch){
   readerFailed=true;
   render(false);
   document.getElementById('konten')?.focus({preventScroll:true});
  }
  return false;
 }
 if(epoch!==viewEpoch)return false;
 render(false,restore?.accordions);
 if(restore)window.scrollTo({top:restore.scroll,behavior:'instant'});
 document.getElementById('konten')?.focus({preventScroll:true});
 return true;
}
function route(view,options={},replace=false){
 const epoch=++viewEpoch;
 readerFailed=false;
 const previous=S.view;
 const reading=readingViews.has(view);
 const origin=history.state?.readerOrigin;
 let readerOrigin;
 if(reading){
  if(!readingViews.has(previous))readerOrigin={depth:1};
  else if(origin)readerOrigin={depth:origin.depth+1};
 }else{
  S.focus=false;
  S.prefsOpen=false;
 }
 if(view==='nabi')S.nabiTopic='';
 if(view==='daily')S.dailyCategory='semua';
 S.view=view;
 Object.assign(S,options);
 if(view==='read'||view==='quickread')S.last=view==='read'?S.reader:S.quickId;
 const hash=view==='read'?`#baca/${encodeURIComponent(S.reader)}`:view==='quickread'?`#ringkas/${encodeURIComponent(S.quickId)}`:view==='nabi'&&S.nabiTopic==='utang'?'#doa-nabi/utang':
  view==='daily'&&S.dailyCategory!=='semua'?`#doa-pilihan/${S.dailyCategory}`:pageHashes[view];
 if(!replace&&hash!==location.hash){
  history.replaceState({...history.state,scroll:window.scrollY,accordions:openAccordionIds()},'',location.href);
  history.pushState({readerOrigin},'',hash||location.pathname+location.search);
 }else if(replace)history.replaceState({},'',hash||location.pathname+location.search);
 persist();
 syncPreferences();
 render();
 const target=document.getElementById(view==='search'?'query':'konten');
 target?.focus({preventScroll:true});
 if(view==='read')return finishReading(epoch);
}
async function openSection(id,panelId=''){
 if(!byId.has(id)||(S.view==='read'&&S.reader===id))return;
 if(await route('read',{reader:id})&&panelId&&S.view==='read'&&S.reader===id){
  focusPanel(document.getElementById(panelId));
 }
}
function openQuick(id){if(quickMap.has(id)&&!(S.view==='quickread'&&S.quickId===id))route('quickread',{quickId:id})}
function returnFromRead(){
 const depth=history.state?.readerOrigin?.depth;
 if(depth)history.go(-depth);
 else if(S.view==='salatbundle')route('guide',{},true);
 else if(S.view==='quickread'&&quickMap.get(S.quickId)?.kind==='Al-Qur’an')route('quran',{},true);
 else if(S.view==='quickread'&&(S.quickId.startsWith('nabi-')||S.quickId==='kur-rezeki-halal')){
  route('nabi',{nabiTopic:debtOrder.includes(S.quickId)?'utang':''},true);
 }else route('daily',{},true);
}
function syncPreferences(){
 applyPreferences(readPreferences());
 lastPreferences=preferenceSnapshot();
}
function loadLocation(initial){
 const epoch=++viewEpoch;
 readerFailed=false;
 const match=location.hash.match(/^#(baca|ringkas)\/([^?#]+)/);
 const debtPage=location.hash==='#doa-nabi/utang';
 const dailyTopic=location.hash.match(/^#doa-pilihan\/([a-z]+)$/)?.[1];
 const selectedTopic=prayerTopics.has(dailyTopic);
 let view=debtPage?'nabi':selectedTopic?'daily':Object.keys(pageHashes).find(key=>pageHashes[key]===location.hash)||'home';
 if(view==='daily')S.dailyCategory=selectedTopic?dailyTopic:'semua';
 S.nabiTopic=debtPage?'utang':'';
 if(match){
  try{
   const id=decodeURIComponent(match[2]);
   if(match[1]==='baca'&&byId.has(id)){view='read';S.reader=id;S.last=id}
   if(match[1]==='ringkas'&&quickMap.has(id)){view='quickread';S.quickId=id;S.last=id}
  }catch{}
 }
 S.view=view;
 S.focus=false;
 S.prefsOpen=false;
 persist();
 syncPreferences();
 const restore={accordions:window.history?history.state?.accordions:null,scroll:window.history?history.state?.scroll||0:0};
 render(true,restore.accordions);
 if(view==='read'&&!byId.get(S.reader).blocks)return finishReading(epoch,restore);
 if(!initial){
  window.scrollTo({top:restore.scroll,behavior:'instant'});
  document.getElementById('konten')?.focus({preventScroll:true});
 }
}
function click(ev){const el=ev.target.closest('[data-action]');if(!el)return;const act=el.dataset.action;const id=el.dataset.id;
 if(act==='skip'){ev.preventDefault();document.getElementById('konten')?.focus()}
 else if(act==='nav'){if(el.dataset.target==='guide'&&S.view!=='guide')S.guideStep=0;route(el.dataset.target)}
 else if(act==='nabi-open'||act==='quran-open'){
  const library=act==='nabi-open'?'nabi':'quran';
  const debt=library==='nabi'&&el.dataset.topic==='utang';
  S.collectionSearch[library]={query:'',limit:12};
  route(library,{nabiTopic:debt?'utang':''});
  if(debt)focusPanel(document.getElementById('nabi-topics-utang'));
 }
 else if(act==='daily-topic')route('daily',{dailyCategory:el.dataset.topic})
 else if(act==='topic-jump'){
  const heading=document.getElementById(el.dataset.anchor);
  heading?.focus({preventScroll:true});
  heading?.scrollIntoView({block:'start'});
 }
 else if(act==='collection-clear'){
  S.collectionSearch[S.view]={query:'',limit:12};
  updateCollectionSearch(S.view);
  const input=document.getElementById(`${S.view}-query`);
  input.value='';
  input.focus();
 }
 else if(act==='collection-more'){
  const before=document.querySelectorAll('.collection-matches .quick-card').length;
  S.collectionSearch[S.view].limit+=12;
  updateCollectionSearch(S.view);
  document.querySelectorAll('.collection-matches .quick-card')[before]?.focus();
 }
 else if(act==='reading-context')focusPanel(document.getElementById(`quick-context-${S.quickId}`))
 else if(act==='resume-read')openSection(id,savedPanel(id));
 else if(act==='reader-retry'){
  readerFailed=false;
  render(false);
  finishReading(++viewEpoch);
 }
 else if(act==='search-full')loadFullSearch();
 else if(act==='download-offline')downloadOffline();
 else if(act==='reader-next-part')focusPanel(document.getElementById(el.dataset.anchor))
 else if(act==='reader-index'){
  const index=document.getElementById('reader-contents');
  index.open=true;
  index.querySelector('summary').focus({preventScroll:true});
  index.scrollIntoView({block:'start'});
 }
 else if(act==='salat-open')route('salatbundle')
 else if(act==='salat-mode'){const nm=el.dataset.mode==='short'?'short':'full';if(S.salatMode!==nm){S.salatMode=nm;persist();render(false,[]);requestAnimationFrame(()=>document.querySelector('.salat-intro')?.scrollIntoView({block:'start',behavior:'instant'}))}}
 else if(act==='salat-font-up'||act==='salat-font-down'){S.font=Math.max(23,Math.min(49,S.font+(act==='salat-font-up'?2:-2)));persist();updateTheme();announce('Ukuran huruf Arab '+S.font+' piksel')}
 else if(act==='salat-reset'){S.salatDone=[];S.salatCounts={};persist();render(false,[]);requestAnimationFrame(()=>document.querySelector('.salat-intro')?.scrollIntoView({block:'start',behavior:'smooth'}))}
 else if(act==='salat-count'){const key=el.dataset.key,limit=Number(el.dataset.limit),n=Number(el.dataset.n);if(!/^((short|full)-[0-9]+)$/.test(key)||!Number.isInteger(limit)||limit<1||limit>100) return;let current=Math.min(limit,Math.max(0,Number(S.salatCounts[key]||0)));current=Math.min(limit,current+1);S.salatCounts[key]=current;if(current>=limit&&!S.salatDone.includes(key))S.salatDone.push(key);persist();const counter=document.getElementById(`salat-count-${n}`);if(counter)counter.textContent=`${current} / ${limit}`;el.textContent=current>=limit?'Selesai ✓':'+ 1';el.disabled=current>=limit;salatProgressRefresh();if(current>=limit){const card=el.closest('.salat-item');if(card){card.classList.add('complete');card.querySelector('.salat-done-indicator').textContent='✓';const mark=card.querySelector('.salat-mark');if(mark){mark.textContent='✓ Sudah dibaca';mark.classList.add('marked');mark.setAttribute('aria-pressed','true')}}}}
 else if(act==='salat-count-reset'){const key=el.dataset.key;S.salatCounts[key]=0;S.salatDone=S.salatDone.filter(v=>v!==key);persist();const card=el.closest('.salat-item');if(card){card.classList.remove('complete');const ind=card.querySelector('.salat-done-indicator');if(ind){ind.textContent='';ind.setAttribute('aria-label','Belum ditandai')}const mark=card.querySelector('.salat-mark');if(mark){mark.textContent='Tandai dibaca';mark.classList.remove('marked');mark.setAttribute('aria-pressed','false')}const n=el.dataset.n;const text=document.getElementById('salat-count-'+n);if(text)text.textContent='0 / '+card.querySelector('.salat-count-tap')?.dataset.limit;const tap=card.querySelector('.salat-count-tap');if(tap){tap.textContent='+ 1';tap.disabled=false}}salatProgressRefresh()}
 else if(act==='salat-mark'){const key=el.dataset.key;const marked=!S.salatDone.includes(key);S.salatDone=marked?[...S.salatDone,key]:S.salatDone.filter(k=>k!==key);persist();const card=el.closest('.salat-item');if(card){card.classList.toggle('complete',marked);const ind=card.querySelector('.salat-done-indicator');if(ind){ind.textContent=marked?'✓':'';ind.setAttribute('aria-label',marked?'Sudah dibaca':'Belum ditandai')}}el.textContent=marked?'✓ Sudah dibaca':'Tandai dibaca';el.classList.toggle('marked',marked);el.setAttribute('aria-pressed',String(marked));salatProgressRefresh()}
 else if(act==='salat-resume'){
  const mode=S.salatMode==='short'?'short':'full', ids=salatData[mode]||[];
  const next=ids.findIndex((_,i)=>!S.salatDone.includes(`${mode}-${i}`));
  focusPanel(document.getElementById('salat-step-'+(next<0?ids.length:next+1)));
  if(next<0)announce('Semua bacaan telah ditandai');
 }
 else if(act==='salat-jump'){document.getElementById(el.dataset.anchor)?.scrollIntoView({behavior:'smooth',block:'start'})}
 else if(act==='salat-next')focusPanel(document.getElementById('salat-step-'+el.dataset.n))
 else if(act==='reader-jump'){
  const target=document.getElementById(el.dataset.anchor);
  if(target){
   document.getElementById('reader-contents').open=false;
   const hiddenClass=target.classList.contains('latinlabel')?'latin':target.classList.contains('translabel')?'translation':null;
   if(hiddenClass&&!S[hiddenClass]){S[hiddenClass]=true;persist();updateTheme()}
   const container=target.closest('details[data-accordion]');
   if(container){container.open=true;keepOnlyOpen(container);rememberPanel(container)}
   target.focus({preventScroll:true});
   target.scrollIntoView({block:'start'});
   refreshReadingProgress();
  }
 }
 else if(act==='phase'){S.phase=Number(el.dataset.n);route('explore',{explore:'phase'})}
 else if(act==='phasechip'){S.phase=Number(el.dataset.n);persist();render()}
 else if(act==='explore-tab'){S.explore=el.dataset.tab;persist();render()}
 else if(act==='read')openSection(id);
 else if(act==='quickread')openQuick(id);
 else if(act==='guide-context'){S.guideContext=el.dataset.context;S.guideStep=0;persist();render(false)}
 else if(act==='guide-mode'){S.guideMode=el.dataset.mode;S.guideStep=0;persist();render(false)}
 else if(act==='guide-step'){S.guideStep=Number(el.dataset.step)||0;persist();render(false);requestAnimationFrame(()=>{document.getElementById('guide-reader')?.scrollIntoView({block:'start',behavior:'smooth'})})}
 else if(act==='guide-restart'){S.guideStep=0;persist();render(false);requestAnimationFrame(()=>{document.getElementById('guide-reader')?.scrollIntoView({block:'start',behavior:'smooth'})})}
 else if(act==='palette'){S.palette=el.dataset.palette;persist();updateTheme();document.querySelectorAll('.palette-opt').forEach(x=>x.classList.toggle('active',x.dataset.palette===S.palette))}
 else if(act==='return')returnFromRead();
 else if(act==='theme'){S.dark=!S.dark;persist();updateTheme();const theme=el;theme.innerHTML=ico(S.dark?'sun':'moon');theme.setAttribute('aria-label',S.dark?'Mode terang':'Mode gelap')}
 else if(act==='save'){const key=S.view==='quickread'?S.quickId:S.reader;S.saved=S.saved.includes(key)?S.saved.filter(x=>x!==key):[...S.saved,key];persist();render(false);announce(S.saved.includes(key)?'Disimpan ke bookmark':'Dihapus dari bookmark')}
 else if(act==='done'){const key=S.view==='quickread'?S.quickId:S.reader;S.done=S.done.includes(key)?S.done.filter(x=>x!==key):[...S.done,key];persist();render(false);announce(S.done.includes(key)?'Ditandai selesai':'Tanda selesai dibatalkan')}
 else if(act==='focus'){S.focus=!S.focus;persist();render(false);if(S.focus)root.querySelector('.focus-exit')?.focus({preventScroll:true});else root.querySelector('.reader-tools [data-action=focus]')?.focus({preventScroll:true});announce(S.focus?'Mode fokus aktif':'Mode fokus dinonaktifkan')}
 else if(act==='toggle-latin'){S.latin=!S.latin;persist();if(S.view==='salatbundle'){updateTheme();el.textContent=`Latin ${S.latin?'✓':'○'}`;el.setAttribute('aria-pressed',String(S.latin));el.classList.toggle('active',S.latin)}else render(false)}
 else if(act==='toggle-translation'){S.translation=!S.translation;persist();if(S.view==='salatbundle'){updateTheme();el.textContent=`Arti ${S.translation?'✓':'○'}`;el.setAttribute('aria-pressed',String(S.translation));el.classList.toggle('active',S.translation)}else render(false)}
 else if(act==='toggle-sources'){S.sources=!S.sources;persist();render(false)}
 else if(act==='settings'){S.prefsOpen=!S.prefsOpen;render(false)}
 else if(act==='fontsize'){S.baseFont=S.baseFont>=22?15:S.baseFont+1;persist();render(false);announce('Ukuran teks diubah')}
 else if(act==='copytext'){const x=quickMap.get(S.quickId);const t=[x?.title,x?.arabic,x?.latin,x?.meaning,x?.reference].filter(Boolean).join('\n\n');if(navigator.clipboard?.writeText)navigator.clipboard.writeText(t).then(()=>announce('Teks doa disalin')).catch(()=>announce('Tidak dapat menyalin'));else{const box=document.createElement('textarea');box.value=t;document.body.append(box);box.select();try{document.execCommand('copy');announce('Teks doa disalin')}catch(e){announce('Gagal menyalin')}box.remove()}}
 else if(act==='copy'){const link=location.href; if(navigator.clipboard?.writeText){navigator.clipboard.writeText(link).then(()=>announce('Tautan disalin')).catch(()=>announce('Gagal menyalin tautan'))}else announce('Salin alamat pada bilah browser')}
 else if(act==='filter'){S.filter=el.dataset.filter;S.searchLimit=40;S.quickSearchLimit=12;render(false);document.getElementById('query')?.focus()}
 else if(act==='clear-search'){S.query='';S.searchLimit=40;S.quickSearchLimit=12;render(false);document.getElementById('query')?.focus()}
 else if(act==='more'||act==='more-quick'){
  const container=document.getElementById('results');
  const selector=act==='more'?'.search-manuscript .result':'.search-quick .quick-card';
  const before=container.querySelectorAll(selector).length;
  if(act==='more')S.searchLimit+=50;else S.quickSearchLimit+=12;
  container.innerHTML=resultsHtml();
  container.querySelectorAll(selector)[before]?.focus();
 }
}
root.addEventListener('click',event=>{
 const summary=event.target.closest('details[data-accordion] > summary');
 if(summary){
  requestAnimationFrame(()=>{
   if(!summary.isConnected||!summary.parentElement.open)return;
   keepOnlyOpen(summary.parentElement);
   rememberPanel(summary.parentElement);
   const {top,bottom}=summary.getBoundingClientRect();
   const header=document.querySelector('.topbar')?.getBoundingClientRect().bottom||0;
   const toolbar=document.querySelector('.salat-toolbar')?.getBoundingClientRect().bottom||0;
   if(top<Math.max(header,toolbar)||bottom>window.innerHeight)summary.parentElement.scrollIntoView({block:'start'});
   refreshReadingProgress();
  });
 }
 click(event);
});
root.addEventListener('submit',event=>{
 if(event.target.id!=='home-search')return;
 event.preventDefault();
 S.query=document.getElementById('home-query').value.trim();
 S.searchLimit=40;
 S.quickSearchLimit=12;
 S.filter='semua';
 route('search');
});
let searchTimer;
root.addEventListener('input',ev=>{
 const library=ev.target.dataset.collectionQuery;
 if(library){
  S.collectionSearch[library]={query:ev.target.value,limit:12};
  updateCollectionSearch(library);
  return;
 }
 if(ev.target.id==='query'){S.query=ev.target.value;S.searchLimit=40;S.quickSearchLimit=12;root.querySelector('[data-action=clear-search]').hidden=!S.query;clearTimeout(searchTimer);searchTimer=setTimeout(refreshSearchResults,170)}else if(ev.target.id==='fontSlider'){S.font=Number(ev.target.value);document.body.style.setProperty('--ar-size',S.font+'px');document.getElementById('fontNumber').textContent=S.font+'px';persist()}});
function refreshReadingProgress(){
 const progress=document.getElementById('prog');
 if(!progress)return;
 const max=document.documentElement.scrollHeight-window.innerHeight;
 progress.style.width=(max>0?Math.max(0,Math.min(100,window.scrollY/max*100)):100).toFixed(1)+'%';
}
window.addEventListener('hashchange',()=>loadLocation(false));
window.addEventListener('scroll',refreshReadingProgress,{passive:true});
window.addEventListener('resize',refreshReadingProgress);
window.addEventListener('keydown',ev=>{
 if(ev.key==='Escape'&&S.focus){
  S.focus=false;
  render(false);
  root.querySelector('.reader-tools [data-action=focus]')?.focus({preventScroll:true});
 }
});
const offlineAvailable='serviceWorker' in navigator&&/^https?:/.test(location.protocol);
let offlineState='idle',offlineRegistration;
function registerOffline(){
 return offlineRegistration??=navigator.serviceWorker.register('./sw.js').catch(error=>{
  offlineRegistration=null;
  throw error;
 });
}
function offlineControls(){
 const label=offlineState==='loading'?'Menyimpan bacaan…':offlineState==='ready'?'Unduh ulang bila perlu':'Simpan semua bacaan offline';
 const status=offlineState==='ready'?'Bacaan lengkap siap dibuka tanpa koneksi di perangkat ini.':
  offlineState==='error'?'Unduhan belum selesai. Coba lagi saat koneksi stabil.':'';
 return `${btn('download-offline',label,'text-link',offlineState==='loading'?'aria-disabled="true"':'')}<p class="offline-status" role="status">${status}</p>`;
}
function updateOfflineControls(){
 const control=document.getElementById('offline-controls');
 if(control)control.innerHTML=offlineControls();
}
async function downloadOffline(){
 if(!offlineAvailable||offlineState==='loading')return;
 offlineState='loading';
 updateOfflineControls();
 try{
  const registration=await registerOffline();
  const worker=registration.active;
  if(!worker)throw Error('Offline worker is still preparing');
  const channel=new MessageChannel();
  let timeout;
  try{
   await new Promise((resolve,reject)=>{
    timeout=setTimeout(()=>reject(Error('Offline download timed out')),60000);
    channel.port1.onmessage=event=>{
     if(event.data?.ok)resolve();
     else reject(Error('Offline download incomplete'));
    };
    worker.postMessage({type:'cache-library'},[channel.port2]);
   });
  }finally{
   clearTimeout(timeout);
   channel.port1.close();
  }
  offlineState='ready';
 }catch{offlineState='error'}
 updateOfflineControls();
}
if(window.history)history.scrollRestoration='manual';
const initialReading=loadLocation(true);
if(offlineAvailable)window.addEventListener('load',()=>registerOffline().catch(()=>{}));
return initialReading;
};window.startDoaTeduh();
