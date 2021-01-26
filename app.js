document.addEventListener('DOMContentLoaded', async () => {
	const partOne = document.querySelector('.part-one');

	const cardText = document.querySelector('.card-text');
	const cardImg = document.querySelector('.card-img');
	const drawCardButton = document.querySelector('.draw-card');

	/**
   * Number Facts
   */
	// Promise NumberFacts-1
	const getFact = () => {
		fetch('http://numbersapi.com/1?json').then((res) => res.json()).then((data) => console.log(data.text));
	};
	getFact();

	// Async NumberFact
	const getAsyncFact = async () => {
		const res = await fetch('http://numbersapi.com/1?json');
		const data = res.json();
		return data;
	};
	getAsyncFact();

	// Promise NumberFacts-
	const favNum = 4;
	Promise.all(
		Array.from({ length: 4 }, async () => {
			const res = await fetch(`http://numbersapi.com/${favNum}?json`);
			const data = await res.json();
			return data;
		})
	).then((facts) =>
		facts.forEach((data) => {
			const newP = document.createElement('p');
			newP.innerText = data.text;
			partOne.append(newP);
		})
	);
	// Async NumberFacts
	const getAsyncNumFacts = async (favNum) => {
		const facts = await Promise.all(
			Array.from({ length: 4 }, async () => {
				const res = await fetch(`http://numbersapi.com/${favNum}?json`);
				const data = await res.json();
				return data;
			})
		);
		facts.forEach((data) => {
			const newP = document.createElement('p');
			newP.innerText = data.text;
			partOne.append(newP);
		});
	};

	/**
   * Deck of Cards
   */
	// Promises
	let deckIdPromise;
	fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
		.then((data) => {
			deckIdPromise = data.deck_id;
		})
		.catch((e) => console.log(e));

	let cardObjPromise;
	fetch(`https://deckofcardsapi.com/api/deck/${deckIdPromise}/draw/?count=1`)
		.then((data) => (cardObjPromise = data))
		.catch((e) => console.log(e));

	// Async
	const getDeckId = async () => {
		const res = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
		const data = await res.json();

		return data.deck_id;
	};

	const drawFromDeck = async (deckId) => {
		const res = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
		const data = await res.json();

		return data;
	};

	const handleCard = ({ success, remaining, cards }) => {
		if (success) {
			if (remaining === 0) {
				cardText.innerText = 'No more cards!';
			} else {
				const [ { value, suit, image } ] = cards;
				cardText.innerText = `${value} of ${suit}`;
				cardImg.src = image;
			}
		}
	};

	const deckId = await getDeckId();

	drawCardButton.addEventListener('click', async () => {
		const newCard = await drawFromDeck(deckId);
		handleCard(newCard);
	});
	// end Async
});
