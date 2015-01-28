/*global window,assert,suite,setup,teardown,sinon,test*/

suite('GaiaHeader', function() {
  'use strict';

  var DomTree = window['gaia-dom-tree'];

  setup(function() {
    this.sinon = sinon.sandbox.create();

    // DOM container to put test cases
    this.dom = document.createElement('div');

    this.dom.innerHTML = `<header>my header</header>
      <div class="main">
        <p>lorem ipsum dolor</p>
      </div>
      <footer></footer>
    `;

    this.tree = new DomTree();
    this.tree.setRoot(this.dom);
    this.tree.render();

    document.body.appendChild(this.dom);
  });

  teardown(function() {
    this.sinon.restore();
    this.dom.remove();
  });

  test('It renders a title for each node', function() {
    var titles = this.tree.shadowRoot.querySelectorAll('li.element > h3');

    assert.equal(titles[0].textContent, '<div>');
    assert.equal(titles[1].textContent, '<header>');
    assert.equal(titles[2].textContent, '<div class="main">');
    assert.equal(titles[3].textContent, '<p>');
    assert.equal(titles[4].textContent, '<footer>');
  });

  test('Each node has a list of child nodes', function() {

  });

  test('Clicking on a title adds a `.selected` class', function() {
    var nodes = this.tree.shadowRoot.querySelectorAll('li');

    nodes[0].querySelector('h3').click();
    assert.isTrue(nodes[0].classList.contains('selected'));

    nodes[1].querySelector('h3').click();
    assert.isTrue(nodes[1].classList.contains('selected'));
    assert.isFalse(nodes[0].classList.contains('selected'));
  });

  suite('GaiaDomTree#select()', function() {
    test('It selects a tree node when passed the corresponding dom node', function() {
      var node = this.dom.querySelector('header');
      var treeNodes = this.tree.shadowRoot.querySelectorAll('li');

      this.tree.select(node);
      assert.isTrue(treeNodes[1].classList.contains('selected'));
    });

    test('It expands the node and parent-nodes', function() {
      var node = this.dom.querySelector('header');
      var treeNodes = this.tree.shadowRoot.querySelectorAll('li');
      var treeNode = treeNodes[1];

      this.tree.select(node);
      assert.isTrue(treeNode.classList.contains('expanded'));
      assert.isTrue(treeNode.parentNode.closest('li').classList.contains('expanded'));
    });
  });

  suite('text-nodes', function() {
    test('It renders text nodes', function() {
      var textNode = this.tree.shadowRoot.querySelector('li.text');
      assert.equal(textNode.textContent, 'my header');
    });

    test('It ignores empty text-nodes', function() {
      var root = document.createElement('div');
      root.innerHTML = `\n\n\n
        <div>  </div>
        <p>content</div>
        <p>more content</div>
        <div> \n</div>`;

      var tree = new DomTree();
      tree.setRoot(root);
      tree.render();

      var textNodes = tree.shadowRoot.querySelectorAll('li.text');
      assert.equal(textNodes.length, 2);
    });
  });
});
