## CASHER
#### AKA *cshr*

A JavaScript DOM Manipulation Library

### [Demo](https://collinclarke.github.io/casher/)

*Sequential queries of Harvard Art Museum Object Collection*

### Features

#### DOM Manipulation


The DOM Node Collection class methods cover basics of manipulating
both individual DOM Nodes and DOM Node Collections.

Passing a selector to Casher will create a new DOM Node Collection from
matching nodes.

##### Basic Examples

```JavaScript

cshr('.my-class') // Returns a collection of all nodes with a
                  // class of 'my-class'

const element = cshr('#my-id') // element is node with id "my-id"

element.parent() // Returns parent of
                 // element as DOMNodeCollection.

const children = element.children() // children of element
                                    // as DOMNodeCollection.

children.at(5) // returns node from children at index 5

const badChildren = children.find('.bad') // Returns a collection of children
                                          // who have a class 'bad'

badChildren.remove() // Removes all nodes in collection from the DOM.



```


##### Event listeners

```JavaScript

cshr('selector').on(eventType, callback) // Adds event listener to each
                         // element in collection, stored as a property

cshr('selector').off(eventType) // removes matching event listener from
                                // each element in collection.

```

##### HTML

```JavaScript

const collection = cshr('selector')

collection.empty() // clears inner HTML of each node in collection

collection.append('dog') // adds "dog" to each node's inner HTML

collection.attr("key", 5) // adds attribute key with value 5 to each
                          // element in collection
```

##### CASHER arguments

```JavaScript

cshr('selector') // creates collection of elements
                 // with matching selector

cshr('<tag>') // creates new HTMLElement with tag name

cshr(HTMLElement) // creates DOM Node collection from element

cshr(function()) // queues function to execute when DOM content
                 // is loaded

```

###### *snippet*


```JavaScript

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

const createHTML = (tagName) => {
  const element = document.createElement(tagName);
  return new DOMNodeCollection([element]);
};
```

##### CASHER methods

```JavaScript

cshr.ajax(options) // makes an ajax request with given options
                   // returns chainable promise

cshr.isEmpty(arg) // boolean indicating whether arg is empty
                  // cshr.isEmpty({}) === true

cshr.extend(...objects) // merges objects

```


##### *ajax snippet*

```JavaScript

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

```
