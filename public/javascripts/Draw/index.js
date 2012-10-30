
var MT = MT || {};
MT.components = MT.components || {};

(function () {
	
	/** 操作列表. */
	MT.components.Operation = function (options) {
		 this.opt = $.extend({}, this.opt, options);
		 
		 this._render();
		 this._initEvents();
	}
	MT.components.Operation.prototype = {
		opt: {},
		_render: function () {
			var opt = this.opt, html = [];
			html.push(this._renderItem( opt.items));
			html.push(this._renderItem( opt.opts));
			opt.elem.append(html.join(''));
		},
		/** 渲染操作项. */
		_renderItem: function (items) {
			var html = []
			for (var item in items) {
				var val = items[item];
				if (!val) continue;
				html.push('<a href="javascript:void(0)", id="opt_');
				html.push(val);
				html.push('" title="');
				html.push(i18n(val));
				html.push('">&nbsp;</a>');
			}
			return html.join('');
		},
		/** 初始化事件. */
		_initEvents: function () {
			var me = this;
			this.opt.elem.find('a').live('click', function () {
				me.opt.elem.find('a').removeClass('on');
				this.className = 'on';
			});
			this.opt.scroll = $(window).scrollTop();
			this.opt.top = this.opt.head.get(0).offsetHeight;
			
			$(window).bind('scroll', function () {
				me.opt.scroll = $(window).scrollTop();
				me.resize();
			});
			$(window).bind('resize', function () {
				me.opt.top = me.opt.head.get(0).offsetHeight;
				me.resize();
			});
			this.resize();
		},
		resize: function () {
			var headHeight = this.opt.top, scrollTop = this.opt.scroll;
			if (scrollTop < headHeight)
				this.opt.elem.css('top', headHeight - scrollTop + 'px');
			else
				this.opt.elem.css('top', '0px');
		}
	}
	
	/** 绘图区. */
	MT.components.Sketch = function (options) {
		this.opt = $.extend({}, this.opt, options);
		
		this.box = $('<canvas id="Sketchpad"></canvas>');
		this._render();
	}
	MT.components.Sketch.prototype = {
		opt: {},
		_render: function () {
			this.opt.elem.append(this.box);
			this.box.width(this.opt.width);
			this.box.height(this.opt.height);
		}
	}
	
	/** 设置列表. */
	MT.components.Setting = function (options) {
		this.opt = $.extend({}, this.opt, options);
		 
		 this._render();
		 this._initEvents();
	}
	MT.components.Setting.prototype = {
		opt: {
			size: 56
		},
		_render: function () {
			var html = ['<label>颜色:<input id="colorIpt" type="text" value="0" min="0" max="0xFFFFFF" step="1" /></label>'];
			html.push('<label>透明度:<input id="aliphiIpt" type="range" value="1" min="0" max="1" step="0.05" /></label>');
			html.push('<label>线条宽:<input id="sizeIpt" class="ipt-32" type="number" value="1" min="1" max="20" step="1" /></label>');
			html.push('<br>坐标参数:');
			html.push('<label>X:<input id="posXIpt" class="ipt-32" type="number" min="1" step="1" /></label>');
			html.push('<label>Y:<input id="posYIpt" class="ipt-32" type="number" min="1" step="1" /></label>');
			html.push('<label>Z:<input id="posZIpt" class="ipt-32" type="number" min="1" step="1" /></label>');
			this.opt.elem.append(html.join(''));
		},
		_initEvents: function () {
			var me = this;
			me.opt.height = $(window).height();
			me.opt.top = me.opt.foot.offset().top;
			me.opt.scroll = $(window).scrollTop();
			me.opt.bottom = me.opt.foot.get(0).offsetHeight;
			
			$(window).bind('scroll', function () {
				me.opt.scroll = $(window).scrollTop();
				me.resize();
			});
			$(window).bind('resize', function () {
				me.opt.height = $(window).height();
				me.opt.top = me.opt.foot.offset().top;
				me.opt.bottom = me.opt.foot.get(0).offsetHeight;
				me.resize();
			});
			this.resize();
		},
		resize: function () {
			var winHeight = this.opt.height, scrollTop = this.opt.scroll, top = this.opt.top,
				offset = winHeight + scrollTop - top, height = this.opt.size;
			if (offset > 0) {
				this.opt.elem.css('top', winHeight - height - offset + 'px');
			} else {
				this.opt.elem.css('top', winHeight - height + 'px');
			}
		}
	}
})();
