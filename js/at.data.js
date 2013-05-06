/**
 * Created with PyCharm.
 * User: 马
 * Date: 13-4-12
 * Time: 下午8:14
 * 处理@后的提示数据根据不同个输入处理
 */

var initData = [
    "下午3点20",
    "明天上午10点10",
    "后天晚上9点35",
    "周三早上8点15"
];

/**
 * 处理数据，引导输入
 */
function AtWhat(query) {
    return AtTime(query);

}

/**
 * 处理@之后是时间的情况
 * @param query
 */
function AtTime(query) {
    //检查输入的是否存在数字123……
    var reg = /[今天,明天,后天,周[一,二,三,四,五,六,七]{1}]?[早上,上午,中午,下午,晚上]{1}[零,一,二,三,四,五,六,七,八,九,十]+点[零,一,二,三,四,五,六,七,八,九,十]*/;
    var data;
    if (false && query && !(/\d/.test(query))) {
        data = initData.map(function (value, i) {
            return value.replace(/\d+/g, function (macth) {
                return numToZh(macth);
            });
        })
    } else if (query) {
        var timesp = ddd(query);
        if (timesp) {
            data = [new Date(timesp * 1000).toLocaleString()];
        } else {
            return false
        }
    } else {
        data = initData;
    }
    var datas = $.map(data, function (value, i) {
        return {'id':i, 'key':value, 'name':value}
    })
    return datas;
}

function ddd(ddd) {
//    ddd = ddd.replace(/\d+/g, function (macth) {
//        return numToZh(macth);
//    });
    var reg = /[今天,明天,后天,周一,周二,周三,周四,周五,周六,周日]?[早上,上午,中午,下午,晚上]?[\d,零,一,二,三,四,五,六,七,八,九,十]+[点,：,:][\d,零,一,二,三,四,五,六,七,八,九,十]*/;
    var noonData = {1:"早上", 2:"上午", 3:"中午", 4:"下午", 5:"晚上"};
    var date = new Date();

    var noonNum = 0;
    var minStr;
    var minesNum;
    if (reg.test(ddd)) {
        //检查是哪一天
        if (search(ddd.substr(0, 2, noonData))) {
            //获取今天凌晨的时间戳
            //加上前面今天
            ddd = ddd + "今天";
            var dayNum = parseInt(date.getTime() / 1000);
        } else {
            var dayNum = getAtDay(ddd.substr(0, 2));
        }

        if (dayNum) {
            noonNum = getAtNoon(ddd.match(/([早上,上午,中午,下午,晚上]+)([\d,零,一,二,三,四,五,六,七,八,九,十]+)[点,:,：]/));
            if (noonNum) {
                minStr = ddd.match(/[早上,上午,中午,下午,晚上]?[\d,零,一,二,三,四,五,六,七,八,九,十]+[点,:,：]{1}([\d,零,一,二,三,四,五,六,七,八,九,十]+)/);

                if (minStr) {
                    if ((/\d+/.test(minStr[1]))) {
                        minesNum = minStr[1];
                    } else {
                        minesNum = ZhToNum(minStr[1]);
                    }

                } else {
                    minesNum = 0
                }
                return parseInt(dayNum) + parseInt(noonNum) + parseInt(minesNum * 60)
            }
        }
    }
    return false;
}