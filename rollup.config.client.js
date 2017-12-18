import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';

export default {
	input: 'src/article.js',
	output: {
    file: 'public/article.client.js',
		format: 'iife',
		name: 'Article',
		sourcemap: true
  },
	plugins: [
		svelte({
			hydratable: true,
			css: false,
			cascade: false,
			store: true
		}),
		resolve()
	]
};