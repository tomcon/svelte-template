import Article from './Article.html';
import { Store } from 'svelte/store.js';

const store = new Store({
	message: 'store'
});

let article;
const button = document.getElementById('hydrate');
button.addEventListener('click', () => {
	article = new Article({
		target: document.querySelector('#article'),
		hydrate: true,
		store
	});
});

window.article = article;
window.store = store;