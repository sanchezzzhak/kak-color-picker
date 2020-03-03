(function (root, factory) {
  // CommonJS support
  if (typeof exports === 'object') {
	module.exports = factory();
  }
  // AMD
  else if (typeof define === 'function' && define.amd) {
	define(['jquery'], factory);
  }
  // Browser globals
  else {
	factory(root.jQuery);
  }
}(this, function ($) {
  'use strict';

// **********************************
// Constructor
// **********************************
var kakGradientPicker = function (element, options) {
  this.element = $(element).closest('.kak-input-gradient');
  this.options = options === undefined ? {} : options;
  this.ranges = [];
  if (this.options.clientOptions == undefined) {
	this.options.clientOptions = {};
  }
  
  this.init();
};

kakGradientPicker.prototype = {
  constructor: kakGradientPicker,
  init: function () {
	this.destroy();
	this.create();
  },
  destroy: function () {
  },
  create: function () {
	var createBtn = this.element.find('.ig-btn-add');
	createBtn.on('click', this.onClickAddRule.bind(this))
  },
  
  createPoint() {
	return $(
	  '<div class="ig-gradient-point">' +
	  '<div class="ig-gradient-point-bg"></div>' +
	  '<div class="ig-gradient-point-border"></div>' +
	  '<div class="ig-gradient-point-color"></div>' +
	  '</div>'
	);
  }
  
  
  onClickAddRule: function (event) {
	console.log('onClickAddRule', event);
	var point = this.createPoint();
  }
  
};

$.fn.kakGradientPicker = function (option) {
  var options = typeof option == 'object' && option;
  new kakGradientPicker(this, options);
  return this;
};

$.fn.kakGradientPicker.Constructor = kakGradientPicker;
  
}))


