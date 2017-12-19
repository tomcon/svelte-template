(function () {
'use strict';

function noop() {}

function assign(target) {
	var k,
		source,
		i = 1,
		len = arguments.length;
	for (; i < len; i++) {
		source = arguments[i];
		for (k in source) target[k] = source[k];
	}

	return target;
}

function appendNode(node, target) {
	target.appendChild(node);
}

function insertNode(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function destroyEach(iterations) {
	for (var i = 0; i < iterations.length; i += 1) {
		if (iterations[i]) iterations[i].d();
	}
}

function createElement(name) {
	return document.createElement(name);
}

function createSvgElement(name) {
	return document.createElementNS('http://www.w3.org/2000/svg', name);
}

function createText(data) {
	return document.createTextNode(data);
}

function addListener(node, event, handler) {
	node.addEventListener(event, handler, false);
}

function removeListener(node, event, handler) {
	node.removeEventListener(event, handler, false);
}

function setAttribute(node, attribute, value) {
	node.setAttribute(attribute, value);
}

function children (element) {
	return Array.from(element.childNodes);
}

function claimElement (nodes, name, attributes, svg) {
	for (var i = 0; i < nodes.length; i += 1) {
		var node = nodes[i];
		if (node.nodeName === name) {
			for (var j = 0; j < node.attributes.length; j += 1) {
				var attribute = node.attributes[j];
				if (!attributes[attribute.name]) node.removeAttribute(attribute.name);
			}
			return nodes.splice(i, 1)[0]; // TODO strip unwanted attributes
		}
	}

	return svg ? createSvgElement(name) : createElement(name);
}

function claimText (nodes, data) {
	for (var i = 0; i < nodes.length; i += 1) {
		var node = nodes[i];
		if (node.nodeType === 3) {
			node.data = data;
			return nodes.splice(i, 1)[0];
		}
	}

	return createText(data);
}

function blankObject() {
	return Object.create(null);
}

function destroy(detach) {
	this.destroy = noop;
	this.fire('destroy');
	this.set = this.get = noop;

	if (detach !== false) this._fragment.u();
	this._fragment.d();
	this._fragment = this._state = null;
}

function differs(a, b) {
	return a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function dispatchObservers(component, group, changed, newState, oldState) {
	for (var key in group) {
		if (!changed[key]) continue;

		var newValue = newState[key];
		var oldValue = oldState[key];

		var callbacks = group[key];
		if (!callbacks) continue;

		for (var i = 0; i < callbacks.length; i += 1) {
			var callback = callbacks[i];
			if (callback.__calling) continue;

			callback.__calling = true;
			callback.call(component, newValue, oldValue);
			callback.__calling = false;
		}
	}
}

function fire(eventName, data) {
	var handlers =
		eventName in this._handlers && this._handlers[eventName].slice();
	if (!handlers) return;

	for (var i = 0; i < handlers.length; i += 1) {
		handlers[i].call(this, data);
	}
}

function get(key) {
	return key ? this._state[key] : this._state;
}

function init(component, options) {
	component._observers = { pre: blankObject(), post: blankObject() };
	component._handlers = blankObject();
	component._bind = options._bind;

	component.options = options;
	component.root = options.root || component;
	component.store = component.root.store || options.store;
}

function observe(key, callback, options) {
	var group = options && options.defer
		? this._observers.post
		: this._observers.pre;

	(group[key] || (group[key] = [])).push(callback);

	if (!options || options.init !== false) {
		callback.__calling = true;
		callback.call(this, this._state[key]);
		callback.__calling = false;
	}

	return {
		cancel: function() {
			var index = group[key].indexOf(callback);
			if (~index) group[key].splice(index, 1);
		}
	};
}

function on(eventName, handler) {
	if (eventName === 'teardown') return this.on('destroy', handler);

	var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
	handlers.push(handler);

	return {
		cancel: function() {
			var index = handlers.indexOf(handler);
			if (~index) handlers.splice(index, 1);
		}
	};
}

function set(newState) {
	this._set(assign({}, newState));
	if (this.root._lock) return;
	this.root._lock = true;
	callAll(this.root._beforecreate);
	callAll(this.root._oncreate);
	callAll(this.root._aftercreate);
	this.root._lock = false;
}

function _set(newState) {
	var oldState = this._state,
		changed = {},
		dirty = false;

	for (var key in newState) {
		if (differs(newState[key], oldState[key])) changed[key] = dirty = true;
	}
	if (!dirty) return;

	this._state = assign({}, oldState, newState);
	this._recompute(changed, this._state);
	if (this._bind) this._bind(changed, this._state);

	if (this._fragment) {
		dispatchObservers(this, this._observers.pre, changed, this._state, oldState);
		this._fragment.p(changed, this._state);
		dispatchObservers(this, this._observers.post, changed, this._state, oldState);
	}
}

function callAll(fns) {
	while (fns && fns.length) fns.pop()();
}

function _mount(target, anchor) {
	this._fragment.m(target, anchor);
}

function _unmount() {
	if (this._fragment) this._fragment.u();
}

function removeFromStore() {
	this.store._remove(this);
}

var proto = {
	destroy: destroy,
	get: get,
	fire: fire,
	observe: observe,
	on: on,
	set: set,
	teardown: destroy,
	_recompute: noop,
	_set: _set,
	_mount: _mount,
	_unmount: _unmount
};

/* src/Figures/BasicFigure.html generated by Svelte v1.49.1 */
function data() {
  return {
    count: 0
  }
}

var methods = {
  change: function() {
    let c = this.get('count') + 1;
    this.set({count: c});
  }
};

function create_main_fragment$1(state, component) {
	var h2, text, text_1, table, text_3, button, text_4, text_5, span, text_6;

	var each_value = [0, 2, 4];

	var each_blocks = [];

	for (var i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(state, each_value, each_value[i], i, component);
	}

	function click_handler(event) {
		component.change();
	}

	return {
		c: function create() {
			h2 = createElement("h2");
			text = createText("Child Component");
			text_1 = createText("\n");
			table = createElement("table");

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			text_3 = createText("\n");
			button = createElement("button");
			text_4 = createText("+");
			text_5 = createText("\n");
			span = createElement("span");
			text_6 = createText(state.count);
			this.h();
		},

		l: function claim(nodes) {
			h2 = claimElement(nodes, "H2", {}, false);
			var h2_nodes = children(h2);

			text = claimText(h2_nodes, "Child Component");
			h2_nodes.forEach(detachNode);
			text_1 = claimText(nodes, "\n");

			table = claimElement(nodes, "TABLE", {}, false);
			var table_nodes = children(table);

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(table_nodes);
			}

			table_nodes.forEach(detachNode);
			text_3 = claimText(nodes, "\n");

			button = claimElement(nodes, "BUTTON", {}, false);
			var button_nodes = children(button);

			text_4 = claimText(button_nodes, "+");
			button_nodes.forEach(detachNode);
			text_5 = claimText(nodes, "\n");

			span = claimElement(nodes, "SPAN", {}, false);
			var span_nodes = children(span);

			text_6 = claimText(span_nodes, state.count);
			span_nodes.forEach(detachNode);
			this.h();
		},

		h: function hydrate() {
			addListener(button, "click", click_handler);
		},

		m: function mount(target, anchor) {
			insertNode(h2, target, anchor);
			appendNode(text, h2);
			insertNode(text_1, target, anchor);
			insertNode(table, target, anchor);

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(table, null);
			}

			insertNode(text_3, target, anchor);
			insertNode(button, target, anchor);
			appendNode(text_4, button);
			insertNode(text_5, target, anchor);
			insertNode(span, target, anchor);
			appendNode(text_6, span);
		},

		p: function update(changed, state) {
			if (changed.count) {
				text_6.data = state.count;
			}
		},

		u: function unmount() {
			detachNode(h2);
			detachNode(text_1);
			detachNode(table);

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].u();
			}

			detachNode(text_3);
			detachNode(button);
			detachNode(text_5);
			detachNode(span);
		},

		d: function destroy$$1() {
			destroyEach(each_blocks);

			removeListener(button, "click", click_handler);
		}
	};
}

