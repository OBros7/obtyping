// components/Typing/KeyboardUS101Dual.tsx
'use client';

import React, { useMemo } from 'react';
import { resolveNextKey } from './KeyHighlights/resolveNextKey';
import { LEGENDS_BY_CODE, type Legend } from './KeyHighlights/us101Legends';

type KeyDef = { code: string; widthU?: number; labelCenter?: string };
type RowDef = { keys: KeyDef[] };

/** ANSI US-101 の行定義（幅は近似） */
const ROWS: RowDef[] = [
  {
    keys: [
      { code: 'Backquote' },
      { code: 'Digit1' }, { code: 'Digit2' }, { code: 'Digit3' }, { code: 'Digit4' },
      { code: 'Digit5' }, { code: 'Digit6' }, { code: 'Digit7' }, { code: 'Digit8' },
      { code: 'Digit9' }, { code: 'Digit0' }, { code: 'Minus' }, { code: 'Equal' },
      { code: 'Backspace', widthU: 2, labelCenter: 'Backspace' },
    ],
  },
  {
    keys: [
      { code: 'Tab', widthU: 1.5, labelCenter: 'Tab' },
      { code: 'KeyQ' }, { code: 'KeyW' }, { code: 'KeyE' }, { code: 'KeyR' }, { code: 'KeyT' },
      { code: 'KeyY' }, { code: 'KeyU' }, { code: 'KeyI' }, { code: 'KeyO' }, { code: 'KeyP' },
      { code: 'BracketLeft' }, { code: 'BracketRight' }, { code: 'Backslash', widthU: 1.5 },
    ],
  },
  {
    keys: [
      { code: 'CapsLock', widthU: 1.75, labelCenter: 'Caps' },
      { code: 'KeyA' }, { code: 'KeyS' }, { code: 'KeyD' }, { code: 'KeyF' }, { code: 'KeyG' },
      { code: 'KeyH' }, { code: 'KeyJ' }, { code: 'KeyK' }, { code: 'KeyL' },
      { code: 'Semicolon' }, { code: 'Quote' },
      { code: 'Enter', widthU: 2.25, labelCenter: 'Enter' },
    ],
  },
  {
    keys: [
      { code: 'ShiftLeft', widthU: 2.25, labelCenter: 'Shift' },
      { code: 'KeyZ' }, { code: 'KeyX' }, { code: 'KeyC' }, { code: 'KeyV' }, { code: 'KeyB' },
      { code: 'KeyN' }, { code: 'KeyM' }, { code: 'Comma' }, { code: 'Period' }, { code: 'Slash' },
      { code: 'ShiftRight', widthU: 2.75, labelCenter: 'Shift' },
    ],
  },
  {
    keys: [
      { code: 'ControlLeft', labelCenter: 'Ctrl' },
      { code: 'MetaLeft', labelCenter: 'Meta' },
      { code: 'AltLeft', labelCenter: 'Alt' },
      { code: 'Space', widthU: 6.25 },
      { code: 'AltRight', labelCenter: 'Alt' },
      { code: 'MetaRight', labelCenter: 'Meta' },
      { code: 'ContextMenu', labelCenter: 'Menu' },
      { code: 'ControlRight', labelCenter: 'Ctrl' },
    ],
  },
];

/** u 単位 → Tailwind 幅クラス（既存スケールに寄せる） */
const widthClassFromU = (u: number = 1): string => {
  // 主要値のみクラス割り当て（任意で微調整可）
  if (u === 1) return 'w-10';
  if (u === 1.5) return 'w-14';
  if (u === 1.75) return 'w-[4.5rem]'; // 任意: セーフリストが必要なら w-18 などに置換
  if (u === 2) return 'w-20';
  if (u === 2.25) return 'w-24';
  if (u === 2.75) return 'w-28';
  if (u === 6.25) return 'w-64';
  return 'w-10';
};

type Props = {
  /** 出題中の次に打つ文字（例: 'a', 'A', '!', ' ', 'Enter', 'Tab'） */
  nextKey: string | null;
};

export default function KeyboardUS101Dual({ nextKey }: Props) {
  const resolved = useMemo(() => resolveNextKey(nextKey), [nextKey]);

  const baseKeyCls =
    'relative flex items-center justify-center border rounded-md select-none h-10 max-w-none';
  const keyNormal = 'bg-white text-black border-gray-300';
  const keyActive = 'bg-red-500 text-white border-red-500';
  const legendBaseCls = 'absolute left-1 bottom-0.5 text-[11px] leading-none';
  const legendShiftCls = 'absolute right-1 top-0.5 text-[11px] leading-none opacity-70';
  const legendActive = 'font-extrabold underline underline-offset-2';
  const centerLabelCls = 'text-[12px]';
  const rowCls = 'flex space-x-2';
  const rowsWrapCls = 'flex flex-col space-y-2';
  const rootCls = 'flex justify-center items-center';

  const isKeyActive = (code: string) => resolved?.baseCode === code;

  const legendFor = (code: string): Legend | undefined => {
    // 文字キーは自動生成（KeyA..KeyZ）
    if (LEGENDS_BY_CODE[code]) return LEGENDS_BY_CODE[code];
    const m = /^Key([A-Z])$/.exec(code);
    if (m) {
      const ch = m[1];
      return { base: ch.toLowerCase(), shift: ch.toUpperCase() };
    }
    return undefined;
  };

  const activeSide = (code: string, legend?: Legend): 'base' | 'shift' | null => {
    if (!legend || !resolved || resolved.baseCode !== code) return null;
    return resolved.needsShift ? 'shift' : 'base';
  };

  return (
    <div className={rootCls}>
      <div className={rowsWrapCls}>
        {ROWS.map((row, i) => (
          <div key={i} className={rowCls}>
            {row.keys.map((k) => {
              const active = isKeyActive(k.code);
              const legend = legendFor(k.code);
              const side = activeSide(k.code, legend);

              const showShiftRim =
                resolved?.needsShift && (k.code === 'ShiftLeft' || k.code === 'ShiftRight');

              return (
                <div
                  key={k.code}
                  aria-label={k.code}
                  className={`${baseKeyCls} ${active || showShiftRim ? keyActive : keyNormal} ${widthClassFromU(
                    k.widthU,
                  )}`}
                >
                  {/* 2段ラベル（通常=左下、Shift=右上） */}
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

                  {/* 中央ラベル（Enter/Tab/Shiftなど） */}
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
