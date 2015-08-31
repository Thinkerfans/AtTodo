package com.duapp.attodo.todo;

import java.util.ArrayList;
import java.util.HashMap;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.support.v4.view.PagerAdapter;
import android.support.v4.view.PagerTabStrip;
import android.support.v4.view.ViewPager;
import android.util.DisplayMetrics;
import android.util.TypedValue;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.SimpleAdapter;
import android.widget.TextView;
import android.widget.TextView.OnEditorActionListener;
import android.widget.Toast;

import com.mobeta.android.dslv.DragSortListView;

public class MainActivity extends Activity {

	private ArrayList<ArrayList> todoItem;
	private ArrayList<SimpleAdapter> proAdapters;
	private LoadHandler loadHandler;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		setContentView(R.layout.activity_main);
		this.todoItem = new ArrayList<ArrayList>();
		this.proAdapters = new ArrayList<SimpleAdapter>();
		// 获取屏幕宽度
		DisplayMetrics metric = new DisplayMetrics();
		getWindowManager().getDefaultDisplay().getMetrics(metric);
		Storage.screenDip = (int) metric.density;
		Storage.screenWidthPx = metric.widthPixels;
		// 屏幕宽度的full DP值
		Storage.screenWidth = (int) (metric.widthPixels / metric.density);
		// 获取屏幕宽度END

