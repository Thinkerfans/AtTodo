package com.duapp.attodo.todo;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.json.JSONException;
import org.json.JSONObject;

import android.R.integer;

/**
 * 链接网络操作
 * 
 * @author 马
 * 
 */
public class Internet {

	public static String siteURL = "http://attodo.duapp.com";// 定义网站的根URL
	public static String login = Internet.siteURL + "/login";// 登陆地址
	public static String load = Internet.siteURL + "/load";// 初始化数据地址
	public static String add = Internet.siteURL + "/add";// 增加新todo的帖子
	public static String sort = Internet.siteURL + "/sort";// 增加新todo的帖子
	public static String modify = Internet.siteURL + "/modify";// 保存修改地址
	public static String finish = Internet.siteURL + "/finish";// 保存完成地址
	public static String unfinish = Internet.siteURL + "/unFinish";// 解除完成状态地址
	public static String remove = Internet.siteURL + "/remove";// 删除地址
	public static String count = Internet.siteURL + "/count";// 获取统计地址
	public static String tenM = Internet.siteURL + "/tenM";// 没10分钟从数服务更新数据地址
	public static String msg = Internet.siteURL + "/msg";// 从服务器获取消息或者公告地址
	public static String addProject = Internet.siteURL + "/addProject";// 给项目排序的地址
	public static String deleteProject = Internet.siteURL + "/deleteProject";// 删除项目地址
	public static String projectSort = Internet.siteURL + "/projectSort";// 给项目排序的地址
	public static String modifyProject = Internet.siteURL + "/modifyProject";// 给项目排序的地址

	/**
	 * 登录
	 * 
	 * @param email
	 * @param password
	 * @return
	 */
	public static JSONObject login(String email, String password) {

		List<NameValuePair> params = new ArrayList<NameValuePair>();
		params.add(new BasicNameValuePair("email", email));
		params.add(new BasicNameValuePair("psw", password));
		JSONObject result = Internet.connection(Internet.login, params);
		return result;
	}

	/**
	 * 初始化数据
	 * 
	 * @return
	 */
	public static JSONObject load() {
		JSONObject result = Internet.connection(Internet.load,
				new ArrayList<NameValuePair>());
		return result;
	}

	/**
	 * 拖动排序
	 * 
	 * @param id
	 * @param sort
	 * @param sort_s
	 * @return
	 */
	public static JSONObject drop(int id, int sort, int sort_s) {
		List<NameValuePair> params = new ArrayList<NameValuePair>();
		params.add(new BasicNameValuePair("drop_id", Integer.toString(id)));
		params.add(new BasicNameValuePair("drop_sort", Integer.toString(sort)));
		params.add(new BasicNameValuePair("drop_sort_s", Integer
				.toString(sort_s)));
		JSONObject result = Internet.connection(Internet.sort, params);
		return result;
	}

	/**
	 * 添加一个
	 * 
	 * @param content
	 * @param id
	 * @return
	 */
	public static JSONObject add(String content, int id) {
		List<NameValuePair> params = new ArrayList<NameValuePair>();
		params.add(new BasicNameValuePair("project_id", Integer.toString(id)));
		params.add(new BasicNameValuePair("content", content));
		JSONObject result = Internet.connection(Internet.add, params);
		return result;
	}

	/**
	 * 删除一个
	 * 
	 * @param id
	 * @return
	 */
	public static JSONObject remove(int id) {
		List<NameValuePair> params = new ArrayList<NameValuePair>();
		params.add(new BasicNameValuePair("todo_id", Integer.toString(id)));
		JSONObject result = Internet.connection(Internet.remove, params);
		return result;
	}

	/**
	 * 链接服务器
	 * 
	 * @param url
	 * @param params
	 * @return
	 */
	public static JSONObject connection(String url, List<NameValuePair> params) {
		// 补充数据获取ssid和userid 登录的时候ssid为no，userid为0，不会造成任何影响
		params.add(new BasicNameValuePair("ssid", Storage.ssid));
		params.add(new BasicNameValuePair("user_id", Integer
				.toString(Storage.userId)));

		HttpPost http = new HttpPost(url);
		try {
			http.setEntity(new UrlEncodedFormEntity(params, HTTP.UTF_8));
			HttpResponse httpResponse = new DefaultHttpClient().execute(http);

			// 若状态码为200 ok
			if (httpResponse.getStatusLine().getStatusCode() == 200) {
				// 取出回应字串
				String strResult = EntityUtils.toString(httpResponse
						.getEntity());
				JSONObject result = new JSONObject(strResult);
				return result;
			} else {
				// 返回一个包含错误信息的JSON对象
				JSONObject jsonObject = new JSONObject();
				jsonObject.put("status", false);
				jsonObject.put("data", "Error Response"
						+ httpResponse.getStatusLine().toString());
				return jsonObject;
			}
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ClientProtocolException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {

		}
		return null;

	}
}
