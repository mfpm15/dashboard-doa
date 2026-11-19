/* Arabic follows the linked narration. Latin and Indonesian are reading aids. */
(() => {
  const items = [];
  function add(id, category, title, source, arabic, latin, meaning, when, { note = '', keywords = '', grade = 'sahih' } = {}) {
    const [reference, url] = source;
    items.push({ id: 'nabi-' + id, category, title, kind: 'Hadis ' + grade, reference, url, arabic, latin, meaning, when, note, keywords });
  }

  add('utang-uhud', 'utang', 'Doa pelunasan utang sebesar Gunung Uhud',
    ['HR Ath-Thabrani, Al-Mu‘jam Ash-Shaghir 558 · hasan menurut Al-Albani (Shahih At-Targhib 1821)', 'https://dorar.net/h/tamWd7TA?osoul=1'],
    'اللَّهُمَّ مَالِكَ الْمُلْكِ تُؤْتِي الْمُلْكَ مَنْ تَشَاءُ، وَتَنْزِعُ الْمُلْكَ مِمَّنْ تَشَاءُ، وَتُعِزُّ مَنْ تَشَاءُ، وَتُذِلُّ مَنْ تَشَاءُ، بِيَدِكَ الْخَيْرُ إِنَّكَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. رَحْمَنَ الدُّنْيَا وَالْآخِرَةِ وَرَحِيمَهُمَا، تُعْطِيهِمَا مَنْ تَشَاءُ، وَتَمْنَعُ مِنْهُمَا مَنْ تَشَاءُ، ارْحَمْنِي رَحْمَةً تُغْنِينِي بِهَا عَنْ رَحْمَةِ مَنْ سِوَاكَ.',
    'Allāhumma mālikal-mulki, tu’til-mulka man tasyā’u, wa tanzi‘ul-mulka mimman tasyā’u, wa tu‘izzu man tasyā’u, wa tudzillu man tasyā’u. Biyadikal-khairu, innaka ‘alā kulli syai’in qadīr. Raḥmānad-dunyā wal-ākhirati wa raḥīmahumā, tu‘ṭīhimā man tasyā’u, wa tamna‘u minhumā man tasyā’u. Irḥamnī raḥmatan tughnīnī bihā ‘an raḥmati man siwāk.',
    'Ya Allah, Pemilik segala kerajaan. Engkau memberi dan mencabut kekuasaan dari siapa yang Engkau kehendaki. Engkau memuliakan dan merendahkan siapa yang Engkau kehendaki. Segala kebaikan berada di tangan-Mu dan Engkau Mahakuasa atas segala sesuatu. Wahai Yang Maha Pengasih lagi Maha Penyayang di dunia dan akhirat, Engkau memberi dan menahan bagian keduanya bagi siapa yang Engkau kehendaki. Rahmatilah aku dengan rahmat yang mencukupkanku dari rahmat selain-Mu.',
    'Saat memohon pertolongan untuk menyelesaikan utang.',
    { grade: 'hasan', keywords: 'malikal mulki malik al mulk gunung uhud pelunas hutang muadz muaz', note: 'Diriwayatkan dari Anas bin Malik sebagai doa yang diajarkan kepada Mu‘adz bin Jabal. Lafaz mengikuti versi yang dinilai hasan oleh Al-Albani.' });

  add('utang-sebelum-tidur', 'utang', 'Doa sebelum tidur untuk pelunasan utang',
    ['HR Muslim 2713a', 'https://sunnah.com/muslim:2713a'],
    'اللَّهُمَّ رَبَّ السَّمَاوَاتِ وَرَبَّ الْأَرْضِ وَرَبَّ الْعَرْشِ الْعَظِيمِ، رَبَّنَا وَرَبَّ كُلِّ شَيْءٍ، فَالِقَ الْحَبِّ وَالنَّوَى، وَمُنْزِلَ التَّوْرَاةِ وَالْإِنْجِيلِ وَالْفُرْقَانِ، أَعُوذُ بِكَ مِنْ شَرِّ كُلِّ شَيْءٍ أَنْتَ آخِذٌ بِنَاصِيَتِهِ. اللَّهُمَّ أَنْتَ الْأَوَّلُ فَلَيْسَ قَبْلَكَ شَيْءٌ، وَأَنْتَ الْآخِرُ فَلَيْسَ بَعْدَكَ شَيْءٌ، وَأَنْتَ الظَّاهِرُ فَلَيْسَ فَوْقَكَ شَيْءٌ، وَأَنْتَ الْبَاطِنُ فَلَيْسَ دُونَكَ شَيْءٌ، اقْضِ عَنَّا الدَّيْنَ وَأَغْنِنَا مِنَ الْفَقْرِ.',
    'Allāhumma rabbas-samāwāti wa rabbal-arḍi wa rabbal-‘arsyil-‘aẓīm. Rabbanā wa rabba kulli syai’in, fāliqal-ḥabbi wan-nawā, wa munzilat-taurāti wal-injīli wal-furqān. A‘ūdzu bika min syarri kulli syai’in anta ākhidzun bināṣiyatih. Allāhumma antal-awwalu fa laisa qablaka syai’, wa antal-ākhiru fa laisa ba‘daka syai’, wa antaẓ-ẓāhiru fa laisa fauqaka syai’, wa antal-bāṭinu fa laisa dūnaka syai’. Iqḍi ‘annad-daina wa aghninā minal-faqr.',
    'Ya Allah, Tuhan langit, bumi, dan Arasy yang agung. Tuhan kami dan Tuhan segala sesuatu, Yang membelah biji dan benih serta menurunkan Taurat, Injil, dan Al-Furqan. Aku berlindung kepada-Mu dari keburukan setiap makhluk yang berada dalam kuasa-Mu. Ya Allah, Engkau Yang Awal, tiada sesuatu sebelum-Mu. Engkau Yang Akhir, tiada sesuatu sesudah-Mu. Engkau Yang Zahir, tiada sesuatu di atas-Mu. Engkau Yang Batin, tiada sesuatu yang lebih dekat daripada-Mu. Lunasilah utang kami dan cukupkanlah kami dari kefakiran.',
    'Menjelang tidur, saat berbaring pada sisi kanan.',
    { keywords: 'pelunas hutang kemiskinan faqir awwal akhir iqdi annad dain' });

  add('utang-kecemasan', 'utang', 'Berlindung dari kecemasan, kesedihan, dan beban utang',
    ['HR Bukhari 6369', 'https://sunnah.com/bukhari:6369'],
    'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْجُبْنِ وَالْبُخْلِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ.',
    'Allāhumma innī a‘ūdzu bika minal-hammi wal-ḥazani, wal-‘ajzi wal-kasali, wal-jubni wal-bukhli, wa ḍala‘id-daini, wa ghalabatir-rijāl.',
    'Ya Allah, aku berlindung kepada-Mu dari kecemasan dan kesedihan, kelemahan dan kemalasan, sifat pengecut dan kikir, beban utang yang menghimpit, dan penguasaan orang lain.',
    'Doa perlindungan yang biasa dibaca Nabi ﷺ.',
    { keywords: 'hutang galau susah hati himpitan utang' });

  add('utang-dosa', 'utang', 'Berlindung dari dosa dan utang dalam salat',
    ['HR Bukhari 832', 'https://sunnah.com/bukhari:832'],
    'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، وَأَعُوذُ بِكَ مِنْ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ، وَأَعُوذُ بِكَ مِنْ فِتْنَةِ الْمَحْيَا وَفِتْنَةِ الْمَمَاتِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْمَأْثَمِ وَالْمَغْرَمِ.',
    'Allāhumma innī a‘ūdzu bika min ‘adzābil-qabr, wa a‘ūdzu bika min fitnatil-masīḥid-dajjāl, wa a‘ūdzu bika min fitnatil-maḥyā wa fitnatil-mamāt. Allāhumma innī a‘ūdzu bika minal-ma’tsami wal-maghram.',
    'Ya Allah, aku berlindung kepada-Mu dari azab kubur, fitnah Al-Masih Dajjal, serta ujian hidup dan mati. Ya Allah, aku berlindung kepada-Mu dari dosa dan utang.',
    'Dalam salat, sebagaimana diriwayatkan Aisyah.',
    { keywords: 'hutang salat sholat tasyahud maghram' });

  add('saat-genting', 'utama', 'Zikir ketika menghadapi kesulitan berat',
    ['HR Bukhari 6346', 'https://sunnah.com/bukhari:6346'],
    'لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ.',
    'Lā ilāha illallāhul-‘aẓīmul-ḥalīm. Lā ilāha illallāhu rabbul-‘arsyil-‘aẓīm. Lā ilāha illallāhu rabbus-samāwāti wa rabbul-arḍi wa rabbul-‘arsyil-karīm.',
    'Tiada sembahan yang berhak disembah selain Allah, Yang Mahaagung lagi Maha Penyantun. Tiada sembahan yang berhak disembah selain Allah, Tuhan Arasy yang agung. Tiada sembahan yang berhak disembah selain Allah, Tuhan langit, bumi, dan Arasy yang mulia.',
    'Saat ditimpa kesusahan yang berat.',
    { keywords: 'karb susah gelisah tekanan' });

  add('saat-musibah', 'utama', 'Doa saat musibah dan kehilangan',
    ['HR Muslim 918a', 'https://sunnah.com/muslim:918a'],
    'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ، اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي وَأَخْلِفْ لِي خَيْرًا مِنْهَا.',
    'Innā lillāhi wa innā ilaihi rāji‘ūn. Allāhumma’jurnī fī muṣībatī wa akhlif lī khairan minhā.',
    'Kami adalah milik Allah dan kepada-Nya kami kembali. Ya Allah, berilah aku pahala atas musibahku dan gantilah untukku dengan yang lebih baik.',
    'Ketika mengalami musibah.',
    { keywords: 'duka kehilangan meninggal istirja' });

  add('takwa-dan-hati', 'iman', 'Memohon jiwa yang bertakwa dan hati yang khusyuk',
    ['HR Muslim 2722', 'https://sunnah.com/muslim:2722'],
    'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ وَالْجُبْنِ وَالْبُخْلِ وَالْهَرَمِ وَعَذَابِ الْقَبْرِ. اللَّهُمَّ آتِ نَفْسِي تَقْوَاهَا وَزَكِّهَا أَنْتَ خَيْرُ مَنْ زَكَّاهَا، أَنْتَ وَلِيُّهَا وَمَوْلَاهَا. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عِلْمٍ لَا يَنْفَعُ، وَمِنْ قَلْبٍ لَا يَخْشَعُ، وَمِنْ نَفْسٍ لَا تَشْبَعُ، وَمِنْ دَعْوَةٍ لَا يُسْتَجَابُ لَهَا.',
    'Allāhumma innī a‘ūdzu bika minal-‘ajzi wal-kasali wal-jubni wal-bukhli wal-harami wa ‘adzābil-qabr. Allāhumma āti nafsī taqwāhā wa zakkihā anta khairu man zakkāhā, anta waliyyuhā wa maulāhā. Allāhumma innī a‘ūdzu bika min ‘ilmin lā yanfa‘u, wa min qalbin lā yakhsya‘u, wa min nafsin lā tasyba‘u, wa min da‘watin lā yustajābu lahā.',
    'Ya Allah, aku berlindung kepada-Mu dari kelemahan, kemalasan, sifat pengecut dan kikir, kepikunan, serta azab kubur. Anugerahkan ketakwaan kepada jiwaku dan sucikanlah ia. Engkaulah sebaik-baik yang menyucikannya, pelindung dan penguasanya. Aku juga berlindung kepada-Mu dari ilmu yang tidak bermanfaat, hati yang tidak khusyuk, jiwa yang tidak pernah puas, dan doa yang tidak dikabulkan.',
    'Doa umum untuk memohon ketakwaan dan perlindungan.',
    { note: 'Bacaan ini memuat riwayat lengkap. Bagian akhirnya juga tersedia sebagai bacaan pendek di Doa Pilihan.' });

  add('ampun-abu-bakar', 'ampun', 'Doa ampunan yang diajarkan kepada Abu Bakar',
    ['HR Bukhari 834', 'https://sunnah.com/bukhari:834'],
    'اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا، وَلَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ، فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ وَارْحَمْنِي، إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ.',
    'Allāhumma innī ẓalamtu nafsī ẓulman katsīrā, wa lā yaghfirudz-dzunūba illā anta, faghfir lī maghfiratan min ‘indika warḥamnī, innaka antal-ghafūrur-raḥīm.',
    'Ya Allah, aku telah banyak menzalimi diriku. Hanya Engkau yang mengampuni dosa. Berilah aku ampunan dari sisi-Mu dan rahmatilah aku. Engkaulah Yang Maha Pengampun lagi Maha Penyayang.',
    'Diajarkan untuk dibaca dalam salat.');

  add('ampun-lailatul-qadar', 'ampun', 'Doa Lailatulqadar yang diajarkan kepada Aisyah',
    ['HR Ibnu Majah 3850 · sahih (Darussalam)', 'https://sunnah.com/ibnmajah:3850'],
    'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي.',
    'Allāhumma innaka ‘afuwwun tuḥibbul-‘afwa fa‘fu ‘annī.',
    'Ya Allah, Engkau Maha Pemaaf dan menyukai pemberian maaf. Maafkanlah aku.',
    'Saat mencari Lailatulqadar.',
    { keywords: 'lailatul qadr qadar ramadan malam seribu bulan' });

  add('ampun-sujud', 'ampun', 'Mohon ampun untuk seluruh dosa saat sujud',
    ['HR Muslim 483', 'https://sunnah.com/muslim:483'],
    'اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ وَجِلَّهُ، وَأَوَّلَهُ وَآخِرَهُ، وَعَلَانِيَتَهُ وَسِرَّهُ.',
    'Allāhummaghfir lī dzanbī kullahu, diqqahu wa jillahu, wa awwalahu wa ākhirahu, wa ‘alāniyatahu wa sirrah.',
    'Ya Allah, ampunilah seluruh dosaku, yang kecil dan besar, yang pertama dan terakhir, yang terlihat dan tersembunyi.',
    'Dibaca saat sujud.');

  add('ampun-taubat', 'ampun', 'Istighfar dan permohonan agar taubat diterima',
    ['HR Abu Dawud 1516 · sahih menurut Al-Albani', 'https://sunnah.com/abudawud:1516'],
    'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ، إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ.',
    'Rabbighfir lī wa tub ‘alayya, innaka antat-tawwābur-raḥīm.',
    'Wahai Tuhanku, ampunilah aku dan terimalah taubatku. Engkau Maha Penerima Taubat lagi Maha Penyayang.',
    'Istighfar sehari-hari.',
    { note: 'Ibnu Umar menuturkan bacaan ini terdengar seratus kali dalam satu majelis.' });

  add('sakit-sembuh', 'sakit', 'Memohon kesembuhan bagi orang sakit',
    ['HR Bukhari 5743', 'https://sunnah.com/bukhari:5743'],
    'اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ، اشْفِهِ وَأَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا.',
    'Allāhumma rabban-nāsi adzhibil-ba’sa, isyfihi wa antasy-syāfī, lā syifā’a illā syifā’uka, syifā’an lā yughādiru saqamā.',
    'Ya Allah, Tuhan manusia, hilangkanlah penyakit ini. Sembuhkanlah dia, Engkaulah Yang Maha Menyembuhkan. Tiada kesembuhan kecuali kesembuhan dari-Mu, kesembuhan yang tidak menyisakan penyakit.',
    'Saat mendoakan orang sakit.',
    { keywords: 'ruqyah pengobatan sakit sembuh' });

  add('sakit-nyeri', 'sakit', 'Doa ketika bagian tubuh terasa nyeri',
    ['HR Muslim 2202', 'https://sunnah.com/muslim:2202'],
    'بِاسْمِ اللَّهِ\n\nأَعُوذُ بِاللَّهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ.',
    'Bismillāh.\n\nA‘ūdzu billāhi wa qudratihi min syarri mā ajidu wa uḥādzir.',
    'Dengan nama Allah.\n\nAku berlindung kepada Allah dan dengan kuasa-Nya dari keburukan yang kurasakan dan kukhawatirkan.',
    'Letakkan tangan pada bagian yang sakit. Baca Bismillah tiga kali, lalu kalimat perlindungan tujuh kali.');

  add('sakit-menjenguk', 'sakit', 'Doa ketika menjenguk orang sakit',
    ['HR Abu Dawud 3106 · sahih menurut Al-Albani', 'https://sunnah.com/abudawud:3106'],
    'أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ.',
    'As’alullāhal-‘aẓīma rabbal-‘arsyil-‘aẓīmi an yasyfiyak.',
    'Aku memohon kepada Allah Yang Mahaagung, Tuhan Arasy yang agung, agar Dia menyembuhkanmu.',
    'Ketika menjenguk orang sakit. Riwayat menyebut tujuh kali.');

  add('keluarga-lindungi-anak', 'keluarga', 'Doa perlindungan anak dari setan, bahaya, dan ain',
    ['HR Bukhari 3371', 'https://sunnah.com/bukhari:3371'],
    'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّةِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ، وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ.',
    'A‘ūdzu bikalimātillāhit-tāmmati min kulli syaiṭānin wa hāmmatin, wa min kulli ‘ainin lāmmatin.',
    'Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari setiap setan, makhluk berbahaya, dan pandangan mata yang mencelakakan.',
    'Bacaan yang diriwayatkan ketika Nabi ﷺ memohonkan perlindungan untuk Hasan dan Husain.',
    { keywords: 'anak bayi keluarga ain penyakit mata' });

  add('keluarga-suami-istri', 'keluarga', 'Doa sebelum berhubungan suami istri',
    ['HR Bukhari 141', 'https://sunnah.com/bukhari:141'],
    'بِاسْمِ اللَّهِ، اللَّهُمَّ جَنِّبْنَا الشَّيْطَانَ وَجَنِّبِ الشَّيْطَانَ مَا رَزَقْتَنَا.',
    'Bismillāh, Allāhumma jannibnasy-syaiṭāna wa jannibisy-syaiṭāna mā razaqtanā.',
    'Dengan nama Allah. Ya Allah, jauhkanlah setan dari kami dan dari keturunan yang Engkau karuniakan kepada kami.',
    'Sebelum hubungan suami istri.');

  add('pagi-afiyah', 'pagi', 'Memohon ampun dan keselamatan diri serta keluarga',
    ['HR Abu Dawud 5074 · sahih menurut Al-Albani', 'https://sunnah.com/abudawud:5074'],
    'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي.',
    'Allāhumma innī as’alukal-‘āfiyata fid-dunyā wal-ākhirah. Allāhumma innī as’alukal-‘afwa wal-‘āfiyata fī dīnī wa dunyāya wa ahlī wa mālī. Allāhummastur ‘aurātī wa āmin rau‘ātī. Allāhummaḥfaẓnī min baini yadayya wa min khalfī wa ‘an yamīnī wa ‘an syimālī wa min fauqī, wa a‘ūdzu bi‘aẓamatika an ughtāla min taḥtī.',
    'Ya Allah, aku memohon keselamatan di dunia dan akhirat. Aku memohon maaf dan keselamatan dalam agama, kehidupan dunia, keluarga, dan hartaku. Tutupilah aibku dan tenteramkanlah rasa takutku. Jagalah aku dari depan, belakang, kanan, kiri, dan atas. Aku berlindung dengan keagungan-Mu agar tidak tertimpa bahaya dari bawahku.',
    'Dibaca pada pagi dan petang.');

  add('pagi-bika', 'pagi', 'Doa memasuki pagi',
    ['HR Abu Dawud 5068 · sahih menurut Al-Albani', 'https://sunnah.com/abudawud:5068'],
    'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ.',
    'Allāhumma bika aṣbaḥnā wa bika amsainā, wa bika naḥyā wa bika namūtu wa ilaikan-nusyūr.',
    'Ya Allah, dengan-Mu kami memasuki pagi dan petang, dengan-Mu kami hidup dan mati, dan kepada-Mu kami dibangkitkan.',
    'Ketika memasuki pagi.');

  add('pagi-tasbih-juwairiyah', 'pagi', 'Tasbih yang diajarkan kepada Juwairiyah',
    ['HR Muslim 2726a', 'https://sunnah.com/muslim:2726a'],
    'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ.',
    'Subḥānallāhi wa biḥamdihi, ‘adada khalqihi, wa riḍā nafsihi, wa zinata ‘arsyihi, wa midāda kalimātih.',
    'Mahasuci Allah dan segala puji bagi-Nya, sebanyak makhluk-Nya, sebanyak keridaan-Nya, seberat Arasy-Nya, dan sebanyak tinta bagi kalimat-kalimat-Nya.',
    'Riwayat menyebut tiga kali setelah Subuh.',
    { note: 'Riwayat menceritakan Nabi ﷺ membacanya pada pagi hari setelah meninggalkan tempat salat Juwairiyah.' });

  add('harian-tidur', 'harian', 'Doa sebelum tidur',
    ['HR Bukhari 6324', 'https://sunnah.com/bukhari:6324'],
    'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا.',
    'Bismikallāhumma amūtu wa aḥyā.',
    'Dengan nama-Mu, ya Allah, aku mati dan hidup.',
    'Ketika akan tidur.');

  add('harian-bangun', 'harian', 'Doa bangun tidur',
    ['HR Bukhari 6324', 'https://sunnah.com/bukhari:6324'],
    'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ.',
    'Alḥamdulillāhilladzī aḥyānā ba‘da mā amātanā wa ilaihin-nusyūr.',
    'Segala puji bagi Allah yang menghidupkan kami setelah mematikan kami. Kepada-Nya kami dibangkitkan.',
    'Saat bangun tidur.');

  add('harian-keluar-rumah', 'harian', 'Doa ketika keluar rumah',
    ['HR Abu Dawud 5095 · sahih menurut Al-Albani', 'https://sunnah.com/abudawud:5095'],
    'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ.',
    'Bismillāh, tawakkaltu ‘alallāh, lā ḥaula wa lā quwwata illā billāh.',
    'Dengan nama Allah, aku bertawakal kepada Allah. Tiada daya dan kekuatan kecuali dengan pertolongan Allah.',
    'Ketika keluar rumah.');

  add('harian-makan', 'harian', 'Bismillah sebelum makan dan ketika lupa membacanya',
    ['HR Abu Dawud 3767 · sahih menurut Al-Albani', 'https://sunnah.com/abudawud:3767'],
    'بِسْمِ اللَّهِ\n\nبِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ.',
    'Bismillāh.\n\nBismillāhi awwalahu wa ākhirah.',
    'Dengan nama Allah.\n\nDengan nama Allah pada awal dan akhirnya.',
    'Bacaan pertama saat mulai makan. Bacaan kedua ketika teringat setelah mulai makan.');

  add('harian-masuk-toilet', 'harian', 'Doa sebelum masuk toilet',
    ['HR Bukhari 142', 'https://sunnah.com/bukhari:142'],
    'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ.',
    'Allāhumma innī a‘ūdzu bika minal-khubutsi wal-khabā’its.',
    'Ya Allah, aku berlindung kepada-Mu dari setan laki-laki dan perempuan.',
    'Sebelum masuk tempat buang hajat.',
    { keywords: 'wc kamar mandi kakus' });

  add('harian-keluar-toilet', 'harian', 'Doa setelah keluar toilet',
    ['HR Abu Dawud 30 · sahih menurut Al-Albani', 'https://sunnah.com/abudawud:30'],
    'غُفْرَانَكَ.',
    'Ghufrānak.',
    'Aku memohon ampunan-Mu.',
    'Setelah keluar dari tempat buang hajat.',
    { keywords: 'wc kamar mandi kakus' });

  add('ibadah-azan', 'ibadah', 'Doa setelah mendengar azan',
    ['HR Bukhari 614', 'https://sunnah.com/bukhari:614'],
    'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ.',
    'Allāhumma rabba hādzihid-da‘watit-tāmmati waṣ-ṣalātil-qā’imati, āti Muḥammadanil-wasīlata wal-faḍīlata, wab‘ats-hu maqāman maḥmūdanilladzī wa‘adtah.',
    'Ya Allah, Tuhan seruan yang sempurna ini dan salat yang akan ditegakkan, anugerahkan kepada Muhammad al-wasilah dan keutamaan. Bangkitkan beliau di kedudukan terpuji yang telah Engkau janjikan.',
    'Seusai mendengar azan.',
    { keywords: 'adzan panggilan salat' });

  add('ibadah-iftitah', 'ibadah', 'Doa iftitah setelah takbiratul ihram',
    ['HR Bukhari 744', 'https://sunnah.com/bukhari:744'],
    'اللَّهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ كَمَا بَاعَدْتَ بَيْنَ الْمَشْرِقِ وَالْمَغْرِبِ. اللَّهُمَّ نَقِّنِي مِنَ الْخَطَايَا كَمَا يُنَقَّى الثَّوْبُ الْأَبْيَضُ مِنَ الدَّنَسِ. اللَّهُمَّ اغْسِلْ خَطَايَايَ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ.',
    'Allāhumma bā‘id bainī wa baina khaṭāyāya kamā bā‘adta bainal-masyriqi wal-maghrib. Allāhumma naqqinī minal-khaṭāyā kamā yunaqqaṡ-ṡaubul-abyaḍu minad-danas. Allāhummaghsil khaṭāyāya bil-mā’i wats-tsalji wal-barad.',
    'Ya Allah, jauhkan aku dari kesalahan-kesalahanku sejauh Engkau menjauhkan timur dan barat. Bersihkan aku dari segala kesalahan sebagaimana pakaian putih dibersihkan dari noda. Basuhlah kesalahan-kesalahanku dengan air, salju, dan butiran es.',
    'Setelah takbir pembuka salat, sebelum bacaan Al-Fatihah.');

  add('ibadah-dua-sujud', 'ibadah', 'Doa duduk di antara dua sujud',
    ['HR Abu Dawud 850 · hasan menurut Al-Albani', 'https://sunnah.com/abudawud:850'],
    'اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَعَافِنِي وَاهْدِنِي وَارْزُقْنِي.',
    'Allāhummaghfir lī warḥamnī wa ‘āfinī wahdinī warzuqnī.',
    'Ya Allah, ampunilah aku, rahmatilah aku, beri aku keselamatan, tunjukilah aku, dan berilah aku rezeki.',
    'Saat duduk di antara dua sujud.',
    { grade: 'hasan' });

  add('musafir-berangkat', 'musafir', 'Doa berangkat dan pulang dari perjalanan',
    ['HR Muslim 1342', 'https://sunnah.com/muslim:1342'],
    'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ. اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى وَمِنَ الْعَمَلِ مَا تَرْضَى. اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ. اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ وَالْخَلِيفَةُ فِي الْأَهْلِ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ وَعْثَاءِ السَّفَرِ وَكَآبَةِ الْمَنْظَرِ وَسُوءِ الْمُنْقَلَبِ فِي الْمَالِ وَالْأَهْلِ.\n\nآيِبُونَ تَائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ.',
    'Subḥānalladzī sakhkhara lanā hādzā wa mā kunnā lahu muqrinīn, wa innā ilā rabbinā lamunqalibūn. Allāhumma innā nas’aluka fī safarinā hādzal-birra wat-taqwā wa minal-‘amali mā tarḍā. Allāhumma hawwin ‘alainā safaranā hādzā waṭwi ‘annā bu‘dah. Allāhumma antaṣ-ṣāḥibu fis-safari wal-khalīfatu fil-ahl. Allāhumma innī a‘ūdzu bika min wa‘tsā’is-safari wa ka’ābatil-manẓari wa sū’il-munqalabi fil-māli wal-ahl.\n\nĀyibūna tā’ibūna ‘ābidūna lirabbinā ḥāmidūn.',
    'Mahasuci Allah yang menundukkan kendaraan ini bagi kami, padahal kami tidak akan mampu menguasainya sendiri. Kepada Tuhan kami, kami akan kembali. Ya Allah, dalam perjalanan ini kami memohon kebaikan, ketakwaan, dan amal yang Engkau ridai. Mudahkan perjalanan ini dan pendekkan jaraknya bagi kami. Engkaulah yang menyertai kami dalam perjalanan dan menjaga keluarga yang kami tinggalkan. Aku berlindung kepada-Mu dari beratnya perjalanan, pemandangan yang menyedihkan, dan keadaan buruk pada harta dan keluarga saat kembali.\n\nKami kembali dalam keadaan bertaubat, beribadah, dan memuji Tuhan kami.',
    'Saat berangkat Nabi ﷺ bertakbir tiga kali sebelum doa, dan menambahkan kalimat terakhir saat kembali.',
    { keywords: 'safar musafir naik kendaraan mudik' });

  add('musafir-singgah', 'musafir', 'Doa ketika singgah di suatu tempat',
    ['HR Muslim 2708a', 'https://sunnah.com/muslim:2708a'],
    'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.',
    'A‘ūdzu bikalimātillāhit-tāmmāti min syarri mā khalaq.',
    'Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari keburukan segala yang Dia ciptakan.',
    'Ketika singgah atau menempati suatu tempat.');

  add('ibadah-wudu', 'ibadah', 'Syahadat setelah berwudu',
    ['HR Muslim 234a', 'https://sunnah.com/muslim:234a'],
    'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا عَبْدُ اللَّهِ وَرَسُولُهُ.',
    'Asyhadu an lā ilāha illallāhu wa anna Muḥammadan ‘abdullāhi wa rasūluh.',
    'Aku bersaksi bahwa tiada sembahan yang berhak disembah selain Allah dan bahwa Muhammad adalah hamba dan utusan Allah.',
    'Setelah menyempurnakan wudu.',
    { keywords: 'wudhu bersuci syahadat setelah wudhu' });

  add('ibadah-masjid', 'ibadah', 'Doa masuk dan keluar masjid',
    ['HR Muslim 713a', 'https://sunnah.com/muslim:713a'],
    'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ.\n\nاللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ.',
    'Allāhummaftaḥ lī abwāba raḥmatik.\n\nAllāhumma innī as’aluka min faḍlik.',
    'Ya Allah, bukakan untukku pintu-pintu rahmat-Mu.\n\nYa Allah, aku memohon karunia-Mu.',
    'Bacaan pertama saat masuk masjid dan bacaan kedua saat keluar.');

  add('ibadah-qunut-witir', 'ibadah', 'Doa qunut witir yang diajarkan kepada Hasan',
    ['HR Abu Dawud 1425 · sahih menurut Al-Albani', 'https://sunnah.com/abudawud:1425'],
    'اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ، وَعَافِنِي فِيمَنْ عَافَيْتَ، وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ، وَبَارِكْ لِي فِيمَا أَعْطَيْتَ، وَقِنِي شَرَّ مَا قَضَيْتَ، إِنَّكَ تَقْضِي وَلَا يُقْضَى عَلَيْكَ، وَإِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ، وَلَا يَعِزُّ مَنْ عَادَيْتَ، تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ.',
    'Allāhummahdinī fīman hadait, wa ‘āfinī fīman ‘āfait, wa tawallanī fīman tawallait, wa bārik lī fīmā a‘ṭait, wa qinī syarra mā qaḍait. Innaka taqḍī wa lā yuqḍā ‘alaik, wa innahu lā yadzillu man wālait, wa lā ya‘izzu man ‘ādait. Tabārakta Rabbanā wa ta‘ālait.',
    'Ya Allah, berilah aku petunjuk bersama orang yang Engkau beri petunjuk. Berilah aku keselamatan bersama orang yang Engkau beri keselamatan. Lindungilah aku bersama orang yang Engkau lindungi. Berkahilah apa yang Engkau karuniakan kepadaku dan jagalah aku dari keburukan yang Engkau tetapkan. Engkau yang menetapkan, dan tiada yang dapat menetapkan atas-Mu. Orang yang Engkau lindungi tidak akan hina, dan orang yang Engkau musuhi tidak akan mulia. Mahaberkah dan Mahatinggi Engkau, wahai Tuhan kami.',
    'Doa qunut dalam salat witir.',
    { keywords: 'witir qunut kunut tarawih ramadan' });

  add('ibadah-berbuka', 'ibadah', 'Bacaan setelah berbuka puasa',
    ['HR Abu Dawud 2357 · hasan menurut Al-Albani', 'https://sunnah.com/abudawud:2357'],
    'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ.',
    'Dzahabaẓ-ẓama’u wabtallatil-‘urūqu wa tsabatal-ajru in syā’allāh.',
    'Rasa haus telah hilang, urat-urat telah basah, dan pahala telah ditetapkan, insyaallah.',
    'Setelah berbuka puasa.',
    { grade: 'hasan', keywords: 'buka puasa iftar ramadan' });

  add('perlindungan-marah', 'perlindungan', 'Berlindung kepada Allah ketika marah',
    ['HR Bukhari 6115', 'https://sunnah.com/bukhari:6115'],
    'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ.',
    'A‘ūdzu billāhi minasy-syaiṭānir-rajīm.',
    'Aku berlindung kepada Allah dari setan yang terkutuk.',
    'Ketika marah atau tersulut emosi.',
    { keywords: 'taawudz taawuz marah emosi istiadhah' });

  add('ibadah-surga', 'ibadah', 'Memohon surga dan berlindung dari neraka',
    ['HR Abu Dawud 792 · sahih menurut Al-Albani', 'https://sunnah.com/abudawud:792'],
    'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَأَعُوذُ بِكَ مِنَ النَّارِ.',
    'Allāhumma innī as’alukal-jannata wa a‘ūdzu bika minan-nār.',
    'Ya Allah, aku memohon surga kepada-Mu dan berlindung kepada-Mu dari neraka.',
    'Saat berdoa setelah tasyahud.',
    { note: 'Seorang sahabat menyampaikan bacaan ini kepada Nabi ﷺ. Beliau menegaskan bahwa surga dan perlindungan dari neraka juga menjadi inti permohonan beliau.' });

  add('ampun-istighfar-agung', 'ampun', 'Istighfar dan kembali bertaubat kepada Allah',
    ['HR Tirmidzi 3577 · hasan (Darussalam)', 'https://sunnah.com/tirmidhi:3577'],
    'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ.',
    'Astaghfirullāhal-‘aẓīmal-ladzī lā ilāha illā huwal-ḥayyal-qayyūma wa atūbu ilaih.',
    'Aku memohon ampun kepada Allah Yang Mahaagung. Tiada sembahan yang berhak disembah selain Dia, Yang Mahahidup lagi Maha Mengurus. Aku bertaubat kepada-Nya.',
    'Saat memohon ampun dan bertaubat.',
    { grade: 'hasan', keywords: 'dosa taubat tobat astaghfirullah astagfirullah' });

  add('petang-kebaikan-malam', 'pagi', 'Memohon kebaikan malam dan perlindungan saat petang',
    ['HR Muslim 2723b', 'https://sunnah.com/muslim:2723b'],
    'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا. رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ. رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ.',
    'Amsainā wa amsal-mulku lillāh, wal-ḥamdulillāh. Lā ilāha illallāhu waḥdahu lā syarīka lah, lahul-mulku wa lahul-ḥamdu wa huwa ‘alā kulli syai’in qadīr. Rabbi as’aluka khaira mā fī hādzihil-lailati wa khaira mā ba‘dahā, wa a‘ūdzu bika min syarri mā fī hādzihil-lailati wa syarri mā ba‘dahā. Rabbi a‘ūdzu bika minal-kasali wa sū’il-kibar. Rabbi a‘ūdzu bika min ‘adzābin fin-nāri wa ‘adzābin fil-qabr.',
    'Kami memasuki petang dan seluruh kerajaan adalah milik Allah. Segala puji bagi Allah. Tiada sembahan yang berhak disembah selain Allah semata, tanpa sekutu bagi-Nya. Milik-Nya kerajaan dan pujian. Ia Mahakuasa atas segala sesuatu. Tuhanku, aku memohon kebaikan malam ini dan kebaikan sesudahnya. Aku berlindung kepada-Mu dari keburukan malam ini dan keburukan sesudahnya. Tuhanku, aku berlindung dari kemalasan dan keburukan usia lanjut. Tuhanku, aku berlindung dari azab neraka dan azab kubur.',
    'Ketika memasuki petang.',
    { keywords: 'zikir dzikir sore malam amsaina wa amsal mulku' });

  const updates = {
    'kur-rezeki-halal': {
      title: 'Allāhummakfinī · rezeki halal dan pelunasan utang',
      keywords: 'doa pelunas hutang gunung sir shir shīr allahummakfini allahummak fini bika',
      note: 'Ali bin Abi Thalib mengajarkan doa ini kepada seseorang yang kesulitan membayar kewajibannya. Tirmidzi 3563 menyebut Gunung Ṣīr.',
    },
    'kur-rahmat': {
      reference: 'HR Abu Dawud 5090 · sanad hasan menurut Al-Albani',
      url: 'https://sunnah.com/abudawud:5090',
    },
    'kur-hayyu': {
      reference: 'Tirmidzi 3524 untuk lafaz pendek; riwayat Anas tentang nasihat kepada Fatimah untuk lafaz lengkap',
      url: 'https://dorar.net/h/QCaAwszt/osoul',
    },
    'kur-petunjuk': { url: 'https://sunnah.com/muslim:2725a' },
  };

  window.DOA_NABI = { items, updates };
})();
