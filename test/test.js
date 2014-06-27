/*!
**  bauer-promise -- Just another promise library.
**  Copyright (c) 2014 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/node-bauer-sql>
*/
// - -------------------------------------------------------------------- - //
// - libs

var P = require("../");
var assert = require("assert");

// - -------------------------------------------------------------------- - //
// - tests


describe("promise",function() {

	it("exports",function() {
		assert.deepEqual(P.defer(),new P.cls.Deferred());
		assert.deepEqual(P.defer({}),new P.cls.Deferred({}));
		assert.ok(P.when() instanceof P.cls.Promise);
		assert.ok(P.when().state == 1);
		assert.ok(new P.cls.Promise().state == 0);
	});

	it("nested",function(done) {
		var a = P.defer();
		var b = P.defer();
		var c = P.defer();
		var d = P.defer();
		a.promise.then(function(aval) {
			return b.promise.then(function(bval) {
				return aval + bval;
			});
		}).then(function(abval) {
			return c.promise.then(function(cval) {
				return abval + cval;
			});
		}).then(function(abcval) {
			return d.promise.then(function(dval) {
				return abcval + dval;
			});
		}).then(function(abcdval) {
			assert.equal(abcdval,10);
			done();
		}).fail(function(error) {
			done(error);
		}).done();
		setTimeout(function() {	a.resolve(1) },1);
		setTimeout(function() {	b.resolve(2) },2);
		setTimeout(function() {	c.resolve(3) },3);
		setTimeout(function() {	d.resolve(4) },4);
	});

	it("chain-ok",function(done) {
		var deferred = P.defer();
		var promise = deferred.promise;
		promise.then(function(value) {
			assert.ok(value == 1);
			return ++value;
		}).then(function(value) {
			assert.ok(value == 2);
			return ++value;
		}).then(function(value) {
			assert.ok(value == 3);
			return ++value;
		}).then(function(value) {
			assert.ok(value == 4);
			return ++value;
		}).fail(function(error) {
			done(error);
		}).done(function(value) {
			assert.ok(value == 5);
			done();
		});
		deferred.resolve(1);
	});

	it("chain-fail",function(done) {
		var deferred = P.defer();
		var promise = deferred.promise;
		promise.then(function(value) {
			return ++value;
		}).then(function(value) {
			return ++value;
		}).then(function(value) {
			return ++value;
		}).then(function(value) {
			assert.ok(value == 4);
			shit.happens();
			return ++value;
		}).fail(function(error) {
			assert.ok(error instanceof Error);
			done();
		}).done(function(value) {
			assert.ok(false);
			done();
		});
		deferred.resolve(1);
	});

	it("when-ok",function(done) {
		var a = P.defer();
		var b = P.defer();
		var c = P.defer();
		var d = P.defer();
		P.when(a.promise,2,b.promise,4,c.promise,6,d.promise,8).then(function(values) {
			assert.deepEqual(values,[1,2,3,4,5,6,7,8]);
			done();
		}).fail(function(error) {
			done(error);
		});
		setTimeout(function() { a.resolve(1) },10);
		setTimeout(function() { b.resolve(3) },0);
		setTimeout(function() { c.resolve(5) },5);
		setTimeout(function() { d.resolve(7) },20);
	});

	it("when-fail",function(done) {
		var a = P.defer();
		var b = P.defer();
		var c = P.defer();
		var d = P.defer();
		P.when(a.promise,b.promise,c.promise,d.promise)
			.then(function(values) {
				assert.ok(false);
				done();
			})
			.fail(function(error) {
				assert.ok(/fail 1/.test(error));
				done();
			})
			.done();
		setTimeout(function() { a.reject("fail 2") },10);
		setTimeout(function() { b.resolve(2) },0);
		setTimeout(function() { c.reject("fail 1") },5);
		setTimeout(function() { d.resolve(4) },20);
	});

	it("then-resolve",function(done) {
		var a = P.defer();
		var b = P.defer();
		a.promise.then(b);
		b.promise.then(function(value) {
			assert.ok(value == 3);
		}).done(done,done);
		setTimeout(function() { a.resolve(3) },0);
	});

	it("fail-reject",function(done) {
		var a = P.defer();
		var b = P.defer();
		a.promise.fail(b);
		b.promise.fail(function(error) {
			assert.ok(/reason/.test(error));
			done();
		}).done(function() {
			done(new Error("should have failed"));
		});
		setTimeout(function() { a.reject("reason") },0);
	});

});

// - -------------------------------------------------------------------- - //