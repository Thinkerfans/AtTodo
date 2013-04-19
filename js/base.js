//定义一些基本的数据，工具函数

var SITE = "http://127.0.0.1:8080";//定义网站的根URL
var LoginURL = SITE + "/login";//登陆地址
var LoadURL = SITE + "/load";//初始化数据地址
var AddURL = SITE + "/add";//增加新todo的帖子
var SortURL = SITE + "/sort";//增加新todo的帖子
var ModifyURL = SITE + "/modify";//保存修改地址
var FinishURL = SITE + "/finish";//保存完成地址
var UnFinishURL = SITE + "/unFinish";//解除完成状态地址
var RemoveURL = SITE + "/remove";//删除地址
var CountURL = SITE + "/count";//获取统计地址
var TenMURL = SITE + "/tenM";//没10分钟从数服务更新数据地址
var MsgURL = SITE + "/msg";//从服务器获取消息或者公告地址


/**
 * 获取参数，主要是添加上userId和SSID
 */
function getParameter(parameter) {
    if (!parameter) {
        parameter = {};
    }
    return json2one(parameter, {ssid:localStorage.ssid, user_id:localStorage.user_id});

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
 * 本地存储数据接口
 */
function db(key, value) {
    if (value == undefined) {
        try {
            value = JSON.parse(localStorage[key]);
        } catch (err) {
            value = localStorage[key];
        }
        return value;
    } else if (value == false) {
        localStorage.removeItem(key);
    } else {
        if (typeof(value) == "object") {
            value = JSON.stringify(value);
        }
        return localStorage[key] = value;
    }
}

/**
 * 解析模版
 */
function tpl(temp, data) {

    //赋值变量
    var html = temp.replace(/\{\{(\w+)\}\}/g, function (xxx, key) {
        if (!data[key]) {
            return "";
        }
        return data[key];
    });
    return html;
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
    $("#msg_" + msgId).animate({marginLeft:"310px",
        height:$("#msg_" + msgId).height() + "px" }, "fast", function () {
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

    if (db("user_id") && db("ssid")) {

        $.post(CountURL, getParameter(), function (json) {
            if (json.status) {
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
            } else {
                msg(json.data);
            }
        });

    } else {
        chrome.browserAction.setBadgeText({
            text:""
        });
        chrome.browserAction.setTitle({
            title:"@Todo是一种态度！请登录账号！"
        });
    }
}

/**
 * 从服务器获取最新消息以及公告
 */
function getMsg() {
    $.post(MsgURL, getParameter(), function (json) {
        msg(json.data);
    });
}
