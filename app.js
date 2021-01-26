document.addEventListener('DOMContentLoaded', async () => {
	const partOne = document.querySelector('.part-one');

	const cardText = document.querySelector('.card-text');
	const cardImg = document.querySelector('.card-img');
	const drawCardButton = document.querySelector('.draw-card');

	const getFact = () => {
		fetch('http://numbersapi.com/1?json').then((res) => res.json()).then((data) => console.log(data.text));
	};
	// getFact();

	let promiseArr = [];
	for (let i = 1; i <= 5; i++) {
		promiseArr.push(fetch(`http://numbersapi.com/${i}?json`));
	}

	Promise.all(promiseArr).then((promiseArr) => {
		promiseArr.forEach((response) =>
			response.json().then((data) => {
				const newP = document.createElement('p');
				newP.innerText = data.text;
				partOne.append(newP);
			})
		);
	});

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
});
