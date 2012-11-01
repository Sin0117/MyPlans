
var MT = MT || {};
MT.components = MT.components || {};
MT.data = MT.data || {};

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
				html.push('" data-operation="');
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
				$(window).trigger('onReadyDraw', [$(this).data('operation')]);
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
		
		this.view = $('<canvas id="DisplayCard" class="shadow2"></canvas>');
		this.viewCtx = this.view.get(0).getContext('2d');
		this.box = $('<canvas id="Sketchpad"></canvas>');
		this.boxCtx = this.box.get(0).getContext('2d');
		//修复chrome下光标样式的问题  
		this.box.live('selectstart', function () {
            return false;  
        });
		this.history = [];
		this.curDrawElem = null;
		this.lastX = -1;
		this.lastY = -1;
		this._render();
		this._initEvents();
	}
	MT.components.Sketch.prototype = {
		opt: {},
		_render: function () {
			this.opt.elem.append(this.view).append(this.box);
			this.view.width(this.opt.width);
			this.view.height(this.opt.height);
			this.box.width(this.opt.width);
			this.box.height(this.opt.height);
			this.resize();
		},
		_initEvents: function () {
			var me = this;
			$(window).bind('onReadyDraw', function (evt, type) {
				me.readyDraw();
			});
			this.box.bind('click', function (evt) {
				var curX = me.pos.left - evt.clientX, curY = me.pos.top - evt.clientY;
				if (!!me.curDrawElem) {
					
				} else {
				}
				me.lastX = curX;
				me.lastY = curY;
			});
		},
		readyDraw: function () {
			this.boxCtx.clearRect(0, 0, this.opt.width, this.opt.height);
			this.box.show();
		},
		beginDraw: function () {
			
		},
		endDraw: function () {
			
		},
		doLine: function () {
			
		},
		/** 更新界面. */
		update: function () {
			
		},
		/** 改变尺寸 并且重新计算位置. */
		resize: function () {
			this.pos = this.view.offset();
			this.box.css({
				left: this.pos.left + 'px',
				top: this.pos.top + 'px'
			});
		}
	}
	
	/** 绘图数据. */
	MT.data.DrawItem = function () {
		
	}
	MT.data.DrawItem.prototype = {
			// start X;
			xs: 0,
			// start Y;
			ys: 0,
			// end X;
			xe: 0,
			// end Y;
			ye: 0,
			z: 0,
			width: 0,
			height: 0,
			visiable: false,
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
