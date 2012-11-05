
var MT = MT || {};
// 组建包
MT.components = MT.components || {};
// 绘图数据包
MT.data = MT.data || {};
MT.utils = MT.utils || {};
// 绘图插件包
MT.plugin = MT.plugin || {};

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
		this.temp = $('<canvas id="brush"></canvas>');
		this.tempCtx = this.temp.get(0).getContext('2d');
		
		this.history = [];
		this.curDrawElem = null;
		this._render();
		this._initEvents();
	}
	MT.components.Sketch.prototype = {
		opt: {},
		_render: function () {
			this.opt.elem.append(this.view).append(this.box).append(this.temp);
			this.view.width(this.opt.width);
			this.view.height(this.opt.height);
			this.box.width(this.opt.width);
			this.box.height(this.opt.height);
			this.temp.width(this.opt.width);
			this.temp.height(this.opt.height);
			this.resize();
		},
		_initEvents: function () {
			var me = this, width = this.opt.width, height = this.opt.height;
			//修复chrome下光标样式的问题  
			$('canvas').live('selectstart', function () {
	            return false;  
	        });
			$(window).bind('onReadyDraw', function (evt, type) {
				me.beginDraw();
			});
			this.temp.bind('mousedown', doDrawStart);
			
			function doDrawStart(evt) {
				var $this = $(this);
				$this.bind({
					mouseup: doDrawEnd,
					mouseover: doDrawBreak,
					mousemove: doDrawMove
				});
				me.tempPath = [{
					type: 11,
					ver: 0
				},{
					type: 9,
					color: '#' + $('#colorIpt').val()
				}, {
					type: 10,
					size: $('#sizeIpt').val()
				}, {
					type: 0,
					x: evt.clientX - me.pos.left,
					y: evt.clientY - me.pos.top
				}];
			}
			function doDrawEnd(evt) {
				me.draw();
				doDrawBreak();
			}
			function doDrawMove(evt) {
				var curX = evt.clientX - me.pos.left, curY = evt.clientY - me.pos.top;
				if (!!me.tempPath && (curX != me.lastX || curY != me.lastY)) {
					me.tempPath[0].ver = me.tempPath[0].ver + 1; 
					me.tempPath[4] = {
						type: 1, x: curX, y: curY
					};
					me.lastX = curX;
					me.lastY = curY;
				}
			}
			function doDrawBreak(evt) {
				var $this = $(this);
				$this.unbind('mouseup');
				$this.unbind('mouseover');
				$this.unbind('mousemove');
				me.tempPath = null;
				me.tempVer = -1;
				me.endDraw();
			}
			// 临时画板的桢渲染，暂时定20fps/s
			setInterval(function () {
			// setTimeout(function () {
				var ctx = me.tempCtx, paths = me.tempPath;
				if (!paths || me.tempVer == -1 || me.tempVer == paths[0].ver) return;
				ctx.clearRect(0, 0, width, height);
				ctx.save();
				ctx.beginPath();
				console.log(' --------------------------------------------- start --------------------------------------------- ');
				for (var index in paths) {
					var path = paths[index];
					switch (path.type) {
						case 0: console.log('move to : ' + path.x + ' : ' + path.y), ctx.moveTo(path.x, path.y); break;
						case 1: console.log('line to : ' + path.x + ' : ' + path.y), ctx.lineTo(path.x, path.y); break;
						case 2: ctx.quadraticCurveTo(path.cx, path.cy, path.x, path.y); break;
						case 3: ctx.bezierCurveTo(path.bx, path.by, path.cx, path.cy, path.x, path.y); break;
						case 7: ctx.fill(); break;
						
						case 8: ctx.fillStyle = path.color; break;
						case 9: ctx.strokeStyle = path.color; break;
						case 10: ctx.lineWidth = path.size; break;
					}
				}
				console.log(' --------------------------------------------- end --------------------------------------------- ');
				ctx.stroke();
				ctx.closePath();
				ctx.restore();
				me.tempVer = paths[0].ver;
			}, 45);
		},
		beginDraw: function () {
			this.boxCtx.clearRect(0, 0, this.opt.width, this.opt.height);
			this.tempCtx.clearRect(0, 0, this.opt.width, this.opt.height);
			this.box.show();
			this.temp.show();
		},
		endDraw: function () {
			
		},
		draw: function (paths) {
			var ctx = this.boxCtx;
			ctx.save();
			ctx.beginPath();
			for (var path in paths) {
				switch (path.type) {
				case 0: break;
				case 1: break;
				case 2: break;
				case 3: break;
				case 4: break;
				}
			}
			ctx.stroke();
			ctx.restore();
		},
		/** 更新界面. */
		update: function () {
			
		},
		/** 改变尺寸 并且重新计算位置. */
		resize: function () {
			this.pos = this.view.offset();
			var styles = {
				left: this.pos.left + 'px',
				top: this.pos.top + 'px'
			};
			this.box.css(styles);
			this.temp.css(styles);
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
	MT.data.DRAW_TYPE = {
		// 移动到目标点
		0: 'moveTo',
		// 绘制直线到目标点
		1: 'lineTo',
		// 以当前路径绘制贝塞尔曲线
		2: 'quadraticCurveTo',
		// 绘制贝塞尔二次曲线
		3: 'bezierCurveTo',
		// 绘制矩形
		4: 'rect',
		// 绘制文字
		5: 'text',
		// 绘制椭圆
		6: 'arc',
		// 对当前路径进行填充
		7: 'fill',
		// 填充样式变更
		8: 'fillStyle',
		// 线条样式变更
		9: 'strokeStyle',
		// 设置线条宽度
		10: 'lineWidth',
		// 绘制到版本
		11: 'version'
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
			var html = ['<label>颜色:<input id="colorIpt" type="text" value="000000" /></label>'];
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
