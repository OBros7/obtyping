'use client';

import React, { useState, useEffect } from 'react';
import { visibility2int, lang2int } from '@/MyLib/Mapper';
import {
	getDeckListByUser,
	getTextListByDeck,
	ReceivedDeck,
} from '@/MyLib/UtilsAPITyping';
import {
	MyInputNumber,
	MySelect,
	MyTextbox,
	MyTextarea,
} from '@/Basics';
import { FormatCategory } from '@/CommonPage/DeckSelection';
import { useQuery, useMutation } from '@tanstack/react-query';
import { showError } from 'utils/toast';
import { ApiError } from '@/MyLib/apiError';

/* ---------- 定数 ---------- */
const visibilityOptions = Object.keys(visibility2int);
const langOptions = Object.keys(lang2int);
const classParDivDefault = 'flex flex-col items-start space-y-4 w-full';
const classChildDivDefault = 'w-full';

/* ---------- 型 ---------- */
interface Deck {
	deck_id: number;
	title: string;
	description: string;
}

interface TextGetterProps {
	userID: number;
	url: string;
	title?: string;
	setTitle?: React.Dispatch<React.SetStateAction<string>>;
	visibility?: string;
	visibilityOptions?: string[] | undefined;
	setVisibility?: React.Dispatch<React.SetStateAction<string>>;
	text1?: string;
	setText1?: React.Dispatch<React.SetStateAction<string>>;
	text2?: string;
	setText2?: React.Dispatch<React.SetStateAction<string>>;
	lang1: string;
	setLang1: React.Dispatch<React.SetStateAction<string>>;
	lang2: string;
	setLang2: React.Dispatch<React.SetStateAction<string>>;
	category: string;
	setCategory: React.Dispatch<React.SetStateAction<string>>;
	subcategory: string;
	setSubcategory: React.Dispatch<React.SetStateAction<string>>;
	level: string;
	setLevel: React.Dispatch<React.SetStateAction<string>>;
	nSelect: number;
	setNSelect: React.Dispatch<React.SetStateAction<number>>;
	setReturnedData: React.Dispatch<React.SetStateAction<any>>;
	orderBy: string;
	classParDiv?: string;
	classChildDiv?: string;
}

/* ---------- コンポーネント ---------- */
export default function TextGetter(props: TextGetterProps) {
	/* --- props 抽出（依存配列が短くなる） --- */
	const {
		userID,
		title,
		setTitle,
		visibility,
		setVisibility,
		lang1,
		setLang1,
		lang2,
		setLang2,
		text1,
		setText1,
		text2,
		setText2,
		category,
		setCategory,
		subcategory,
		setSubcategory,
		level,
		setLevel,
		nSelect,
		setNSelect,
		setReturnedData,
		orderBy,
		classParDiv = classParDivDefault,
		classChildDiv = classChildDivDefault,
	} = props;

	/* ---------- ① デッキ一覧を取得 ---------- */
	const {
		data: deckData = [],
		isLoading: deckLoading,
		isError: deckError,
		error: deckErrObj,
	} = useQuery<ReceivedDeck[], ApiError>({
		queryKey: ['decks', userID],
		queryFn: () => getDeckListByUser(userID),
		staleTime: 5 * 60 * 1000,
	});

	/* エラーが起きたらトースト */
	useEffect(() => {
		if (deckError && deckErrObj) {
			const err = deckErrObj as ApiError;
			showError(`${err.message} (status ${err.status ?? '??'})`);
		}
	}, [deckError, deckErrObj]);

	/* ---------- ② テキスト取得ミューテーション ---------- */
	const textGetter = useMutation({
		mutationFn: (deckID: number) =>
			getTextListByDeck(deckID, nSelect, orderBy),
		onSuccess: (data) => {
			setReturnedData(data);
			setMsg('Done');
		},
		onError: (e) => {
			const err = e as ApiError;
			showError(`${err.message} (status ${err.status ?? '??'})`);
			setMsg('Error');
		},
	});

	/* ---------- UI 状態 ---------- */
	const [msg, setMsg] = useState('');
	const [deckTitle, setDeckTitle] = useState('');

	/* ---------- Submit ---------- */
	const handleSubmit = () => {
		const deck = deckData.find((d) => d.title === deckTitle);
		if (!deck) {
			setMsg('Deck not found');
			return;
		}
		textGetter.mutate(deck.deck_id);
	};

	/* ---------- レンダリング ---------- */
	return (
		<div className={classParDiv}>
			{/* デッキ選択プルダウン */}
			<div className={classChildDiv}>
				Deck:
				<MySelect
					state={deckTitle}
					setState={setDeckTitle}
					optionValues={deckData.map((d) => d.title)}
				// disabled={deckLoading}		// ロード中の表示は検討中
				/>
			</div>

			{/* 以下は props の有無で表示 */}
			{title !== undefined && setTitle && (
				<div className={classChildDiv}>
					Title:
					<MyTextbox
						state={title}
						setState={setTitle}
						textboxClass='text-box w-3/4 ml-2'
					/>
				</div>
			)}

			{visibility !== undefined && setVisibility && (
				<div className={classChildDiv}>
					Visibility:
					<MySelect
						state={visibility}
						setState={setVisibility}
						optionValues={visibilityOptions}
					/>
				</div>
			)}

			{text1 !== undefined && setText1 && text2 !== undefined && setText2 && (
				<>
					<div className={`${classChildDiv} flex-grow`}>
						Text1:
						<MyTextarea
							state={text1}
							setState={setText1}
							textareaClass='text-box h-48 w-full'
						/>
					</div>
					<div className={classChildDiv}>
						Text2:
						<MyTextarea
							state={text2}
							setState={setText2}
							textareaClass='text-box h-48 w-full'
						/>
					</div>
				</>
			)}

			{/* 言語・カテゴリ選択 */}
			<div className={classChildDiv}>
				Language 1:
				<MySelect
					state={lang1}
					setState={setLang1}
					optionValues={langOptions}
				/>
			</div>
			<div className={classChildDiv}>
				Language 2:
				<MySelect
					state={lang2}
					setState={setLang2}
					optionValues={langOptions}
				/>
			</div>

			<FormatCategory
				category={category}
				setCategory={setCategory}
				subcategory={subcategory}
				setSubcategory={setSubcategory}
				level={level}
				setLevel={setLevel}
			/>

			{/* Submit ボタン */}
			<div className={`${classChildDiv} flex item-center justify-center py-6`}>
				<button
					onClick={handleSubmit}
					className='btn-primary'
					disabled={textGetter.isPending || deckLoading}
				>
					{textGetter.isPending ? 'Loading…' : 'Submit'}
				</button>
				{msg}
			</div>
		</div>
	);
}
