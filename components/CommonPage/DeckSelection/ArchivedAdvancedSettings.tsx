// components/CommonPage/DeckSelection/ArchivedAdvancedSettings.tsx
// 現在は未使用。将来復帰用の「詳細設定」コンポーネント（折りたたみUI想定）。
// import していないため、ユーザーからは見えません。

import React from 'react';

type Props = {
  // 例えば shuffle や visibility を再度使う場合に props を増やす
  shuffle: boolean;
  onChangeShuffle: (v: boolean) => void;
};

export default function ArchivedAdvancedSettings(_props: Props) {
  // 今は UI を持たないダミー実装。
  // 将来、<details> やアコーディオンで項目をぶら下げる。
  return null;
}
