package com.duapp.attodo.todo;

import org.json.JSONException;
import org.json.JSONObject;

import android.os.Handler;
import android.os.Message;

public class AddThread extends Thread{
	/**
	 * 线程通信的Handler
	 */
	protected Handler handler;
	protected int projectId;
	protected int projectIndex;
	protected String content;
	/**
	 * 用来记录是第几个添加的
	 */
	public static int newTodoIndex = 0;

	public AddThread(Handler handler, String content, int id, int projectIndex) {
		this.handler = handler;
		this.projectId = id;
		this.projectIndex = projectIndex;
		this.content = content;
	}

	public void run() {
		AddThread.newTodoIndex++;
		JSONObject result = Internet.add(this.content, this.projectId);
		Message message = this.handler.obtainMessage();
		try {
			result.put("index", AddThread.newTodoIndex - 1);
			result.put("projectIndex", this.projectIndex);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		message.obj = result;
		this.handler.sendMessage(message);

	}
}
