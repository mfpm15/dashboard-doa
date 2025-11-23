/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { Icon } from '@/components/ui/Icon';

interface WordChoiceGuideProps {
    isOpen: boolean;
    onClose: () => void;
}

export function WordChoiceGuide({ isOpen, onClose }: WordChoiceGuideProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
                role="dialog"
                aria-modal="true"
            >
                <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Icon name="message-circle" className="text-emerald-500" />
                        Seni Pemilihan Kata dalam Berdoa
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                        aria-label="Tutup"
                    >
                        <Icon name="x" size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed">
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
                        <p className="font-medium text-emerald-800 dark:text-emerald-200">
                            "Kata-kata adalah doa. Pilihlah kata-kata yang menggetarkan langit, yang menunjukkan keyakinan penuh, dan adab tertinggi kepada Sang Raja."
                        </p>
                    </div>

                    <section className="space-y-3">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 text-xs">1</span>
                            Gunakan Kata "Karuniakan", Bukan Sekadar "Berikan"
                        </h3>
                        <p>
                            Kata <strong>"Berikan"</strong> itu standar. Namun kata <strong>"Karuniakan"</strong> (dari kata <em>Karunia</em>) menyiratkan pemberian yang besar, mulia, dan bersumber dari kemurahan hati yang tak terbatas. Ini menyentuh sifat Allah <em>Al-Karīm</em> (Yang Mahamulia).
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 text-sm">
                            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 opacity-70">
                                <span className="block text-xs font-bold text-slate-500 mb-1">BIASA:</span>
                                "Ya Allah, berikan aku rezeki."
                            </div>
                            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800">
                                <span className="block text-xs font-bold text-emerald-600 mb-1">LUAR BIASA:</span>
                                "Ya Allah, <strong>karuniakanlah</strong> kepadaku rezeki yang melimpah..."
                            </div>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 text-xs">2</span>
                            Spesifik dan Detail (Tamak dalam Kebaikan)
                        </h3>
                        <p>
                            Allah menyukai hamba yang meminta segalanya kepada-Nya, bahkan tali sandal yang putus sekalipun. Jangan ragu meminta detail. Itu menunjukkan kita sangat butuh dan yakin Allah Mahakaya.
                        </p>
                        <ul className="list-disc pl-5 space-y-1 marker:text-emerald-500">
                            <li>Jangan cuma minta "kerjaan", mintalah "pekerjaan yang halal, gaji besar, lingkungan baik, dekat rumah, dan berkah".</li>
                            <li>Jangan cuma minta "sehat", mintalah "kesehatan paripurna dari ujung rambut sampai kaki, fisik kuat untuk ibadah, mental baja".</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 text-xs">3</span>
                            Panggil Allah dengan Nama yang Sesuai (Asmaul Husna)
                        </h3>
                        <p>
                            Ini adalah kunci pembuka pintu langit. Sesuaikan permintaan dengan Nama-Nya.
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="p-2 rounded bg-slate-50 dark:bg-slate-800">Minta Rezeki → <strong>Yā Razzāq, Yā Fattāḥ, Yā Ghanī</strong></div>
                            <div className="p-2 rounded bg-slate-50 dark:bg-slate-800">Minta Ampunan → <strong>Yā Ghaffār, Yā 'Afuww, Yā Tawwāb</strong></div>
                            <div className="p-2 rounded bg-slate-50 dark:bg-slate-800">Minta Jabatan/Karir → <strong>Yā Mālik, Yā 'Azīz, Yā Rāfi'</strong></div>
                            <div className="p-2 rounded bg-slate-50 dark:bg-slate-800">Minta Jodoh/Anak → <strong>Yā Wadūd, Yā Wahhāb, Yā Bāri'</strong></div>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 text-xs">4</span>
                            Hindari Kata "Kalau" atau "Jika"
                        </h3>
                        <p>
                            Nabi ﷺ melarang berdoa: <em>"Ya Allah ampunilah aku jika Engkau mau."</em> (HR. Bukhari).
                            <br />
                            Berdoalah dengan <strong>'Azm al-Mas'alah</strong> (tekad yang kuat). Katakan: <strong>"Ya Allah, ampunilah aku!"</strong>. Tunjukkan kita tidak punya opsi lain selain dikabulkan oleh-Nya.
                        </p>
                    </section>

                    <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-xl text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                            "Berdoalah kepada Allah dalam keadaan yakin akan dikabulkan..." (HR. Tirmidzi)
                        </p>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-emerald-600/20"
                    >
                        Saya Mengerti
                    </button>
                </div>
            </div>
        </div>
    );
}
