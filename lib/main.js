const DOMNodeCollection = require('./dom_node_collection.js');

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

cshr.extend = (...objects) => {
  const result = {};
  objects.forEach( hash => {
    Object.keys(hash).forEach( key => result[key] = hash[key] );
  });
  return result;
};

cshr.ajax = options => {

  const defaultObj = {
    type: "GET",
    url: "https://www.google.com",
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    success: () => {},
    error: () => {},
    data: {},
  };

  options = cshr.extend(defaultObj, options);

  if (options.method.toUpperCase() === "GET") {
    options.url += `?${toQueryString(options.data)}`;
  }

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

cshr(() => {
  console.log("dom content loaded!");
});
