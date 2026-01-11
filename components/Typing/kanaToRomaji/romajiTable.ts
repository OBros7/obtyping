/* =====================================================================
   kanaToRomaji/romajiTable.ts
   ---------------------------------------------------------------------
   - Modified‑Hepburn を既定 (display)
   - accept 配列に多解を列挙 (shi/si など)
   - 最小限のセット (母音 + k/s/t/n/h/m/y/r/w/g/z/d/b/p) と拗音/促音用を収録。
     ここに無い文字が来た場合は display と同じ 1 件だけ accept に入れる。
===================================================================== */

export interface RomajiEntry {
  display: string
  accept: string[]
}

// ローマ字変換テーブル 1 音 (かな or 拗音)
export const ROMA_MAP: Record<string, RomajiEntry> = {
  /* 母音 */
  あ: { display: 'a', accept: ['a'] },
  い: { display: 'i', accept: ['i'] },
  う: { display: 'u', accept: ['u'] },
  え: { display: 'e', accept: ['e'] },
  お: { display: 'o', accept: ['o'] },

  /* k 行 */
  か: { display: 'ka', accept: ['ka'] },
  き: { display: 'ki', accept: ['ki'] },
  く: { display: 'ku', accept: ['ku'] },
  け: { display: 'ke', accept: ['ke'] },
  こ: { display: 'ko', accept: ['ko'] },
  きゃ: { display: 'kya', accept: ['kya', 'kixya', 'kilya'] },
  きゅ: { display: 'kyu', accept: ['kyu', 'kixyu', 'kilyu'] },
  きょ: { display: 'kyo', accept: ['kyo', 'kixyo', 'kilyo'] },

  /* g 行（濁音） */
  が: { display: 'ga', accept: ['ga'] },
  ぎ: { display: 'gi', accept: ['gi'] },
  ぐ: { display: 'gu', accept: ['gu'] },
  げ: { display: 'ge', accept: ['ge'] },
  ご: { display: 'go', accept: ['go'] },
  ぎゃ: { display: 'gya', accept: ['gya', 'gixya', 'gilya'] },
  ぎゅ: { display: 'gyu', accept: ['gyu', 'gixyu', 'gilyu'] },
  ぎょ: { display: 'gyo', accept: ['gyo', 'gixyo', 'gilyo'] },

  /* s 行 */
  さ: { display: 'sa', accept: ['sa'] },
  し: { display: 'shi', accept: ['shi', 'si'] },
  す: { display: 'su', accept: ['su'] },
  せ: { display: 'se', accept: ['se'] },
  そ: { display: 'so', accept: ['so'] },
  しゃ: { display: 'sha', accept: ['sha', 'sya', 'shya', 'shixya', 'shilya', 'sixya', 'silya'] },
  しゅ: { display: 'shu', accept: ['shu', 'syu', 'shyu', 'shixyu', 'shilyu', 'sixyu', 'silyu'] },
  しょ: { display: 'sho', accept: ['sho', 'syo', 'shyo', 'shixyo', 'shilyo', 'sixyo', 'silyo'] },

  /* z 行（濁音） */
  ざ: { display: 'za', accept: ['za'] },
  じ: { display: 'ji', accept: ['ji', 'zi'] },
  ず: { display: 'zu', accept: ['zu'] },
  ぜ: { display: 'ze', accept: ['ze'] },
  ぞ: { display: 'zo', accept: ['zo'] },
  じゃ: { display: 'ja', accept: ['ja', 'zya', 'jya', 'jixya', 'jilya', 'zixya', 'zilya'] },
  じゅ: { display: 'ju', accept: ['ju', 'zyu', 'jyu', 'jixyu', 'jilyu', 'zixyu', 'zilyu'] },
  じょ: { display: 'jo', accept: ['jo', 'zyo', 'jyo', 'jixyo', 'jilyo', 'zixyo', 'zilyo'] },

  /* t 行 */
  た: { display: 'ta', accept: ['ta'] },
  ち: { display: 'chi', accept: ['chi', 'ti'] },
  つ: { display: 'tsu', accept: ['tsu', 'tu'] },
  て: { display: 'te', accept: ['te'] },
  と: { display: 'to', accept: ['to'] },
  ちゃ: {
    display: 'cha',
    accept: ['cha', 'cya', 'chya', 'tya', 'chixya', 'tixya', 'chilya', 'cilya', 'tilya'],
  },
  ちゅ: {
    display: 'chu',
    accept: ['chu', 'cyu', 'chyu', 'tyu', 'chixyu', 'tixyu', 'chilyu', 'cilyu', 'tilyu'],
  },
  ちょ: {
    display: 'cho',
    accept: ['cho', 'cyo', 'chyo', 'tyo', 'chixyo', 'tixyo', 'chilyo', 'cilyo', 'tilyo'],
  },

  /* d 行（濁音） */
  だ: { display: 'da', accept: ['da'] },
  ぢ: { display: 'ji', accept: ['ji', 'di'] },
  づ: { display: 'zu', accept: ['zu', 'dzu'] },
  で: { display: 'de', accept: ['de'] },
  ど: { display: 'do', accept: ['do'] },
  ぢゃ: { display: 'ja', accept: ['ja', 'dya', 'dixya', 'dilya'] },
  ぢゅ: { display: 'ju', accept: ['ju', 'dyu', 'dixyu', 'dilyu'] },
  ぢょ: { display: 'jo', accept: ['jo', 'dyo', 'dixyo', 'dilyo'] },

  /* n 行 */
  な: { display: 'na', accept: ['na'] },
  に: { display: 'ni', accept: ['ni'] },
  ぬ: { display: 'nu', accept: ['nu'] },
  ね: { display: 'ne', accept: ['ne'] },
  の: { display: 'no', accept: ['no'] },
  にゃ: { display: 'nya', accept: ['nya', 'nixya', 'nilya'] },
  にゅ: { display: 'nyu', accept: ['nyu', 'nixyu', 'nilyu'] },
  にょ: { display: 'nyo', accept: ['nyo', 'nixyo', 'nilyo'] },

  /* h 行 */
  は: { display: 'ha', accept: ['ha'] },
  ひ: { display: 'hi', accept: ['hi'] },
  ふ: { display: 'fu', accept: ['fu', 'hu'] },
  へ: { display: 'he', accept: ['he'] },
  ほ: { display: 'ho', accept: ['ho'] },
  ひゃ: { display: 'hya', accept: ['hya', 'hixya', 'hilya'] },
  ひゅ: { display: 'hyu', accept: ['hyu', 'hixyu', 'hilyu'] },
  ひょ: { display: 'hyo', accept: ['hyo', 'hixyo', 'hilyo'] },

  /* b 行（濁音） */
  ば: { display: 'ba', accept: ['ba'] },
  び: { display: 'bi', accept: ['bi'] },
  ぶ: { display: 'bu', accept: ['bu'] },
  べ: { display: 'be', accept: ['be'] },
  ぼ: { display: 'bo', accept: ['bo'] },
  びゃ: { display: 'bya', accept: ['bya', 'bixya', 'bilya'] },
  びゅ: { display: 'byu', accept: ['byu', 'bixyu', 'bilyu'] },
  びょ: { display: 'byo', accept: ['byo', 'bixyo', 'bilyo'] },

  /* p 行（半濁音） */
  ぱ: { display: 'pa', accept: ['pa'] },
  ぴ: { display: 'pi', accept: ['pi'] },
  ぷ: { display: 'pu', accept: ['pu'] },
  ぺ: { display: 'pe', accept: ['pe'] },
  ぽ: { display: 'po', accept: ['po'] },
  ぴゃ: { display: 'pya', accept: ['pya', 'pixya', 'pilya'] },
  ぴゅ: { display: 'pyu', accept: ['pyu', 'pixyu', 'pilyu'] },
  ぴょ: { display: 'pyo', accept: ['pyo', 'pixyo', 'pilyo'] },

  /* m 行 */
  ま: { display: 'ma', accept: ['ma'] },
  み: { display: 'mi', accept: ['mi'] },
  む: { display: 'mu', accept: ['mu'] },
  め: { display: 'me', accept: ['me'] },
  も: { display: 'mo', accept: ['mo'] },
  みゃ: { display: 'mya', accept: ['mya', 'mixya', 'milya'] },
  みゅ: { display: 'myu', accept: ['myu', 'mixyu', 'milyu'] },
  みょ: { display: 'myo', accept: ['myo', 'mixyo', 'milyo'] },

  /* y 行 */
  や: { display: 'ya', accept: ['ya'] },
  ゆ: { display: 'yu', accept: ['yu'] },
  よ: { display: 'yo', accept: ['yo'] },
  ゃ: { display: 'xya', accept: ['xya', 'lya'] }, // ゃ は拗音の一部として扱う
  ゅ: { display: 'xyu', accept: ['xyu', 'lyu'] }, // ゅ は拗音の一部として扱う
  ょ: { display: 'xyo', accept: ['xyo', 'lyo'] }, // ょ は拗音の一部として扱う

  /* r 行 */
  ら: { display: 'ra', accept: ['ra'] },
  り: { display: 'ri', accept: ['ri'] },
  る: { display: 'ru', accept: ['ru'] },
  れ: { display: 're', accept: ['re'] },
  ろ: { display: 'ro', accept: ['ro'] },
  りゃ: { display: 'rya', accept: ['rya', 'rixya', 'rilya'] },
  りゅ: { display: 'ryu', accept: ['ryu', 'rixyu', 'rilyu'] },
  りょ: { display: 'ryo', accept: ['ryo', 'rixyo', 'rilyo'] },

  /* わ行 */
  わ: { display: 'wa', accept: ['wa'] },
  を: { display: 'wo', accept: ['wo'] },
  ん: { display: 'n', accept: ['n', 'nn', "n'"] },

  /* 母音 */
  ア: { display: 'a', accept: ['a'] },
  イ: { display: 'i', accept: ['i'] },
  ウ: { display: 'u', accept: ['u'] },
  エ: { display: 'e', accept: ['e'] },
  オ: { display: 'o', accept: ['o'] },

  /* k 行 */
  カ: { display: 'ka', accept: ['ka'] },
  キ: { display: 'ki', accept: ['ki'] },
  ク: { display: 'ku', accept: ['ku'] },
  ケ: { display: 'ke', accept: ['ke'] },
  コ: { display: 'ko', accept: ['ko'] },
  キャ: { display: 'kya', accept: ['kya', 'kixya', 'kilya'] },
  キュ: { display: 'kyu', accept: ['kyu', 'kixyu', 'kilyu'] },
  キョ: { display: 'kyo', accept: ['kyo', 'kixyo', 'kilyo'] },

  /* g 行（濁音） */
  ガ: { display: 'ga', accept: ['ga'] },
  ギ: { display: 'gi', accept: ['gi'] },
  グ: { display: 'gu', accept: ['gu'] },
  ゲ: { display: 'ge', accept: ['ge'] },
  ゴ: { display: 'go', accept: ['go'] },
  ギャ: { display: 'gya', accept: ['gya', 'gixya', 'gilya'] },
  ギュ: { display: 'gyu', accept: ['gyu', 'gixyu', 'gilyu'] },
  ギョ: { display: 'gyo', accept: ['gyo', 'gixyo', 'gilyo'] },

  /* s 行 */
  サ: { display: 'sa', accept: ['sa'] },
  シ: { display: 'shi', accept: ['shi', 'si'] },
  ス: { display: 'su', accept: ['su'] },
  セ: { display: 'se', accept: ['se'] },
  ソ: { display: 'so', accept: ['so'] },
  シャ: { display: 'sha', accept: ['sha', 'sya', 'shya', 'shixya', 'shilya', 'sixya', 'silya'] },
  シュ: { display: 'shu', accept: ['shu', 'syu', 'shyu', 'shixyu', 'shilyu', 'sixyu', 'silyu'] },
  ショ: { display: 'sho', accept: ['sho', 'syo', 'shyo', 'shixyo', 'shilyo', 'sixyo', 'silyo'] },

  /* z 行（濁音） */
  ザ: { display: 'za', accept: ['za'] },
  ジ: { display: 'ji', accept: ['ji', 'zi'] },
  ズ: { display: 'zu', accept: ['zu'] },
  ゼ: { display: 'ze', accept: ['ze'] },
  ゾ: { display: 'zo', accept: ['zo'] },
  ジャ: { display: 'ja', accept: ['ja', 'zya', 'jya', 'jixya', 'jilya', 'zixya', 'zilya'] },
  ジュ: { display: 'ju', accept: ['ju', 'zyu', 'jyu', 'jixyu', 'jilyu', 'zixyu', 'zilyu'] },
  ジョ: { display: 'jo', accept: ['jo', 'zyo', 'jyo', 'jixyo', 'jilyo', 'zixyo', 'zilyo'] },

  /* t 行 */
  タ: { display: 'ta', accept: ['ta'] },
  チ: { display: 'chi', accept: ['chi', 'ti'] },
  ツ: { display: 'tsu', accept: ['tsu', 'tu'] },
  テ: { display: 'te', accept: ['te'] },
  ト: { display: 'to', accept: ['to'] },
  チャ: {
    display: 'cha',
    accept: ['cha', 'cya', 'chya', 'tya', 'chixya', 'tixya', 'chilya', 'cilya', 'tilya'],
  },
  チュ: {
    display: 'chu',
    accept: ['chu', 'cyu', 'chyu', 'tyu', 'chixyu', 'tixyu', 'chilyu', 'cilyu', 'tilyu'],
  },
  チョ: {
    display: 'cho',
    accept: ['cho', 'cyo', 'chyo', 'tyo', 'chixyo', 'tixyo', 'chilyo', 'cilyo', 'tilyo'],
  },

  /* d 行（濁音） */
  ダ: { display: 'da', accept: ['da'] },
  ヂ: { display: 'ji', accept: ['ji', 'di'] },
  ヅ: { display: 'zu', accept: ['zu', 'dzu'] },
  デ: { display: 'de', accept: ['de'] },
  ド: { display: 'do', accept: ['do'] },
  ヂャ: { display: 'ja', accept: ['ja', 'dya', 'dixya', 'dilya'] },
  ヂュ: { display: 'ju', accept: ['ju', 'dyu', 'dixyu', 'dilyu'] },
  ヂョ: { display: 'jo', accept: ['jo', 'dyo', 'dixyo', 'dilyo'] },

  /* n 行 */
  ナ: { display: 'na', accept: ['na'] },
  ニ: { display: 'ni', accept: ['ni'] },
  ヌ: { display: 'nu', accept: ['nu'] },
  ネ: { display: 'ne', accept: ['ne'] },
  ノ: { display: 'no', accept: ['no'] },
  ニャ: { display: 'nya', accept: ['nya', 'nixya', 'nilya'] },
  ニュ: { display: 'nyu', accept: ['nyu', 'nixyu', 'nilyu'] },
  ニョ: { display: 'nyo', accept: ['nyo', 'nixyo', 'nilyo'] },

  /* h 行 */
  ハ: { display: 'ha', accept: ['ha'] },
  ヒ: { display: 'hi', accept: ['hi'] },
  フ: { display: 'fu', accept: ['fu', 'hu'] },
  ヘ: { display: 'he', accept: ['he'] },
  ホ: { display: 'ho', accept: ['ho'] },
  ヒャ: { display: 'hya', accept: ['hya', 'hixya', 'hilya'] },
  ヒュ: { display: 'hyu', accept: ['hyu', 'hixyu', 'hilyu'] },
  ヒョ: { display: 'hyo', accept: ['hyo', 'hixyo', 'hilyo'] },

  /* b 行（濁音） */
  バ: { display: 'ba', accept: ['ba'] },
  ビ: { display: 'bi', accept: ['bi'] },
  ブ: { display: 'bu', accept: ['bu'] },
  ベ: { display: 'be', accept: ['be'] },
  ボ: { display: 'bo', accept: ['bo'] },
  ビャ: { display: 'bya', accept: ['bya', 'bixya', 'bilya'] },
  ビュ: { display: 'byu', accept: ['byu', 'bixyu', 'bilyu'] },
  ビョ: { display: 'byo', accept: ['byo', 'bixyo', 'bilyo'] },

  /* p 行（半濁音） */
  パ: { display: 'pa', accept: ['pa'] },
  ピ: { display: 'pi', accept: ['pi'] },
  プ: { display: 'pu', accept: ['pu'] },
  ペ: { display: 'pe', accept: ['pe'] },
  ポ: { display: 'po', accept: ['po'] },
  ピャ: { display: 'pya', accept: ['pya', 'pixya', 'pilya'] },
  ピュ: { display: 'pyu', accept: ['pyu', 'pixyu', 'pilyu'] },
  ピョ: { display: 'pyo', accept: ['pyo', 'pixyo', 'pilyo'] },

  /* m 行 */
  マ: { display: 'ma', accept: ['ma'] },
  ミ: { display: 'mi', accept: ['mi'] },
  ム: { display: 'mu', accept: ['mu'] },
  メ: { display: 'me', accept: ['me'] },
  モ: { display: 'mo', accept: ['mo'] },
  ミャ: { display: 'mya', accept: ['mya', 'mixya', 'milya'] },
  ミュ: { display: 'myu', accept: ['myu', 'mixyu', 'milyu'] },
  ミョ: { display: 'myo', accept: ['myo', 'mixyo', 'milyo'] },

  /* y 行 */
  ヤ: { display: 'ya', accept: ['ya'] },
  ユ: { display: 'yu', accept: ['yu'] },
  ヨ: { display: 'yo', accept: ['yo'] },
  ャ: { display: 'xya', accept: ['xya', 'lya'] },
  ュ: { display: 'xyu', accept: ['xyu', 'lyu'] },
  ョ: { display: 'xyo', accept: ['xyo', 'lyo'] },

  /* r 行 */
  ラ: { display: 'ra', accept: ['ra'] },
  リ: { display: 'ri', accept: ['ri'] },
  ル: { display: 'ru', accept: ['ru'] },
  レ: { display: 're', accept: ['re'] },
  ロ: { display: 'ro', accept: ['ro'] },
  リャ: { display: 'rya', accept: ['rya', 'rixya', 'rilya'] },
  リュ: { display: 'ryu', accept: ['ryu', 'rixyu', 'rilyu'] },
  リョ: { display: 'ryo', accept: ['ryo', 'rixyo', 'rilyo'] },

  /* わ行 */
  ワ: { display: 'wa', accept: ['wa'] },
  ヲ: { display: 'wo', accept: ['wo'] },
  ン: { display: 'n', accept: ['n', 'nn', "n'"] },

  /* 句読点・長音 */
  '、': { display: ',', accept: [','] },
  '。': { display: '.', accept: ['.'] },
  '！': { display: '!', accept: ['!'] },
  '？': { display: '?', accept: ['?'] },
  ー: { display: '-', accept: ['-'] },
  '「': { display: '[', accept: ['['] },
  '」': { display: ']', accept: [']'] },
  '〜': { display: '~', accept: ['~'] },
}