		LoadThread loadThread = new LoadThread(new LoadHandler());
		loadThread.start();

	}

	/**
	 * 生成项目的面板
	 * 
	 * @param i
	 * @param project
	 * @return
	 * @throws JSONException
	 */
	protected LinearLayout projectView(int i, JSONObject project)
			throws JSONException {

		LinearLayout layout = (LinearLayout) LayoutInflater.from(this).inflate(
				R.layout.project_demo, null);
		TextView title = (TextView) layout.findViewWithTag("title");
		EditText input = (EditText) layout.findViewWithTag("input");
		DragSortListView list = (DragSortListView) layout
				.findViewWithTag("list");
		title.setText(project.getString("name"));
		input.setTag(R.string.project, project.getInt("id"));
		input.setTag(R.string.project_index, i);
		input.setOnEditorActionListener(new InputListener(i));

		// 生成动态数组，并且转载数据
		ArrayList<HashMap<String, String>> mylist = new ArrayList<HashMap<String, String>>();

		JSONArray data = project.getJSONArray("todo_list");
		int LengthFilter = data.length();

		for (int j = 0; j < LengthFilter; j++) {// 遍历JSONArray
			// 获取每一个Todo
			JSONObject oj = data.getJSONObject(j);

			// 生成数据源
			HashMap<String, String> map = new HashMap<String, String>();
			map.put("content", oj.getString("content"));
			map.put("id", oj.getString("id"));
			map.put("sort", oj.getString("sort"));
			map.put("sort_s", oj.getString("sort_s"));
			map.put("finish", oj.getString("finish"));
			mylist.add(map);

		}

		this.todoItem.add(mylist);
		// 生成适配器，数组===》ListItem
		SimpleAdapter mSchedule = new SimpleAdapter(this, // 没什么解释
				this.todoItem.get(i),// 数据来源
				R.layout.todo_item,// ListItem的XML实现
				// 动态数组与ListItem对应的子项
				new String[] { "content", "id", "sort", "sort_s", "finish" },

				// ListItem的XML文件里面的TextView ID
				new int[] { R.id.content, R.id.id, R.id.sort, R.id.sort_s,
						R.id.finish });
		this.proAdapters.add(mSchedule);
		list.setDropListener(new OnDrop(i));
		list.setRemoveListener(new OnRemove(i));
		// lv.setRemoveListener(onRemove);
		// 添加并且显示
		list.setAdapter(mSchedule);

		return layout;
	}

	/**
	 * 拖动
	 * 
	 * @author 马
	 * 
	 */
	class OnDrop implements DragSortListView.DropListener {

		public int index;

		public OnDrop(int index) {
			this.index = index;
		}

		@Override
		public void drop(int from, int to) {

			HashMap<String, String> item = (HashMap<String, String>) MainActivity.this.todoItem
					.get(this.index).get(from);
			// MainActivity.this.todoItem.get(this.index).remove(from);

			int id = 0;
			int sort = 0;
			int sort_s = 1000;
			HashMap<String, String> item_temp;
			if (to > from) {
				for (int i = from; i < to; i++) {
					item_temp = (HashMap<String, String>) MainActivity.this.todoItem
							.get(this.index).get(i + 1);
					MainActivity.this.todoItem.get(this.index)
							.set(i, item_temp);

				}
				// 获取sort值
				HashMap<String, String> toItem = (HashMap<String, String>) MainActivity.this.todoItem
						.get(this.index).get(to);
				sort = Integer.parseInt(toItem.get("sort")) - 1;
				if (to < MainActivity.this.todoItem.get(this.index).size() - 1) {
					HashMap<String, String> toNextItem = (HashMap<String, String>) MainActivity.this.todoItem
							.get(this.index).get(to + 1);

					if (Integer.parseInt(toNextItem.get("sort")) <= sort) {
						sort_s = Integer.parseInt(toItem.get("sort_s")) + 1;
					}
				}

			} else {
				for (int i = from; i > to; i--) {

					item_temp = (HashMap<String, String>) MainActivity.this.todoItem
							.get(this.index).get(i - 1);
					MainActivity.this.todoItem.get(this.index)
							.set(i, item_temp);

				}
				// 获取sort值
				HashMap<String, String> toItem = (HashMap<String, String>) MainActivity.this.todoItem
						.get(this.index).get(to);
				sort = Integer.parseInt(toItem.get("sort")) + 1;
				if (to > 0) {
					HashMap<String, String> toPrevItem = (HashMap<String, String>) MainActivity.this.todoItem
							.get(this.index).get(to - 1);
					if (Integer.parseInt(toPrevItem.get("sort")) >= sort) {
						sort_s = Integer.parseInt(toPrevItem.get("sort_s")) - 1;
					}
				}

			}

			item.remove("sort");
			item.remove("sort_s");
			item.put("sort", Integer.toString(sort));
			item.put("sort_s", Integer.toString(sort_s));
			MainActivity.this.todoItem.get(this.index).set(to, item);

			id = Integer.parseInt(item.get("id"));

			DropThread dropThread = new DropThread(new CommonHandler(), id,
					sort, sort_s);
			dropThread.start();
			MainActivity.this.proAdapters.get(this.index)
					.notifyDataSetChanged();

		}

	}

	/**
	 * 删除一个Todo
	 * 
	 * @author 马
	 * 
	 */
	class OnRemove implements DragSortListView.RemoveListener {

		public int index;

		public OnRemove(int index) {
			this.index = index;
		}

		@Override
		public void remove(int which) {
			HashMap<String, String> item = (HashMap<String, String>) MainActivity.this.todoItem
					.get(this.index).get(which);
			MainActivity.this.todoItem.get(this.index).remove(which);
			MainActivity.this.proAdapters.get(this.index)
					.notifyDataSetChanged();

			int id = Integer.parseInt(item.get("id"));

			RemoveThread removeThread = new RemoveThread(new CommonHandler(),
					id);
			removeThread.start();

		}
	}

	class InputListener implements OnEditorActionListener {

		int index;

		public InputListener(int index) {
			this.index = index;
		}

		@Override
		public boolean onEditorAction(TextView input, int key, KeyEvent event) {

			String content = input.getText().toString();
			input.setText("");
			HashMap<String, String> map = new HashMap<String, String>();
			map.put("content", content);

			map.put("finish", Integer.toString(0));
			MainActivity.this.todoItem.get(this.index).add(0, map);
			MainActivity.this.proAdapters.get(this.index)
					.notifyDataSetChanged();
			int id = Integer
					.parseInt(input.getTag(R.string.project).toString());
			int index = Integer.parseInt(input.getTag(R.string.project_index)
					.toString());
			AddThread addThread = new AddThread(new AddHandler(), content, id,
					index);
			addThread.start();
			return false;
		}

	}

	/**
	 * 处理初始化线程
	 * 
	 * @author 马
	 * 
	 */
	class LoadHandler extends Handler {

		@Override
		public void handleMessage(Message msg) {

			JSONObject result = (JSONObject) msg.obj;
			try {
				boolean status = result.getBoolean("status");
				if (status) {
					// 每个页面的Title数据
					final ArrayList<View> views = new ArrayList<View>();

					final ArrayList<String> titles = new ArrayList<String>();

					JSONArray data = result.getJSONArray("data");
					int LengthFilter = data.length();
					for (int i = 0; i < LengthFilter; i++) {// 遍历JSONArray
						// 获取每一个project

						JSONObject oj = data.getJSONObject(i);
						// 解析并声称每一个project面板
						LinearLayout proView = MainActivity.this.projectView(i,
								oj);
						views.add(proView);
						TextView titleView = (TextView) proView
								.findViewWithTag("title");
						titles.add(titleView.getText().toString());

					}

					// 填充ViewPager的数据适配器
					PagerAdapter mPagerAdapter = new PagerAdapter() {

						@Override
						public boolean isViewFromObject(View arg0, Object arg1) {
							return arg0 == arg1;
						}

						@Override
						public int getCount() {
							return views.size();
						}

						@Override
						public void destroyItem(View container, int position,
								Object object) {
							((ViewPager) container).removeView(views
									.get(position));
						}

						@Override
						public CharSequence getPageTitle(int position) {
							return titles.get(position);
						}

						@Override
						public Object instantiateItem(View container,
								int position) {
							((ViewPager) container)
									.addView(views.get(position));
							return views.get(position);
						}
					};

					PagerTabStrip pagetab = (PagerTabStrip) findViewById(R.id.pager_tab);
					pagetab.setTabIndicatorColor(Color.WHITE); // title下横线颜色值。
					pagetab.setBackgroundColor(Color.WHITE); // 背景
					// pagetab.setTextSpacing(pagetab.getTextSpacing());//设置间距
					pagetab.setTextColor(Color.BLACK);
					pagetab.setTextSize(TypedValue.COMPLEX_UNIT_SP, 26);// 设置字体大小。

					ViewPager mViewPager = (ViewPager) findViewById(R.id.viewpager);
					mViewPager.setAdapter(mPagerAdapter);
					MainActivity.this.findViewById(R.id.loading).setVisibility(
							View.GONE);
					mViewPager.setVisibility(View.VISIBLE);

				} else {
					Toast.makeText(MainActivity.this, result.getString("data"),
							Toast.LENGTH_SHORT).show();

				}
			} catch (JSONException e) {

				Toast.makeText(MainActivity.this, "服务器数据格式错误",
						Toast.LENGTH_SHORT).show();
				e.printStackTrace();
			}
		}
	}

	/**
	 * 通用的网络线程消息Handler
	 * 
	 * @author 马
	 * 
	 */
	class CommonHandler extends Handler {
		@Override
		public void handleMessage(Message msg) {
			JSONObject result = (JSONObject) msg.obj;
			try {
				boolean status = result.getBoolean("status");
				if (status) {
					Toast.makeText(MainActivity.this, result.getString("data"),
							Toast.LENGTH_SHORT).show();
				} else {
					Toast.makeText(MainActivity.this, result.getString("data"),
							Toast.LENGTH_SHORT).show();

				}
			} catch (JSONException e) {

				Toast.makeText(MainActivity.this, "服务器数据格式错误",
						Toast.LENGTH_SHORT).show();
				e.printStackTrace();
			}
		}

	}

	class AddHandler extends Handler {
		@Override
		public void handleMessage(Message msg) {
			JSONObject result = (JSONObject) msg.obj;
			try {
				boolean status = result.getBoolean("status");
				if (status) {
					int projectIndex = result.getInt("projectIndex");
					int index = result.getInt("index");
					int id = result.getInt("data");
					HashMap<String, String> item = (HashMap<String, String>) MainActivity.this.todoItem
							.get(projectIndex).get(index);

					item.put("id", result.getString("data"));
					MainActivity.this.todoItem.get(projectIndex).set(index,
							item);

					MainActivity.this.proAdapters.get(projectIndex)
							.notifyDataSetChanged();
					// item.put("sort", result.getString("sort"));
					// item.put("sort_s", result.getString("sort_s"));

				} else {
					Toast.makeText(MainActivity.this, result.getString("data"),
							Toast.LENGTH_SHORT).show();

				}
			} catch (JSONException e) {

				Toast.makeText(MainActivity.this, "服务器数据格式错误",
						Toast.LENGTH_SHORT).show();
				e.printStackTrace();
			}
		}

	}

	/**
	 * 菜单
	 */
	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		menu.add(Menu.NONE, Menu.FIRST, 0, "退出登录");
		return true;
	}

	// 菜单项被选择事件
	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		switch (item.getItemId()) {
		default:
			// 清理数据
			Storage.clear();
			Intent intent = new Intent();
			intent.setClass(MainActivity.this, LoginActivity.class);
			startActivity(intent);
			MainActivity.this.finish();

		}
		return false;

	}
}
