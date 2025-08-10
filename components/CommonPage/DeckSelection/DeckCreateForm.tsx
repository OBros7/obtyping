// components/CommonPage/DeckSelection/DeckCreateForm.tsx
'use client';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import MySelect from '@/Basics/MySelect';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDeckWithTexts, PostDeck, NewTextForDeck } from '@/MyLib/UtilsAPITyping';
import { showError, showSuccess } from 'utils/toast';
import { useTranslation } from '@/MyCustomHooks';
import { langDict } from './';
import { useRouter } from 'next/router';

type TextInput = { name: string; content: string };

export default function DeckCreateForm() {
  const [translater] = useTranslation(langDict) as any;
  const router = useRouter();

  // ====== UI: 薄い枠線（共通クラス） ======
  const fieldCls =
    'w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 ' +
    'focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400';
  const selectCls =
    'w-full rounded-md border border-gray-300 px-3 py-2 bg-white ' +
    'focus:outline-none focus:ring-2 focus:ring-gray-300';

  // ====== state ======
  const [deckName, setDeckName] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  const [language, setLanguage] = useState<'english' | 'others'>('english');
  const [shuffle, setShuffle] = useState<'0' | '1'>('0'); // '0': off, '1': on
  const [texts, setTexts] = useState<TextInput[]>([{ name: '', content: '' }]);
  const canAddMoreText = texts.length < 5;

  // ====== ドラフト復元（プレビューから戻ったとき用） ======
  const askedRestoreRef = useRef(false);
  useEffect(() => {
    if (askedRestoreRef.current) return;
    askedRestoreRef.current = true;
    if (typeof window === 'undefined') return;

    const raw = localStorage.getItem('deckDraft');
    if (!raw) return;

    try {
      const draft = JSON.parse(raw) as {
        deckName: string;
        deckDescription: string;
        language: 'english' | 'others';
        shuffle: '0' | '1';
        texts: TextInput[];
      };

      // すでに入力があれば復元しない
      if (deckName || texts.some((t) => t.name || t.content)) return;

      if (window.confirm(translater?.askRestoreBackup ?? '下書きを復元しますか？')) {
        setDeckName(draft.deckName ?? '');
        setDeckDescription(draft.deckDescription ?? '');
        setLanguage(draft.language ?? 'english');
        setShuffle(draft.shuffle ?? '0');
        setTexts(draft.texts?.length ? draft.texts : [{ name: '', content: '' }]);
      }
    } catch {
      /* パース失敗は無視 */
    }
  }, [deckName, texts, translater]);

  // ====== 保存 ======
  const qc = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async () => {
      const deckPayload: PostDeck = {
        title: deckName.trim(),
        description: deckDescription.trim() || null,
        lang: language === 'english' ? 'en' : 'others',
        visibility: 'public', // デフォルトは公開
        typing_mode: 'custom', // ここは適宜変更
        category_id: null,
        subcategory_id: null,
        level_id: null,
        shuffle: shuffle === '1',
      };
      const textPayloads: NewTextForDeck[] = texts.map((t) => ({
        title: t.name.trim(),
        text11: t.content.trim(),
      }));
      return createDeckWithTexts({ deck: deckPayload, texts: textPayloads });
    },
    onSuccess: () => {
      showSuccess(translater.saveComplete ?? '保存しました');
      localStorage.removeItem('deckDraft'); // 成功時は下書きを消す
      // ★ これで ['decks', *] を必ず取り直す
      qc.invalidateQueries({
        predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === 'decks',
      });
    },
    onError: (e: any) => showError(e?.message ?? translater.saveError ?? '保存に失敗しました'),
  });

  const addTextField = () => canAddMoreText && setTexts((p) => [...p, { name: '', content: '' }]);
  const updateTextField = (i: number, k: keyof TextInput, v: string) =>
    setTexts((prev) => prev.map((t, idx) => (idx === i ? { ...t, [k]: v } : t)));

  // ====== プレビュー（ドラフト保存 → 遷移） ======
  const handleTest = useCallback(() => {
    const draft = { deckName, deckDescription, language, shuffle, texts };
    sessionStorage.setItem('typingDraft', JSON.stringify({ deckName, texts }));
    localStorage.setItem('deckDraft', JSON.stringify(draft)); // ★ 戻ってきた時の復元に使う
    router.push(`/typing/typing?deckid=${-10}&minutes=${1}&lang=${language}`);
  }, [deckName, deckDescription, language, shuffle, texts, router]);

  const disabled = !deckName || texts.some((t) => !t.name || !t.content);

  return (
    <div className="flex flex-col space-y-6">
      {/* メタ */}
      <section className="grid grid-cols-6 gap-4 items-center">
        <label className="col-span-2">
          {translater.newDeckName}<span className="text-red-500">*</span>
        </label>
        <input
          className={`col-span-4 ${fieldCls}`}
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
          placeholder={translater.enterNewDeckName}
        />

        <label className="col-span-2">{translater.deckDescription}</label>
        <textarea
          className={`col-span-4 h-24 ${fieldCls}`}
          value={deckDescription}
          onChange={(e) => setDeckDescription(e.target.value)}
          placeholder={translater.enterDeckDescription}
        />

        <label className="col-span-2">{translater.language}</label>
        <MySelect
          state={language}
          setState={setLanguage}
          optionValues={['english', 'others']}
          attrs={{ className: `col-span-4 ${selectCls}` }}
        />

        <label className="col-span-2">{translater.displayOrderRandom}</label>
        <MySelect
          state={shuffle}
          setState={setShuffle}
          optionValues={['0', '1']}
          optionTexts={[translater.selectNotShuffle, translater.selectShuffle]}
          attrs={{ className: `col-span-4 ${selectCls}` }}
        />
      </section>

      {/* テキスト入力 */}
      <section className="flex flex-col space-y-8">
        {texts.map((t, idx) => (
          <div key={idx} className="space-y-2 border border-gray-200 p-4 rounded-2xl shadow-sm">
            <h3 className="font-semibold">{translater.text} {idx + 1}</h3>
            <input
              className={fieldCls}
              value={t.name}
              onChange={(e) => updateTextField(idx, 'name', e.target.value)}
              placeholder={translater.enterTextTitle}
            />
            <textarea
              className={`h-40 ${fieldCls}`}
              value={t.content}
              onChange={(e) => updateTextField(idx, 'content', e.target.value)}
              placeholder={translater.descriptionTextArea}
            />
          </div>
        ))}
        {canAddMoreText && (
          <button onClick={addTextField} className="btn btn-outline w-fit self-end">
            {translater.addMoreTexts}
          </button>
        )}
      </section>

      {/* 操作 */}
      <div className="flex justify-end space-x-4 items-center">
        <button
          className="w-32 h-10 rounded-md text-white font-bold mx-1 text-lg bg-green-500 hover:bg-green-700 disabled:opacity-50"
          onClick={handleTest}
          disabled={disabled}
        >
          {translater.tryTypingPractice}
        </button>
        <button
          className="w-32 h-10 rounded-md text-white font-bold mx-1 text-lg bg-blue-500 hover:bg-blue-700 disabled:opacity-50"
          onClick={() => createMutation.mutate()}
          disabled={disabled}
        >
          {translater.save}
        </button>
      </div>
    </div>
  );
}
