import svelte from 'rollup-plugin-svelte';

export default {
  input: 'src/Article.html',
  output: {
    file: 'build/article.server.js',
    format: 'cjs'
  },
	plugins: [
		svelte({
      generate: 'ssr',
      cascade: false
		})
	]
};