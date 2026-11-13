'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowDown, BookOpen, Check, CheckCircle2, RotateCcw, Settings2, Minus, Plus } from 'lucide-react';
import { initialPrayerData } from '@/data/initialPrayers';

type Mode = 'short' | 'full';
type Group = 'zikir' | 'doa';
type Step = {
  id: string;
  title: string;
  arabic: string;
  latin: string;
  meaning: string;
  source: string;
  group: Group;
  count?: number;
  note?: string;
};

const STORAGE_KEY = 'dashboard-doa:salat-reader:v1';
const prayers = new Map(initialPrayerData.map(item => [String(item.id), item]));

function fromPrayer(id: string, number: string, title: string, group: Group, note?: string): Step {
  const prayer = prayers.get(number);
  return {
    id, title, group, note,
    arabic: prayer?.arabic || '',
    latin: prayer?.latin || '',
    meaning: prayer?.translation_id || '',
    source: prayer?.source || 'Periksa kembali rujukan dalam koleksi.',
  };
}

const BASE_STEPS: Step[] = [
  fromPrayer('istighfar', '1', 'Istighfar 3× dan doa keselamatan', 'zikir', 'Dibaca setelah salam. HR. Muslim 591.'),
  {
    id: 'tauhid', title: 'Zikir tauhid setelah salat', group: 'zikir',
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ',
    latin: 'Lā ilāha illallāhu waḥdahu lā syarīka lah, lahul-mulku wa lahul-ḥamdu, wa huwa ‘alā kulli syay’in qadīr. Allāhumma lā māni‘a limā a‘ṭayta, wa lā mu‘ṭiya limā mana‘ta, wa lā yanfa‘u dzal-jaddi minkal-jadd.',
    meaning: 'Tidak ada sesembahan yang berhak disembah kecuali Allah semata, tanpa sekutu. Milik-Nya kerajaan dan pujian. Ya Allah, tidak ada yang mampu menghalangi pemberian-Mu atau memberi apa yang Engkau tahan.',
    source: 'Sahih Muslim 593a.',
  },
  {
    id: 'tasbih', title: 'Tasbih 33 kali', group: 'zikir', count: 33,
    arabic: 'سُبْحَانَ اللَّهِ', latin: 'Subḥānallāh',
    meaning: 'Mahasuci Allah.', source: 'Sahih Muslim 597a.',
  },
  {
    id: 'tahmid', title: 'Tahmid 33 kali', group: 'zikir', count: 33,
    arabic: 'الْحَمْدُ لِلَّهِ', latin: 'Alḥamdulillāh',
    meaning: 'Segala puji bagi Allah.', source: 'Sahih Muslim 597a.',
  },
  {
    id: 'takbir', title: 'Takbir 33 kali', group: 'zikir', count: 33,
    arabic: 'اللَّهُ أَكْبَرُ', latin: 'Allāhu akbar',
    meaning: 'Allah Mahabesar.', source: 'Sahih Muslim 597a.',
  },
  {
    id: 'tahlil-penutup', title: 'Tahlil penyempurna zikir', group: 'zikir',
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    latin: 'Lā ilāha illallāhu waḥdahu lā syarīka lah, lahul-mulku wa lahul-ḥamdu wa huwa ‘alā kulli syay’in qadīr.',
    meaning: 'Tiada sesembahan yang berhak disembah kecuali Allah semata, tidak ada sekutu bagi-Nya. Milik-Nya kerajaan dan pujian, dan Dia Mahakuasa atas segala sesuatu.',
    source: 'Sahih Muslim 597a.',
  },
  fromPrayer('ayat-kursi', '3', 'Ayat Kursi', 'zikir', 'QS. Al-Baqarah 2:255; dalil pembacaan setelah salat perlu dinilai terpisah.'),
  fromPrayer('tiga-qul', '4', 'Al-Ikhlas, Al-Falaq, dan An-Nas', 'zikir', 'Pembacaan surah-surah perlindungan memiliki riwayat tersendiri. Perhatikan perbedaan jumlah bacaan menurut waktunya.'),
];

