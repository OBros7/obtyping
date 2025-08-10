// components/CommonPage/DeckSelection/DeckEditForm.tsx
'use client';
import React, { useEffect, useMemo, useState } from 'react';
import MySelect from '@/Basics/MySelect';
import { useUserContext } from '@/contexts/UserContext';
import { useTranslation, useDecks, useTextsByDeck, useDeckMutations } from '@/MyCustomHooks';
import { langDict } from './';
import { showSuccess } from 'utils/toast';

const btn = 'w-32 h-10 rounded-md text-white font-bold mx-1 text-lg';
const saveBtn = `${btn} bg-blue-500 hover:bg-blue-700`;
const delBtn = `${btn} bg-red-500 hover:bg-red-700`;
const fieldCls = 'w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400';
const selectCls = 'w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300';

export default function DeckEditForm() {
  const [translater] = useTranslation(langDict) as any;

  // ---- User ----
  const { userData } = useUserContext();
  // userID は string なので数値に変換（空や非数値は null 扱い）
  const userIdNum = useMemo(() => {
    const s = userData?.userID ?? '';
    return /^\d+$/.test(s) ? Number(s) : null;
  }, [userData?.userID]);

  // ---- Local UI state ----
  const [selectedDeckIdStr, setSelectedDeckIdStr] = useState(''); // MySelect は文字列で扱う
  const [selectedTextIdStr, setSelectedTextIdStr] = useState('');
  const [selectedTextContent, setSelectedTextContent] = useState('');
  const [editShuffleBool, setEditShuffleBool] = useState(false);

  const selectedDeckId = selectedDeckIdStr ? Number(selectedDeckIdStr) : undefined;
  const selectedTextId = selectedTextIdStr ? Number(selectedTextIdStr) : undefined;

  // ---- Queries ----
  const { data: decks = [], isLoading: decksLoading } = useDecks(userIdNum);
  const { data: texts = [], isLoading: textsLoading } = useTextsByDeck(selectedDeckId);

  // ---- Mutations ----
  const { mutUpdateDeck, mutUpdateText, mutDeleteDeck, mutDeleteText } = useDeckMutations();

  // テキスト選択時に本文を反映
  useEffect(() => {
    const t = texts.find((x) => x.text_id === selectedTextId);
    setSelectedTextContent(t?.text11 ?? '');
  }, [selectedTextId, texts]);

  // デッキ変更時に初期値セット（shuffle 反映＆テキスト選択リセット）
  useEffect(() => {
    setSelectedTextIdStr('');
    setSelectedTextContent('');
    const d = decks.find((dd) => dd.deck_id === selectedDeckId);
    if (d?.shuffle != null) setEditShuffleBool(!!d.shuffle);
  }, [selectedDeckId, decks]);

  // Select 用オプション
  const deckValues = useMemo(() => decks.map((d) => String(d.deck_id)), [decks]);
  const deckLabels = useMemo(() => decks.map((d) => d.title), [decks]);
  const textValues = useMemo(() => texts.map((t) => String(t.text_id)), [texts]);
  const textLabels = useMemo(() => texts.map((t) => t.title), [texts]);

  // 保存：デッキ設定(shuffle)と選択テキスト本文の変更をまとめて
  const onSave = async () => {
    const jobs: Promise<any>[] = [];

    if (selectedDeckId != null) {
      jobs.push(
        // ★ userId を渡す（invalidate を ['decks', userId] に寄せるため）
        mutUpdateDeck.mutateAsync({
          id: selectedDeckId,
          data: { shuffle: editShuffleBool },
          userId: userIdNum ?? undefined,
        })
      );
    }

    if (selectedTextId != null && selectedDeckId != null) {
      jobs.push(
        // ★ deckId を必須で渡す形に（invalidate で使う）
        mutUpdateText.mutateAsync({
          id: selectedTextId,
          data: { text11: selectedTextContent.trim() },
          deckId: selectedDeckId,
        })
      );
    }

    if (jobs.length === 0) return showSuccess(translater.noChanges ?? '変更はありません');
    await Promise.all(jobs);
  };

  const onDeleteDeck = () => {
    if (!selectedDeckId) return;
    if (!window.confirm(translater.confirmDeleteDeck ?? 'このデッキを削除します。よろしいですか？')) return;

    // ★ オブジェクトで渡す & userId も渡す
    mutDeleteDeck.mutate({ deckId: selectedDeckId, userId: userIdNum ?? undefined });

    setSelectedDeckIdStr('');
    setSelectedTextIdStr('');
    setSelectedTextContent('');
  };

  const onDeleteText = () => {
    if (!selectedTextId || !selectedDeckId) return;
    if (!window.confirm(translater.confirmDeleteText ?? 'このテキストを削除します。よろしいですか？')) return;

    // ★ オブジェクトで渡す（deckId 必須）
    mutDeleteText.mutate({ textId: selectedTextId, deckId: selectedDeckId });

    setSelectedTextIdStr('');
    setSelectedTextContent('');
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* デッキ選択 */}
      <section className="grid grid-cols-6 gap-4 items-center">
        <label className="col-span-2">{translater.editDeck}</label>
        <MySelect
          state={selectedDeckIdStr}
          setState={setSelectedDeckIdStr}
          optionValues={['', ...deckValues]}
          optionTexts={['-- choose --', ...deckLabels]}
          attrs={{ className: `col-span-4 ${selectCls}` }}
        />

        <label className="col-span-2">{translater.displayOrderRandom}</label>
        <MySelect
          state={editShuffleBool ? '1' : '0'}
          setState={(v: string) => setEditShuffleBool(v === '1')}
          optionValues={['0', '1']}
          optionTexts={[translater.selectNotShuffle, translater.selectShuffle]}
          attrs={{ className: `col-span-4 ${selectCls}` }}
        />

        <label className="col-span-2">{translater.editText}</label>
        <MySelect
          state={selectedTextIdStr}
          setState={setSelectedTextIdStr}
          optionValues={['', ...textValues]}
          optionTexts={['-- choose --', ...textLabels]}
          attrs={{ className: `col-span-4 ${selectCls}`, disabled: !selectedDeckId || textsLoading }}
        />
      </section>

      <section className="flex flex-col">
        <label className="mb-2">
          {translater.selectedTextBody ?? '選択したテキストの文章'}
          <span className="text-red-500">*</span>
        </label>
        <textarea
          value={selectedTextContent}
          onChange={(e) => setSelectedTextContent(e.target.value)}
          placeholder="文章を入力してください"
          className={`h-60 ${fieldCls}`}
          disabled={!selectedTextId}
        />
      </section>

      <div className="flex justify-end space-x-4">
        <button className={delBtn} onClick={onDeleteText} disabled={!selectedTextId}>{translater.deleteText ?? 'テキスト削除'}</button>
        <button className={delBtn} onClick={onDeleteDeck} disabled={!selectedDeckId}>{translater.delete ?? 'デッキ削除'}</button>
        <button className={saveBtn} onClick={onSave} disabled={!selectedDeckId && !selectedTextId}>{translater.save ?? '保存'}</button>
      </div>
    </div>
  );
}