// (3:2) {{#each [0, 2, 4] as value}}
function create_each_block(state, each_value, value, value_index, component) {
	var tr, th, text, td, text_1_value = value, text_1;

	return {
		c: function create() {
			tr = createElement("tr");
			th = createElement("th");
			text = createText("Number: ");
			td = createElement("td");
			text_1 = createText(text_1_value);
		},

		l: function claim(nodes) {
			tr = claimElement(nodes, "TR", {}, false);
			var tr_nodes = children(tr);

			th = claimElement(tr_nodes, "TH", {}, false);
			var th_nodes = children(th);

			text = claimText(th_nodes, "Number: ");
			th_nodes.forEach(detachNode);

			td = claimElement(tr_nodes, "TD", {}, false);
			var td_nodes = children(td);

			text_1 = claimText(td_nodes, text_1_value);
			td_nodes.forEach(detachNode);
			tr_nodes.forEach(detachNode);
		},

		m: function mount(target, anchor) {
			insertNode(tr, target, anchor);
			appendNode(th, tr);
			appendNode(text, th);
			appendNode(td, tr);
			appendNode(text_1, td);
		},

		u: function unmount() {
			detachNode(tr);
		},

		d: noop
	};
}

function BasicFigure(options) {
	init(this, options);
	this._state = assign(data(), options.data);

	this._fragment = create_main_fragment$1(this._state, this);

	if (options.target) {
		var nodes = children(options.target);
		options.hydrate ? this._fragment.l(nodes) : this._fragment.c();
		nodes.forEach(detachNode);
		this._fragment.m(options.target, options.anchor || null);
	}
}

