//初始化数据

/**
 *初始化数据
 */
function loading() {
    $("#login_p").hide();
    $("#loading_p").show();
    var tpl_v = '<li id="todo_{{id}}" data-sort="{{sort}}" data-sort-s="{{sort_s}}" data-id="{{id}}" class="{{finish}}">{{content}}</li>';
    $.post(LoadURL, getParameter(), function (json) {
        if (json.status) {
            for (var i in json.data) {
                //是否完成了
                if (json.data[i]["finish"]) {
                    json.data[i]["finish"] = "finish";
                }
                var tpl_html = tpl(tpl_v, json.data[i]);
                $("#main_p ul").append(tpl_html);
            }
            $("#main_p").slideDown();
            getMsg();
        }
        updateCount();
    });
	//直接移除加载页面，显得速度快
	$("#loading_p").remove();

}