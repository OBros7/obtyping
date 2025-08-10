'use client';
import React, { useState } from 'react';
import MySelect from '@/Basics/MySelect';
import { useTranslation } from '@/MyCustomHooks';
import { langDict } from './';
import DeckCreateForm from './DeckCreateForm';
import DeckEditForm from './DeckEditForm';

export default function DeckUploadForm() {
  const [translater] = useTranslation(langDict) as any;
  const [mode, setMode] = useState<'create' | 'edit'>('create');

  return (
    <div className="flex flex-col space-y-8 max-w-5xl mx-auto p-8">
      <MySelect
        state={mode}
        setState={setMode}
        optionValues={['create', 'edit']}
        optionTexts={[translater.createNewDeck, translater.editDeckAndText]}
        attrs={{ className: 'select select-primary w-72 self-center' }}
      />
      {mode === 'create' ? <DeckCreateForm /> : <DeckEditForm />}
    </div>
  );
}