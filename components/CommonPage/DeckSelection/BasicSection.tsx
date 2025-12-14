// components/BasicMode/BasicSection.tsx
import React from 'react';
import type { BasicSection as BasicSectionType } from './basicModeConfig';
import { BasicGroup } from './BasicGroup';
import { useTranslation } from '@/MyCustomHooks';
import { langDict } from './'

type Props = {
  section: BasicSectionType;
};

export const BasicSection: React.FC<Props> = ({ section }) => {
  const [translater] = useTranslation(langDict) as any;
  return (
    <section
      className="
      mt-8 border-t border-gray-100 pt-6
      first:mt-0 first:border-t-0
    "
    >
      <header className="mb-4">
        <h2 className="text-2xl font-semibold text-gray-900 md:text-4xl">
          {translater[section.titleKey]}
        </h2>
        {section.descriptionKey && (
          <p className="mt-1 text-sm text-gray-600">
            {translater[section.descriptionKey]}
          </p>
        )}
      </header>

      <div className="space-y-4">
        {section.groups.map((group) => (
          <BasicGroup key={group.id} group={group} />
        ))}
      </div>
    </section>
  );
};
