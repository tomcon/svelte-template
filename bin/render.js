const fs = require('fs');

const article = require('../build/article.server.js');
const template = fs.readFileSync('./bin/template.html', 'utf8');

// We currently can't import stores into node :(
// Can do this maybe: https://github.com/sveltejs/svelte/issues/967
// const esm = require('@std/esm')(module, { esm: 'js' });
// const { Store } = esm('svelte/store');

const rendered = article.render();
const {head, html, css} = rendered;
const output = template.replace('/* CSS */', css.code).replace('<!-- HTML -->', html).replace('<!-- HEAD -->', head);

fs.writeFileSync('./public/index.html', output, 'utf8')