package com.duapp.attodo.todo;

import org.json.JSONObject;

import android.os.Handler;
import android.os.Message;

public class LoadThread extends Thread {

	/**
	 * 线程通信的Handler
	 */
	protected Handler handler;

	public LoadThread(Handler handler) {
		this.handler = handler;
	}

	public void run() {
		JSONObject result = Internet.load();

		Message message = this.handler.obtainMessage();
		message.obj = result;
		this.handler.sendMessage(message);
	}
}
