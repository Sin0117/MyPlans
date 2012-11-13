
var MT = MT || {};
// 组建包
MT.components = MT.components || {};
// 绘图数据包
MT.data = MT.data || {};
MT.utils = MT.utils || {};
// 绘图插件包
MT.plugin = MT.plugin || {};

(function () {
	// 全部的操作类集合.
	var operationsMap = {};
	$(function () {
		// 操作插件装填.
		var plugin = MT.plugin;
		for (var fn in plugin) {
			var fnObj = new plugin[fn]();
			operationsMap[fnObj.action] = fnObj;
		}
	});
	
	/** 操作列表. */
	MT.components.Operation = function (options) {
		 this.opt = $.extend({}, this.opt, options);
		 // 当前的操作类型
		 this.curOperaion = null;
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
				var $this = $(this), key = $this.data('operation');
				if (!!me.curOperaion && !!me.curOperaion.end)
					me.curOperaion.end();
				me.curOperaion = operationsMap[key];
				if (me.curOperaion.type == 0) {
					me.opt.elem.find('a').removeClass('on');
					this.className = 'on';
				}
				if (!!me.curOperaion && !!me.curOperaion.ready)
					me.curOperaion.ready(this, me);
				$(window).trigger('onReadyDraw', [$(this).data('operation')]);
				$(window).trigger('resize');
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
		
		// 底版处理层
		this.view = $('<canvas id="DisplayCard" class="shadow2"></canvas>');
		this.viewCtx = this.view.get(0).getContext('2d');
		// 呈像层
		this.box = $('<canvas id="Sketchpad"></canvas>');
		this.boxCtx = this.box.get(0).getContext('2d');
		// 渲染临时层
		this.temp = $('<canvas id="brush"></canvas>');
		this.tempCtx = this.temp.get(0).getContext('2d');
		
		// 呈祥的历史记录, 这个可以考虑本地保存.
		this.history = [];
		this.paths = [];
		// 当前的操作类型
		this.curOperaion = null;
		this._render();
		this._initEvents();
	}
	MT.components.Sketch.prototype = {
		opt: {},
		_render: function () {
			var w = this.opt.width, h = this.opt.height, 
				attObj = {width: w, height: h}, cssObj = {width: w + 'px', height: h + 'px'};
			this.opt.elem.append(this.view).append(this.box).append(this.temp);
			this.view.attr(attObj).css(cssObj);
			this.box.attr(attObj).css(cssObj);
			this.temp.attr(attObj).css(cssObj);
			this.resize();
		},
		_initEvents: function () {
			var me = this, width = this.opt.width, height = this.opt.height, win = $(window);
			//修复chrome下光标样式的问题  
			$('canvas').live('selectstart', function () {
	            return false;  
	        });
			$(window).bind('onReadyDraw', function (evt, type) {
				me.curOperaion = operationsMap[type];
			}).bind('resize', function (evt) {
				me.resize();
			});
			this.temp.bind('mousedown', doDrawStart);
			this.temp.bind('mousemove', doMouseMove);
			
			function doDrawStart(evt) {
				var $this = $(this);
				$this.bind({
					mouseup: doDrawEnd,
					mouseout: doDrawBreak,
					mousemove: doDrawMove
				});
				me.tempVer = 0;
				me.tempPath = [{
					type: 4,
					ver: 1
				}, {
					type: 1,
					color: '#' + $('#fillIpt').val()
				}, {
					type: 2,
					color: '#' + $('#colorIpt').val()
				}, {
					type: 3,
					size: $('#sizeIpt').val()
				}, {
					type: 6,
					alpha: $('#alphaIpt').val()
				}, {
					type: 0,
					x: win.scrollLeft() + evt.clientX - me.pos.left,
					y: win.scrollTop() + evt.clientY - me.pos.top
				}];
				me.beginDraw();
			}
			function doDrawEnd(evt) {
				if (!!me.tempPath && me.tempPath.length > 6) {
					me.update(me.tempPath);
				}
				doDrawBreak.call(me.temp);
			}
			function doDrawMove(evt) {
				if (!me.curOperaion) return;
				var curX = win.scrollLeft() + evt.clientX - me.pos.left, 
					curY = win.scrollTop() + evt.clientY - me.pos.top;
				if (!!me.tempPath && (curX != me.lastX || curY != me.lastY)) {
					me.tempPath[0].ver = me.tempPath[0].ver + 1; 
					me.tempPath[6] = {
						type: 5, x: curX, y: curY, plugin: me.curOperaion.action
					};
					me.lastX = curX;
					me.lastY = curY;
				}
			}
			function doDrawBreak(evt) {
				var $this = $(this);
				$this.unbind('mouseup');
				$this.unbind('mouseout');
				$this.unbind('mousemove', doDrawMove);
				me.tempPath = null;
				me.tempVer = -1;
				me.tempCtx.clearRect(0, 0, width, height);
				me.endDraw();
			}
			// 计算鼠标坐标
			function doMouseMove(evt) {
				me.mouseX = win.scrollLeft() + evt.clientX - me.pos.left;
				me.mouseY = win.scrollTop() + evt.clientY - me.pos.top;
			}
			// 临时画板的桢渲染，暂时定20fps/s
			setInterval(function () {
				$('#posXIpt').val(me.tempVer); // me.mouseX);
				$('#posYIpt').val(me.tempPath ? me.tempPath[0].ver : -1); // me.mouseY);

				if (!me.tempPath || me.tempVer == -1 || me.tempVer == me.tempPath[0].ver || me.tempPath.length < 7) return;
				var ctx = me.tempCtx, paths = me.tempPath;
				ctx.clearRect(0, 0, width, height);
				me.draw(ctx, paths);
				me.tempVer = paths[0].ver;
			}, 45);
		},
		beginDraw: function () {
			if (!!this.curOperaion && !!this.curOperaion.begin)
				this.curOperaion.begin(this.tempCtx, this.tempPath, this);
		},
		endDraw: function () {
			if (!!this.curOperaion && !!this.curOperaion.end) {
				this.curOperaion.finish(this.boxCtx, this.tempPath, this);
			}
		},
		draw: function (ctx, paths) {
			if (!this.curOperaion) return;
			ctx.save();
			ctx.beginPath();
			this.curOperaion.render(ctx, paths);
			ctx.closePath();
			ctx.stroke();
			ctx.restore();
		},
		/** 更新界面. */
		update: function (paths) {
			this.history.push(paths);
			this.draw(this.boxCtx, paths);
		},
		/** 改变尺寸 并且重新计算位置. */
		resize: function () {
			this.pos = this.view.offset(), plugin = this.curOperaion;
			var styles = {
				left: this.pos.left + 'px',
				top: this.pos.top + 'px'
			};
			this.box.css(styles);
			this.temp.css(styles);
			if (!!plugin && !!plugin.resize) {
				plugin.resize(styles);
			}
		}
	}
	
	/** 
	 * 绘图数据. 
	 * 格式: action|key:val,key:val ... ,key:val
	 */
	MT.data.DrawItem = function (type, paths) {
		this.type = type;
		this.paths = paths;
		this.toString = function () {
			var paths = this.paths;
			var str = [];
			for (var i = 0, path; path = paths[i]; i ++) {
				var s = [];
				for (var key in path)
					s.push(key + ':' + path[key]);
				str.push(s.join(','));
			}
			return this.type + '|' + str.join('#');
		}
	}
	// 这个是绘图渲染时的基本处理类型.
	MT.data.PLUGIN_DRAW_TYPE = {
		// 移动到目标点
		0: 'moveTo',
		// 填充样式变更
		1: 'fillStyle',
		// 线条样式变更
		2: 'strokeStyle',
		// 设置线条宽度
		3: 'lineWidth',
		// 绘制到版本
		4: 'version'
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
			var html = ['<label>线颜色:<input id="colorIpt" type="text" value="000000" /></label>'];
			html.push('<label>透明度:<input id="alphaIpt" type="range" value="1" min="0" max="1" step="0.05" /></label>');
			html.push('<label>线条宽:<input id="sizeIpt" class="ipt-32" type="number" value="1" min="1" max="20" step="1" /></label><br>');
			html.push('<label>背景色:<input id="fillIpt" type="text" value="FFFFFF" /></label>');
			html.push('坐标参数:<label>X:<input id="posXIpt" class="ipt-32" type="text" /></label>');
			html.push('<label>Y:<input id="posYIpt" class="ipt-32" type="text" /></label>');
			// html.push('<label>Z:<input id="posZIpt" class="ipt-32" type="text" /></label>');
			this.opt.elem.append(html.join(''));
		},
		_initEvents: function () {
			var me = this;
			me.opt.height = $(window).height();
			me.opt.top = me.opt.foot.offset().top;
			me.opt.scroll = $(window).scrollTop();
			
			$('#colorIpt').bind('change', function () {
				if (!!me.curOperaion)
					me.curOperaion.color = this.value;
			});
			$('#alphaIpt').bind('change', function () {
				if (!!me.curOperaion)
					me.curOperaion.alpha = this.value;
			});
			$('#sizeIpt').bind('change', function () {
				if (!!me.curOperaion)
					me.curOperaion.size = this.value;
			});
			$('#fillIpt').bind('change', function () {
				if (!!me.curOperaion)
					me.curOperaion.fill = this.value;
			});
			$(window).bind({scroll: function () {
				me.opt.top = me.opt.foot.offset().top;
				me.opt.scroll = $(window).scrollTop();
				me.resize();
			}, resize: function () {
				me.opt.height = $(window).height();
				me.opt.top = me.opt.foot.offset().top;
				me.resize();
			}, onReadyDraw: function (evt, type) {
				me.curOperaion = operationsMap[type];
			}});
			this.resize();
		},
		resize: function () {
			var winHeight = this.opt.height, scrollTop = this.opt.scroll, top = this.opt.top,
				offset = winHeight + scrollTop - top, height = this.opt.size;
			if (offset > 0) {
				if (top  != scrollTop) {
					this.opt.elem.css('top', winHeight - height - offset + 'px');
				} else {
					this.opt.elem.css('top', winHeight - height + 'px');
				}
			} else {
				this.opt.elem.css('top', winHeight - height + 'px');
			}
		}
	}
	
})();
