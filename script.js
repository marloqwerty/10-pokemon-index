const pokemonContainer = document.querySelector('.pokemon-container');
const myModal = document.querySelector('#modal-content');
const myModalContent = `
				     	<figure>
               				<img class="img1" alt="">
          				</figure>
						<div class="information-box"></div>						
        				`;
myModal.innerHTML = myModalContent;

/*

CORS header. I commented out as notes
let headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('Accept', 'application/json');

headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:5500/');
headers.append('Access-Control-Allow-Credentials', 'true');

 */
let showLoadingImage = (state) => {
	let displayState = state ? 'flex' : 'none';
	let loadingImage = document.getElementById('loadingImage');
	loadingImage.style.display = displayState;
};

showLoadingImage(true);

fetch('https://pokeapi.co/api/v2/pokemon?limit=100')
	.then((response) => response.json())
	.then((parsed) => {
		let allPromises = [];
		parsed.results.forEach((el) => {
			allPromises.push(fetch(el.url));
		});

		return Promise.all(allPromises);
	})
	.then((responses) => {
		let allJsons = [];
		responses.forEach((el) => {
			allJsons.push(el.json());
		});

		return Promise.all(allJsons);
	})
	.then((jsons) => {
		pokemonContainer.innerHTML = '';
		jsons.forEach((json, index) => {
			const pokemonIndex = index + 1;
			const pokemonName = json.name;
			const pokemonTypes = [];
			json.types.forEach((item) => {
				pokemonTypes.push(item.type.name);
			});

			pokemonContainer.innerHTML += `
			<article  class="item ${pokemonTypes.join(' ')} ${pokemonName}">
				<img alt="${pokemonName}" class="pokemon-profile" src="${json.sprites['front_default']}" onclick="doSomethingOnClick('${pokemonName}')"></img>
                <hgroup>
					<h4 class="poke-id"> 00${pokemonIndex}. ${pokemonName}</h4>
					<h5 class="types"> ${pokemonTypes.join(' & ')}</h5>
                </hgroup>
                <span class="red"></span>
            </article>
			`;
		});
		showLoadingImage(false);
	});

// console.log(pokemonContainer.classList.contains('fire'));
let keyContainer = document.querySelector('.button-container');
const _key = document.querySelectorAll('.type');
const _article = document.querySelectorAll('.item');
const _modal = document.querySelector('.modal');
const _navBarIcon = document.querySelector('.material-icons');

class Pokedex {
	pickToShow(type) {
		type = type.toLowerCase();
		let n = pokemonContainer.children;

		for (let v = 0; v < n.length; v++) {
			if (type != 'all') {
				if (n[v].classList.contains(type)) {
					n[v].style.display = 'flex';
				} else {
					n[v].style.display = 'none';
				}
			} else {
				n[v].style.display = 'flex';
			}
		}
	}

	openMobileNavBar() {
		_modal.style.display = 'none';
		if (keyContainer.style.display === 'flex') {
			keyContainer.style.display = 'none';
			_navBarIcon.innerHTML = 'menu';
		} else {
			keyContainer.style.display = 'flex';
			_navBarIcon.innerHTML = 'close';
		}
	}

	changeTheKeyColor(button) {
		let color1 = button.classList[1];
		keyContainer.style.display = 'none';

		let parent = button.parentElement;
		parent = parent.children;
		window.scrollTo(0, 0);
		keyContainer.style.width = '';
		for (let v = 0; v < parent.length; v++) {
			if (color1 != parent[v].classList[1]) {
				parent[v].style.background = 'white';
				parent[v].style.color = 'black';
				parent[v].style.borderRadius = '10px';
			} else {
				parent[v].style.background = 'var(--button-color)';
				parent[v].style.color = 'white';
				// parent[v].style.borderRadius = '13px';
			}
		}
		_navBarIcon.innerHTML = 'menu';
		let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		if (w < 778) {
			keyContainer.style.display = 'none';
		}
	}

	openTheModal(pokemon) {
		const API = 'https://pokeapi.co/api/v2/pokemon/';

		const img1 = document.querySelector('.img1');
		const information = document.querySelector('.information-box');
		fetch(`${API}${pokemon}`)
			.then((parsed) => parsed.json())
			.then((parsed) => {
				const link = `${parsed.sprites['front_default']}`;
				//	the weight in the api is in hectogram units while the height is in decimeter units
				// convert them into pounds and meter because they are common units
				const weight = (parsed.weight / 4.536).toFixed(2);
				const meter = (parsed.height / 10).toFixed(2);
				const pokemonTypes = [];

				parsed.types.forEach((item) => {
					pokemonTypes.push(item.type.name);
				});
				const pokemonAbilities = [];
				parsed.abilities.forEach((item) => {
					pokemonAbilities.push(item.ability.name);
				});

				information.innerHTML = `
									<h1 class="name">${parsed.id}. ${parsed.name}</h1>
									<table class="more-information">
									<tbody>
										<tr>
											<td>Type : </td>
											<td>${pokemonTypes.join(', ').toUpperCase()}</td>
										</tr>
										<tr>
											<td>Ability : </td>
											<td> ${pokemonAbilities.join(', ').toUpperCase()}</td>
										</tr>
										<tr>
											<td>Height : </td>
											<td> ${meter} meter</td>
										</tr>
										<tr>
											<td>Weight : </td>
											<td> ${weight} lbs</td>
										</tr>
									</tbody>
									</table>
									<button class="close-modal" onclick="pokedex.closeTheModal()">OKAY</button>
					`;
				img1.src = `${link}`;
			});

		// if true show the loading image
		// function to wait the img to fully loaded
		let showLoadingImage = (state) => {
			let displayState = state ? 'flex' : 'none';
			let loadingImage = document.getElementById('loadingImage');
			loadingImage.style.display = displayState;
		};

		showLoadingImage(true);

		img1.onload = function () {
			showLoadingImage(false);
			_modal.style.display = 'block';
		};

		//only way to close the modal
		window.onclick = function (event) {
			if (event.target == _modal) {
				_modal.style.display = 'none';
			}
		};
	}

	closeTheModal() {
		_modal.style.display = 'none';
	}
}

// 	let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

const pokedex = new Pokedex();

_key.forEach((li) => {
	li.addEventListener('click', () => {
		pokedex.pickToShow(li.innerText);
		pokedex.changeTheKeyColor(li);
	});
});

let doSomethingOnClick = (pokemon) => {
	pokedex.openTheModal(pokemon);
};

document.onkeydown = function (e) {
	if (event.keyCode == 123) {
		return false;
	}
	/*  Ctrl+Shift+I */
	if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
		return false;
	}
	/* Ctrl+Shift+C */
	if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
		return false;
	}
	/* Ctrl+Shift+J */
	if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
		return false;
	}
	/* Ctrl+Shift+U */
	if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
		return false;
	}
};
window.addEventListener(
	'contextmenu',
	function (e) {
		// do something here...
		e.preventDefault();
	},
	false,
);
