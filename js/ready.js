/**
 * Created by 步青 on 14-1-29.
 */
function new_task() {
    if (event.keyCode == 13 && $(this).val().trim()) {
        var content = $(this).val().trim();
        var project_id = $(this).attr('project-id');
        var timestamp = new Date().getTime();
        $("#main [project-id=" + project_id + "] ul").prepend($.render($('[type="html/task"]').html(),
            {content: content, "new": "new=\"" + timestamp + "\"" + "style=\"display:none\""}));
        $("[new=" + timestamp + "]").slideDown("normal");
        $(this).val("");
        // 发送到服务器保存
        $.post(AddURL, getParameter({content: content, project_id: project_id}), function (json) {
            if (json.status) {
                $("[new=" + timestamp + "]").attr("id", "todo_" + json.data);
                $("[new=" + timestamp + "]").attr("data-id", json.data);
                //此处移除new属性
                $("[new=" + timestamp + "]").removeAttr("new");
                //更新图标的统计
            } else {
                msg(json.data);
            }
        }, 'json');
    }
}
/**
 * 点击导航的时候切换项目
 * @returns {boolean}
 */
function nav_switch() {
    //如果有active元素说明有正在执行的动作，就返回false
    if ($(".active").length) {
        return false;
    }
    var prev_project_id = $(this).prev('.nav_item').attr('project-id');
    var i = 0;
    while (i < 10) {
        if (prev_project_id == $(".nav_item:eq(" + i + ")").attr('project-id')) {
            break;
        }
        //导航按钮 Start
        $(".nav_item:first").clone().appendTo("#nav");
        $(".nav_item:first").remove();
        //导航按钮 END
        //项目面板 Start
        $(".project:first").clone().appendTo("#main");
        $(".project:first").remove();
        //项目面板 END
    }
    $(".nav_item:first").clone().appendTo("#nav");

    var this_item = $(this);
    this_item.addClass('active');//先变换自己的大小和颜色
    $(".nav_item:first").animate({width: -1, marginRight: -1, height: $(".nav_item:first").height()}, 600, 'easeOutExpo', function () {
        $(".nav_item:first").remove();
        this_item.removeClass('active');//先变换自己的大小和颜色
    });
    $(".project:first").clone().appendTo("#main");
    $(".project:first").animate({marginLeft: -$(".project:first").width() - 8}, 600, 'easeOutExpo', function () {
        $(".project:first").remove();
    });
}
/**
 * 编辑任务
 */
function task_modify() {
    //进入编辑状态
    if (this.contentEditable != 'true') {
        this.contentEditable = true;
        $(this).addClass('edit');
        return false;
    }
    //保存编辑
    if (event.keyCode == 13 && $(this).html().trim()) {
        var content = $(this).html().trim();
        var task_id = $(this).attr("data-id");

        $.post(ModifyURL, getParameter({content: content, task_id: task_id}), function (json) {
            if (json.status) {
                ;
            } else {
                msg(json.data);
            }
        }, 'json');
        this.contentEditable = false;
        $(this).removeClass('edit');
        return false;
    }
}
/**
 * 完成操作
 */
function finish() {
    $(this).addClass("finish");

    var task_id = $(this).attr("data-id");
    //没有id就不操作
    if (task_id) {
        $.post(FinishURL, getParameter({task_id: task_id}), function (json) {
            if (json.status) {
                //更新图标的统计
                //updateCount();
            } else {
                msg(json.data);
            }
        }, 'json');
    }
    return false;
}

/**
 * 解除完成状态
 */
function unFinish() {
    $(this).removeClass("finish");

    var task_id = $(this).attr("data-id");
    //没有id就不操作
    if (task_id) {
        $.post(UnFinishURL, getParameter({task_id: task_id}), function (json) {
            if (json.status) {
                //更新图标的统计
                //updateCount();
            } else {
                msg(json.data);
            }
        });
    }
}
/**
 * 移除操作
 */
function remove() {
    $(this).animate({marginLeft: $("body").width(), height: "0", padding: "0 10px"}, "fast", function () {
        $(this).remove();
    });

    var task_id = $(this).attr("data-id");
    //没有id就不操作
    if (task_id) {
        $.post(RemoveURL, getParameter({task_id: task_id}), function (json) {
            if (json.status) {
                //updateCount();
            } else {
                msg(json.data);
            }
        });
    }
    return false;
}
/**
 * 手动排序处理
 * @param event
 * @param ui
 */
function todoSort(event, ui) {
    var task_id = ui.item.attr("data-id");
    var next_sort;
    var next_sort_s;
    var prev_sort;
    var prev_sort_s;
    var drop_sort;
    var drop_sort_s = false;
    if (ui.item.next().length && ui.item.prev().length) {
        next_sort = ui.item.next().attr("data-sort");
        prev_sort = ui.item.prev().attr("data-sort");
        prev_sort_s = ui.item.prev().attr("data-sort-s");
        //下一个的sort+1
        drop_sort = parseInt(next_sort) + 1;
        if (drop_sort > prev_sort) {
            drop_sort = prev_sort;
        }
        if (drop_sort == prev_sort) {
            drop_sort_s = prev_sort_s - 1;
        }

    } else if (ui.item.next().length && !ui.item.prev().length) {
        //是第一个的时候
        next_sort = ui.item.next().attr("data-sort");
        next_sort_s = ui.item.next().attr("data-sort-s");
        drop_sort = parseInt(next_sort) + 1;
    } else if (ui.item.prev().length && !ui.item.next().length) {
        //是最后一个的时候
        prev_sort = ui.item.prev().attr("data-sort");
        prev_sort_s = ui.item.prev().attr("data-sort-s");
        drop_sort = parseInt(prev_sort) - 1;
    }
    //把最新的sort更新
    ui.item.attr("data-sort", drop_sort);
    ui.item.attr("data-sort-s", drop_sort_s);
    if (drop_sort > -1) {
        $.post(SortURL, getParameter({task_id: task_id, drop_sort: drop_sort, drop_sort_s: drop_sort_s}),
            function (json) {
                if (json.status) {
                    ;
                } else {
                    msg(json.data);
                }
            });
    }
}