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
		4: 'version'
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
		this.acton = 'LINE';
		this.type = 0;
		this.ready = function () {
			
		}
		this.render = function (ctx, paths) {
			
		}
	}
	/** 矩形插件. */
	MT.plugin.Rectangle = function () {
		this.action = 'RECTANGLE';
		this.type = 0;
		this.ready = function () {
			
		}
		this.render = function (ctx, paths) {
			
		}
	}
	/** 弧线插件. */
	MT.plugin.Arc = function () {
		this.action = 'ARC';
		this.type = 0;
		this.ready = function () {
			
		}
		this.render = function (ctx, paths) {
			
		}
	}
	/** 椭圆插件. */
	MT.plugin.Oval = function () {
		this.action = 'OVAL';
		this.type = 0;
		this.ready = function () {
			
		}
		this.render = function (ctx, paths) {
			
		}
	}
	/** 文本插件. */
	MT.plugin.Text = function () {
		this.action = 'TEXT';
		this.type = 0;
		this.ready = function () {
			
		}
		this.render = function (ctx, paths) {
			
		}
	}
	/** 选择游标插件. */
	MT.plugin.Cursor = function () {
		this.action = 'CURSOR';
		this.type = 0;
		this.ready = function () {
			
		}
		this.render = function (ctx, paths) {
			
		}
	}
	/** 新建插件. */
	MT.plugin.New = function () {
		this.action = 'NEW';
		this.type = 1;
		this.ready = function () {
			
		}
	}
	/** 保存插件. */
	MT.plugin.Save = function () {
		this.action = 'SAVE';
		this.type = 1;
		this.ready = function () {
			
		}
	}
	/** 开关灯插件. */
	MT.plugin.Lamp = function () {
		this.action = 'LAMP';
		this.type = 1;
		this.ready = function () {
			
		}
	}
	/** 后退插件. */
	MT.plugin.Back = function () {
		this.action = 'BACK';
		this.type = 1;
		this.ready = function () {
			
		}
	}
	/** 前进插件. */
	MT.plugin.Forward = function () {
		this.action = 'FORWARD';
		this.type = 1;
		this.ready = function () {
			
		}
	}
});
	