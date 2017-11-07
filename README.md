## CASHER
#### AKA *cshr*

A JavaScript DOM Manipulation Library

### Features

#### DOM Manipulation


The DOMNodeCollection class methods cover basics of manipulating
both individual DOM Elements and DOM Element Collections.

Passing a selector to Casher will create a new DOM Node Collection from
matching nodes.

##### Basic Examples

```JavaScript

cshr('.my-class') // Returns a collection of all Elements with a
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

cshr(HTMLElement) // creates DOM Node collection from element

cshr(function()) // queues function to execute when DOM content
                 // is loaded

```

##### CASHER methods

```JavaScript

cshr.ajax(options) // makes an ajax request with given options
                   // returns chainable promise

cshr.isEmpty(arg) // boolean indicating whether arg is empty
                  // cshr.isEmpty({}) === true

cshr.extend(...objects) // merges objects

```
