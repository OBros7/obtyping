// components/MyCustomHooks/useTranslation.tsx
import { useRouter } from 'next/router';
import { useMemo } from 'react';

/** ja / en の 2 局面を持つ辞書をフラット化した型 */
type FlatDict<T> = { [K in keyof T]: string };

/**
 * i18n helper
 * @param dict - { key: { ja:'...', en:'...' } } 形式の辞書
 * @returns   [ 現在言語だけを抽出したフラット辞書, locale ]
 */
export default function useTranslation<
  T extends Record<string, { ja: string; en: string }>
>(dict: T): [FlatDict<T>, string] {
  const { locale } = useRouter();        // 'ja' | 'en' | undefined
  const lang = (locale ?? 'en') as 'ja' | 'en';

  /** フラット化はメモ化して再計算コストを節約 */
  const flat = useMemo(() => {
    const pairs = Object.entries(dict).map(([k, v]) => [k, v[lang]]);
    return Object.fromEntries(pairs) as FlatDict<T>;
  }, [dict, lang]);

  return [flat, lang];
}
