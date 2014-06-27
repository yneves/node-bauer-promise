node-bauer-promise
==================

This is just another promise library. It relies on [Thisable](https://github.com/yneves/thisable) and unlike the compliant implementations, it features the possibility of binding context to callbacks.

## Installation

```
npm install bauer-promise
```

## Usage

```js
var P = require("bauer-promise");

P.defer(); // returns a deferred object
P.defer(object); // binds object to the created promise

P.when(value); // returns a promise resolved with value
P.when(a,b,c,d); // returns a promise resolved with an array [a,b,c,d]
P.when(promise,promise,promise) // wait until all promises are resolved
```

## Deferred

### Constructor

Creates a common deferred object.

```js
var deferred = P.defer()
// same as
var deferred = new P.cls.Deferred()
```

Creates a deferred object with the passed object bound to the promise.

```js
var deferred = P.defer(object)
// same as
var deferred = new P.cls.Deferred(object)
```

### .bind

Binds the passed object to the deferreds promise.

```js
deferred.bind(object);
// same as
deferred.promise.bind(object);
```

### .resolve

Fulfills the promise with the passed value.

```js
deferred.resolve(value);
```

### .reject

Rejects the promise with the given reason.

```js
deferred.reject(reason);
```

### .promise

Holds the promise itself. This is what should be returned when writing an async procedure.

```js
var deferred = P.defer();
fs.readFile("path/to/file",function(error,content) {
	if (error) {
		deferred.reject(error);
	} else {
		deferred.resolve(content);
	}
});
return deferred.promise;
```

## Promise

### Constructor

```js
var promise = new P.cls.Promise()
```

### .bind

Binds the passed object to the promise.

```js
promise.bind(object);
```

### .then

Attach a callback to be executed when the promise is fulfilled. The second callback is called if the promise is rejected or throws an error. If `.bind` was called before then `this` refers to the bound object inside both callbacks. It returns another promise to allow chaining.

```js
promise.then(function(value) {
	// promise is fulfilled with value
},function(reason) {
	// promise is rejected with reason
});
```

### .fail

Attach a callback to be executed when the promise is rejected or throws an error. If `.bind` was called before then `this` refers to the bound object inside the callback. It returns another promise to allow chaining.

```js
promise.fail(function(reason) {});
// same as
promise.then(null,function(reason) {});
```

### .done

Same thing as `.then` excepts that it returns nothing. Once done is called any unhandled exception is thrown in a future loop.

```js
promise.done(function(value) {
	// promise is fulfilled with value
},function(reason) {
	// promise is rejected with reason
});
```

### .fulfill

Fulfill the promise with the passed value.

```js
promise.fulfill(value);
// same as
deferred.resolve(value);
```

### .reject

Rejects the promise with the given reason.

```js
promise.fulfill(value);
// same as
deferred.resolve(value);
```

## License

MIT