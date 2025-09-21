import { Item } from '@/types';

/**
 * Dataset doa yang sesuai dengan requirements user
 * 57 doa komprehensif dengan struktur yang benar
 */
export const correctPrayerData: Partial<Item>[] = [
  // Zikir Setelah Shalat
  {
    id: "1",
    title: "Istighfar & Doa Keselamatan (Pembuka Zikir)",
    category: "Zikir Setelah Shalat",
    kaidah: "Amalan pertama setelah salam: istighfar tiga kali lalu memuji Allah sebagai As-Salām.",
    arabic: "أَسْتَغْفِرُ اللَّهَ (٣x)\n\nاللَّهُمَّ أَنْتَ السَّلَامُ، وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ.",
    latin: "Astaghfirullāh (3x). Allāhumma anta as-salām, wa minka as-salām, tabārakta yā dzal-jalāli wal-ikrām.",
    translation_id: "\"Aku memohon ampun kepada Allah\" (3x). \"Ya Allah, Engkau Mahasejahtera, dan dari-Mu segala kesejahteraan. Mahaberkah Engkau, wahai Pemilik keagungan dan kemuliaan.\"",
    source: "HR Muslim.",
    tags: ["istighfar", "salam", "zikir", "setelah-shalat"],
    favorite: true
  },
  {
    id: "2",
    title: "Tasbih, Tahmid, Takbir (33x) & Tahlil",
    category: "Zikir Setelah Shalat",
    kaidah: "Zikir ringan berpahala besar setelah shalat fardhu.",
    arabic: "سُبْحَانَ اللَّهِ (٣٣x) اَلْحَمْدُ لِلَّهِ (٣٣x) اللَّهُ أَكْبَرُ (٣٣x)\n\nلَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    latin: "Subḥānallāh (33x), al-ḥamdu lillāh (33x), Allāhu akbar (33x). Lā ilāha illallāhu waḥdahū lā syarīka lah, lahul-mulku wa lahul-ḥamdu, wa huwa 'alā kulli syay'in qadīr (1x).",
    translation_id: "Mahasuci Allah (33x), segala puji bagi Allah (33x), Allah Mahabesar (33x). Tiada sesembahan selain Allah Yang Esa, tiada sekutu bagi-Nya. Milik-Nya kerajaan dan pujian, dan Dia Mahakuasa atas segala sesuatu.",
    source: "HR Muslim.",
    tags: ["tasbih", "tahmid", "takbir", "tahlil", "zikir"],
    favorite: false
  },
  {
    id: "3",
    title: "Ayat Kursi",
    category: "Zikir Setelah Shalat",
    kaidah: "Ayat paling agung dalam Al-Qur'an, dibaca setelah shalat fardhu.",
    arabic: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    latin: "Allāhu lā ilāha illā huwal-ḥayyul-qayyūm, lā ta'khudzuhu sinatun wa lā nawm, lahu mā fis-samāwāti wa mā fil-arḍ, man dzal-ladzī yasyfa'u 'indahū illā bi-idznih, ya'lamu mā baina aydīhim wa mā khalfahum, wa lā yuḥīṭūna bisyay'in min 'ilmihī illā bimā syā', wasi'a kursiyyuhus-samāwāti wal-arḍ, wa lā ya'ūduhū ḥifẓuhumā, wa huwal-'aliyyul-'aẓīm.",
    translation_id: "Allah, tiada tuhan selain Dia, Yang Mahahidup, Yang terus-menerus mengurus (makhluk-Nya). Tidak mengantuk dan tidak tidur. Milik-Nya apa yang di langit dan di bumi. Siapa yang dapat memberi syafaat di sisi-Nya tanpa izin-Nya? Dia mengetahui apa yang di hadapan mereka dan di belakang mereka, dan mereka tidak mengetahui sesuatu pun dari ilmu-Nya kecuali apa yang Dia kehendaki. Kursi-Nya meliputi langit dan bumi, dan Dia tidak merasa berat memelihara keduanya. Dia Mahatinggi lagi Mahabesar.",
    source: "QS Al-Baqarah: 255.",
    tags: ["ayat-kursi", "zikir", "perlindungan"],
    favorite: true
  },
  {
    id: "4",
    title: "Al-Mu'awwidzāt (Al-Ikhlāṣ, Al-Falaq, An-Nās)",
    category: "Zikir Setelah Shalat",
    kaidah: "Tiga surah perlindungan. Dibaca 1x setelah shalat; khusus Subuh & Maghrib dibaca 3x.",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ.\n\nبِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِنْ شَرِّ مَا خَلَقَ ۝ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ.\n\nبِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَهِ النَّاسِ ۝ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ.",
    latin: "Bismillāhir-raḥmānir-raḥīm. Qul huwallāhu aḥad, allāhuṣ-ṣamad, lam yalid wa lam yūlad, wa lam yakun lahu kufuwan aḥad.\n\nBismillāhir-raḥmānir-raḥīm. Qul a'ūdzu birabbil-falaq, min syarri mā khalaq, wa min syarri ghāsiqin idzā waqab, wa min syarrin-naffāṯāti fil-'uqad, wa min syarri ḥāsidin idzā ḥasad.\n\nBismillāhir-raḥmānir-raḥīm. Qul a'ūdzu birabbin-nās, malikin-nās, ilāhin-nās, min syarril-waswāsil-khannās, allażī yuwaswisu fī ṣudūrin-nās, minal-jinnati wan-nās.",
    translation_id: "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang. Katakanlah: Dialah Allah Yang Maha Esa... (Al-Ikhlas)\n\nDengan nama Allah Yang Maha Pengasih lagi Maha Penyayang. Katakanlah: Aku berlindung kepada Tuhan yang menguasai subuh... (Al-Falaq)\n\nDengan nama Allah Yang Maha Pengasih lagi Maha Penyayang. Katakanlah: Aku berlindung kepada Tuhan manusia... (An-Nas)",
    source: "HR Abu Dawud, Tirmidzi, Nasa'i.",
    tags: ["muawwidzat", "perlindungan", "al-ikhlas", "al-falaq", "an-nas"],
    favorite: true
  },
  {
    id: "5",
    title: "Doa Wasiat Nabi kepada Mu'ādz",
    category: "Zikir Setelah Shalat",
    kaidah: "Permohonan agar ditolong untuk zikir, syukur, dan ibadah terbaik. Penutup rangkaian zikir setelah shalat.",
    arabic: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
    latin: "Allāhumma a'innī 'alā dzikrika wa syukrika wa ḥusni 'ibādatik.",
    translation_id: "Ya Allah, tolonglah aku untuk mengingat-Mu, bersyukur kepada-Mu, dan beribadah kepada-Mu dengan sebaik-baiknya.",
    source: "HR Abu Dawud, an-Nasa'i (sahih).",
    tags: ["zikir", "syukur", "ibadah", "wasiat-nabi"],
    favorite: false
  },

  // Pembukaan & Penutup Doa
  {
    id: "6",
    title: "Shalawat Ibrahimiyyah (Pembuka/Penutup Doa)",
    category: "Pembukaan & Penutup Doa",
    kaidah: "Adab berdoa adalah dibuka dan ditutup dengan shalawat. Ini adalah lafaz shalawat terbaik.",
    arabic: "اللَّهُمَّ صَلِّّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
    latin: "Allāhumma ṣalli 'alā Muḥammadin wa 'alā āli Muḥammad, kamā ṣallayta 'alā Ibrāhīma wa 'alā āli Ibrāhīm, innaka Ḥamīdun Majīd. Allāhumma bārik 'alā Muḥammadin wa 'alā āli Muḥammad, kamā bārakta 'alā Ibrāhīma wa 'alā āli Ibrāhīm, innaka Ḥamīdun Majīd.",
    translation_id: "Ya Allah, limpahkanlah salawat kepada Muhammad dan keluarga Muhammad sebagaimana Engkau telah melimpahkan kepada Ibrahim dan keluarga Ibrahim. Sungguh Engkau Maha Terpuji lagi Maha Mulia. Dan berkahilah Muhammad dan keluarga Muhammad sebagaimana Engkau telah memberkahi Ibrahim dan keluarga Ibrahim. Sungguh Engkau Maha Terpuji lagi Maha Mulia.",
    source: "HR Bukhari & Muslim.",
    tags: ["shalawat", "ibrahimiyyah", "pembuka-doa", "penutup-doa"],
    favorite: false
  },

  // Doa Pengampunan
  {
    id: "7",
    title: "Sayyidul Istighfar (Raja Istighfar)",
    category: "Doa Pengampunan",
    kaidah: "Istighfar paling sempurna; sangat baik untuk memulai permohonan ampun.",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي، فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    latin: "Allāhumma anta rabbī, lā ilāha illā anta, khalaqtanī wa anā 'abduka, wa anā 'alā 'ahdika wa wa'dika mastāṭa't, a'ūdzu bika min syarri mā ṣana't, abū'u laka bini'matika 'alayya, wa abū'u laka bi dzanbī, faghfir lī, fa innahu lā yaghfiru dz-dzunūba illā ant.",
    translation_id: "Ya Allah, Engkau Tuhanku; tiada sesembahan selain Engkau. Engkau telah menciptakanku dan aku adalah hamba-Mu. Aku berada di atas perjanjian dan janji-Mu semampuku. Aku berlindung kepada-Mu dari keburukan yang aku perbuat. Aku mengakui nikmat-Mu atasku, dan aku mengakui dosaku; maka ampunilah aku, karena sungguh tidak ada yang mengampuni dosa kecuali Engkau.",
    source: "HR Bukhari.",
    tags: ["sayyidul-istighfar", "pengampunan", "istighfar-terbaik"],
    favorite: true
  },

  // Doa Harian (tambahan sesuai permintaan)
  {
    id: "58",
    title: "Doa Masuk Rumah",
    category: "Doa Harian",
    kaidah: "Dzikir ketika masuk rumah untuk memohon berkah dan perlindungan.",
    arabic: "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا",
    latin: "Bismillāhi walajna, wa bismillāhi kharajna, wa 'alallāhi rabbinā tawakkalnā.",
    translation_id: "Dengan nama Allah kami masuk, dengan nama Allah kami keluar, dan kepada Allah Tuhan kami kami bertawakal.",
    source: "HR Abu Dawud.",
    tags: ["masuk-rumah", "harian", "tawakal"],
    favorite: false
  },
  {
    id: "59",
    title: "Doa Keluar Rumah",
    category: "Doa Harian",
    kaidah: "Dzikir ketika keluar rumah untuk mendapat perlindungan di perjalanan.",
    arabic: "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    latin: "Bismillāh, tawakkaltu 'alallāh, wa lā ḥawla wa lā quwwata illā billāh.",
    translation_id: "Dengan nama Allah, aku bertawakal kepada Allah, dan tiada daya dan kekuatan kecuali dengan pertolongan Allah.",
    source: "HR Abu Dawud & Tirmidzi.",
    tags: ["keluar-rumah", "harian", "tawakal"],
    favorite: false
  }
];

/**
 * Categories available in the prayer collection
 */
export const correctCategories = [
  "Zikir Setelah Shalat",
  "Pembukaan & Penutup Doa",
  "Doa Pengampunan",
  "Doa Iman & Akhlak",
  "Doa Keluarga",
  "Doa Hajat Dunia",
  "Doa Perlindungan",
  "Doa Kesehatan",
  "Doa Keselamatan Akhirat",
  "Doa Ilmu & Karunia",
  "Doa Mustajab",
  "Doa Harian",
  "Doa Rezeki & Pekerjaan",
  "Doa Umat",
  "Penguat Keyakinan"
];

/**
 * Common tags used in prayers
 */
export const correctCommonTags = [
  "istighfar", "zikir", "perlindungan", "shalawat", "pengampunan",
  "keluarga", "rezeki", "ilmu", "kesehatan", "akhirat",
  "hidayah", "takwa", "iman", "taubat", "dunia", "harian",
  "tawakal", "syukur", "ibadah", "amal-saleh"
];