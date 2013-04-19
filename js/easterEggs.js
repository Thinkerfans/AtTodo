/**
 * 彩蛋
 */

function water(action) {
    //提醒喝水

    if (action == "on") {

        db("water", 1);
        msg("不去洗洗杯子吗？");
    } else if (action == "off") {
        db("water", false);
        msg("好吧！喝多了！容易进脑子里！");
    } else {

        if (db("water")) {
            if (db("water") < 6) {
                db("water", parseInt(db("water")) + 1);
            } else {
                notification = webkitNotifications.createNotification(
                    '/icon.png',
                    '该喝水了',
                    "为了身体健康，多多喝水吧！"
                );
                notification.show();
            
                db("water", 1);
            }
        }
    }


}