const RABBANA: Step = {
  id: 'rabbana', title: 'Kebaikan dunia dan akhirat', group: 'doa',
  arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
  latin: 'Rabbanā ātinā fid-dunyā ḥasanah, wa fil-ākhirati ḥasanah, wa qinā ‘adzāban-nār.',
  meaning: 'Ya Tuhan kami, berilah kami kebaikan di dunia, kebaikan di akhirat, dan lindungilah kami dari azab neraka.',
  source: 'Al-Qur’an, QS. Al-Baqarah 2:201.',
};

const FULL_EXTRA: Step[] = [
  {
    id: 'hamdalah', title: 'Memuji Allah', group: 'doa',
    arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', latin: 'Alḥamdulillāhi Rabbil-‘ālamīn.',
    meaning: 'Segala puji bagi Allah, Tuhan seluruh alam.', source: 'Al-Qur’an, QS. Al-Fatihah 1:2.',
    note: 'Pembukaan doa dengan memuji Allah lalu bershalawat berdasarkan hadis Fadhalah bin Ubaid (Abu Dawud 1481).',
  },
  fromPrayer('shalawat-awal', '7', 'Shalawat Ibrahimiyyah', 'doa'),
  fromPrayer('ismul-azam', '6', 'Berdoa dengan nama Allah yang agung', 'doa', 'Doa dengan pujian dan nama-nama Allah. Lihat riwayat Abu Dawud 1495; periksa variasi lafal.'),
  {
    id: 'mohon-syukur', title: 'Mohon pertolongan untuk berzikir dan beribadah', group: 'doa',
    arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
    latin: 'Allāhumma a‘innī ‘alā dzikrika wa syukrika wa ḥusni ‘ibādatik.',
    meaning: 'Ya Allah, tolonglah aku untuk mengingat-Mu, bersyukur kepada-Mu, dan beribadah dengan sebaik-baiknya.',
    source: 'Sunan Abu Dawud 1522.',
  },
  {
    id: 'agama-dunia-akhirat', title: 'Perbaikan agama, dunia, dan akhirat', group: 'doa',
    arabic: 'اللَّهُمَّ أَصْلِحْ لِي دِينِيَ الَّذِي هُوَ عِصْمَةُ أَمْرِي، وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي، وَأَصْلِحْ لِي آخِرَتِيَ الَّتِي فِيهَا مَعَادِي، وَاجْعَلِ الْحَيَاةَ زِيَادَةً لِي فِي كُلِّ خَيْرٍ، وَاجْعَلِ الْمَوْتَ رَاحَةً لِي مِنْ كُلِّ شَرٍّ',
    latin: 'Allāhumma aṣliḥ lī dīnī alladzī huwa ‘iṣmatu amrī, wa aṣliḥ lī dunyāya allatī fīhā ma‘āsyī, wa aṣliḥ lī ākhiratī allatī fīhā ma‘ādī, waj‘alil-ḥayāta ziyādatan lī fī kulli khayr, waj‘alil-mawta rāḥatan lī min kulli syarr.',
    meaning: 'Ya Allah, perbaikilah agamaku yang menjadi penjaga urusanku, duniaku tempat kehidupanku, dan akhiratku tempat kembaliku. Jadikan hidup sebagai tambahan kebaikan dan kematian sebagai istirahat dari segala keburukan.',
    source: 'Sahih Muslim 2720.',
  },
  RABBANA,
  fromPrayer('hidayah', '13', 'Hidayah, takwa, dan keteguhan hati', 'doa', 'Gabungan beberapa bacaan; bukan satu riwayat utuh.'),
  fromPrayer('keluarga', '15', 'Keluarga dan keturunan yang saleh', 'doa', 'Gabungan beberapa doa; sumber masing-masing dibaca terpisah.'),
  fromPrayer('jawami', '8', 'Memohon seluruh kebaikan dan perlindungan', 'doa', 'Doa Jawami‘ul Khair. Lihat Sunan Ibnu Majah 3846.'),
  fromPrayer('shalawat-akhir', '7', 'Shalawat penutup (pilihan)', 'doa', 'Pengulangan shalawat di sini adalah pilihan, bukan tata cara wajib.'),
  {
    id: 'penutup', title: 'Memuji dan menyucikan Allah', group: 'doa',
    arabic: 'سُبْحَانَ رَبِّكَ رَبِّ الْعِزَّةِ عَمَّا يَصِفُونَ ۝ وَسَلَامٌ عَلَى الْمُرْسَلِينَ ۝ وَالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    latin: 'Subḥāna rabbika rabbil-‘izzati ‘ammā yaṣifūn. Wa salāmun ‘alal-mursalīn. Wal-ḥamdulillāhi rabbil-‘ālamīn.',
    meaning: 'Mahasuci Tuhanmu, Tuhan Yang Mahamulia, dari apa yang mereka sifatkan. Salam sejahtera bagi para rasul. Segala puji bagi Allah, Tuhan seluruh alam.',
    source: 'Al-Qur’an, QS. As-Saffat 37:180–182.',
  },
];

