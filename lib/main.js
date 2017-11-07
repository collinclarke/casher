const DOMNodeCollection = require('./dom_node_collection.js');

const toLoad = [];
let docIsReady = false;

document.addEventListener('DOMContentLoaded', () => {
  docIsReady = true;
  toLoad.forEach(func => func());
});

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

cshr.extend = function(...objects){
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
      url: "https://www.google.com",
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
    debugger
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      result += `${prop}=${obj[prop]}&`;
    }
  }
  return result.substring(0, result.length - 1);
};

cshr(() => {
  console.log("dom content loaded!");
});
