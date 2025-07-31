'use client';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import MySelect from '@/Basics/MySelect';
import { useMutation } from '@tanstack/react-query';
import { createDeckWithTexts, PostDeck, NewTextForDeck } from '@/MyLib/UtilsAPITyping';
import { useRouter } from 'next/navigation';
import { showError, showSuccess } from 'utils/toast';
import { langDict } from './'
import { useTranslation } from '@/MyCustomHooks'

interface TextInput {
  name: string;
  content: string;
}
interface DeckUploadFormProps {
  deckOptions?: string[];
}

type SavePayload = {
  deckName: string;
  deckDescription: string;
  language: string;
  shuffle: string;
  texts: { name: string; content: string }[];
};

const buttonCls = 'w-32 h-10 rounded-md text-white font-bold mx-1 text-lg';
const tryBtnCls = `${buttonCls} bg-green-500 hover:bg-green-700 disabled:opacity-50`;
const saveBtnCls = `${buttonCls} bg-blue-500 hover:bg-blue-700`;
const delBtnCls = `${buttonCls} bg-red-500 hover:bg-red-700`;

let askedDraftRestore = false;

export default function DeckUploadForm({ deckOptions = [] }: DeckUploadFormProps) {
  /* モードと練習時間 */
  const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]

  const languageOptions = ['english', 'others'];
  const shuffleOptions = [translater.selectNotShuffle, translater.selectShuffle];
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [modeTime, setModeTime] = useState<1 | 2 | 3 | 5>(1);
  const router = useRouter();

  /* 新規作成 state */
  const [deckName, setDeckName] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  const [language, setLanguage] = useState(languageOptions[0]);
  const [shuffle, setShuffle] = useState(shuffleOptions[0]);
  const [texts, setTexts] = useState<TextInput[]>([{ name: '', content: '' }]);

  /* 編集 state */
  const [selectedDeck, setSelectedDeck] = useState('');
  const [editShuffle, setEditShuffle] = useState(shuffleOptions[0]);
  const [selectedTextName, setSelectedTextName] = useState('');
  const [selectedTextContent, setSelectedTextContent] = useState('');

  /* ────────────────────────────────────────── */
  /* ローカルストレージからドラフトを復元するロジック
     React 18 の StrictMode では開発環境で useEffect が 2 回呼ばれるため、
     window.confirm が重複表示される。このフラグで一度だけ実行。 */
  /* ────────────────────────────────────────── */
  const hasRestored = useRef(false);
  useEffect(() => {
    if (askedDraftRestore) return;          // ★ 既に確認済なら何もしない
    askedDraftRestore = true;

    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem('deckDraft');
    if (!raw) return;

    try {
      const draft = JSON.parse(raw) as {
        deckName: string;
        deckDescription: string;
        language: string;
        shuffle: string;
        texts: TextInput[];
      };

      // すでに入力があれば復元しない
      if (deckName || texts.some((t) => t.name || t.content)) return;

      if (window.confirm(translater.askRestoreBackup)) {
        setDeckName(draft.deckName);
        setDeckDescription(draft.deckDescription);
        setLanguage(draft.language);
        setShuffle(draft.shuffle);
        setTexts(draft.texts.length ? draft.texts : [{ name: '', content: '' }]);
      }
    } catch {
      /* パース失敗時は無視 */
    }
  }, []);

  /* ────────────────────────────────────────── */
  /* React‑Query ミューテーション（Create のみ） */
  /* ────────────────────────────────────────── */
  const createMutation = useMutation({
    mutationFn: async (form: SavePayload) => {
      const deckPayload: PostDeck = {
        title: form.deckName.trim(),
        description: form.deckDescription.trim() || null,
        lang: form.language === 'english' ? "en" : "others",
        visibility: "private",
        typing_mode: "custom",
        category_id: null,
        subcategory_id: null,
        level_id: null,
        shuffle: form.shuffle === 'ランダムにする' ? true : false,
      };

      const textPayloads: NewTextForDeck[] = form.texts.map((t) => ({
        title: t.name.trim(),
        text11: t.content.trim(),
      }));

      // まとめて登録
      return createDeckWithTexts({
        deck: deckPayload,
        texts: textPayloads,
      });
    },
    onSuccess: () => {
      showSuccess(translater.saveComplete);
      localStorage.removeItem('deckDraft');
    },
    onError: (e: any) => showError(e.message ?? translater.saveError),
  });

  /* helpers */
  const canAddMoreText = texts.length < 5;
  const addTextField = () => canAddMoreText && setTexts((p) => [...p, { name: '', content: '' }]);
  const updateTextField = (idx: number, field: keyof TextInput, value: string) =>
    setTexts((prev) => prev.map((t, i) => (i === idx ? { ...t, [field]: value } : t)));

  const handleSave = () => {
    createMutation.mutate({
      deckName,
      deckDescription,
      language,
      shuffle,
      texts,
    });
  };

  /* プレビュー（同タブ遷移 / 旧ロジックはコメントアウト） */
  const handleTest = useCallback(() => {
    // Draft を sessionStorage → Typing 用、 localStorage → 復元用
    const draft = { deckName, deckDescription, language, shuffle, texts };
    sessionStorage.setItem('typingDraft', JSON.stringify({ deckName, texts }));
    localStorage.setItem('deckDraft', JSON.stringify(draft));

    const deckId = -10;
    const url = `/typing/typing?deckid=${deckId}&minutes=${modeTime}&lang=${language}`;

    // window.open(url, '_blank'); // ⭐ 旧: 新しいタブでプレビュー
    router.push(url);              // 新: 同タブで遷移
  }, [deckName, deckDescription, language, shuffle, texts, modeTime, router]);

  /* Render – Create */
  const renderCreateMode = () => (
    <div className="flex flex-col space-y-6">
      {/* ───── 新デッキ情報 ───── */}
      <section className="grid grid-cols-6 gap-4 items-center">
        <label className="col-span-2">{translater.newDeckName}<span className="text-red-500">*</span></label>
        <input
          type="text"
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
          placeholder={translater.enterNewDeckName}
          className="col-span-4 input input-bordered border border-gray-400 placeholder-gray-400 w-full"
        />

        <label className="col-span-2">{translater.deckDescription}</label>
        <textarea
          value={deckDescription}
          onChange={(e) => setDeckDescription(e.target.value)}
          placeholder={translater.enterDeckDescription}
          className="col-span-4 textarea textarea-bordered border border-gray-400 placeholder-gray-400 h-24"
        />

        <label className="col-span-2">{translater.language}</label>
        <MySelect
          state={language}
          setState={setLanguage}
          optionValues={languageOptions}
          attrs={{ className: 'select select-bordered col-span-4 border-gray-400' }}
        />

        <label className="col-span-2">{translater.displayOrderRandom}</label>
        <MySelect
          state={shuffle}
          setState={setShuffle}
          optionValues={shuffleOptions}
          attrs={{ className: 'select select-bordered col-span-4 border-gray-400' }}
        />
      </section>

      {/* テキスト入力欄 */}
      <section className="flex flex-col space-y-8">
        {texts.map((t, idx) => (
          <div key={idx} className="space-y-2 border p-4 rounded-2xl shadow">
            <h3 className="font-semibold">{translater.text} {idx + 1}</h3>
            <input
              type="text"
              value={t.name}
              onChange={(e) => updateTextField(idx, 'name', e.target.value)}
              placeholder={translater.enterTextTitle}
              className="input input-bordered border border-gray-400 placeholder-gray-400 w-full"
            />
            <textarea
              value={t.content}
              onChange={(e) => updateTextField(idx, 'content', e.target.value)}
              placeholder={translater.descriptionTextArea}
              className="textarea textarea-bordered border border-gray-400 placeholder-gray-400 w-full h-40" />
          </div>
        ))}
        {canAddMoreText && (
          <button onClick={addTextField} className="btn btn-outline w-fit self-end">{translater.addMoreTexts}</button>
        )}
      </section>

      <div className="flex justify-end space-x-4 items-center">
        <button
          className={tryBtnCls}
          onClick={handleTest}
          disabled={!deckName || texts.some((t) => !t.name || !t.content)}
        >
          {translater.tryTypingPractice}
        </button>
        <MySelect
          state={modeTime}
          setState={setModeTime}
          optionValues={[1, 2, 3, 5]}
          optionTexts={['1m', '2m', '3m', '5m']}
          attrs={{ className: 'select select-bordered w-20' }}
        />
        <button
          className={saveBtnCls}
          onClick={handleSave}
          disabled={!deckName || texts.some((t) => !t.name || !t.content)}
        >
          {translater.save}
        </button>
      </div>
    </div>
  );

  /* Render – Edit */
  const renderEditMode = () => (
    <div className="flex flex-col space-y-6">
      <section className="grid grid-cols-6 gap-4 items-center">
        <label className="col-span-2">{translater.editDeck}</label>
        <MySelect
          state={selectedDeck}
          setState={setSelectedDeck}
          optionValues={['', ...deckOptions]}
          optionTexts={['-- choose --', ...deckOptions]}
          attrs={{ className: 'select select-bordered col-span-4 border-gray-400' }}
        />

        <label className="col-span-2">{translater.displayOrderRandom}</label>
        <MySelect
          state={editShuffle}
          setState={setEditShuffle}
          optionValues={shuffleOptions}
          attrs={{ className: 'select select-bordered col-span-4 border-gray-400' }}
        />

        <label className="col-span-2">{translater.editText}</label>
        <MySelect
          state={selectedTextName}
          setState={setSelectedTextName}
          optionValues={[selectedTextName || '-- none --']}
          attrs={{ className: 'select select-bordered col-span-4 border-gray-400' }}
        />
      </section>

      <section className="flex flex-col">
        <label className="mb-2">選択したテキストの文章<span className="text-red-500">*</span></label>
        <textarea
          value={selectedTextContent}
          onChange={(e) => setSelectedTextContent(e.target.value)}
          placeholder="文章を入力してください"
          className="textarea textarea-bordered border border-gray-400 placeholder-gray-400 h-60"
        />
      </section>

      <div className="flex justify-end space-x-4">
        <button className={delBtnCls} onClick={() => showError('削除ロジックは未実装です')}>{translater.delete}</button>
        <button className={saveBtnCls} onClick={() => showSuccess('更新ロジックは未実装です')}>{translater.save}</button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col space-y-8 max-w-5xl mx-auto p-8">
      <MySelect
        state={mode}
        setState={setMode}
        optionValues={['create', 'edit']}
        optionTexts={[translater.createNewDeck, translater.editDeckAndText]}
        attrs={{ className: 'select select-primary w-72 self-center' }}
      />
      {mode === 'create' ? renderCreateMode() : renderEditMode()}
    </div>
  );
}
