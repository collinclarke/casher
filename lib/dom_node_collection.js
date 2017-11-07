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
      this.nodeCollection.forEach( (node) => {
        node.setAttribute(key, value);
      });
    }
  }

  addClass(className) {
    this.nodeCollection.forEach( (node) => {
      let list = node.classList;
      list.add(className);
    });
  }

  removeClass(className) {
    this.nodeCollection.forEach( (node) => {
      let list = node.classList;
      list.remove(className);
    });
  }

  children() {
    let result = [];
    this.nodeCollection.forEach( (node) => {
      const child = Array.from(node.children);
      result = result.concat(child);
    });
    return new DOMNodeCollection(result);
  }

  parent() {
    let result = [];
    this.nodeCollection.forEach( (node) => {
      const parent = node.parentNode;
      if (!result.includes(parent)) {
        result = result.concat(parent);
      }
    });
    return new DOMNodeCollection(result);
  }

  find(selector) {
    // const children = this.children();
    let arr = [];
    this.nodeCollection.forEach((node) => {
      let matches = node.querySelectorAll(selector);
      arr = arr.concat(Array.from(matches));
    });
    return new DOMNodeCollection(arr);
  }

  remove() {
    this.nodeCollection.forEach( (node) => {
      node.remove();
    });
    this.nodeCollection = [];
  }

  on (eventType, callback) {
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
