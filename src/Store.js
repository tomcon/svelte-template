import { Store } from 'svelte/store.js';

export default class ArticleStore extends Store {
  constructor() {
    super({
      message: 'store'
    });
  }
}