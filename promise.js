/*!
**  bauer-promise -- Just another promise library.
**  Copyright (c) 2014 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/node-bauer-sql>
*/
// - -------------------------------------------------------------------- - //
// - libs

var lib = {
	factory: require("bauer-factory"),
	thisable: require("thisable"),
};

// - -------------------------------------------------------------------- - //

function throwLater(error) {
	setImmediate(function() {
		throw error;
	});
}

function wrapResolved(resolved,deferred) {
	var type = lib.factory.type(resolved);
	if (type == "function") {
		if (deferred) {
			return function(value) {
				try { deferred.resolve(resolved.call(this,value)) }
				catch(error) { deferred.reject(error) }
			};
		} else {
			return function(value) {
				try { resolved.call(this,value) }
				catch(error) { throwLater(error) }
			}
		}
	} else if (resolved instanceof Deferred) {
		if (deferred) {
			return function(value) {
				resolved.resolve(value);
				deferred.resolve(value);
			};
		} else {
			return function(value) {
				resolved.resolve(value);
			}
		}
	} else {
		if (deferred) {
			return function(value) {
				deferred.resolve(value);
			};
		}
	}
}

function wrapRejected(rejected,deferred) {
	var type = lib.factory.type(rejected);
	if (type == "function") {
		return function(reason) {
			try { rejected.call(this,reason) }
			catch(error) { throwLater(error) }
		}
	} else if (rejected instanceof Deferred) {
		return function(reason) {
			rejected.reject(reason);
		};

	} else {
		if (deferred) {
			return function(reason) {
				deferred.reject(reason);
			};
		}
	}
}

// - -------------------------------------------------------------------- - //

// @Deferred
var Deferred = lib.factory.class({

	// @constructor
	constructor: function(context) {
		this.promise = new Promise();
		if (context) {
			this.bind(context);
		}
	},

	// .bind(context)
	bind: function(context) {
		this.promise.bind(context);
	},

	// .resolve(value)
	resolve: function(value) {
		var deferred = this;
		if (value instanceof Promise) {
			value.done(function(val) {
				deferred.resolve(val);
			},function(reason) {
				deferred.reject(reason);
			});
		} else {
			this.promise.fulfill(value);
		}
	},

	// .reject(reason)
	reject: function(reason) {
		if (!lib.factory.isError(reason)) {
			reason = new Error(reason);
		}
		this.promise.reject(reason);
	},

});

// - -------------------------------------------------------------------- - //

// @Promise
var Promise = lib.factory.class({

	// @inherits
	inherits: lib.thisable,

	// .then(resolved,rejected)
	then: function(resolved,rejected) {
		var deferred = new Deferred();
		if (this._this) deferred.bind(this._this);
		resolved = wrapResolved(resolved,deferred);
		rejected = wrapRejected(rejected,deferred);
		lib.thisable.prototype.then.call(this,resolved,rejected);
		return deferred.promise;
	},

	// .fail(rejected)
	fail: function(rejected) {
		return this.then(null,rejected);
	},

	// .done(resolved,rejected)
	done: function(resolved,rejected) {
		resolved = wrapResolved(resolved);
		rejected = wrapRejected(rejected);
		lib.thisable.prototype.then.call(this,resolved,rejected);
		return;
	},

});

// - -------------------------------------------------------------------- - //

// .when(promises)
var when = function() {
	var deferred = new Deferred();
	var promises;
	if (arguments.length == 1) {
		var type = lib.factory.type(arguments[0]);
		if (type == "array") {
			promises = arguments[0];
		} else if (type == "arguments") {
			promises = lib.factory.toArray(arguments[0]);
		}
	} else if (arguments.length > 1) {
		promises = lib.factory.toArray(arguments);
	}
	if (promises) {
		var values = [];
		var pending = promises.length;
		if (pending > 0) {
			var rejected = false;
			promises.forEach(function(promise,i) {
				if (promise instanceof Promise) {
					promise.done(function(value) {
						if (!rejected) {
							pending--;
							values[i] = value;
							if (pending == 0) {
								deferred.resolve(values);
							}
						}
					},function(error) {
						rejected = true;
						deferred.reject(error);
					});
				} else {
					if (!rejected) {
						pending--;
						values[i] = promise;
						if (pending == 0) {
							deferred.resolve(values);
						}
					}
				}
			});
		} else {
			deferred.resolve(values);
		}
	} else {
		deferred.resolve(arguments[0]);
	}
	return deferred.promise;
};

// - -------------------------------------------------------------------- - //
// - exports

exports = {};

exports.when = when;
exports.defer = function(context) { return new Deferred(context) };

exports.cls = {};
exports.cls.Promise = Promise;
exports.cls.Deferred = Deferred;

module.exports = exports;


// - -------------------------------------------------------------------- - //
