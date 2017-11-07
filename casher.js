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

window.cshr = arg => {
  switch (typeof arg) {
    case "string":
      return new DOMNodeCollection(findElements(arg));
    case "object":
      if (arg instanceof HTMLElement) return new DOMNodeCollection([arg]);
      break;
    case "function":
      registerDocReadyCallback(arg);
  }
};

cshr.isEmpty = (arg) => {
  switch (arg.constructor) {
    case String:
      return (!!arg);
    case Object:
      return (Object.keys(arg).length === 0);
    case Array:
      return (arg.length === 0);
  }
};

registerDocReadyCallback = func => {
  if (!docIsReady) {
    toLoad.push(func);
  } else {
    func();
  }
};

cshr.extend = function(...objects){
  const result = {};
  objects.forEach( hash => {
    Object.keys(hash).forEach( key => result[key] = hash[key] );
  });
  return result;
};

cshr.ajax = function(options) {
  const defaultObj = {
    type: "GET",
    url: "https://www.google.com",
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    success(response){
      console.log(response);
    },
    error(err){
      console.log(err);
    },
  };

  options = cshr.extend(defaultObj, options);

  const xhr = new XMLHttpRequest();

  xhr.open(options.type, options.url);

  xhr.onload = function () {
    if (xhr.status < 300) {
      options.success(xhr.response);
      console.log("success!");
    } else {
      options.error(xhr.response);
      console.log("failure!");
    }
  };

  xhr.send(options);

};

document.addEventListener('DOMContentLoaded', () => {
  docIsReady = true;
  toLoad.forEach(func => func());
});

findElements = selector => {
  let nodeList = document.querySelectorAll(selector);
  let arr = Array.from(nodeList);
  return arr;
};

cshr(() => {
  console.log("dom content loaded!");
});


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