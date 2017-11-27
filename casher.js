/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const DOMNodeCollection = __webpack_require__(1);

const toLoad = [];
let docIsReady = false;

document.addEventListener('DOMContentLoaded', () => {
  docIsReady = true;
  toLoad.forEach(func => func());
});

const createHTML = (tagName) => {
  const element = document.createElement(tagName);
  return new DOMNodeCollection([element]);
};

window.cshr = arg => {
  switch (typeof arg) {
    case "string":
      const pattern = /\b/;
      const contentArr = arg.split(pattern);
      if (contentArr[0] === "<") {
        return createHTML(contentArr[1]);
      }
      return new DOMNodeCollection(findElements(arg));
    case "object":
      if (arg instanceof HTMLElement) return new DOMNodeCollection([arg]);
      break;
    case "function":
      registerDocReadyCallback(arg);
  }
};

cshr.isEmpty = (arg) => {
  if (arg === undefined) {
    return undefined;
  }
  switch (arg.constructor) {
    case String:
      return (!arg);
    case Object:
      return (Object.keys(arg).length === 0);
    case Array:
      return (arg.length === 0);
  }
};

cshr.extend = (...objects) => {
  const result = {};
  objects.forEach( hash => {
    Object.keys(hash).forEach( key => result[key] = hash[key] );
  });
  return result;
};

cshr.ajax = options => {
  return new Promise(function (resolve, reject) {
    const defaultObj = {
      type: "GET",
      url: "",
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      success: () => {},
      error: () => {},
      data: {}
    };
    const xhr = new XMLHttpRequest();
    options = cshr.extend(defaultObj, options);
    if (options.type.toUpperCase() === "GET" && (!cshr.isEmpty(options.data))) {
      options.url += `?${toQueryString(options.data)}`;
    }
    xhr.open(options.type, options.url);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send(options);
  });
};

registerDocReadyCallback = func => {
  if (!docIsReady) {
    toLoad.push(func);
  } else {
    func();
  }
};

toQueryString = obj => {
  let result = "";
  for (const prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      result += `${prop}=${obj[prop]}&`;
    }
  }
  return result.substring(0, result.length - 1);
};

findElements = selector => {
  let nodeList = document.querySelectorAll(selector);
  let arr = Array.from(nodeList);
  return arr;
};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

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
      if (el.constructor.name === 'DOMNodeCollection') {
        node.appendChild(el.at(0));
      } else {
        node.appendChild(el);
      }
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

  selected() {
    const selector = this.at(0);
    const selectedOption = selector.options[selector.selectedIndex];
    return selectedOption.value;
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


/***/ })
/******/ ]);