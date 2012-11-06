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
	 */
	/** 直线插件. */
	MT.plugin.Line = function () {
		this.action = 'LINE';
		this.type = 0;
		this.ready = function (icon) {}
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
		this.ready = function (icon) {}
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
	MT.plugin.Arc = function () {
		this.action = 'ARC';
		this.type = 0;
		this.ready = function (icon) {
			
		}
		this.render = function (ctx, paths) {
			
		}
	}
	/** 椭圆插件. */
	MT.plugin.Oval = function () {
		this.action = 'OVAL';
		this.type = 0;
		this.ready = function (icon) {
			
		}
		this.render = function (ctx, paths) {
			
		}
	}
	/** 文本插件. */
	MT.plugin.Text = function () {
		this.action = 'TEXT';
		this.type = 0;
		this.ready = function (icon) {
			
		}
		this.render = function (ctx, paths) {
			
		}
	}
	/** 选择游标插件. */
	MT.plugin.Cursor = function () {
		this.action = 'CURSOR';
		this.type = 0;
		this.ready = function (icon) {
			
		}
		this.render = function (ctx, paths) {
			
		}
	}
	/** 新建插件. */
	MT.plugin.New = function () {
		this.action = 'NEW';
		this.type = 1;
		this.ready = function (icon) {
			
		}
	}
	/** 保存插件. */
	MT.plugin.Save = function () {
		this.action = 'SAVE';
		this.type = 1;
		this.ready = function (icon) {
			
		}
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
		}
	}
	/** 后退插件. */
	MT.plugin.Back = function () {
		this.action = 'BACK';
		this.type = 1;
		this.ready = function (icon) {
			
		}
	}
	/** 前进插件. */
	MT.plugin.Forward = function () {
		this.action = 'FORWARD';
		this.type = 1;
		this.ready = function (icon) {
			
		}
	}
})();
