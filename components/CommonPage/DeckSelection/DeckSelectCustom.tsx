// components/CommonPage/DeckSelection/DeckSelectCustom.tsx
import React, { useEffect, useState } from 'react'
import { Layout, MainContainer } from '@/Layout'
import langDict from './langDict'
import { useTranslation } from '@/MyCustomHooks'
import { MySelect } from '@/Basics'
import {
	DeckListButton,
	AddText,
	CreateDeck,
} from '.'
import {
	ReceivedDeck,
	getDeckListByUser,
} from '@/MyLib/UtilsAPITyping'

const mainClass = 'flex flex-col items-center justify-center space-y-4'
const saveButtonClass = 'btn-second '

export default function DeckSelectCustom() {
	const [deckList, setDeckList] = useState<ReceivedDeck[]>([])
	const [pageType, setPageType] = useState<'NewDeck' | 'YourDeck'>('YourDeck')
	const [deckName, setDeckName] = useState('');
	const [description, setDescription] = useState('');
	const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]
	const [addType, setAddType] = useState<'AddText' | 'CreateDeck'>('CreateDeck')


	useEffect(() => {
		const userID = 1
		const fetchDeckList = async () => {
			let resJSON = await getDeckListByUser(userID)
			setDeckList(resJSON)
			console.log('deckList', deckList)

			// return resJSON; // or set it in a state variable.
		}
		fetchDeckList()
		// setDeckList(resJSON)
		console.log('addType', addType)
		console.log('decklist', deckList)
	}, [])

	return (
		<Layout>
			<MainContainer addClass='p-4'>
				<div className={mainClass}>
					<MySelect
						state={pageType}
						setState={setPageType}
						optionValues={['YourDeck', 'NewDeck']}
						optionTexts={['Your Original Deck', 'Create New Deck']}
					/>
					{
						pageType === 'NewDeck' ?
							<>
								<MySelect
									state={addType}
									setState={setAddType}
									optionValues={['AddText', 'CreateDeck']}
									optionTexts={['Add text to existing deck', 'Make a new deck']}
								/>
								{addType === 'AddText' ?
									<AddText
										deckList={deckList}
										setDeckList={setDeckList}
										deckName={deckName}
										setDeckName={setDeckName}
									/>
									:
									<CreateDeck
										deckList={deckList}
										setDeckList={setDeckList}
										deckName={deckName}
										setDeckName={setDeckName}
									/>}

							</>
							:
							pageType === 'YourDeck' ?
								<DeckListButton deckList={deckList} /> :
								null
					}
				</div>

			</MainContainer>
		</Layout>
	)
}
