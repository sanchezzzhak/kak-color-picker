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
  
  var DEFAULT_OPTIONS = {
	useAsButton: true,
	swatches: [
	  'rgba(244, 67, 54, 1)',
	  'rgba(233, 30, 99, 0.95)',
	  'rgba(156, 39, 176, 0.9)',
	  'rgba(103, 58, 183, 0.85)',
	  'rgba(63, 81, 181, 0.8)',
	  'rgba(33, 150, 243, 0.75)',
	  'rgba(3, 169, 244, 0.7)',
	  'rgba(0, 188, 212, 0.7)',
	  'rgba(0, 150, 136, 0.75)',
	  'rgba(76, 175, 80, 0.8)',
	  'rgba(139, 195, 74, 0.85)',
	  'rgba(205, 220, 57, 0.9)',
	  'rgba(255, 235, 59, 0.95)',
	  'rgba(255, 193, 7, 1)',
	  'rgba(216, 156, 96, 1)',
	  'rgba(173, 188, 207, 1)'
	],
	components: {
	  // Main components
	  preview: true,
	  opacity: true,
	  hue: true,
	  interaction: {
		hex: true,
		rgba: false,
		hsla: false,
		hsva: false,
		cmyk: false,
		input: true,
		clear: false,
		save: false
	  }
	}
  };
  
  // **********************************
  // Constructor
  // **********************************
  var kakColorPicker = function (element, options) {
	this.element = element;
	this.options = options === undefined ? {} : options;
	
	if (this.options.clientOptions == undefined) {
	  this.options.clientOptions = {};
	}
	
	this.init();
  };
  
  kakColorPicker.prototype = {
	constructor: kakColorPicker,
	init: function () {
	  this.destroy();
	  this.create();
	},
	isValidHex: function (hex) {
	  return (/^#([A-Fa-f0-9]{3,4}){1,2}$/.test(hex)
	  );
	},
	
	getAlphaFloat: function (a, alpha) {
	  if (typeof a !== "undefined") {
		return a / 256
	  }
	  if (typeof alpha !== "undefined") {
		if (1 < alpha && alpha <= 100) {
		  return alpha / 100
		}
		if (0 <= alpha && alpha <= 1) {
		  return alpha
		}
	  }
	  return 1
	},
	
	hexToRGBA: function (hex, alpha, toStr) {
	  function getChunksFromString(st, chunkSize) {
		return st.match(new RegExp(`.{${chunkSize}}`, "g"))
	  }
	  
	  function convertHexUnitTo256(hexStr) {
		return parseInt(hexStr.repeat(2 / hexStr.length), 16);
	  };
	  if (!this.isValidHex(hex)) {
		hex = '#000000';
	  }
	  var chunkSize = Math.floor((hex.length - 1) / 3)
	  var hexArr = getChunksFromString(hex.slice(1), chunkSize)
	  var [r, g, b, a] = hexArr.map(convertHexUnitTo256);
	  var a = this.getAlphaFloat(a, alpha);
	  return toStr !== undefined && toStr
		? `rgba(${r}, ${g}, ${b}, ${a})`
		: [r, g, b, a];
	},
	
	
	updatePreview: function (hex, sendEvents) {
	  var input = this.element;
	  if (this.options.addonPreview) {
		$(input).next().css('background-color', hex);
	  } else {
		var colorReverce = '#000000';
		var colorRgba = this.hexToRGBA(hex, undefined, false)
		$(input).css('background-color', hex);
		
		colorReverce = (Math.sqrt(
		  0.299 * (colorRgba[0] * colorRgba[0]) +
		  0.587 * (colorRgba[1] * colorRgba[1]) +
		  0.114 * (colorRgba[2] * colorRgba[2])
		) <= 127.5 && colorRgba[3] > 0.4) ? '#FFF' : '#000';
		$(input).css('color', colorReverce);
	  }
	  
	  $(input).val(hex);
	  if (sendEvents) {
		$(input).trigger('update-color', hex);
		$(input).trigger('change');
		$(input).trigger('blur');
	  }
	},
	
	create: function () {
	  var input = this.element;
	  var self = this;
	  var val = input.val();
	  var defaultVal = this.isValidHex(val) ? val : '#42445a';
	  
	  self.updatePreview(defaultVal, false)
	  
	  if (input.data('init-color')) {
		return;
	  }
	  
	  var pickr = Pickr.create($.extend({
		el: input.get(0),
		theme: self.options.theme !== undefined ? self.options.theme : 'monolith', // or 'monolith', or 'nano' or classic
		default: defaultVal,
	  }, DEFAULT_OPTIONS, this.options.clientOptions));
	  
	  
	  var updateColor = function updateColor() {
		var hex = pickr.getColor().toHEXA().toString(0);
		self.updatePreview(hex, true);
	  };
	  
	  pickr.on('change', function (color, instance) {
		updateColor();
	  });
	  
	  pickr.on('hide', function (instance) {
		updateColor();
	  });
	  
	  input.on('paste keyup', function () {
		var sColor = $(this).val();
		pickr.setColor(sColor, true);
	  });
	  
	  input.data('init-color', true);
	  input.data('pickr', pickr);
	}
	,
	
	destroy: function () {
	  if (this.element && this.element.data('init-color')) {
		var pickr = this.element.data('pickr');
		pickr && pickr.destroy && pickr.destroy();
		this.element.data('pickr', null);
		this.element.data('pinit-colorickr', false);
	  }
	}
  }
  ;
  
  $.fn.kakColorPicker = function (option) {
	var options = typeof option == 'object' && option;
	new kakColorPicker(this, options);
	return this;
  };
  
  $.fn.kakColorPicker.Constructor = kakColorPicker;
  
}))
;
