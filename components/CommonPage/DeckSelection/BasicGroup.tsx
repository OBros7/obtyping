// components/BasicMode/BasicGroup.tsx
import React from 'react';
import type { BasicGroup as BasicGroupType } from './basicModeConfig';
import { BasicCard } from './BasicCard';
import { useTranslation } from '@/MyCustomHooks';
import { langDict } from './';

type Props = {
  group: BasicGroupType;
};

export const BasicGroup: React.FC<Props> = ({ group }) => {
  const [translater] = useTranslation(langDict);

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
        {group.items.map((item) => (
          <BasicCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};
