class DOMNodeCollection {
  
  constructor(arr) {
    this.nodeCollection = arr;
  }

  at(num) {
    return this.nodeCollection[num];
  }

  html(str){
    if(str !== undefined){
      this.nodeCollection.forEach( (node) => {
        node.innerHTML = str;
      });
    } else {
      return this.nodeCollection[0].innerHTML;
    }
  }

  empty(){
    this.nodeCollection.forEach( node => {
      node.innerHTML = '';
    });
  }

  append(el){
    this.nodeCollection.forEach( node => {
      node.innerHTML += el;
    });
  }

  attr(key, value) {
    if (value === undefined) {
      return this.nodeCollection[0].getAttribute(key);
    } else {
      this.nodeCollection.forEach( node => {
        node.setAttribute(key, value);
      });
    }
  }

  addClass(className) {
    this.nodeCollection.forEach( node => {
      node.classList.add(className);
    });
  }

  removeClass(className) {
    this.nodeCollection.forEach( node => {
      node.classList.remove(className);
    });
  }

  children() {
    let children = [];
    this.nodeCollection.forEach( (node) => {
      const child = Array.from(node.children);
      children = children.concat(child);
    });
    return new DOMNodeCollection(children);
  }

  parent() {
    let parents = [];
    this.nodeCollection.forEach( (node) => {
      const parent = node.parentNode;
      if (!parents.includes(parent)) {
        parents = parents.concat(parent);
      }
    });
    return new DOMNodeCollection(parents);
  }

  find(selector) {
    let elements = [];
    this.nodeCollection.forEach((node) => {
      let matches = node.querySelectorAll(selector);
      elements = elements.concat(Array.from(matches));
    });
    return new DOMNodeCollection(elements);
  }

  remove() {
    this.nodeCollection.forEach( (node) => {
      node.remove();
    });
    this.nodeCollection = [];
  }

  on(eventType, callback) {
    this.nodeCollection.forEach( (node) => {
      node.addEventListener(eventType, callback);
      node.cb = callback;
    });
  }

  off(type) {
    this.nodeCollection.forEach( (node) => {
      node.removeEventListener(type, node.cb);
    });
  }

}

module.exports = DOMNodeCollection;
