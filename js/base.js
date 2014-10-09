/**
 * Created by 步青 on 14-1-29.
 */
var baseURL = 'http://127.0.0.1:8080';
var LoadURL = baseURL + '/load';//初始化
var LoginURL = baseURL + '/login';//登陆
var AddURL = baseURL + '/add'; //添加
var SortURL = baseURL + '/sort';//排序
var ModifyURL = baseURL + '/modify';//修改
var FinishURL = baseURL + "/finish";//保存完成地址
var UnFinishURL = baseURL + "/unFinish";//解除完成状态地址
var RemoveURL = baseURL + "/remove";//删除地址

/**
 * 获取参数，主要是添加上userId和SSID
 */
function getParameter(parameter) {
    if (!parameter) {
        parameter = {};
    }
    return json2one(parameter, storage().get('user_info'));

}
/**
 合并两个json
 */
function json2one(des, src, override) {
    if (src instanceof Array) {
        for (var i = 0, len = src.length; i < len; i++)
            json2one(des, src[i], override);
    }
    for (var i in src) {
        if (override || !(i in des)) {
            des[i] = src[i];
        }
    }
    return des;
}

/**
 * 本地化存储接口
 * 普通版本
 * Created by 步青 on 13-12-30.
 * @returns {{get: Function, set: Function}}
 * @constructor
 */
function storage() {

    return {
        /**
         * 取得纪录
         * @param  key 需要取回的key，name
         */
        get: function (key) {
            var value = null;
            try {
                value = JSON.parse(localStorage[key]);
            } catch (err) {
                value = localStorage[key];
            }
            return value;
        },
        /**
         * 添加纪录
         * @param  key 需要保存的数据Json格式
         * @param  value 值
         */
        set: function (key, value) {
            if (typeof(value) == "object") {
                value = JSON.stringify(value);
            }
            return localStorage[key] = value;
        }

    }
}

/**
 * 弹出消息
 * @param text
 * @param opt
 * @return {*}
 *
 * opt{
 *     msgType = "error",
 *     id = "showLoginR",
 *     style = {
 *         color = "red",
 *     },
 *     life = 5000,//如果时间为0则表示永久
 * }
 */

function msg(text, opt) {
    text = String(text);
    text = text.trim();
    if (!text) {
        return false;
    }
    //设置消息类型
    var msgType = "";
    if (opt && opt.msgType) {
        if (opt.msgType == "error") {
            msgType = " msg_error";
        } else if (opt.msgType == "load") {
            msgType = " msg_load";
        } else if (opt.msgType == "success") {
            msgType = " msg_success";
        }

    }
    //设置样式style
    style = "";
    if (opt && opt.style && typeof(opt.style) == "object") {
        for (var i in opt.style) {
            style += (i + ":" + opt.style[i] + ";");
        }
    }

    //首先关闭之前的所有消息
    $(".message").hide();
    //添加进去并显示
    //时间戳
    //这个每一个消息的唯一身份认证, 如果不存在就为当前时间戳
    var timestamp = new Date().getTime();
    var msgId = timestamp;
    if (opt && opt.id) {
        msgId = opt.id;
    }

    $("body").append('<div class="message' + msgType + '" id="msg_' + msgId +
        '" style="display:none;' + style + '">' + text +
        '</div>'
    );
    $("#msg_" + msgId).slideDown();

    //设置显示时间
    var life = 5000;
    if (opt) {
        if (opt.life > 0) {
            life = parseInt(opt.life);
        } else {
            life = false;
        }
    }
    //生命时长超过0的时候自动关闭否则永久生效
    if (life > 0) {
        setTimeout(function () {
            //移除结束生命的消息
            closeMsg(msgId);
        }, life);
    }
    //返回值是id可用于关闭消息
    return msgId;
}
/**
 * 手动关闭消息
 * msgId必须和opt[id]一致
 * @param msgId
 */
function closeMsg(msgId) {
    if ($("#msg_" + msgId).length < 1) {
        return false;
    }
    $("#msg_" + msgId).animate({marginLeft: "310px",
        height: $("#msg_" + msgId).height() + "px" }, "fast", function () {
        $("#msg_" + msgId).remove();
        //显示最后一个消息
        if ($(".message").length) {
            $(".message:last").slideDown();
        }
    });
}


/**
 * 更新待办事项统计
 * 数据有手动更新的时候调用
 */
function updateCount() {

    if (storage().get("user_info")) {

        $.post(CountURL, getParameter(), function (json) {
            if (json.status) {
                //显示待办事项数量
                if (json.data.count > 0) {
                    chrome.browserAction.setBadgeText({
                        text: String(json.data.count)
                    });
                    chrome.browserAction.setTitle({
                        title: "有" + String(json.data.count) + "条事项！"
                    });
                } else {
                    chrome.browserAction.setBadgeText({
                        text: ""
                    });
                    chrome.browserAction.setTitle({
                        title: "@Todo是一种态度！"
                    });
                }
            } else {
                msg(json.data);
            }
        });

    } else {
        chrome.browserAction.setBadgeText({
            text: ""
        });
        chrome.browserAction.setTitle({
            title: "@Todo是一种态度！请登录账号！"
        });
    }
}