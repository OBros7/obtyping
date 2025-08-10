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
  きゃ: { display: 'kya', accept: ['kya'] },
  きゅ: { display: 'kyu', accept: ['kyu'] },
  きょ: { display: 'kyo', accept: ['kyo'] },

  /* g 行（濁音） */
  が: { display: 'ga', accept: ['ga'] },
  ぎ: { display: 'gi', accept: ['gi'] },
  ぐ: { display: 'gu', accept: ['gu'] },
  げ: { display: 'ge', accept: ['ge'] },
  ご: { display: 'go', accept: ['go'] },
  ぎゃ: { display: 'gya', accept: ['gya'] },
  ぎゅ: { display: 'gyu', accept: ['gyu'] },
  ぎょ: { display: 'gyo', accept: ['gyo'] },

  /* s 行 */
  さ: { display: 'sa', accept: ['sa'] },
  し: { display: 'shi', accept: ['shi', 'si'] },
  す: { display: 'su', accept: ['su'] },
  せ: { display: 'se', accept: ['se'] },
  そ: { display: 'so', accept: ['so'] },
  しゃ: { display: 'sha', accept: ['sha', 'sya', 'shiya', 'sixya'] },
  しゅ: { display: 'shu', accept: ['shu', 'syu', 'shiyu', 'sixyu'] },
  しょ: { display: 'sho', accept: ['sho', 'syo', 'shiyo', 'sixyo'] },

  /* z 行（濁音） */
  ざ: { display: 'za', accept: ['za'] },
  じ: { display: 'ji', accept: ['ji', 'zi'] },
  ず: { display: 'zu', accept: ['zu'] },
  ぜ: { display: 'ze', accept: ['ze'] },
  ぞ: { display: 'zo', accept: ['zo'] },
  じゃ: { display: 'ja', accept: ['ja', 'zya', 'jya'] },
  じゅ: { display: 'ju', accept: ['ju', 'zyu', 'jyu'] },
  じょ: { display: 'jo', accept: ['jo', 'zyo', 'jyo'] },

  /* t 行 */
  た: { display: 'ta', accept: ['ta'] },
  ち: { display: 'chi', accept: ['chi', 'ti'] },
  つ: { display: 'tsu', accept: ['tsu', 'tu'] },
  て: { display: 'te', accept: ['te'] },
  と: { display: 'to', accept: ['to'] },
  ちゃ: { display: 'cha', accept: ['cha', 'cya', 'chixya'] },
  ちゅ: { display: 'chu', accept: ['chu', 'cyu'] },
  ちょ: { display: 'cho', accept: ['cho', 'cyo'] },

  /* d 行（濁音） */
  だ: { display: 'da', accept: ['da'] },
  ぢ: { display: 'ji', accept: ['ji', 'di'] },
  づ: { display: 'zu', accept: ['zu', 'dzu'] },
  で: { display: 'de', accept: ['de'] },
  ど: { display: 'do', accept: ['do'] },
  ぢゃ: { display: 'ja', accept: ['ja', 'dya'] },
  ぢゅ: { display: 'ju', accept: ['ju', 'dyu'] },
  ぢょ: { display: 'jo', accept: ['jo', 'dyo'] },

  /* n 行 */
  な: { display: 'na', accept: ['na'] },
  に: { display: 'ni', accept: ['ni'] },
  ぬ: { display: 'nu', accept: ['nu'] },
  ね: { display: 'ne', accept: ['ne'] },
  の: { display: 'no', accept: ['no'] },
  にゃ: { display: 'nya', accept: ['nya'] },
  にゅ: { display: 'nyu', accept: ['nyu'] },
  にょ: { display: 'nyo', accept: ['nyo'] },

  /* h 行 */
  は: { display: 'ha', accept: ['ha'] },
  ひ: { display: 'hi', accept: ['hi'] },
  ふ: { display: 'fu', accept: ['fu', 'hu'] },
  へ: { display: 'he', accept: ['he'] },
  ほ: { display: 'ho', accept: ['ho'] },
  ひゃ: { display: 'hya', accept: ['hya'] },
  ひゅ: { display: 'hyu', accept: ['hyu'] },
  ひょ: { display: 'hyo', accept: ['hyo'] },

  /* b 行（濁音） */
  ば: { display: 'ba', accept: ['ba'] },
  び: { display: 'bi', accept: ['bi'] },
  ぶ: { display: 'bu', accept: ['bu'] },
  べ: { display: 'be', accept: ['be'] },
  ぼ: { display: 'bo', accept: ['bo'] },
  びゃ: { display: 'bya', accept: ['bya'] },
  びゅ: { display: 'byu', accept: ['byu'] },
  びょ: { display: 'byo', accept: ['byo'] },

  /* p 行（半濁音） */
  ぱ: { display: 'pa', accept: ['pa'] },
  ぴ: { display: 'pi', accept: ['pi'] },
  ぷ: { display: 'pu', accept: ['pu'] },
  ぺ: { display: 'pe', accept: ['pe'] },
  ぽ: { display: 'po', accept: ['po'] },
  ぴゃ: { display: 'pya', accept: ['pya'] },
  ぴゅ: { display: 'pyu', accept: ['pyu'] },
  ぴょ: { display: 'pyo', accept: ['pyo'] },

  /* m 行 */
  ま: { display: 'ma', accept: ['ma'] },
  み: { display: 'mi', accept: ['mi'] },
  む: { display: 'mu', accept: ['mu'] },
  め: { display: 'me', accept: ['me'] },
  も: { display: 'mo', accept: ['mo'] },
  みゃ: { display: 'mya', accept: ['mya'] },
  みゅ: { display: 'myu', accept: ['myu'] },
  みょ: { display: 'myo', accept: ['myo'] },

  /* y 行 */
  や: { display: 'ya', accept: ['ya'] },
  ゆ: { display: 'yu', accept: ['yu'] },
  よ: { display: 'yo', accept: ['yo'] },

  /* r 行 */
  ら: { display: 'ra', accept: ['ra'] },
  り: { display: 'ri', accept: ['ri'] },
  る: { display: 'ru', accept: ['ru'] },
  れ: { display: 're', accept: ['re'] },
  ろ: { display: 'ro', accept: ['ro'] },
  りゃ: { display: 'rya', accept: ['rya'] },
  りゅ: { display: 'ryu', accept: ['ryu'] },
  りょ: { display: 'ryo', accept: ['ryo'] },

  /* わ行 */
  わ: { display: 'wa', accept: ['wa'] },
  を: { display: 'wo', accept: ['wo'] },
  ん: { display: 'n', accept: ['n', 'nn', "n'"] },

  /* 句読点・長音 */
  '、': { display: ',', accept: [','] },
  '。': { display: '.', accept: ['.'] },
  '！': { display: '!', accept: ['!'] },
  '？': { display: '?', accept: ['?'] },
  ー: { display: '-', accept: ['-'] },
  '「': { display: '[', accept: ['['] },
  '」': { display: ']', accept: [']'] },
}
