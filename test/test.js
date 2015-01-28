/*global window,assert,suite,setup,teardown,sinon,test*/

suite('GaiaHeader', function() {
  'use strict';

  var DomTree = window['gaia-dom-tree'];

  setup(function() {
    this.sinon = sinon.sandbox.create();

    // DOM container to put test cases
    this.dom = document.createElement('div');

    this.dom.innerHTML = `
      <header><header>
      <div class="main">
        <p>lorem ipsum dolor</p>
      </div>
      <footer></footer>
    `;

    document.body.appendChild(this.dom);
  });

  teardown(function() {
    this.sinon.restore();
    this.dom.remove();
  });

  test('It', function() {
    var tree = new DomTree();
    tree.setRoot(this.dom);
    tree.render();
  });
});
