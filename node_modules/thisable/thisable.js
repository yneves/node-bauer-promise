/*!
**  Thisable -- General utilities for nodejs.
**  Copyright (c) 2014 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/thisable>
*/
// - -------------------------------------------------------------------- - //

var Thisable = require("./thenable.js");

Thisable.prototype.bind = function(_this) {
	this._this = _this;
	return this;
};

var then = Thisable.prototype.then;

Thisable.prototype.then = function() {
	if (this._this) {
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "function") {
				arguments[i] = arguments[i].bind(this._this);
			}
		}
		var ret = then.apply(this,arguments);
		if (ret instanceof Thisable) {
			ret._this = this._this;
		}
		return ret;
	} else {
		return then.apply(this,arguments);
	}
};

module.exports = exports = Thisable;

// - -------------------------------------------------------------------- - //