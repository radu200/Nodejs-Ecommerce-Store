/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/home/radu/Desktop/Nodejs-Ecommerce-Store/node_modules/jquery/dist/jquery.js'");

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bootstrap__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bootstrap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_bootstrap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scss_main_scss__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scss_main_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__scss_main_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__main_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__main_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__main_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__navbar_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__navbar_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__navbar_js__);

// import $ from "jquery";




/***/ }),
/* 2 */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/home/radu/Desktop/Nodejs-Ecommerce-Store/node_modules/bootstrap/dist/js/bootstrap.js'");

/***/ }),
/* 3 */,
/* 4 */,
/* 5 */
/***/ (function(module, exports) {

throw new Error("Module build failed: ModuleBuildError: Module build failed: \n@import \"~bootstrap/scss/bootstrap\";\n^\n      File to import not found or unreadable: /home/radu/Desktop/Nodejs-Ecommerce-Store/node_modules/bootstrap/scss/bootstrap.scss.\nParent style sheet: stdin\n      in /home/radu/Desktop/Nodejs-Ecommerce-Store/src/scss/main.scss (line 6, column 1)\n    at runLoaders (/home/radu/Desktop/Nodejs-Ecommerce-Store/node_modules/webpack/lib/NormalModule.js:195:19)\n    at /home/radu/Desktop/Nodejs-Ecommerce-Store/node_modules/loader-runner/lib/LoaderRunner.js:364:11\n    at /home/radu/Desktop/Nodejs-Ecommerce-Store/node_modules/loader-runner/lib/LoaderRunner.js:230:18\n    at context.callback (/home/radu/Desktop/Nodejs-Ecommerce-Store/node_modules/loader-runner/lib/LoaderRunner.js:111:13)\n    at Object.asyncSassJobQueue.push [as callback] (/home/radu/Desktop/Nodejs-Ecommerce-Store/node_modules/sass-loader/lib/loader.js:55:13)\n    at Object.<anonymous> (/home/radu/Desktop/Nodejs-Ecommerce-Store/node_modules/async/dist/async.js:2257:31)\n    at Object.callback (/home/radu/Desktop/Nodejs-Ecommerce-Store/node_modules/async/dist/async.js:958:16)\n    at options.error (/home/radu/Desktop/Nodejs-Ecommerce-Store/node_modules/node-sass/lib/index.js:294:32)");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {//deleting posts
$(document).ready(function () {
  $('.delete-post').on('click', function (e) {
    $target = $(e.target);
    const id = $target.attr('data-id');
    const confirmation = confirm('are you sure');
    if (confirmation) {
      $.ajax({
        type: 'POST',
        url: '/posts/delete/' + id,
        success: function (response) {
          // alert('Deleting Posts');
          window.location.href = '/admin';
        },
        // complete: function(data){
        //     window.location.href='/admin'; 

        //    },
        error: function (err) {
          console.log(err);
        }
      });
    };
  });
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 7 */
/***/ (function(module, exports) {

document.addEventListener("DOMContentLoaded", function (event) {
  document.getElementById("categories").addEventListener('change', function () {
    document.querySelector('.selected_category').innerHTML = this.querySelector('option[value=' + this.value + ']').innerHTML;
  });
});
document.getElementById('open-slide').addEventListener('click', function () {
  document.getElementById('side-menu').style.width = '250px';
});

document.getElementById('btn-close').addEventListener('click', function () {
  document.getElementById('side-menu').style.width = '0';
});

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map