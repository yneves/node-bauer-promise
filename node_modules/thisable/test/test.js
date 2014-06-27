// - -------------------------------------------------------------------- - //
// - libs

var Thisable = require("../");

var assert = require("assert");

// - -------------------------------------------------------------------- - //
// - Thisable

describe("Thisable",function() {

	require("promises-aplus-tests").mocha({
		deferred: function () {
			var promise = new Thisable();
			return {
				promise: promise,
				resolve: function (value) {
					return promise.fulfill(value);
				},
				reject: function (reason) {
					return promise.reject(reason);
				}
			};
		}
	});

	it("context-then",function(done) {
		var obj = {a:1,b:2,c:3};
		var promise = new Thisable();
		promise.bind(obj);
		promise.then(function(value) {
			assert.strictEqual(value,true);
			assert.strictEqual(this,obj);
			assert.deepEqual(this,{a:1,b:2,c:3});
			done();
		},function(error) {
			done(error);
		});
		setTimeout(function() {
			promise.fulfill(true);
		},1);
	});

	it("context-fail",function(done) {
		var obj = {a:1,b:2,c:3};
		var promise = new Thisable();
		promise.bind(obj);
		promise.then(function(value) {
			done(new Error("should have failed"));
		},function(error) {
			assert.strictEqual(this,obj);
			assert.deepEqual(this,{a:1,b:2,c:3});
			done();
		});
		setTimeout(function() {
			promise.reject(true);
		},1);
	});

	it("context-nested",function(done) {
		var obj = {a:1,b:2,c:3};
		var other = {d:4,e:5,f:6};
		var a = new Thisable();
		var b = new Thisable();
		var c = new Thisable();
		var d = new Thisable();
		a.bind(obj);
		a.then(function(aval) {
			return b.bind(other).then(function(bval) {
				assert.strictEqual(this,other);
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
			assert.equal(abcdval,10);
			assert.strictEqual(this,obj);
			done();
		});
		setTimeout(function() {	a.fulfill(1) },100);
		setTimeout(function() {	b.fulfill(2) },200);
		setTimeout(function() {	c.fulfill(3) },300);
		setTimeout(function() {	d.fulfill(4) },400);
	});

	it("context-nested-wrong",function(done) {
		var obj = {a:1,b:2,c:3};
		var a = new Thisable();
		var b = new Thisable();
		var c = new Thisable();
		var d = new Thisable();
		b.bind(obj);
		a.then(function(aval) {
			return b.then(function(bval) {
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
			assert.equal(abcdval,10);
			assert.strictEqual(this,global);
			done();
		});
		setTimeout(function() {	a.fulfill(1) },100);
		setTimeout(function() {	b.fulfill(2) },200);
		setTimeout(function() {	c.fulfill(3) },300);
		setTimeout(function() {	d.fulfill(4) },400);
	});

});

// - -------------------------------------------------------------------- - //