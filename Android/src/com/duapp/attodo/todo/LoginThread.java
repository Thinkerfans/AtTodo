package com.duapp.attodo.todo;

import org.json.JSONObject;

import android.os.Handler;
import android.os.Message;

public class LoginThread extends Thread {
	/**
	 * 线程通信的Handler
	 */
	protected Handler handler;
	private String email;
	private String password;

	public LoginThread(Handler handler, String email, String password) {
		this.handler = handler;
		this.email = email;
		this.password = password;
	}

	public void run() {

		JSONObject result = Internet.login(this.email, this.password);

		Message message = this.handler.obtainMessage();
		message.obj = result;
		this.handler.sendMessage(message);
	}
}
