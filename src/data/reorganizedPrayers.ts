import { Item } from '@/types';

/**
 * Dataset doa yang sudah direorganisasi dan digabungkan
 * Total doa lebih ringkas dan terstruktur
 */
export const reorganizedPrayerData: Partial<Item>[] = [
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
    id: "8",
    title: "Doa Super Komprehensif dengan Asmaul Husna (Gabungan Lengkap)",
    category: "Doa Komprehensif",
    kaidah: "Doa gabungan lengkap yang mencakup: ampunan total, rezeki halal berlimpah, kesehatan, penyembuhan 7x, keimanan, umur berkah, karir sukses, keturunan saleh, perlindungan menyeluruh, dan keselamatan dunia akhirat. Dibaca dengan penuh keyakinan.",
    arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ\n\n(Doa gabungan dalam Bahasa Indonesia & Arab)",
    latin: `Bismillāhir-Raḥmānir-Raḥīm.

[BAGIAN 1: PENGAMPUNAN MENYELURUH]
Ya Allah, dengan seluruh Asmaul Husna-Mu, aku datang sebagai hamba yang lemah dan penuh dosa. Engkau Al-Ghaffār, Al-Ghafūr, At-Tawwāb, Al-'Afuww, Ar-Ra'ūf.

اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا، وَلَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ، فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ، وَارْحَمْنِي، إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ

"Ya Allah, sesungguhnya aku telah banyak menzalimi diriku, tidak ada yang mengampuni dosa kecuali Engkau, maka ampunilah aku dengan ampunan dari sisi-Mu dan rahmatilah aku."

اللَّهُمَّ اغْفِرْ لِي خَطِيئَتِي وَجَهْلِي، وَإِسْرَافِي فِي أَمْرِي، وَمَا أَنْتَ أَعْلَمُ بِهِ مِنِّي

"Ya Allah, ampunilah kesalahanku dan ketidaktahuanku, sikap berlebih-lebihanku dalam segala urusanku."

[BAGIAN 2: PENYEMBUHAN & KESEHATAN]
Ya Allah Asy-Syāfī, Al-Ḥafīẓ, As-Salām:

أَسْأَلُ اللَّهَ الْعَظِيمَ، رَبَّ الْعَرْشِ الْعَظِيمِ، أَنْ يَشْفِيَنِي (٧x)

"Aku memohon kepada Allah Yang Maha Agung, Tuhan yang memiliki 'Arsy yang agung, agar menyembuhkanku" (dibaca 7x)

Berikan kami kesehatan lahir batin, mata yang kuat, jantung yang sehat, tubuh yang bugar. Lindungi dari segala penyakit berat.

[BAGIAN 3: REZEKI HALAL & BERLIMPAH]
Ya Allah Ar-Razzāq, Al-Wahhāb, Al-Ghanī, Al-Mughnī, Al-Fattāḥ, Al-Karīm:

اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ

"Ya Allah, cukupkan aku dengan yang halal dari-Mu sehingga tidak memerlukan yang haram, dan jadikanlah aku kaya karena karunia-Mu, bukan karena selain-Mu."

Berikan rezeki yang sangat luas, halal, dan berkah. Jauhkan dari riba, korupsi, dan semua pintu haram. Jadikan harta di tangan kami, bukan di hati kami.

[BAGIAN 4: IMAN, UMUR BERKAH & KELUARGA]
يَا رَبِّ، يَا اللَّهُ، نَسْأَلُكَ أَنْ تَزِيدَنَا إِيمَانًا، وَأَنْ تُبَارِكَ لَنَا فِي أَعْمَارِنَا، وَأَنْ تُصِحَّ أَبْدَانَنَا، وَأَنْ تُوَسِّعَ أَرْزَاقَنَا

"Ya Rabb, Ya Allah, kami memohon agar Engkau tambahkan keimanan kami, berkahilah umur kami, berikan tubuh yang sehat, lapangkan rezeki kami."

رَبِّ لَا تَذَرْنِي فَرْدًا وَأَنْتَ خَيْرُ الْوَارِثِينَ

"Ya Tuhanku, janganlah Engkau biarkan aku hidup seorang diri, Engkaulah pewaris yang paling baik" (QS Al-Anbiya: 89)

[BAGIAN 5: DOA MEMAKSA LANGIT - CAHAYA WAJAH ALLAH]
اللَّهُمَّ إِنِّي أَسْأَلُكَ بِنُورِ وَجْهِكَ الَّذِي أَشْرَقَتْ لَهُ السَّمَاوَاتُ وَالْأَرْضُ

"Ya Allah, aku memohon kepada-Mu dengan cahaya wajah-Mu yang menerangi langit dan bumi..."

[BAGIAN 6: KARIR & PEKERJAAN]
Ya Allah, berikan kami pekerjaan terbaik yang halal dan berkah. Mudahkan urusan kami:

اَللّٰهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الحَزْنَ إِذَا شِئْتَ سَهْلًا

"Ya Allah, tidak ada yang mudah kecuali yang Engkau jadikan mudah."

رَبِّ اشْرَحْ لِي صَدْرِي • وَيَسِّرْ لِي أَمْرِي

"Ya Tuhanku, lapangkanlah dadaku, mudahkanlah urusanku."

[BAGIAN 7: PERLINDUNGAN MENYELURUH]
اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عِلْمٍ لَا يَنْفَعُ، وَمِنْ قَلْبٍ لَا يَخْشَعُ، وَمِنْ نَفْسٍ لَا تَشْبَعُ، وَمِنْ دَعْوَةٍ لَا يُسْتَجَابُ لَهَا

"Ya Allah, aku berlindung dari ilmu yang tidak bermanfaat, hati yang tidak khusyuk, jiwa yang tidak pernah puas, dan doa yang tidak dikabulkan."

[BAGIAN 8: KESELAMATAN DUNIA AKHIRAT]
رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ

"Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan jagalah kami dari azab neraka."

[PENUTUP]
Engkau berfirman 'Kun' maka 'Fayakūn'. Kabulkan seluruh doa ini dengan cara terbaik-Mu.

آمِينَ آمِينَ آمِينَ يَا رَبَّ الْعَالَمِينَ
يَا أَرْحَمَ الرَّاحِمِينَ`,
    translation_id: `Doa super komprehensif yang menggabungkan:
1. Ampunan total dari segala dosa
2. Penyembuhan dari penyakit (dibaca 7x)
3. Rezeki halal yang berlimpah
4. Tambahan iman dan umur berkah
5. Keturunan saleh (doa Nabi Zakaria)
6. Doa dengan cahaya wajah Allah (memaksa langit)
7. Karir dan pekerjaan sukses
8. Perlindungan dari 4 hal buruk
9. Keselamatan dunia akhirat

Semua dengan menyebut Asmaul Husna yang sesuai untuk setiap permohonan.`,
    source: "Gabungan dari HR Bukhari, Muslim, Abu Dawud, Tirmidzi, Ibnu Majah, dan ayat-ayat Al-Quran",
    tags: ["super-komprehensif", "asmaul-husna", "gabungan", "ampunan", "rezeki", "kesehatan", "karir", "perlindungan"],
    favorite: true
  },
  {
    id: "9",
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
    id: "10",
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
    id: "11",
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

  // === DOA GABUNGAN URUTAN 12 ===
  {
    id: "12",
    title: "Doa Hidayah, Takwa & Akhlak Mulia (Gabungan)",
    category: "Doa Iman & Akhlak",
    kaidah: "Gabungan doa-doa untuk hidayah, ketetapan hati, takwa, iffah, ghina, dan perbaikan akhlak.",
    arabic: `يَا مُقَلِّبَ الْقُلُوبِ، ثَبِّتْ قَلْبِي عَلَى دِينِكَ

رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ

اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى

اللَّهُمَّ آتِ نَفْسِي تَقْوَاهَا، وَزَكِّهَا أَنْتَ خَيْرُ مَنْ زَكَّاهَا

اللَّهُمَّ اجْعَلِ الْقُرْآنَ رَبِيعَ قَلْبِي، وَنُورَ صَدْرِي

رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ وَلَا تَجْعَلْ فِي قُلُوبِنَا غِلًّا لِلَّذِينَ آمَنُوا

اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي، وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي، وَأَصْلِحْ لِي آخِرَتِي الَّتِي فِيهَا مَعَادِي

رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا

رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ`,
    latin: `Yā Muqallibal-qulūb, ṯabbit qalbī 'alā dīnik
Rabbanā lā tuzigh qulūbanā ba'da idh hadaytanā...
Allāhumma innī as'alukal-hudā wat-tuqā wal-'afāfa wal-ghinā
Allāhumma āti nafsī taqwāhā, wa zakkihā...
Allāhummaj'alil-Qur'āna rabī'a qalbī...
Rabbanaghfir lanā wa li-ikhwāninā...
Allāhumma aṣliḥ lī dīnī...
Raḍītu billāhi rabbā...
Rabbanā ẓalamnā anfusanā...`,
    translation_id: `Gabungan doa mencakup:
- Ketetapan hati di atas agama
- Hidayah dan jangan dipalingkan setelah diberi petunjuk
- Memohon hidayah, takwa, kehormatan diri, kecukupan
- Jiwa yang bertakwa dan disucikan
- Al-Quran sebagai musim semi hati
- Bersih dari dengki terhadap sesama muslim
- Perbaikan agama, dunia, dan akhirat
- Ridha dengan ketetapan Allah
- Taubat Nabi Adam`,
    source: "Gabungan dari HR Tirmidzi, Muslim, Ahmad, dan ayat-ayat Al-Quran",
    tags: ["hidayah", "takwa", "akhlak", "ketetapan-hati", "gabungan"],
    favorite: true
  },

  // === DOA URUTAN 13 (ID 27 & 61) ===
  {
    id: "13",
    title: "Doa Rezeki Halal, Cukup & Rizki Pagi (Gabungan)",
    category: "Doa Rezeki & Kerja",
    kaidah: "Gabungan doa memohon rezeki halal, kecukupan, dan fondasi pagi dengan ilmu, rezeki, amal.",
    arabic: `اَللّٰهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ

اَللّٰهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا

بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ`,
    latin: `Allāhumma ikfinī biḥalālika 'an ḥarāmik, wa aghninī bi-faḍlika 'amman siwāk
Allāhumma innī as'aluka 'ilman nāfi'an, wa rizqan ṭayyiban, wa 'amalan mutaqabbalan
Bismillāhi tawakkaltu 'alallāh, lā ḥawla wa lā quwwata illā billāh`,
    translation_id: `"Ya Allah, cukupkan aku dengan yang halal hingga tak butuh pada yang haram; kayakan aku dengan karunia-Mu hingga tak bergantung pada selain-Mu."
"Ya Allah, aku memohon ilmu yang bermanfaat, rezeki yang baik, dan amal yang Engkau terima."
"Dengan nama Allah, aku bertawakal kepada Allah; tiada daya dan kekuatan kecuali dengan Allah."`,
    source: "HR Tirmidzi, Ibnu Majah, Abu Dawud",
    tags: ["rezeki", "halal", "ilmu", "amal", "pagi", "tawakal"],
    favorite: true
  },

  // === DOA URUTAN 14 (ID 32, 33, 34, 56, 58, 60) ===
  {
    id: "14",
    title: "Doa Keluarga Sakinah & Keturunan Saleh (Gabungan)",
    category: "Doa Keluarga",
    kaidah: "Gabungan doa untuk keluarga harmonis, istri dan anak penyejuk hati, istiqamah shalat, bakti orang tua.",
    arabic: `رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا

رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ

رَبِّ هَبْ لِي مِن لَّدُنْكَ ذُرِّيَّةً طَيِّبَةً إِنَّكَ سَمِيعُ الدُّعَاءِ

رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا

اللَّهُمَّ إِنِّي أَسْأَلُكَ أَنْ تُبَارِكَ لِي فِي أَهْلِي وَمَالِي

اللَّهُمَّ اجْمَعْ بَيْنَنَا فِي الْجَنَّةِ`,
    latin: `Rabbanā hablana min azwājinā wa dhurriyyātinā qurrata a'yun...
Rabbij'alnī muqīmaṣ-ṣalāti wa min dhurriyyatī...
Rabbi hab lī min ladunka dhurriyyatan ṭayyibah...
Rabbirḥamhumā kamā rabbayānī ṣaghīrā
Allāhumma innī as'aluka an tubārika lī fī ahlī wa mālī
Allāhummajma' baynanā fil-jannah`,
    translation_id: `"Ya Tuhan kami, anugerahkan kepada kami pasangan dan keturunan yang menjadi penyejuk hati, dan jadikan kami pemimpin bagi orang-orang bertakwa."
"Ya Tuhanku, jadikanlah aku dan keturunanku orang-orang yang mendirikan shalat."
"Ya Tuhanku, berilah aku keturunan yang baik dari sisi-Mu."
"Ya Tuhanku, sayangilah keduanya (orang tua) sebagaimana mereka mendidikku ketika kecil."
"Ya Allah, berkahilah keluarga dan hartaku."
"Ya Allah, kumpulkan kami di surga."`,
    source: "QS Al-Furqan:74, Ibrahim:40, Ali 'Imran:38, Al-Isra:24",
    tags: ["keluarga", "pasangan", "keturunan", "orang-tua", "sakinah"],
    favorite: true
  },

  // === DOA-DOA TAMBAHAN PENTING ===
  {
    id: "15",
    title: "Doa Keluar Rumah & Masuk Tempat Kerja",
    category: "Doa Aktivitas Harian",
    kaidah: "Perlindungan saat keluar rumah dan memohon kebaikan tempat kerja.",
    arabic: `بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ

اَللّٰهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذَا السُّوقِ وَخَيْرَ مَا فِيهِ، وَأَعُوذُ بِكَ مِنْ شَرِّهِ وَشَرِّ مَا فِيهِ`,
    latin: `Bismillāhi tawakkaltu 'alallāh, lā ḥawla wa lā quwwata illā billāh
Allāhumma innī as'aluka khayra hādzas-sūqi wa khayra mā fīh...`,
    translation_id: "Dengan nama Allah, aku bertawakal kepada Allah. Ya Allah, aku memohon kebaikan tempat ini dan berlindung dari keburukannya.",
    source: "HR Abu Dawud, Ibnu Majah",
    tags: ["keluar-rumah", "kerja", "perlindungan"],
    favorite: true
  },
  {
    id: "16",
    title: "Empat Perlindungan dalam Tasyahud Akhir",
    category: "Doa Perlindungan",
    kaidah: "Wajib dibaca sebelum salam agar terjaga dari neraka, azab kubur, fitnah hidup-mati, dan Dajjal.",
    arabic: "اَللّٰهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ، وَمِنْ عَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ",
    latin: "Allāhumma innī a'ūdhu bika min 'adzābi jahannam, wa min 'adzābil-qabr, wa min fitnatil-maḥyā wal-mamāt, wa min sharri fitnatil-Masīḥid-Dajjāl.",
    translation_id: "Ya Allah, aku berlindung kepada-Mu dari azab neraka Jahannam, azab kubur, fitnah kehidupan dan kematian, serta dari kejahatan fitnah Dajjal.",
    source: "HR Muslim.",
    tags: ["perlindungan", "shalat", "tasyahud", "wajib"],
    favorite: true
  },
  {
    id: "17",
    title: "Doa 'Afiyah: Kesehatan & Keselamatan Menyeluruh",
    category: "Doa Perlindungan",
    kaidah: "Dibaca pagi dan petang untuk meminta ampunan serta keselamatan dunia-akhirat.",
    arabic: "اَللّٰهُمَّ إِنِّي أَسْأَلُكَ العَفْوَ وَالعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
    latin: "Allāhumma innī as'alukal-'afwa wal-'āfiyata fid-dunyā wal-ākhirah.",
    translation_id: "Ya Allah, aku memohon ampunan dan afiyah (kesehatan, keselamatan, kesejahteraan) di dunia dan akhirat.",
    source: "HR Tirmidzi.",
    tags: ["afiyah", "kesehatan", "perlindungan", "pagi-petang"],
    favorite: true
  },
  {
    id: "18",
    title: "Perlindungan Indera Pagi & Petang",
    category: "Dzikir Pagi & Petang",
    kaidah: "Dibaca 3x pagi dan 3x petang untuk meminta afiyah pada badan, pendengaran, dan penglihatan.",
    arabic: "اَللّٰهُمَّ إِنِّي أَسْأَلُكَ العَافِيَةَ فِي بَدَنِي، اَللّٰهُمَّ إِنِّي أَسْأَلُكَ العَافِيَةَ فِي سَمْعِي، اَللّٰهُمَّ إِنِّي أَسْأَلُكَ العَافِيَةَ فِي بَصَرِي، لَا إِلٰهَ إِلَّا أَنْتَ",
    latin: "Allāhumma innī as'alukal-'āfiyata fī badanī, Allāhumma innī as'alukal-'āfiyata fī sam'ī, Allāhumma innī as'alukal-'āfiyata fī baṣarī, lā ilāha illā anta.",
    translation_id: "Ya Allah, aku memohon afiyah pada badanku, pendengaranku, dan penglihatanku. Tiada sesembahan selain Engkau.",
    source: "HR Abu Dawud.",
    tags: ["afiyah", "indera", "perlindungan", "pagi", "petang", "hitungan"],
    favorite: true
  },
  {
    id: "19",
    title: "Perlindungan dari Segala Arah",
    category: "Doa Perlindungan",
    kaidah: "Memohon keselamatan dari bahaya yang datang dari depan, belakang, kanan, kiri, atas, dan bawah.",
    arabic: "اَللّٰهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ بَيْنِ يَدَيَّ، وَمِنْ خَلْفِي، وَعَنْ يَمِينِي، وَعَنْ شِمَالِي، وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي",
    latin: "Allāhumma innī a'ūdhu bika min bayni yadayya, wa min khalfī, wa 'an yamīnī, wa 'an shimālī, wa min fawqī, wa a'ūdhu bi'azhmatika an ughtāla min taḥtī.",
    translation_id: "Ya Allah, aku berlindung kepada-Mu dari (bahaya) di depanku, belakangku, kananku, kiriku, dan atasku. Aku berlindung dengan keagungan-Mu agar tidak disambar dari bawahku.",
    source: "HR Abu Dawud.",
    tags: ["perlindungan", "bahaya", "keselamatan", "harian"],
    favorite: true
  },
  {
    id: "20",
    title: "Doa Istikharah: Meminta Pilihan Terbaik",
    category: "Doa Mustajab",
    kaidah: "Dibaca setelah shalat istikharah 2 rakaat untuk meminta petunjuk dalam mengambil keputusan penting.",
    arabic: "اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ...",
    latin: "Allāhumma innī astakhīruka bi-'ilmik, wa astaqdiruka bi-qudratik...",
    translation_id: "Ya Allah, aku mohon pilihan yang baik kepada-Mu dengan ilmu-Mu, aku mohon kekuatan dengan kuasa-Mu... [Doa lengkap istikharah]",
    source: "HR Bukhari",
    tags: ["istikharah", "pilihan", "keputusan", "petunjuk"],
    favorite: true
  }
];

/**
 * Export the reorganized prayer data as the main data source
 */
export const initialPrayerData = reorganizedPrayerData;