const SHORT = [...BASE_STEPS, RABBANA];
const FULL = [...BASE_STEPS, ...FULL_EXTRA];

function scrollToStep(id: string) {
  document.getElementById('doa-' + id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function SetelahSalatPage() {
  const [mode, setMode] = useState<Mode>('short');
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [ready, setReady] = useState(false);
  const [showLatin, setShowLatin] = useState(true);
  const [showMeaning, setShowMeaning] = useState(true);
  const [fontSize, setFontSize] = useState(32);
  const steps = useMemo(() => (mode === 'short' ? SHORT : FULL), [mode]);
  const complete = steps.filter(step => done[step.id]).length;
  const next = steps.find(step => !done[step.id]);

  useEffect(() => {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (value.mode === 'short' || value.mode === 'full') setMode(value.mode);
      if (value.done && typeof value.done === 'object') setDone(value.done);
      if (value.counts && typeof value.counts === 'object') setCounts(value.counts);
      if (typeof value.showLatin === 'boolean') setShowLatin(value.showLatin);
      if (typeof value.showMeaning === 'boolean') setShowMeaning(value.showMeaning);
      if (typeof value.fontSize === 'number') setFontSize(Math.min(46, Math.max(26, value.fontSize)));
    } catch { /* local storage can be disabled */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode, done, counts, showLatin, showMeaning, fontSize })); }
    catch { /* reading remains usable with storage disabled */ }
  }, [mode, done, counts, ready, showLatin, showMeaning, fontSize]);

  const toggleDone = useCallback((step: Step) => {
    if (step.count && (counts[step.id] || 0) < step.count && !done[step.id]) return;
    setDone(prev => ({ ...prev, [step.id]: !prev[step.id] }));
  }, [counts, done]);

  const updateCount = (step: Step, delta: number) => {
    const target = step.count || 33;
    const value = Math.min(target, Math.max(0, (counts[step.id] || 0) + delta));
    setCounts(prev => ({ ...prev, [step.id]: value }));
    setDone(prev => ({ ...prev, [step.id]: value === target }));
  };

  const reset = () => {
    setCounts({});
    setDone({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-[#f7f7f2] text-slate-900 dark:bg-slate-950 dark:text-slate-100 pb-20">
      <header className="sticky top-0 z-50 border-b border-emerald-950/10 dark:border-white/10 bg-[#f7f7f2]/95 dark:bg-slate-950/95 backdrop-blur-lg pt-[env(safe-area-inset-top)]">
        <div className="max-w-2xl mx-auto px-3 sm:px-6 h-16 flex items-center gap-3">
          <Link href="/" aria-label="Kembali ke beranda" className="min-w-11 min-h-11 rounded-xl border border-emerald-900/10 dark:border-white/15 grid place-items-center hover:bg-emerald-50 dark:hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-emerald-600"><ArrowLeft size={20} /></Link>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold tracking-wide text-emerald-800 dark:text-emerald-300">DOA TEDUH</p>
            <h1 className="text-sm sm:text-base font-bold truncate">Rangkaian Setelah Salat</h1>
          </div>
          <span className="text-xs font-semibold tabular-nums text-emerald-800 dark:text-emerald-300" aria-label={complete + ' dari ' + steps.length + ' tahap selesai'}>{complete}/{steps.length}</span>
        </div>
        <div className="h-1 bg-emerald-100 dark:bg-slate-800"><div className="h-full bg-emerald-600 transition-[width] duration-200" style={{ width: (100 * complete / steps.length) + '%' }} /></div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <section className="pt-6 pb-4">
          <p className="text-xs font-bold tracking-[.18em] text-emerald-700 dark:text-emerald-300 uppercase">Zikir · Doa · Tadabbur</p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-2">Berzikir dengan tenang, berdoa dengan harapan.</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2">Baca dari atas ke bawah tanpa membuka banyak menu. Zikir setelah salam didahulukan; doa setelahnya merupakan susunan pilihan, bukan rangkaian wajib yang diriwayatkan sebagai satu paket.</p>
        </section>
        <div className="flex flex-wrap items-center gap-2 pb-5">
          <div className="inline-flex rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-1" role="group" aria-label="Pilih panjang bacaan">
            <button type="button" aria-pressed={mode === 'short'} onClick={() => setMode('short')} className={'min-h-11 px-4 rounded-lg text-sm font-semibold ' + (mode === 'short' ? 'bg-emerald-700 text-white' : 'text-slate-700 dark:text-slate-200')}>Ringkas · 9</button>
            <button type="button" aria-pressed={mode === 'full'} onClick={() => setMode('full')} className={'min-h-11 px-4 rounded-lg text-sm font-semibold ' + (mode === 'full' ? 'bg-emerald-700 text-white' : 'text-slate-700 dark:text-slate-200')}>Lengkap · 19</button>
          </div>
          <button type="button" onClick={reset} className="min-h-11 inline-flex items-center gap-2 px-3 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"><RotateCcw size={16} /> Mulai ulang</button>
        </div>

        <details className="mb-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
          <summary className="cursor-pointer flex items-center gap-2 text-sm font-semibold"><Settings2 size={18} /> Pengaturan tampilan <span className="ml-auto text-xs font-normal text-slate-500">Opsional</span></summary>
          <div className="pt-4 flex flex-col gap-4">
            <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={showLatin} onChange={e => setShowLatin(e.target.checked)} className="size-5 accent-emerald-700" /> Tampilkan transliterasi Latin</label>
            <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={showMeaning} onChange={e => setShowMeaning(e.target.checked)} className="size-5 accent-emerald-700" /> Tampilkan arti Indonesia</label>
            <label className="flex flex-col gap-2 text-sm font-medium">Ukuran huruf Arab: {fontSize}px<input aria-label="Ukuran huruf Arab" type="range" min="26" max="46" step="2" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="accent-emerald-700" /></label>
          </div>
        </details>

        {steps.map((step, index) => {
          const isDone = Boolean(done[step.id]);
          const count = counts[step.id] || 0;
          const firstInDoa = step.group === 'doa' && (index === 0 || steps[index - 1].group !== 'doa');
          return (
            <div key={step.id}>
              {index === 0 && <h3 className="font-bold text-emerald-800 dark:text-emerald-300 mb-3">A · Zikir setelah salam</h3>}
              {firstInDoa && <div className="mt-9 mb-4"><h3 className="font-bold text-emerald-800 dark:text-emerald-300">B · Doa dan munajat pilihan</h3><p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Bacaan tambahan, bukan urutan khusus yang diwajibkan.</p></div>}
              <article id={'doa-' + step.id} className={'scroll-mt-28 mb-4 rounded-2xl border p-5 sm:p-6 shadow-sm transition-colors ' + (isDone ? 'bg-emerald-50/80 border-emerald-200 dark:bg-emerald-950/25 dark:border-emerald-800' : 'bg-white border-stone-200 dark:bg-slate-900 dark:border-slate-700')}>
                <div className="flex items-start gap-3">
                  <span className="shrink-0 grid place-items-center rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100 size-9 text-xs font-bold tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                  <div className="flex-1"><h4 className="font-bold text-base leading-snug">{step.title}</h4><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{step.source}</p></div>
                  {isDone && <CheckCircle2 size={20} className="text-emerald-700 dark:text-emerald-300 shrink-0" aria-label="Selesai" />}
                </div>

                {step.arabic ? <p dir="rtl" lang="ar" style={{ fontSize: fontSize + 'px', lineHeight: 2.1 }} className="mt-5 mb-4 text-right font-serif text-slate-900 dark:text-slate-100 whitespace-pre-line break-words">{step.arabic}</p> : <p className="text-sm text-amber-800 mt-4">Teks belum tersedia dalam data koleksi.</p>}
                {showLatin && step.latin && <p className="text-sm leading-7 text-slate-600 dark:text-slate-300 whitespace-pre-line mb-3 italic">{step.latin}</p>}
                {showMeaning && step.meaning && <p className="text-sm leading-7 text-slate-700 dark:text-slate-200 whitespace-pre-line mb-3">{step.meaning}</p>}
                {step.note && <p className="text-xs leading-5 rounded-xl bg-stone-50 dark:bg-slate-800 p-3 text-slate-600 dark:text-slate-300 mb-3">{step.note}</p>}

                {step.count && (
                  <div className="rounded-xl border border-emerald-200 dark:border-emerald-900 p-3 mt-4">
                    <div className="flex items-center justify-between mb-2"><span className="text-sm font-semibold">Penghitung zikir</span><span aria-live="polite" className="font-bold tabular-nums text-emerald-800 dark:text-emerald-300">{count}/{step.count}</span></div>
                    <div className="grid grid-cols-[52px_1fr] gap-2">
                      <button aria-label={'Kurangi hitungan ' + step.title} type="button" disabled={count === 0} onClick={() => updateCount(step, -1)} className="min-h-14 rounded-xl border border-stone-200 dark:border-slate-700 grid place-items-center disabled:opacity-40"><Minus size={20} /></button>
                      <button type="button" disabled={count === step.count} onClick={() => updateCount(step, 1)} className="min-h-14 rounded-xl bg-emerald-700 disabled:bg-emerald-900/60 text-white font-bold inline-flex items-center justify-center gap-2"><Plus size={20} /> {count === step.count ? 'Selesai 33×' : 'Hitung satu zikir'}</button>
                    </div>
                  </div>
                )}
                {!step.count && <button type="button" aria-pressed={isDone} onClick={() => toggleDone(step)} className={'min-h-11 mt-2 w-full rounded-xl font-semibold text-sm inline-flex justify-center items-center gap-2 border ' + (isDone ? 'border-emerald-300 text-emerald-800 dark:text-emerald-300' : 'bg-emerald-700 text-white border-emerald-700')}><Check size={17} /> {isDone ? 'Sudah dibaca · batalkan' : 'Tandai sudah dibaca'}</button>}
                {index < steps.length - 1 && <button type="button" onClick={() => scrollToStep(steps[index + 1].id)} className="mt-3 min-h-11 w-full flex items-center justify-center gap-2 text-sm text-emerald-800 dark:text-emerald-300 font-semibold"><ArrowDown size={16} /> Lanjut ke bacaan berikutnya</button>}
              </article>
            </div>
          );
        })}

        <div className="rounded-2xl bg-emerald-900 text-white p-5 mt-8">
          <h3 className="font-bold text-lg">Semoga Allah menerima doa kita.</h3>
          <p className="text-emerald-100 text-sm mt-2 leading-relaxed">Tidak perlu merasa semua bacaan ini wajib diulang setiap salat. Pilih yang mampu dibaca dengan khusyuk, dan utamakan zikir serta doa yang memiliki dalil.</p>
          <div className="flex flex-wrap gap-3 mt-4">
            <button type="button" onClick={reset} className="min-h-11 px-4 rounded-xl bg-white text-emerald-950 text-sm font-semibold">Mulai ulang</button>
            <Link href="/" className="min-h-11 px-4 rounded-xl border border-emerald-200/40 text-sm font-semibold flex items-center gap-2"><BookOpen size={16} /> Kembali ke Doa Pilihan</Link>
          </div>
        </div>
      </div>

      {next && <div className="fixed bottom-0 inset-x-0 z-40 border-t border-stone-200 dark:border-slate-700 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-4 pt-2 pb-[max(env(safe-area-inset-bottom),.5rem)]"><div className="max-w-2xl mx-auto flex items-center gap-3"><span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums shrink-0">{complete}/{steps.length}</span><button type="button" onClick={() => scrollToStep(next.id)} className="flex-1 min-h-11 bg-emerald-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2">Lanjutkan yang belum selesai <ArrowDown size={17} /></button></div></div>}
    </main>
  );
}
