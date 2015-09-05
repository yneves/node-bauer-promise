# node-bauer-promise

Wrapper for bluebird with extend feature.

## Installation

```
npm install bauer-promise
```

## Usage

Use `bauer-promise` to create an extensible Promise constructor that is bound to a context object.

```js

var myObject = {
  name: "Yuri",
  age: 30
};

var Promise = require("bauer-promise")(myObject);

Promise.extend({
  
  setAge: function() {
    return this.then(function(newAge) {
      this.age = newAge; // this === myObject
    });
  }
  
});

Promise.resolve(40).setAge();

```

## API Summary

  * `Promise`
    * `.extend(modules Array) :void`
    * `.extend(module String) :void`
    * `.extend(methods Object) :void`
    * `.extend(name String, method Object) :void`
    * `.extend(name String, method Function) :void`
    

## License

[MIT](./LICENSE)
