package com.duapp.attodo.todo;

import org.json.JSONException;
import org.json.JSONObject;


import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.os.StrictMode;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Toast;

public class LoginActivity extends Activity {

	private EditText emailText;
	private EditText passwordText;
	private Button button;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		// 数据和配置的初始化操作
		Storage.init(this.getSharedPreferences("todo", MODE_PRIVATE));

		// Android 3以后主线程不能访问网络了。在这里修改策略
		// if (android.os.Build.VERSION.SDK_INT > 9) {
		// StrictMode.ThreadPolicy policy = new
		// StrictMode.ThreadPolicy.Builder()
		// .permitAll().build();
		// StrictMode.setThreadPolicy(policy);
		// }

		// 判断是否已经登录
		if (!"no".equals(Storage.ssid) || Storage.userId > 0) {
			// 说明已经登录了
			this.changeActivity();
			return;

		}
		
		setContentView(R.layout.activity_login);
		this.emailText = (EditText) findViewById(R.id.email);
		this.passwordText = (EditText) findViewById(R.id.password);
		this.button = (Button) findViewById(R.id.loginbutton);
		this.button.setOnClickListener(new LoginButtonOnClick());
	}

	/**
	 * 切换
	 */
	public void changeActivity() {

		Intent intent = new Intent();
		intent.setClass(LoginActivity.this, MainActivity.class);
		startActivity(intent);
		LoginActivity.this.finish();

	}

	/**
	 * 登陆按钮监听器
	 * 
	 * @author 马
	 * 
	 */
	@SuppressLint("ShowToast")
	class LoginButtonOnClick implements OnClickListener {

		@Override
		public void onClick(View arg0) {
			String email = emailText.getText().toString().trim();

			String password = passwordText.getText().toString().trim();

			if ("".equals(email) || "".equals(password)) {
				Toast.makeText(LoginActivity.this, "Email或密码为空！",
						Toast.LENGTH_SHORT).show();
				return;
			}

			// 显示出来loading
			ProgressBar loading = (ProgressBar) LoginActivity.this
					.findViewById(R.id.loading);
			loading.setVisibility(View.VISIBLE);

			LoginThread loginThread = new LoginThread(new LoginHandler(),
					email, password);
			loginThread.start();

		}

	}

	/**
	 * 处理登录线程
	 * 
	 * @author 马
	 * 
	 */
	class LoginHandler extends Handler {

		@Override
		public void handleMessage(Message msg) {

			JSONObject result = (JSONObject) msg.obj;
			boolean status;
			try {
				status = result.getBoolean("status");
				if (status) {
					// 登录成功
					Toast.makeText(LoginActivity.this, "登录成功！",
							Toast.LENGTH_SHORT).show();
					JSONObject data = result.getJSONObject("data");
					// 写入用户信息
					Storage.writer.putString("ssid", data.getString("ssid"));
					Storage.writer.putString("username",
							data.getString("username"));

					Storage.writer.putInt("user_id", data.getInt("id"));
					Storage.writer.commit();
					Storage.update();
					LoginActivity.this.findViewById(R.id.loading)
							.setVisibility(View.INVISIBLE);
					// 数据保存成功切换 Activity
					LoginActivity.this.changeActivity();

				} else {
					LoginActivity.this.findViewById(R.id.loading)
							.setVisibility(View.INVISIBLE);
					Toast.makeText(LoginActivity.this,
							result.getString("data"), Toast.LENGTH_SHORT)
							.show();
				}
			} catch (JSONException e) {
				Toast.makeText(LoginActivity.this, "服务器数据格式错误",
						Toast.LENGTH_SHORT).show();
				e.printStackTrace();
			}

		}
	}

}
