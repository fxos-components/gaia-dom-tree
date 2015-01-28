;(function(define){'use strict';define(function(require,exports,module){

/**
 * Dependencies
 */

var component = require('gaia-component');

/**
 * Simple logger (toggle 0)
 *
 * @type {Function}
 */
var debug = 1 ? console.log.bind(console) : function() {};

/**
 * Register the element.
 *
 * @return {Element} constructor
 */
module.exports = component.register('gaia-dom-tree', {

  /**
   * Called when the element is first created.
   *
   * Here we create the shadow-root and
   * inject our template into it.
   *
   * @private
   */
  created: function() {
    debug('created');
    this.setupShadowRoot();
    this.els = {
      inner: this.shadowRoot.querySelector('.inner')
    };

    this.selectedNode = null;

    this.els.inner.addEventListener('click', e => this.onInnerClick(e));
  },

  setRoot: function(el) {
    debug('set root', el);
    this.root = el;
  },

  render: function() {
    var html = toHtml(this.root);
    this.els.inner.innerHTML = html;
    debug('rendered', html);
  },

  onInnerClick: function(e) {
    debug('inner click', e);
    var nodeString = e.target.closest('.node-string');
    if (nodeString) this.onNodeStringClick(nodeString);
  },

  onNodeStringClick: function(el) {
    var node = el.closest('.node');
    node.classList.toggle('expanded');
    this.selectNode(node);
  },

  selectNode: function(el) {
    var previous = this.selectedNode;
    if (previous) previous.classList.remove('selected');
    el.classList.add('selected');
    this.selectedNode = el;
    this.despatch('selected');
  },

  despatch: function(name) {
    this.dispatchEvent(new Event('selected'));
  },

  template: `
    <style>
      .inner {
        padding: 0.6em 0.3em;

        color: #eee;
        background: #333;
        font-family: Consolas,Monaco,"Andale Mono",monospace;
        -moz-user-select: none;
        cursor: default;
      }

      .node.collapsed .children {
        display: none;
      }

      .node-string {
        padding: 0em 0.2em;
      }

      .node-string:before {
        content: '▶';
        display: inline-block;
        vertical-align: middle;
        padding-right: 0.5em;
        font-size: 0.7em;
        color: #777
      }

      .expanded > .node-string:before {
        transform: rotate(90deg);
      }

      .selected > .node-string {
        background: rgba(255,255,255,0.05);
      }

      .node-string .attrs {
      }

      .node-string .attr-value {
        color: var(--highlight-color);
      }

      .node-string:active {
        background: rgba(255,255,255,0.05);
      }

      .node > .children {
        display: none;
        padding-left: 0.8em;
      }

      .node.expanded > .children {
        display: block;
      }

    </style>
    <div class="inner"></div>
  `
});

function toHtml(node) {
  var stringified = stringify(node);
  var children = [].map.call(node.children, toHtml).join('');
  var result = `<div class="node">
    <div class="node-string">${stringified}</div>
    <div class="children">
      ${children}
    </div>
  </div>`;

  return result;
}

function stringify(node) {
  var tagName = node.tagName.toLowerCase();
  var attrs = stringifyAttrs(node.attributes);
  return `&lt;${tagName}<span class="attrs">${attrs}</span>&gt;`;
}

function stringifyAttrs(attrs) {
  return [].map.call(attrs, attr => {
    return ` ${attr.name}=&quot;<span class="attr-value">${attr.value}</span>&quot;`;
  }).join('');
}

function escape(html) {
  return html
   .replace(/&/g, "&amp;")
   .replace(/</g, "&lt;")
   .replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;")
   .replace(/'/g, "&#039;");
 }

});})(typeof define=='function'&&define.amd?define
:(function(n,w){'use strict';return typeof module=='object'?function(c){
c(require,exports,module);}:function(c){var m={exports:{}};c(function(n){
return w[n];},m.exports,m);w[n]=m.exports;};})('gaia-dom-tree',this));
