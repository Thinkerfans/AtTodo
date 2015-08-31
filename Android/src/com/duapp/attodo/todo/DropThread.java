package com.duapp.attodo.todo;

import org.json.JSONObject;

import android.os.Handler;
import android.os.Message;

public class DropThread extends Thread {
	/**
	 * 线程通信的Handler
	 */
	protected Handler handler;
	protected int id;
	protected int sort;
	protected int sort_s;

	public DropThread(Handler handler, int id, int sort, int sort_s) {
		this.handler = handler;
		this.id = id;
		this.sort = sort;
		this.sort_s = sort_s;
	}

	public void run() {
		JSONObject result = Internet.drop(id, sort, sort_s);
		//不显示消息
//		Message message = this.handler.obtainMessage();
//		message.obj = result;
//		this.handler.sendMessage(message);

	}
}
