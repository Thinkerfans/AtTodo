/**
 * Created with PyCharm.
 * User: 马
 * Date: 13-4-13
 * Time: 下午1:16
 * 一些用到的工具函数
 */


/**
 * 返回中文的周几,参数是香偏转几天
 */
function getWeekDay(days) {
    if (!days) {
        days = 0;
    }
    var date = new Date();
    var weekDay = date.getDay();
    var weekDay = parseInt(weekDay) + days;
    if (weekDay > 6) {
        if (weekDay > 7) {
            weekDay = weekDay % 7;
        } else {
            weekDay = 7 - weekDay;
            //其实就是7-7
        }
    }
    switch (weekDay) {
        case 0:
            weekDay = "周日";
            break;
        case 1:
            weekDay = "周一";
            break;
        case 2:
            weekDay = "周二";
            break;
        case 3:
            weekDay = "周三";
            break;
        case 4:
            weekDay = "周四";
            break;
        case 5:
            weekDay = "周五";
            break;
        case 6:
            weekDay = "周六";
            break;
    }
    return weekDay;
}

/**
 * 获取月份的第几天
 * @param days
 * @return {Number}
 */
function getMonthDay(days) {
    if (!days) {
        days = 0;
    }
    var date = new Date();
    //开始获取本月最后一天
    var monthNextFirstDay = new Date(date.getYear(), date.getMonth() + 1, 1);
    var monthLastDay = new Date(monthNextFirstDay - 86400000);
    var lastDay = monthLastDay.getDate();
    //本月最后一天获取结束
    var monthDay = date.getDate();
    var monthDay = parseInt(monthDay) + days;
    if (monthDay > lastDay) {
        //简单处理，所以如果偏移量过大会引起错误的值
        monthDay = monthDay - lastDay;
    }
    return monthDay;
}

/**
 * 搜索是否存在items中返回key
 * @param val
 * @param items
 * @return {*}
 */
function search(val, items) {
    for (var i in items) {
        if (items[i] == val) {
            return i;
        } else {
            continue;
        }
    }
    return false;
}

/**
 * 检查是否存在于数组中
 * @param val
 * @param items
 * @return {Boolean}
 */
function inArray(val, items) {
    for (var i in items) {
        if (items[i] == "val") {
            return true;
        } else {
            continue;
        }
    }
    return false;
}

/**
 * 把数字转换成中文数字23=>二十三
 */
function numToZh(value) {
    var numZh = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    if (value > 9) {
        var shiwei = parseInt(value / 10);
        if (shiwei < 2) {
            shiwei = 0;
        }
        return numZh[shiwei] + "十" + numZh[value % 10];
    }
    return numZh[value];
    return value;

}

/**
 * 把中文数字转换成阿拉伯数字123
 * @param value
 * @constructor
 */
function ZhToNum(value) {
    var numData = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
    if (value.length == 2) {
        if (/^十/.test(value)) {
            return "1" + search(value.substr(1, 1), numData);

        } else {
            return search(value.substr(0, 1), numData) + "0";
        }
    } else if (value.length == 1) {
        return search(value, numData);
    } else {
        return  search(value.substr(0, 1), numData) + search(value.substr(2, 1), numData);
    }
}