assign(BasicFigure.prototype, methods, proto);

/* src/Article.html generated by Svelte v1.49.1 */
function encapsulateStyles(node) {
	setAttribute(node, "svelte-2735353737", "");
}

function create_main_fragment(state, component) {
	var d_front_matter, script, text, text_2, d_title, h1, text_3, text_4, text_5, text_6, p, text_7, text_9, d_byline, text_10, d_article, p_1, text_11, text_13, d_appendix;

	return {
		c: function create() {
			d_front_matter = createElement("d-front-matter");
			script = createElement("script");
			text = createText("{\n\t\t\"title\":\"Pushing forward neural net optimization\",\n\t\t\"description\":\"A tutorial introduction to natural gradient.\",\n\t\t\"authors\":[]\n\t}");
			text_2 = createText("\n");
			d_title = createElement("d-title");
			h1 = createElement("h1");
			text_3 = createText("Hello ");
			text_4 = createText(state.$message);
			text_5 = createText("!");
			text_6 = createText("\n\t");
			p = createElement("p");
			text_7 = createText("Introduction");
			text_9 = createText("\n");
			d_byline = createElement("d-byline");
			text_10 = createText("\n");
			d_article = createElement("d-article");
			p_1 = createElement("p");
			text_11 = createText("This is the article");
			text_13 = createText("\n");
			d_appendix = createElement("d-appendix");
			this.h();
		},

		l: function claim(nodes) {
			d_front_matter = claimElement(nodes, "D-FRONT-MATTER", {}, false);
			var d_front_matter_nodes = children(d_front_matter);

			script = claimElement(d_front_matter_nodes, "SCRIPT", { type: true }, false);
			var script_nodes = children(script);

			text = claimText(script_nodes, "{\n\t\t\"title\":\"Pushing forward neural net optimization\",\n\t\t\"description\":\"A tutorial introduction to natural gradient.\",\n\t\t\"authors\":[]\n\t}");
			script_nodes.forEach(detachNode);
			d_front_matter_nodes.forEach(detachNode);
			text_2 = claimText(nodes, "\n");

			d_title = claimElement(nodes, "D-TITLE", {}, false);
			var d_title_nodes = children(d_title);

			h1 = claimElement(d_title_nodes, "H1", {}, false);
			var h1_nodes = children(h1);

			text_3 = claimText(h1_nodes, "Hello ");
			text_4 = claimText(h1_nodes, state.$message);
			text_5 = claimText(h1_nodes, "!");
			h1_nodes.forEach(detachNode);
			text_6 = claimText(d_title_nodes, "\n\t");

			p = claimElement(d_title_nodes, "P", {}, false);
			var p_nodes = children(p);

			text_7 = claimText(p_nodes, "Introduction");
			p_nodes.forEach(detachNode);
			d_title_nodes.forEach(detachNode);
			text_9 = claimText(nodes, "\n");

			d_byline = claimElement(nodes, "D-BYLINE", {}, false);
			var d_byline_nodes = children(d_byline);

			d_byline_nodes.forEach(detachNode);
			text_10 = claimText(nodes, "\n");

			d_article = claimElement(nodes, "D-ARTICLE", {}, false);
			var d_article_nodes = children(d_article);

			p_1 = claimElement(d_article_nodes, "P", {}, false);
			var p_1_nodes = children(p_1);

			text_11 = claimText(p_1_nodes, "This is the article");
			p_1_nodes.forEach(detachNode);
			d_article_nodes.forEach(detachNode);
			text_13 = claimText(nodes, "\n");

			d_appendix = claimElement(nodes, "D-APPENDIX", {}, false);
			var d_appendix_nodes = children(d_appendix);

			d_appendix_nodes.forEach(detachNode);
			this.h();
		},

		h: function hydrate() {
			script.type = "text/json";
			encapsulateStyles(h1);
		},

		m: function mount(target, anchor) {
			insertNode(d_front_matter, target, anchor);
			appendNode(script, d_front_matter);
			appendNode(text, script);
			insertNode(text_2, target, anchor);
			insertNode(d_title, target, anchor);
			appendNode(h1, d_title);
			appendNode(text_3, h1);
			appendNode(text_4, h1);
			appendNode(text_5, h1);
			appendNode(text_6, d_title);
			appendNode(p, d_title);
			appendNode(text_7, p);
			insertNode(text_9, target, anchor);
			insertNode(d_byline, target, anchor);
			insertNode(text_10, target, anchor);
			insertNode(d_article, target, anchor);
			appendNode(p_1, d_article);
			appendNode(text_11, p_1);
			insertNode(text_13, target, anchor);
			insertNode(d_appendix, target, anchor);
		},

		p: function update(changed, state) {
			if (changed.$message) {
				text_4.data = state.$message;
			}
		},

		u: function unmount() {
			detachNode(d_front_matter);
			detachNode(text_2);
			detachNode(d_title);
			detachNode(text_9);
			detachNode(d_byline);
			detachNode(text_10);
			detachNode(d_article);
			detachNode(text_13);
			detachNode(d_appendix);
		},

		d: noop
	};
}

