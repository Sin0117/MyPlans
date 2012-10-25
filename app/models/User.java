package models;

import java.util.Date;

import models.enums.LevelType;
import models.enums.UserType;
import play.modules.morphia.Model;

/**
 * <p>用户类</p>
 * @author sunjiaxiang
 * @since 10/25/2012
 */
public class User extends Model {
	/** 用户名称 */
	public String name;
	/** 公司 */
	public String company;
	/** 邮箱 */
	public String email;
	/** 用户来源 */
	public UserType type = UserType.NONE;
	/** 用户级别 */
	public LevelType level = LevelType.NONE;
	/** 注册时间 */
	public Date createAt;
	/** 最后一次登录时间 */
	public Date loginAt;
}
