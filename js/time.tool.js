/**
 * Created with PyCharm.
 * User: 马
 * Date: 13-4-16
 * Time: 下午8:24
 * 时间处理相关的方法
 */

/**
 * 返回@的那一天
 */
function getAtDay(day) {
    var dayData = {today:"今天", tor:"明天", aftertor:"后天", 1:"周一", 2:"周二", 3:"周三", 4:"周四", 5:"周五", 6:"周六", 7:"周日"};

    var atDay = search(day, dayData);
    var nowDate = new Date();
    var date = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate());
    //获取今天凌晨的时间戳
    var dayNum = parseInt(date.getTime() / 1000);
    //今天周几
    var weekDay = date.getDay();
    if (weekDay == 0) {
        weekDay = 7;
    }
    //如果今天周三而指明了是周二就是下周周二，这是几天后
    var afterNo = 0;
    if (atDay) {
        switch (atDay) {
            case("today"):

                break;
            case("tor"):
                dayNum = dayNum + 86400;
                break;
            case ("aftertor"):
                dayNum = dayNum + 172800;
                break;
            default :
                if (weekDay > atDay) {
                    afterNo = 7 - (weekDay - atDay);
                } else if (weekDay < atDay) {
                    afterNo = weekDay - atDay;
                } else {
                    afterNo = 0;
                }
                dayNum = dayNum + 86400 * afterNo;
                break;
        }
        return dayNum;
    } else {
        return false;
    }
}

/**
 * 返回当天是上午还是下午
 */
function getAtNoon(noon) {

    var hour = false;
    if (/^\d+$/.test(noon[2])) {
        hour = noon[2];
        msg(String(hour));
    } else {
        hour = ZhToNum(noon[2]);
    }


    var noonNum = search(noon[1], ["早上", "上午", "中午", "下午", "晚上"]);
    //当时小雨三点的时候就加上12
    if (noonNum > 2 && hour < 12) {
        hour = parseInt(hour) + 12;
        //当时用中午时间的时候
    } else if (noonNum == 2 && hour < 4) {
        hour = parseInt(hour) + 12;
    }
    return hour * 3600;
}