function Article(options) {
	init(this, options);
	this._state = assign(this.store._init(["message"]), options.data);
	this.store._add(this, ["message"]);

	this._handlers.destroy = [removeFromStore];

	this._fragment = create_main_fragment(this._state, this);

	if (options.target) {
		var nodes = children(options.target);
		options.hydrate ? this._fragment.l(nodes) : this._fragment.c();
		nodes.forEach(detachNode);
		this._fragment.m(options.target, options.anchor || null);
	}
}

assign(Article.prototype, proto);

function Store(state) {
	this._observers = { pre: blankObject(), post: blankObject() };
	this._changeHandlers = [];
	this._dependents = [];

	this._computed = blankObject();
	this._sortedComputedProperties = [];

	this._state = assign({}, state);
}

assign(Store.prototype, {
	_add: function(component, props) {
		this._dependents.push({
			component: component,
			props: props
		});
	},

	_init: function(props) {
		var state = {};
		for (var i = 0; i < props.length; i += 1) {
			var prop = props[i];
			state['$' + prop] = this._state[prop];
		}
		return state;
	},

	_remove: function(component) {
		var i = this._dependents.length;
		while (i--) {
			if (this._dependents[i].component === component) {
				this._dependents.splice(i, 1);
				return;
			}
		}
	},

	_sortComputedProperties: function() {
		var computed = this._computed;
		var sorted = this._sortedComputedProperties = [];
		var cycles;
		var visited = blankObject();

		function visit(key) {
			if (cycles[key]) {
				throw new Error('Cyclical dependency detected');
			}

			if (visited[key]) return;
			visited[key] = true;

			var c = computed[key];

			if (c) {
				cycles[key] = true;
				c.deps.forEach(visit);
				sorted.push(c);
			}
		}

		for (var key in this._computed) {
			cycles = blankObject();
			visit(key);
		}
	},

	compute: function(key, deps, fn) {
		var value;

		var c = {
			deps: deps,
			update: function(state, changed, dirty) {
				var values = deps.map(function(dep) {
					if (dep in changed) dirty = true;
					return state[dep];
				});

				if (dirty) {
					var newValue = fn.apply(null, values);
					if (differs(newValue, value)) {
						value = newValue;
						changed[key] = true;
						state[key] = value;
					}
				}
			}
		};

		c.update(this._state, {}, true);

		this._computed[key] = c;
		this._sortComputedProperties();
	},

	get: get,

	observe: observe,

	onchange: function(callback) {
		this._changeHandlers.push(callback);
		return {
			cancel: function() {
				var index = this._changeHandlers.indexOf(callback);
				if (~index) this._changeHandlers.splice(index, 1);
			}
		};
	},

	set: function(newState) {
		var oldState = this._state,
			changed = this._changed = {},
			dirty = false;

		for (var key in newState) {
			if (this._computed[key]) throw new Error("'" + key + "' is a read-only property");
			if (differs(newState[key], oldState[key])) changed[key] = dirty = true;
		}
		if (!dirty) return;

		this._state = assign({}, oldState, newState);

		for (var i = 0; i < this._sortedComputedProperties.length; i += 1) {
			this._sortedComputedProperties[i].update(this._state, changed);
		}

		for (var i = 0; i < this._changeHandlers.length; i += 1) {
			this._changeHandlers[i](this._state, changed);
		}

		dispatchObservers(this, this._observers.pre, changed, this._state, oldState);

		var dependents = this._dependents.slice(); // guard against mutations
		for (var i = 0; i < dependents.length; i += 1) {
			var dependent = dependents[i];
			var componentState = {};
			dirty = false;

			for (var j = 0; j < dependent.props.length; j += 1) {
				var prop = dependent.props[j];
				if (prop in changed) {
					componentState['$' + prop] = this._state[prop];
					dirty = true;
				}
			}

			if (dirty) dependent.component.set(componentState);
		}

		dispatchObservers(this, this._observers.post, changed, this._state, oldState);
	}
});

class ArticleStore extends Store {
  constructor() {
    super({
      message: 'store'
    });
  }
}

const store = new ArticleStore();

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

}());
//# sourceMappingURL=article.client.js.map
