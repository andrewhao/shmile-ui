/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	eval("'use strict';\n\nvar FakeServer = function FakeServer() {};\n\nFakeServer.prototype.initialize = function (channel) {\n\tconsole.log(\"Fake server sending 'connected' event.\");\n\tsetTimeout(function () {\n\t\treturn channel.emit('connect');\n\t}, 1000);\n\n\tchannel.on('snap', function () {\n\t\tsetTimeout(function () {\n\t\t\tsetTimeout(function () {}, 1000);\n\t\t}, 1000);\n\t});\n};\n\nmodule.exports = FakeServer;\nwindow.FakeServer = FakeServer;//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy91aS9mYWtlU2VydmVyLmpzP2ViZGYiXSwic291cmNlc0NvbnRlbnQiOlsibGV0IEZha2VTZXJ2ZXIgPSBmdW5jdGlvbigpIHt9XG5cbkZha2VTZXJ2ZXIucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbihjaGFubmVsKSB7XG5cdGNvbnNvbGUubG9nKFwiRmFrZSBzZXJ2ZXIgc2VuZGluZyAnY29ubmVjdGVkJyBldmVudC5cIik7XG5cdHNldFRpbWVvdXQoKCkgPT4gY2hhbm5lbC5lbWl0KCdjb25uZWN0JyksIDEwMDApO1xuXG5cdGNoYW5uZWwub24oJ3NuYXAnLCBmdW5jdGlvbigpIHtcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0fSwgMTAwMClcblx0XHR9LCAxMDAwKTtcblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRmFrZVNlcnZlclxud2luZG93LkZha2VTZXJ2ZXIgPSBGYWtlU2VydmVyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB1aS9mYWtlU2VydmVyLmpzXG4gKiovIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==");

/***/ }
/******/ ]);