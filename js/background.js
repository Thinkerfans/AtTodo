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
