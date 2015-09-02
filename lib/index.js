/*!
**  bauer-promise -- Wrapper for bluebird with extend feature.
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/node-bauer-sql>
*/
// - -------------------------------------------------------------------- - //

"use strict";

module.exports = function(context) {
  
  var factory = require("bauer-factory");
  var Promise = require("bluebird/js/main/promise")();

  Promise.extend = factory.createMethod({
    
    // .extend(modules Array) :void
    a: function(modules) {
      modules.forEach(function(mod) {
        Promise.extend(mod);
      });
    },
    
    // .extend(module String) :void
    s: function(mod) {
      Promise.extend(require(mod));
    },
    
    // .extend(methods Object) :void
    o: function(methods) {
      Object.keys(methods).forEach(function(name) {
        Promise.extend(name,methods[name]);
      });
    },
    
    // .extend(name String, method Object) :void
    so: function(name,method) {
      Promise.extend(name,factory.createMethod(method));
    },
    
    // .extend(name String, method Function) :void
    sf: function(name,method) {
      Promise.prototype[name] = method;
      if (!Promise[name]) {
        Promise[name] = function() {
          var promise = Promise.bind(context);
          return promise[name].apply(promise,arguments);
        };
      }
    }
    
  });

  return Promise;
};

// - -------------------------------------------------------------------- - //
