import { Item } from '@/types';

/**
 * Comprehensive collection of Islamic prayers and dhikr
 * Compiled from authentic sources including Quran and Hadith
 * Total: 57 prayers covering various categories
 */
export const initialPrayerData: Partial<Item>[] = [
  // Zikir Setelah Shalat (Post-Prayer Dhikr)
  {
    title: "Istighfar & Doa Keselamatan (Pembuka Zikir)",
    category: "Zikir Setelah Shalat",
    arabic: "أَسْتَغْفِرُ اللَّهَ (٣x)\n\nاللَّهُمَّ أَنْتَ السَّلَامُ، وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ.",
    latin: "Astaghfirullāh (3x). Allāhumma anta as-salām, wa minka as-salām, tabārakta yā dzal-jalāli wal-ikrām.",
    translation_id: "\"Aku memohon ampun kepada Allah\" (3x). \"Ya Allah, Engkau Mahasejahtera, dan dari-Mu segala kesejahteraan. Mahaberkah Engkau, wahai Pemilik keagungan dan kemuliaan.\"",
    source: "HR Muslim.",
    tags: ["istighfar", "salam", "zikir", "setelah-shalat"],
    favorite: true
  },
  {
    title: "Tasbih, Tahmid, Takbir (33x) & Tahlil",
    category: "Zikir Setelah Shalat",
    arabic: "سُبْحَانَ اللَّهِ (٣٣x) اَلْحَمْدُ لِلَّهِ (٣٣x) اللَّهُ أَكْبَرُ (٣٣x)\n\nلَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    latin: "Subḥānallāh (33x), al-ḥamdu lillāh (33x), Allāhu akbar (33x). Lā ilāha illallāhu waḥdahū lā syarīka lah, lahul-mulku wa lahul-ḥamdu, wa huwa 'alā kulli syay'in qadīr (1x).",
    translation_id: "Mahasuci Allah (33x), segala puji bagi Allah (33x), Allah Mahabesar (33x). Tiada sesembahan selain Allah Yang Esa, tiada sekutu bagi-Nya. Milik-Nya kerajaan dan pujian, dan Dia Mahakuasa atas segala sesuatu.",
    source: "HR Muslim.",
    tags: ["tasbih", "tahmid", "takbir", "tahlil", "zikir"],
    favorite: false
  },
  {
    title: "Ayat Kursi",
    category: "Zikir Setelah Shalat",
    arabic: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    latin: "Allāhu lā ilāha illā huwal-ḥayyul-qayyūm, lā ta'khudzuhu sinatun wa lā nawm, lahu mā fis-samāwāti wa mā fil-arḍ, man dzal-ladzī yasyfa'u 'indahū illā bi-idznih, ya'lamu mā baina aydīhim wa mā khalfahum, wa lā yuḥīṭūna bisyay'in min 'ilmihī illā bimā syā', wasi'a kursiyyuhus-samāwāti wal-arḍ, wa lā ya'ūduhū ḥifẓuhumā, wa huwal-'aliyyul-'aẓīm.",
    translation_id: "Allah, tiada tuhan selain Dia, Yang Mahahidup, Yang terus-menerus mengurus (makhluk-Nya). Tidak mengantuk dan tidak tidur. Milik-Nya apa yang di langit dan di bumi. Siapa yang dapat memberi syafaat di sisi-Nya tanpa izin-Nya? Dia mengetahui apa yang di hadapan mereka dan di belakang mereka, dan mereka tidak mengetahui sesuatu pun dari ilmu-Nya kecuali apa yang Dia kehendaki. Kursi-Nya meliputi langit dan bumi, dan Dia tidak merasa berat memelihara keduanya. Dia Mahatinggi lagi Mahabesar.",
    source: "QS Al-Baqarah: 255.",
    tags: ["ayat-kursi", "zikir", "perlindungan"],
    favorite: true
  },
  {
    title: "Al-Mu'awwidzāt (Al-Ikhlāṣ, Al-Falaq, An-Nās)",
    category: "Zikir Setelah Shalat",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ.\n\nبِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِنْ شَرِّ مَا خَلَقَ ۝ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ.\n\nبِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَهِ النَّاسِ ۝ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ.",
    latin: "Bismillāhir-raḥmānir-raḥīm. Qul huwallāhu aḥad, allāhuṣ-ṣamad, lam yalid wa lam yūlad, wa lam yakun lahu kufuwan aḥad.\n\nBismillāhir-raḥmānir-raḥīm. Qul a'ūdzu birabbil-falaq, min syarri mā khalaq, wa min syarri ghāsiqin idzā waqab, wa min syarrin-naffāṯāti fil-'uqad, wa min syarri ḥāsidin idzā ḥasad.\n\nBismillāhir-raḥmānir-raḥīm. Qul a'ūdzu birabbin-nās, malikin-nās, ilāhin-nās, min syarril-waswāsil-khannās, allażī yuwaswisu fī ṣudūrin-nās, minal-jinnati wan-nās.",
    translation_id: "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang. Katakanlah: Dialah Allah Yang Maha Esa... (Al-Ikhlas)\n\nDengan nama Allah Yang Maha Pengasih lagi Maha Penyayang. Katakanlah: Aku berlindung kepada Tuhan yang menguasai subuh... (Al-Falaq)\n\nDengan nama Allah Yang Maha Pengasih lagi Maha Penyayang. Katakanlah: Aku berlindung kepada Tuhan manusia... (An-Nas)",
    source: "HR Abu Dawud, Tirmidzi, Nasa'i.",
    tags: ["muawwidzat", "perlindungan", "al-ikhlas", "al-falaq", "an-nas"],
    favorite: true
  },
  {
    title: "Doa Wasiat Nabi kepada Mu'ādz",
    category: "Zikir Setelah Shalat",
    arabic: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
    latin: "Allāhumma a'innī 'alā dzikrika wa syukrika wa ḥusni 'ibādatik.",
    translation_id: "Ya Allah, tolonglah aku untuk mengingat-Mu, bersyukur kepada-Mu, dan beribadah kepada-Mu dengan sebaik-baiknya.",
    source: "HR Abu Dawud, an-Nasa'i (sahih).",
    tags: ["zikir", "syukur", "ibadah", "wasiat-nabi"],
    favorite: false
  },

  // Pembukaan & Penutup Doa
  {
    title: "Shalawat Ibrahimiyyah (Pembuka/Penutup Doa)",
    category: "Pembukaan & Penutup Doa",
    arabic: "اللَّهُمَّ صَلِّّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
    latin: "Allāhumma ṣalli 'alā Muḥammadin wa 'alā āli Muḥammad, kamā ṣallayta 'alā Ibrāhīma wa 'alā āli Ibrāhīm, innaka Ḥamīdun Majīd. Allāhumma bārik 'alā Muḥammadin wa 'alā āli Muḥammad, kamā bārakta 'alā Ibrāhīma wa 'alā āli Ibrāhīm, innaka Ḥamīdun Majīd.",
    translation_id: "Ya Allah, limpahkanlah salawat kepada Muhammad dan keluarga Muhammad sebagaimana Engkau telah melimpahkan kepada Ibrahim dan keluarga Ibrahim. Sungguh Engkau Maha Terpuji lagi Maha Mulia. Dan berkahilah Muhammad dan keluarga Muhammad sebagaimana Engkau telah memberkahi Ibrahim dan keluarga Ibrahim. Sungguh Engkau Maha Terpuji lagi Maha Mulia.",
    source: "HR Bukhari & Muslim.",
    tags: ["shalawat", "ibrahimiyyah", "pembuka-doa", "penutup-doa"],
    favorite: false
  },

  // Doa Pengampunan
  {
    title: "Sayyidul Istighfar (Raja Istighfar)",
    category: "Doa Pengampunan",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي، فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    latin: "Allāhumma anta rabbī, lā ilāha illā anta, khalaqtanī wa anā 'abduka, wa anā 'alā 'ahdika wa wa'dika mastāṭa't, a'ūdzu bika min syarri mā ṣana't, abū'u laka bini'matika 'alayya, wa abū'u laka bi dzanbī, faghfir lī, fa innahu lā yaghfiru dz-dzunūba illā ant.",
    translation_id: "Ya Allah, Engkau Tuhanku; tiada sesembahan selain Engkau. Engkau telah menciptakanku dan aku adalah hamba-Mu. Aku berada di atas perjanjian dan janji-Mu semampuku. Aku berlindung kepada-Mu dari keburukan yang aku perbuat. Aku mengakui nikmat-Mu atasku, dan aku mengakui dosaku; maka ampunilah aku, karena sungguh tidak ada yang mengampuni dosa kecuali Engkau.",
    source: "HR Bukhari.",
    tags: ["sayyidul-istighfar", "pengampunan", "istighfar-terbaik"],
    favorite: true
  },
  {
    title: "Doa Taubat Nabi Adam",
    category: "Doa Pengampunan",
    arabic: "رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
    latin: "Rabbanā ẓalamnā anfusanā, wa illam taghfir lanā wa tarḥamnā lanakūnanna minal-khāsirīn.",
    translation_id: "Ya Tuhan kami, kami telah menzalimi diri kami sendiri; jika Engkau tidak mengampuni kami dan menyayangi kami, niscaya kami termasuk orang-orang yang merugi.",
    source: "QS Al-A'raf: 23.",
    tags: ["taubat", "nabi-adam", "pengampunan"],
    favorite: false
  },
  {
    title: "Doa Nabi Yunus di Perut Ikan",
    category: "Doa Pengampunan",
    arabic: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    latin: "Lā ilāha illā anta, subḥānaka innī kuntu minaẓ-ẓālimīn.",
    translation_id: "Tiada tuhan selain Engkau. Mahasuci Engkau. Sungguh aku termasuk orang-orang yang zalim.",
    source: "QS Al-Anbiya': 87.",
    tags: ["nabi-yunus", "kesempitan", "pengampunan"],
    favorite: false
  },

  // Doa Iman & Akhlak
  {
    title: "Memohon Ketetapan Hati di Atas Agama",
    category: "Doa Iman & Akhlak",
    arabic: "يَا مُقَلِّبَ الْقُلُوبِ، ثَبِّتْ قَلْبِي عَلَى دِينِكَ",
    latin: "Yā Muqallibal-qulūb, ṯabbit qalbī 'alā dīnik.",
    translation_id: "Wahai Pembolak-balik hati, tetapkanlah hatiku di atas agama-Mu.",
    source: "HR Tirmidzi (hasan).",
    tags: ["ketetapan-hati", "iman", "agama"],
    favorite: false
  },
  {
    title: "Memohon Hidayah, Takwa, 'Iffah, dan Kecukupan",
    category: "Doa Iman & Akhlak",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى",
    latin: "Allāhumma innī as'aluka al-hudā wat-tuqā wal-'afāfa wal-ghinā.",
    translation_id: "Ya Allah, aku memohon kepada-Mu petunjuk, ketakwaan, kehormatan diri, dan kecukupan.",
    source: "HR Muslim.",
    tags: ["hidayah", "takwa", "iffah", "kecukupan"],
    favorite: false
  },

  // Doa Keluarga
  {
    title: "Doa untuk Kedua Orang Tua",
    category: "Doa Keluarga",
    arabic: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا.\nرَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ.",
    latin: "Rabbighfir lī wa liwālidayya warḥamhumā kamā rabbayānī ṣaghīrā. Rabbanaghfir lī wa liwālidayya wa lil-mu'minīna yawma yaqūmul-ḥisāb.",
    translation_id: "Ya Tuhanku, ampunilah aku dan kedua orang tuaku, dan sayangilah mereka sebagaimana mereka mendidikku di waktu kecil. Ya Tuhan kami, ampunilah aku, kedua orang tuaku, dan orang-orang beriman pada hari ditegakkannya perhitungan.",
    source: "QS Al-Isra':24 & QS Ibrahim:41.",
    tags: ["orang-tua", "keluarga", "bakti"],
    favorite: false
  },
  {
    title: "Doa untuk Pasangan & Keturunan Penyejuk Hati",
    category: "Doa Keluarga",
    arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
    latin: "Rabbanā hab lanā min azwājinā wa żurriyyātinā qurrata a'yunin, waj'alnā lil-muttaqīna imāmā.",
    translation_id: "Ya Tuhan kami, anugerahkanlah kepada kami dari pasangan-pasangan kami dan keturunan kami penyejuk mata, dan jadikanlah kami pemimpin bagi orang-orang bertakwa.",
    source: "QS al-Furqān:74.",
    tags: ["keluarga", "pasangan", "keturunan", "sakinah"],
    favorite: false
  },

  // Doa Hajat Dunia
  {
    title: "Doa Pembuka Rezeki (Ilmu, Rezeki, Amal)",
    category: "Doa Hajat Dunia",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا",
    latin: "Allāhumma innī as'aluka 'ilman nāfi'ā, wa rizqan ṭayyibā, wa 'amalan mutaqabbalā.",
    translation_id: "Ya Allah, aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang baik, dan amal yang diterima.",
    source: "HR Ibnu Majah (sahih).",
    tags: ["ilmu", "rezeki", "amal"],
    favorite: true
  },
  {
    title: "Doa Nabi Musa Memohon Kebaikan/Rezeki",
    category: "Doa Hajat Dunia",
    arabic: "رَبِّ إِنِّي لِمَا أَنْزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ",
    latin: "Rabbi innī limā anzalta ilayya min khayrin faqīr.",
    translation_id: "Ya Tuhanku, sesungguhnya aku sangat memerlukan kebaikan apa pun yang Engkau turunkan kepadaku.",
    source: "QS Al-Qasas: 24.",
    tags: ["rezeki", "kebaikan", "nabi-musa"],
    favorite: false
  },

  // Doa Perlindungan
  {
    title: "Perlindungan dari 8 Kesulitan Hidup",
    category: "Doa Perlindungan",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْجُبْنِ وَالْبُخْلِ، وَغَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ",
    latin: "Allāhumma innī a'ūdzu bika minal-hammi wal-ḥazan, wal-'ajzi wal-kasal, wal-jubni wal-bukhl, wa ghalabatid-dayni wa qahrir-rijāl.",
    translation_id: "Ya Allah, aku berlindung kepada-Mu dari kegundahan dan kesedihan, dari lemah dan malas, dari pengecut dan kikir, dan dari dominasi utang serta penindasan manusia.",
    source: "HR Bukhari.",
    tags: ["perlindungan", "kesulitan", "benteng"],
    favorite: true
  },
  {
    title: "Dzikir Perlindungan Pagi-Petang",
    category: "Doa Perlindungan",
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    latin: "Bismillāhilladzī lā yaḍurru ma'asmihī syai'un fil-arḍi wa lā fis-samā', wa huwas-samī'ul-'alīm.",
    translation_id: "Dengan nama Allah, yang dengan nama-Nya tidak ada sesuatu pun di bumi dan di langit yang dapat membahayakan, dan Dia Maha Mendengar lagi Maha Mengetahui.",
    source: "HR Abu Dawud & Tirmidzi (hasan).",
    tags: ["perlindungan", "pagi-petang", "dzikir"],
    favorite: false
  },

  // Doa Kesehatan
  {
    title: "Memohon Kesehatan & Kesembuhan Total",
    category: "Doa Kesehatan",
    arabic: "اللَّهُمَّ رَبَّ النَّاسِ، أَذْهِبِ الْبَأْسَ، اشْفِ أَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا",
    latin: "Allāhumma rabban-nās, adzhibil-ba's, isyfi anta asy-Syāfī, lā syifā'a illā syifā'uka, syifā'an lā yughadiru saqamā.",
    translation_id: "Ya Allah, Tuhan manusia, hilangkanlah penyakit; sembuhkanlah, Engkaulah Sang Penyembuh; tidak ada kesembuhan kecuali kesembuhan dari-Mu; kesembuhan yang tidak menyisakan penyakit.",
    source: "HR Bukhari & Muslim.",
    tags: ["kesehatan", "kesembuhan", "ruqyah"],
    favorite: false
  },

  // Doa Keselamatan Akhirat
  {
    title: "Doa Sapu Jagat (Kebaikan Dunia & Akhirat)",
    category: "Doa Keselamatan Akhirat",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    latin: "Rabbanā ātinā fid-dunyā ḥasanah, wa fil-ākhirati ḥasanah, wa qinā 'adzāban-nār.",
    translation_id: "Ya Tuhan kami, anugerahkanlah kepada kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka.",
    source: "QS al-Baqarah:201.",
    tags: ["doa-sapu-jagat", "dunia", "akhirat", "perlindungan"],
    favorite: true
  },
  {
    title: "Perlindungan dari Siksa Kubur, Neraka, & Fitnah Dajjal",
    category: "Doa Keselamatan Akhirat",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، وَمِنْ عَذَابِ جَهَنَّمَ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ",
    latin: "Allāhumma innī a'ūdzu bika min 'adzābil-qabr, wa min 'adzābi Jahannam, wa min fitnatil-maḥyā wal-mamāt, wa min syarri fitnatil-Masīḥid-Dajjāl.",
    translation_id: "Ya Allah, aku berlindung kepada-Mu dari azab kubur, dari azab neraka Jahannam, dari fitnah kehidupan dan kematian, dan dari kejahatan fitnah Al-Masih ad-Dajjal.",
    source: "HR Bukhari & Muslim.",
    tags: ["perlindungan", "akhirat", "kubur", "dajjal"],
    favorite: false
  },

  // Doa Ilmu & Karunia
  {
    title: "Memohon Tambahan Ilmu",
    category: "Doa Ilmu & Karunia",
    arabic: "رَّبِّ زِدْنِي عِلْمًا",
    latin: "Rabbi zidnī 'ilmā.",
    translation_id: "Ya Tuhanku, tambahkanlah kepadaku ilmu.",
    source: "QS Ṭāhā: 114.",
    tags: ["ilmu", "pengetahuan"],
    favorite: false
  },

  // Doa Mustajab
  {
    title: "Doa dengan Ismul A'ẓam (Nama Allah Teragung)",
    category: "Doa Mustajab",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ بِأَنَّ لَكَ الْحَمْدَ، لَا إِلَهَ إِلَّا أَنْتَ، الْمَنَّانُ، بَدِيعُ السَّمَاوَاتِ وَالْأَرْضِ، يَا ذَا الْجَلَالِ وَالْإِكْرَامِ، يَا حَيُّ يَا قَيُّومُ",
    latin: "Allāhumma innī as'aluka bi-anna lakal-ḥamd, lā ilāha illā ant, al-Mannān, badī'us-samāwāti wal-arḍ, yā dzal-jalāli wal-ikrām, yā Ḥayyu yā Qayyūm.",
    translation_id: "Ya Allah, aku memohon kepada-Mu dengan (mengakui) bahwa bagi-Mu segala puji; tiada tuhan selain Engkau, Yang Maha Pemberi Karunia, Pencipta langit dan bumi, wahai Yang memiliki keagungan dan kemuliaan, wahai Yang Mahahidup lagi Maha Berdiri Sendiri.",
    source: "HR Abu Dawud, an-Nasa'i.",
    tags: ["ismul-azam", "mustajab", "nama-allah"],
    favorite: true
  },

  // Doa Pengakuan Dosa Nabi Musa
  {
    title: "Doa Pengakuan Dosa Nabi Musa",
    category: "Doa Pengampunan",
    arabic: "رَبِّ إِنِّي ظَلَمْتُ نَفْسِي فَاغْفِرْ لِي",
    latin: "Rabbi innī ẓalamtu nafsī faghfir lī.",
    translation_id: "Ya Rabbku, sesungguhnya aku telah menzalimi diriku; maka ampunilah aku.",
    source: "QS Al-Qasas: 16.",
    tags: ["pengakuan-dosa", "nabi-musa", "pengampunan"],
    favorite: false
  },

  // Doa Penutup Al-Baqarah
  {
    title: "Doa Penutup Al-Baqarah (Ampunan & Kekuatan)",
    category: "Doa Pengampunan",
    arabic: "آمَنَ الرَّسُولُ بِمَا أُنْزِلَ إِلَيْهِ مِنْ رَبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِنْ رُسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ. لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِنْ قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنْتَ مَوْلَانَا فَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
    latin: "Āmanar-rasūlu bimā unzila ilaihi mir rabbihī wal-mu'minūn, kullun āmana billāhi wa malā'ikatihī wa kutubihī wa rusulih, lā nufarriqu baina aḥadim mir rusulih, wa qālū sami'nā wa aṭa'nā ghufrānaka rabbanā wa ilaikal-maṣīr. Lā yukallifullāhu nafsan illā wus'ahā, lahā mā kasabat wa 'alaihā maktasabat, rabbanā lā tu'ākhidznā in nasīnā au akhṭa'nā, rabbanā wa lā taḥmil 'alainā iṣrang kamā ḥamaltahu 'alallażīna ming qablinā, rabbanā wa lā tuḥammilnā mā lā ṭāqata lanā bih, wa'fu 'annā, waghfir lanā, war-ḥamnā, anta maulānā fanṣurnā 'alal-qaumil-kāfirīn.",
    translation_id: "Rasul (Muhammad) beriman kepada apa yang diturunkan kepadanya (Al-Qur'an) dari Tuhannya, demikian pula orang-orang yang beriman. Semua beriman kepada Allah, malaikat-malaikat-Nya, kitab-kitab-Nya, dan rasul-rasul-Nya. (Mereka berkata), \"Kami tidak membeda-bedakan seorang pun dari rasul-rasul-Nya.\" Dan mereka berkata, \"Kami dengar dan kami taat. Ampunilah kami Ya Tuhan kami, dan kepada-Mu tempat (kami) kembali.\" Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya. Dia mendapat (pahala) dari kebajikan yang dikerjakannya dan dia mendapat (siksa) dari (kejahatan) yang diperbuatnya. (Mereka berdoa), \"Ya Tuhan kami, janganlah Engkau hukum kami jika kami lupa atau kami melakukan kesalahan. Ya Tuhan kami, janganlah Engkau bebani kami dengan beban yang berat sebagaimana Engkau bebankan kepada orang-orang sebelum kami. Ya Tuhan kami, janganlah Engkau pikulkan kepada kami apa yang tidak sanggup kami memikulnya. Maafkanlah kami, ampunilah kami, dan rahmatilah kami. Engkaulah pelindung kami, maka tolonglah kami menghadapi orang-orang kafir.\"",
    source: "QS Al-Baqarah: 285-286.",
    tags: ["al-baqarah", "penutup", "ampunan", "kekuatan"],
    favorite: true
  },

  // Taubat Total & Mohon Amal Saleh
  {
    title: "Taubat Total & Mohon Amal Saleh",
    category: "Doa Pengampunan",
    arabic: "اللَّهُمَّ اغْفِرْ لِي جَمِيعَ مَا مَضَى مِنْ ذُنُوبِي، وَاعْصِمْنِي فِيمَا بَقِيَ مِنْ عُمْرِي، وَارْزُقْنِي عَمَلًا صَالِحًا تَرْضَى بِهِ عَنِّي",
    latin: "Allāhumma ighfir lī jamī'a mā maḍā min dzunūbī, wa'ṣimnī fīmā baqiya min 'umrī, warzuqnī 'amalan ṣāliḥan tarḍā bihī 'annī.",
    translation_id: "Ya Allah, ampunilah seluruh dosa-dosaku yang telah berlalu, jagalah aku pada sisa umurku, dan anugerahkan kepadaku amal saleh yang dengan itu Engkau meridhai diriku.",
    source: "Doa umum (ghairu ma'tsur).",
    tags: ["taubat", "amal-saleh", "pengampunan"],
    favorite: false
  },

  // Meneguhkan Hati di Atas Hidayah
  {
    title: "Meneguhkan Hati di Atas Hidayah",
    category: "Doa Iman & Akhlak",
    arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ",
    latin: "Rabbanā lā tuzigh qulūbanā ba'da idh hadaytanā wahab lanā min ladunka raḥmah, innaka antal-Wahhāb.",
    translation_id: "Ya Tuhan kami, janganlah Engkau palingkan hati kami setelah Engkau beri petunjuk, dan karuniakan kepada kami rahmat dari sisi-Mu. Sungguh Engkaulah Maha Pemberi.",
    source: "QS Ali 'Imran: 8.",
    tags: ["hidayah", "ketetapan-hati", "iman"],
    favorite: false
  },

  // Memohon Jiwa yang Bertakwa dan Disucikan
  {
    title: "Memohon Jiwa yang Bertakwa dan Disucikan",
    category: "Doa Iman & Akhlak",
    arabic: "اللَّهُمَّ آتِ نَفْسِي تَقْوَاهَا، وَزَكِّهَا أَنْتَ خَيْرُ مَنْ زَكَّاهَا، أَنْتَ وَلِيُّهَا وَمَوْلَاهَا",
    latin: "Allāhumma āti nafsī taqwāhā, wa zakkihā anta khayru man zakkāhā, anta waliyyuhā wa mawlāhā.",
    translation_id: "Ya Allah, berikanlah pada jiwaku ketakwaannya dan sucikanlah ia, Engkaulah sebaik-baik yang menyucikannya; Engkaulah pelindung dan penolongnya.",
    source: "HR Muslim.",
    tags: ["takwa", "jiwa", "tazkiyah"],
    favorite: false
  },

  // Agar Hati Menyatu dengan Al-Qur'an
  {
    title: "Agar Hati Menyatu dengan Al-Qur'an",
    category: "Doa Iman & Akhlak",
    arabic: "اللَّهُمَّ اجْعَلِ الْقُرْآنَ رَبِيعَ قَلْبِي، وَنُورَ صَدْرِي، وَجَلَاءَ حُزْنِي، وَذَهَابَ هَمِّي",
    latin: "Allāhummaj'alil-Qur'āna rabī'a qalbī, wa nūra ṣadrī, wa jalā'a ḥuznī, wa żahāba hammī.",
    translation_id: "Ya Allah, jadikanlah Al-Qur'an sebagai musim semi hatiku, cahaya dadaku, penghapus kesedihanku, dan pelenyap kegundahanku.",
    source: "HR Aḥmad (sahih).",
    tags: ["quran", "hati", "ketenangan"],
    favorite: false
  },

  // Pereda Amarah
  {
    title: "Pereda Amarah",
    category: "Doa Iman & Akhlak",
    arabic: "اللَّهُمَّ اغْفِرْ لِي ذَنْبِي، وَأَذْهِبْ غَيْظَ قَلْبِي، وَأَجِرْنِي مِنَ الشَّيْطَانِ",
    latin: "Allāhummaghfir lī dzanbī, wa adhhib ghaizha qalbī, wa ajirnī minasy-syayṭān.",
    translation_id: "Ya Allah, ampunilah dosaku, lenyapkanlah amarah di hatiku, dan lindungilah aku dari setan.",
    source: "Doa umum, makna sesuai sunnah.",
    tags: ["amarah", "sabar", "akhlak"],
    favorite: false
  },

  // Doa Membersihkan Hati dari Dengki
  {
    title: "Doa Membersihkan Hati dari Dengki",
    category: "Doa Iman & Akhlak",
    arabic: "رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ وَلَا تَجْعَلْ فِي قُلُوبِنَا غِلًّا لِلَّذِينَ آمَنُوا رَبَّنَا إِنَّكَ رَءُوفٌ رَحِيمٌ",
    latin: "Rabbanaghfir lanā wa li-ikhwāninalladzīna sabaqūnā bil-īmān, wa lā taj'al fī qulūbinā ghillal lilladzīna āmanū, rabbanā innaka ra'ūfur raḥīm.",
    translation_id: "Ya Tuhan kami, ampunilah kami dan saudara-saudara kami yang telah lebih dahulu beriman, dan janganlah Engkau jadikan dalam hati kami kedengkian terhadap orang-orang beriman. Ya Tuhan kami, sungguh Engkau Maha Penyantun, Maha Penyayang.",
    source: "QS Al-Hasyr: 10.",
    tags: ["dengki", "persaudaraan", "akhlak"],
    favorite: false
  },

  // Doa Memohon Keturunan Saleh (Nabi Ibrahim)
  {
    title: "Doa Memohon Keturunan Saleh (Nabi Ibrahim)",
    category: "Doa Keluarga",
    arabic: "رَبِّ هَبْ لِي مِنَ الصَّالِحِينَ",
    latin: "Rabbi hab lī minaṣ-ṣāliḥīn.",
    translation_id: "Ya Tuhanku, anugerahkanlah kepadaku (keturunan) yang termasuk orang-orang saleh.",
    source: "QS aṣ-Ṣāffāt:100.",
    tags: ["keturunan", "nabi-ibrahim", "saleh"],
    favorite: false
  },

  // Doa Memohon Keturunan (Nabi Zakaria)
  {
    title: "Doa Memohon Keturunan (Nabi Zakaria)",
    category: "Doa Keluarga",
    arabic: "رَبِّ لَا تَذَرْنِي فَرْدًا وَأَنْتَ خَيْرُ الْوَارِثِينَ",
    latin: "Rabbi lā tażarnī fardaw wa anta khairul-wāriṡīn.",
    translation_id: "Ya Tuhanku, janganlah Engkau membiarkan aku hidup seorang diri, dan Engkaulah Waris Yang Paling Baik.",
    source: "QS Al-Anbiya': 89.",
    tags: ["keturunan", "nabi-zakaria", "kesepian"],
    favorite: false
  },

  // Agar Diri & Keturunan Rajin Shalat
  {
    title: "Agar Diri & Keturunan Rajin Shalat",
    category: "Doa Keluarga",
    arabic: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي ۚ رَبَّنَا وَتَقَبَّلْ دُعَاءِ",
    latin: "Rabbij'alnī muqīmaṣ-ṣalāti wa min żurriyyatī; rabbanā wa taqabbal du'ā'.",
    translation_id: "Ya Tuhanku, jadikanlah aku orang yang menegakkan shalat, dan (juga) dari keturunanku; ya Tuhan kami, perkenankanlah doaku.",
    source: "QS Ibrāhīm:40.",
    tags: ["shalat", "keturunan", "istiqamah"],
    favorite: false
  },

  // Perlindungan untuk Anak
  {
    title: "Perlindungan untuk Anak",
    category: "Doa Keluarga",
    arabic: "أُعِيذُكُمَا بِكَلِمَاتِ اللَّهِ التَّامَّةِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ",
    latin: "U'īdhukumā bikalimātillāhi at-tāmmati min kulli syaiṭānin wa hāmmatin wa min kulli 'aynin lāmmah.",
    translation_id: "Aku memohonkan perlindungan bagi kalian berdua dengan kalimat-kalimat Allah yang sempurna dari setiap setan, binatang berbahaya, dan pandangan mata yang buruk.",
    source: "HR Bukhari.",
    tags: ["perlindungan", "anak", "ruqyah"],
    favorite: false
  },

  // Doa Umum untuk Kaum Beriman
  {
    title: "Doa Umum untuk Kaum Beriman",
    category: "Doa Keluarga",
    arabic: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِمَنْ دَخَلَ بَيْتِيَ مُؤْمِنًا وَلِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ وَلَا تَزِدِ الظَّالِمِينَ إِلَّا تَبَارًا",
    latin: "Rabbighfir lī wa liwālidayya wa liman dakhala baitiya mu'minaw wa lil-mu'minīna wal-mu'mināt, wa lā tazidiẓ-ẓālimīna illā tabārā.",
    translation_id: "Ya Tuhanku, ampunilah aku, kedua orang tuaku, orang yang masuk ke rumahku sebagai orang beriman, serta semua orang mukmin laki-laki dan perempuan, dan janganlah Engkau tambahkan bagi orang-orang zalim selain kebinasaan.",
    source: "QS Nuh: 28.",
    tags: ["umat", "ampunan", "solidaritas"],
    favorite: false
  },

  // Doa Pelunas Utang & Pencukup Rezeki
  {
    title: "Doa Pelunas Utang & Pencukup Rezeki",
    category: "Doa Hajat Dunia",
    arabic: "اللَّهُمَّ رَبَّ السَّمَاوَاتِ السَّبْعِ وَرَبَّ الْعَرْشِ الْعَظِيمِ، رَبَّنَا وَرَبَّ كُلِّ شَيْءٍ، فَالِقَ الْحَبِّ وَالنَّوَى، وَمُنْزِلَ التَّوْرَاةِ وَالْإِنْجِيلِ وَالْفُرْقَانِ، أَعُوذُ بِكَ مِنْ شَرِّ كُلِّ شَيْءٍ أَنْتَ آخِذٌ بِنَاصِيَتِهِ. اللَّهُمَّ أَنْتَ الْأَوَّلُ فَلَيْسَ قَبْلَكَ شَيْءٌ، وَأَنْتَ الْآخِرُ فَلَيْسَ بَعْدَكَ شَيْءٌ، وَأَنْتَ الظَّاهِرُ فَلَيْسَ فَوْقَكَ شَيْءٌ، وَأَنْتَ الْبَاطِنُ فَلَيْسَ دُونَكَ شَيْءٌ، اقْضِ عَنَّا الدَّيْنَ وَأَغْنِنَا مِنَ الْفَقْرِ",
    latin: "Allāhumma rabbas-samāwātis-sab'i wa rabbal-'arsyil-'aẓīm, rabbanā wa rabba kulli syay', fāliqal-ḥabbi wan-nawā, wa munzilat-tawrāti wal-injīli wal-furqān, a'ūdzu bika min syarri kulli syay'in anta ākhidzum bināṣiyatih. Allāhumma antal-awwalu falaysa qablaka syay', wa antal-ākhiru falaysa ba'daka syay', wa antaẓ-ẓāhiru falaysa fauqaka syay', wa antal-bāṭinu falaysa dūnaka syay', iqḍi 'annad-dayna wa aghninā minal-faqr.",
    translation_id: "Ya Allah, Tuhan tujuh langit dan Rabb 'Arsy yang agung, Rabb kami dan Rabb segala sesuatu, Pembelah biji dan benih, Penurun Taurat, Injil, dan Furqan. Aku berlindung kepada-Mu dari kejahatan segala sesuatu yang Engkau pegang ubun-ubunnya. Ya Allah, Engkaulah Yang Awal, tiada sesuatu sebelum-Mu. Engkaulah Yang Akhir, tiada sesuatu setelah-Mu. Engkaulah Yang Zhahir, tiada sesuatu di atas-Mu. Engkaulah Yang Batin, tiada sesuatu di bawah-Mu. Lunasilah utang kami dan cukupkan kami dari kefakiran.",
    source: "HR Muslim.",
    tags: ["utang", "rezeki", "kecukupan"],
    favorite: true
  },

  // Doa Memohon Kemudahan Urusan (Umum)
  {
    title: "Doa Memohon Kemudahan Urusan (Umum)",
    category: "Doa Hajat Dunia",
    arabic: "اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا",
    latin: "Allāhumma lā sahla illā mā ja'altahū sahlā, wa anta taj'alul-ḥazna idzā syi'ta sahlā.",
    translation_id: "Ya Allah, tiada kemudahan kecuali apa yang Engkau jadikan mudah; dan Engkau menjadikan kesulitan, jika Engkau kehendaki, menjadi mudah.",
    source: "HR Ibnu Ḥibbān (hasan).",
    tags: ["kemudahan", "urusan", "kesulitan"],
    favorite: false
  },

  // Doa Nabi Musa (Kelapangan & Kemudahan Komunikasi)
  {
    title: "Doa Nabi Musa (Kelapangan & Kemudahan Komunikasi)",
    category: "Doa Hajat Dunia",
    arabic: "رَبِّ اشْرَحْ لِي صَدْرِي، وَيَسِّرْ لِي أَمْرِي، وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي، يَفْقَهُوا قَوْلِي",
    latin: "Rabbisyraḥ lī ṣadrī, wa yassir lī amrī, waḥlul 'uqdatan min lisānī, yafqahū qawlī.",
    translation_id: "Ya Tuhanku, lapangkanlah dadaku, mudahkanlah urusanku, dan lepaskanlah kekakuan dari lidahku agar mereka memahami perkataanku.",
    source: "QS Ṭāhā: 25–28.",
    tags: ["kelapangan", "komunikasi", "nabi-musa"],
    favorite: false
  },

  // Doa Ashabul Kahfi (Memohon Rahmat & Petunjuk)
  {
    title: "Doa Ashabul Kahfi (Memohon Rahmat & Petunjuk)",
    category: "Doa Hajat Dunia",
    arabic: "رَبَّنَا آتِنَا مِنْ لَدُنْكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا",
    latin: "Rabbanā ātinā mil ladunka raḥmah, wa hayyi' lanā min amrinā rasyadā.",
    translation_id: "Ya Tuhan kami, anugerahkanlah kepada kami rahmat dari sisi-Mu dan berilah kemudahan yang lurus bagi urusan kami.",
    source: "QS Al-Kahfi: 10.",
    tags: ["rahmat", "petunjuk", "ashabul-kahfi"],
    favorite: false
  },

  // Doa Tawakal (Merasa Cukup dengan Allah)
  {
    title: "Doa Tawakal (Merasa Cukup dengan Allah)",
    category: "Doa Hajat Dunia",
    arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ. \n\nحَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ ۖ عَلَيْهِ تَوَكَّلْتُ ۖ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    latin: "Ḥasbunallāhu wa ni'mal-wakīl. Hasbiyallāhu lā ilāha illā huwa, 'alaihi tawakkaltu wa huwa rabbul-'arsyil-'aẓīm.",
    translation_id: "Cukuplah Allah bagi kami, dan Dia sebaik-baik Pelindung. Cukuplah Allah bagiku; tidak ada tuhan selain Dia. Hanya kepada-Nya aku bertawakal dan Dia adalah Tuhan yang memiliki 'Arsy yang agung.",
    source: "QS Āli 'Imrān:173 & QS At-Taubah:129.",
    tags: ["tawakal", "cukup", "pelindung"],
    favorite: true
  },

  // Perlindungan dari Ilmu Tak Bermanfaat & Hati Tak Khusyuk
  {
    title: "Perlindungan dari Ilmu Tak Bermanfaat & Hati Tak Khusyuk",
    category: "Doa Perlindungan",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عِلْمٍ لَا يَنْفَعُ، وَمِنْ قَلْبٍ لَا يَخْشَعُ، وَمِنْ نَفْسٍ لَا تَشْبَعُ، وَمِنْ دَعْوَةٍ لَا يُسْتَجَابُ لَهَا",
    latin: "Allāhumma innī a'ūdzu bika min 'ilmin lā yanfa', wa min qalbin lā yakhsha', wa min nafsin lā tasyba', wa min da'watin lā yustajābu lahā.",
    translation_id: "Ya Allah, aku berlindung kepada-Mu dari ilmu yang tidak bermanfaat, dari hati yang tidak khusyuk, dari jiwa yang tidak pernah puas, dan dari doa yang tidak dikabulkan.",
    source: "HR Muslim.",
    tags: ["perlindungan", "ilmu", "khusyuk"],
    favorite: true
  },

  // Perlindungan dari Kemiskinan, Kehinaan & Kezaliman
  {
    title: "Perlindungan dari Kemiskinan, Kehinaan & Kezaliman",
    category: "Doa Perlindungan",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْفَقْرِ وَالْقِلَّةِ وَالذِّلَّةِ، وَأَعُوذُ بِكَ مِنْ أَنْ أَظْلِمَ أَوْ أُظْلَمَ",
    latin: "Allāhumma innī a'ūdzu bika minal-faqri wal-qillati wadz-dzillah, wa a'ūdzu bika min an aẓlima aw uẓlam.",
    translation_id: "Ya Allah, aku berlindung kepada-Mu dari kefakiran, kekurangan, dan kehinaan; serta dari menzalimi atau dizalimi.",
    source: "HR Abu Dawud (hasan).",
    tags: ["perlindungan", "kemiskinan", "kezaliman"],
    favorite: false
  },

  // Perlindungan dari Bencana & Wabah
  {
    title: "Perlindungan dari Bencana & Wabah",
    category: "Doa Perlindungan",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْبَرَصِ، وَالْجُنُونِ، وَالْجُذَامِ، وَمِنْ سَيِّئِ الْأَسْقَامِ",
    latin: "Allāhumma innī a'ūdzu bika minal-baraṣ, wal-junūn, wal-jużām, wa min sayyi'il-asqām.",
    translation_id: "Ya Allah, aku berlindung kepada-Mu dari penyakit belang, gila, kusta, dan dari penyakit-penyakit yang buruk.",
    source: "HR Abu Dawud (hasan).",
    tags: ["perlindungan", "bencana", "wabah"],
    favorite: false
  },

  // Doa Nabi Ayyub Saat Kesusahan & Sakit
  {
    title: "Doa Nabi Ayyub Saat Kesusahan & Sakit",
    category: "Doa Kesehatan",
    arabic: "أَنِّي مَسَّنِيَ الضُّرُّ وَأَنْتَ أَرْحَمُ الرَّاحِمِينَ",
    latin: "Annī massaniyaḍ-ḍurru wa anta ar-ḥamur-rāḥimīn.",
    translation_id: "Sesungguhnya aku telah ditimpa kesusahan, dan Engkaulah Yang Maha Penyayang di antara para penyayang.",
    source: "QS al-Anbiyā':83.",
    tags: ["kesusahan", "sakit", "nabi-ayyub"],
    favorite: false
  },

  // Memohon Pekerjaan Terbaik
  {
    title: "Memohon Pekerjaan Terbaik",
    category: "Doa Hajat Dunia",
    arabic: "اللَّهُمَّ ارْزُقْنِي عَمَلًا صَالِحًا مُبَارَكًا قَرِيبًا مِنْ مَسْقَطِ رَأْسِي، تَكْفِينِي بِهِ حَاجَاتِ أَهْلِي وَتُقَوِّي بِهِ دِينِي",
    latin: "Allāhummarzuqnī 'amalan ṣāliḥan mubārakan qarīban min masqaṭi ra'sī, takfīnī bihī ḥājāti ahli, wa tuqawwī bihī dīnī.",
    translation_id: "Ya Allah, karuniakan kepadaku pekerjaan yang saleh lagi berkah, yang dekat dari tempat tinggalku; dengannya cukupilah kebutuhan keluargaku dan kuatkanlah agamaku.",
    source: "Doa umum (ghairu ma'tsur).",
    tags: ["pekerjaan", "rezeki", "berkah"],
    favorite: false
  },

  // Memohon Kelapangan Rezeki (Target Spesifik)
  {
    title: "Memohon Kelapangan Rezeki (Target Spesifik)",
    category: "Doa Hajat Dunia",
    arabic: "اللَّهُمَّ يَا رَزَّاقُ يَا فَتَّاحُ، ارْزُقْنِي رِزْقًا وَاسِعًا حَلَالًا طَيِّبًا مُبَارَكًا فِيهِ، وَاجْعَلْ مَالِي يَبْلُغُ مِلْيَارَهُ الْأَوَّلَ وَمَا بَعْدَهُ، وَاجْعَلْهُ عَوْنًا لِي عَلَى طَاعَتِكَ وَسَبِيلًا لِنَيْلِ رِضَاكَ",
    latin: "Allāhumma yā Razzāq, yā Fattāḥ, urzuqnī rizqan wāsi'an ḥalālan ṭayyiban mubārakan fīh, waj'al mālī yablughu milyārahu al-awwala wa mā ba'dah, waj'alhu 'awnan lī 'alā ṭā'atika wa sabīlan linayli riḍāk.",
    translation_id: "Ya Allah, wahai Yang Maha Pemberi Rezeki, wahai Yang Maha Membuka, berilah aku rezeki yang luas, halal, baik, dan diberkahi. Jadikan hartaku mencapai satu miliar pertamanya dan sesudahnya, dan jadikan harta itu penolong bagiku untuk taat kepada-Mu dan jalan meraih ridha-Mu.",
    source: "Doa umum (ghairu ma'tsur).",
    tags: ["rezeki", "target", "halal"],
    favorite: false
  },

  // Kekayaan & Keberkahan (Doa untuk Anas r.a.)
  {
    title: "Kekayaan & Keberkahan (Doa untuk Anas r.a.)",
    category: "Doa Hajat Dunia",
    arabic: "اللَّهُمَّ أَكْثِرْ مَالِي وَوَلَدِي، وَبَارِكْ لِي فِيمَا أَعْطَيْتَنِي، وَأَطِلْ حَيَاتِي عَلَى طَاعَتِكَ، وَأَحْسِنْ عَمَلِي وَاغْفِرْ لِي",
    latin: "Allāhumma akṡir mālī wa waladī, wa bārik lī fīmā a'ṭaitanī, wa aṭil ḥayātī 'alā ṭā'atik, wa aḥsin 'amalī, waghfir lī.",
    translation_id: "Ya Allah, perbanyaklah hartaku dan anakku, dan berkahilah bagiku pada apa yang Engkau berikan; panjangkanlah hidupku dalam ketaatan kepada-Mu; perbaikilah amal perbuatanku; dan ampunilah aku.",
    source: "Inti doa dari HR Bukhari & Muslim.",
    tags: ["kekayaan", "keberkahan", "anas"],
    favorite: false
  },

  // Agar Diri Sifat Qanā'ah (Merasa Cukup)
  {
    title: "Agar Diri Sifat Qanā'ah (Merasa Cukup)",
    category: "Doa Hajat Dunia",
    arabic: "اللَّهُمَّ قَنِّعْنِي بِمَا رَزَقْتَنِي، وَبَارِكْ لِي فِيهِ، وَاخْلُفْ عَلَى كُلِّ غَائِبَةٍ لِي بِخَيْرٍ",
    latin: "Allāhumma qanni'nī bimā razaqtanī, wa bārik lī fīh, wakhluf 'alā kulli ghā'ibatin lī bikhayr.",
    translation_id: "Ya Allah, jadikan aku merasa cukup dengan apa yang Engkau rezekikan kepadaku; berkahilah itu bagiku; dan gantilah setiap yang luput dariku dengan yang lebih baik.",
    source: "HR al-Ḥākim (hasan).",
    tags: ["qanaah", "cukup", "berkah"],
    favorite: false
  },

  // Memohon Karunia Allah
  {
    title: "Memohon Karunia Allah",
    category: "Doa Ilmu & Karunia",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
    latin: "Allāhumma innī as'aluka min faḍlik.",
    translation_id: "Ya Allah, aku memohon kepada-Mu dari karunia-Mu.",
    source: "HR Muslim.",
    tags: ["karunia", "fadhl", "rahmat"],
    favorite: false
  },

  // Memohon Rahmat yang Luas
  {
    title: "Memohon Rahmat yang Luas",
    category: "Doa Ilmu & Karunia",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ رَحْمَتَكَ الَّتِي وَسِعَتْ كُلَّ شَيْءٍ",
    latin: "Allāhumma innī as'aluka raḥmatakallatī wasi'at kulla syay'.",
    translation_id: "Ya Allah, aku memohon kepada-Mu rahmat-Mu yang telah meliputi segala sesuatu.",
    source: "Riwayat doa qiyamul-lail (hasan).",
    tags: ["rahmat", "luas", "semesta"],
    favorite: false
  },

  // Memohon Husnul Khātimah
  {
    title: "Memohon Husnul Khātimah",
    category: "Doa Keselamatan Akhirat",
    arabic: "اللَّهُمَّ اجْعَلْ خَيْرَ عُمْرِي آخِرَهُ، وَخَيْرَ عَمَلِي خَوَاتِمَهُ، وَخَيْرَ أَيَّامِي يَوْمَ أَلْقَاكَ فِيهِ",
    latin: "Allāhummaj'al khayra 'umrī ākhirah, wa khayra 'amalī khawātimah, wa khayra ayyāmī yauma alqāka fīh.",
    translation_id: "Ya Allah, jadikanlah sebaik-baik umurku adalah pengujungnya, sebaik-baik amal perbuatanku adalah penutupnya, dan sebaik-baik hariku adalah hari ketika aku berjumpa dengan-Mu.",
    source: "Doa ma'tsur.",
    tags: ["husnul-khatimah", "akhir-hidup", "baik"],
    favorite: true
  },

  // Memohon Surga Firdaus Tanpa Hisab
  {
    title: "Memohon Surga Firdaus Tanpa Hisab",
    category: "Doa Keselamatan Akhirat",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْفِرْدَوْسَ الْأَعْلَى مِنَ الْجَنَّةِ بِغَيْرِ حِسَابٍ وَلَا سَابِقَةِ عَذَابٍ",
    latin: "Allāhumma innī as'alukal-firdausal-a'lā minal-jannah, bi-ghayri ḥisābin wa lā sābiqata 'adzāb.",
    translation_id: "Ya Allah, aku memohon kepada-Mu Surga Firdaus yang tertinggi, tanpa hisab dan tanpa didahului azab.",
    source: "Doa umum (makna dari HR Bukhari).",
    tags: ["firdaus", "surga", "tanpa-hisab"],
    favorite: true
  },

  // Penguat Keyakinan (Kun Fayakūn)
  {
    title: "Ayat Penguat Keyakinan (Kun Fayakūn)",
    category: "Doa Mustajab",
    arabic: "إِنَّمَا أَمْرُهُ إِذَا أَرَادَ شَيْئًا أَنْ يَقُولَ لَهُ كُنْ فَيَكُونُ",
    latin: "Innamā amruhū iżā arāda syai'an an yaqūla lahū kun fa yakūn.",
    translation_id: "Sesungguhnya urusan-Nya, apabila Dia menghendaki sesuatu, hanyalah berkata kepadanya: Jadilah! maka jadilah ia.",
    source: "QS Yā-Sīn: 82.",
    tags: ["keyakinan", "kun-fayakun", "kekuasaan-allah"],
    favorite: false
  },

  // Doa Agar Amalan Diterima
  {
    title: "Doa Agar Amalan Diterima",
    category: "Pembukaan & Penutup Doa",
    arabic: "رَبَّنَا تَقَبَّلْ مِنَّا ۖ إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ. وَتُبْ عَلَيْنَا ۖ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ",
    latin: "Rabbanā taqabbal minnā, innaka antas-samī'ul-'alīm. Wa tub 'alainā, innaka antat-tawwābur-raḥīm.",
    translation_id: "Ya Tuhan kami, terimalah dari kami (amal ini). Sungguh, Engkaulah Yang Maha Mendengar, Maha Mengetahui. Dan terimalah tobat kami, sungguh Engkaulah Maha Penerima Tobat, Maha Penyayang.",
    source: "QS al-Baqarah:127-128.",
    tags: ["amalan", "diterima", "taubat"],
    favorite: false
  },

  // Pujian Penutup & Salam untuk Para Rasul
  {
    title: "Pujian Penutup & Salam untuk Para Rasul",
    category: "Pembukaan & Penutup Doa",
    arabic: "سُبْحَانَ رَبِّكَ رَبِّ الْعِزَّةِ عَمَّا يَصِفُونَ • وَسَلَامٌ عَلَى الْمُرْسَلِينَ • وَالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    latin: "Subḥāna rabbika rabbil-'izzati 'ammā yaṣifūn. Wa salāmun 'alal-mursalīn. Wal-ḥamdu lillāhi rabbil-'ālamīn.",
    translation_id: "Mahasuci Tuhanmu, Tuhan Yang Mahaperkasa, dari apa yang mereka sifatkan. Dan kesejahteraan atas para rasul. Dan segala puji bagi Allah, Tuhan seluruh alam.",
    source: "QS As-Ṣaffāt:180–182.",
    tags: ["pujian", "penutup", "rasul"],
    favorite: false
  },

  // Kaffaratul Majlis (Penutup Doa & Majelis)
  {
    title: "Kaffaratul Majlis (Penutup Doa & Majelis)",
    category: "Pembukaan & Penutup Doa",
    arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ",
    latin: "Subḥānaka Allāhumma wa biḥamdika, asyhadu an lā ilāha illā anta, astaghfiruka wa atūbu ilaik.",
    translation_id: "Mahasuci Engkau ya Allah, dan dengan memuji-Mu. Aku bersaksi tiada tuhan selain Engkau. Aku memohon ampun kepada-Mu dan bertobat kepada-Mu.",
    source: "HR Tirmidzi (hasan sahih).",
    tags: ["kaffaratul-majlis", "penutup", "majelis"],
    favorite: true
  },

  // Doa Nabi Sulaiman (Syukur atas Nikmat & Amal Saleh)
  {
    title: "Doa Nabi Sulaiman (Syukur atas Nikmat & Amal Saleh)",
    category: "Doa Ilmu & Karunia",
    arabic: "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَىٰ وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ وَأَدْخِلْنِي بِرَحْمَتِكَ فِي عِبَادِكَ الصَّالِحِينَ",
    latin: "Rabbi awzi'nī an asykura ni'matakallatī an'amta 'alayya wa 'alā wālidayya wa an a'mala ṣāliḥan tarḍāhu wa adkhilnī biraḥmatika fī 'ibādikaṣ-ṣāliḥīn.",
    translation_id: "Ya Tuhanku, ilhamkanlah aku untuk mensyukuri nikmat-Mu yang telah Engkau anugerahkan kepadaku dan kepada kedua orang tuaku dan untuk mengerjakan amal saleh yang Engkau ridhai; dan masukkanlah aku dengan rahmat-Mu ke dalam golongan hamba-hamba-Mu yang saleh.",
    source: "QS An-Naml: 19.",
    tags: ["nabi-sulaiman", "syukur", "nikmat", "amal-saleh"],
    favorite: false
  }
];

/**
 * Categories available in the prayer collection
 */
export const categories = [
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
  "Doa Mustajab"
];

/**
 * Common tags used in prayers
 */
export const commonTags = [
  "istighfar", "zikir", "perlindungan", "shalawat", "pengampunan",
  "keluarga", "rezeki", "ilmu", "kesehatan", "akhirat",
  "hidayah", "takwa", "iman", "taubat", "dunia"
];