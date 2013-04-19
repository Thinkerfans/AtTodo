//登陆相关的函数

/**
 * 执行登陆
 */
function do_login() {
    var data = checkLogin();
    if (data) {
        $.post(LoginURL, data, function (json) {
            if (!json.status) {
                msg(json.data);
            } else {
                //登陆成功
                db("user_id", json.data.id);
                db("ssid", json.data.ssid);
                $("#login_p").hide();
                loading();
            }
        });
    }
}
/**
 * 检查登陆数据
 */
function checkLogin() {
    var email = $("#login_p input[name=email]").val();

    if (!email) {
        msg("填写Email！");
        return false
    }
    var psw = $("#login_p input[name=psw]").val();
    if (!psw) {
        msg("输入密码！");
        return false
    }
	var username = $("#login_p input[name=username]:visible").val();
    if (!username && $("#login_p input[name=username]:visible").length) {
        msg("输入昵称吧!");
        return false
    }
    return {email:email, psw:psw,username:username}
}