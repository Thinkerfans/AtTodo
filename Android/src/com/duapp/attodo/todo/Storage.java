package com.duapp.attodo.todo;

import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;

/**
 * 存储
 * 
 * @author 马
 * 
 */
public class Storage {

	/**
	 * 读取配置文件
	 */
	public static SharedPreferences reader;
	/**
	 * 写入配置文件
	 */
	public static Editor writer;

	/**
	 * 屏幕宽度DP
	 */
	public static int screenWidth;
	/**
	 * 屏幕宽度PX
	 */
	public static int screenWidthPx;
	/**
	 * 每dp的像素数
	 */
	public static int screenDip;
	public static String ssid;

	public static int userId;

	/**
	 * 进行一些数据的初始化操作
	 */
	public static void init(SharedPreferences reader) {
		Storage.reader = reader;
		Storage.writer = Storage.reader.edit();

		Storage.ssid = Storage.reader.getString("ssid", "no");
		Storage.userId = Storage.reader.getInt("user_id", 0);
	}

	/**
	 * 登录后进行数据更新
	 */
	public static void update() {
		Storage.ssid = Storage.reader.getString("ssid", "no");
		Storage.userId = Storage.reader.getInt("user_id", 0);
	}

	/**
	 * 退出后清理数据
	 */
	public static void clear() {
		Storage.writer.clear().commit();
		Storage.userId = 0;
		Storage.ssid = "no";
	}

}
