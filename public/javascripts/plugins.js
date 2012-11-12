var MT = MT || {};
MT.plugin = MT.plugin || {};
MT.data = MT.data || {};

(function () {
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
		4: 'version',
		// 绘制处理
		5: 'draw',
		// 透明度处理
		6: 'alphi'
	}
	/*
	 *  插件规范
	 *  @author sunjiaxiang
	 *  @since 11/05/2012
	 *  action: 		插件的名称;
	 *  type: 		插件类型, 0: 绘图插件, 1: 操作性插件;
	 *  ready:		当前操作图标被点击后插件被激活的处理;
	 *  draw:		绘制处理, 会传递来绘图板和路径.
	 *  end:		当前插件被关闭时的处理
	 */
	/** 直线插件. */
	MT.plugin.Line = function () {
		this.action = 'LINE';
		this.type = 0;
		this.ready = function (icon) {};
		this.end = function () {};
		this.render = function (ctx, paths) {
			for (var index in paths) {
				var path = paths[index];
				switch (path.type) {
					case 0: ctx.moveTo(path.x, path.y); break;
					case 1: ctx.fillStyle = path.color; break;
					case 2: ctx.strokeStyle = path.color; break;
					case 3: ctx.lineWidth = path.size; break;
					case 5: ctx.lineTo(path.x, path.y); break;
					case 6: ctx.globalAlpha = path.alpha; break;
				}
			}
		}
	}
	/** 矩形插件. */
	MT.plugin.Rectangle = function () {
		this.action = 'RECTANGLE';
		this.type = 0;
		this.ready = function (icon) {};
		this.end = function () {};
		this.render = function (ctx, paths) {
			var beginPos, sizePos;
			for (var index in paths) {
				var path = paths[index];
				switch (path.type) {
					case 0: beginPos = path; break;
					case 1: ctx.fillStyle = path.color; break;
					case 2: ctx.strokeStyle = path.color; break;
					case 3: ctx.lineWidth = path.size; break;
					case 5: sizePos = path; break;
					case 6: ctx.globalAlpha = path.alpha; break;
				}
			}
			ctx.rect(beginPos.x, beginPos.y, sizePos.x - beginPos.x, sizePos.y - beginPos.y);
			ctx.fill();
		}
	}
	/** 弧线插件. */
	MT.plugin.Lines = function () {
		this.action = 'LINES';
		this.type = 0;
		this.lastX = -1;
		this.lastY = -1;
		this.ready = function (icon) {};
		this.end = function () {
			this.lastX = -1;
			this.lastY = -1;
		};
		this.render = function (ctx, paths) {
			if (!!paths && paths[0].ver == 1) {
				var beginPos;
				for (var index in paths) {
					var path = paths[index];
					switch (path.type) {
						case 0: beginPos = path; break;
						case 1: ctx.fillStyle = path.color; break;
						case 2: ctx.strokeStyle = path.color; break;
						case 3: ctx.lineWidth = path.size; break;
						case 6: ctx.globalAlpha = path.alpha; break;
					}
				}
				if (this.lastX != -1 && this.lastY != -1) {
					ctx.moveTo(this.lastX, this.lastY);
					ctx.lineTo(beginPos.x, beginPos.y);
				}
				this.lastX = beginPos.x;
				this.lastY = beginPos.y;
			}
		}
	}
	/** 椭圆插件. */
	MT.plugin.Oval = function () {
		this.action = 'OVAL';
		this.type = 0;
		this.ready = function (icon) {};
		this.end = function () {};
		this.render = function (ctx, paths) {
			var beginPos, sizePos, centerX, centerY;
			for (var index in paths) {
				var path = paths[index];
				switch (path.type) {
					case 0: beginPos = path; break;
					case 1: ctx.fillStyle = path.color; break;
					case 2: ctx.strokeStyle = path.color; break;
					case 3: ctx.lineWidth = path.size; break;
					case 5: sizePos = path; break;
					case 6: ctx.globalAlpha = path.alpha; break;
				}
			}
			centerX = sizePos.x - beginPos.x >> 1;
			centerY = sizePos.y - beginPos.y >> 1;
			ctx.bezierCurveTo(beginPos.x, beginPos.y + centerY, 
					beginPos.x, beginPos.y, 
					beginPos.x + centerX, beginPos.y);
			ctx.bezierCurveTo(beginPos.x + centerX, beginPos.y, 
					sizePos.x, beginPos.y, 
					sizePos.x, beginPos.y + centerY);
			ctx.bezierCurveTo(sizePos.x, beginPos.y + centerY, 
					sizePos.x, sizePos.y, 
					beginPos.x + centerX, sizePos.y);
			ctx.bezierCurveTo(beginPos.x + centerX, sizePos.y, 
					beginPos.x, sizePos.y, 
					beginPos.x, beginPos.y + centerY);
			ctx.fill();
		}
	}
	/** 文本插件. */
	MT.plugin.Text = function () {
		this.action = 'TEXT';
		this.type = 0;
		this.size = 12;
		this.box = $('<input type="text" class="plugin-TEXT-ipt" placeholder="'
				+ i18n('plugin.text.enter') + 
				'">').appendTo(document.body);
		this.ready = function (icon) {
			$('#sizeIpt').val(this.size);
		};
		this.render = function (ctx, paths) {
			if (!!paths && paths[0].ver == 1) {
				var beginPos, color, cvsPos = $('#brush').offset(), me = this;
				for (var index in paths) {
					var path = paths[index];
					switch (path.type) {
						case 0: beginPos = path; break;
						case 1: ctx.fillStyle = path.color; break;
						case 2: color = path.color; break;
						case 3: this.size = path.size; break;
						case 6: ctx.globalAlpha = path.alpha; break;
					}
				}
				ctx.font = this.size + 'px sans-serif #' + color;
				this.box.css({
					left: cvsPos.left + beginPos.x + 'px',
					top: cvsPos.top + beginPos.y + 'px',
				}).val('').bind('keyup', doKeyUp).show().focus();
				
				function doKeyUp (evt) {
					if (evt.keyCode == 13)
						ctx.strokeText(me.box.val(), beginPos.x, beginPos.y)
				}
			}
			
		};
		this.end = function () {
			this.box.hide();
		}
	}
	/** 选择游标插件. */
	MT.plugin.Cursor = function () {
		this.action = 'CURSOR';
		this.type = 0;
		this.ready = function (icon) {
			
		};
		this.end = function () {};
		this.render = function (ctx, paths) {
			
		}
	}
	/** 新建插件. */
	MT.plugin.New = function () {
		this.action = 'NEW';
		this.type = 1;
		this.ready = function (icon) {
			
		};
		this.end = function () {};
	}
	/** 保存插件. */
	MT.plugin.Save = function () {
		this.action = 'SAVE';
		this.type = 1;
		this.ready = function (icon) {
			
		};
		this.end = function () {};
	}
	/** 开关灯插件. */
	MT.plugin.Lamp = function () {
		this.action = 'LAMP';
		this.type = 1;
		this.ready = function (icon) {
			if (icon.className == 'off') {
				icon.className = '';
				$('#hd').show();
				$('#ft').show();
			} else {
				icon.className = 'off';
				$('#hd').hide();
				$('#ft').hide();
			}
			$(window).trigger('resize');
		};
		this.end = function () {};
	}
	/** 后退插件. */
	MT.plugin.Back = function () {
		this.action = 'BACK';
		this.type = 1;
		this.ready = function (icon) {
			
		};
		this.end = function () {};
	}
	/** 前进插件. */
	MT.plugin.Forward = function () {
		this.action = 'FORWARD';
		this.type = 1;
		this.ready = function (icon) {
			
		};
		this.end = function () {};
	}
})();
