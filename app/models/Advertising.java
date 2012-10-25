package models;

import play.modules.morphia.Model;

/**
 * <p>广告类</p>
 * @author sunjiaxiang
 * @since 10/25/2012
 */
public class Advertising extends Model {
	/** 广告标题 */
	public String title;
	/** 广告内容 */
	public String content;
	/** 点击量 */
	public Long count;
}
