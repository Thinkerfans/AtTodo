/**
 * Created with PyCharm.
 * User: 马
 * Date: 13-4-6
 * Time: 下午7:23
 * 后台运行js
 */

var fatherId = chrome.contextMenus.create(
    {"title":"添加到@todo", "contexts":["all"], "onclick":contextMenusAdd});
/*监听右键菜单*/


function contextMenusAdd(info, tab) {

    if (info.selectionText) {
        //此处直接发送到服务器
        $.post(AddURL, getParameter({content:info.selectionText}), function (json) {
            if (json.status) {
                ;
            }
        });
        updateCount();
    }
}

/**
 *
 * 限制上微博
 */

function checkForValidUrl(tabId, changeInfo, tab) {
    var site_no = [
        "weibo.com",
        "t.qq.com",
        "qzone.qq.com",
        "pengyou.com"
    ];
	var date = new Date();
	
    var __NO = false;
    for (var i in site_no) {
		if(date.getDay()>5||date.getDay()<1){
			break;
		}
        if (tab.url.indexOf(site_no[i]) > -1) {
            __NO = true;
            break;
        }
    }
    if (__NO) {
        
        //9点到12点，下雨一点到晚上10点禁止上
        if ((date.getHours() > 8 && date.getHours() < 12) || (date.getHours() > 13 && date.getHours() < 17)) {
            chrome.tabs.update(tabId, {url:"http://127.0.0.1"});
        }
    }
};

chrome.tabs.onUpdated.addListener(checkForValidUrl);

/**
 * 每10分钟从服务器获取下新数据
 */
function tenM() {
    if (!(localStorage.user_id && localStorage.ssid)) {
        chrome.browserAction.setBadgeText({
            text:""
        });
        chrome.browserAction.setTitle({
            title:"@Todo是一种态度！"
        });
        return false;
    }
    $.post(TenMURL, getParameter(), function (json) {
        if (json.status) {
            //消息提醒
            if (json.data["remind"].length > 0) {
                for (var i  in json.data["remind"]) {
                    notification = webkitNotifications.createNotification(
                        '/icon.png',
                        '您有Todo',
                        json.data["remind"][i]["content"]
                    );
                    notification.show();
                }
            }
            //显示待办事项数量
            if (json.data.count > 0) {
                chrome.browserAction.setBadgeText({
                    text:String(json.data.count)
                });
                chrome.browserAction.setTitle({
                    title:"有" + String(json.data.count) + "条事项！"
                });
            } else {
                chrome.browserAction.setBadgeText({
                    text:""
                });
                chrome.browserAction.setTitle({
                    title:"@Todo是一种态度！"
                });
            }
        }
    });
}
tenM();
setInterval(function () {
    tenM();
    //调用喝水彩蛋
    water();
}, 600000);
