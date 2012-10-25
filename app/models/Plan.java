package models;

import java.util.Date;

import play.modules.morphia.Model;

/** 
 * <p>计划表。</p>
 * @author sunjiaxiang
 * @since 25/10/2012
 */
public class Plan extends Model {
	/** 计划名称。 */
	public String name;
	/** 内容，分隔符为|。 */
	public String content;
	/** 作者。 */
	public User user;
	/** 创建时间。 */
	public Date ceateAt;
	/** 最后修改时间。 */
	public Date modifyAt;
}
