package com.duapp.attodo.todo;

import org.json.JSONObject;

import android.os.Handler;

public class RemoveThread extends Thread {
	/**
	 * 线程通信的Handler
	 */
	protected Handler handler;
	protected int id;

	public RemoveThread(Handler handler, int id) {
		this.handler = handler;
		this.id = id;
	}

	public void run() {
		JSONObject result = Internet.remove(this.id);
		// 不显示消息
		// Message message = this.handler.obtainMessage();
		// message.obj = result;
		// this.handler.sendMessage(message);

	}
}
