// components/Typing/KeyboardJISDual.tsx
'use client';

import React, { useMemo } from 'react';
import { JIS_LEGENDS_BY_LABEL, type JisLegend } from './KeyHighlights/jisLegends';
import { resolveNextKeyJIS } from './KeyHighlights/resolveNextKeyJIS';

type JisKeyDef = {
  /** 表示用ラベル（英字は大文字で統一して扱う） */
  label: string;
  /** キー幅（u単位） */
  widthU?: number;
  /** Enter/Tab/Shift など中央表示用 */
  labelCenter?: string;
  /** ダミーキー（***など）は inert 指定にする */
  inert?: boolean;
};

type RowDef = { keys: JisKeyDef[] };

/**
 * 既存 Keyboard.tsx（日本語版）に合わせた構成を出発点にしています。
 * - '***' 相当のダミーキーは inert:true にして薄く表示
 * - ラベルは配列ベースで扱い、legend（通常/Shift）は JIS_LEGENDS_BY_LABEL を参照
 */
const ROWS: RowDef[] = [
  {
    keys: [
      { label: '1' }, { label: '2' }, { label: '3' }, { label: '4' }, { label: '5' },
      { label: '6' }, { label: '7' }, { label: '8' }, { label: '9' }, { label: '0' },
      { label: '-', }, { label: '^' }, { label: '¥' },
    ],
  },
  {
    keys: [
      { label: 'Q' }, { label: 'W' }, { label: 'E' }, { label: 'R' }, { label: 'T' },
      { label: 'Y' }, { label: 'U' }, { label: 'I' }, { label: 'O' }, { label: 'P' },
      { label: '@' }, { label: '[' },
    ],
  },
  {
    keys: [
      { label: 'A' }, { label: 'S' }, { label: 'D' }, { label: 'F' }, { label: 'G' },
      { label: 'H' }, { label: 'J' }, { label: 'K' }, { label: 'L' },
      { label: ';' }, { label: ':' }, { label: ']' },
    ],
  },
  {
    keys: [
      { label: 'Shift', widthU: 2, labelCenter: 'Shift' },
      { label: 'Z' }, { label: 'X' }, { label: 'C' }, { label: 'V' }, { label: 'B' },
      { label: 'N' }, { label: 'M' }, { label: ',' }, { label: '.' }, { label: '/' },
      { label: 'Shift', widthU: 2.5, labelCenter: 'Shift' },
    ],
  },
  {
    keys: [
      { label: ' ', widthU: 6.25, labelCenter: 'Space' },
    ],
  },
];

const widthClassFromU = (u: number = 1): string => {
  if (u === 1) return 'w-10';
  if (u === 1.5) return 'w-14';
  if (u === 2) return 'w-20';
  if (u === 2.25) return 'w-24';
  if (u === 2.5) return 'w-28';
  if (u === 6.25) return 'w-64';
  return 'w-10';
};

type Props = {
  /** 出題中の次に打つ文字（例: 'a', 'A', '!', ' ', 'Enter', 'Tab'） */
  nextKey: string | null;
};

export default function KeyboardJISDual({ nextKey }: Props) {
  const resolved = useMemo(() => resolveNextKeyJIS(nextKey), [nextKey]);

  const baseKeyCls =
    'relative flex items-center justify-center border rounded-md select-none h-10 max-w-none';
  const keyNormal = 'bg-white text-black border-gray-300';
  const keyActive = 'bg-red-500 text-white border-red-500';
  const keyInactive = 'bg-gray-100 text-gray-400 border-gray-200';

  const legendBaseCls = 'absolute left-1 bottom-0.5 text-[11px] leading-none';
  const legendShiftCls = 'absolute right-1 top-0.5 text-[11px] leading-none opacity-70';
  const legendActive = 'font-extrabold underline underline-offset-2';
  const centerLabelCls = 'text-[12px]';
  const rowCls = 'flex space-x-2';
  const rowsWrapCls = 'flex flex-col space-y-2';
  const rootCls = 'flex justify-center items-center';

  const isKeyActive = (k: JisKeyDef): boolean => {
    if (!resolved) return false;
    // Shiftキー強調ルール：ラベルが 'Shift' かつ needsShift=true の場合に強調
    if ((k.label === 'Shift') && resolved.needsShift) return true;

    // 通常キー：ラベル一致で強調
    return resolved.baseLabel === k.label;
  };

  const legendFor = (k: JisKeyDef): JisLegend | undefined => {
    // 文字キーは JIS_LEGENDS_BY_LABEL に無くても a/A のように自動生成
    if (JIS_LEGENDS_BY_LABEL[k.label]) return JIS_LEGENDS_BY_LABEL[k.label];

    // 英字キー（ラベルは大文字で持つ想定）
    if (/^[A-Z]$/.test(k.label)) {
      const ch = k.label;
      return { base: ch.toLowerCase(), shift: ch.toUpperCase() };
    }

    // スペースや Shift, Enter 等は 2段ラベルは持たない
    return undefined;
  };

  const activeSide = (k: JisKeyDef, legend?: JisLegend): 'base' | 'shift' | null => {
    if (!legend || !resolved) return null;
    if (resolved.baseLabel !== k.label) return null;
    return resolved.needsShift ? 'shift' : 'base';
  };

  return (
    <div className={rootCls}>
      <div className={rowsWrapCls}>
        {ROWS.map((row, i) => (
          <div key={i} className={rowCls}>
            {row.keys.map((k, idx) => {
              const legend = legendFor(k);
              const side = activeSide(k, legend);
              const active = isKeyActive(k);
              const inactive = k.inert;

              const classes = `${baseKeyCls} ${inactive ? keyInactive : active ? keyActive : keyNormal} ${widthClassFromU(
                k.widthU,
              )}`;

              return (
                <div key={`${k.label}-${idx}`} className={classes} aria-label={k.label}>
                  {/* 左下：通常、右上：Shift */}
                  {legend && (
                    <>
                      <span className={`${legendBaseCls} ${active && side === 'base' ? legendActive : ''}`}>
                        {legend.base}
                      </span>
                      {legend.shift && (
                        <span className={`${legendShiftCls} ${active && side === 'shift' ? legendActive : ''}`}>
                          {legend.shift}
                        </span>
                      )}
                    </>
                  )}

                  {/* 中央ラベル（Space/Shiftなど） */}
                  {k.labelCenter && <span className={centerLabelCls}>{k.labelCenter}</span>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
