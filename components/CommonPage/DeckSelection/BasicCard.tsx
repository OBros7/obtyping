// components/BasicMode/BasicCard.tsx
import React from 'react';
import Link from 'next/link';
import type { BasicItem } from './basicModeConfig';
import { useTranslation } from '@/MyCustomHooks';
import { langDict } from './';

type Props = {
  item: BasicItem
  href: string
}

export const BasicCard: React.FC<Props> = ({ item, href }) => {
  const [translater] = useTranslation(langDict);

  return (
    <Link
      href={href}
      className="
        group
        block
        rounded-lg border border-gray-200
        px-4 py-3
        transition
        hover:border-blue-400 hover:bg-gray-50 hover:shadow-sm
        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
      "
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900 md:text-base">
            {translater[item.titleKey]}
          </h3>
          <p className="mt-1 text-xs text-gray-500 md:text-sm">
            {translater[item.descriptionKey]}
          </p>
        </div>
        <div className="ml-2 text-lg leading-none text-gray-300 group-hover:text-blue-500" />
      </div>
    </Link>
  );
};
