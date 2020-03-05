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
  
  
  var SELECTORS = {
	PREVIREW: '.ig-preview-color',
	RANGEBAR: '.ig-ranges-color',
	CREATE_POINT: '.ig-btn-add',
	POINT: '.ig-gradient-point'
	
  };
  
  
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
  
  
  var isIE = /* @cc_on!@ */ false || !!document.documentMode;
  var isEdge = window.navigator.userAgent.includes('Edge');
  var isWebkit = 'WebkitAppearance' in document.documentElement.style && !/Edge/.test(navigator.userAgent);
  var isIPhone = /(iPhone|iPod)/gi.test(navigator.userAgent) && !window.MSStream;
  var isIos = /(iPad|iPhone|iPod)/gi.test(navigator.userAgent) && !window.MSStream;   // navigator.platform
  var isAndroid = /android/i.test(navigator.userAgent);
  var isMobile = (isIos || isAndroid);
  
  function bounds(element) {
	var boundsRect = {
	  left: 0,
	  right: 0,
	  width: 0,
	  height: 0,
	  top: 0,
	  bottom: 0
	};
	
	if (!element || !document.body.contains(element)) {
	  return boundsRect;
	}
	
	var rect = element.getBoundingClientRect();
	var scrollOffsetY = window.pageYOffset;
	var scrollOffsetX = window.pageXOffset;
	
	if (!rect.width && !rect.height && !rect.left && !rect.top) {
	  // element is not visible / no layout
	  return boundsRect;
	}
	
	boundsRect.left = rect.left + scrollOffsetX;
	boundsRect.right = rect.right + scrollOffsetX;
	boundsRect.top = rect.top + scrollOffsetY;
	boundsRect.bottom = rect.bottom + scrollOffsetY;
	boundsRect.width = rect.right - rect.left;
	boundsRect.height = rect.bottom - rect.top;
	
	return boundsRect;
  }
  
  function getRailBounds(elementRail) {
	var railBounds = bounds(elementRail);
	// Partial workaround of Android 'inert-visual-viewport'
	// https://bugs.chromium.org/p/chromium/issues/detail?id=489206
	var pageXOffset = window.pageXOffset;
	if (pageXOffset && isAndroid && document.body.parentElement.getBoundingClientRect().left >= 0) {
	  railBounds.left -= pageXOffset;
	  railBounds.right -= pageXOffset;
	}
	return railBounds;
  };
  
  function between(num, min, max) {
	return Math.max(Math.min(num, max), min);
  }
  
  // **********************************
  // Constructor
  // **********************************
  
  var kakGradientPicker = function (element, options) {
	this.element = $(element);
	
	this.previewContainer = this.element.find(SELECTORS.PREVIREW);
	this.rangesContainer = this.element.find(SELECTORS.RANGEBAR);
	
	this.changeDelayTimer = null;
	
	this.options = options === undefined ? {} : options;
	this.ranges = [];
	if (this.options.clientOptions == undefined) {
	  this.options.clientOptions = {};
	}
	if (this.options.changeDelayTimer == undefined) {
	  this.options.changeDelayTimer = 300;
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
	  var that = this;
	  if (this.rangesContainer) {
		this.rangesContainer.find(SELECTORS.POINT).each(function () {
		  var point = $(this);
		  that.onRemovePoint(point, true);
		})
	  }
	},
	create: function () {
	  this.element.find(SELECTORS.CREATE_POINT)
	  .on('click', this.onClickCreatePoint.bind(this));
	  this.initPoints();
	},
	
	initPoints: function () {
	  if (this.options.items && this.options.items.length > 0) {
		for (var i = 0, l = this.options.items.length; i < l; i++) {
		  var item = this.options.items[i];
		  this.createPoint(item.color, item.stop);
		}
	  }
	  
	  if (this.options.items && this.options.items.length < 2) {
		for (var i = this.options.items.length, l = 2; i < l; i++) {
		  this.createPoint(this.getRandomColor(), i > 0 ? 100 / i : 0);
		}
	  }
	},
	
	getRandomColor: function () {
	  var letters = "0123456789ABCDEF";
	  var color = [];
	  color.push('#')
	  for (var i = 0; i < 6; i++){
		color.push(letters[(Math.floor(Math.random() * 16))]);
	  }
	  return color.join('');
	},
	
	createPoint: function (color, percent) {
	  var point = $(
		'<div class="ig-gradient-point">' +
		'<a hreg="javascript:;" class="ig-gradient-point-remove">&times;</a>' +
		'<div class="ig-gradient-point-bg"></div>' +
		'<div class="ig-gradient-point-border"></div>' +
		'<div class="ig-gradient-point-color"></div>' +
		'<label>' +
		'<input class="ig-gradient-point-percent">' +
		'</label>' +
		'</div>'
	  );
	  this.rangesContainer.append(point);
	  
	  this.createDrag(point);
	  this.createChangeColorpiker(point, color);
	  this.createChangePercent(point, percent);
	  this.createRemove(point);
	  
	  this.onUpdatePoint(point);
	},
	
	getPerventMovePointX(el, dimension) {
	  var railBounds = getRailBounds(el.parentNode);
	  return between((dimension / railBounds.width), 0, 1) * 100;
	},
	
	onRemovePoint(point, force) {
	  if (!force) {
		if (this.rangesContainer.find(SELECTORS.POINT).length <= 2) {
		  return;
		}
	  }
	  
	  var pickr = point.data('__pickr');
	  pickr && pickr.destroyAndRemove();
	  
	  var drag = point.data('__displacejs');
	  drag && drag.destroy();
	  
	  this.getInputPercentElementByPoint(point).off('change', this.onChangePercentPoint.bind(this, point));
	  point.remove();
	  
	  if (!force) {
		this.onUpdateMainPreview();
	  }
	},
	
	onChangePercentPoint: function (point) {
	  this.onUpdatePoint(point);
	},
	
	onMovePoint: function (el, x, y) {
	  var percent = this.getPerventMovePointX(el, x);
	  var percentFix = percent.toFixed(0);
	  $(el).attr('data-percent', percentFix).css('left', percent + '%');
	  this.getInputPercentElementByPoint($(el)).val(percentFix);
	  this.onUpdatePoint($(el));
	},
	
	onUpdateMainPreview: function () {
	  var that = this;
	  var colors = [];
	  var result = [];
	  
	  this.rangesContainer.find(SELECTORS.POINT)
	  .sort(function (a, b) {
		return parseInt($(a).attr('data-percent')) - parseInt($(b).attr('data-percent'));
	  }).each(function () {
		var point = $(this);
		var hex = point.attr('data-color');
		var percent = point.attr('data-percent');
		colors.push(hex + ' ' + percent + '%');
		result.push({color: hex, stop: percent});
	  });
	  
	  this.previewContainer.css('background-image', 'linear-gradient(90deg, ' + colors.join(',') + ')');
	  
	  clearTimeout(this.changeDelayTimer);
	  this.changeDelayTimer = setTimeout(function () {
		that.element.trigger('gradient:change', {colors: result});
	  }, this.options.changeDelayTimer);
	  
	},
	
	onUpdatePoint: function (point) {
	  var pickr = point.data('__pickr');
	  var color = this.getColorPreviewElementByPoint(point);
	  var hex = pickr.getColor().toHEXA().toString(0);
	  point.attr('data-color', hex);
	  color.css('background-color', hex);
	  this.onUpdateMainPreview();
	},
	
	createDrag: function (point) {
	  var handle = this.getHandleDragElmentbyPoint(point);
	  var drag = window.displacejs(point.get(0), {
		// constrain: false,
		// handle: handle.get(0),
		ignoreFn: function (event) {
		  return event.target.closest('label') !== null
			|| event.target.classList.contains('ig-gradient-point-remove');
		},
		customMove: this.onMovePoint.bind(this)
	  });
	  point.data('__displacejs', drag);
	},
	
	createRemove: function (point) {
	  var remove = this.getRemoteElementByPoint(point);
	  remove.on('click', this.onRemovePoint.bind(this, point, false));
	},
	
	getColorPreviewElementByPoint(point) {
	  return point.find('.ig-gradient-point-color');
	},
	
	getHandleDragElmentbyPoint: function (point) {
	  return point.find('.ig-gradient-point-bg');
	},
	
	getRemoteElementByPoint: function (point) {
	  return point.find('.ig-gradient-point-remove');
	},
	
	getInputPercentElementByPoint: function (point) {
	  return point.find('.ig-gradient-point-percent');
	},
	
	createChangePercent(point, percent) {
	  var input = this.getInputPercentElementByPoint(point);
	  input.on('change', this.onChangePercentPoint.bind(this, point));
	  
	  if (percent !== undefined) {
		var percentFix = parseInt(percent).toFixed(0);
		point.attr('data-percent', percentFix).css('left', percent + '%');
		input.val(percentFix);
	  }
	},
	
	createChangeColorpiker: function (point, defaultVal) {
	  if (defaultVal === undefined) {
		defaultVal = '#000000';
	  }
	  var input = this.getInputPercentElementByPoint(point);
	  var pickr = Pickr.create($.extend({
		el: input.get(0),
		default: defaultVal,
		theme: this.options.theme !== undefined ? this.options.theme : 'monolith', // or 'monolith', or 'nano' or classic
	  }, DEFAULT_OPTIONS, this.options.clientOptions));
	  
	  point.data('__pickr', pickr);
	  
	  pickr.on('hide', $.proxy(function () {
		this.onUpdatePoint(point);
	  }, this));
	  
	  pickr.on('change', $.proxy(function () {
		this.onUpdatePoint(point);
	  }, this));
	  
	  pickr.setColor(defaultVal);
	},
	
	onClickCreatePoint: function (event) {
	  this.createPoint(this.getRandomColor(), 0);
	}
  };
  
  $.fn.kakGradientPicker = function (option) {
	var options = typeof option == 'object' && option;
	new kakGradientPicker(this, options);
	return this;
  };
  
  $.fn.kakGradientPicker.Constructor = kakGradientPicker;
  
}))


