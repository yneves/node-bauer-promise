Thisable
========

This is just [Thenable](https://github.com/rse/thenable) with the possibility of binding context to callbacks. Yes, it breaks the `Promises/A+ 1.1.1 Thenable` specification, although it passes all [promises-aplus-tests](https://github.com/promises-aplus/promises-tests).

## Installation

```
npm install thisable
```

## Usage

The only difference between `Thenable` and `Thisable` is the `.bind` method which sets the `this` variable to be used within callbacks. If `.bind` is not called, it will behave just like the specification.

```js
var Thisable = require("thisable");

var promise = new Thisable();

var object = { prop: "value" };

promise.bind(object);

promise.then(function(value) {
	// this strictEqual object
});
```

When chaining multiple promises, the context of the top promise is passed along to all the chained ones. Even if it is defined in some of the returned promises.

```js
var Thisable = require("thisable");

var a = new Thisable();
var b = new Thisable();
var c = new Thisable();
var d = new Thisable();

var object = {a:1,b:2,c:3};
var otherObject = {d:4,e:5,f:6};

a.bind(object);

a.then(function(aval) {
	return b.bind(otherObject).then(function(bval) {
		// this strictEqual otherObject
		return aval + bval;
	});
}).then(function(abval) {
	return c.then(function(cval) {
		return abval + cval;
	});
}).then(function(abcval) {
	return d.then(function(dval) {
		return abcval + dval;
	});
}).then(function(abcdval) {
	// abcdval equal 10
	// this strictEqual object
});

setTimeout(function() { a.fulfill(1) },100);
setTimeout(function() { b.fulfill(2) },200);
setTimeout(function() { c.fulfill(3) },300);
setTimeout(function() { d.fulfill(4) },400);
```

## License

MIT