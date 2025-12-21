// components/CommonPage/DeckSelection/DeckEditForm.tsx
'use client';
import React, { useEffect, useMemo, useState } from 'react';
import MySelect from '@/Basics/MySelect';
import { useUserContext } from '@/contexts/UserContext';
import { useTranslation, useDecks, useTextsByDeck, useDeckMutations } from '@/MyCustomHooks';
import { langDict } from './';
import { showSuccess } from 'utils/toast';
import { detectLanguageFromTitleAndContent } from '@/MyLib/detectLanguage';

const btn = 'w-32 h-10 rounded-md text-white font-bold mx-1 text-lg';
const saveBtn = `${btn} bg-blue-500 hover:bg-blue-700`;
const delBtn = `${btn} bg-red-500 hover:bg-red-700`;
const fieldCls =
  'w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400';
const selectCls =
  'w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300';

export default function DeckEditForm() {
  const [translater] = useTranslation(langDict) as any;

  // ---- User ----
  const { userData } = useUserContext();
  const userIdNum = useMemo(() => {
    const s = userData?.userID ?? '';
    return /^\d+$/.test(s) ? Number(s) : null;
  }, [userData?.userID]);

  // ---- Local UI state ----
  const [selectedDeckIdStr, setSelectedDeckIdStr] = useState(''); // デッキ選択
  const selectedDeckId = selectedDeckIdStr ? Number(selectedDeckIdStr) : undefined;

  // 編集対象フィールド（簡素化：タイトル + 本文のみ）
  const [editTitle, setEditTitle] = useState('');
  const [selectedTextIdStr, setSelectedTextIdStr] = useState(''); // 複数テキストがある場合のみ使用
  const [editContent, setEditContent] = useState('');

  const selectedTextId = selectedTextIdStr ? Number(selectedTextIdStr) : undefined;

  // ---- Queries ----
  const { data: decks = [], isLoading: decksLoading } = useDecks(userIdNum);
  const { data: texts = [], isLoading: textsLoading } = useTextsByDeck(selectedDeckId);

  // ---- Mutations ----
  const { mutUpdateDeck, mutUpdateText, mutDeleteDeck, mutDeleteText } = useDeckMutations();

  // Select 用オプション
  const deckValues = useMemo(() => decks.map((d) => String(d.deck_id)), [decks]);
  const deckLabels = useMemo(() => decks.map((d) => d.title), [decks]);

  const textValues = useMemo(() => texts.map((t) => String(t.text_id)), [texts]);
  const textLabels = useMemo(() => texts.map((t) => t.title), [texts]);

  // デッキ変更時：タイトル初期化、テキスト選択を初期化
  useEffect(() => {
    const d = decks.find((dd) => dd.deck_id === selectedDeckId);
    // 余計な再レンダー防止のため同値なら set しない
    const nextTitle = d?.title ?? '';
    setEditTitle((prev) => (prev === nextTitle ? prev : nextTitle));

    if (texts.length > 0) {
      const first = texts[0];
      const nextIdStr = String(first.text_id);
      setSelectedTextIdStr((prev) => (prev === nextIdStr ? prev : nextIdStr));
      setEditContent((prev) => (prev === (first.text11 ?? '') ? prev : (first.text11 ?? '')));
    } else {
      // 同値ガード付き
      setSelectedTextIdStr((prev) => (prev === '' ? prev : ''));
      setEditContent((prev) => (prev === '' ? prev : ''));
    }
  }, [selectedDeckId, decks, texts]); // ★ texts.length ではなく texts を依存に

  // テキスト選択が変わったら本文を反映
  useEffect(() => {
    if (!selectedTextId) return;
    const t = texts.find((x) => x.text_id === selectedTextId);
    setEditContent(t?.text11 ?? '');
  }, [selectedTextId, texts]);

  // 保存（デッキ＋テキストを同時に）
  const onSave = async () => {
    if (!selectedDeckId) return;
    // 最終的に操作する textId：選ばれていればそれ、なければ先頭
    const targetTextId =
      selectedTextId ??
      (texts.length > 0 ? texts[0].text_id : undefined);

    if (!targetTextId) {
      // ありえないが、テキストが存在しないデッキだった場合は何もしない
      return showSuccess(translater?.noChanges ?? '変更はありません');
    }

    const title = editTitle.trim();
    const content = editContent.trim();
    const lang = detectLanguageFromTitleAndContent(title, content); // 'en' | 'others'

    const jobs: Promise<any>[] = [];

    // デッキ更新：タイトル、lang、固定項目
    jobs.push(
      mutUpdateDeck.mutateAsync({
        id: selectedDeckId,
        data: {
          title,
          description: null,
          lang,
          shuffle: false,
        },
        userId: userIdNum ?? undefined, // invalidate 用
      })
    );

    // テキスト更新：タイトル＝デッキタイトル、本文
    jobs.push(
      mutUpdateText.mutateAsync({
        id: targetTextId,
        data: { title, text11: content },
        deckId: selectedDeckId, // invalidate 用
      })
    );

    await Promise.all(jobs);
    showSuccess(translater?.saveComplete ?? '保存しました');
  };

  // 削除（そのまま維持）
  const onDeleteDeck = () => {
    if (!selectedDeckId) return;
    if (!window.confirm(translater?.confirmDeleteDeck ?? 'このデッキを削除します。よろしいですか？')) return;
    mutDeleteDeck.mutate({ deckId: selectedDeckId, userId: userIdNum ?? undefined });
    setSelectedDeckIdStr('');
    setSelectedTextIdStr('');
    setEditTitle('');
    setEditContent('');
  };

  const disabledSave = !selectedDeckId || !editTitle.trim() || !editContent.trim();

  return (
    <div className="flex flex-col space-y-6">
      {/* デッキ選択 */}
      <section className="grid grid-cols-6 gap-4 items-center">
        <label className="col-span-2">{translater?.editDeck ?? '編集するデッキ'}</label>
        <MySelect
          state={selectedDeckIdStr}
          setState={setSelectedDeckIdStr}
          optionValues={['', ...deckValues]}
          optionTexts={['-- choose --', ...deckLabels]}
          attrs={{ className: `col-span-4 ${selectCls}`, disabled: decksLoading }}
        />
      </section>

      {/* タイトル（デッキ＝テキスト共通） */}
      <section className="grid grid-cols-6 gap-4 items-center">
        <label className="col-span-2">
          {translater?.newDeckName ?? 'タイトル'}
          <span className="text-red-500">*</span>
        </label>
        <input
          className={`col-span-4 ${fieldCls}`}
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder={translater?.enterNewDeckName ?? 'デッキ/テキストのタイトル'}
          disabled={!selectedDeckId}
        />
      </section>

      {/* テキスト選択（既存デッキに複数のテキストがある場合のみ表示）
      {selectedDeckId && texts.length > 1 && (
        <section className="grid grid-cols-6 gap-4 items-center">
          <label className="col-span-2">{translater?.editText ?? 'テキスト選択'}</label>
          <MySelect
            state={selectedTextIdStr}
            setState={setSelectedTextIdStr}
            optionValues={['', ...textValues]}
            optionTexts={['-- choose --', ...textLabels]}
            attrs={{ className: `col-span-4 ${selectCls}`, disabled: textsLoading }}
          />
        </section>
      )} */}

      {/* 本文（縦並び＆ワイド） */}
      <section className="grid grid-cols-6 gap-2 items-start">
        <label className="col-span-6 font-medium">
          Typing text
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="col-span-6">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="ここにタイピング用の本文を入力"
            className={`${fieldCls} h-72 w-full md:max-w-4xl`}
            disabled={!selectedDeckId}
            aria-label="Typing text"
          />
        </div>
      </section>

      {/* 操作 */}
      <div className="flex justify-end space-x-4">
        <button className={delBtn} onClick={onDeleteDeck} disabled={!selectedDeckId}>
          {translater?.delete ?? 'デッキ削除'}
        </button>
        <button className={saveBtn} onClick={onSave} disabled={disabledSave}>
          {translater?.save ?? '保存'}
        </button>
      </div>
    </div>
  );
}
