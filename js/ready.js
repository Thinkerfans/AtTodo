/**
 * 开始监听事件
 */
$(document).ready(function () {

    if (db("user_id") && db("ssid")) {

        //是否开启了本地密码
        if (db("localpassword") && db("lock")) {
            //清除本地锁
            $("#login_p").hide();
            $("#localpassword_p").show();
            $("#localpassword").keyup(function () {
                if (event.keyCode == 13 && $(this).val().trim()) {
                    if ($("#localpassword").val() == db("localpassword")) {
                        $("#localpassword_p").hide();
						db("lock", false);
                        loading();
                    } else {
                        msg("呵呵！今天气不错！");
                    }
                }
            });
        } else {
            loading();
        }
    }
    //显示注册的用户名

    $("#login_p [name=reg]").change(function () {
        $("#login_p #username").slideToggle("fast");
    });
    //检查登陆按钮
    $("#do_login").click(function () {
        do_login();
    });
    //在这每条todo上屏蔽右键菜单，执行下一步操作
    $("body").on("contextmenu", "#main_p ul li", function (e) {

        var li_class = $(this).attr("class");
        if (!li_class) {
            //todo完成操作
            finish(this);
        } else if (li_class == "finish") {
            //删除操作
            remove(this);
        } else {
            return true;
        }
        return false;
    });
    //监听完成的todo双击事件
    $("body").on("dblclick", "#main_p ul li.finish", function (e) {
        //由完成状态切换成为完成状态，即返回
        unFinish(this);
    });
    //监听双击事件
    $("body").on("dblclick", "#main_p ul li[class!=finish]", function () {
        //首先保存前一个编辑内容>>>虽然不会出现这种情况
        if ($("#main_p ul li.edit").length) {
            saveModify($("#main_p ul li.edit"));
        }

        //进入编辑状态
        var li_class = $(this).attr("class");
        if (!li_class) {
            $(this).addClass("edit");
            $(this).attr("contenteditable", true);
            $(this).attr("draggable", false);
            $(this).focus();
        }
    });
    //监听编辑状态的失去焦点保存
    $("body").on("blur", "#main_p ul li.edit", function () {
        //保存新内容，回复状态
        saveModify(this);
    });
    //编辑状态时监听enter按键
    $("body").on("keydown", "#main_p ul li.edit", function () {
        //保存新内容，回复状态
        if (event.keyCode == 13) {
            saveModify(this);
            return false;
        }
    });

//监听enter键
    $("#add").keyup(function () {
        if (event.keyCode == 13 && $(this).val().trim()) {
            var input = $(this).val();
            if (input.toLocaleLowerCase() == "logout" || input == "退出") {
                //退出功能
                $("#main_p").hide();
                $("#main_p ul li").remove();
                $("#login_p").slideDown();
                localStorage.clear();
                updateCount();
                //开启喝水提醒
            } else if (input == "喝水" || input.toLocaleLowerCase() == "water") {
                water("on");
                //取消喝水提醒
            } else if (input == "不喝水了" || input.toLocaleLowerCase() == "nodrink") {
                water("off");
                //设置本地密码
            } else if (input.toLocaleLowerCase().indexOf("localpassword:") == 0 &&
                input.toLocaleLowerCase().length > 15) {
                //@todo 字符串加密
                db("localpassword", input.toLocaleLowerCase().substr(14));
                msg("设置成功！");
                //取消本地密码
            } else if (input.toLocaleLowerCase() == "unsetlocalpassword" || input == "取消本地密码") {
                db("localpassword", false);
                msg("已取消！");
                //修改密码
            } else if (input.toLocaleLowerCase().indexOf("setpassword:") == 0) {

                if (input.toLocaleLowerCase().length > 15) {
                    setPassword(input.toLocaleLowerCase().substr(14));
                } else {
                    msg("密码太短了");
                }

            } else if (input.toLocaleLowerCase() == "lock" || input == "L") {
                //开启本地锁
                db("lock", 1);
            } else if (input == "惠敏") {
                msg("我想你……");
            } else if (input == "吴世博") {
                msg("↑↑↓↓←→←→AB");
            } else if (input == "@彩蛋") {
                msg("祝你们早日生米煮成熟饭！哈哈哈！");
            } else {
                saveAdd(this);
            }
            //每次操作都清空输入框
            $(this).val("");
            $(this).focus();
        }
    });
    //实现拖动特效
    $("#main_p ul").sortable({ opacity:0.5, axis:"y", cancel:"li.edit",
        update:todoSort
    });
});
