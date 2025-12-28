// components/BasicMode/BasicGroup.tsx
import React from 'react';
import type { BasicGroup as BasicGroupType, AppLocale, BasicItem } from './basicModeConfig';
import { BasicCard } from './BasicCard';
import { useTranslation } from '@/MyCustomHooks';
import { langDict } from './';
import { useRouter } from 'next/router'

type Props = {
  group: BasicGroupType;
};

const normalizeLocale = (locale?: string): AppLocale => (locale === 'en' ? 'en' : 'ja')

const resolveHref = (item: BasicItem, locale: AppLocale): string | null => {
  if (typeof item.href === 'string') return item.href
  return item.href[locale] ?? null
}

export const BasicGroup: React.FC<Props> = ({ group }) => {
  const [translater] = useTranslation(langDict);
  const { locale } = useRouter()
  const loc = normalizeLocale(locale)

  const visibleItems = group.items
    .map((item) => ({ item, href: resolveHref(item, loc) }))
    .filter((x): x is { item: BasicItem; href: string } => typeof x.href === 'string')

  // （任意）items が 0 ならグループごと非表示にしたい場合
  if (visibleItems.length === 0) return null

  return (
    <section className="mt-4">
      <header className="mb-2">
        <h3 className="text-base font-semibold text-gray-900 md:text-lg">
          {translater[group.titleKey]}
        </h3>
        {group.descriptionKey && (
          <p className="mt-1 text-xs text-gray-500 md:text-sm">
            {translater[group.descriptionKey]}
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {visibleItems.map(({ item, href }) => (
          <BasicCard key={item.id} item={item} href={href} />
        ))}
      </div>
    </section>
  );
};
