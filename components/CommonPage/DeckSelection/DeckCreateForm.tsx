// components/CommonPage/DeckSelection/DeckCreateForm.tsx
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDeckWithTexts, type PostDeck, type NewTextForDeck } from '@/MyLib/UtilsAPITyping';
import { showError, showSuccess } from 'utils/toast';
import { useTranslation } from '@/MyCustomHooks';
import { langDict } from './';
import { detectLanguageFromTitleAndContent } from '@/MyLib/detectLanguage';
import { useRouter } from 'next/router';


export default function DeckCreateForm() {
  const [translater] = useTranslation(langDict) as any;
  const qc = useQueryClient();

  // ====== UI 共通クラス ======
  const fieldCls =
    'w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 ' +
    'focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400';

  // ====== State（タイトルと内容のみ）======
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // ====== ドラフト復元（最小） ======
  const DRAFT_KEY = 'deckDraftV2';
  const askedRestoreRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (askedRestoreRef.current || typeof window === 'undefined') return;
    askedRestoreRef.current = true;

    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;

    try {
      const draft = JSON.parse(raw) as { title?: string; content?: string };
      if ((title && title.trim()) || (content && content.trim())) return;
      if (confirm(translater?.askRestoreBackup ?? '下書きを復元しますか？')) {
        setTitle(draft?.title ?? '');
        setContent(draft?.content ?? '');
      }
    } catch {
      // パース失敗は無視
    }
  }, [title, content, translater]);

  // 入力中は随時ドラフト保存（軽量）
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const draft = { title, content };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [title, content]);

  // ====== バリデーション ======
  const disabled = useMemo(() => !title.trim() || !content.trim(), [title, content]);

  // ====== 保存ミューテーション ======
  const createMutation = useMutation({
    mutationFn: async () => {
      const lang = detectLanguageFromTitleAndContent(title, content); // 'en' | 'others'

      const deckPayload: PostDeck = {
        title: title.trim(),           // デッキタイトル = テキストタイトル = ユーザー入力タイトル
        description: null,             // 説明は固定で null
        lang,                          // FE 判定の結果
        visibility: 'public',          // 既定
        typing_mode: 'custom',         // 現行のまま
        category_id: null,
        subcategory_id: null,
        level_id: null,
        shuffle: false,                // 常に false
      };

      const textsPayload: NewTextForDeck[] = [
        {
          title: title.trim(),         // テキストタイトルも同じ
          text11: content.trim(),      // 本文
        },
      ];

      return createDeckWithTexts({ deck: deckPayload, texts: textsPayload });
    },
    onSuccess: () => {
      showSuccess(translater?.saveComplete ?? '保存しました');
      // 下書き破棄
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch { }

      // デッキ一覧キャッシュを更新
      qc.invalidateQueries({
        predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === 'decks',
      });
    },
    onError: (e: any) => showError(e?.message ?? translater?.saveError ?? '保存に失敗しました'),
  });

  const handleTry = () => {
    const lang = detectLanguageFromTitleAndContent(title, content); // 'en' | 'others'

    // タイピング画面が参照するドラフト（最低限の形で保存）
    try {
      const draft = {
        deckName: title,
        texts: [{ name: title, content }], // 旧フォーマット互換（name/content）
      };
      sessionStorage.setItem('typingDraft', JSON.stringify(draft));
    } catch { }

    // 特殊デッキIDでプレビューへ
    router.push(`/typing/typing?deckid=-10&minutes=1&lang=${lang}`);
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* 入力：タイトル */}
      <section className="grid grid-cols-6 gap-4 items-center">
        <label className="col-span-2">
          {translater?.newDeckName ?? 'タイトル'}
          <span className="text-red-500">*</span>
        </label>
        <input
          className={`col-span-4 ${fieldCls}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={translater?.enterNewDeckName ?? 'デッキ/テキストのタイトル'}
        />
      </section>

      {/* 入力：内容（本文） */}
      <section className="grid grid-cols-6 gap-2 items-start">
        {/* ラベルを1行占有して上に表示（文言は固定で "Typing text"） */}
        <label className="col-span-6 font-medium">
          Typing text
          <span className="text-red-500 ml-1">*</span>
        </label>

        {/* テキストエリアを1行占有。横幅はフル＋上限を少し広めに（md以降 max-w-4xl） */}
        <div className="col-span-6">
          <textarea
            className={`${fieldCls} h-72 w-full md:max-w-4xl`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={translater?.descriptionTextArea ?? 'ここにタイピング用の本文を入力'}
            aria-label="Typing text"
          />
        </div>
      </section>

      {/* 操作 */}
      <div className="flex justify-end">
        <button
          className="w-64 h-10 rounded-md text-white font-bold text-lg bg-green-500 hover:bg-green-700 disabled:opacity-50 mx-4"
          onClick={handleTry}
          disabled={disabled || createMutation.isPending}
        >
          {translater?.tryTypingPractice ?? '試してみる'}
        </button>

        <button
          className="w-36 h-10 rounded-md text-white font-bold text-lg bg-blue-500 hover:bg-blue-700 disabled:opacity-50"
          onClick={() => createMutation.mutate()}
          disabled={disabled || createMutation.isPending}
        >
          {createMutation.isPending
            ? (translater?.saving ?? '保存中…')
            : (translater?.save ?? '保存')}
        </button>
      </div>
    </div>
  );
}
