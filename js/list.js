//列表主体会用到的函数

/**
 * 保存新添加
 * @param obj
 */
function saveAdd(obj) {
    content = $(obj).val().trim();
    var timestamp = new Date().getTime();
    $("#main_p ul").prepend('<li draggable="true" new="' + timestamp + '" style="display:none">' +
        content + '</li>');
    $("[new=" + timestamp + "]").slideDown("normal", function () {
        //暂时不移除次属性
        // $("[new=" + timestamp + "]").removeAttr("new");
    });
    $(obj).val("");
//    发送到服务器保存
    $.post(AddURL, getParameter({content:content}), function (json) {
        if (json.status) {
            $("[new=" + timestamp + "]").attr("id", "todo_" + json.data);
            $("[new=" + timestamp + "]").attr("data-id", json.data);
            //此处移除new属性
            $("[new=" + timestamp + "]").removeAttr("new");
            //更新图标的统计
            updateCount();
        } else {
            msg(json.data);
        }
    });
}

/**
 *保存修改
 * @param obj
 */
function saveModify(obj) {
    $(obj).removeClass("edit");
    $(obj).removeAttr("contenteditable");
    $(obj).blur();
    var todo_id = $(obj).attr("data-id");
    //没有id就不操作
    if (todo_id) {
        contentVal = $(obj).html();
        $.post(ModifyURL, getParameter({todo_id:todo_id, content:contentVal}), function (json) {
            if (json.status) {
                ;
            } else {
                msg(json.data);
            }
        })
    }
}

/**
 * 完成操作
 * @param obj
 */
function finish(obj) {
    $(obj).addClass("finish");

    var todo_id = $(obj).attr("data-id");
    //没有id就不操作
    if (todo_id) {
        $.post(FinishURL, getParameter({todo_id:todo_id}), function (json) {
            if (json.status) {
                //更新图标的统计
                updateCount();
            } else {
                msg(json.data);
            }
        });
    }
}

/**
 * 解除完成状态
 * @param obj
 */
function unFinish(obj) {
    $(obj).removeClass("finish");

    var todo_id = $(obj).attr("data-id");
    //没有id就不操作
    if (todo_id) {
        $.post(UnFinishURL, getParameter({todo_id:todo_id}), function (json) {
            if (json.status) {
                //更新图标的统计
                updateCount();
            } else {
                msg(json.data);
            }
        });
    }
}
/**
 * 移除操作
 * @param obj
 */
function remove(obj) {
    $(obj).animate({marginLeft:"310px", height:"0", padding:"0 10px"}, "fast", function () {
        $(obj).remove();
    });

    var todo_id = $(obj).attr("data-id");
    //没有id就不操作
    if (todo_id) {
        $.post(RemoveURL, getParameter({todo_id:todo_id}), function (json) {
            if (json.status) {
                updateCount();
            } else {
                msg(json.data);
            }
        });
    }
}

/**
 *修改密码
 */

function setPassword(newPsw) {
    msg("寻找一个加密ssid的方法中……");
}


/**
 * 手动排序处理
 * @param event
 * @param ui
 */
function todoSort(event, ui) {
    var drop_id = ui.item.attr("data-id");
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
        $.post(SortURL, getParameter({drop_id:drop_id, drop_sort:drop_sort, drop_sort_s:drop_sort_s}),
            function (json) {
                if (json.status) {
                    ;
                } else {
                    msg(json.data);
                }
            });
    }
}