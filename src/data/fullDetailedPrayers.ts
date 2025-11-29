import { Item } from '@/types';

/**
 * Dataset doa yang sudah direorganisasi dengan detail lengkap
 * Versi panjang dan sangat detail, tidak disingkat
 */
export const fullDetailedPrayerData: Partial<Item>[] = [
  // === DOA UTAMA 1-11 ===
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
    title: "Tasbih, Tahmid, Takbir & Tahlil Setelah Shalat",
    category: "Zikir Setelah Shalat",
    kaidah: "Zikir ringan berpahala besar setelah shalat fardhu. Dosa diampuni walaupun sebanyak buih di lautan.",
    arabic: "سُبْحَانَ اللَّهِ (٣٣x)\nاَلْحَمْدُ لِلَّهِ (٣٣x)\nاللَّهُ أَكْبَرُ (٣٣x)\n\nلَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    latin: "Subḥānallāh (33x)\nAlḥamdulillāh (33x)\nAllāhu Akbar (33x)\n\nLā ilāha illallāhu waḥdahū lā syarīka lah, lahul-mulku wa lahul-ḥamdu, wa huwa 'alā kulli syay'in qadīr (1x).",
    translation_id: "Mahasuci Allah (33x), segala puji bagi Allah (33x), Allah Mahabesar (33x). Tiada sesembahan selain Allah Yang Esa, tiada sekutu bagi-Nya. Milik-Nya kerajaan dan pujian, dan Dia Mahakuasa atas segala sesuatu.",
    source: "HR Muslim.",
    tags: ["tasbih", "tahmid", "takbir", "tahlil", "zikir", "hitungan"],
    favorite: true
  },
  {
    id: "3",
    title: "Ayat Kursi (Setelah Shalat & Sebelum Tidur)",
    category: "Zikir Setelah Shalat",
    kaidah: "Dibaca 1x setelah shalat fardhu (jaminan surga) dan 1x sebelum tidur (dijaga malaikat).",
    arabic: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    latin: "Allāhu lā ilāha illā huwal-ḥayyul-qayyūm, lā ta'khudzuhu sinatun wa lā nawm, lahu mā fis-samāwāti wa mā fil-arḍ, man dzal-ladzī yasyfa'u 'indahū illā bi-idznih, ya'lamu mā baina aydīhim wa mā khalfahum, wa lā yuḥīṭūna bisyay'in min 'ilmihī illā bimā syā', wasi'a kursiyyuhus-samāwāti wal-arḍ, wa lā ya'ūduhū ḥifẓuhumā, wa huwal-'aliyyul-'aẓīm.",
    translation_id: "Allah, tiada tuhan selain Dia, Yang Mahahidup, Yang terus-menerus mengurus (makhluk-Nya). Tidak mengantuk dan tidak tidur. Milik-Nya apa yang di langit dan di bumi. Siapa yang dapat memberi syafaat di sisi-Nya tanpa izin-Nya? Dia mengetahui apa yang di hadapan mereka dan di belakang mereka, dan mereka tidak mengetahui sesuatu pun dari ilmu-Nya kecuali apa yang Dia kehendaki. Kursi-Nya meliputi langit dan bumi, dan Dia tidak merasa berat memelihara keduanya. Dia Mahatinggi lagi Mahabesar.",
    source: "QS Al-Baqarah: 255, HR Nasa'i, HR Bukhari.",
    tags: ["ayat-kursi", "zikir", "perlindungan", "hitungan"],
    favorite: true
  },
  {
    id: "4",
    title: "Al-Mu'awwidzāt (3 Qul)",
    category: "Doa Perlindungan",
    kaidah: "Dibaca 3x pagi, 3x petang, dan 3x sebelum tidur untuk perlindungan dari segala kejahatan.",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ.\n\nبِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِنْ شَرِّ مَا خَلَقَ ۝ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ.\n\nبِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَهِ النَّاسِ ۝ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ.",
    latin: "Bismillāhir-raḥmānir-raḥīm. Qul huwallāhu aḥad, allāhuṣ-ṣamad, lam yalid wa lam yūlad, wa lam yakun lahu kufuwan aḥad.\n\nBismillāhir-raḥmānir-raḥīm. Qul a'ūdzu birabbil-falaq, min syarri mā khalaq, wa min syarri ghāsiqin idzā waqab, wa min syarrin-naffāṯāti fil-'uqad, wa min syarri ḥāsidin idzā ḥasad.\n\nBismillāhir-raḥmānir-raḥīm. Qul a'ūdzu birabbin-nās, malikin-nās, ilāhin-nās, min syarril-waswāsil-khannās, allażī yuwaswisu fī ṣudūrin-nās, minal-jinnati wan-nās.",
    translation_id: "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang. Katakanlah: Dialah Allah Yang Maha Esa... (Al-Ikhlas)\n\nDengan nama Allah Yang Maha Pengasih lagi Maha Penyayang. Katakanlah: Aku berlindung kepada Tuhan yang menguasai subuh... (Al-Falaq)\n\nDengan nama Allah Yang Maha Pengasih lagi Maha Penyayang. Katakanlah: Aku berlindung kepada Tuhan manusia... (An-Nas)",
    source: "HR Abu Dawud, Tirmidzi, Nasa'i.",
    tags: ["muawwidzat", "perlindungan", "al-ikhlas", "al-falaq", "an-nas", "hitungan"],
    favorite: true
  },
  {
    id: "5",
    title: "Sayyidul Istighfar (Raja Istighfar)",
    category: "Doa Pengampunan",
    kaidah: "Dibaca 1x pagi & 1x petang. Siapa yang membacanya dengan yakin lalu mati, maka ia masuk surga.",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي، فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    latin: "Allāhumma anta rabbī, lā ilāha illā anta, khalaqtanī wa anā 'abduka, wa anā 'alā 'ahdika wa wa'dika mastāṭa't, a'ūdzu bika min syarri mā ṣana't, abū'u laka bini'matika 'alayya, wa abū'u laka bi dzanbī, faghfir lī, fa innahu lā yaghfiru dz-dzunūba illā ant.",
    translation_id: "Ya Allah, Engkau Tuhanku; tiada sesembahan selain Engkau. Engkau telah menciptakanku dan aku adalah hamba-Mu. Aku berada di atas perjanjian dan janji-Mu semampuku. Aku berlindung kepada-Mu dari keburukan yang aku perbuat. Aku mengakui nikmat-Mu atasku, dan aku mengakui dosaku; maka ampunilah aku, karena sungguh tidak ada yang mengampuni dosa kecuali Engkau.",
    source: "HR Bukhari.",
    tags: ["sayyidul-istighfar", "pengampunan", "istighfar-terbaik", "pagi-petang", "hitungan"],
    favorite: true
  },
  {
    id: "6",
    title: "Doa dengan Ismul A'ẓam (Nama Allah Teragung)",
    category: "Doa Mustajab",
    kaidah: "Dua redaksi doa yang disebut dalam hadis mengandung Ismul A'ẓam, yang jika berdoa dengannya akan dikabulkan.",
    arabic: "النَّصُّ ١:\nاللَّهُمَّ إِنِّي أَسْأَلُكَ بِأَنَّ لَكَ الْحَمْدَ، لَا إِلَهَ إِلَّا أَنْتَ، الْمَنَّانُ، بَدِيعُ السَّمَاوَاتِ وَالْأَرْضِ، يَا ذَا الْجَلَالِ وَالْإِكْرَامِ، يَا حَيُّ يَا قَيُّومُ.\n\nالنَّصُّ ٢:\nاللَّهُمَّ إِنِّي أَسْأَلُكَ بِأَنِّي أَشْهَدُ أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ، الْأَحَدُ الصَّمَدُ، الَّذي لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ.",
    latin: "Redaksi 1: Allāhumma innī as'aluka bi-anna lakal-ḥamd, lā ilāha illā ant, al-Mannān, badī'us-samāwāti wal-arḍ, yā dzal-jalāli wal-ikrām, yā Ḥayyu yā Qayyūm.\nRedaksi 2: Allāhumma innī as'aluka bi-annī asyhadu annaka Antallāh, lā ilāha illā anta, al-Aḥaduṣ-Ṣamad, alladzī lam yalid wa lam yūlad, wa lam yakun lahu kufuwan aḥad.",
    translation_id: "Redaksi 1: \"Ya Allah, aku memohon kepada-Mu karena Engkaulah yang berhak atas segala pujian; tiada sesembahan selain Engkau; Engkaulah al-Mannān, Pencipta langit dan bumi; wahai Dzat yang memiliki keagungan dan kemuliaan, wahai Yang Mahahidup, wahai Yang Maha Berdiri sendiri.\" Redaksi 2: \"Ya Allah, aku memohon kepada-Mu dengan bersaksi bahwa Engkaulah Allah, tiada sesembahan selain Engkau, Yang Maha Esa, tempat bergantung segala makhluk, yang tidak beranak dan tidak diperanakkan, dan tidak ada sesuatu pun yang sebanding dengan-Mu.\"",
    source: "1) HR Abu Dawud, an-Nasa'i; 2) HR Tirmidzi.",
    tags: ["ismul-azam", "mustajab", "nama-allah"],
    favorite: true
  },
  {
    id: "7",
    title: "Shalawat Ibrahimiyah (Shalawat Dalam Tasyahhud)",
    category: "Shalawat",
    kaidah: "Shalawat yang dibaca dalam tasyahhud akhir shalat. Rasulullah SAW bersabda: 'Barangsiapa yang bershalawat kepadaku sekali, Allah akan bershalawat kepadanya sepuluh kali.' Dibaca minimal 10x sehari atau lebih.",
    arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ. اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ",
    latin: "Allāhumma ṣalli 'alā Muḥammadin wa 'alā āli Muḥammad, kamā ṣallayta 'alā Ibrāhīma wa 'alā āli Ibrāhīm, innaka Ḥamīdun Majīd. Allāhumma bārik 'alā Muḥammadin wa 'alā āli Muḥammad, kamā bārakta 'alā Ibrāhīma wa 'alā āli Ibrāhīm, innaka Ḥamīdun Majīd.",
    translation_id: "Ya Allah, berikanlah shalawat kepada Muhammad dan kepada keluarga Muhammad, sebagaimana Engkau telah memberikan shalawat kepada Ibrahim dan kepada keluarga Ibrahim, sesungguhnya Engkau Maha Terpuji lagi Maha Mulia. Ya Allah, berikanlah keberkahan kepada Muhammad dan kepada keluarga Muhammad, sebagaimana Engkau telah memberikan keberkahan kepada Ibrahim dan kepada keluarga Ibrahim, sesungguhnya Engkau Maha Terpuji lagi Maha Mulia.",
    source: "HR Bukhari, Muslim.",
    tags: ["shalawat", "tasyahhud", "ibrahim", "nabi", "berkah", "wajib-shalat"],
    favorite: true
  },
  {
    id: "8",
    title: "Doa Jawami'ul Kalim (Doa Paling Komprehensif dari Nabi)",
    category: "Doa Mustajab",
    kaidah: "Doa yang diajarkan Nabi kepada Aisyah, mencakup semua permohonan kebaikan dan perlindungan dari semua keburukan.",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنَ الْخَيْرِ كُلِّهِ عَاجِلِهِ وَآجِلِهِ، مَا عَلِمْتُ مِنْهُ وَمَا لَمْ أَعْلَمْ، وَأَعُوذُ بِكَ مِنَ الشَّرِّ كُلِّهِ عَاجِلِهِ وَآجِلِهِ، مَا عَلِمْتُ مِنْهُ وَمَا لَمْ أَعْلَمْ. اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ خَيْرِ مَا سَأَلَكَ عَبْدُكَ وَنَبِيُّكَ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا عَاذَ بِهِ عَبْدُكَ وَنَبِيُّكَ. اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَمَا قَرَّبَ إِلَيْهَا مِنْ قَوْلٍ أَوْ عَمَلٍ، وَأَعُوذُ بِكَ مِنَ النَّارِ وَما قَرَّبَ إِلَيْهَا مِنْ قَوْلٍ أَوْ عَمَلٍ، وَأَسْأَلُكَ أَنْ تَجْعَلَ كُلَّ قَضَاءٍ قَضَيْتَهُ لِي خَيْرًا.",
    latin: "Allāhumma innī as'aluka minal-khayri kullihī 'ājilihī wa ājilihī, mā 'alimtu minhu wa mā lam a'lam. Wa a'ūdzu bika minasy-syarri kullihī 'ājilihī wa ājilihī, mā 'alimtu minhu wa mā lam a'lam. Allāhumma innī as'aluka min khayri mā sa'alaka 'abduka wa nabiyyuk, wa a'ūdzu bika min syarri mā 'ādza bihī 'abduka wa nabiyyuk. Allāhumma innī as'alukal-jannata wa mā qarraba ilayhā min qawlin aw 'amal, wa a'ūdzu bika minan-nāri wa mā qarraba ilayhā min qawlin aw 'amal, wa as'aluka an taj'ala kulla qadhā'in qadhaytahū lī khayrā.",
    translation_id: "Ya Allah, aku memohon kepada-Mu semua kebaikan, yang segera maupun yang tertunda, yang aku ketahui maupun yang tidak aku ketahui. Dan aku berlindung kepada-Mu dari semua keburukan, yang segera maupun yang tertunda, yang aku ketahui maupun yang tidak aku ketahui. Ya Allah, aku memohon kepada-Mu kebaikan yang diminta oleh hamba dan Nabi-Mu, dan aku berlindung kepada-Mu dari keburukan yang hamba dan Nabi-Mu berlindung darinya. Ya Allah, aku memohon kepada-Mu surga dan segala hal yang mendekatkan kepadanya, baik berupa ucapan maupun perbuatan. Dan aku berlindung kepada-Mu dari neraka dan segala hal yang mendekatkan kepadanya, baik berupa ucapan maupun perbuatan. Dan aku memohon kepada-Mu agar Engkau menjadikan setiap ketetapan yang Engkau takdirkan untukku sebagai kebaikan.",
    source: "HR Ibnu Majah (sahih).",
    tags: ["komprehensif", "kebaikan", "perlindungan", "mustajab", "jawamiul-kalim"],
    favorite: true
  },
  {
    id: "9",
    title: "DOA TAMAK KOMPREHENSIF (Asmaul Husna + Doa Ma'tsur + Hajat Dunia-Akhirat)",
    category: "Doa Komprehensif",
    kaidah: "Doa super komplit dengan semua Asmaul Husna yang disertai artinya, doa-doa ma'tsur dari Quran dan Hadis dengan transliterasi dan terjemah lengkap, serta hajat dunia-akhirat mencakup rezeki 100T, karier cybersecurity, keluarga, dan ujian hidup.",
    arabic: `بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ`,
    latin: "Bismillāhir-Raḥmānir-Raḥīm",
    translation_id: `**Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang.**

Yā Allāh, aku datang kepada-Mu sebagai hamba-Mu yang lemah, fakir, penuh dosa, dan sangat tamak kepada rahmat-Mu. Yā Allāh, Engkau **Ar-Raḥmān** (Yang Maha Pengasih), **Ar-Raḥīm** (Yang Maha Penyayang), **Al-Malik** (Yang Maha Merajai dan Menguasai seluruh makhluk), **Al-Quddūs** (Yang Mahasuci dari segala kekurangan), **As-Salām** (Yang Maha Memberi keselamatan dan kedamaian), **Al-Mu'min** (Yang Maha Pemberi rasa aman dan keimanan), **Al-Muhaiman** (Yang Maha Memelihara dan Mengawasi), **Al-'Azīz** (Yang Mahaperkasa dan tak terkalahkan), **Al-Jabbār** (Yang Maha Perkasa yang memperbaiki dan menundukkan), **Al-Mutakabbir** (Yang Mahabesar dan Mahaagung), **Al-Khāliq** (Yang Maha Pencipta), **Al-Bāri'** (Yang Maha Mengadakan dan Menata), **Al-Muṣawwir** (Yang Maha Membentuk rupa dengan sempurna). Tidak ada sesembahan yang benar selain Engkau. Aku memuji-Mu, menyanjung-Mu, lalu mengangkat kedua tanganku, yakin bahwa Engkau mendengar dan mengabulkan doaku.

---

### 1. FASE TAUBAT TOTAL & PEMBERSIHAN HATI

Yā Allāh, Engkau **Al-Ghaffār** (Yang Maha Banyak Mengampuni), **Al-Ghafūr** (Yang Maha Luas Ampunan-Mu), **At-Tawwāb** (Yang Maha Penerima Taubat), **Al-‘Afuww** (Yang Maha Pemaaf yang menghapus dosa sampai seolah tidak pernah ada), **Ar-Ra’ūf** (Yang Maha Lembut dan Maha Penyayang).

Aku mengakui semua kesalahanku dan kesalahan keluargaku di hadapan-Mu.

**Doa Nabi Adam ‘alaihis-salām:**

رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ

**Transliterasi:** *Rabbanaa ẓalamnā anfusanā wa illam taghfir lanā wa tarḥamnā lanakūnanna minal-khāsirīn.*
**Artinya:** *“Wahai Rabb kami, kami telah menzalimi diri kami sendiri. Jika Engkau tidak mengampuni kami dan tidak merahmati kami, niscaya kami termasuk orang-orang yang merugi.”*

Yā Allāh, dengan doa ini aku mengakui kezaliman diriku sendiri. Maka berikan kepadaku ampunan total. Cabut aku dari deretan orang yang merugi; masukkan aku dan keluargaku ke dalam deretan hamba yang Engkau cintai dan Engkau ampuni.

**Doa istighfar panjang Nabi ﷺ (HR Muslim):**

اللَّهُمَّ اغْفِرْ لِي خَطِيئَتِي وَجَهْلِي، وَإِسْرَافِي فِي أَمْرِي، وَمَا أَنْتَ أَعْلَمُ بِهِ مِنِّي.
اللَّهُمَّ اغْفِرْ لِي جِدِّي وَهَزْلِي، وَخَطَئِي وَعَمْدِي، وَكُلُّ ذَلِكَ عِنْدِي.
اللَّهُمَّ اغْفِرْ لِي مَا قَدَّمْتُ وَمَا أَخَّرْتُ، وَمَا أَسْرَرْتُ وَمَا أَعْلَنْتُ، وَمَا أَنْتَ أَعْلَمُ بِهِ مِنِّي، أَنْتَ الْمُقَدِّمُ وَأَنْتَ الْمُؤَخِّرُ، وَأَنْتَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.

**Transliterasi:**
*Allāhumma-ghfir lī khaṭī’atī wa jahli, wa isrāfī fī amrī, wa mā anta a‘lamu bihī minnī. Allāhumma-ghfir lī jiddī wa hazlī, wa khaṭa’ī wa ‘amdi, wa kullu dzālika ‘indī. Allāhumma-ghfir lī mā qaddamtu wa mā akhkhartu, wa mā asrartu wa mā a‘lantu, wa mā anta a‘lamu bihī minnī, anta al-Muqaddimu wa anta al-Mu’akhkhir, wa anta ‘alā kulli shay’in Qadīr.*

**Artinya:** *“Ya Allah, ampunilah kesalahanku dan ketidaktahuanku, sikap berlebih-lebihanku dalam segala urusanku, dan segala sesuatu yang lebih Engkau ketahui daripadaku. Ya Allah, ampunilah kesungguhanku dan candaanku, kekeliruanku dan perbuatanku yang sengaja, dan semua itu ada padaku. Ya Allah, ampunilah dosa yang telah aku lakukan dan yang akan datang, yang aku sembunyikan maupun yang aku tampakkan, dan segala dosa yang lebih Engkau ketahui dariku. Engkaulah Dzat Yang Maha Mendahulukan dan Maha Mengakhirkan, dan Engkau Mahakuasa atas segala sesuatu.”*

Yā Allāh, dengan doa istighfar yang diajarkan Nabi-Mu ini, aku memohon: hapuskan seluruh noda dosaku, dosa istriku, orang tuaku, mertua, keluarga besar, dan keturunanku. Bersihkan hati kami seperti pakaian putih yang dicuci bersih. Jangan Engkau sisakan satu dosa pun yang menjadi penghalang terkabulnya doa-doaku dan terbukanya pintu rezeki dan karierku.

---

### 2. FASE KETENANGAN JIWA, RAHMAT & JALAN KELUAR

Yā Allāh, Engkau **As-Salām** (Yang Maha Memberi keselamatan), **Al-Mu’min** (Yang Maha Pemberi rasa aman), **Al-Ḥalīm** (Yang Maha Penyantun), **Ash-Ṣabūr** (Yang Maha Sabar), **Al-Ḥaqq** (Yang Mahabenar), **Ash-Shahīd** (Yang Maha Menyaksikan).

Ketika hatiku berat, pikiranku penuh kecemasan, dan dadaku sesak, aku kembali kepada-Mu.

**Doa Nabi Yunus ‘alaihis-salām (QS Al-Anbiyā’ 21:87):**

لَا إِلٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ

**Transliterasi:** *Lā ilāha illā Anta, subḥānaka innī kuntu minaẓ-ẓālimīn.*
**Artinya:** *“Tiada sesembahan yang berhak disembah selain Engkau, Mahasuci Engkau, sesungguhnya aku termasuk orang-orang yang zalim.”*

Yā Allāh, dengan kalimat ini aku mengakui: semua sempit ini ada karena dosa dan kelemahanku sendiri. Maka bukakan jalan keluar dari setiap kesempitan rezeki, karier, keluarga, dan hati. Ganti setiap gelap dengan cahaya dari-Mu.

**Doa menghilangkan sedih/gelisah (HR Bukhari Muslim):**

اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ

**Transliterasi:**
*Allāhumma innī a‘ūdzu bika minal-hammi wal-ḥazan, wa a‘ūdzu bika minal-‘ajzi wal-kasal, wa a‘ūdzu bika minal-jubni wal-bukhl, wa a‘ūdzu bika min ghalabatid-dayni wa qahrir-rijāl.*

**Artinya:** *“Ya Allah, aku berlindung kepada-Mu dari rasa sedih dan gelisah, dari kelemahan dan kemalasan, dari sifat pengecut dan kikir, dan aku berlindung kepada-Mu dari lilitan utang dan tekanan manusia.”*

Yā Allāh, dengan doa ini aku memohon: hilangkan dari hidupku dominasi rasa cemas dan sedih yang tidak perlu. Berikan kekuatan, semangat, keberanian, dan kelapangan tangan dalam bersedekah. Angkat semua lilitan utang dan tekanan manusia dari hidupku.

**Doa saat kesulitan berat (HR Bukhari Muslim):**

اللَّهُمَّ لَا إِلٰهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلٰهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلٰهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ، وَرَبُّ الْعَرْشِ الْكَرِيمِ

**Transliterasi:**
*Allāhumma lā ilāha illallāhul-‘Aẓīmul-Ḥalīm, lā ilāha illallāhu Rabbul-‘Arsyil-‘Aẓīm, lā ilāha illallāhu Rabbus-samāwāti wa Rabbul-arḍi, wa Rabbul-‘Arsyil-Karīm.*

**Artinya:** *“Ya Allah, tidak ada sesembahan yang berhak disembah selain Allah Yang Maha Agung lagi Maha Penyantun. Tidak ada sesembahan yang berhak disembah selain Allah, Rabb pemilik ‘Arsy yang agung. Tidak ada sesembahan yang berhak disembah selain Allah, Rabb langit dan Rabb bumi, dan Rabb ‘Arsy yang mulia.”*

Yā Allāh, dengan kalimat agung ini aku memohon: pecahkan semua kebuntuan dalam rezekiku, karierku, dan urusan keluargaku. Bukakan pintu-pintu yang manusia anggap tertutup, dan turunkan ketenangan yang Engkau janji pada hati orang yang bertawakkal.

**Doa berlindung dengan cahaya wajah Allah:**

أَعُوذُ بِنُورِ وَجْهِكَ الَّذِي أَشْرَقَتْ لَهُ الظُّلُمَاتُ، وَصَلُحَ عَلَيْهِ أَمْرُ الدُّنْيَا وَالْآخِرَةِ، أَنْ يَحِلَّ عَلَيَّ غَضَبُكَ، أَوْ يَنْزِلَ بِي سَخَطُكَ، لَكَ الْعُتْبَى حَتَّىٰ تَرْضَى، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِكَ

**Transliterasi:**
*A‘ūdzu binūri wajhika alladzī asyrqat lahuzh-zhulumāt, wa ṣaluḥa ‘alayhi amrud-dunyā wal-ākhirah, an yaḥilla ‘alayya ghaḍabuk, aw yanzila bī sakhaṭuk, laka al-‘utbā ḥattā tarḍā, wa lā ḥawla wa lā quwwata illā bik.*

**Artinya:** *“Aku berlindung dengan cahaya wajah-Mu yang dengannya kegelapan menjadi terang dan dengan itu baik seluruh urusan dunia dan akhirat, dari turunnya murka-Mu atasku atau menimpa diriku kemurkaan-Mu. Bagi-Mu segala pujian sampai Engkau ridha, dan tidak ada daya dan kekuatan kecuali dengan-Mu.”*

Yā Allāh, dengan cahaya wajah-Mu itu, terangi semua gelap dalam hidupku: gelap keputusan, gelap hati, gelap jalan karier, dan gelap masa depan. Lindungi aku dari murka-Mu di dunia dan akhirat; jadikan aku berada di wilayah ridha dan kasih sayang-Mu.

**Doa rahmat & jalan keluar (QS Al-Kahfi: 10):**

رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً، وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا

**Transliterasi:** *Rabbanā ātinā mil ladunka raḥmah, wa hayyi’ lanā min amrinā rasyadā.*
**Artinya:** *“Wahai Rabb kami, berikanlah kepada kami rahmat dari sisi-Mu dan siapkanlah bagi kami jalan keluar yang lurus bagi urusan kami.”*

Yā Allāh, aku memohon: turunkan rahmat khusus dari sisi-Mu ke dalam hidupku, keluargaku, karierku di cybersecurity, dan seluruh urusanku. Susun untukku jalan keluar yang lurus, jelas, dan Engkau berkahi, dari setiap masalah yang sedang dan akan aku hadapi.

---

### 3. FASE BERSANDAR PENUH: LEPAS DARI KEKUATAN DIRI

Yā Allāh, Engkau **Al-Ḥayy** (Yang Maha Hidup, tak pernah mati), **Al-Qayyūm** (Yang Menegakkan dan Mengatur seluruh makhluk), **Al-Wakīl** (Yang Maha Mewakili dan sebaik-baik tempat bersandar), **Al-Walī** (Yang Maha Pelindung dan Penolong), **Al-Qawiyy** (Yang Mahakuat), **Al-Matīn** (Yang Maha Kokoh).

اللَّهُمَّ إِنِّي أَتَبَرَّأُ مِنْ حَوْلِي وَقُوَّتِي، وَأَلْتَجِئُ إِلَى حَوْلِكَ وَقُوَّتِكَ

**Transliterasi:** *Allāhumma innī atabarra’u min ḥawlī wa quwwatī, wa altaji’u ilā ḥawlika wa quwwatika.*
**Artinya:** *“Ya Allah, sesungguhnya aku berlepas diri dari daya dan kekuatanku sendiri, dan aku bersandar kepada daya dan kekuatan-Mu.”*

Yā Allāh, dengan kalimat ini aku benar-benar melepaskan klaim bahwa aku bisa sendiri. Aku akui tanpa kekuatan-Mu, aku tidak mampu mengatur rezeki, karier, rumah tangga, bahkan satu helaan nafasku. Maka kuatkan aku dengan kekuatan-Mu yang tak terbatas.

اللَّهُمَّ أَعِنِّي وَلَا تُعِنْ عَلَيَّ، وَانْصُرْنِي وَلَا تَنْصُرْ عَلَيَّ, وَاهْدِنِي وَيَسِّرِ الْهُدَى لِي

**Transliterasi:** *Allāhumma a‘innī wa lā tu‘in ‘alayya, wanṣurnī wa lā tanṣur ‘alayya, wahdinī wa yassiril-hudā lī.*
**Artinya:** *“Ya Allah, tolonglah aku dan jangan Engkau biarkan aku. Menangkan aku dan jangan Engkau kalahkan aku. Berikan aku petunjuk dan mudahkanlah petunjuk itu bagiku.”*

Yā Allāh, tolong aku dalam ibadah, fokus, disiplin, kerja halal, menjaga amanah. Menangkan aku di medan karier, di medan rumah tangga, di medan melawan hawa nafsu. Tunjukkan keputusan yang paling benar dalam pilihan kerja, proyek, relasi, dan kehidupan – lalu mudahkan aku untuk melakukannya.

---

### 4. FASE REZEKI BESAR (HINGGA 100 TRILIUN) – HALAL, QANA’AH & LUNAS UTANG

Yā Allāh, Engkau **Ar-Razzāq** (Yang Maha Pemberi rezeki secara terus menerus), **Dzul-Quwwatil-Matīn** (Yang Memiliki kekuatan yang sangat kokoh), **Al-Ghanī** (Yang Mahakaya, tidak butuh apa pun), **Al-Mughnī** (Yang Maha Memberi kekayaan dan kecukupan), **Al-Wahhāb** (Yang Maha Pemberi karunia tanpa batas), **Al-Wāsi‘** (Yang Mahaluas karunia-Nya), **Al-Karīm** (Yang Mahamulia dan Mahapemurah), **Ash-Shakūr** (Yang Maha Membalas syukur dengan berlipat ganda), **Al-Ḥasīb** (Yang Maha Mencukupkan dan Maha Menghisab), **Al-Ḥamīd** (Yang Maha Terpuji).

Yā Allāh, aku memohon kepada-Mu rezeki materi yang sangat luas, sangat besar, dan sangat deras, dalam bentuk uang, aset, dan kekayaan yang Engkau ridai. Jika di sisi-Mu Engkau tetapkan bagiku dan keluargaku kekayaan yang amat besar hingga angka seratus triliun atau lebih, maka jadikan seluruhnya:

* 100% halal,
* bersih dari riba, korupsi, penipuan, suap, manipulasi, dan kezaliman,
* aman dari segala fitnah dan bencana,
* penuh berkah di dunia dan akhirat.

اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ

**Transliterasi:** *Allāhumma akfinī biḥalālika ‘an ḥarāmik, wa aghninī bifaḍlika ‘amman siwāk.*
**Artinya:** *“Ya Allah, cukupkanlah aku dengan yang halal dari-Mu sehingga aku tidak menyentuh yang haram, dan kayakanlah aku dengan karunia-Mu sehingga aku tidak meminta pada selain-Mu.”*

Yā Allāh, dengan doa ini aku memohon: cukupkan semua kebutuhan hidupku dengan rezeki halal, sehingga aku tidak pernah tergoda mengambil yang haram. Kayakan aku dengan pemberian-Mu sehingga hati ini tidak bergantung kepada makhluk.

اللَّهُمَّ قَنِّعْنِي بِمَا رَزَقْتَنِي، وَبَارِكْ لِي فِيهِ، وَاخْلُفْ عَلَى كُلِّ غَائِبَةٍ لِي بِخَيْرٍ

**Transliterasi:** *Allāhumma qanni‘nī bimā razaqtanī, wa bārik lī fīh, wakhluf ‘alā kulli ghā’ibatin lī bikhayr.*
**Artinya:** *“Ya Allah, jadikan aku merasa cukup dengan rezeki yang Engkau berikan, berkahilah untukku, dan gantilah setiap hal yang luput dariku dengan yang lebih baik.”*

Yā Allāh, aku memohon: tanamkan rasa cukup di hatiku walau Engkau beri harta besar. Berkahilah setiap rupiah yang Engkau titipkan, sehingga sedikit menjadi cukup, dan banyak menjadi jalan kebaikan. Jika ada peluang dunia yang Engkau jauhkan dariku, gantilah dengan sesuatu yang jauh lebih baik di sisi-Mu.

Jadikan harta besar itu:

* nafkah mulia untuk keluarga,
* sumber zakat yang sah,
* sedekah harian yang besar,
* wakaf yang mengalir tanpa henti,
* penolong fakir, yatim, orang yang terlilit hutang,
* bahan pembangunan masjid, pesantren, sekolah, dan proyek peradaban Islam yang Engkau cintai.

Letakkan harta di tanganku, jangan di hatiku; jadikan aku kaya di mata manusia, tapi tetap fakir di hadapan-Mu.

**Doa utang & kefakiran (HR Muslim):**

اللَّهُمَّ رَبَّ السَّمَاوَاتِ السَّبْعِ وَرَبَّ الْعَرْشِ الْعَظِيمِ، رَبَّنَا وَرَبَّ كُلِّ شَيْءٍ، فَالِقَ الْحَبِّ وَالنَّوَى، وَمُنْزِلَ التَّوْرَاةِ وَالإِنْجِيلِ وَالْفُرْقَانِ، أَعُوذُ بِكَ مِنْ شَرِّ كُلِّ شَيْءٍ أَنْتَ آخِذٌ بِنَاصِيَتِهِ، اللَّهُمَّ أَنْتَ الْأَوَّلُ فَلَيْسَ قَبْلَكَ شَيْءٌ، وَأَنْتَ الْآخِرُ فَلَيْسَ بَعْدَكَ شَيْءٌ، وَأَنْتَ الظَّاهِرُ فَلَيْسَ فَوْقَكَ شَيْءٌ، وَأَنْتَ الْبَاطِنُ فَلَيْسَ دُونَكَ شَيْءٌ، اقْضِ عَنَّا الدَّيْنَ وَأَغْنِنَا مِنَ الْفَقْرِ

**Transliterasi:**
*Allāhumma rabbas-samāwātis-sab‘i wa rabbal-‘arsyil-‘Aẓīm, rabbanaa wa rabba kulli shay’, fāliqal-ḥabbi wan-nawā, wa munzilat-tawrāti wal-injīli wal-furqān, a‘ūdzu bika min sharri kulli shay’in anta ākhidzun bināṣiyatih. Allāhumma antal-Awwalu falaysa qablaka shay’, wa antal-Ākhiru falaysa ba‘daka shay’, wa antaẓ-Ẓāhiru falaysa fawqaka shay’, wa antal-Bāṭinu falaysa dūnaka shay’, iqḍi ‘annad-dayna wa aghninā minal-faqr.*

**Artinya:** *“Ya Allah, Tuhan tujuh langit dan Rabb ‘Arsy yang agung, Rabb kami dan Rabb segala sesuatu, Pembelah biji dan benih, Penurun Taurat, Injil, dan Furqan. Aku berlindung kepada-Mu dari kejahatan segala sesuatu yang Engkau memegang ubun-ubunnya. Ya Allah, Engkaulah Yang Awal, tidak ada sesuatu pun sebelum-Mu. Engkaulah Yang Akhir, tidak ada sesuatu pun setelah-Mu. Engkaulah Yang Zhahir, tidak ada sesuatu pun di atas-Mu. Engkaulah Yang Batin, tidak ada sesuatu pun di bawah-Mu. Lunasilah utang kami dan kayakan kami dari kefakiran.”*

Yā Allāh, lunasilah semua utangku dan utang keluargaku hingga tuntas. Keluarkan kami dari sempitnya kefakiran menuju lapangnya kecukupan dan kekayaan yang Engkau berkahi. Jadikan kami pemberi, bukan peminta; penolong, bukan yang selalu membutuhkan pertolongan manusia.

---

### 5. FASE REZEKI NONMATERI: IMAN, ILMU, WAKTU, KETENANGAN

Yā Allāh, Engkau **Ar-Raḥmān** (Yang Maha Pengasih), **Ar-Raḥīm** (Yang Maha Penyayang), **Al-Hādī** (Yang Maha Pemberi petunjuk), **Ar-Rashīd** (Yang Maha Membimbing ke keputusan paling tepat), **Al-‘Alīm** (Yang Maha Mengetahui), **Al-Ḥakīm** (Yang Mahabijaksana), **Al-Laṭīf** (Yang Maha Lembut dalam pengaturan), **Al-Khabīr** (Yang Maha Mengetahui rahasia), **An-Nūr** (Cahaya langit dan bumi).

Yā Rabb, tambahkan keimanan kami, berkahi umur kami, berikan tubuh yang sehat, lapangkan rezeki kami, luruskan akhlak kami, indahkan aqidah kami, perbaiki hati kami. Jadikan setiap hari bertambah dekat kepada-Mu, bukan menjauh.

Berikan kepada kami *‘ilman nāfi‘an* (ilmu yang bermanfaat): ilmu agama yang lurus dan ilmu dunia yang Engkau ridai, khususnya ilmu teknologi dan keamanan siber yang bisa kami jadikan jalan ibadah dan perlindungan bagi banyak orang.

Berikan hati yang tenang, jiwa yang lapang, pikiran yang jernih, mental yang kuat, dan emosi yang stabil. Berikan waktu yang penuh berkah: sedikit tapi sangat produktif, di mana ibadah, kerja profesional, keluarga, belajar, dan istirahat semuanya tersusun rapi dalam ridha-Mu.

Hadirkan sahabat-sahabat saleh yang mengingatkan kami kepada-Mu. Hadirkan guru-guru yang lurus aqidahnya, baik akhlaknya, tajam ilmunya, dan tulus membimbing. Jadikan kami kaya dengan syukur, kaya dengan qana’ah, dan kaya dengan keberanian untuk menolak yang haram meski tampak menguntungkan.

---

### 6. FASE KARIER CYBERSECURITY: PEKANBARU, REMOTE, LURUS & BERKAH

Yā Allāh, Engkau **Al-Qadīr** (Yang Mahakuasa), **Al-Muqtadir** (Yang Maha Menentukan dan Maha Perkasa), **Ar-Rabb** (Rabb yang Memelihara), **Al-Qayyūm** (Yang Mengurus seluruh urusan makhluk), **Al-‘Alīm** (Yang Maha Mengetahui setiap detail), **Al-Ḥakīm** (Yang Mahabijaksana dalam setiap takdir), **Al-Fattāḥ** (Yang Maha Membuka pintu-pintu kebaikan), **Al-Hādī** (Yang Maha Pemberi petunjuk), **Ar-Rashīd** (Yang Maha Membimbing ke jalan paling lurus), **Al-Wakīl** (Yang Maha Mewakili), **Al-Walī** (Yang Maha Melindungi dan Menolong).

Yā Allāh, berkahilah karierku di bidang cybersecurity. Karuniakan kepadaku ilmu teknis yang kuat, mendalam, dan terus bertambah; kemampuan analisis, desain arsitektur, manajemen risiko, dan respons insiden yang Engkau ridai. Berikan *bashīrah* (ketajaman mata hati) untuk melihat bahaya yang tersembunyi, baik di dunia digital maupun di balik keputusan-keputusan hidup.

رَبِّ أَنْزِلْنِي مُنْزَلًا مُبَارَكًا وَأَنْتَ خَيْرُ الْمُنْزِلِينَ

**Transliterasi:** *Rabbi anzilnī munzalan mubārakan wa anta khayrul-munzilīn.*
**Artinya:** *“Ya Tuhanku, tempatkanlah aku pada tempat yang diberkahi, dan Engkau adalah sebaik-baik Dzat yang memberi tempat.”*

Yā Allāh, dengan ayat ini aku memohon: tempatkan aku pada tempat kerja yang Engkau berkahi di Pekanbaru, di kampung halamanku, dekat orang tua dan keluarga besar – atau di tempat lain yang Engkau ketahui lebih baik bagiku. Jadikan pekerjaanku resmi, jelas statusnya, stabil, aman sampai Engkau ganti dengan yang lebih baik; dengan penghasilan yang sangat baik dan terus meningkat dalam ridha-Mu.

Bukakan peluang kerja yang memungkinkan aku bekerja dari mana saja (remote / fleksibel), sejauh itu baik di sisi-Mu, sehingga aku bisa menunaikan nafkah, tetap dekat dengan orang tua, menjaga istriku, dan tetap kuat dalam ibadah dan ilmu.

Jauhkan aku dari lingkungan kerja yang toxic: penuh maksiat, fitnah, ghibah, politik kotor, korupsi, manipulasi, dan pemaksaan melanggar syariat. Jadikan profesiku ladang pahala jariyah: setiap sistem yang aman menjadi perlindungan rezeki banyak orang, setiap serangan yang tertahan menjadi penghalang kezaliman.

Jika ada tawaran kerja yang besar tapi di dalamnya murka-Mu, tutuplah. Jika ada tawaran yang tampak kecil tapi Engkau tahu itu terbaik bagi agamaku dan keluargaku, bukakan selebar-lebarnya.

---

### 7. FASE KELUARGA & KETURUNAN (QURRATA A‘YUN)

Yā Allāh, Engkau **Al-Bāri’** (Yang Maha Mengadakan), **Al-Muṣawwir** (Yang Membentuk dengan sempurna), **Al-Barr** (Yang Maha Berbuat Baik), **Al-Wadūd** (Yang Maha Mencintai dan Dicintai), **Ar-Ra’ūf** (Yang Maha Lembut).

رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا

**Transliterasi:** *Rabbanaa hab lanā min azwājinā wa dhurriyyātinā qurrota a‘yuniw waj‘alnā lil-muttaqīna imāmā.*
**Artinya:** *“Wahai Rabb kami, anugerahkanlah kepada kami pasangan-pasangan kami dan keturunan-keturan kami sebagai penyejuk mata (kami), dan jadikanlah kami imam bagi orang-orang yang bertakwa.”*

Yā Allāh, jadikan istriku, anak-anakku (yang sudah ada atau yang akan Engkau karuniakan), dan keturunanku sebagai penyejuk mata dan penenang hati. Jadikan rumah kami pusat shalat, tilawah, ilmu, dzikir, dan saling mendoakan. Jadikan aku pemimpin yang bertakwa bagi keluargaku.

رَبِّ لَا تَذَرْنِي فَرْدًا وَأَنْتَ خَيْرُ الْوَارِثِينَ

**Transliterasi:** *Rabbi lā tadzarnī fardan wa anta khayrul-wārithīn.*
**Artinya:** *“Ya Rabbku, janganlah Engkau biarkan aku hidup seorang diri (tanpa keturunan), sedangkan Engkaulah sebaik-baik Pewaris.”*

Yā Allāh, jika Engkau tetapkan keturunan bagiku, jadikan mereka penegak shalat, penjaga kehormatan, pembela kebenaran. Jika Engkau tetapkan lain, karuniakan kepada kami ridha yang tinggi dan gantilah dengan pahala dan amal jariyah yang mengalir tanpa putus di sisi-Mu.

Lindungi keluarga kami dari perselingkuhan, kekerasan, permusuhan, kedurhakaan, dan perpecahan rumah tangga. Satukan hati kami dalam ketaatan sampai Engkau kumpulkan lagi kami di surga.

---

### 8. FASE PERLINDUNGAN MENYELURUH & KEAMANAN DIGITAL

Yā Allāh, Engkau **As-Salām** (Yang Maha Memberi keselamatan), **Al-Ḥafīẓ** (Yang Maha Menjaga), **Ar-Raqīb** (Yang Maha Mengawasi), **Al-Qahhār** (Yang Maha Menundukkan), **Al-Māni‘** (Yang Maha Mencegah mudarat), **Aḍ-Ḍārr** (Yang Menguasai mudarat sesuai hikmah-Nya), **An-Nāfi‘** (Yang Maha Memberi manfaat), **Al-Mu’min** (Yang Memberi rasa aman).

اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا

**Transliterasi:** *Allāhumma innī as’aluka ‘ilman nāfi‘an, wa rizqan ṭayyiban, wa ‘amalan mutaqabbalan.*
**Artinya:** *“Ya Allah, aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang baik, dan amal yang Engkau terima.”*

Yā Allāh, dengan doa ini aku memohon: tetapkan bagiku ilmu yang bermanfaat (bukan sekadar teori kosong), rezeki yang baik (bukan sekadar angka), dan amal yang Engkau terima (bukan sekadar gerakan tanpa nilai di sisi-Mu).

Lindungi kami dari sihir, hasad, ‘ain, tipu daya manusia dan jin, fitnah harta, fitnah jabatan, dan fitnah syahwat. Lindungi kami di darat, laut, dan udara; dari kecelakaan, kebakaran, bencana, kezaliman, dan kejahatan.

Lindungi seluruh aset digital dan pekerjaan kami dalam cybersecurity: akun, password, server, jaringan, aplikasi, data, kontrak, dan rahasia. Jadikan setiap langkah pengamanan yang kami buat sebagai amal kebaikan di sisi-Mu, bukan sekadar kerja teknis.

---

### 9. FASE KESEHATAN & KESEMBUHAN

Yā Allāh, Engkau **Asy-Syāfī** (Yang Maha Menyembuhkan), **Al-Ḥafīẓ** (Yang Maha Menjaga), **Al-Muqīt** (Yang Maha Memberi kecukupan dan kekuatan), **Al-Qādir** (Yang Mahakuasa), **Al-Muḥyī** (Yang Maha Menghidupkan), **Al-Mumīt** (Yang Maha Mematikan).

أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَنِي

**Transliterasi:** *As’alullāhal-‘Aẓīma Rabbal-‘Arsyil-‘Aẓīm an yashfiyanī.*
**Artinya:** *“Aku memohon kepada Allah Yang Maha Agung, Rabb ‘Arsy yang agung, agar Dia menyembuhkanku.”*

Yā Allāh, dengan doa ini aku memohon kesembuhan total untuk tubuhku: dari penyakit yang tampak dan tersembunyi, dari lemah fisik dan lemah mental, dari sakit yang sudah terdeteksi maupun yang belum aku ketahui. Untuk keluarga kami yang sakit, Yā Allāh: *an yashfiyahum* – sembuhkan mereka dengan kesembuhan sempurna dari sisi-Mu.

Berikan kepada kami:

* mata yang kuat,
* jantung yang sehat,
* tubuh yang bugar,
* pikiran yang jernih,
* emosi yang stabil,
* tidur yang berkualitas,
* dan energi yang terarah untuk sujud kepada-Mu, bekerja halal, dan melayani keluarga serta umat.

Jauhkan kami dari penyakit berat: kanker, stroke, serangan jantung, gagal ginjal, penyakit saraf, autoimun, gangguan jiwa, penyakit menular, dan segala penyakit yang Engkau lebih tahu namanya. Jadikan setiap sakit sebagai penghapus dosa dan pengangkat derajat, bukan azab.

---

### 10. FASE TAKDIR TERBAIK: DUNIA & AKHIRAT

Yā Allāh, Engkau **Al-Qābiḍ** (Yang Maha Menyempitkan), **Al-Bāsiṭ** (Yang Maha Melapangkan), **Al-Khāfiḍ** (Yang Maha Merendahkan), **Ar-Rāfi‘** (Yang Maha Meninggikan), **Al-Mu‘izz** (Yang Maha Memberi kemuliaan), **Al-Mudhill** (Yang Maha Menghinakan), **Al-Muqaddim** (Yang Maha Mendahulukan), **Al-Mu’akhkhir** (Yang Maha Mengakhirkan), **Al-Mubdi’** (Yang Maha Memulai), **Al-Mu‘īd** (Yang Maha Mengembalikan), **Al-Muḥṣī** (Yang Maha Menghitung), **Al-Bā‘its** (Yang Maha Membangkitkan), **Al-Muḥyī** (Yang Maha Menghidupkan), **Al-Mumīt** (Yang Maha Mematikan), **Al-Awwal** (Yang Maha Awal), **Al-Ākhir** (Yang Maha Akhir), **Aẓ-Ẓāhir** (Yang Maha Nyata), **Al-Bāṭin** (Yang Maha Tersembunyi).

Atur seluruh takdirku dengan pengaturan terbaik-Mu. Jika Engkau tahu satu perkara buruk bagi agama, dunia, dan akhiratku, jauhkan perkara itu dariku dan jauhkan aku darinya. Jika Engkau tahu satu perkara baik bagi agama, dunia, dan akhiratku, dekatkan perkara itu kepadaku, mudahkan jalan ke sana, dan jadikan hatiku ridha menerimanya.

Yā Allāh, Engkau **Mālikul-Mulk** (Yang Maha Menguasai seluruh kerajaan), **Dzul-Jalāli wal-Ikrām** (Yang Memiliki keagungan dan kemuliaan), **Al-Jāmi‘** (Yang Maha Mengumpulkan), **Al-Ghaniyy** (Yang Mahakaya), **Al-Mughnī** (Yang Maha Memberi kekayaan), **Al-Bāqī** (Yang Maha Kekal), **Al-Wāriṯ** (Yang Maha Pewaris).

Kumpulkan bagi kami dalam satu paket takdir:

* rezeki yang luas dan berkah,
* karier cybersecurity yang kokoh, mulia, dan bermanfaat,
* lingkungan kerja dan masyarakat yang baik,
* keluarga yang sakinah, mawaddah, rahmah,
* serta akhir hidup yang Engkau ridai di dunia, dan Surga di akhirat.

---

### 11. FASE PENUTUP: HUSNUL KHĀTIMAH & SURGA FIRDAUS

Yā Allāh, Engkau **Al-Ḥaqq** (Yang Mahabenar), **Ash-Shahīd** (Yang Maha Menyaksikan), **Al-‘Adl** (Yang Maha Adil), **Al-Muqsiṭ** (Yang Maha Menegakkan keadilan), **Ar-Raḥmān**, **Ar-Raḥīm**.

Wafatkan kami dalam keadaan husnul khātimah, lisan mengucap:

لَا إِلٰهَ إِلَّا اللَّهُ

**Transliterasi:** *Lā ilāha illallāh.*
**Artinya:** *“Tiada sesembahan yang berhak disembah selain Allah.”*

Lapangkan dan terangkan kubur kami, jadikan taman dari taman-taman surga, lindungi kami dari azab dan fitnah kubur. Mudahkan hisab kami, berikan catatan amal di tangan kanan, mudahkan kami melewati shirāṭ dengan selamat, dan jauhkan kami dari neraka dan segala sebab menuju ke sana.

رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً، وَفِي الْآخِرَةِ حَسَنَةً، وَقِنَا عَذَابَ النَّارِ

**Transliterasi:** *Rabbanaa ātinā fid-dunyā ḥasanah, wa fil-ākhirati ḥasanah, wa qinā ‘adzāban-nār.*
**Artinya:** *“Wahai Rabb kami, berikanlah kepada kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka.”*

Yā Allāh, jadikan kebaikan dunia kami berupa rezeki halal luas, karier yang Engkau berkahi, keluarga yang utuh dan bahagia, kesehatan yang kuat, dan hati yang tenang. Jadikan kebaikan akhirat kami berupa selamat dari azab, ringan di hisab, dan masuk ke Surga Al-Firdaws Al-A‘lā bersama orang tua, mertua, pasangan, anak-cucu, guru, dan orang-orang yang kami cintai karena-Mu.

Yā Allāh, Engkau **Al-Wāḥid** (Yang Maha Esa), **Al-Aḥad** (Yang Maha Tunggal), **Aṣ-Ṣamad** (Tempat bergantung segala makhluk), **An-Nūr** (Cahaya langit dan bumi), **Al-Badī‘** (Yang Maha Mencipta tanpa contoh), **Ar-Rashīd** (Yang Maha Membimbing), **As-Ṣabūr** (Yang Maha Sabar). Jangan Engkau biarkan kami keluar dari dunia ini kecuali dalam keadaan Engkau ridha kepada kami.

Yā Allāh, Engkau **Al-Mujīb** (Yang Maha Mengabulkan doa), **Al-Wāsi‘** (Yang Mahaluas rahmat-Nya), **Al-Karīm** (Yang Mahamulia), **Al-Majīd** (Yang Maha Mulia dan Luhur). Engkau cukup berkata “*kun*” maka jadilah – *kun fayakūn*.

Dengan seluruh Asmā-ul-Ḥusnā-Mu yang agung, aku memohon: **berikan, bukakan, tetapkan, dan kabulkan** seluruh doa-doa ini – rezeki materi yang sangat luas bahkan sampai angka seratus triliun yang halal dan berkah; rezeki nonmateri berupa iman, ilmu, ketenangan, dan orang-orang baik; karier cybersecurity di Pekanbaru yang berkembang dan bisa bekerja dari mana saja dalam ridha-Mu; lingkungan kerja dan masyarakat yang baik; kekuatan melewati semua ujian hidup bersama istri dan keluarga besar; serta keselamatan kami di dunia dan akhirat.

Kabulkan dengan cara terbaik menurut-Mu, pada waktu terbaik pilihan-Mu, dalam bentuk yang paling Engkau cintai, yang membuat kami semakin dekat kepada-Mu, bukan semakin jauh.

**Āmīn, āmīn, āmīn yā Rabbal ‘ālamīn.**
**Yā Arḥamar-Rāḥimīn.**
**Wal-ḥamdu lillāhi Rabbil ‘ālamīn.**`,
    source: "Gabungan komprehensif dari Al-Quran (doa para Nabi), Hadis sahih (Bukhari, Muslim, Abu Dawud, Tirmidzi, Nasa'i, Ibnu Majah), dengan semua Asmaul Husna beserta maknanya",
    tags: ["tamak-komprehensif", "99-asmaul-husna", "doa-matsur", "rezeki-100T", "cybersecurity", "keluarga", "taubat", "perlindungan", "kesehatan", "dunia-akhirat"],
    favorite: true
  },
  {
    id: "10",
    title: "Rahmat-Mu Yang Kuharap (Doa Pagi Paling Utama)",
    category: "Doa Inti",
    kaidah: "Allah akan mengatur seluruh urusan kita dengan sebaik-baiknya jika dibaca dengan penuh harap.",
    arabic: "اللَّهُمَّ رَحْمَتَكَ أَرْجُو فَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ، وَأَصْلِحْ لِي شَأْنِي كُلَّهُ، لَا إِلَهَ إِلَّا أَنْتَ",
    latin: "Allāhumma raḥmataka arjū, falā takilnī ilā nafsī ṭarfata 'ayn, wa aṣliḥ lī sya'nī kullahu, lā ilāha illā Anta.",
    translation_id: "Ya Allah, hanya rahmat-Mu yang kuharap; jangan serahkan aku pada diriku walau sekejap mata; perbaikilah seluruh urusanku; tiada sesembahan yang benar selain Engkau.",
    source: "HR Abu Dawud (hasan).",
    tags: ["harapan", "rahmat", "pasrah", "pagi", "inti"],
    favorite: true
  },
  {
    id: "11",
    title: "Doa Tawakal (Hasbunallah & Hasbiyallah)",
    category: "Doa Inti",
    kaidah: "Dibaca saat gentar/cemas. Hasbiyallah dibaca 7x pagi & petang, Allah akan mencukupkan segala urusannya.",
    arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ.\n\nحَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ ۖ عَلَيْهِ تَوَكَّلْتُ ۖ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    latin: "Ḥasbunallāhu wa ni'mal-wakīl.\n\nHasbiyallāhu lā ilāha illā huwa, 'alaihi tawakkaltu wa huwa rabbul-'arsyil-'aẓīm.",
    translation_id: "Cukuplah Allah bagi kami, dan Dia sebaik-baik Pelindung.\n\nCukuplah Allah bagiku; tidak ada tuhan selain Dia. Hanya kepada-Nya aku bertawakal dan Dia adalah Tuhan yang memiliki 'Arsy yang agung.",
    source: "QS Āli 'Imrān:173 & QS At-Taubah:129.",
    tags: ["tawakal", "cukup", "pelindung", "pagi-petang", "hitungan", "inti"],
    favorite: true
  },
  {
    id: "12",
    title: "Memohon Pertolongan dengan Rahmat Allah (Yā Ḥayyu Yā Qayyūm)",
    category: "Doa Inti",
    kaidah: "Dibaca 3x pagi & 3x petang. Meminta pertolongan Allah dalam segala urusan dan agar tidak diserahkan pada diri sendiri.",
    arabic: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ",
    latin: "Yā Ḥayyu yā Qayyūm bi-raḥmatika astaghīthu, aṣliḥ lī sha'nī kullahu, wa lā takilnī ilā nafsī ṭarfata 'ayn.",
    translation_id: "Ya Allah Yang Mahahidup, Ya Allah Yang Berdiri Sendiri, dengan rahmat-Mu aku minta tolong. Perbaikilah semua urusanku dan jangan serahkan aku pada diriku walau sekejap mata.",
    source: "HR An-Nasa'i, Al-Hakim (sahih).",
    tags: ["pertolongan", "rahmat", "pasrah", "pagi-petang", "hitungan", "inti"],
    favorite: true
  },

  // === DOA GABUNGAN URUTAN 13 ===
  {
    id: "13",
    title: "Doa Hidayah, Takwa & Akhlak Mulia (Gabungan Lengkap)",
    category: "Doa Iman & Akhlak",
    kaidah: "Gabungan lengkap doa-doa untuk hidayah, ketetapan hati, takwa, iffah, ghina, dan perbaikan akhlak. Setiap bagian dibaca dengan penuh penghayatan.",
    arabic: `يَا مُقَلِّبَ الْقُلُوبِ، ثَبِّتْ قَلْبِي عَلَى دِينِكَ

رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ

اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى

اللَّهُمَّ آتِ نَفْسِي تَقْوَاهَا، وَزَكِّهَا أَنْتَ خَيْرُ مَنْ زَكَّاهَا، أَنْتَ وَلِيُّهَا وَمَوْلَاهَا

اللَّهُمَّ اجْعَلِ الْقُرْآنَ رَبِيعَ قَلْبِي، وَنُورَ صَدْرِي، وَجَلَاءَ حُزْنِي، وَذَهَابَ هَمِّي

رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ وَلَا تَجْعَلْ فِي قُلُوبِنَا غِلًّا لِلَّذِينَ آمَنُوا رَبَّنَا إِنَّكَ رَءُوفٌ رَحِيمٌ

اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي، وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي، وَأَصْلِحْ لِي آخِرَتِي الَّتِي فِيهَا مَعَادِي، وَاجْعَلِ الْحَيَاةَ زِيَادَةً لِي فِي كُلِّ خَيْرٍ، وَاجْعَلِ الْمَوْتَ رَاحَةً لِي مِنْ كُلِّ شَرٍّ

رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا

رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ`,
    latin: `Yā Muqallibal-qulūb, ṯabbit qalbī 'alā dīnik
Rabbanā lā tuzigh qulūbanā ba'da idh hadaytanā wa hab lanā min ladunka raḥmatan innaka antal-Wahhāb
Allāhumma innī as'alukal-hudā wat-tuqā wal-'afāfa wal-ghinā
Allāhumma āti nafsī taqwāhā, wa zakkihā anta khayru man zakkāhā, anta waliyyuhā wa mawlāhā
Allāhummaj'alil-Qur'āna rabī'a qalbī, wa nūra ṣadrī, wa jalā'a ḥuznī, wa żahāba hammī
Rabbanaghfir lanā wa li-ikhwāninalladzīna sabaqūnā bil-īmān, wa lā taj'al fī qulūbinā ghillal lilladzīna āmanū, rabbanā innaka ra'ūfur raḥīm
Allāhumma aṣliḥ lī dīnī alladhī huwa 'iṣmatu amrī, wa aṣliḥ lī dunyāya allatī fīhā ma'āsyī, wa aṣliḥ lī ākhiratī allatī fīhā ma'ādī, waj'al al-ḥayāta ziyādatan lī fī kulli khayr, waj'al al-mawta rāḥatan lī min kulli syarr
Raḍītu billāhi rabbā, wa bil-islāmi dīnā, wa bimuḥammadin ṣallallāhu 'alayhi wasallam nabiyyā
Rabbanā ẓalamnā anfusanā wa illam taghfir lanā wa tarḥamnā lanakūnanna minal-khāsirīn`,
    translation_id: `"Wahai Pembolak-balik hati, tetapkanlah hatiku di atas agama-Mu."

"Ya Tuhan kami, janganlah Engkau palingkan hati kami setelah Engkau beri petunjuk, dan karuniakan kepada kami rahmat dari sisi-Mu. Sungguh Engkaulah Maha Pemberi."

"Ya Allah, aku memohon kepada-Mu petunjuk, ketakwaan, kehormatan diri, dan kecukupan (kaya hati & harta)."

"Ya Allah, berikanlah pada jiwaku ketakwaannya dan sucikanlah ia, Engkaulah sebaik-baik yang menyucikannya; Engkaulah pelindung dan penolongnya."

"Ya Allah, jadikanlah Al-Qur'an sebagai musim semi hatiku, cahaya dadaku, penghapus kesedihanku, dan pelenyap kegundahanku."

"Ya Tuhan kami, ampunilah kami dan saudara-saudara kami yang telah lebih dahulu beriman, dan janganlah Engkau jadikan dalam hati kami kedengkian terhadap orang-orang beriman. Ya Tuhan kami, sungguh Engkau Maha Penyantun, Maha Penyayang."

"Ya Allah, perbaikilah agamaku yang menjadi pelindung urusanku, perbaikilah duniaku tempat kehidupanku, perbaikilah akhiratku tempat kembaliku, jadikanlah hidup ini sebagai tambahan bagiku dalam segala kebaikan, dan jadikanlah mati sebagai ketenangan bagiku dari segala kejahatan."

"Aku ridha Allah sebagai Tuhanku, Islam sebagai agamaku, dan Muhammad SAW sebagai nabiku."

"Ya Tuhan kami, kami telah menzalimi diri kami sendiri; jika Engkau tidak mengampuni kami dan menyayangi kami, niscaya kami termasuk orang-orang yang merugi."`,
    source: "Gabungan dari HR Tirmidzi, Muslim, Ahmad, QS Ali 'Imran: 8, QS Al-Hasyr: 10, QS Al-A'raf: 23",
    tags: ["hidayah", "takwa", "akhlak", "ketetapan-hati", "al-quran", "persaudaraan", "ridha", "taubat"],
    favorite: true
  },

  // === DOA URUTAN 14 ===
  {
    id: "14",
    title: "Doa Rezeki Halal, Ilmu Bermanfaat & Fondasi Pagi (Gabungan Lengkap)",
    category: "Doa Rezeki & Kerja",
    kaidah: "Gabungan lengkap doa memohon rezeki halal, kecukupan dari Allah, ilmu bermanfaat, amal diterima, dan tawakal penuh.",
    arabic: `اَللّٰهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ

اَللّٰهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا

بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ

اَللّٰهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذَا الْيَوْمِ فَتْحَهُ وَنَصْرَهُ وَنُورَهُ وَبَرَكَتَهُ وَهُدَاهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهِ وَشَرِّ مَا بَعْدَهُ`,
    latin: `Allāhumma ikfinī biḥalālika 'an ḥarāmik, wa aghninī bi-faḍlika 'amman siwāk

Allāhumma innī as'aluka 'ilman nāfi'an, wa rizqan ṭayyiban, wa 'amalan mutaqabbalan

Bismillāhi tawakkaltu 'alallāh, lā ḥawla wa lā quwwata illā billāh

Allāhumma innī as'aluka khayra hādzal-yawmi fatḥahu wa naṣrahu wa nūrahu wa barakatahu wa hudāhu, wa a'ūdzu bika min syarri mā fīhi wa syarri mā ba'dahu`,
    translation_id: `"Ya Allah, cukupkan aku dengan yang halal dari-Mu sehingga aku tidak memerlukan yang haram; dan jadikanlah aku kaya karena karunia-Mu sehingga aku tidak bergantung pada selain-Mu."

"Ya Allah, aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang baik dan halal, dan amal yang Engkau terima."

"Dengan nama Allah, aku bertawakal kepada Allah; tiada daya upaya dan tiada kekuatan kecuali dengan pertolongan Allah."

"Ya Allah, aku memohon kepada-Mu kebaikan hari ini: pembukaannya, pertolongannya, cahayanya, berkahnya, dan petunjuknya. Dan aku berlindung kepada-Mu dari kejahatan yang ada padanya dan kejahatan sesudahnya."`,
    source: "HR Tirmidzi (hasan), Ibnu Majah, Abu Dawud, dan doa-doa pagi",
    tags: ["rezeki", "halal", "ilmu", "amal", "pagi", "tawakal", "berkah", "fondasi"],
    favorite: true
  },

  // === DOA URUTAN 15 ===
  {
    id: "15",
    title: "Doa Keluarga Sakinah, Keturunan Saleh & Bakti Orang Tua (Gabungan Lengkap)",
    category: "Doa Keluarga",
    kaidah: "Gabungan lengkap doa untuk keluarga harmonis, istri dan anak penyejuk hati, istiqamah shalat, bakti orang tua, dan berkumpul di surga.",
    arabic: `رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا

رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ

رَبِّ هَبْ لِي مِن لَّدُنْكَ ذُرِّيَّةً طَيِّبَةً إِنَّكَ سَمِيعُ الدُّعَاءِ

رَبِّ لَا تَذَرْنِي فَرْدًا وَأَنْتَ خَيْرُ الْوَارِثِينَ

رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا

رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ

اللَّهُمَّ إِنِّي أَسْأَلُكَ أَنْ تُبَارِكَ لِي فِي أَهْلِي وَمَالِي وَأَنْ تَجْمَعَ بَيْنَنَا فِي الْجَنَّةِ

اللَّهُمَّ أَصْلِحْ لِي ذُرِّيَّتِي إِنِّي تُبْتُ إِلَيْكَ وَإِنِّي مِنَ الْمُسْلِمِينَ`,
    latin: `Rabbanā hablana min azwājinā wa dhurriyyātinā qurrata a'yun, waj'alnā lil-muttaqīna imāmā

Rabbij'alnī muqīmaṣ-ṣalāti wa min dhurriyyatī, rabbanā wataqabbal du'ā'

Rabbi hab lī min ladunka dhurriyyatan ṭayyibah, innaka samī'ud-du'ā'

Rabbi lā tadzarnī fardan wa anta khayrul-wāriṡīn

Rabbirḥamhumā kamā rabbayānī ṣaghīrā

Rabbighfir lī wa liwālidayya wa lil-mu'minīna yawma yaqūmul-ḥisāb

Allāhumma innī as'aluka an tubārika lī fī ahlī wa mālī wa an tajma'a baynanā fil-jannah

Allāhumma aṣliḥ lī dhurriyyatī innī tubtu ilayka wa innī minal-muslimīn`,
    translation_id: `"Ya Tuhan kami, anugerahkan kepada kami pasangan dan keturunan yang menjadi penyejuk hati (qurratu a'yun), dan jadikan kami pemimpin (imam) bagi orang-orang bertakwa."

"Ya Tuhanku, jadikanlah aku dan keturunanku orang-orang yang tetap mendirikan shalat. Ya Tuhan kami, perkenankanlah doaku."

"Ya Tuhanku, berilah aku dari sisi-Mu keturunan yang baik. Sesungguhnya Engkau Maha Mendengar doa."

"Ya Tuhanku, janganlah Engkau biarkan aku hidup seorang diri, dan Engkaulah pewaris yang paling baik."

"Ya Tuhanku, sayangilah keduanya (orang tua) sebagaimana mereka telah mendidikku waktu kecil."

"Ya Tuhanku, ampunilah aku, kedua orang tuaku, dan orang-orang beriman pada hari diadakan perhitungan."

"Ya Allah, aku memohon kepada-Mu agar Engkau memberkahi keluarga dan hartaku, dan mengumpulkan kami semua di surga."

"Ya Allah, perbaikilah keturunanku. Sesungguhnya aku bertaubat kepada-Mu dan sesungguhnya aku termasuk orang-orang muslim."`,
    source: "QS Al-Furqan:74, Ibrahim:40, Ali 'Imran:38, Al-Anbiya:89, Al-Isra:24, Ibrahim:41, QS Al-Ahqaf:15",
    tags: ["keluarga", "pasangan", "keturunan", "orang-tua", "sakinah", "bakti", "surga", "shalat"],
    favorite: true
  },

  // === DOA TAMBAHAN PENTING 16-21 ===
  {
    id: "16",
    title: "Doa Memulai Aktivitas Harian (Bismillah Lengkap)",
    category: "Doa Harian",
    kaidah: "Dibaca sebelum memulai aktivitas penting. Dengan menyebut nama Allah, segala urusan menjadi berkah dan terlindungi dari gangguan syaitan.",
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ، وَهُوَ السَّمِيعُ الْعَلِيمُ",
    latin: "Bismillāhilladzī lā yadhurru ma'asmihi shay'un fil-ardhi wa lā fis-samā', wa huwas-Samī'ul-'Alīm.",
    translation_id: "Dengan nama Allah yang tidak ada sesuatu pun yang dapat membahayakan bersama nama-Nya, baik di bumi maupun di langit. Dan Dia Maha Mendengar lagi Maha Mengetahui.",
    source: "HR Abu Dawud, Tirmidzi (dibaca 3x pagi & 3x petang)",
    tags: ["bismillah", "aktivitas", "perlindungan", "harian", "pagi-petang"],
    favorite: true
  },
  {
    id: "17",
    title: "Doa Perlindungan Lengkap dari Berbagai Kejahatan",
    category: "Doa Perlindungan",
    kaidah: "Perlindungan komprehensif dari ilmu tidak bermanfaat, hati tidak khusyuk, jiwa tidak puas, doa tidak dikabulkan, azab neraka, azab kubur, dan fitnah Dajjal.",
    arabic: `اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عِلْمٍ لَا يَنْفَعُ، وَمِنْ قَلْبٍ لَا يَخْشَعُ، وَمِنْ نَفْسٍ لَا تَشْبَعُ، وَمِنْ دَعْوَةٍ لَا يُسْتَجَابُ لَهَا

اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ، وَمِنْ عَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ

اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَالْجُبْنِ وَالْبُخْلِ، وَالْهَرَمِ وَعَذَابِ الْقَبْرِ

اللَّهُمَّ آتِ نَفْسِي تَقْوَاهَا، وَزَكِّهَا أَنْتَ خَيْرُ مَنْ زَكَّاهَا، أَنْتَ وَلِيُّهَا وَمَوْلَاهَا`,
    latin: `Allāhumma innī a'ūdhu bika min 'ilmin lā yanfa', wa min qalbin lā yakhsha', wa min nafsin lā tashba', wa min da'watin lā yustajābu lahā.

Allāhumma innī a'ūdhu bika min 'adhābi jahannam, wa min 'adhābil-qabr, wa min fitnatil-maḥyā wal-mamāt, wa min sharri fitnatil-masīḥid-dajjāl.

Allāhumma innī a'ūdhu bika minal-'ajzi wal-kasal, wal-jubni wal-bukhl, wal-harami wa 'adhābil-qabr.

Allāhumma āti nafsī taqwāhā, wa zakkihā anta khayru man zakkāhā, anta waliyyuhā wa mawlāhā.`,
    translation_id: "Ya Allah, aku berlindung kepada-Mu dari ilmu yang tidak bermanfaat, dari hati yang tidak khusyuk, dari jiwa yang tidak pernah puas, dan dari doa yang tidak dikabulkan. Ya Allah, aku berlindung kepada-Mu dari azab neraka Jahannam, azab kubur, fitnah kehidupan dan kematian, serta dari kejahatan fitnah Dajjal. Ya Allah, aku berlindung kepada-Mu dari kelemahan dan kemalasan, dari sifat pengecut dan kikir, dari kepikunan dan azab kubur. Ya Allah, berikanlah ketakwaan kepada jiwaku, sucikanlah ia, Engkaulah sebaik-baik yang menyucikannya, Engkaulah pelindung dan penguasanya.",
    source: "HR Muslim",
    tags: ["perlindungan", "komprehensif", "azab", "fitnah", "takwa"],
    favorite: true
  },
  {
    id: "18",
    title: "Doa Istikharah: Meminta Pilihan Terbaik dari Allah",
    category: "Doa Mustajab",
    kaidah: "Dibaca setelah shalat istikharah 2 rakaat sunnah untuk meminta petunjuk dalam mengambil keputusan penting. Sebutkan hajat spesifik saat membaca 'hādzal-amr'.",
    arabic: "اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ، وَأَنْتَ عَلَّامُ الْغُيُوبِ. اللَّهُمَّ إِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الْأَمْرَ خَيْرٌ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي - أَوْ قَالَ: عَاجِلِ أَمْرِي وَآجِلِهِ - فَاقْدُرْهُ لِي وَيَسِّرْهُ لِي ثُمَّ بَارِكْ لِي فِيهِ، وَإِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الْأَمْرَ شَرٌّ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي - أَوْ قَالَ: فِي عَاجِلِ أَمْرِي وَآجِلِهِ - فَاصْرِفْهُ عَنِّي وَاصْرِفْنِي عَنْهُ، وَاقْدُرْ لِيَ الْخَيْرَ حَيْثُ كَانَ، ثُمَّ أَرْضِنِي بِهِ",
    latin: "Allāhumma innī astakhīruka bi-'ilmik, wa astaqdiruka bi-qudratik, wa as'aluka min fadhlikal-'azhīm. Fa-innaka taqdiru wa lā aqdiru, wa ta'lamu wa lā a'lamu, wa anta 'allāmul-ghuyūb. Allāhumma in kunta ta'lamu anna hādzal-amra khayrun lī fī dīnī wa ma'āshī wa 'āqibati amrī (aw qāla: 'ājili amrī wa ājilih), faqdurhu lī wa yassirhu lī thumma bārik lī fīh. Wa in kunta ta'lamu anna hādzal-amra sharrun lī fī dīnī wa ma'āshī wa 'āqibati amrī (aw qāla: fī 'ājili amrī wa ājilih), fashrifhu 'annī washrifnī 'anhu, waqdur liyal-khayra haythu kāna, thumma arḍinī bih.",
    translation_id: "Ya Allah, sesungguhnya aku memohon pilihan yang baik kepada-Mu dengan ilmu-Mu, aku memohon kekuatan kepada-Mu dengan kuasa-Mu, dan aku meminta kepada-Mu dari karunia-Mu yang agung. Karena sesungguhnya Engkau Mahakuasa sedangkan aku tidak kuasa, Engkau Maha Mengetahui sedangkan aku tidak mengetahui, dan Engkaulah Yang Maha Mengetahui hal-hal yang gaib. Ya Allah, jika Engkau mengetahui bahwa urusan ini (sebutkan hajatnya) baik bagiku dalam agamaku, kehidupanku, dan akibat urusanku—atau dia mengatakan: untuk urusan dunia dan akhiratku—maka takdirkanlah ia untukku, mudahkanlah untukku, kemudian berkahilah ia bagiku. Dan jika Engkau mengetahui bahwa urusan ini buruk bagiku dalam agamaku, kehidupanku, dan akibat urusanku—atau dia mengatakan: untuk urusan dunia dan akhiratku—maka palingkanlah ia dariku dan palingkanlah aku darinya, serta takdirkanlah kebaikan untukku di mana pun adanya, kemudian jadikanlah aku ridha dengannya.",
    source: "HR Bukhari",
    tags: ["istikharah", "pilihan", "petunjuk", "keputusan", "shalat-sunnah"],
    favorite: true
  },
  {
    id: "19",
    title: "Doa Memohon Petunjuk & Kemudahan Urusan",
    category: "Doa Harian",
    kaidah: "Doa komprehensif meminta petunjuk, taufik, istiqamah, dan kemudahan dalam segala urusan.",
    arabic: `اللَّهُمَّ اهْدِنِي وَسَدِّدْنِي

اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالسَّدَادَ

رَبِّ اشْرَحْ لِي صَدْرِي • وَيَسِّرْ لِي أَمْرِي • وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي • يَفْقَهُوا قَوْلِي

اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا`,
    latin: `Allāhumahdini wa saddidnī.

Allāhumma innī as'alukal-hudā was-sadād.

Rabbish-raḥ lī shadrī, wa yassir lī amrī, waḥlul 'uqdatan min lisānī, yafqahū qawlī.

Allāhumma lā sahla illā mā ja'altahu sahlā, wa anta taj'alul-ḥazna idzā shi'ta sahlā.`,
    translation_id: "Ya Allah, berilah aku petunjuk dan tetapkanlah aku. Ya Allah, aku memohon kepada-Mu petunjuk dan ketetapan. Ya Tuhanku, lapangkanlah dadaku, mudahkanlah urusanku, dan lepaskanlah kekakuan dari lidahku agar mereka mengerti perkataanku. Ya Allah, tidak ada yang mudah kecuali yang Engkau jadikan mudah, dan Engkau menjadikan kesulitan, jika Engkau kehendaki, menjadi mudah.",
    source: "HR Muslim, QS Taha:25-28, HR Ibnu Hibban",
    tags: ["petunjuk", "kemudahan", "hidayah", "urusan", "harian"],
    favorite: true
  },
  {
    id: "20",
    title: "Doa Kehidupan & Kematian Yang Baik",
    category: "Doa Inti",
    kaidah: "Memohon agar hidup dan mati dalam kebaikan, dijadikan hidup sebagai tambahan kebaikan dan mati sebagai istirahat dari kejahatan.",
    arabic: `اللَّهُمَّ أَحْيِنِي مَا كَانَتِ الْحَيَاةُ خَيْرًا لِي، وَتَوَفَّنِي إِذَا كَانَتِ الْوَفَاةُ خَيْرًا لِي

اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي، وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي، وَأَصْلِحْ لِي آخِرَتِي الَّتِي فِيهَا مَعَادِي، وَاجْعَلِ الْحَيَاةَ زِيَادَةً لِي فِي كُلِّ خَيْرٍ، وَاجْعَلِ الْمَوْتَ رَاحَةً لِي مِنْ كُلِّ شَرٍّ`,
    latin: `Allāhumma aḥyinī mā kānatil-ḥayātu khayran lī, wa tawaffanī idzā kānatil-wafātu khayran lī.

Allāhumma aṣliḥ lī dīnī alladzī huwa 'ishmatu amrī, wa aṣliḥ lī dunyāya allatī fīhā ma'āshī, wa aṣliḥ lī ākhiratī allatī fīhā ma'ādī, waj'alil-ḥayāta ziyādatan lī fī kulli khayr, waj'alil-mawta rāḥatan lī min kulli sharr.`,
    translation_id: "Ya Allah, hidupkanlah aku selama hidup itu baik bagiku, dan wafatkanlah aku jika kematian itu baik bagiku. Ya Allah, perbaikilah agamaku yang menjadi pelindung segala urusanku, perbaikilah duniaku yang menjadi tempat kehidupanku, perbaikilah akhiratku yang menjadi tempat kembaliku, jadikanlah hidup sebagai tambahan kebaikan bagiku, dan jadikanlah mati sebagai istirahat bagiku dari segala keburukan.",
    source: "HR Bukhari, Muslim",
    tags: ["kehidupan", "kematian", "dunia", "akhirat", "kebaikan"],
    favorite: true
  },
  {
    id: "21",
    title: "Doa Penutup Majelis (Kaffāratul Majlis)",
    category: "Doa Harian",
    kaidah: "Dibaca di akhir majelis/pertemuan untuk menghapus dosa percakapan yang tidak bermanfaat.",
    arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ",
    latin: "Subḥānakal-lāhumma wa biḥamdik, ashhadu an lā ilāha illā ant, astaghfiruka wa atūbu ilayk.",
    translation_id: "Mahasuci Engkau ya Allah, dengan memuji-Mu aku bersaksi bahwa tiada sesembahan yang haq kecuali Engkau, aku memohon ampun dan bertaubat kepada-Mu.",
    source: "HR Abu Dawud, Tirmidzi, Nasa'i",
    tags: ["penutup", "majelis", "pengampunan", "harian"],
    favorite: true
  }
];

/**
 * Total: 21 doa lengkap dan detail
 * 1-6: Zikir dan doa dasar setelah shalat
 * 7: Shalawat Ibrahimiyah
 * 8: Doa Jawami'ul Kalim
 * 9: Doa Super Komprehensif dengan 99 Asmaul Husna
 * 10-12: Doa inti (rahmat, tawakal, pertolongan)
 * 13-15: Doa gabungan (hidayah/akhlak, rezeki/ilmu, keluarga)
 * 16-21: Doa tambahan penting
 */
export const initialPrayerData = fullDetailedPrayerData;