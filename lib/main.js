const DOMNodeCollection = require('./dom_node_collection.js');

const toLoad = [];

window.$l = function(arg){
  if (typeof arg === "string") {
    return new DOMNodeCollection(findElements(arg));
  } else if (arg instanceof HTMLElement) {
    return new DOMNodeCollection([arg]);
  } else if (typeof arg === "function") {
    toLoad.push(arg);
  }
};

window.$l.extend = function(...objects){
  const result = {};
  objects.forEach( hash => {
    Object.keys(hash).forEach( key => result[key] = hash[key] );
  });
  return result;
};

window.$l.ajax = function(options) {
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
  options = $l.extend(defaultObj, options);
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

window.onload = () => {
  toLoad.forEach((func) => {
    func();
  });
};

function findElements(selector) {
  let nodeList = document.querySelectorAll(selector);
  let arr = Array.from(nodeList);
  return arr;
}

$l(() => {
  console.log("window loaded!");
});
