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

Rejects the promise with the passed value.

```js
deferred.reject(value);
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

